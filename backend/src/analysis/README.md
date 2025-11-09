# Módulo de Análise Causal de Desempenho Escolar

Este módulo realiza análise causal detalhada dos fatores que impactam o desempenho dos alunos, usando Google Gemini para identificar relações causais e gerar recomendações práticas para políticas públicas e ações escolares.

## 📁 Arquivos do Módulo

- **`causal_analysis.py`**: Lógica principal de análise causal com funções próprias de requisição ao Gemini
- **`clustering_routes.py`**: Rotas FastAPI para análise causal (prefix: `/analysis`)
- **`exemplo_analise_causal.py`**: Script de exemplo para uso local

## 📋 Funcionalidades

- **Análise por Turma**: Análise detalhada de uma turma específica
- **Análise Global**: Análise de todas as turmas
- **Recomendações por Cluster**: Ações específicas para cada grupo de alunos
- **Políticas Públicas**: Sugestões para órgãos estatais
- **Ações Escolares**: Recomendações para assistentes sociais e outros agentes
- **Salvamento Automático**: Resultado salvo em `utils/resultado_analise.json`

## 🔄 Fluxo Completo

```
1. Recebimento: dados_dashboard.json (utils/)
   ↓
2. Extração: extract_relevant_data() - Extrai dados relevantes
   ↓
3. Preparação: prepare_analysis_prompt() - Prepara prompt para IA
   ↓
4. Análise: _gemini_generate_json() - Chama Google Gemini API
   ↓
5. Processamento: analyze_causal_factors() - Processa resposta
   ↓
6. Salvamento: resultado_analise.json (utils/) - Salvo automaticamente
   ↓
7. Retorno: JSON estruturado para frontend
```

## 🚀 Como Usar

### Via API REST

#### Análise de uma turma específica:
```bash
GET /analysis/causal-analysis/turma/{turma_name}
```

Exemplo:
```bash
curl http://localhost:8000/analysis/causal-analysis/turma/1A
```

#### Análise de todas as turmas:
```bash
GET /analysis/causal-analysis/all
```

#### Análise a partir de dados JSON:
```bash
POST /analysis/causal-analysis
Content-Type: application/json

{
  "dashboard_data": { ... },  // Dados completos do dashboard
  "turma": "1A"  // Opcional
}
```

#### Extrair dados sem análise (debug):
```bash
GET /analysis/causal-analysis/extract-data?turma=1A
```

### Via Python

```python
from analysis.causal_analysis import (
    analyze_causal_factors,
    load_dashboard_from_file
)

# Carregar dados
dashboard_data = load_dashboard_from_file("backend/utils/dados_dashboard.json")

# Análise de uma turma específica
resultado = analyze_causal_factors(dashboard_data, turma="1A")

# Análise de todas as turmas
resultado = analyze_causal_factors(dashboard_data, turma=None)

# O resultado é automaticamente salvo em utils/resultado_analise.json
```

## 📊 Estrutura de Output

O resultado da análise é um JSON estruturado salvo em `utils/resultado_analise.json`:

### 1. `metadata`
- Informações sobre a análise (turma analisada, total de alunos, data)

### 2. `analise_geral_turma`
- **resumo_executivo**: Resumo em 2-3 parágrafos
- **principais_fatores_causais**: Lista de fatores identificados com impacto e evidências
- **desigualdades_identificadas**: Desigualdades estruturais encontradas

### 3. `analise_por_cluster`
Para cada cluster:
- **resumo_cluster**: Características principais
- **fatores_criticos**: Fatores mais importantes com prioridade
- **acoes_recomendadas**: Ações específicas com:
  - Responsável (escola/estado/ambos)
  - Prazo (curto/médio/longo)
  - Impacto esperado
  - Viabilidade
  - Custo estimado
- **alunos_prioritarios**: Descrição de alunos que precisam atenção imediata

### 4. `recomendacoes_politicas_publicas`
- **area**: Área de política (assistência social, educação, saúde, etc.)
- **recomendacao**: Recomendação específica
- **justificativa**: Por que essa recomendação
- **orgao_responsavel**: Órgão sugerido
- **prioridade**: Alta/Média/Baixa
- **impacto_estimado**: Descrição do impacto esperado

### 5. `recomendacoes_agentes_escola`
Para cada tipo de agente (assistente social, coordenador pedagógico, etc.):
- **acoes**: Lista de ações específicas
  - **acao**: Descrição da ação
  - **prazo**: Curto/Médio/Longo
  - **alunos_alvo**: Grupo alvo
  - **recursos_necessarios**: Recursos necessários

### 6. `metricas_sugeridas`
Métricas para acompanhamento:
- **metrica**: Nome da métrica
- **objetivo**: Para que serve
- **como_medir**: Como medir

## 🧪 Como Testar

### 1. Teste Local (Python)

```bash
cd backend/src/analysis
python exemplo_analise_causal.py
```

### 2. Teste via API (FastAPI)

#### Iniciar o servidor:
```bash
cd backend/src
python -m uvicorn main:app --reload
```

