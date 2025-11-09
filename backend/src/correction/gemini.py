import os
import re
import json
import time
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import google.generativeai as genai

# =========================
# Configuração
# =========================
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não encontrada no arquivo .env")

genai.configure(api_key=GEMINI_API_KEY)

# Usando gemini-2.5-flash: rápido, eficiente e com ótima qualidade
MODEL_STRUCT = "gemini-2.5-flash"
MODEL_EVAL = "gemini-2.5-flash"

# Temperaturas: baixa para previsibilidade e JSON consistente
GEN_CONFIG_JSON = {
    "temperature": 0.2,
    "response_mime_type": "application/json",
}


# =========================
# Helpers Gerais
# =========================
def _extract_json(text: str) -> Any:
    """Extrai JSON de uma string. Tenta json.loads direto; se falhar, usa regex no primeiro bloco {...}."""
    text = text.strip()
    # remove cercas de código se existirem
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    try:
        return json.loads(text)
    except Exception:
        pass

    # fallback: pega o primeiro bloco {...} balanceado simples
    match = re.search(r'\{.*\}', text, flags=re.DOTALL)
    if match:
        candidate = match.group(0)
        try:
            return json.loads(candidate)
        except Exception:
            pass
    raise ValueError("Falha ao extrair JSON do retorno do modelo.")


def _gemini_generate_json(
    model_name: str,
    system_instruction: Optional[str],
    user_prompt: str,
    max_retries: int = 3,
    backoff_sec: float = 1.2,
) -> Any:
    """
    Faz uma chamada ao Gemini esperando JSON e retorna objeto Python.
    Força MIME de resposta em JSON e aplica retries com backoff exponencial.
    """
    model = genai.GenerativeModel(model_name, system_instruction=system_instruction) if system_instruction \
        else genai.GenerativeModel(model_name)

    last_err = None
    for attempt in range(1, max_retries + 1):
        try:
            resp = model.generate_content(
                user_prompt,
                generation_config=GEN_CONFIG_JSON,
            )
            # Em SDKs recentes, JSON vem em resp.text mesmo com mime JSON.
            return _extract_json(resp.text)
        except Exception as e:
            last_err = e
            if attempt < max_retries:
                time.sleep(backoff_sec * attempt)
            else:
                raise last_err


def _round_to_step(value: float, step: float, max_score: float) -> float:
    """Arredonda a 'step' e limita ao intervalo [0, max_score]."""
    if value is None:
        value = 0.0
    rounded = round(float(value) / step) * step
    # pequena correção de flutuação
    rounded = float(f"{rounded:.2f}")
    if rounded < 0:
        rounded = 0.0
    if rounded > max_score:
        rounded = float(max_score)
    return rounded


