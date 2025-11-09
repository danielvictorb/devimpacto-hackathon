# Módulo de Correção Automática de Provas

Este diretório contém o sistema completo de correção automática de provas discursivas utilizando OCR (Reconhecimento Óptico de Caracteres) e LLM (Large Language Models) para processar, estruturar e avaliar respostas de alunos.

## 📋 Visão Geral

O sistema realiza um pipeline completo de correção automática:

1. **OCR**: Extração de texto de imagens de provas
2. **Limpeza**: Normalização e remoção de ruídos do texto OCR
3. **Estruturação**: Identificação e segmentação de questões e respostas
4. **Correção**: Avaliação automática das respostas discursivas usando LLM

## 📁 Estrutura de Arquivos

### Módulos Principais

#### `gemini.py`
Módulo principal que implementa o pipeline de correção usando Google Gemini API.

**Funções principais:**

- **`parse_ocr_text(ocr_text: str) -> str`**
  - Limpa e normaliza texto extraído do OCR
  - Remove cabeçalhos, rodapés, números de página e ruídos
  - Corrige problemas de hifenização e caracteres mal interpretados
  - Mantém a estrutura original do conteúdo

- **`structure_exam_json(cleaned_text: str, registered_questions: List[Dict]) -> Dict`**
  - Identifica e segmenta questões no texto OCR
  - Associa respostas dos alunos às questões discursivas registradas
  - Suporta questões com número e letra (ex: "1-a", "1-b")
  - Retorna JSON estruturado com questões e respostas

- **`evaluate_answer(student_answer: str, expected_answer: str, max_score: float, question_text: str, step: float) -> Dict`**
  - Avalia uma resposta individual do aluno
  - Compara com o gabarito esperado
  - Retorna nota (arredondada ao passo especificado) e análise breve

- **`evaluate_exam(structured_exam: Dict, answer_key: List[Dict], step: float) -> Dict`**
  - Processa todas as questões discursivas de uma prova
  - Retorna questões corrigidas e nota total

**Configuração:**
- Modelo: `gemini-2.5-flash` (para estruturação e avaliação)
- Temperatura: 0.2 (para respostas consistentes)
- Formato de resposta: JSON forçado

**Requisitos:**
- Variável de ambiente `GEMINI_API_KEY` configurada no arquivo `.env`

#### `google_vision.py`
Módulo para extração de texto de imagens usando Google Cloud Vision API.

**Funções principais:**

- **`transcrever_imagem(image_path: str) -> str`**
  - Processa uma única imagem e retorna o texto extraído
  - Suporta formatos: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.webp`, `.tiff`, `.tif`

- **`transcrever_diretorio(directory_path: str) -> str`**
  - Processa todas as imagens de um diretório em ordem alfabética
  - Concatena o texto de todas as imagens
  - Retorna string única com todo o texto OCR

**Requisitos:**
- Variável de ambiente `GOOGLE_VISION_API` configurada no arquivo `.env`

**Uso:**
```python
from google_vision import transcrever_diretorio

# Processa todas as imagens de um diretório
texto_ocr = transcrever_diretorio("backend/src/temp")
```

### Arquivos de Exemplo

#### `exemplo_uso_gemini.py`
Exemplo básico demonstrando o uso do pipeline completo com dados simulados.

**Funcionalidades:**
- Demonstra as três etapas principais do pipeline
- Usa texto OCR simulado (sem necessidade de imagens reais)
- Inclui funções de teste individual para cada etapa

**Modos de execução:**
```bash
# Pipeline completo
python exemplo_uso_gemini.py completo

# Teste apenas limpeza OCR
python exemplo_uso_gemini.py parse

# Teste apenas estruturação
python exemplo_uso_gemini.py structure
```

#### `exemplo_prova_bilhete.py`
Exemplo completo usando uma prova real sobre bilhete, demonstrando o fluxo completo com OCR real.

**Funcionalidades:**
- Pipeline completo com OCR real de imagens
- Modo simulado (sem necessidade de imagens)
- Demonstração de questões com letras (1-a, 1-b, 1-c, etc.)
- Tratamento de questões objetivas e discursivas

**Modos de execução:**
```bash
# Com OCR real (requer diretório com imagens)
python exemplo_prova_bilhete.py backend/src/temp

