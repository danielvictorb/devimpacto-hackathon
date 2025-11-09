"""
Exemplo de uso do pipeline de correção automática para prova sobre bilhete.
Este exemplo demonstra o fluxo completo: OCR → Estruturação → Correção
usando a prova real mostrada nas imagens.
"""

import sys
import os
from pathlib import Path

# Adiciona o diretório models ao path para importar os módulos
sys.path.insert(0, str(Path(__file__).parent))

from google_vision import transcrever_diretorio
from gemini import parse_ocr_text, structure_exam_json, evaluate_exam


# =========================
# Configuração da Prova
# =========================

# Gabarito unificado com todas as informações das questões
gabarito = [
    {
        "numero": 1,
        "letra": "a",
        "pergunta": "Quem escreveu o bilhete acima? \n () Fábio \n () Mamãe",
        "tipo": "objetiva",  # Será ignorada na correção
        "nota_maxima": 1.0,
        "resposta_esperada": Mamãe  # Questões objetivas não têm resposta esperada no gabarito
    },
    {
        "numero": 1,
        "letra": "b",
        "pergunta": "Para quem foi escrito? \n () Mamãe \n () Maria \n () Fábio",
        "tipo": "objetiva",  # Será ignorada na correção
        "nota_maxima": 1.0,
        "resposta_esperada": None  # Questões objetivas não têm resposta esperada no gabarito
    },
    {
        "numero": 1,
        "letra": "c",
        "pergunta": "O que a mãe de Fábio foi fazer no shopping?",
        "tipo": "discursiva",
        "nota_maxima": 2.0,
        "resposta_esperada": "A mãe foi ao shopping trocar o celular do Fábio."
    },
    {
        "numero": 1,
        "letra": "d",
        "pergunta": "Que pedido tem o bilhete?",
        "tipo": "discursiva",
        "nota_maxima": 2.0,
        "resposta_esperada": "O pedido é para Fábio arrumar o quarto ao se levantar."
    },
    {
        "numero": 1,
        "letra": "e",
        "pergunta": "Em que data foi escrito?",
        "tipo": "discursiva",
        "nota_maxima": 1.0,
        "resposta_esperada": "11/03/2009"
    },
    {
        "numero": 1,
        "letra": "f",
        "pergunta": "Você já escreveu ou recebeu algum bilhete?",
        "tipo": "discursiva",
        "nota_maxima": 1.0,
        "resposta_esperada": "Resposta pessoal do aluno. Aceitar 'Sim' ou 'Não' com ou sem justificativa."
    }
]


# =========================
# Funções Auxiliares
# =========================

def extrair_questoes_registradas(gabarito_unificado):
    """
    Extrai questões registradas do gabarito unificado (remove resposta_esperada).
    Usado para passar para structure_exam_json.
    """
    return [
        {k: v for k, v in q.items() if k != "resposta_esperada"}
        for q in gabarito_unificado
    ]


def filtrar_gabarito_discursivas(gabarito_unificado):
    """
    Filtra apenas questões discursivas com resposta_esperada do gabarito.
    Usado para passar para evaluate_exam.
    """
    return [
        q for q in gabarito_unificado 
        if q.get("tipo", "").lower() == "discursiva" and q.get("resposta_esperada")
    ]


# =========================
# Pipeline Completo
# =========================

