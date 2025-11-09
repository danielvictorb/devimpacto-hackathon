"""
Análise Causal de Desempenho Escolar
Usa Google Gemini para analisar fatores que impactam o desempenho dos alunos
"""
import json
import os
import re
import time
from typing import Dict, List, Any, Optional
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# =========================
# Configuração Gemini
# =========================
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não encontrada no arquivo .env")

genai.configure(api_key=GEMINI_API_KEY)

# Modelo para análise estrutural
MODEL_STRUCT = "gemini-2.5-flash"

# Configuração de geração JSON
GEN_CONFIG_JSON = {
    "temperature": 0.2,
    "response_mime_type": "application/json",
}


# =========================
# Helpers Gemini
# =========================

def _extract_json(text: str) -> Any:
    """Extrai JSON de uma string. Tenta json.loads direto; se falhar, usa regex."""
    text = text.strip()
    # Remove cercas de código se existirem
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

    # Fallback: pega o primeiro bloco {...} balanceado
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

# =========================
# Extração de Dados Relevantes
# =========================

def extract_relevant_data(dashboard_data: Dict[str, Any], turma: Optional[str] = None) -> Dict[str, Any]:
    """
    Extrai dados relevantes para análise causal do JSON de dashboard.
    
    Args:
        dashboard_data: Dados completos do dashboard
        turma: Nome da turma específica (opcional). Se None, analisa todas as turmas.
    
    Returns:
        Dicionário com dados estruturados para análise
    """
    extracted = {
        "metadata": dashboard_data.get("metadata", {}),
        "resumo_geral": dashboard_data.get("resumo_geral", {}),
        "turmas": []
    }
    
    # Se turma específica foi solicitada, filtrar
    turmas_data = dashboard_data.get("dados_por_turma", [])
    if turma:
        turmas_data = [t for t in turmas_data if t.get("turma") == turma]
    
    for turma_data in turmas_data:
        turma_info = {
            "turma": turma_data.get("turma"),
            "total_alunos": turma_data.get("total_alunos", 0),
            "estatisticas_gerais": turma_data.get("estatisticas_gerais", {}),
            "distribuicao_faixas": turma_data.get("distribuicao_faixas", {}),
            "clusters": []
        }
        
        # Processar cada cluster da turma
        for cluster in turma_data.get("clusters_turma", []):
            cluster_info = {
                "cluster_id": cluster.get("cluster_id"),
                "total_alunos": cluster.get("total_alunos", 0),
                "intervalo_notas": cluster.get("intervalo_notas", {}),
                "caracteristicas": cluster.get("caracteristicas", {}),
                "features_relevantes": cluster.get("features_relevantes", []),
                "nivel_risco": cluster.get("nivel_risco", "Não especificado"),
                "alunos_amostra": []
            }
            
            # Extrair dados relevantes de uma amostra de alunos (máximo 10 por cluster)
            alunos = cluster.get("alunos", [])
            amostra_size = min(10, len(alunos))
            alunos_amostra = alunos[:amostra_size] if alunos else []
            
            for aluno in alunos_amostra:
                aluno_data = {
                    "id": aluno.get("id"),
                    "nome_aluno": aluno.get("nome_aluno"),
                    "media_geral": aluno.get("media_geral", 0),
                    "media_matematica": aluno.get("media_matematica", 0),
                    "media_portugues": aluno.get("media_portugues", 0),
                    "frequencia_percentual": aluno.get("frequencia_percentual", 0),
                    "renda_familiar": aluno.get("renda_familiar", 0),
                    "trabalha_fora": aluno.get("trabalha_fora", "Não"),
                    "horas_trabalho_semana": aluno.get("horas_trabalho_semana", 0),
                    "tempo_deslocamento_min": aluno.get("tempo_deslocamento_min", 0),
                    "acesso_internet": aluno.get("acesso_internet", "Não"),
                    "tem_computador": aluno.get("tem_computador", "Não"),
                    "seguranca_alimentar": aluno.get("seguranca_alimentar", "Não especificado"),
                    "refeicoes_diarias": aluno.get("refeicoes_diarias", 0),
                    "apoio_familiar_estudos": aluno.get("apoio_familiar_estudos", "Não especificado"),
                    "ambiente_familiar": aluno.get("ambiente_familiar", "Não especificado"),
                    "cor_raca": aluno.get("cor_raca", "Não especificado"),
                    "deficiencia": aluno.get("deficiencia", "Nenhuma"),
                    "municipio": aluno.get("municipio", ""),
                    "area_climatica": aluno.get("area_climatica", ""),
                    "impacto_seca": aluno.get("impacto_seca", "")
                }
                cluster_info["alunos_amostra"].append(aluno_data)
            
            # Estatísticas agregadas do cluster
            if alunos:
                medias_gerais = [a.get("media_geral", 0) for a in alunos]
                rendas = [a.get("renda_familiar", 0) for a in alunos]
                trabalha_count = sum(1 for a in alunos if a.get("trabalha_fora") == "Sim")
                inseg_alimentar_count = sum(1 for a in alunos if a.get("seguranca_alimentar") != "Segura")
                sem_internet_count = sum(1 for a in alunos if a.get("acesso_internet") == "Não")
                
                cluster_info["estatisticas_agregadas"] = {
                    "media_geral_cluster": sum(medias_gerais) / len(medias_gerais) if medias_gerais else 0,
                    "renda_media": sum(rendas) / len(rendas) if rendas else 0,
                    "pct_trabalha": (trabalha_count / len(alunos)) * 100 if alunos else 0,
                    "pct_inseg_alimentar": (inseg_alimentar_count / len(alunos)) * 100 if alunos else 0,
                    "pct_sem_internet": (sem_internet_count / len(alunos)) * 100 if alunos else 0,
                    "total_alunos_cluster": len(alunos)
                }
            
            turma_info["clusters"].append(cluster_info)
        
        extracted["turmas"].append(turma_info)
    
    return extracted