# Modo simulado (sem imagens)
python exemplo_prova_bilhete.py simulado

# Modo padrão (tenta backend/src/temp)
python exemplo_prova_bilhete.py
```

**Estrutura do gabarito:**
```python
gabarito = [
    {
        "numero": 1,
        "letra": "a",  # Opcional
        "pergunta": "Texto da pergunta",
        "tipo": "discursiva",  # ou "objetiva"
        "nota_maxima": 2.0,
        "resposta_esperada": "Resposta esperada do gabarito"
    }
]
```

#### `ocr_space.py`
Exemplo simples de uso da API OCR.Space como alternativa ao Google Vision.

**Nota:** Este arquivo é um exemplo básico e não está integrado ao pipeline principal. Serve como referência para uso alternativo de OCR.

**Requisitos:**
- Variável de ambiente `OCR_SPACE_API_KEY` configurada

#### `ocr_prova.py`
Arquivo vazio (reservado para futuras implementações).

## 🔄 Fluxo do Pipeline

```
┌─────────────┐
│   Imagens   │
│   da Prova  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  OCR (Vision)   │ ◄─── google_vision.py
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Texto OCR      │
│   (bruto)       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Limpeza OCR   │ ◄─── gemini.py::parse_ocr_text()
└──────┬─────────┘
       │
       ▼
┌─────────────────┐
│  Estruturação   │ ◄─── gemini.py::structure_exam_json()
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Correção       │ ◄─── gemini.py::evaluate_exam()
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Notas +        │
│  Análises       │
└─────────────────┘
```

## 🚀 Como Usar

### 1. Configuração Inicial

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
GEMINI_API_KEY=sua_chave_gemini_aqui
GOOGLE_VISION_API=sua_chave_vision_aqui
```

### 2. Instalação de Dependências

```bash
pip install google-generativeai google-cloud-vision python-dotenv requests
```

### 3. Uso Básico

```python
from google_vision import transcrever_diretorio
from gemini import parse_ocr_text, structure_exam_json, evaluate_exam

# 1. OCR das imagens
texto_ocr_bruto = transcrever_diretorio("caminho/para/imagens")

# 2. Limpeza
texto_limpo = parse_ocr_text(texto_ocr_bruto)

# 3. Estruturação
questoes_registradas = [
    {
        "numero": 1,
        "letra": "a",  # Opcional
        "pergunta": "Qual é a capital do Brasil?",
        "tipo": "discursiva",
        "nota_maxima": 2.0
    }
]
prova_estruturada = structure_exam_json(texto_limpo, questoes_registradas)

# 4. Correção
gabarito = [
    {
        "numero": 1,
        "letra": "a",
        "resposta_esperada": "Brasília"
    }
]
resultado = evaluate_exam(prova_estruturada, gabarito, step=0.5)

print(f"Nota total: {resultado['nota_total']}")
for q in resultado['questoes_corrigidas']:
    print(f"Questão {q['numero']}: {q['nota']} - {q['analise']}")
```

## 📝 Formato de Dados

### Questões Registradas

```python
{
    "numero": int,           # Número da questão
    "letra": str,            # Opcional: letra da alternativa (a, b, c, etc)
    "pergunta": str,         # Texto da pergunta
    "tipo": str,             # "discursiva" ou "objetiva"
    "nota_maxima": float     # Pontuação máxima
}
```

### Gabarito

```python
{
    "numero": int,           # Deve corresponder à questão
    "letra": str,            # Opcional: deve corresponder à questão
    "resposta_esperada": str # Resposta correta esperada
}
```

### Resultado da Estruturação

```python
{
    "questoes": [
        {
            "numero": int,
            "letra": str,
            "tipo": "discursiva",
            "pergunta": str,
            "nota_maxima": float,
            "resposta_aluno": str  # Resposta extraída do OCR
        }
    ]
}
```

