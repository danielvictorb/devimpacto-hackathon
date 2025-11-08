# 🎯 Sistema de Clustering de Alunos

Sistema de análise socioeconômica que identifica grupos de alunos com características similares usando Machine Learning (K-Means Clustering).

## 📋 Estrutura

```
backend/
├── models/
│   ├── clustering_model.py          # Modelo de clustering
│   ├── student_clustering_model.pkl # Modelo treinado (gerado)
│   └── dashboard_example.json       # Exemplo de saída (gerado)
├── src/
│   ├── clustering_routes.py         # Rotas da API
│   └── main.py                      # FastAPI app
└── train_clustering.py              # Script de treinamento
```

## 🚀 Como Usar

### 1. Treinar o Modelo

Primeiro, você precisa treinar o modelo com os dados de `research/dados_alunos.csv`:

```bash
cd backend
python train_clustering.py
```

Isso vai:
- ✅ Ler os dados de `research/dados_alunos.csv`
- ✅ Treinar o modelo K-Means com 4 clusters globais
- ✅ Salvar o modelo em `models/student_clustering_model.pkl`
- ✅ Gerar um exemplo de dashboard em `models/dashboard_example.json`

### 2. Iniciar a API

```bash
uvicorn src.main:app --reload
```

A API estará disponível em: `http://localhost:8000`

Documentação interativa: `http://localhost:8000/docs`

## 📡 Endpoints Disponíveis

### 1. Health Check

```http
GET /clustering/
```

Verifica se o modelo está carregado e funcionando.

**Resposta:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "n_clusters": 4
}
```

### 2. Dashboard de Exemplo

```http
GET /clustering/dashboard/example
```

Retorna o dashboard gerado durante o treinamento (mesmo formato do `dados_dashboard.json`).

### 3. Predizer Cluster de Um Aluno

```http
POST /clustering/predict/single
```

**Body:**
```json
{
  "ID": 1,
  "Nome_Aluno": "João Silva",
  "Escola": "ECIT João Goulart",
  "Serie": "1º Ano",
  "Turma": "1A",
  "Genero": "M",
  "Idade_Aluno": 15,
  "Media_Geral": 5.5,
  "Renda_Familiar": 2000,
  "Trabalha_Fora": "Sim",
  "Tempo_Deslocamento_Min": 45,
  "Cor_Raca": "Parda",
  "Seguranca_Alimentar": "Leve Insegurança",
  "Acesso_Internet": "Apenas celular"
}
```

**Resposta:**
```json
{
  "student_id": 1,
  "student_name": "João Silva",
  "cluster_id": 2,
  "cluster_characteristics": {
    "cluster_id": 2,
    "description": "Cluster 2 - Padrões identificados pelo modelo"
  }
}
```

### 4. Gerar Dashboard Completo (JSON)

```http
POST /clustering/dashboard/generate
```

Envia uma lista de alunos e recebe o dashboard completo.

**Body:**
```json
[
  {
    "ID": 1,
    "Nome_Aluno": "João Silva",
    // ... todos os campos do aluno
  },
  {
    "ID": 2,
    "Nome_Aluno": "Maria Santos",
    // ... todos os campos do aluno
  }
]
```

**Resposta:** Igual ao `dados_dashboard.json` com:
- `metadata`
- `resumo_geral`
- `clusters_globais` (com todos os alunos)
- `dados_por_turma` (com clusters por turma)
- `insights_principais`

### 5. Gerar Dashboard de CSV

```http
POST /clustering/dashboard/from-csv
```

Upload de arquivo CSV e retorna o dashboard completo.

**Form Data:**
- `file`: Arquivo CSV com dados dos alunos

**Exemplo com curl:**
```bash
curl -X POST "http://localhost:8000/clustering/dashboard/from-csv" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@dados_alunos.csv"
```

### 6. Informações do Modelo

```http
GET /clustering/model/info
```

Retorna informações sobre o modelo treinado.

**Resposta:**
```json
{
  "model_type": "K-Means Clustering",
  "n_clusters_global": 4,
  "n_clusters_turma": 3,
  "features": [
    "Media_Geral",
    "Renda_Familiar",
    "Trabalha_Num",
    "Tempo_Deslocamento_Min",
    "Cor_Raca_Num",
    "Seg_Alimentar_Num"
  ],
  "model_path": "models/student_clustering_model.pkl",
  "model_exists": true
}
```

## 🔧 Como Funciona

### Features Utilizadas

O modelo usa 6 features principais:

1. **Media_Geral**: Média das notas do aluno
2. **Renda_Familiar**: Renda familiar em reais
3. **Trabalha_Num**: Se o aluno trabalha (0 ou 1)
4. **Tempo_Deslocamento_Min**: Tempo de deslocamento até a escola
5. **Cor_Raca_Num**: Cor/raça (0=Branca, 1=Preta/Parda/Indígena)
6. **Seg_Alimentar_Num**: Nível de segurança alimentar (0-3)

### Clustering

- **Global**: 4 clusters identificam padrões gerais entre todos os alunos
- **Por Turma**: 3 clusters identificam padrões específicos dentro de cada turma

### Saída do Dashboard

O dashboard inclui:

- **Metadata**: Total de alunos, turmas, data de geração
- **Resumo Geral**: Distribuição por faixa de desempenho, fatores críticos
- **Clusters Globais**: 4 grupos com características, features relevantes e lista completa de alunos
- **Dados por Turma**: Estatísticas e clusters específicos de cada turma
- **Insights**: Principais descobertas sobre os dados

## 🔄 Retreinamento

Para retreinar o modelo com novos dados:

1. Atualize o arquivo `research/dados_alunos.csv`
2. Execute novamente: `python train_clustering.py`
3. Reinicie a API

## 💡 Exemplo de Uso no Frontend

```javascript
// Obter dashboard de exemplo
const response = await fetch('http://localhost:8000/clustering/dashboard/example');
const dashboard = await response.json();

// Acessar clusters
const clusters = dashboard.clusters_globais;
clusters.forEach(cluster => {
  console.log(`Cluster ${cluster.cluster_id}:`);
  console.log(`  - Alunos: ${cluster.total_alunos}`);
  console.log(`  - Média: ${cluster.caracteristicas.media_notas}`);
  console.log(`  - Features: ${cluster.features_relevantes.join(', ')}`);
  
  // Listar alunos do cluster
  cluster.alunos.forEach(aluno => {
    console.log(`    * ${aluno.nome_aluno} (Média: ${aluno.media_geral})`);
  });
});
```

## ⚠️ Observações

- O modelo precisa ser treinado antes de iniciar a API
- Os arquivos `.pkl` e `.json` gerados são adicionados ao `.gitignore`
- O modelo usa os mesmos dados e lógica do notebook `cluster.ipynb`
- As predições são determinísticas (mesmo input = mesmo output)

## 📚 Dependências

Todas as dependências estão em `requirements.txt`:
- `scikit-learn`: Para K-Means clustering
- `pandas`: Para manipulação de dados
- `joblib`: Para salvar/carregar o modelo
- `fastapi`: Para a API
- `python-multipart`: Para upload de arquivos

## 🎓 Próximos Passos

- [ ] Adicionar validação mais robusta nos endpoints
- [ ] Implementar cache de predições
- [ ] Adicionar mais métricas de clustering (silhouette score, etc)
- [ ] Criar endpoint para comparar diferentes configurações de clusters
- [ ] Adicionar visualizações (plots) via API