# =========================
# Preparação de Prompt
# =========================

def prepare_analysis_prompt(extracted_data: Dict[str, Any], formato_relatorio: bool = False) -> str:
    """
    Prepara prompt estruturado para análise causal com Gemini.
    
    Args:
        extracted_data: Dados extraídos e estruturados
        formato_relatorio: Se True, gera relatório narrativo para diretor escolar
    
    Returns:
        String com prompt formatado
    """
    # Verificar se há múltiplas turmas
    total_turmas = len(extracted_data.get("turmas", []))
    
    if formato_relatorio:
        # Formato de relatório para diretor escolar
        contexto_turmas = (
            f"Você está analisando dados de {total_turmas} turma(s) para gerar um relatório analítico "
            "destinado à direção escolar. "
            if total_turmas > 1 
            else "Você está analisando dados de uma turma para gerar um relatório analítico destinado à direção escolar. "
        )
        
        prompt_data = {
            "contexto": (
                "Você é um especialista em análise educacional e gestão escolar. "
                "Sua tarefa é gerar um relatório analítico completo, em linguagem formal, clara e propositiva, "
                "destinado ao diretor escolar. O relatório deve orientar a tomada de decisão e o planejamento de ações. "
                + contexto_turmas
            ),
            "dados": extracted_data,
            "tarefa": {
                "objetivo": "Gerar relatório analítico completo para direção escolar",
                "publico_alvo": "Diretor escolar responsável por coordenar ações pedagógicas e sociais",
                "estilo": "Linguagem formal, empática, clara e propositiva. Evite jargões excessivamente técnicos.",
                "estrutura_requerida": {
                    "parte_1_analise_geral": {
                        "analise_geral_alunos": {
                            "resumo_estatistico": "Resumo estatístico e descritivo do desempenho global",
                            "padroes_gerais": "Identificação de padrões gerais, tendências e principais dificuldades",
                            "interpretacao_ia": "Interpretação com base em IA para extrair significados e relações não triviais"
                        },
                        "plano_acao_geral": {
                            "descricao": "Liste e descreva EXATAMENTE 5 ações estratégicas prioritárias",
                            "tipos_acoes": [
                                "Ajustes pedagógicos (reforço, tutoria, revisão de currículo)",
                                "Acompanhamento psicossocial (assistência social, orientação educacional)",
                                "Intervenções externas (comunicação com prefeitura, rotas de transporte, etc.)"
                            ],
                            "requisitos": "Ações devem ser práticas, específicas e factíveis"
                        },
                        "insights_correlacoes": {
                            "observacoes": "Observações e correlações relevantes entre variáveis",
                            "exemplos": "Frequência vs. desempenho, região vs. evasão, etc.",
                            "causas_subjacentes": "Destaque possíveis causas subjacentes para os padrões encontrados"
                        }
                    },
                    "parte_2_analise_por_turma": {
                        "para_cada_turma": {
                            "analise_plano_acao": {
                                "sintese": "Síntese do desempenho e principais desafios da turma",
                                "recomendacoes": "Recomendações específicas e práticas direcionadas à realidade da turma"
                            },
                            "correlacao_clusterizacao": {
                                "correlacoes_internas": "Identifique e descreva correlações internas ao grupo (clusters)",
                                "padroes_comportamentais": "Destaque padrões comportamentais ou acadêmicos comuns",
                                "oportunidades_intervencao": "Aponte oportunidades de intervenção direcionada"
                            }
                        }
                    }
                },
                "instrucoes": [
                    "Escreva em linguagem formal e empática, como relatório técnico para direção escolar",
                    "Priorize clareza, precisão e aplicabilidade",
                    "Estruture com títulos, subtítulos e listas para facilitar leitura",
                    "Mantenha foco em ações e soluções, não apenas descrição de problemas",
                    "Seja específico e detalhado nas recomendações",
                    "Considere o contexto brasileiro de educação pública",
                    "Identifique padrões causais claros (não apenas correlações)",
                    "SEMPRE identifique a turma de cada cluster na análise"
                ]
            },
            "formato_saida": {
                "parte_1_analise_geral": {
                    "analise_geral_alunos": {
                        "resumo_estatistico": "string - texto narrativo com resumo estatístico",
                        "padroes_gerais": "string - texto narrativo identificando padrões",
                        "interpretacao_ia": "string - texto narrativo com interpretação da IA"
                    },
                    "plano_acao_geral": [
                        {
                            "acao_numero": "int - 1 a 5",
                            "titulo": "string - título da ação",
                            "descricao": "string - descrição detalhada da ação",
                            "tipo": "pedagogico|psicossocial|externo",
                            "prazo": "curto|medio|longo",
                            "responsavel": "string - quem deve executar",
                            "impacto_esperado": "string - impacto esperado"
                        }
                    ],
                    "insights_correlacoes": {
                        "observacoes": "string - texto narrativo com observações",
                        "correlacoes_identificadas": [
                            {
                                "variavel_1": "string",
                                "variavel_2": "string",
                                "relacao": "string - descrição da relação",
                                "significancia": "string"
                            }
                        ],
                        "causas_subjacentes": "string - texto narrativo sobre causas"
                    }
                },
                "parte_2_analise_por_turma": [
                    {
                        "turma": "string - nome da turma",
                        "analise_plano_acao": {
                            "sintese_desempenho": "string - síntese narrativa do desempenho",
                            "principais_desafios": "string - texto narrativo sobre desafios",
                            "recomendacoes_especificas": [
                                {
                                    "recomendacao": "string - recomendação específica",
                                    "justificativa": "string",
                                    "prazo": "curto|medio|longo"
                                }
                            ]
                        },
                        "correlacao_clusterizacao": {
                            "descricao_clusters": "string - descrição narrativa dos clusters",
                            "correlacoes_internas": "string - texto sobre correlações",
                            "padroes_comportamentais": "string - texto sobre padrões",
                            "oportunidades_intervencao": [
                                {
                                    "oportunidade": "string - oportunidade identificada",
                                    "grupo_alvo": "string - grupo/cluster alvo",
                                    "acao_sugerida": "string"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    else:
        # Formato original (mantido para compatibilidade)
        contexto_turmas = (
            f"Você está analisando dados de {total_turmas} turma(s). " 
            if total_turmas > 1 
            else "Você está analisando dados de uma turma. "
        ) + (
            "Quando houver múltiplas turmas, forneça uma análise consolidada que identifique padrões gerais "
            "e também especificidades por turma quando relevante. "
            if total_turmas > 1 
            else ""
        )
        
        prompt_data = {
            "contexto": (
                "Você é um especialista em análise educacional e políticas públicas. "
                "Sua tarefa é analisar dados de desempenho escolar e identificar relações causais "
                "entre fatores socioeconômicos, ambientais e familiares com o desempenho acadêmico dos alunos. "
                + contexto_turmas
            ),
            "dados": extracted_data,
            "tarefa": {
                "objetivo": (
                    "Realizar análise causal detalhada identificando: "
                    "1) Fatores que causam baixo desempenho, "
                    "2) Relações entre múltiplos fatores, "
                    "3) Ações específicas por grupo de alunos (cluster) - INCLUINDO A IDENTIFICAÇÃO DA TURMA DE CADA CLUSTER, "
                    "4) Recomendações para políticas públicas, "
                    "5) Recomendações para agentes escolares (assistente social, etc.)"
                ),
                "instrucoes": [
                    "Identifique padrões causais claros (não apenas correlações)",
                    "Considere o contexto brasileiro e desigualdades estruturais",
                    "Forneça ações práticas e viáveis",
                    "Diferencie ações de curto, médio e longo prazo",
                    "Considere recursos disponíveis em escolas públicas",
                    "Priorize ações que tenham maior impacto potencial",
                    "Quando houver múltiplas turmas, analise padrões gerais e também especificidades por turma",
                    "SEMPRE identifique a turma de cada cluster na análise por cluster"
                ]
            },
        "formato_saida": {
            "analise_geral_turma": {
                "resumo_executivo": "string - resumo em 2-3 parágrafos",
                "principais_fatores_causais": [
                    {
                        "fator": "string - nome do fator",
                        "impacto": "string - descrição do impacto",
                        "evidencia": "string - evidência dos dados",
                        "magnitude": "alto|medio|baixo"
                    }
                ],
                "desigualdades_identificadas": [
                    {
                        "tipo": "string - tipo de desigualdade",
                        "descricao": "string",
                        "grupos_afetados": "string"
                    }
                ]
            },
            "analise_por_cluster": [
                {
                    "turma": "string",
                    "cluster_id": "int",
                    "resumo_cluster": "string - características principais",
                    "fatores_criticos": [
                        {
                            "fator": "string",
                            "impacto_estimado": "string",
                            "prioridade": "alta|media|baixa"
                        }
                    ],
                    "acoes_recomendadas": [
                        {
                            "acao": "string - ação específica",
                            "responsavel": "escola|estado|ambos",
                            "prazo": "curto|medio|longo",
                            "impacto_esperado": "string",
                            "viabilidade": "alta|media|baixa",
                            "custo_estimado": "baixo|medio|alto"
                        }
                    ],
                    "alunos_prioritarios": "string - descrição de quais alunos precisam de atenção imediata"
                }
            ],
            "recomendacoes_politicas_publicas": [
                {
                    "area": "string - área de política (ex: assistência social, educação, saúde)",
                    "recomendacao": "string - recomendação específica",
                    "justificativa": "string",
                    "orgao_responsavel": "string - órgão sugerido",
                    "prioridade": "alta|media|baixa",
                    "impacto_estimado": "string"
                }
            ],
            "recomendacoes_agentes_escola": [
                {
                    "agente": "string - tipo de agente (assistente social, coordenador pedagógico, etc.)",
                    "acoes": [
                        {
                            "acao": "string",
                            "prazo": "curto|medio|longo",
                            "alunos_alvo": "string - descrição do grupo alvo",
                            "recursos_necessarios": "string"
                        }
                    ]
                }
            ],
            "metricas_sugeridas": [
                {
                    "metrica": "string - nome da métrica",
                    "objetivo": "string - para que serve",
                    "como_medir": "string"
                }
            ]
        }
    }
    
    return json.dumps(prompt_data, ensure_ascii=False, indent=2)


# =========================
# Análise com Gemini
# =========================

def _analyze_single_turma_relatorio(
    dashboard_data: Dict[str, Any],
    turma_name: str
) -> Dict[str, Any]:
    """
    Analisa uma única turma para gerar relatório.
    
    Args:
        dashboard_data: Dados completos do dashboard
        turma_name: Nome da turma
    
    Returns:
        Análise da turma no formato de relatório
    """
    # Extrair dados da turma específica
    extracted_data = extract_relevant_data(dashboard_data, turma=turma_name)
    
    # Preparar prompt no formato de relatório
    prompt = prepare_analysis_prompt(extracted_data, formato_relatorio=True)
    
    # System instruction para relatório
    system_instruction = (
        "Você é um especialista em análise educacional e gestão escolar. "
        "Sua tarefa é gerar um relatório analítico completo, em linguagem formal, clara e propositiva, "
        "destinado ao diretor escolar. O relatório deve orientar a tomada de decisão e o planejamento de ações. "
        "Sempre retorne JSON válido no formato especificado. "
        "Seja específico e detalhado nas recomendações, considerando o contexto brasileiro de educação pública."
    )
    
    # Chamar Gemini
    try:
        result = _gemini_generate_json(
            model_name=MODEL_STRUCT,
            system_instruction=system_instruction,
            user_prompt=prompt,
            max_retries=3,
            backoff_sec=1.5
        )
        
        # Adicionar metadados da turma
        result["metadata"] = {
            "turma_analisada": turma_name,
            "total_turmas": 1,
            "total_alunos": extracted_data.get("turmas", [{}])[0].get("total_alunos", 0) if extracted_data.get("turmas") else 0,
            "data_analise": extracted_data.get("metadata", {}).get("data_geracao", "")
        }
        
        return result
        
    except Exception as e:
        return {
            "erro": str(e),
            "turma": turma_name,
            "parte_2_analise_por_turma": [{
                "turma": turma_name,
                "analise_plano_acao": {
                    "sintese_desempenho": f"Erro ao analisar turma {turma_name}: {str(e)}",
                    "principais_desafios": "Não foi possível realizar a análise devido a erro técnico.",
                    "recomendacoes_especificas": []
                },
                "correlacao_clusterizacao": {
                    "descricao_clusters": "Análise não disponível",
                    "correlacoes_internas": "",
                    "padroes_comportamentais": "",
                    "oportunidades_intervencao": []
                }
            }]
        }


def _consolidate_relatorio(
    analyses: List[Dict[str, Any]],
    dashboard_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Consolida análises de múltiplas turmas em um relatório único para diretor escolar.
    
    Args:
        analyses: Lista de análises individuais por turma
        dashboard_data: Dados completos do dashboard
    
    Returns:
        Relatório consolidado
    """
    # Extrair Parte 1 (Análise Geral) da primeira análise ou criar síntese
    # Para análise geral, vamos usar dados consolidados de todas as turmas
    extracted_data_geral = extract_relevant_data(dashboard_data, turma=None)
    prompt_geral = prepare_analysis_prompt(extracted_data_geral, formato_relatorio=True)
    
    system_instruction_geral = (
        "Você é um especialista em análise educacional e gestão escolar. "
        "Sua tarefa é gerar a PARTE 1 (Análise Geral) de um relatório analítico completo. "
        "Você está analisando dados de TODAS as turmas para gerar uma visão consolidada. "
        "Sempre retorne JSON válido no formato especificado. "
        "Foque na estrutura 'parte_1_analise_geral' com análise geral dos alunos, plano de ação geral (5 ações) e insights."
    )
    
    try:
        parte_1 = _gemini_generate_json(
            model_name=MODEL_STRUCT,
            system_instruction=system_instruction_geral,
            user_prompt=prompt_geral,
            max_retries=3,
            backoff_sec=1.5
        )
        parte_1_analise = parte_1.get("parte_1_analise_geral", {})
    except Exception as e:
        # Em caso de erro, criar estrutura básica
        parte_1_analise = {
            "analise_geral_alunos": {
                "resumo_estatistico": f"Análise consolidada de {len(analyses)} turma(s).",
                "padroes_gerais": "Padrões identificados através da análise de todas as turmas.",
                "interpretacao_ia": "Interpretação baseada em análise de dados de todas as turmas."
            },
            "plano_acao_geral": [],
            "insights_correlacoes": {
                "observacoes": "Análise consolidada de todas as turmas.",
                "correlacoes_identificadas": [],
                "causas_subjacentes": "Causas identificadas através da análise consolidada."
            }
        }
    
    # Consolidar Parte 2 (Análise por Turma) de todas as análises
    parte_2_analises = []
    for analise in analyses:
        if "parte_2_analise_por_turma" in analise:
            parte_2_analises.extend(analise["parte_2_analise_por_turma"])
        elif "erro" not in analise:
            # Se não tem parte_2 mas tem dados, tentar extrair
            turma_name = analise.get("metadata", {}).get("turma_analisada", "N/A")
            parte_2_analises.append({
                "turma": turma_name,
                "analise_plano_acao": {
                    "sintese_desempenho": "Análise disponível mas formato não padronizado.",
                    "principais_desafios": "Verificar análise individual da turma.",
                    "recomendacoes_especificas": []
                },
                "correlacao_clusterizacao": {
                    "descricao_clusters": "",
                    "correlacoes_internas": "",
                    "padroes_comportamentais": "",
                    "oportunidades_intervencao": []
                }
            })
    
    # Estrutura final do relatório consolidado
    relatorio_consolidado = {
        "parte_1_analise_geral": parte_1_analise,
        "parte_2_analise_por_turma": parte_2_analises,
        "metadata": {
            "turma_analisada": "Todas as turmas",
            "total_turmas": len(analyses),
            "total_alunos": dashboard_data.get("metadata", {}).get("total_alunos", 0),
            "data_analise": dashboard_data.get("metadata", {}).get("data_geracao", ""),
            "formato": "relatorio_diretor_escolar"
        }
    }
    
    return relatorio_consolidado


def analyze_causal_factors(
    dashboard_data: Dict[str, Any],
    turma: Optional[str] = None,
    formato_relatorio: bool = False
) -> Dict[str, Any]:
    """
    Realiza análise causal completa usando Google Gemini.
    Se formato_relatorio=True e turma=None, processa turma por turma e consolida.
    
    Args:
        dashboard_data: Dados completos do dashboard JSON
        turma: Nome da turma específica (opcional)
        formato_relatorio: Se True, gera relatório para diretor escolar
    
    Returns:
        Dicionário com análise completa estruturada
    """
    # Se formato relatório e turma=None, processar todas as turmas individualmente
    if formato_relatorio and turma is None:
        turmas_data = dashboard_data.get("dados_por_turma", [])
        if not turmas_data:
            raise ValueError("Nenhuma turma encontrada nos dados do dashboard")
        
        # Obter lista de nomes das turmas
        turmas_nomes = [t.get("turma") for t in turmas_data if t.get("turma")]
        
        if not turmas_nomes:
            raise ValueError("Nenhuma turma válida encontrada")
        
        print(f" Processando {len(turmas_nomes)} turma(s) individualmente para relatório...")
        
        # Analisar cada turma separadamente
        analyses = []
        for i, turma_name in enumerate(turmas_nomes, 1):
            print(f"  [{i}/{len(turmas_nomes)}] Analisando turma: {turma_name}...")
            try:
                analise = _analyze_single_turma_relatorio(dashboard_data, turma_name)
                analyses.append(analise)
                print(f"   Turma {turma_name} analisada com sucesso")
            except Exception as e:
                print(f"    Erro ao analisar turma {turma_name}: {str(e)}")
                analyses.append({
                    "erro": str(e),
                    "turma": turma_name,
                    "parte_2_analise_por_turma": [{
                        "turma": turma_name,
                        "analise_plano_acao": {
                            "sintese_desempenho": f"Erro ao analisar turma {turma_name}",
                            "principais_desafios": "Não foi possível realizar a análise.",
                            "recomendacoes_especificas": []
                        },
                        "correlacao_clusterizacao": {
                            "descricao_clusters": "",
                            "correlacoes_internas": "",
                            "padroes_comportamentais": "",
                            "oportunidades_intervencao": []
                        }
                    }]
                })
        
        # Consolidar todas as análises
        print(f"\n Consolidando relatório de {len(analyses)} turma(s)...")
        relatorio_consolidado = _consolidate_relatorio(analyses, dashboard_data)
        
        print(f" Relatório consolidado concluído!")
        
        return relatorio_consolidado
    
    # Caso padrão: análise única (turma específica ou formato antigo)
    # Extrair dados relevantes
    extracted_data = extract_relevant_data(dashboard_data, turma)
    
    # Preparar prompt
    prompt = prepare_analysis_prompt(extracted_data, formato_relatorio=formato_relatorio)
    
    # System instruction
    if formato_relatorio:
        system_instruction = (
            "Você é um especialista em análise educacional e gestão escolar. "
            "Sua tarefa é gerar um relatório analítico completo, em linguagem formal, clara e propositiva, "
            "destinado ao diretor escolar. O relatório deve orientar a tomada de decisão e o planejamento de ações. "
            "Sempre retorne JSON válido no formato especificado. "
            "Seja específico e detalhado nas recomendações, considerando o contexto brasileiro de educação pública."
        )
    else:
        system_instruction = (
            "Você é um especialista em análise educacional, políticas públicas e desigualdades sociais. "
            "Sua análise deve ser precisa, baseada em evidências dos dados fornecidos, e focada em ações práticas. "
            "Sempre retorne JSON válido no formato especificado. "
            "Seja específico e detalhado nas recomendações, considerando o contexto brasileiro de educação pública."
        )
    
    # Chamar Gemini
    try:
        result = _gemini_generate_json(
            model_name=MODEL_STRUCT,
            system_instruction=system_instruction,
            user_prompt=prompt,
            max_retries=3,
            backoff_sec=1.5
        )
        
        # Adicionar metadados
        result["metadata"] = {
            "turma_analisada": turma if turma else "Todas as turmas",
            "total_turmas": len(extracted_data.get("turmas", [])),
            "total_alunos": extracted_data.get("metadata", {}).get("total_alunos", 0),
            "data_analise": extracted_data.get("metadata", {}).get("data_geracao", ""),
            "formato": "relatorio_diretor_escolar" if formato_relatorio else "analise_causal"
        }
        
        return result
        
    except Exception as e:
        # Retornar estrutura vazia em caso de erro
        if formato_relatorio:
            return {
                "erro": str(e),
                "parte_1_analise_geral": {
                    "analise_geral_alunos": {
                        "resumo_estatistico": "Erro ao realizar análise. Por favor, tente novamente.",
                        "padroes_gerais": "",
                        "interpretacao_ia": ""
                    },
                    "plano_acao_geral": [],
                    "insights_correlacoes": {
                        "observacoes": "",
                        "correlacoes_identificadas": [],
                        "causas_subjacentes": ""
                    }
                },
                "parte_2_analise_por_turma": []
            }
        else:
            return {
                "erro": str(e),
                "analise_geral_turma": {
                    "resumo_executivo": "Erro ao realizar análise. Por favor, tente novamente.",
                    "principais_fatores_causais": [],
                    "desigualdades_identificadas": []
                },
                "analise_por_cluster": [],
                "recomendacoes_politicas_publicas": [],
                "recomendacoes_agentes_escola": [],
                "metricas_sugeridas": []
            }


# =========================
# Função Helper para Carregar Dashboard
# =========================

def load_dashboard_from_file(file_path: str) -> Dict[str, Any]:
    """
    Carrega dados do dashboard de um arquivo JSON.
    
    Args:
        file_path: Caminho para o arquivo JSON
    
    Returns:
        Dicionário com dados do dashboard
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {file_path}")
    
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


# =========================
# Exemplo de Uso
# =========================

if __name__ == "__main__":
    # Exemplo de uso
    dashboard_path = Path(__file__).parent.parent.parent.parent / "utils" / "dados_dashboard.json"
    
    try:
        print(" Carregando dados do dashboard...")
        dashboard_data = load_dashboard_from_file(str(dashboard_path))
        
        print(" Realizando análise causal...")
        resultado = analyze_causal_factors(dashboard_data, turma="1A")
        
        print(" Análise concluída!")
        print(f"\n Resumo Executivo:")
        print(resultado.get("analise_geral_turma", {}).get("resumo_executivo", "N/A"))
        
        # Salvar resultado
        output_path = Path(__file__).parent.parent.parent.parent / "utils" / "analise_causal_resultado.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(resultado, f, ensure_ascii=False, indent=2)
        
        print(f"\n Resultado salvo em: {output_path}")
        
    except Exception as e:
        print(f" Erro: {e}")

