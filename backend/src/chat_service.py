"""
Serviço de Chat com OpenAI para o Sabiá
Baseado no test_chat.py, mas adaptado para ser usado como função
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any, AsyncGenerator
from dotenv import load_dotenv
from openai import OpenAI

# Carregar variáveis de ambiente
load_dotenv()

# Caminho para os dados do dashboard
# O arquivo está em frontend/sabiar/lib/dados_dashboard.json
# Do backend/src/, precisamos subir 2 níveis e entrar em frontend/sabiar/lib/
BASE_DIR = Path(__file__).parent.parent.parent
DADOS_DASHBOARD_PATH = BASE_DIR / 'frontend' / 'sabiar' / 'lib' / 'dados_dashboard.json'


def get_system_prompt() -> str:
    """Retorna o system prompt com o contexto do dashboard"""
    try:
        # Carregar dados do dashboard
        with open(DADOS_DASHBOARD_PATH, 'r', encoding='utf-8') as f:
            dados_dashboard = json.load(f)
        
        # Preparar o contexto
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
        
        return system_prompt
    except FileNotFoundError:
        raise FileNotFoundError(f"Arquivo de dados do dashboard não encontrado: {DADOS_DASHBOARD_PATH}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Erro ao decodificar JSON do dashboard: {e}")


def convert_messages_to_openai_format(messages: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """Converte mensagens do formato do AI SDK para o formato da OpenAI"""
    openai_messages = []
    for msg in messages:
        role = msg.get('role')
        content = msg.get('content', '')
        
        # Filtrar apenas user e assistant (ignorar system, que já está no prompt)
        if role in ['user', 'assistant']:
            # Se content é string, usar diretamente
            # Se content é array (formato do AI SDK com parts), extrair o texto
            if isinstance(content, list):
                # Procurar a parte de texto
                text_content = ''
                for part in content:
                    if isinstance(part, dict):
                        # Pode ser {type: 'text', text: '...'} ou {text: '...'}
                        if part.get('type') == 'text':
                            text_content = part.get('text', '')
                            break
                        elif 'text' in part:
                            text_content = part.get('text', '')
                            break
                content = text_content
            elif not isinstance(content, str):
                # Se não for string nem lista, converter para string
                content = str(content)
            
            # Só adicionar se tiver conteúdo
            if content:
                openai_messages.append({
                    'role': role,
                    'content': content
                })
    
    return openai_messages


async def generate_chat_response(
    messages: List[Dict[str, Any]],
    model: str = 'gpt-4.1-2025-04-14'
) -> AsyncGenerator[str, None]:
    """
    Gera resposta do chat com streaming
    
    Args:
        messages: Lista de mensagens no formato do AI SDK
        model: Nome do modelo OpenAI a usar
    
    Yields:
        Chunks de texto da resposta
    """
    # Verificar se a chave da API está configurada
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError('OPENAI_API_KEY não configurada. Configure no arquivo .env')
    
    # Obter system prompt
    system_prompt = get_system_prompt()
    
    # Converter mensagens para formato OpenAI
    openai_messages = convert_messages_to_openai_format(messages)
    
    # Preparar mensagens com system prompt
    formatted_messages = [
        {'role': 'system', 'content': system_prompt}
    ] + openai_messages
    
    # Inicializar cliente OpenAI
    client = OpenAI(api_key=api_key)
    
    # Criar requisição com streaming
    # Nota: A API da OpenAI é síncrona, mas vamos usar em um executor para não bloquear
    import asyncio
    
    # Criar stream síncrono
    stream = client.chat.completions.create(
        model=model,
        messages=formatted_messages,
        stream=True,
        temperature=0.7
    )
    
    # Yield chunks de texto de forma assíncrona
    # Usar executor para não bloquear o event loop
    loop = asyncio.get_event_loop()
    
    def get_next_chunk():
        """Obtém próximo chunk de forma síncrona"""
        try:
            chunk = next(stream)
            if chunk.choices[0].delta.content is not None:
                return chunk.choices[0].delta.content
            return None
        except StopIteration:
            return None
    
    # Processar chunks de forma assíncrona
    while True:
        chunk = await loop.run_in_executor(None, get_next_chunk)
        if chunk is None:
            break
        yield chunk

