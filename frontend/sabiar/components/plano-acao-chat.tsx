"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconSend, IconSparkles, IconUser } from "@tabler/icons-react";
import Image from "next/image";

interface PlanoAcao {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  acoes: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PlanoAcaoChatProps {
  plano: PlanoAcao;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanoAcaoChat({ plano, open, onOpenChange }: PlanoAcaoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Respostas mockadas do SabiaR baseadas no plano de ação
  const getMockedResponses = (planoTitulo: string): string[] => {
    const responses: Record<string, string[]> = {
      "Programa de Reforço Alimentar": [
        "Ótima escolha! O Programa de Reforço Alimentar é fundamental para o desempenho dos alunos. Vou ajudá-lo a estruturar a implementação.",
        "Com base nos dados, identificamos 74 alunos com insegurança alimentar. Vou sugerir um cronograma de implementação em 3 fases:\n\n**Fase 1 (Semana 1-2):**\n• Realizar levantamento detalhado das famílias em vulnerabilidade\n• Fazer parceria com a Secretaria de Assistência Social\n• Mapear fornecedores locais de alimentos\n\n**Fase 2 (Semana 3-4):**\n• Implementar café da manhã reforçado para todos os alunos\n• Iniciar distribuição de cestas básicas para as 30 famílias mais vulneráveis\n\n**Fase 3 (Mês 2-3):**\n• Estabelecer parceria com banco de alimentos\n• Criar horta comunitária com participação dos alunos\n• Monitorar impacto na frequência e desempenho",
        "Recomendo também criar um sistema de acompanhamento. Posso ajudar a configurar indicadores de:\n• Taxa de presença dos alunos beneficiados\n• Evolução do IMC\n• Notas em avaliações de concentração\n• Feedback das famílias\n\nGostaria que eu preparasse um documento com o plano detalhado e orçamento?",
      ],
      "Apoio para Alunos Trabalhadores": [
        "Excelente! Vamos trabalhar juntos no programa de apoio aos 84 alunos que trabalham. Esta é uma das nossas prioridades.",
        "Analisando os dados, esses alunos têm:\n• 60% maior taxa de faltas\n• Média 2.5 pontos abaixo dos demais\n• Dificuldade em participar de atividades no contraturno\n\nMinha sugestão de ações imediatas:\n\n**1. Flexibilização de Horários**\n• Oferecer aulas de reforço aos sábados (manhã)\n• Disponibilizar gravações das aulas\n• Criar banco de materiais online acessível 24/7\n\n**2. Parcerias com Empregadores**\n• Negociar liberação 2h/semana para estudos\n• Propor estágios educativos no lugar de trabalhos informais\n\n**3. Monitoria entre Pares**\n• Conectar alunos trabalhadores com monitores\n• Criar grupos de WhatsApp por disciplina",
        "Posso ajudar a elaborar cartas modelo para as empresas empregadoras e também preparar o material didático adaptado. Deseja que eu comece pelos alunos em situação mais crítica? Tenho 12 alunos identificados com média abaixo de 3.0 que trabalham mais de 20h/semana.",
      ],
      "Programa de Inclusão Digital": [
        "Perfeito! Vamos democratizar o acesso digital para os 41 alunos sem internet. Isso é crucial para a equidade educacional.",
        "Baseado na análise, aqui está meu plano de ação:\n\n**Fase 1 - Diagnóstico (Semana 1)**\n• Mapear quais alunos têm smartphone mas não têm internet\n• Identificar alunos sem nenhum dispositivo\n• Avaliar cobertura de sinal nas comunidades\n\n**Fase 2 - Conexão (Semana 2-4)**\n• Negociar com operadoras pacote educacional (4GB/mês)\n• Instalar WiFi comunitário em pontos estratégicos\n• Estabelecer parceria com 3 lan houses próximas\n\n**Fase 3 - Equipamentos (Mês 2)**\n• Emprestar 15 tablets da escola em regime de comodato\n• Buscar doação de notebooks usados (empresas parceiras)\n• Criar laboratório com horário estendido até 20h",
        "Já identifiquei possíveis parceiros:\n• TIM/Vivo: programa TIM faz Ciência\n• Prefeitura: programa de inclusão digital\n• Instituto Conecta: doação de equipamentos\n\nO investimento estimado é de R$ 25.000 inicial + R$ 8.000/mês. Posso preparar as cartas de solicitação e projeto técnico. Começamos?",
      ],
      "Otimização de Transporte Escolar": [
        "Ótimo! Vamos otimizar o transporte para reduzir o tempo de deslocamento dos 72 alunos afetados. Tempo é aprendizado!",
        "Análise da situação atual:\n• Tempo médio de deslocamento: 49 minutos\n• 12 alunos levam mais de 90 minutos (ida+volta)\n• Principal impacto: chegam cansados e perdem aulas de reforço\n\n**Plano de Otimização:**\n\n**1. Reavaliação de Rotas (Imediato)**\n• Usar geolocalização dos alunos para otimizar trajetos\n• Propor 2 novas rotas que reduzem 20min em média\n• Negociar com Secretaria de Educação\n\n**2. Carona Solidária (Semana 2)**\n• Criar grupo de famílias por bairro\n• Sistema de rodízio organizado\n• App de coordenação (pode usar WhatsApp)\n\n**3. Vale-Transporte (Casos Críticos)**\n• Disponibilizar para 15 alunos mais distantes\n• Priorizar quem está em risco de evasão",
        "Vou preparar:\n• Mapa otimizado das rotas\n• Ofício para Secretaria de Educação\n• Termo de adesão da carona solidária\n• Planilha de custos do vale-transporte\n\nCom essas ações, estimamos reduzir o tempo médio para 30 minutos. Isso representa 38 minutos/dia a mais de descanso ou estudo! Posso começar o mapeamento?",
      ],
      "Apoio Socioemocional e Familiar": [
        "Excelente escolha! O apoio socioemocional é a base para o sucesso acadêmico dos 55 alunos em risco alto. Vamos cuidar deles!",
        "Situação identificada:\n• 55 alunos com múltiplos fatores de risco\n• 40% relatam ambiente familiar tenso\n• 65% nunca tiveram acompanhamento psicológico\n\n**Plano de Acolhimento:**\n\n**1. Atendimento Psicológico (Imediato)**\n• Ampliar de 1 para 3 psicólogos\n• Atendimento individual semanal para casos críticos\n• Grupos de apoio quinzenais por perfil\n\n**2. Aproximação Familiar (Semana 1-4)**\n• Reuniões com famílias dos 55 alunos prioritários\n• Escuta ativa das necessidades\n• Orientação sobre como apoiar nos estudos\n\n**3. Rede de Apoio (Contínuo)**\n• Criar grupos de pais por cluster\n• WhatsApp para comunicação direta\n• Visitas domiciliares mensais",
        "Também sugiro ações complementares:\n• Parceria com CAPS para casos que precisam de acompanhamento especializado\n• Oficinas de parentalidade positiva\n• Criação de espaço de acolhimento na escola\n\nOs dados mostram que alunos com apoio familiar adequado têm 3x mais chance de melhorar o desempenho. Vou preparar o cronograma de reuniões familiares. Por onde começamos?",
      ],
      "Programa de Nivelamento por Cluster": [
        "Perfeito! Vamos personalizar a educação com base nos 3 perfis identificados pelo clustering. Cada aluno é único!",
        "Análise dos Clusters:\n\n**Cluster 1 (76 alunos - Crítico)**\n• Média: 1.55\n• Perfil: Alta vulnerabilidade socioeconômica\n• Ação: Reforço intensivo + apoio integral\n\n**Cluster 2 (39 alunos - Atenção)**\n• Média: 5.43\n• Perfil: Vulnerabilidade moderada\n• Ação: Reforço pontual + monitoria\n\n**Cluster 3 (16 alunos - Bom)**\n• Média: 7.49\n• Perfil: Condições favoráveis\n• Ação: Enriquecimento curricular\n\n**Estratégia por Cluster:**",
        "**Para o Cluster 1 (Prioridade Máxima):**\n• Turmas de reforço 3x/semana (Mat + Port)\n• Material didático simplificado e contextualizado\n• Acompanhamento pedagógico individualizado\n• Integração com programas de assistência social\n\n**Para o Cluster 2:**\n• Reforço 1x/semana nas dificuldades específicas\n• Monitoria por alunos do Cluster 3\n• Grupos de estudo colaborativo\n\n**Para o Cluster 3:**\n• Preparação para olimpíadas científicas\n• Projetos de iniciação científica\n• Programa de monitoria remunerada\n\nJá preparei material didático diferenciado para cada cluster. Deseja que eu elabore o plano de aula das primeiras 4 semanas?",
      ],
    };

    return responses[planoTitulo] || [
      "Ótima escolha! Vou ajudá-lo a implementar este plano de ação.",
      "Baseado nos dados dos alunos, preparei um cronograma detalhado de implementação com metas claras e mensuráveis.",
      "Posso auxiliar em cada etapa do processo. Gostaria de começar pelo diagnóstico detalhado ou prefere ir direto para as ações práticas?",
    ];
  };

  // Simular streaming de texto
  const streamText = async (text: string) => {
    setIsTyping(true);
    setStreamingMessage("");
    
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 40));
      setStreamingMessage((prev) => prev + (i > 0 ? " " : "") + words[i]);
    }
    
