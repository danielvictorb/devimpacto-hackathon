"""
Script de teste para verificar a resposta da OpenAI com contexto completo
Usa o cliente oficial da OpenAI para garantir compatibilidade

Uso:
    python test_chat.py "Qual é o desempenho geral da escola?"
    
Ou com variável de ambiente:
    OPENAI_API_KEY=sua-chave python test_chat.py
"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Carregar variáveis de ambiente
# Tenta carregar de frontend/.env.local
env_path = Path(__file__).parent.parent / '.env.local'
if env_path.exists():
    load_dotenv(env_path)
else:
    # Tenta carregar do diretório atual
    load_dotenv()

def testar_chat(pergunta: str):
    """Testa o chat com contexto completo do dashboard"""
    try:
        # Verificar se a chave da API está configurada
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key:
            print('❌ Erro: Chave da API OpenAI não configurada!')
            print('Configure uma das opções:')
            print('1. Crie um arquivo .env.local na pasta frontend/ com:')
            print('   OPENAI_API_KEY=sua-chave-aqui')
            print('2. Ou defina a variável de ambiente:')
            print('   export OPENAI_API_KEY=sua-chave-aqui')
            sys.exit(1)

        print('✅ Chave da API encontrada')
        print('📊 Carregando dados do dashboard...')
        
        # Carregar dados do dashboard
        dados_path = Path(__file__).parent / 'lib' / 'dados_dashboard.json'
        with open(dados_path, 'r', encoding='utf-8') as f:
            dados_dashboard = json.load(f)
        
        # Preparar o contexto (igual ao route.ts)
        contexto_dashboard = json.dumps(dados_dashboard, indent=2, ensure_ascii=False)
        
        # System prompt (igual ao route.ts)
        system_prompt = f"""Você é o Sabiá, um assistente pedagógico especializado em educação e análise de dados escolares. Você trabalha como assistente do diretor da escola e tem acesso completo aos dados e análises do dashboard escolar.

Sua personalidade:
- Você é amigável, profissional e prestativo
- Você fala de forma clara e objetiva
- Você é especialista em interpretar dados educacionais
- Você ajuda o diretor a tomar decisões baseadas em evidências

Você tem acesso aos seguintes dados do dashboard:
{contexto_dashboard}

Com base nesses dados, você pode:
- Fornecer informações sobre turmas, alunos e desempenho
- Analisar estatísticas e tendências
- Identificar fatores críticos que impactam o aprendizado
- Explicar os clusters de alunos e suas características
- Fornecer insights sobre o desempenho geral da escola
- Responder perguntas específicas sobre alunos, turmas ou indicadores

Sempre baseie suas respostas nos dados fornecidos. Se não tiver informação suficiente nos dados, seja honesto sobre isso. Use os dados para dar respostas precisas e acionáveis.

IMPORTANTE: Mantenha o contexto da conversa anterior. Se o diretor fizer perguntas de acompanhamento ou referências a mensagens anteriores, use o histórico da conversa para dar respostas coerentes e contextualizadas."""

        print('🤖 Enviando pergunta para OpenAI...')
        print(f'📝 Pergunta: "{pergunta}"\n')
        print('─' * 80)
        print('💬 Resposta do Sabiá:\n')

        # Inicializar cliente OpenAI
        client = OpenAI(api_key=api_key)
        
        # Usar o mesmo modelo do route.ts
        model_name = 'gpt-4.1-2025-04-14'

        # Criar a requisição com streaming
        stream = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    'role': 'system',
                    'content': system_prompt
                },
                {
                    'role': 'user',
                    'content': pergunta
                }
            ],
            stream=True,
            temperature=0.7
        )

        # Mostrar a resposta em streaming
        resposta_completa = ''
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                conteudo = chunk.choices[0].delta.content
                print(conteudo, end='', flush=True)
                resposta_completa += conteudo

        print('\n')
        print('─' * 80)
        print('✅ Resposta completa recebida!')
        print(f'📏 Tamanho da resposta: {len(resposta_completa)} caracteres')
        
        # Fazer uma segunda chamada para obter estatísticas de uso (sem streaming)
        response_stats = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    'role': 'system',
                    'content': system_prompt
                },
                {
                    'role': 'user',
                    'content': pergunta
                }
            ],
            stream=False
        )
        
        if response_stats.usage:
            print('\n📊 Uso de tokens:')
            print(f'   - Prompt: {response_stats.usage.prompt_tokens} tokens')
            print(f'   - Completion: {response_stats.usage.completion_tokens} tokens')
            print(f'   - Total: {response_stats.usage.total_tokens} tokens')

    except FileNotFoundError as e:
        print(f'❌ Erro: Arquivo não encontrado: {e}')
        print('Certifique-se de que o arquivo lib/dados_dashboard.json existe')
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f'❌ Erro ao decodificar JSON: {e}')
        sys.exit(1)
    except Exception as error:
        print(f'❌ Erro ao testar chat: {error}')
        if hasattr(error, 'response'):
            print(f'Detalhes: {error.response}')
        sys.exit(1)


if __name__ == '__main__':
    # Obter pergunta da linha de comando ou usar padrão
    pergunta = sys.argv[1] if len(sys.argv) > 1 else 'Qual é o desempenho geral da escola? Quais são os principais desafios?'
    
    print('🧪 Teste do Chat Sabiá com OpenAI\n')
    print('=' * 80)
    testar_chat(pergunta)
