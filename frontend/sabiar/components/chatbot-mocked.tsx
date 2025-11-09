"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconSend, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatBotMockedProps {
  initialMessage?: string | null;
}

// Respostas mockadas baseadas em palavras-chave
const getMockedResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("programa de reforço alimentar") || lowerMessage.includes("alimentar")) {
    return `Ótima escolha! O Programa de Reforço Alimentar é fundamental para o desempenho dos alunos. Vou ajudá-lo a estruturar a implementação.

📊 **Análise da Situação:**
Com base nos dados, identificamos 74 alunos com insegurança alimentar (41.1% do total). Essa condição impacta diretamente a concentração, frequência e desempenho acadêmico.

🎯 **Plano de Implementação em 3 Fases:**

**FASE 1 - Diagnóstico e Parcerias (Semanas 1-2)**
• Realizar levantamento detalhado das famílias em vulnerabilidade
• Fazer parceria com a Secretaria de Assistência Social
• Mapear fornecedores locais de alimentos e bancos de alimentos
• Identificar espaço para armazenamento adequado

**FASE 2 - Implementação Inicial (Semanas 3-4)**
• Implementar café da manhã reforçado para todos os alunos
• Iniciar distribuição de cestas básicas para as 30 famílias mais vulneráveis
• Treinar equipe da cozinha para preparo adequado
• Estabelecer sistema de acompanhamento nutricional

**FASE 3 - Expansão e Sustentabilidade (Mês 2-3)**
• Estabelecer parceria permanente com banco de alimentos
• Criar horta comunitária com participação dos alunos
• Implementar programa de educação alimentar
• Monitorar impacto na frequência e desempenho

💰 **Recursos Necessários:**
• Investimento inicial: R$ 15.000 (equipamentos e estoque)
• Custo mensal: R$ 45.000 (alimentação + cestas básicas)
• Recursos humanos: 1 nutricionista + 2 cozinheiros adicionais

📈 **Indicadores de Sucesso:**
• Taxa de presença dos alunos beneficiados (+15% esperado)
• Evolução do IMC dos estudantes
• Notas em avaliações de concentração
• Feedback qualitativo das famílias
• Redução de evasão escolar

Posso preparar um documento detalhado com cronograma, orçamento e modelos de ofícios para as parcerias. Gostaria que eu comece por alguma fase específica?`;
  }
  
  if (lowerMessage.includes("apoio para alunos trabalhadores") || lowerMessage.includes("trabalhadores") || lowerMessage.includes("trabalham")) {
    return `Excelente! Vamos trabalhar juntos no programa de apoio aos 84 alunos que trabalham (46.7% dos estudantes). Esta é uma das nossas prioridades máximas.

📊 **Análise da Situação Atual:**
Os alunos trabalhadores apresentam:
• 60% maior taxa de faltas comparado aos demais
• Média 2.5 pontos abaixo dos não trabalhadores
• Dificuldade em participar de atividades no contraturno
• Cansaço físico e mental que prejudica a concentração

🎯 **Plano de Ação Estratégico:**

**1. FLEXIBILIZAÇÃO DE HORÁRIOS**
• Oferecer aulas de reforço aos sábados pela manhã (8h-12h)
• Disponibilizar gravações das aulas em plataforma online
• Criar banco de materiais didáticos acessível 24/7
• Permitir entrega de trabalhos com prazos estendidos

**2. PARCERIAS COM EMPREGADORES**
• Negociar liberação de 2h/semana para estudos
• Propor estágios educativos formalizados no lugar de trabalhos informais
• Criar programa de incentivo fiscal para empresas que apoiam
• Estabelecer convênio com comércio local

**3. MONITORIA ENTRE PARES**
• Conectar alunos trabalhadores com monitores voluntários
• Criar grupos de WhatsApp por disciplina para dúvidas
• Implementar sistema de "buddy" para apoio mútuo
• Organizar grupos de estudo flexíveis

**4. APOIO MATERIAL E PSICOSSOCIAL**
• Disponibilizar vale-transporte para casos críticos
• Oferecer lanche noturno para quem estuda após o trabalho
• Acompanhamento psicológico para gestão de estresse
• Orientação profissional e planejamento de carreira

💰 **Recursos Necessários:**
• Custo mensal: R$ 15.000
• Plataforma online: R$ 3.000 (setup) + R$ 500/mês
• Vale-transporte: R$ 5.000/mês (casos prioritários)

📈 **Metas e Indicadores:**
• Reduzir taxa de abandono em 40% (próximos 6 meses)
• Melhorar média geral em 1.5 pontos
• Aumentar frequência para 85%+ 
• 100% dos alunos com acesso a materiais digitais

Posso elaborar as cartas modelo para as empresas empregadoras e também preparar o material didático adaptado. Deseja que eu comece pelos 12 alunos em situação mais crítica (média < 3.0 e trabalham 20h+)?`;
  }

  if (lowerMessage.includes("inclusão digital") || lowerMessage.includes("internet") || lowerMessage.includes("computador")) {
    return `Perfeito! Vamos democratizar o acesso digital para os 41 alunos sem internet (22.8% dos estudantes). Isso é crucial para a equidade educacional no século XXI.

📊 **Diagnóstico Detalhado:**
• 41 alunos sem acesso à internet em casa
• 28 possuem smartphone mas sem plano de dados
• 13 não têm nenhum dispositivo digital
• Impacto: dificuldade em pesquisas, trabalhos e aulas online

🎯 **Plano de Inclusão Digital:**

**FASE 1 - Diagnóstico Aprofundado (Semana 1)**
• Mapear quais alunos têm smartphone mas não internet
• Identificar alunos sem dispositivo algum
• Avaliar cobertura de sinal nas comunidades
• Levantar interesse em curso básico de informática

**FASE 2 - Conectividade (Semanas 2-4)**
• Negociar com operadoras pacote educacional (4GB/mês)
• Instalar WiFi comunitário em 3 pontos estratégicos próximos à escola
• Estabelecer parceria com lan houses para uso educacional (2h/dia gratuitas)
• Disponibilizar chips subsidiados para os 28 alunos com smartphone

**FASE 3 - Equipamentos (Mês 2)**
• Emprestar 15 tablets da escola em regime de comodato
• Buscar doação de notebooks usados de empresas parceiras
• Criar laboratório de informática com horário estendido (até 20h)
• Implementar sistema de reserva online do laboratório

**FASE 4 - Capacitação (Mês 2-3)**
• Curso básico de informática (20h)
• Oficinas de uso de plataformas educacionais
• Orientação sobre segurança digital
• Suporte técnico permanente

💰 **Investimento:**
• Inicial: R$ 25.000 (equipamentos e infraestrutura WiFi)
• Mensal: R$ 8.000 (internet + manutenção + chips)
• Parcerias: Redução de 40% dos custos

🤝 **Parceiros Potenciais:**
• TIM/Vivo: Programa TIM faz Ciência
• Prefeitura: Programa Municipal de Inclusão Digital
• Instituto Conecta: Doação de equipamentos recondicionados
• CDI (Comitê para Democratização da Informática)

📈 **Indicadores de Sucesso:**
• 100% dos alunos com acesso à internet (própria ou comunitária)
• Aumento de 80% nas entregas de trabalhos digitais
• Engajamento em plataformas educacionais
• Melhoria nas notas de disciplinas que usam tecnologia

Já identifiquei contatos em 3 operadoras e 2 ONGs. Posso preparar as cartas de solicitação e projeto técnico detalhado. Por onde você prefere começar?`;
  }

  if (lowerMessage.includes("transporte") || lowerMessage.includes("deslocamento")) {
    return `Ótimo! Vamos otimizar o transporte para reduzir o tempo de deslocamento dos 72 alunos afetados (40% dos estudantes). Tempo é aprendizado!

📊 **Análise da Situação Atual:**
• Tempo médio de deslocamento: 49 minutos (apenas ida)
• 12 alunos levam mais de 90 minutos (ida + volta = 3h/dia!)
• Principal impacto: chegam cansados e perdem aulas de reforço
• 8 alunos em risco de evasão devido à distância

🎯 **Plano de Otimização de Transporte:**

**1. REAVALIAÇÃO DE ROTAS (Imediato - Semana 1)**
• Usar geolocalização dos endereços dos alunos
• Contratar consultoria de logística (custo: R$ 3.000)
• Propor 2 novas rotas que reduzem 20min em média
• Negociar com Secretaria de Educação implementação

**2. CARONA SOLIDÁRIA (Semana 2-3)**
• Criar grupos de famílias por bairro/região
• Sistema de rodízio organizado entre pais
• App de coordenação (pode usar WhatsApp + planilha compartilhada)
• Seguro coletivo para veículos participantes

**3. VALE-TRANSPORTE (Casos Críticos)**
• Disponibilizar para 15 alunos mais distantes
• Priorizar quem está em risco de evasão
• Custo estimado: R$ 20.000/mês
• Parceria com prefeitura para subsídio de 50%

**4. AJUSTES DE HORÁRIO**
• Permitir entrada flexível (tolerância de 15min)
• Disponibilizar café da manhã para quem chega cedo
• Aulas de reforço online para quem não pode ficar após horário

💰 **Recursos Necessários:**
• Consultoria de rotas: R$ 3.000 (uma vez)
• Vale-transporte: R$ 20.000/mês (com subsídio = R$ 10.000)
• Seguro carona solidária: R$ 2.000/mês
• Total mensal: R$ 12.000

📈 **Impacto Esperado:**
• Redução do tempo médio de 49min para 30min (-40%)
• Isso representa 38 minutos/dia a mais de descanso ou estudo
• 950 horas/ano economizadas por aluno
• Redução de 70% no risco de evasão dos casos críticos

🗺️ **Mapa de Ação:**
Vou preparar:
• Mapa otimizado das rotas com geolocalização
• Ofício para Secretaria de Educação (modelo pronto)
• Termo de adesão da carona solidária (com seguro)
• Planilha de custos detalhada do vale-transporte
• Cronograma de implementação (4 semanas)

Posso começar o mapeamento imediatamente. Você tem acesso aos endereços completos dos alunos? Se sim, em 48h tenho as rotas otimizadas prontas!`;
  }

  // Resposta padrão
  return `Entendi sua questão! Como assistente educacional do SabiaR, estou aqui para ajudar com:

🎯 **Áreas que posso auxiliar:**
• Implementação de planos de ação pedagógicos
• Análise de dados dos alunos e vulnerabilidades
• Estratégias para reduzir evasão escolar
• Otimização de recursos educacionais
• Acompanhamento de alunos em risco
• Parcerias com comunidade e organizações

📊 Temos dados detalhados de 180 alunos distribuídos em 3 perfis identificados por análise de clustering:
• Cluster 1 (42%): Alta vulnerabilidade - Necessita apoio integral
• Cluster 2 (22%): Vulnerabilidade moderada - Reforço pontual
• Cluster 3 (9%): Bom desempenho - Enriquecimento curricular

💡 **Principais desafios identificados:**
• 55 alunos em risco alto (30.6%)
• 84 alunos que trabalham (46.7%)
• 74 com insegurança alimentar (41.1%)
• 72 com deslocamento longo (40%)
• 41 sem acesso à internet (22.8%)

Como posso ajudá-lo especificamente? Gostaria de discutir algum desses desafios ou outro tópico relacionado à gestão escolar?`;
};