def executar_pipeline_completo(diretorio_temp: str = "backend/src/temp"):
    """
    Demonstra o uso completo do pipeline de correção com OCR real.
    
    Args:
        diretorio_temp: Diretório contendo as imagens da prova
    """
    
    print("=" * 70)
    print("PIPELINE DE CORREÇÃO AUTOMÁTICA - PROVA DO BILHETE")
    print("=" * 70)
    
    # ETAPA 0: OCR das imagens
    print("\n📸 ETAPA 0: OCR das imagens")
    print("-" * 70)
    
    if not os.path.exists(diretorio_temp):
        print(f"❌ Diretório não encontrado: {diretorio_temp}")
        print("\n💡 Instruções:")
        print("   1. Crie o diretório: backend/src/temp")
        print("   2. Coloque as imagens da prova nesse diretório")
        print("   3. Execute novamente este script")
        return None
    
    try:
        texto_ocr_bruto = transcrever_diretorio(diretorio_temp)
        
        if not texto_ocr_bruto:
            print("❌ Nenhum texto foi extraído das imagens")
            return None
            
        print(f"\n✅ OCR completo: {len(texto_ocr_bruto)} caracteres")
        print("\nPrévia do texto OCR:")
        print("-" * 70)
        print(texto_ocr_bruto[:500] + "..." if len(texto_ocr_bruto) > 500 else texto_ocr_bruto)
        
    except Exception as e:
        print(f"❌ Erro no OCR: {e}")
        return None
    
    # ETAPA 1: Limpeza do OCR
    print("\n\n📄 ETAPA 1: Limpeza e normalização do texto OCR")
    print("-" * 70)
    
    try:
        texto_limpo = parse_ocr_text(texto_ocr_bruto)
        print(f"✅ Texto limpo gerado ({len(texto_limpo)} caracteres)")
        print("\nAmostra do texto limpo:")
        print("-" * 70)
        print(texto_limpo[:400] + "..." if len(texto_limpo) > 400 else texto_limpo)
    except Exception as e:
        print(f"❌ Erro na limpeza: {e}")
        texto_limpo = texto_ocr_bruto
    
    # ETAPA 2: Estruturação
    print("\n\n🏗️  ETAPA 2: Estruturação em JSON")
    print("-" * 70)
    
    try:
        questoes_registradas = extrair_questoes_registradas(gabarito)
        prova_estruturada = structure_exam_json(texto_limpo, questoes_registradas)
        print(f"✅ {len(prova_estruturada['questoes'])} questões discursivas estruturadas")
        
        for q in prova_estruturada['questoes']:
            letra_str = f"-{q.get('letra', '')}" if q.get('letra') else ""
            print(f"\n📝 Questão {q['numero']}{letra_str}: {q['pergunta']}")
            resposta = q['resposta_aluno']
            if resposta:
                print(f"   Resposta: {resposta[:100]}{'...' if len(resposta) > 100 else ''}")
            else:
                print(f"   Resposta: [VAZIA]")
                
    except Exception as e:
        print(f"❌ Erro na estruturação: {e}")
        return None
    
    # ETAPA 3: Correção
    print("\n\n🧮 ETAPA 3: Correção automática")
    print("-" * 70)
    
    try:
        gabarito_discursivas = filtrar_gabarito_discursivas(gabarito)
        resultado_correcao = evaluate_exam(prova_estruturada, gabarito_discursivas, step=0.5)
        
        print(f"\n{'=' * 70}")
        print("📊 RESULTADO FINAL DA CORREÇÃO")
        print(f"{'=' * 70}")
        
        for qc in resultado_correcao['questoes_corrigidas']:
            letra_str = f"-{qc.get('letra', '')}" if qc.get('letra') else ""
            print(f"\n📌 Questão {qc['numero']}{letra_str}")
            print(f"   Nota: {qc['nota']:.1f}")
            print(f"   Análise: {qc['analise']}")
        
        print(f"\n{'=' * 70}")
        print(f"🎯 NOTA TOTAL: {resultado_correcao['nota_total']:.1f}")
        print(f"{'=' * 70}")
        
        return resultado_correcao
        
    except Exception as e:
        print(f"❌ Erro na correção: {e}")
        import traceback
        traceback.print_exc()
        return None


# =========================
# Modo simulação (sem OCR)
# =========================

