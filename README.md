# 🐦 SabiaR - Sistema Inteligente de Análise Educacional

<div align="center">

![SabiaR Logo](./frontend/sab.png)

**SabiaR** = **Sabiá** (símbolo da sabedoria) + **Saber** (conhecimento) + **R de Reconhecimento** (IA)

*Plataforma de auxílio a gestão escolar e análise de desempenho estudantil com Machine Learning e dashboards interativos*

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.121-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**SabiaR** é uma plataforma educacional desenvolvida para o **Hackathon DevImpacto** que auxilia professores na análise e acompanhamento do desempenho de seus alunos. O sistema combina:

- 📊 **Machine Learning** para análise de clusters socioeconômicos
- 📈 **Dashboards Interativos** com visualizações em tempo real
- 🎯 **Segmentação Inteligente** de alunos por perfil
- 💡 **Gestão Completa** de turmas, alunos e dados acadêmicos
- � **Análise de Dados** com foco em fatores socioeconômicos

### 🎓 Problema que Resolvemos

Professores muitas vezes não têm ferramentas adequadas para:
- Identificar padrões de desempenho na turma
- Entender fatores socioeconômicos que afetam o aprendizado
- Gerar planos de ação personalizados para grupos de alunos
- Visualizar dados de forma clara e acionável
- Acompanhar a evolução individual e coletiva

### ✨ Nossa Solução

SabiaR fornece análises profundas sobre cada turma, identificando automaticamente:
- **Grupos de Alto Risco**: Alunos que precisam de atenção urgente
- **Grupos de Risco Moderado**: Alunos com potencial de melhora
- **Grupos Estáveis**: Alunos com bom desempenho
- **Grupos Destaque**: Alunos exemplares que podem ajudar os colegas
- **Fatores de Impacto**: Variáveis socioeconômicas que influenciam o desempenho

---

## 🚀 Funcionalidades Principais

### 👨‍🏫 Para Professores

#### ✅ **Gestão de Turmas e Alunos** (Implementado)
- **CRUD de Professores**: Criar, listar, atualizar e deletar professores
- **CRUD de Turmas**: Gerenciamento completo de turmas vinculadas a professores
- **CRUD de Alunos**: Cadastro individual ou em lote de alunos
- **Busca e Filtros**: Pesquisa avançada de alunos por múltiplos critérios
- **API REST Completa**: Endpoints documentados com Swagger/OpenAPI

#### ✅ **Análise de Clusters com Machine Learning** (Implementado)
- **Segmentação Automática**: K-Means identifica 4 grupos de alunos
  - 🔴 **Alto Risco**: Vulnerabilidade socioeconômica + baixo desempenho
  - 🟡 **Risco Moderado**: Alguns desafios, desempenho médio
  - 🟢 **Estável**: Condições favoráveis, bom desempenho
  - 🔵 **Destaque**: Excelente desempenho, resilientes
- **Predição Individual**: Classificar um aluno em cluster via API
- **Predição em Lote**: Classificar múltiplos alunos simultaneamente
- **Dashboard Automático**: Geração de dashboard completo com estatísticas
- **Modelo Treinado**: Arquivo `.pkl` pronto para uso

#### ✅ **Dashboard Analítico** (Frontend Implementado)
- **Visão Geral da Turma**: Estatísticas consolidadas de desempenho
- **Gráficos Interativos**: Visualizações com Recharts (notas, frequência)
- **Raio-X da Turma**: Análise detalhada por turma (`/dashboard/turmas/[id]/insights`)
- **Listagem de Turmas**: Cards com informações principais
- **Navegação Intuitiva**: Sidebar colapsável com menu organizado
- **Planos de Ação**: Interface para criar estratégias por grupo de alunos

