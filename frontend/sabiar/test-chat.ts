/**
 * Script de teste para verificar a resposta da OpenAI com contexto completo
 * 
 * Uso:
 *   npx tsx test-chat.ts "Qual é o desempenho geral da escola?"
 */

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import dadosDashboard from './lib/dados_dashboard.json';
import { config } from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente
try {
  config({ path: resolve(process.cwd(), '../.env.local') });
} catch (e) {
  console.warn('Não foi possível carregar .env.local, usando variáveis de ambiente do sistema');
}

async function testarChat(pergunta: string) {
  try {
    // Verificar se a chave da API está configurada
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ Erro: Chave da API OpenAI não configurada!');
      console.error('Crie um arquivo .env.local na pasta frontend/ com:');
      console.error('OPENAI_API_KEY=sua-chave-aqui');
      process.exit(1);
    }

    console.log('✅ Chave da API encontrada');
    console.log('📊 Carregando dados do dashboard...');
    
    // Preparar o contexto com os dados do dashboard (igual ao route.ts)
    const contextoDashboard = JSON.stringify(dadosDashboard, null, 2);
    
    // System prompt (igual ao route.ts)
    const systemPrompt = `Você é o Sabiá, um assistente pedagógico especializado em educação e análise de dados escolares. Você trabalha como assistente do diretor da escola e tem acesso completo aos dados e análises do dashboard escolar.

Sua personalidade:
- Você é amigável, profissional e prestativo
- Você fala de forma clara e objetiva
- Você é especialista em interpretar dados educacionais
- Você ajuda o diretor a tomar decisões baseadas em evidências

Você tem acesso aos seguintes dados do dashboard:
${contextoDashboard}

Com base nesses dados, você pode:
- Fornecer informações sobre turmas, alunos e desempenho
- Analisar estatísticas e tendências
- Identificar fatores críticos que impactam o aprendizado
- Explicar os clusters de alunos e suas características
- Fornecer insights sobre o desempenho geral da escola
- Responder perguntas específicas sobre alunos, turmas ou indicadores

Sempre baseie suas respostas nos dados fornecidos. Se não tiver informação suficiente nos dados, seja honesto sobre isso. Use os dados para dar respostas precisas e acionáveis.`;

    console.log('🤖 Enviando pergunta para OpenAI...');
    console.log(`📝 Pergunta: "${pergunta}"\n`);
    console.log('─'.repeat(80));
    console.log('💬 Resposta do Sabiá:\n');

    // Usar o mesmo modelo do route.ts
    const modelName = 'gpt-4o-mini';

    // Gerar resposta com streaming
    const result = streamText({
      model: openai(modelName),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: pergunta,
        },
      ],
    });

    // Mostrar a resposta em streaming (como no frontend)
    let respostaCompleta = '';
    for await (const textChunk of result.textStream) {
      process.stdout.write(textChunk);
      respostaCompleta += textChunk;
    }

    console.log('\n');
    console.log('─'.repeat(80));
    console.log('✅ Resposta completa recebida!');
    console.log(`📏 Tamanho da resposta: ${respostaCompleta.length} caracteres`);

    // Mostrar informações adicionais
    const text = await result.text;
    const usage = await result.usage;
    
    if (usage) {
      console.log('\n📊 Uso de tokens:');
      console.log(`   - Prompt: ${usage.promptTokens} tokens`);
      console.log(`   - Completion: ${usage.completionTokens} tokens`);
      console.log(`   - Total: ${usage.totalTokens} tokens`);
    }

  } catch (error) {
    console.error('❌ Erro ao testar chat:', error);
    if (error instanceof Error) {
      console.error('Mensagem:', error.message);
    }
    process.exit(1);
  }
}

// Obter pergunta da linha de comando ou usar padrão
const pergunta = process.argv[2] || 'Qual é o desempenho geral da escola? Quais são os principais desafios?';

console.log('🧪 Teste do Chat Sabiá com OpenAI\n');
console.log('='.repeat(80));
testarChat(pergunta);

