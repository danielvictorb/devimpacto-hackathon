"""
Exemplo de uso do pipeline de correção automática com LLM.
Este arquivo demonstra o fluxo completo: OCR → Estruturação → Correção
"""

from gemini import parse_ocr_text, structure_exam_json, evaluate_exam

# =========================
# Dados de Exemplo
# =========================

# Simulação de texto OCR bruto (com ruídos típicos)
texto_ocr_bruto = """
Nome: João Silva        Data: 15/03/2024
Matrícula: 12345       Turma: 3º A
Página 1 de 2

Avaliação de Biologia

Questão 1: Explique o que é fotossín-
tese e sua importância para os seres vivos.

Resposta: A fotossíntese é o proces-
so onde as plantas usam luz solar
para produzir energia. É importante
porque produz oxigênio que nós res-
piramos.

2) O que são células eucarióticas?

As células eucarióticas são células
que têm núcleo definido e organe-
las envoltas por membranas, como
mitocôndrias.

Questão 3) Marque V ou F:
( V ) Plantas são seres autotróficos
( F ) Bactérias são eucarióticas

Página 2 de 2
"""

# Questões registradas no sistema
questoes_registradas = [
    {
        "numero": 1,
        "pergunta": "Explique o que é fotossíntese e sua importância para os seres vivos.",
        "tipo": "discursiva",
        "nota_maxima": 2.0
    },
    {
        "numero": 2,
        "pergunta": "O que são células eucarióticas?",
        "tipo": "discursiva",
        "nota_maxima": 2.0
    },
    {
        "numero": 3,
        "pergunta": "Marque V ou F sobre seres vivos\n( ) Plantas são seres autotróficos\n( ) Bactérias são eucarióticas",
        "tipo": "objetiva",  # Esta será ignorada
        "nota_maxima": 1.0
    }
]

# Gabarito (respostas esperadas)
gabarito = [
    {
        "numero": 1,
        "resposta_esperada": "Fotossíntese é o processo realizado por plantas, algas e algumas bactérias que converte luz solar, água e gás carbônico em glicose (energia) e oxigênio. É fundamental pois produz oxigênio para a respiração e é a base da cadeia alimentar."
    },
    {
        "numero": 2,
        "resposta_esperada": "Células eucarióticas são células que possuem núcleo celular delimitado por membrana nuclear, além de organelas membranosas como mitocôndrias, retículo endoplasmático e complexo de Golgi. Estão presentes em animais, plantas, fungos e protozoários."
    }
]


# =========================
# Pipeline Completo
# =========================

def executar_pipeline_completo():
    """Demonstra o uso completo do pipeline de correção."""
    
    print("=" * 70)
    print("PIPELINE DE CORREÇÃO AUTOMÁTICA COM LLM")
    print("=" * 70)
    
    # ETAPA 1: Limpeza do OCR
    print("\n📄 ETAPA 1: Limpeza do texto OCR")
    print("-" * 70)
    print("Texto original (com ruídos):")
    print(texto_ocr_bruto[:200] + "...")
    
    texto_limpo = parse_ocr_text(texto_ocr_bruto)
    print(f"\n✅ Texto limpo gerado ({len(texto_limpo)} caracteres)")
    print("Amostra:", texto_limpo[:200] + "...")
    
    # ETAPA 2: Estruturação
    print("\n🏗️  ETAPA 2: Estruturação em JSON")
    print("-" * 70)
    
    prova_estruturada = structure_exam_json(texto_limpo, questoes_registradas)
    print(f"✅ {len(prova_estruturada['questoes'])} questões discursivas estruturadas")
    
    for q in prova_estruturada['questoes']:
        print(f"\nQuestão {q['numero']}: {q['pergunta'][:50]}...")
        print(f"Resposta do aluno: {q['resposta_aluno'][:100]}...")
    
    # ETAPA 3: Correção
    print("\n🧮 ETAPA 3: Correção automática")
    print("-" * 70)
    
    resultado_correcao = evaluate_exam(prova_estruturada, gabarito, step=0.5)
    
    print(f"\n📊 RESULTADO FINAL")
    print("=" * 70)
    
    for qc in resultado_correcao['questoes_corrigidas']:
        print(f"\nQuestão {qc['numero']}")
        print(f"  Nota: {qc['nota']:.1f}")
        print(f"  Análise: {qc['analise']}")
    
    print(f"\n{'=' * 70}")
    print(f"NOTA TOTAL: {resultado_correcao['nota_total']:.1f}")
    print(f"{'=' * 70}")
    
    return resultado_correcao


# =========================
# Teste Individual
# =========================

def testar_parse_ocr():
    """Testa apenas a função de limpeza do OCR."""
    print("\n🧪 Testando parse_ocr_text...")
    texto_limpo = parse_ocr_text(texto_ocr_bruto)
    print(f"Texto limpo:\n{texto_limpo}\n")


def testar_structure():
    """Testa apenas a estruturação."""
    print("\n🧪 Testando structure_exam_json...")
    # Primeiro limpa
    texto_limpo = parse_ocr_text(texto_ocr_bruto)
    # Depois estrutura
    estruturado = structure_exam_json(texto_limpo, questoes_registradas)
    
    import json
    print(json.dumps(estruturado, indent=2, ensure_ascii=False))


# =========================
# Execução
# =========================

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "completo":
        executar_pipeline_completo()
    elif len(sys.argv) > 1 and sys.argv[1] == "parse":
        testar_parse_ocr()
    elif len(sys.argv) > 1 and sys.argv[1] == "structure":
        testar_structure()
    else:
        print("\nUso:")
        print("  python exemplo_uso_gemini.py completo    - Executa pipeline completo")
        print("  python exemplo_uso_gemini.py parse       - Testa apenas limpeza OCR")
        print("  python exemplo_uso_gemini.py structure   - Testa apenas estruturação")
        print("\nExecutando pipeline completo por padrão...\n")
        executar_pipeline_completo()