#### 📊 **Banco de Dados** (Implementado no Supabase)
- **11 Tabelas Normalizadas**:
  - **Gestão**: `turmas`, `escolas`
  - **Dados dos Alunos**: `alunos`, `alunos_risco`, `distribuicao_faixas`
  - **Análise e Clustering**: `clusters_globais`, `clusters_turma`, `fatores_criticos`
  - **Relatórios**: `relatorios_gerais`, `planos_acao`
  - **Metadados**: `metadata`
- **Conexões Assíncronas**: SQLAlchemy + asyncpg para alta performance
- **Supabase/PostgreSQL**: Banco gerenciado com SSL
- **Scripts de Setup**: Automação completa de criação e população de dados

### 👨‍🎓 Para Alunos
> **Status**: Área reservada mas não implementada

- **Placeholder**: Rota `/aluno` criada para futura implementação
- **Previsto**: Visualização de notas, histórico, planos de estudo

---

## 🏗️ Arquitetura

### Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│               FRONTEND (Next.js 15 + TypeScript)            │
│                                                              │
│  App Router (app/):                                         │
│  ├─ page.tsx               → Landing page                   │
│  ├─ aluno/                 → Área do aluno                  │
│  └─ dashboard/             → Área do professor              │
│     ├─ page.tsx            → Dashboard principal            │
│     ├─ turmas/             → Gestão de turmas               │
│     │  ├─ page.tsx         → Lista de turmas                │
│     │  └─ [id]/insights/   → Análise detalhada (clustering) │
│     ├─ provas/             → Gestão de provas               │
│     ├─ alunos/             → Gestão de alunos               │
│     ├─ nova-turma/         → Criar turma                    │
│     ├─ nova-prova/         → Criar prova                    │
│     └─ planos-acoes/       → Planos de ação                 │
│                                                              │
│  Components:                                                │
│  ├─ ui/                    → Componentes Shadcn/Radix UI    │
│  ├─ charts                 → Gráficos (Recharts)            │
│  └─ chatbot                → Assistente IA (em desenvolvimento) │
└─────────────────────────────────────────────────────────────┘
                              │
                   HTTP/REST (CORS habilitado)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 API REST (FastAPI + SQLAlchemy)             │
│                                                              │
│  Routers implementados:                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ routes.py (CRUD Básico)                              │  │
│  │  ├─ /teachers/          → Gestão de professores      │  │
│  │  ├─ /classes/           → Gestão de turmas           │  │
│  │  └─ /students/          → Gestão de alunos           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ clustering_routes.py (Machine Learning)              │  │
│  │  ├─ GET  /clustering/                                │  │
│  │  ├─ POST /clustering/predict/single                  │  │
│  │  ├─ POST /clustering/predict/batch                   │  │
│  │  ├─ GET  /clustering/dashboard/example               │  │
│  │  ├─ POST /clustering/dashboard/generate              │  │
│  │  └─ GET  /clustering/model/info                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ analysis/clustering_routes.py (Análise Causal)       │  │
│  │  └─ Análise estatística de fatores de impacto        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Módulos auxiliares:                                        │
│  ├─ models/                → Modelos SQLAlchemy             │
│  │  ├─ models.py           → Tabelas principais            │
│  │  └─ models_dashboard.py → Tabelas de análise            │
│  ├─ database.py            → Conexão async (asyncpg)        │
│  └─ scripts/               → Scripts de setup e população   │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌────────────────────────┐        ┌──────────────────────────┐
│  PostgreSQL (Supabase) │        │   Machine Learning       │
│                        │        │                          │
│  11 Tabelas:           │        │  ┌────────────────────┐  │
│  ├─ turmas             │        │  │ K-Means Clustering │  │
│  ├─ escolas            │        │  │ - 4 clusters       │  │
│  ├─ alunos             │        │  │ - Análise socio-   │  │
│  ├─ alunos_risco       │        │  │   econômica        │  │
│  ├─ distribuicao_faixas│        │  └────────────────────┘  │
│  ├─ clusters_globais   │        │                          │
│  ├─ clusters_turma     │        │  Modelo treinado:        │
│  ├─ fatores_criticos   │        │  student_clustering_     │
│  ├─ relatorios_gerais  │        │  model.pkl               │
│  ├─ planos_acao        │        │  (scikit-learn)          │
│  └─ metadata           │        │                          │
└────────────────────────┘        └──────────────────────────┘
```

### Fluxo de Dados Principal

#### 1. Clustering de Alunos (Machine Learning)
```
1. Dados dos alunos são importados para o banco
        ↓