#### Testar endpoints:

**a) Análise de uma turma específica:**
```bash
curl http://localhost:8000/analysis/causal-analysis/turma/1A
```

**b) Análise de todas as turmas:**
```bash
curl http://localhost:8000/analysis/causal-analysis/all
```

**c) Extrair dados (sem análise):**
```bash
curl http://localhost:8000/analysis/causal-analysis/extract-data?turma=1A
```

**d) Análise via POST (com dados customizados):**
```bash
curl -X POST http://localhost:8000/analysis/causal-analysis \
  -H "Content-Type: application/json" \
  -d @dados_dashboard.json
```

### 3. Teste via Python Requests

```python
import requests
import json

# Análise de uma turma
response = requests.get("http://localhost:8000/analysis/causal-analysis/turma/1A")
resultado = response.json()

print("Resumo Executivo:")
print(resultado["analise_geral_turma"]["resumo_executivo"])

print("\nAções Recomendadas por Cluster:")
for cluster in resultado["analise_por_cluster"]:
    print(f"\nCluster {cluster['cluster_id']}:")
    for acao in cluster["acoes_recomendadas"]:
        print(f"  - {acao['acao']} ({acao['responsavel']})")

# O resultado também está salvo em utils/resultado_analise.json
```

## ✅ Checklist de Verificação

- [ ] Variável `GEMINI_API_KEY` configurada no `.env`
- [ ] Arquivo `dados_dashboard.json` existe em `backend/utils/`
- [ ] Servidor FastAPI rodando
- [ ] Módulo `causal_analysis.py` importa corretamente
- [ ] Resposta da API contém estrutura JSON esperada
- [ ] Arquivo `resultado_analise.json` é criado em `utils/` após análise

## 🔍 Fatores Analisados

### Socioeconômicos
- Renda familiar
- Trabalho fora da escola
- Horas de trabalho por semana
- Segurança alimentar
- Número de refeições diárias

### Infraestrutura
- Acesso à internet
- Posse de computador
- Tempo de deslocamento
- Meio de transporte
- Segurança do trajeto

### Familiar
- Apoio familiar aos estudos
- Ambiente familiar
- Responsabilidades em casa
- Número de irmãos

### Ambientais
- Área climática
- Impacto da seca
- Área de risco ambiental

### Acadêmicos
- Média geral
- Média por matéria (Matemática, Português)
- Frequência escolar
- Notas por bimestre

### Demográficos
- Cor/raça
- Gênero
- Idade
- Deficiência

## ⚙️ Configuração

Certifique-se de ter a variável de ambiente configurada:

```bash
GEMINI_API_KEY=sua_chave_aqui
```

## ⚠️ Problemas Comuns

### Erro: "GEMINI_API_KEY não encontrada"
**Solução**: Verifique o arquivo `.env` na raiz do projeto

### Erro: "Arquivo de dashboard não encontrado"
**Solução**: Gere o dashboard primeiro:
```bash
cd backend
python services/train_clustering.py
```

### Erro: "ModuleNotFoundError: No module named 'analysis.causal_analysis'"
**Solução**: Verifique se o arquivo existe em `backend/src/analysis/causal_analysis.py`

### Análise retorna erro 500
**Solução**: 
1. Verifique os logs do servidor
2. Verifique se há dados suficientes no dashboard
3. Verifique se a API do Gemini está acessível

### Arquivo resultado_analise.json não é criado
**Solução**: 
1. Verifique permissões de escrita na pasta `utils/`
2. Verifique os logs do servidor para erros de escrita
3. Certifique-se de que a análise foi concluída com sucesso

## 📊 Interpretação dos Resultados

### Fatores Causais
- **Magnitude "alto"**: Fator com impacto significativo no desempenho
- **Magnitude "médio"**: Fator com impacto moderado
- **Magnitude "baixo"**: Fator com impacto menor, mas ainda relevante

### Prioridades de Ações
- **Alta**: Ação urgente, deve ser implementada imediatamente
- **Média**: Ação importante, pode ser planejada
- **Baixa**: Ação desejável, mas não crítica

### Viabilidade
- **Alta**: Fácil de implementar com recursos disponíveis
- **Média**: Requer algum planejamento ou recursos adicionais
- **Baixa**: Difícil de implementar ou requer muitos recursos

## 🔗 Endpoints Disponíveis

### Rotas de Análise Causal (`/analysis`)
- `GET /analysis/` - Health check
- `POST /analysis/predict/single` - Predição de cluster para um aluno
- `POST /analysis/predict/batch` - Predição de cluster para múltiplos alunos
- `POST /analysis/dashboard/generate` - Gerar dashboard
- `POST /analysis/dashboard/from-csv` - Gerar dashboard a partir de CSV
- `GET /analysis/dashboard/example` - Dashboard de exemplo
- `GET /analysis/model/info` - Informações do modelo
- **`POST /analysis/causal-analysis`** ⭐ - Análise causal com dados customizados
- **`GET /analysis/causal-analysis/turma/{turma_name}`** ⭐ - Análise de turma específica
- **`GET /analysis/causal-analysis/all`** ⭐ - Análise de todas as turmas
- **`GET /analysis/causal-analysis/extract-data`** ⭐ - Extrair dados sem análise