### Resultado da Correção

```python
{
    "questoes_corrigidas": [
        {
            "numero": int,
            "letra": str,
            "nota": float,        # Nota atribuída (arredondada ao step)
            "analise": str        # Análise breve da resposta
        }
    ],
    "nota_total": float           # Soma de todas as notas
}
```

## ⚙️ Configurações Avançadas

### Ajuste do Passo de Notas

O parâmetro `step` controla o arredondamento das notas:

```python
# Notas em passos de 0.5 (0.0, 0.5, 1.0, 1.5, ...)
resultado = evaluate_exam(prova, gabarito, step=0.5)

# Notas em passos de 0.25 (0.0, 0.25, 0.5, 0.75, ...)
resultado = evaluate_exam(prova, gabarito, step=0.25)
```

### Questões com Letras

O sistema suporta questões com subitens identificados por letras:

```python
# Questão 1-a, 1-b, 1-c
questoes = [
    {"numero": 1, "letra": "a", "pergunta": "...", "tipo": "discursiva", "nota_maxima": 2.0},
    {"numero": 1, "letra": "b", "pergunta": "...", "tipo": "discursiva", "nota_maxima": 2.0},
    {"numero": 1, "letra": "c", "pergunta": "...", "tipo": "discursiva", "nota_maxima": 2.0}
]
```

O sistema usa o ID único `numero-letra` para garantir correspondência correta entre questões e respostas.

## 🔍 Tratamento de Erros

O sistema inclui tratamento robusto de erros:

- **OCR falho**: Retorna string vazia ou texto parcial
- **Limpeza falha**: Usa texto pré-processado como fallback
- **Estruturação falha**: Retorna esqueleto com respostas vazias
- **Correção falha**: Atribui nota 0.0 com mensagem de erro

Todas as funções principais incluem retries automáticos com backoff exponencial para chamadas à API.

## 📚 Exemplos Práticos

### Exemplo 1: Prova Simples

```python
from gemini import parse_ocr_text, structure_exam_json, evaluate_exam

texto_ocr = "Questão 1: Explique a fotossíntese.\nResposta: É o processo..."

questoes = [
    {
        "numero": 1,
        "pergunta": "Explique a fotossíntese.",
        "tipo": "discursiva",
        "nota_maxima": 2.0
    }
]

gabarito = [
    {
        "numero": 1,
        "resposta_esperada": "Fotossíntese é o processo onde plantas convertem luz em energia."
    }
]

texto_limpo = parse_ocr_text(texto_ocr)
prova = structure_exam_json(texto_limpo, questoes)
resultado = evaluate_exam(prova, gabarito)
```

### Exemplo 2: Múltiplas Imagens

```python
from google_vision import transcrever_diretorio
from gemini import parse_ocr_text, structure_exam_json, evaluate_exam

# Processa todas as imagens de um diretório
texto_ocr = transcrever_diretorio("provas/aluno_123")

# Continua com o pipeline normal...
```

## 🛠️ Troubleshooting

### Erro: "GEMINI_API_KEY não encontrada"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que a variável está escrita corretamente: `GEMINI_API_KEY=...`

### Erro: "GOOGLE_VISION_API não encontrada"
- Verifique se o arquivo `.env` existe
- Confirme que a variável está escrita corretamente: `GOOGLE_VISION_API=...`

### OCR retorna texto vazio
- Verifique a qualidade das imagens
- Confirme que as imagens estão em formato suportado
- Verifique se a API key está válida e com créditos

### Questões não são identificadas corretamente
- Verifique se o formato das questões no OCR corresponde ao esperado
- Confirme que os números e letras das questões estão corretos no gabarito
- Use o modo de debug para ver o texto limpo antes da estruturação

## 📄 Licença

Este módulo faz parte do projeto DevImpacto Hackathon.

## 🤝 Contribuindo

Para adicionar novas funcionalidades ou melhorar o sistema:

1. Mantenha a estrutura modular
2. Adicione tratamento de erros robusto
3. Inclua exemplos de uso
4. Documente mudanças significativas