2. Script de treinamento (train_clustering.py) processa dados
        ↓
3. K-Means agrupa alunos em 4 clusters baseado em:
   - Média geral
   - Renda familiar
   - Acesso à tecnologia
   - Tempo de deslocamento
   - Segurança alimentar
   - Se trabalha fora
        ↓
4. Modelo salvo como student_clustering_model.pkl
        ↓
5. API carrega modelo e disponibiliza endpoints
        ↓
6. Frontend consulta API via /clustering/predict
        ↓
7. Dashboard exibe grupos, estatísticas e recomendações
```

#### 2. Gestão de Turmas e Alunos
```
1. Professor cria turma via interface
        ↓
2. Frontend envia POST /classes/
        ↓
3. Backend salva no PostgreSQL
        ↓
4. Professor adiciona alunos (individual ou lote)
        ↓
5. Frontend envia POST /students/ ou /bulk/students
        ↓
6. Dados socioeconômicos são registrados
        ↓
7. Sistema calcula estatísticas automaticamente
        ↓
8. Dashboard é atualizado em tempo real
```

---

## 🛠️ Tecnologias

### Frontend
- **Framework**: Next.js 15.0 (App Router)
- **Linguagem**: TypeScript 5.0
- **UI Components**: 
  - Radix UI (componentes acessíveis)
  - Shadcn/ui (design system)
  - Tailwind CSS (estilização)
- **Gráficos**: Recharts
- **Gerenciamento de Estado**: React Context API
- **Ícones**: Lucide React
- **Animações**: Framer Motion

### Backend
- **Framework**: FastAPI 0.121
- **Linguagem**: Python 3.12+
- **ORM**: SQLAlchemy 2.0 (async)
- **Banco de Dados**: PostgreSQL (Supabase)
- **Machine Learning**:
  - scikit-learn (K-Means Clustering)
  - pandas & numpy (análise de dados)
  - joblib (serialização de modelos)
- **Validação**: Pydantic 2.0
- **Server**: Uvicorn (ASGI)
- **Ambiente**: python-dotenv

### DevOps & Tools
- **Versionamento**: Git & GitHub
- **Ambiente**: Python venv
- **Gestão de Pacotes**: npm/pnpm (frontend), pip (backend)
- **Documentação API**: Swagger/OpenAPI (automático via FastAPI)

---

## ✅ Pré-requisitos

### Software Necessário

- **Python**: 3.12 ou superior
- **Node.js**: 18.0 ou superior
- **npm** ou **pnpm**: para gerenciamento de pacotes frontend
- **PostgreSQL**: 14+ (ou conta no Supabase)
- **Git**: para clonar o repositório

### Contas e Serviços

- **Supabase** (recomendado): para banco de dados PostgreSQL gerenciado
- Ou **PostgreSQL local**: instale e configure localmente

---

## 🔧 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/danielvictorb/devimpacto-hackathon.git
cd devimpacto-hackathon
```

### 2. Configuração do Backend

#### 2.1 Criar Ambiente Virtual

```bash
cd backend
python -m venv venv

# Ativar o ambiente (Mac/Linux)
source venv/bin/activate

# Ativar o ambiente (Windows)
.\venv\Scripts\activate
```

#### 2.2 Instalar Dependências

```bash
pip install -r requirements.txt
```

#### 2.3 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
# Database (Supabase ou PostgreSQL local)
# Para PostgreSQL local:
user=seu_usuario
password=sua_senha
host=localhost
port=5432
dbname=sabiar_db