## 📝 Exemplo de Resposta

```json
{
  "metadata": {
    "turma_analisada": "1A",
    "total_turmas": 1,
    "total_alunos": 30,
    "data_analise": "2025-11-08 19:17:10"
  },
  "analise_geral_turma": {
    "resumo_executivo": "A turma 1A apresenta desempenho crítico...",
    "principais_fatores_causais": [
      {
        "fator": "Trabalho fora da escola",
        "impacto": "Reduz tempo disponível para estudos",
        "evidencia": "92% dos alunos do cluster 0 trabalham",
        "magnitude": "alto"
      }
    ],
    "desigualdades_identificadas": [
      {
        "tipo": "Racial",
        "descricao": "80% dos alunos do cluster de baixo desempenho são pretos/pardos",
        "grupos_afetados": "Alunos pretos, pardos e indígenas"
      }
    ]
  },
  "analise_por_cluster": [
    {
      "turma": "1A",
      "cluster_id": 0,
      "resumo_cluster": "Alunos com desempenho crítico...",
      "fatores_criticos": [
        {
          "fator": "Trabalho + Deslocamento longo",
          "impacto_estimado": "Redução de 2-3 pontos na média",
          "prioridade": "alta"
        }
      ],
      "acoes_recomendadas": [
        {
          "acao": "Flexibilizar horários de atividades",
          "responsavel": "escola",
          "prazo": "curto",
          "impacto_esperado": "Aumento de 0.5-1 ponto na média",
          "viabilidade": "alta",
          "custo_estimado": "baixo"
        }
      ],
      "alunos_prioritarios": "Alunos com média < 2.0 e que trabalham"
    }
  ],
  "recomendacoes_politicas_publicas": [
    {
      "area": "Assistência Social",
      "recomendacao": "Ampliar programa de transferência de renda",
      "justificativa": "72 alunos com renda < R$1.500",
      "orgao_responsavel": "Secretaria de Assistência Social",
      "prioridade": "alta",
      "impacto_estimado": "Redução de insegurança alimentar e melhoria no desempenho"
    }
  ],
  "recomendacoes_agentes_escola": [
    {
      "agente": "Assistente Social",
      "acoes": [
        {
          "acao": "Mapear alunos em insegurança alimentar grave",
          "prazo": "curto",
          "alunos_alvo": "Alunos com refeições_diarias < 2",
          "recursos_necessarios": "Lista de alunos e contatos"
        }
      ]
    }
  ],
  "metricas_sugeridas": [
    {
      "metrica": "Taxa de melhoria por cluster",
      "objetivo": "Acompanhar efetividade das ações",
      "como_medir": "Comparar médias trimestrais por cluster"
    }
  ]
}
```

## 🎯 Casos de Uso

1. **Coordenador Pedagógico**: Identificar fatores que mais impactam o desempenho
2. **Assistente Social**: Priorizar alunos que precisam de intervenção
3. **Gestão Pública**: Planejar políticas públicas baseadas em evidências
4. **Direção Escolar**: Alocar recursos de forma eficiente

## ⚠️ Limitações

- A análise é baseada em correlações e padrões identificados nos dados
- Causalidade real requer estudos longitudinais e experimentos controlados
- As recomendações são sugestões baseadas em evidências, não prescrições
- A qualidade da análise depende da qualidade e completude dos dados

## 🔧 Arquitetura

### Estrutura de Diretórios

```
backend/src/analysis/
├── causal_analysis.py        # Lógica de análise causal
├── clustering_routes.py       # Rotas FastAPI
├── exemplo_analise_causal.py # Script de exemplo
└── README.md                 # Esta documentação
```

### Dependências

- `google-generativeai`: Para chamadas à API do Gemini
- `fastapi`: Para rotas da API
- `pydantic`: Para validação de dados
- `python-dotenv`: Para variáveis de ambiente

### Funções Principais

#### `causal_analysis.py`
- `extract_relevant_data()`: Extrai dados relevantes do dashboard
- `prepare_analysis_prompt()`: Prepara prompt estruturado para Gemini
- `analyze_causal_factors()`: Realiza análise causal completa
- `load_dashboard_from_file()`: Carrega dados do dashboard
- `_gemini_generate_json()`: Função interna para chamadas ao Gemini
- `_extract_json()`: Função interna para extrair JSON da resposta

#### `clustering_routes.py`
- Rotas FastAPI para análise causal
- Salvamento automático de resultados
- Validação de dados de entrada

## 🎯 Próximos Passos

1. Integrar com frontend para visualização
2. Adicionar cache para análises frequentes
3. Implementar análise comparativa entre turmas
4. Adicionar métricas de acompanhamento temporal
5. Implementar histórico de análises

