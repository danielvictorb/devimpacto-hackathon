#  API Endpoints Completos - Sistema de Correção de Provas

##  Resumo

API REST completa com operações **CRUD** (Create, Read, Update, Delete) para todas as entidades do sistema, além de endpoints de estatísticas, busca e operações em lote.

---

## ‍ TEACHERS (Professores)

###  Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/teachers/` | Criar novo professor |
| `GET` | `/teachers/` | Listar todos os professores (paginado) |
| `GET` | `/teachers/{teacher_id}` | Buscar professor por ID |
| `GET` | `/teachers/{teacher_id}/classes` | Buscar turmas de um professor |
| `GET` | `/teachers/{teacher_id}/statistics` | Estatísticas do professor |
| `PUT` | `/teachers/{teacher_id}` | Atualizar dados do professor |
| `DELETE` | `/teachers/{teacher_id}` | Deletar professor |

#### Exemplo de Request (POST)
```json
{
  "name": "Maria Silva",
  "email": "maria.silva@escola.com",
  "access_code": "PROF2024"
}
```

---

##  CLASSES (Turmas)

###  Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/classes/` | Criar nova turma |
| `GET` | `/classes/` | Listar todas as turmas (paginado) |
| `GET` | `/classes/{class_id}` | Buscar turma por ID |
| `GET` | `/classes/{class_id}/students` | Buscar alunos de uma turma |
| `GET` | `/statistics/classes/{class_id}` | Estatísticas da turma |
| `PUT` | `/classes/{class_id}` | Atualizar dados da turma |
| `DELETE` | `/classes/{class_id}` | Deletar turma |

#### Exemplo de Request (POST)
```json
{
  "teacher_id": "uuid-do-professor",
  "name": "9º Ano A",
  "school_year": 2024
}
```

---

## ‍ STUDENTS (Alunos)

###  Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/students/` | Criar novo aluno |
| `POST` | `/bulk/students` | Criar múltiplos alunos |
| `GET` | `/students/` | Listar todos os alunos (paginado) |
| `GET` | `/students/{student_id}` | Buscar aluno por ID |
| `GET` | `/statistics/students/{student_id}` | Estatísticas do aluno |
| `GET` | `/search/students` | Buscar alunos com filtros |
| `PUT` | `/students/{student_id}` | Atualizar dados do aluno |
| `DELETE` | `/students/{student_id}` | Deletar aluno |
| `DELETE` | `/bulk/students` | Deletar múltiplos alunos |

#### Exemplo de Request (POST)
```json
{
  "class_id": "uuid-da-turma",
  "name": "João Santos",
  "access_code": "ALUNO001",
  "gender": "Masculino",
  "birth_date": "2008-05-15",
  "cpf": "123.456.789-00",
  "has_disability": false,
  "works_outside": false,
  "has_internet": true,
  "has_computer": true,
  "overall_average": 8.5,
  "attendance_percentage": 95.0
}
```

#### Filtros de Busca (`GET /search/students`)
- `name`: Buscar por nome (parcial)
- `class_id`: Filtrar por turma
- `has_disability`: true/false
- `works_outside`: true/false
- `min_average`: Nota mínima
- `max_average`: Nota máxima
- `skip`: Paginação (offset)
- `limit`: Paginação (limite)

**Exemplo:**
```
GET /search/students?name=João&min_average=7.0&has_disability=false&limit=20
```

---

##  EXAMS (Provas) - Comentadas

 **Endpoints comentados no código** (não descomentados conforme solicitado)

```python
# POST /exams/                    - Criar prova
# GET /exams/                     - Listar provas
# GET /exams/{exam_id}            - Buscar prova por ID
```

---

##  QUESTIONS (Questões) - Comentadas

 **Endpoints comentados no código** (não descomentados conforme solicitado)

```python
# POST /questions/                - Criar questão
# GET /exams/{exam_id}/questions  - Listar questões de uma prova
```

---

##  STUDENT EXAMS (Provas dos Alunos) - Comentadas

 **Endpoints comentados no código** (não descomentados conforme solicitado)

```python
# POST /student-exams/                        - Submeter prova
# GET /student-exams/{student_exam_id}        - Buscar prova do aluno
# GET /exams/{exam_id}/student-exams          - Listar provas submetidas
```

---

##  STATISTICS & REPORTS (Estatísticas)

###  Novos Endpoints Criados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/statistics/overview` | Estatísticas gerais do sistema |
| `GET` | `/statistics/classes/{class_id}` | Estatísticas da turma |
| `GET` | `/statistics/students/{student_id}` | Estatísticas do aluno |
| `GET` | `/teachers/{teacher_id}/statistics` | Estatísticas do professor |

#### Exemplo de Response (`GET /statistics/overview`)
```json
{
  "total_teachers": 15,
  "total_classes": 8,
  "total_students": 180,
  "total_exams": 42,
  "timestamp": "2024-11-09T10:30:00"
}
```