# Para Supabase:
# user=postgres
# password=sua_senha_supabase
# host=db.[PROJECT-ID].supabase.co
# port=5432
# dbname=postgres
```

#### 2.4 Configurar o Banco de Dados

```bash
# Opção 1: Setup automático (recomendado)
chmod +x setup_dashboard_db.sh
./setup_dashboard_db.sh

# Opção 2: Setup manual
python scripts/create_dashboard_tables.py
python scripts/import_dashboard_data.py
python scripts/populate_remaining_tables.py
```

#### 2.5 Treinar o Modelo de Clustering

```bash
python services/train_clustering.py
```

Isso vai gerar o arquivo `models/student_clustering_model.pkl`.

#### 2.6 Iniciar o Servidor Backend

```bash
uvicorn src.main:app --reload
```

🎉 API disponível em: `http://localhost:8000`
📚 Documentação interativa: `http://localhost:8000/docs`

---

### 3. Configuração do Frontend

#### 3.1 Instalar Dependências

```bash
cd frontend/sabiar
npm install
# ou
pnpm install
```

#### 3.2 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `frontend/sabiar/`:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (se estiver usando autenticação)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

#### 3.3 Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
```

🎉 Frontend disponível em: `http://localhost:3000`

---

## 📖 Uso

### Fluxo Básico do Professor

1. **Acesse o sistema**: `http://localhost:3000`

2. **Navegue para o Dashboard**: Clique em "Área do Professo"

3. **Crie uma turma**: 
   - Vá em "Turmas" → "Nova Turma"
   - Preencha nome, série, ano letivo, turno
   - Salve a turma

4. **Adicione alunos**:
   - Na página da turma, adicione alunos
   - Preencha dados pessoais e socioeconômicos
   - Dados socioeconômicos são importantes para análise de clusters
   - Pode adicionar um por vez ou usar importação em lote

5. **Visualize insights**:
   - Vá em "Turmas" → Selecione uma turma → "Insights"
   - Veja estatísticas gerais da turma
   - Visualize gráficos de desempenho
   - Identifique grupos de alunos (clusters)
   - Obtenha recomendações de ação

6. **Crie planos de ação**:
   - Acesse "Planos de Ação"
   - Defina estratégias para cada grupo de alunos
   - Acompanhe o progresso

### Testando a API (cURL)

```bash
# Criar um professor
curl -X POST "http://localhost:8000/teachers/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@escola.com",
    "access_code": "PROF2024"
  }'

# Buscar estatísticas
curl -X GET "http://localhost:8000/statistics/overview"

# Obter clusters de alunos
curl -X GET "http://localhost:8000/clustering/dashboard/example"
```

Para mais exemplos, veja [`backend/QUICK_START.md`](./backend/QUICK_START.md).

---

## 📁 Estrutura do Projeto

```
devimpacto-hackathon/
├── README.md                    # Este arquivo
├── frontend/                    # Aplicação Next.js
│   └── sabiar/
│       ├── app/                 # App Router (páginas)
│       │   ├── page.tsx         # Landing page
│       │   ├── dashboard/       # Área do professor
│       │   │   ├── page.tsx     # Dashboard principal
│       │   │   ├── turmas/      # Gestão de turmas
│       │   │   └── provas/      # Gestão de provas
│       │   └── aluno/           # Área do aluno
│       ├── components/          # Componentes React
│       │   ├── ui/              # Componentes base (Shadcn)
│       │   └── ...              # Componentes específicos
│       ├── lib/                 # Utilitários e configs
│       │   ├── api-client.ts    # Cliente HTTP
│       │   └── supabase.ts      # Cliente Supabase
│       └── public/              # Arquivos estáticos
│
├── backend/                     # API FastAPI
│   ├── src/
│   │   ├── main.py              # Aplicação principal
│   │   ├── database.py          # Configuração do DB
│   │   ├── models.py            # Modelos SQLAlchemy
│   │   ├── models_dashboard.py  # Modelos do dashboard
│   │   ├── routes.py            # Rotas CRUD básicas
│   │   ├── routes_dashboard.py  # Rotas do dashboard
│   │   ├── clustering_routes.py # Rotas de ML
│   │   └── analysis/            # Análise causal
│   │       └── causal_analysis.py
│   ├── models/
│   │   ├── clustering_model.py  # Modelo K-Means
│   │   └── student_clustering_model.pkl  # Modelo treinado
│   ├── scripts/                 # Scripts de setup
│   │   ├── create_dashboard_tables.py
│   │   ├── import_dashboard_data.py
│   │   └── populate_remaining_tables.py
│   ├── services/
│   │   └── train_clustering.py  # Treinamento do modelo
│   ├── utils/                   # Dados de seed
│   │   ├── dados_dashboard.json
│   │   └── relatorio_completo.json
│   ├── requirements.txt         # Dependências Python
│   ├── setup_dashboard_db.sh    # Setup automático
│   └── *.md                     # Documentação técnica
│
└── research/                    # Dados de pesquisa
    ├── cluster.ipynb            # Notebook de análise
    └── dados_alunos.csv         # Dataset inicial
```