def executar_pipeline_simulado():
    """
    Executa o pipeline com dados simulados (sem precisar de OCR).
    Útil para testar o pipeline de correção sem as imagens.
    """
    
    print("=" * 70)
    print("PIPELINE DE CORREÇÃO (MODO SIMULAÇÃO)")
    print("=" * 70)
    
    # Simulação do texto OCR já extraído
    texto_ocr_simulado = """
    ATIVIDADE DE PORTUGUÊS - EAD
    SÉRIE: 2° ANO
    
    BILHETE É UMA MENSAGEM CURTA QUE TRAZ ALGUMA INFORMAÇÃO.
    
    Fábio
    11/03/2009
    Fui ao shopping trocar meu celular.
    Ao se levantar, por favor, arrume o seu quarto.
    Beijão...
    Mamãe
    
    Responda:
    
    a) Quem escreveu o bilhete acima?
    ( ) Fábio
    (X) Mamãe
    
    b) Para quem foi escrito?
    ( ) Mamãe ( ) Maria (X) Fábio
    
    c) O que a mãe de Fábio foi fazer no shopping?
    trocar o celular.
    
    d) Que pedido tem o bilhete?
    Fábio deve arrumar o quarto ao se levantar.
    
    e) Em que data foi escrito?
    11/03/2009
    
    f) Você já escreveu ou recebeu algum bilhete?
    Sim
    """
    
    print("\n📄 ETAPA 1: Limpeza do texto OCR")
    print("-" * 70)
    texto_limpo = parse_ocr_text(texto_ocr_simulado)
    print(f"✅ Texto limpo ({len(texto_limpo)} caracteres)")
    
    print("\n🏗️  ETAPA 2: Estruturação em JSON")
    print("-" * 70)
    questoes_registradas = extrair_questoes_registradas(gabarito)
    prova_estruturada = structure_exam_json(texto_limpo, questoes_registradas)
    print(f"✅ {len(prova_estruturada['questoes'])} questões estruturadas")
    
    for q in prova_estruturada['questoes']:
        letra_str = f"-{q.get('letra', '')}" if q.get('letra') else ""
        print(f"\nQuestão {q['numero']}{letra_str}: {q['pergunta'][:50]}...")
        print(f"Resposta: {q['resposta_aluno'][:80]}..." if q['resposta_aluno'] else "Resposta: [VAZIA]")
    
    print("\n🧮 ETAPA 3: Correção automática")
    print("-" * 70)
    gabarito_discursivas = filtrar_gabarito_discursivas(gabarito)
    resultado_correcao = evaluate_exam(prova_estruturada, gabarito_discursivas, step=0.5)
    
    print(f"\n{'=' * 70}")
    print("📊 RESULTADO FINAL")
    print(f"{'=' * 70}")
    
    for qc in resultado_correcao['questoes_corrigidas']:
        letra_str = f"-{qc.get('letra', '')}" if qc.get('letra') else ""
        print(f"\nQuestão {qc['numero']}{letra_str}")
        print(f"  Nota: {qc['nota']:.1f}")
        print(f"  Análise: {qc['analise']}")
    
    print(f"\n{'=' * 70}")
    print(f"NOTA TOTAL: {resultado_correcao['nota_total']:.1f}")
    print(f"{'=' * 70}")
    
    return resultado_correcao


# =========================
# Execução
# =========================

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "simulado":
            print("\n🎭 Executando em modo SIMULADO (sem OCR real)\n")
            executar_pipeline_simulado()
        else:
            # Diretório customizado
            diretorio = sys.argv[1]
            executar_pipeline_completo(diretorio)
    else:
        print("\n📋 Modos de execução disponíveis:")
        print("=" * 70)
        print("1. Com OCR real:")
        print("   python exemplo_prova_bilhete.py backend/src/temp")
        print("\n2. Modo simulado (sem imagens):")
        print("   python exemplo_prova_bilhete.py simulado")
        print("\n3. Padrão (tenta backend/src/temp):")
        print("   python exemplo_prova_bilhete.py")
        print("=" * 70)
        
        print("\n\n▶️  Executando modo padrão...\n")
        executar_pipeline_completo()

