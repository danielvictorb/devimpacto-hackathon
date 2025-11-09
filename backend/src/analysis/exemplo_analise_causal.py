"""
Exemplo de uso do módulo de análise causal
"""
import json
import sys
from pathlib import Path

# Adicionar caminho do src ao path
sys.path.append(str(Path(__file__).parent.parent))

from analysis.causal_analysis import (
    analyze_causal_factors,
    load_dashboard_from_file,
    extract_relevant_data
)


def exemplo_analise_turma():
    """Exemplo: Análise de todas as turmas"""
    print("=" * 60)
    print(" EXEMPLO: Análise Causal de TODAS as Turmas")
    print("=" * 60)
    
    # Caminho do arquivo de dashboard
    dashboard_path = Path(__file__).parent.parent.parent / "utils" / "dados_dashboard.json"
    
    if not dashboard_path.exists():
        print(f" Arquivo não encontrado: {dashboard_path}")
        print(" Execute primeiro o treinamento do modelo para gerar o dashboard.")
        return
    
    try:
        # Carregar dados
        print(f"\n Carregando dados de: {dashboard_path}")
        dashboard_data = load_dashboard_from_file(str(dashboard_path))
        print(f" Dados carregados: {dashboard_data['metadata']['total_alunos']} alunos")
        
        # Análise de TODAS as turmas
        turma = None  # None = analisa todas as turmas
        formato_relatorio = True  # True = gera relatório para diretor escolar (processa turma por turma)
        
        print(f"\n Realizando análise causal de TODAS as turmas...")
        if formato_relatorio:
            print(" Formato: Relatório para Diretor Escolar (processamento turma por turma)")
        print(" Isso pode levar alguns segundos...")
        
        resultado = analyze_causal_factors(dashboard_data, turma=turma, formato_relatorio=formato_relatorio)
        
        # Exibir resumo
        print("\n" + "=" * 60)
        print(" RESULTADO DA ANÁLISE")
        print("=" * 60)
        
        # Mostrar informações do metadata
        metadata = resultado.get("metadata", {})
        print(f"\n TURMAS ANALISADAS: {metadata.get('total_turmas', 0)}")
        print(f" TOTAL DE ALUNOS: {metadata.get('total_alunos', 0)}")
        print(f" FORMATO: {metadata.get('formato', 'N/A')}")
        
        if formato_relatorio:
            # Formato de relatório para diretor escolar
            parte_1 = resultado.get("parte_1_analise_geral", {})
            analise_geral = parte_1.get("analise_geral_alunos", {})
            
            print("\n" + "=" * 60)
            print(" PARTE 1: ANÁLISE GERAL")
            print("=" * 60)
            
            print("\n RESUMO ESTATÍSTICO:")
            print(analise_geral.get("resumo_estatistico", "N/A")[:300] + "...")
            
            print("\n PADRÕES GERAIS:")
            print(analise_geral.get("padroes_gerais", "N/A")[:300] + "...")
            
            plano_acao = parte_1.get("plano_acao_geral", [])
            print(f"\n PLANO DE AÇÃO GERAL ({len(plano_acao)} ações):")
            for acao in plano_acao[:5]:
                print(f"  {acao.get('acao_numero', '?')}. {acao.get('titulo', 'N/A')}")
                print(f"     Tipo: {acao.get('tipo', 'N/A')} | Prazo: {acao.get('prazo', 'N/A')}")
            
            parte_2 = resultado.get("parte_2_analise_por_turma", [])
            print(f"\n PARTE 2: ANÁLISE POR TURMA ({len(parte_2)} turmas)")
            for turma_analise in parte_2[:3]:
                print(f"\n   Turma {turma_analise.get('turma', 'N/A')}:")
                sintese = turma_analise.get("analise_plano_acao", {}).get("sintese_desempenho", "N/A")
                print(f"     {sintese[:150]}...")
        else:
            # Formato antigo (análise causal)
            analise_geral = resultado.get("analise_geral_turma", {})
            print("\n RESUMO EXECUTIVO:")
            print(analise_geral.get("resumo_executivo", "N/A")[:300] + "...")
            
            print("\n PRINCIPAIS FATORES CAUSAIS:")
            for fator in analise_geral.get("principais_fatores_causais", [])[:5]:
                print(f"  • {fator.get('fator')}: {fator.get('impacto')[:80]}... (Magnitude: {fator.get('magnitude')})")
            
            print("\n ANÁLISE POR CLUSTER:")
            total_clusters = len(resultado.get("analise_por_cluster", []))
            print(f"  Total de clusters analisados: {total_clusters}")
            for cluster_analise in resultado.get("analise_por_cluster", [])[:5]:
                turma_cluster = cluster_analise.get('turma', 'N/A')
                cluster_id = cluster_analise.get('cluster_id', 'N/A')
                print(f"\n  Turma {turma_cluster} - Cluster {cluster_id}:")
                print(f"    {cluster_analise.get('resumo_cluster', 'N/A')[:100]}...")
                print(f"    Ações recomendadas: {len(cluster_analise.get('acoes_recomendadas', []))}")
            
            print("\n RECOMENDAÇÕES POLÍTICAS PÚBLICAS:")
            for rec in resultado.get("recomendacoes_politicas_publicas", [])[:3]:
                print(f"  • [{rec.get('area')}] {rec.get('recomendacao')[:80]}...")
            
            print("\n RECOMENDAÇÕES AGENTES ESCOLA:")
            for agente in resultado.get("recomendacoes_agentes_escola", [])[:2]:
                print(f"  • {agente.get('agente')}: {len(agente.get('acoes', []))} ações")
        
        # Salvar resultado completo
        if formato_relatorio:
            output_path = Path(__file__).parent.parent.parent / "utils" / "relatorio_completo.json"
        else:
            output_path = Path(__file__).parent.parent.parent / "utils" / "resultado_analise.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(resultado, f, ensure_ascii=False, indent=2)
        
        print(f"\n Resultado completo salvo em: {output_path}")
        
    except Exception as e:
        print(f"\n Erro: {e}")
        import traceback
        traceback.print_exc()