---

## 🔌 API Endpoints

### Professores (Teachers)
- `POST /teachers/` - Criar professor
- `GET /teachers/` - Listar professores
- `GET /teachers/{id}` - Buscar professor
- `PUT /teachers/{id}` - Atualizar professor
- `DELETE /teachers/{id}` - Deletar professor

### Turmas (Classes)
- `POST /classes/` - Criar turma
- `GET /classes/` - Listar turmas
- `GET /classes/{id}` - Buscar turma
- `GET /classes/{id}/students` - Listar alunos da turma
- `GET /statistics/classes/{id}` - Estatísticas da turma

### Alunos (Students)
- `POST /students/` - Criar aluno
- `POST /bulk/students` - Criar múltiplos alunos
- `GET /students/` - Listar alunos (paginado)
- `GET /students/{id}` - Buscar aluno
- `GET /search/students` - Buscar com filtros
- `PUT /students/{id}` - Atualizar aluno
- `DELETE /students/{id}` - Deletar aluno

### Clustering (Machine Learning)
- `GET /clustering/` - Health check do modelo
- `GET /clustering/dashboard/example` - Dashboard completo
- `POST /clustering/predict/single` - Predizer cluster de um aluno
- `POST /clustering/predict/batch` - Predizer clusters em lote

### Estatísticas
- `GET /statistics/overview` - Visão geral do sistema
- `GET /statistics/students/{id}` - Estatísticas de um aluno
- `GET /statistics/classes/{id}` - Estatísticas de uma turma



📚 **Documentação completa**: Acesse `http://localhost:8000/docs` com o servidor rodando.

Para detalhes técnicos dos endpoints, consulte:
- [`backend/QUICK_START.md`](./backend/QUICK_START.md)
- [`backend/CLUSTERING_README.md`](./backend/CLUSTERING_README.md)

---

## 📊 Banco de Dados

### Estrutura (11 Tabelas no Supabase)

```sql
-- Gestão Escolar
turmas                    -- Turmas (série, turno, escola)
escolas                   -- Escolas cadastradas

-- Dados dos Alunos
alunos                    -- Informações completas dos alunos
alunos_risco              -- Alunos identificados em situação de risco
distribuicao_faixas       -- Distribuição por faixas de desempenho

-- Clustering e Análise
clusters_globais          -- Clusters gerais do sistema
clusters_turma            -- Clusters específicos por turma
fatores_criticos          -- Fatores que impactam o desempenho

-- Relatórios e Ações
relatorios_gerais         -- Relatórios consolidados
planos_acao               -- Planos de ação para grupos
metadata                  -- Metadados do sistema
```

### Diagrama ERD

Para visualizar o diagrama completo, consulte:
- [`backend/DATABASE_DIAGRAM.md`](./backend/DATABASE_DIAGRAM.md)
- [`backend/DATABASE_SUMMARY.md`](./backend/DATABASE_SUMMARY.md)