# =========================
# 1) Parsing do OCR
# =========================
def parse_ocr_text(ocr_text: str) -> str:
    """
    Usa a LLM para limpar o texto OCR de ruídos e normalizações.
    Remove cabeçalhos, rodapés, números de página e outros elementos não relevantes.
    Corrige hifenização e problemas de OCR, mas mantém a estrutura original do conteúdo.
    
    Args:
        ocr_text: Texto bruto extraído do OCR
        
    Returns:
        Texto limpo como string única (não segmentado)
    """
    if not ocr_text or not ocr_text.strip():
        return ""
    
    # Pré-processamento básico (universal e rápido)
    text = ocr_text.strip()
    
    # Normaliza hifenização óbvia
    text = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', text)
    
    # Compacta espaços excessivos
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{4,}', '\n\n\n', text)  # Limita a 3 quebras
    
    # Usa LLM para limpeza inteligente
    system_instruction = (
        "Você é um assistente especializado em limpeza de texto OCR de provas escolares. "
        "Seu trabalho é remover ruídos mantendo TODO o conteúdo das questões e respostas."
    )
    
    user_prompt = {
        "tarefa": "Limpar texto OCR mantendo questões e respostas intactas",
        "instrucoes": [
            "MANTENHA todo o conteúdo de questões e respostas dos alunos.",
            "REMOVA: números de página, cabeçalhos (Nome, Data, Turma, Matrícula), rodapés, marcas d'água.",
            "CORRIJA: palavras quebradas por hífen, caracteres OCR mal interpretados, espaçamentos estranhos.",
            "PRESERVE: a estrutura original, numeração de questões, formatação de respostas.",
            "NÃO adicione ou modifique conteúdo - apenas limpe ruídos técnicos."
        ],
        "texto_ocr": text,
        "formato_saida": {
            "texto_limpo": "string com o texto processado"
        }
    }
    
    try:
        result = _gemini_generate_json(
            model_name=MODEL_STRUCT,
            system_instruction=system_instruction,
            user_prompt=json.dumps(user_prompt, ensure_ascii=False),
        )
        
        cleaned_text = result.get("texto_limpo", "").strip()
        
        # Fallback: se o retorno estiver vazio ou muito pequeno, retorna o original pré-processado
        if not cleaned_text or len(cleaned_text) < len(text) * 0.3:
            return text
            
        return cleaned_text
        
    except Exception as e:
        print(f"Aviso: Erro na limpeza com LLM. Usando texto pré-processado. Erro: {e}")
        return text


# =========================
# 2) Estruturação (OCR -> JSON)
# =========================
def _gerar_id_questao(questao: Dict[str, Any]) -> str:
    """
    Gera um ID único para a questão usando número + letra (se existir).
    Exemplo: "1-a", "1-b", "2" (se não tiver letra)
    """
    numero = questao.get("numero", "")
    letra = questao.get("letra", "").lower().strip()
    
    if letra:
        return f"{numero}-{letra}"
    return str(numero)