export function ChatBotMocked({ initialMessage }: ChatBotMockedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const hasInitialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Simular streaming de texto
  const streamText = async (text: string, userMessageId: string) => {
    setIsTyping(true);
    setStreamingContent("");

    // Criar mensagem do assistente
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Simular streaming palavra por palavra com timing mais natural
    const words = text.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      // Timing mais natural, como se estivesse realmente pensando/gerando
      await new Promise((resolve) => setTimeout(resolve, 35 + Math.random() * 30));
      currentText += (i > 0 ? " " : "") + words[i];
      setStreamingContent(currentText);

      // Atualizar mensagem a cada 5 palavras para streaming fluido
      if (i % 5 === 0 || i === words.length - 1) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: currentText, isStreaming: i < words.length - 1 }
              : msg
          )
        );
      }
    }

    setStreamingContent("");
    setIsTyping(false);
  };

  // Enviar mensagem inicial automaticamente
  useEffect(() => {
    if (initialMessage && messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: initialMessage,
        timestamp: new Date(),
      };

      setMessages([userMessage]);

      // Responder após um pequeno delay
      setTimeout(() => {
        const response = getMockedResponse(initialMessage);
        streamText(response, userMessage.id);
      }, 800);
    }
  }, [initialMessage]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Responder após um delay
    setTimeout(() => {
      const response = getMockedResponse(input);
      streamText(response, userMessage.id);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-primary/10">
                    <Image
                      src="/sab.png"
                      alt="SabiaR"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Customizar elementos do markdown
                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-1 mb-1" {...props} />,
                        p: ({ node, ...props }) => <p className="my-1 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        code: ({ node, inline, ...props }: any) => 
                          inline ? (
                            <code className="bg-primary/10 px-1 py-0.5 rounded text-xs" {...props} />
                          ) : (
                            <code className="block bg-primary/10 p-2 rounded text-xs my-2" {...props} />
                          ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-primary pl-3 my-2 italic" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">
                    {message.content}
                  </p>
                )}
                <span className="mt-2 block text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.role === "user" && (
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback>
                    <IconUser className="size-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && streamingContent === "" && (
            <div className="flex gap-3 justify-start">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-primary/10">
                  <Image
                    src="/sab.png"
                    alt="SabiaR"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="size-2 animate-bounce rounded-full bg-primary/50"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-2 animate-bounce rounded-full bg-primary/50"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="size-2 animate-bounce rounded-full bg-primary/50"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Faça uma pergunta sobre educação..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="shrink-0"
          >
            <IconSend className="size-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          💡 Assistente educacional com respostas baseadas nos dados da escola
        </p>
      </div>
    </div>
  );
}