---

## 🤖 Machine Learning

### Modelo de Clustering

**Algoritmo**: K-Means (scikit-learn)  
**Número de Clusters**: 4  
**Features utilizadas**:
- Média geral
- Renda familiar
- Acesso à tecnologia
- Tempo de deslocamento
- Segurança alimentar
- Trabalha fora (sim/não)

**Clusters Identificados**:
1. **Alto Risco** (🔴): Baixa renda + baixo desempenho + vulnerabilidades
2. **Risco Moderado** (🟡): Desafios moderados + desempenho médio
3. **Estável** (🟢): Condições favoráveis + bom desempenho
4. **Destaque** (🔵): Alta resiliência + excelente desempenho

**Retreinamento**: Execute `python services/train_clustering.py` quando houver novos dados.

Para mais detalhes: [`backend/CLUSTERING_README.md`](./backend/CLUSTERING_README.md)

---

## 🎨 Design System

### Paleta de Cores

- **🟠 Laranja** (`#d1663d`) - Área do Professor, ações principais
  - Classes CSS: `bg-secondary`, `text-secondary`
- **🔵 Azul Petróleo** (`#294f5c`) - Área do Aluno, elementos secundários
  - Classes CSS: `bg-primary`, `text-primary`

### Componentes UI

- **Sidebar**: Navegação principal com menu colapsável
- **Cards**: Informações em destaque (turmas, estatísticas)
- **Gráficos**: Recharts (LineChart, BarChart, PieChart)
- **Tabelas**: Componentes `data-table` com ordenação e filtros
- **Diálogos**: Modals para ações (criar, editar, deletar)
- **Chatbot**: Assistente IA flutuante (em desenvolvimento)

Para mais detalhes: [`frontend/sabiar/README_SABIAR.md`](./frontend/sabiar/README_SABIAR.md)

---

## 🚀 Deploy

### Frontend (Vercel - Recomendado)

1. **Faça push do código** para o GitHub
2. **Conecte o repositório** no Vercel
3. **Configure o diretório raiz**: `frontend/sabiar`
4. **Adicione variáveis de ambiente**:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Deploy automático** a cada push

### Backend (Railway, Render ou Fly.io)

#### Exemplo com Railway:

1. **Conecte o repositório** no Railway
2. **Configure o root directory**: `backend`
3. **Adicione variáveis de ambiente**:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `GOOGLE_VISION_API_KEY`
4. **Configure o start command**:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port $PORT
   ```
5. **Deploy automático** a cada push

### Banco de Dados (Supabase - Recomendado)

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie a `DATABASE_URL` do projeto
3. Execute os scripts de setup:
   ```bash
   python scripts/create_dashboard_tables.py
   python scripts/import_dashboard_data.py
   ```

---

## 🧪 Testes

### Backend

```bash
# Testar endpoints da API
cd backend
python test_api_endpoints.py

# Testar banco de dados
python scripts/test_database.py

# Testar modelo de clustering
python -c "from models.clustering_model import StudentClusteringModel; m = StudentClusteringModel(); print('✅ Modelo OK')"
```

### Frontend

```bash
cd frontend/sabiar
npm run lint          # Linting
npm run build         # Build de produção (testa compilação)
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o repositório
2. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit suas mudanças**:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```
4. **Push para a branch**:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request**

### Padrões de Commit

Seguimos os padrões de [Conventional Commits](https://www.conventionalcommits.org/) para manter um histórico de commits limpo e semântico.

#### Formato

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

#### Tipos de Commit

- **feat:** Nova funcionalidade para o usuário
  ```bash
  git commit -m "feat: adiciona correção automática de provas"
  git commit -m "feat(dashboard): adiciona gráfico de desempenho por matéria"
  ```

- **fix:** Correção de bug
  ```bash
  git commit -m "fix: corrige erro ao calcular média da turma"
  git commit -m "fix(api): resolve problema de timeout no OCR"
  ```

- **docs:** Mudanças na documentação
  ```bash
  git commit -m "docs: atualiza README com instruções de deploy"
  git commit -m "docs(api): adiciona exemplos de uso dos endpoints"
  ```

- **style:** Formatação, ponto e vírgula faltando, etc (sem mudança de código)
  ```bash
  git commit -m "style: formata código com prettier"
  git commit -m "style(components): ajusta espaçamento dos cards"
  ```

- **refactor:** Refatoração de código (não adiciona features nem corrige bugs)
  ```bash
  git commit -m "refactor: simplifica lógica de cálculo de clusters"
  git commit -m "refactor(database): otimiza queries do dashboard"
  ```

- **perf:** Melhorias de performance
  ```