def structure_exam_json(cleaned_text: str, registered_questions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Usa LLM para identificar, segmentar e associar respostas do OCR às perguntas discursivas.
    A LLM faz TODO o trabalho de estruturação: identificação de questões, segmentação e associação.
    Retorna somente questões discursivas.
    
    Args:
        cleaned_text: Texto limpo do OCR (string única)
        registered_questions: Lista com metadados das questões da prova
        
    Returns:
        JSON estruturado com questões discursivas e respostas dos alunos
    """
    discursive_questions = [q for q in registered_questions if q.get("tipo", "").lower() == "discursiva"]
    if not discursive_questions:
        return {"questoes": []}

    # Cria mapa de questões por ID único para facilitar busca
    questoes_map = {_gerar_id_questao(q): q for q in discursive_questions}

    system_instruction = (
        "Você é um agente de estruturação de respostas de prova. "
        "Você sempre retorna JSON válido e nada além de JSON."
    )

    user_prompt = {
        "tarefa": "Identificar, segmentar e associar respostas do aluno às questões discursivas registradas.",
        "instrucoes": [
            "IDENTIFIQUE as questões no texto OCR (podem ter vários formatos: 'Questão 1', '1)', 'a)', '1-a)', etc).",
            "ATENÇÃO: Se a questão tiver número E letra (ex: '1-a', '1-b'), use AMBOS para identificar corretamente.",
            "SEGMENTE as respostas de cada questão corretamente.",
            "ASSOCIE cada resposta à questão correspondente usando número E letra (se existir).",
            "MANTENHA o texto original do aluno; corrija apenas erros técnicos de OCR.",
            "Se não encontrar resposta para alguma questão registrada, use string vazia em 'resposta_aluno'.",
            "IGNORE questões objetivas (múltipla escolha, verdadeiro/falso).",
            "Retorne APENAS JSON no formato especificado."
        ],
        "formato_saida": {
            "questoes": [
                {
                    "numero": "int - número da questão",
                    "letra": "string opcional - letra da alternativa (a, b, c, etc)",
                    "tipo": "discursiva",
                    "pergunta": "string",
                    "nota_maxima": "float",
                    "resposta_aluno": "string"
                }
            ]
        },
        "questoes_registradas_discursivas": discursive_questions,
        "texto_ocr_limpo": cleaned_text
    }

    try:
        result = _gemini_generate_json(
            model_name=MODEL_STRUCT,
            system_instruction=system_instruction,
            user_prompt=json.dumps(user_prompt, ensure_ascii=False),
        )
        # Validação mínima
        if not isinstance(result, dict) or "questoes" not in result:
            raise ValueError("JSON inválido: campo 'questoes' ausente.")
        
        questoes_estruturadas = []
        for q in result["questoes"]:
            # Gera ID da questão retornada pela LLM
            q_id = _gerar_id_questao(q)
            
            # Busca a questão registrada correspondente
            rq = questoes_map.get(q_id)
            
            if rq:
                # Usa os metadados originais como fonte de verdade
                questao_estruturada = {
                    "numero": rq["numero"],
                    "letra": rq.get("letra", ""),
                    "tipo": "discursiva",
                    "pergunta": rq["pergunta"],
                    "nota_maxima": rq["nota_maxima"],
                    "resposta_aluno": q.get("resposta_aluno", "").strip() or ""
                }
                questoes_estruturadas.append(questao_estruturada)
            else:
                # Se não encontrou correspondência, tenta buscar apenas por número
                # (para compatibilidade com questões sem letra)
                numero = q.get("numero")
                rq_por_numero = next((x for x in discursive_questions if x["numero"] == numero and not x.get("letra")), None)
                if rq_por_numero:
                    questao_estruturada = {
                        "numero": rq_por_numero["numero"],
                        "letra": "",
                        "tipo": "discursiva",
                        "pergunta": rq_por_numero["pergunta"],
                        "nota_maxima": rq_por_numero["nota_maxima"],
                        "resposta_aluno": q.get("resposta_aluno", "").strip() or ""
                    }
                    questoes_estruturadas.append(questao_estruturada)
        
        # Garante que todas as questões discursivas estejam presentes
        questoes_ids_encontradas = {_gerar_id_questao(q) for q in questoes_estruturadas}
        for q in discursive_questions:
            q_id = _gerar_id_questao(q)
            if q_id not in questoes_ids_encontradas:
                questoes_estruturadas.append({
                    "numero": q["numero"],
                    "letra": q.get("letra", ""),
                    "tipo": "discursiva",
                    "pergunta": q["pergunta"],
                    "nota_maxima": q["nota_maxima"],
                    "resposta_aluno": ""
                })
        
        return {"questoes": questoes_estruturadas}

    except Exception as e:
        print(f"Erro na estruturação: {e}")
        # Fallback coerente: devolve esqueleto com respostas vazias
        return {
            "questoes": [
                {
                    "numero": q["numero"],
                    "letra": q.get("letra", ""),
                    "tipo": "discursiva",
                    "pergunta": q["pergunta"],
                    "nota_maxima": q["nota_maxima"],
                    "resposta_aluno": ""
                }
                for q in discursive_questions
            ]
        }


# =========================
# 3) Correção (JSON -> notas + análise)
# =========================
def evaluate_answer(
    student_answer: str,
    expected_answer: str,
    max_score: float,
    question_text: str = "",
    step: float = 0.5,
) -> Dict[str, Any]:
    """
    Avalia a resposta do aluno em relação ao gabarito.
    - Retorna nota em passos (ex.: 0.5) e análise curta.
    """
    if not student_answer or not student_answer.strip():
        return {"nota": 0.0, "analise": "Resposta em branco ou não identificada."}

    system_instruction = (
        "Você é um professor corrigindo respostas discursivas. "
        "Retorne APENAS JSON válido."
    )
    user_prompt = {
        "pergunta": question_text or "Não especificada",
        "resposta_esperada": expected_answer,
        "resposta_aluno": student_answer,
        "nota_maxima": max_score,
        "criterios": [
            "Correção conceitual",
            "Completude",
            "Coerência e clareza"
        ],
        "tarefa": (
            f"Atribua uma nota de 0 a {max_score} e uma análise breve (1-2 frases). "
            "A análise deve justificar objetivamente a pontuação."
        ),
        "formato_saida": {"nota": "float", "analise": "string"}
    }

    try:
        result = _gemini_generate_json(
            model_name=MODEL_EVAL,
            system_instruction=system_instruction,
            user_prompt=json.dumps(user_prompt, ensure_ascii=False),
        )
        # Sanitização da nota
        raw_score = float(result.get("nota", 0.0))
        score = _round_to_step(raw_score, step=step, max_score=max_score)
        analysis = (result.get("analise") or "").strip()
        if not analysis:
            analysis = "Avaliação automática sem justificativa detalhada."
        return {"nota": score, "analise": analysis}

    except Exception as e:
        return {"nota": 0.0, "analise": f"Erro na avaliação automática: {str(e)}"}


def evaluate_exam(structured_exam: Dict[str, Any], answer_key: List[Dict[str, Any]], step: float = 0.5) -> Dict[str, Any]:
    """
    Itera sobre as questões discursivas e aplica evaluate_answer em cada uma.
    Retorna questões corrigidas e a nota total.
    Usa ID único (número + letra) para garantir alinhamento correto.
    """
    questoes_corrigidas = []
    nota_total = 0.0

    # Mapa do gabarito por ID único (número + letra)
    answer_map = {_gerar_id_questao(item): item for item in answer_key}

    for q in structured_exam.get("questoes", []):
        if str(q.get("tipo", "")).lower() != "discursiva":
            continue

        # Gera ID único da questão
        q_id = _gerar_id_questao(q)
        numero = q["numero"]
        letra = q.get("letra", "")
        student_answer = q.get("resposta_aluno", "") or ""
        max_score = float(q.get("nota_maxima", 0.0))
        question_text = q.get("pergunta", "")

        # Busca gabarito usando ID único
        gabarito_item = answer_map.get(q_id)
        
        # Fallback: tenta buscar apenas por número (compatibilidade)
        if not gabarito_item:
            gabarito_item = next((item for item in answer_key if item.get("numero") == numero and not item.get("letra")), None)
        
        if not gabarito_item:
            questoes_corrigidas.append({
                "numero": numero,
                "letra": letra,
                "nota": 0.0,
                "analise": f"Gabarito não encontrado para questão {numero}{'-' + letra if letra else ''}."
            })
            continue

        esperado = gabarito_item.get("resposta_esperada", "")
        if not esperado:
            questoes_corrigidas.append({
                "numero": numero,
                "letra": letra,
                "nota": 0.0,
                "analise": f"Resposta esperada não encontrada no gabarito para questão {numero}{'-' + letra if letra else ''}."
            })
            continue

        aval = evaluate_answer(
            student_answer=student_answer,
            expected_answer=esperado,
            max_score=max_score,
            question_text=question_text,
            step=step,
        )

        questoes_corrigidas.append({
            "numero": numero,
            "letra": letra,
            "nota": aval["nota"],
            "analise": aval["analise"]
        })
        nota_total += float(aval["nota"])

    return {
        "questoes_corrigidas": questoes_corrigidas,
        "nota_total": float(f"{nota_total:.2f}")
    }


# =========================
# Exemplo de uso manual
# =========================
if __name__ == "__main__":
    print("✅ Módulo gemini.py carregado com sucesso!")
    print(f"🔑 API Key configurada: {'Sim' if GEMINI_API_KEY else 'Não'}")
    print(f"📦 Modelos: {MODEL_STRUCT} (estruturação), {MODEL_EVAL} (avaliação)")
    print("\n💡 Para exemplos de uso, execute: python exemplo_uso_gemini.py")