def exemplo_extrair_dados():
    """Exemplo: Extrair dados sem fazer análise completa"""
    print("\n" + "=" * 60)
    print(" EXEMPLO: Extração de Dados")
    print("=" * 60)
    
    dashboard_path = Path(__file__).parent.parent.parent / "utils" / "dados_dashboard.json"
    
    if not dashboard_path.exists():
        print(f" Arquivo não encontrado: {dashboard_path}")
        return
    
    try:
        dashboard_data = load_dashboard_from_file(str(dashboard_path))
        # Extrair dados de todas as turmas
        extracted = extract_relevant_data(dashboard_data, turma=None)
        
        print(f"\n Dados extraídos:")
        print(f"  • Turmas: {len(extracted.get('turmas', []))}")
        
        for turma in extracted.get("turmas", []):
            print(f"\n   Turma: {turma.get('turma')}")
            print(f"     Total alunos: {turma.get('total_alunos')}")
            print(f"     Média da turma: {turma.get('estatisticas_gerais', {}).get('media_turma', 0)}")
            print(f"     Clusters: {len(turma.get('clusters', []))}")
            
            for cluster in turma.get("clusters", []):
                print(f"\n      Cluster {cluster.get('cluster_id')}:")
                print(f"        Alunos: {cluster.get('total_alunos')}")
                print(f"        Média: {cluster.get('intervalo_notas', {}).get('media', 0)}")
                print(f"        Renda média: R$ {cluster.get('caracteristicas', {}).get('renda_media', 0):.2f}")
                print(f"        % Trabalha: {cluster.get('caracteristicas', {}).get('pct_trabalha', 0):.1f}%")
        
    except Exception as e:
        print(f"\n Erro: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    print("\n EXEMPLOS DE ANÁLISE CAUSAL\n")
    
    # Exemplo 1: Análise completa
    exemplo_analise_turma()
    
    # Exemplo 2: Extração de dados
    exemplo_extrair_dados()
    
    print("\n" + "=" * 60)
    print(" Exemplos concluídos!")
    print("=" * 60)
    print("\n Para usar via API, veja: backend/CAUSAL_ANALYSIS_README.md")