#### Escopos Comuns

- `api` - Backend/API
- `frontend` ou `ui` - Interface do usuário
- `dashboard` - Dashboard de análise
- `clustering` - Sistema de ML
- `database` ou `db` - Banco de dados
- `docs` - Documentação
- `analysis` - Análise de dados

#### Exemplos Completos

```bash
# Feature completa
git commit -m "feat(clustering): adiciona modelo K-Means para segmentação de alunos

- Implementa treinamento com 4 clusters
- Adiciona endpoint /clustering/predict/single
- Gera dashboard automático com insights"

# Breaking change
git commit -m "feat(api)!: migra autenticação para OAuth2

BREAKING CHANGE: A autenticação básica foi removida.
Agora todos os endpoints requerem token OAuth2."

# Fix com issue referenciada
git commit -m "fix(dashboard): corrige carregamento de gráficos

Resolve problema onde gráficos não eram renderizados
quando a turma não tinha dados suficientes.

Closes #42"
```

#### Regras Gerais

1. **Use o imperativo**: "adiciona" não "adicionado" ou "adicionando"
2. **Não capitalize** a primeira letra da descrição
3. **Sem ponto final** na descrição
4. **Seja conciso**: máximo de 72 caracteres na primeira linha
5. **Use o corpo** para explicações mais detalhadas (opcional)
6. **Referencie issues**: use `Closes #123` ou `Fixes #123` no rodapé

#### Ferramentas Úteis

```bash
# Commitizen (ajuda a criar commits no padrão)
npm install -g commitizen
git cz

# Commitlint (valida se o commit segue o padrão)
npm install --save-dev @commitlint/{config-conventional,cli}
```


---

## 👥 Equipe

Desenvolvido com ❤️ por:

| Nome | E-mail | GitHub |
|------|--------|--------|
| **Daniel Victor** | danielvictorcarneiro21@gmail.com | 
| **Gabriel Carvalho** | ggoc.carvalho@gmail.com | - |
| **Luigi Schmitt** | schmittluigi@gmail.com | - |
| **Miguel Queiroz** | miguel.queiroz.fernandes@gmail.com | - |

**Evento**: Hackathon DevImpacto 2024

---

## 📞 Suporte

- **Documentação Técnica**: Veja os arquivos `.md` na pasta `backend/`
- **Issues**: Abra uma issue no [GitHub](https://github.com/danielvictorb/devimpacto-hackathon/issues)
- **Contato**: Entre em contato com qualquer membro da equipe pelos e-mails acima

---

## 🙏 Agradecimentos

- **DevImpacto** pela organização do hackathon
- **Supabase** pela infraestrutura de banco de dados PostgreSQL
- **Comunidade Open Source** pelas bibliotecas utilizadas (scikit-learn, FastAPI, Next.js, etc.)

**🐦 SabiaR - Transformando educação com inteligência artificial**

Feito para o Hackathon DevImpacto 2024

[⭐ Star no GitHub](https://github.com/danielvictorb/devimpacto-hackathon) | [🐛 Reportar Bug](https://github.com/danielvictorb/devimpacto-hackathon/issues) | [💡 Sugerir Feature](https://github.com/danielvictorb/devimpacto-hackathon/issues)

</div>