    // Adicionar mensagem completa
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setStreamingMessage("");
    setIsTyping(false);
  };

  // Inicializar conversa quando abrir o dialog
  useEffect(() => {
    if (open && messages.length === 0) {
      // Mensagem inicial do usuário
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Quero implementar o plano: ${plano.titulo}`,
        timestamp: new Date(),
      };
      setMessages([userMessage]);

      // Responder automaticamente
      const responses = getMockedResponses(plano.titulo);
      setTimeout(() => streamText(responses[0]), 500);
    }
  }, [open, plano.titulo]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simular resposta baseada no contexto
    const responses = getMockedResponses(plano.titulo);
    const responseIndex = Math.min(messages.filter(m => m.role === "assistant").length, responses.length - 1);
    
    setTimeout(() => {
      streamText(responses[responseIndex]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <IconSparkles className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle>SabiaR - Assistente de Implementação</DialogTitle>
              <DialogDescription>
                Conversando sobre: {plano.titulo}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
          <div className="space-y-4">
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
                        src="/sabiar_icon.png"
                        alt="SabiaR"
                        width={24}
                        height={24}
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
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  <span className="mt-1 block text-xs opacity-70">
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

            {/* Streaming message */}
            {isTyping && streamingMessage && (
              <div className="flex gap-3 justify-start">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-primary/10">
                    <Image
                      src="/sabiar_icon.png"
                      alt="SabiaR"
                      width={24}
                      height={24}
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg bg-muted px-4 py-3">
                  <p className="whitespace-pre-wrap text-sm">
                    {streamingMessage}
                    <span className="inline-block animate-pulse">▊</span>
                  </p>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && !streamingMessage && (
              <div className="flex gap-3 justify-start">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-primary/10">
                    <Image
                      src="/sabiar_icon.png"
                      alt="SabiaR"
                      width={24}
                      height={24}
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="size-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "0ms" }} />
                    <span className="size-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "150ms" }} />
                    <span className="size-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t px-6 py-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem... (Enter para enviar)"
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
            💡 O SabiaR está preparado para auxiliar na implementação completa deste plano
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
