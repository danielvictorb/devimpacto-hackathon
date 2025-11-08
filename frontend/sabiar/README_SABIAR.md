# 🐦 SabiaR - Frontend Documentation

**SabiaR** = Sabiá (pássaro) + Saber (conhecimento) + **R de Reconhecimento** (IA)

Sistema de correção inteligente de provas para professores.

---

## 🎨 Design System

### Cores (Paleta do Passarinho)

- **🟠 Laranja** (`#d1663d`) - Área do Professor, ações principais
- **🔵 Azul Petróleo** (`#294f5c`) - Área do Aluno, elementos secundários

Uso:

- `bg-secondary` / `text-secondary` → Laranja (professor)
- `bg-primary` / `text-primary` → Azul (aluno)

### Logo

- Passarinho SabiaR: `/public/sabiar_icon.png`
- Nome: **Sabia** + [R] em box

---

## 📂 Estrutura de Páginas

### **Públicas**

- `/` - Landing page (Área Professor / Área Aluno)
- `/aluno` - Placeholder área do aluno
- `not-found.tsx` - 404 global

### **Dashboard (Professor)**

- `/dashboard` - Dashboard principal
- `/dashboard/layout.tsx` - **Layout compartilhado** (header + sidebar)

#### Turmas

- `/dashboard/turmas` - Listagem de turmas com cards
- `/dashboard/turmas/[id]/insights` - **Raio-X da Turma** ⭐
  - Gráficos interativos (Recharts)
  - Insights da IA
  - Grupos de alunos (Risco/Intermediário/Destaque)
- `/dashboard/nova-turma` - Formulário de criação

#### Provas

- `/dashboard/provas` - Listagem com busca e filtros
- `/dashboard/nova-prova` - Wizard (Turma → Informações → Gabarito)
  - Opção: Upload (OCR) ou Manual
  - Múltipla escolha: alternativas A, B, C, D, E
  - Dissertativa: rubrica de correção

#### Alunos

- `/dashboard/alunos` - Grid de cards com busca

---

## 🔌 Integração com Backend

### Arquivo de Serviço

`lib/api.ts` - Todas as chamadas à API

### UUID do Professor (Hackathon)

```typescript
export const TEACHER_ID_MOCK = "550e8400-e29b-41d4-a716-446655440000";
```

### Variável de Ambiente

`.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Funções Disponíveis

**Turmas:**

- `criarTurma(data)` → POST /classes/
- `listarTurmas()` → GET /teachers/{id}/classes
- `buscarTurma(id)` → GET /classes/{id}

**Provas:**

- `criarProva(data)` → POST /exams/
- `criarQuestao(data)` → POST /questions/
- `listarProvas()` → GET /exams/?teacher_id={id}
- `buscarProva(id)` → GET /exams/{id}
- `buscarQuestoes(examId)` → GET /exams/{id}/questions

**Alunos:**

- `listarAlunos(classId?)` → GET /students/
- `buscarAluno(id)` → GET /students/{id}

**Insights:**

- `buscarInsightsProva(examId)` → GET /exams/{id}/insights

---

## 🎯 Páginas Já Integradas

✅ **Nova Turma** - Salva no banco  
✅ **Nova Prova** - Salva prova + questões no banco  
✅ **Nova Prova (Step 1)** - Carrega turmas do banco dinamicamente

---

## 📦 Componentes Principais

### shadcn/ui usados:

- `Card`, `Button`, `Input`, `Label`, `Textarea`
- `Select`, `Badge`, `Avatar`, `Table`
- `Tabs`, `Drawer`, `Checkbox`

### Ícones:

- `@tabler/icons-react`

### Gráficos:

- `recharts` (LineChart, BarChart)

---

## 🚀 Como Rodar

### Frontend:

```bash
cd frontend/sabiar
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### Backend (necessário para integração):

```bash
cd backend
python create_tables.py  # Criar tabelas
python seed_data.py      # Criar professor demo
uvicorn src.main:app --reload
```

API: `http://localhost:8000`  
Docs: `http://localhost:8000/docs`

---

## 📊 Fluxo de Dados - Exemplo

### Criar Prova Completa:

**Frontend:**

1. Professor seleciona turma (GET /teachers/{id}/classes)
2. Preenche dados da prova
3. Adiciona questões manualmente
4. Clica em "Criar Prova"

**Backend recebe:**

```json
POST /exams/
{
  "class_id": "uuid-da-turma",
  "teacher_id": "550e8400...",
  "title": "Prova de Matemática",
  "subject": "Matemática",
  "exam_date": "2025-11-20",
  ...
}

Retorna: { "id": "uuid-da-prova", ... }

POST /questions/ (para cada questão)
{
  "exam_id": "uuid-da-prova",
  "question_number": 1,
  "question_type": "multiple_choice",
  "options": {
    "A": "Resposta A",
    "B": "Resposta B",
    "C": "Resposta C",
    "D": "Resposta D"
  },
  "expected_answer": "B",
  "points": 2.0
}
```

---

## 🎯 Para Apresentação do Hackathon

### Demonstrar:

1. **Landing Page** - Design com cores do passarinho
2. **Nova Turma** - Criar turma salva no banco
3. **Nova Prova** - Wizard completo, turmas carregadas do backend
4. **Insights da Turma** - Gráficos interativos ⭐
5. **Busca de Provas** - Filtros em tempo real

### Pitch de Valor:

> "O SabiaR não é só um corretor. É um assistente pedagógico que usa IA de **Reconhecimento** (o R!) para analisar provas dissertativas, gerar insights automáticos e criar um plano de ação. O professor economiza 2 horas de correção manual e ganha dados em tempo real sobre onde a turma teve dificuldade."

---

## 📝 Próximos Passos (Pós-Hackathon)

**Integrar ao Backend:**

- [ ] Dashboard - carregar provas recentes
- [ ] Página Turmas - carregar do banco
- [ ] Página Provas - carregar do banco com filtros
- [ ] Página Alunos - carregar do banco
- [ ] Insights - buscar do backend

**Funcionalidades Novas:**

- [ ] Upload real de gabarito (OCR)
- [ ] Página de correção (revisar sugestões IA)
- [ ] Ver gabarito completo
- [ ] Ver respostas dos alunos
- [ ] Gerar feedbacks individuais
- [ ] Área do Aluno funcional

---

## 🐛 Debug

### Verificar se backend está rodando:

```bash
curl http://localhost:8000/health
```

### Ver professor criado:

```bash
curl http://localhost:8000/teachers/
```

### Ver turmas do professor:

```bash
curl http://localhost:8000/teachers/550e8400-e29b-41d4-a716-446655440000/classes
```

---

## 👥 Equipe

- **Frontend**: Você (Luigi)
- **Backend**: Seu amigo (Daniel)
- **Design**: Passarinho Sabiá 🐦