#### Exemplo de Response (`GET /statistics/classes/{class_id}`)
```json
{
  "class_id": "uuid-da-turma",
  "class_name": "9º Ano A",
  "student_count": 30,
  "gender_distribution": {
    "Masculino": 15,
    "Feminino": 14,
    "Não informado": 1
  },
  "class_average": 7.8,
  "attendance_average": 92.5,
  "timestamp": "2024-11-09T10:30:00"
}
```

#### Exemplo de Response (`GET /statistics/students/{student_id}`)
```json
{
  "student_id": "uuid-do-aluno",
  "student_name": "João Santos",
  "class_id": "uuid-da-turma",
  "exams_taken": 5,
  "exam_average": 8.2,
  "overall_average": 8.5,
  "math_grade": 8.0,
  "portuguese_grade": 9.0,
  "attendance_percentage": 95.0,
  "has_disability": false,
  "works_outside": false,
  "timestamp": "2024-11-09T10:30:00"
}
```

---

##  SEARCH & FILTERS (Busca Avançada)

###  Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/search/students` | Busca avançada de alunos |
| `GET` | `/search/classes` | Busca avançada de turmas |

#### Filtros para Classes (`GET /search/classes`)
- `name`: Buscar por nome (parcial)
- `teacher_id`: Filtrar por professor
- `grade_level`: Série/ano (ex: "9º Ano")
- `shift`: Turno (Matutino, Vespertino, Noturno)
- `is_active`: true/false
- `skip`: Paginação (offset)
- `limit`: Paginação (limite)

**Exemplo:**
```
GET /search/classes?name=9º&shift=Matutino&is_active=true
```

---

##  BULK OPERATIONS (Operações em Lote)

###  Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/bulk/students` | Criar múltiplos alunos |
| `DELETE` | `/bulk/students` | Deletar múltiplos alunos |

#### Exemplo de Request (POST Bulk)
```json
[
  {
    "class_id": "uuid-da-turma",
    "name": "Aluno 1",
    "access_code": "AL001",
    "overall_average": 8.0
  },
  {
    "class_id": "uuid-da-turma",
    "name": "Aluno 2",
    "access_code": "AL002",
    "overall_average": 7.5
  }
]
```

#### Exemplo de Request (DELETE Bulk)
```json
[
  "uuid-aluno-1",
  "uuid-aluno-2",
  "uuid-aluno-3"
]
```

---

##  UPLOAD

###  Implementado

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/upload-prova/` | Upload de prova para OCR |

#### Exemplo de Request (Multipart Form)
```bash
curl -X POST "http://localhost:8000/upload-prova/" \
  -F "file=@prova.pdf"
```

#### Response
```json
{
  "filename": "abc123-uuid.pdf",
  "original_filename": "prova.pdf",
  "path": "/path/to/temp/abc123-uuid.pdf",
  "size": 1024000,
  "message": "Arquivo salvo com sucesso! Pronto para OCR."
}
```

---

##  Como Testar

### 1. Iniciar o servidor
```bash
cd backend
uvicorn src.main:app --reload
```

### 2. Acessar a documentação interativa
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Testar com cURL

#### Criar Professor
```bash
curl -X POST "http://localhost:8000/teachers/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@escola.com",
    "access_code": "PROF2024"
  }'
```

#### Listar Professores
```bash
curl -X GET "http://localhost:8000/teachers/"
```

#### Estatísticas Gerais
```bash
curl -X GET "http://localhost:8000/statistics/overview"
```

#### Buscar Alunos
```bash
curl -X GET "http://localhost:8000/search/students?min_average=7.0&limit=10"
```

---

##  Resumo de Endpoints por Categoria

| Categoria | Total | GET | POST | PUT | DELETE |
|-----------|-------|-----|------|-----|--------|
| **Teachers** | 7 | 4 | 1 | 1 | 1 |
| **Classes** | 7 | 5 | 1 | 1 | 1 |
| **Students** | 9 | 5 | 2 | 1 | 2 |
| **Statistics** | 4 | 4 | 0 | 0 | 0 |
| **Search** | 2 | 2 | 0 | 0 | 0 |
| **Bulk** | 2 | 0 | 1 | 0 | 1 |
| **Upload** | 1 | 0 | 1 | 0 | 0 |
| **TOTAL** | **32** | **20** | **6** | **3** | **5** |

---

##  Funcionalidades Implementadas

-  CRUD completo para Teachers
-  CRUD completo para Classes
-  CRUD completo para Students
-  Estatísticas gerais do sistema
-  Estatísticas por turma
-  Estatísticas por aluno
-  Estatísticas por professor
-  Busca avançada de alunos com múltiplos filtros
-  Busca avançada de turmas com múltiplos filtros
-  Operações em lote (criar/deletar múltiplos alunos)
-  Upload de arquivos para OCR
-  Validações de dados
-  Tratamento de erros
-  Paginação
-  Relacionamentos entre entidades

---

##  Pronto para Usar!

Todos os endpoints estão funcionais e documentados. Acesse http://localhost:8000/docs para testar interativamente!
