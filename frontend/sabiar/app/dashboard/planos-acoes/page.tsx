"use client";

import { useState } from "react";
import {
  IconTarget,
  IconUsers,
  IconClock,
  IconShoppingCart,
  IconWifi,
  IconApple,
  IconBus,
  IconSparkles,
  IconCoin,
  IconHeartHandshake,
  IconBook,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useChat } from "@/components/chat-context";
import {
  obterEstatisticasGerais,
  obterClustersGlobais,
  listarTodosAlunos,
} from "@/lib/dados";

export default function PlanosAcoesPage() {
  const stats = obterEstatisticasGerais();
  const clusters = obterClustersGlobais();
  const alunos = listarTodosAlunos();
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const { openChat } = useChat();

  // Análise de vulnerabilidades
  const vulnerabilidades = [
    {
      id: "trabalho",
      titulo: "Alunos que Trabalham",
      total: stats.fatoresCriticos.trabalho,
      percentual: ((stats.fatoresCriticos.trabalho / stats.totalAlunos) * 100).toFixed(1),
      prioridade: "alta",
      icon: IconShoppingCart,
      cor: "text-red-500",
      corBg: "bg-red-500/10",
      impacto: "Alto impacto no tempo de estudo e frequência",
    },
    {
      id: "baixa_renda",
      titulo: "Alunos em Situação de Baixa Renda",
      total: stats.fatoresCriticos.baixa_renda,
      percentual: ((stats.fatoresCriticos.baixa_renda / stats.totalAlunos) * 100).toFixed(1),
      prioridade: "alta",
      icon: IconCoin,
      cor: "text-orange-500",
      corBg: "bg-orange-500/10",
      impacto: "Afeta alimentação, transporte e material escolar",
    },
    {
      id: "inseg_alimentar",
      titulo: "Alunos com Insegurança Alimentar",
      total: stats.fatoresCriticos.inseg_alimentar,
      percentual: ((stats.fatoresCriticos.inseg_alimentar / stats.totalAlunos) * 100).toFixed(1),
      prioridade: "alta",
      icon: IconApple,
      cor: "text-red-600",
      corBg: "bg-red-600/10",
      impacto: "Prejudica concentração e desenvolvimento",
    },
    {
      id: "deslocamento",
      titulo: "Alunos com Deslocamento Longo",
      total: stats.fatoresCriticos.deslocamento_longo,
      percentual: ((stats.fatoresCriticos.deslocamento_longo / stats.totalAlunos) * 100).toFixed(1),
      prioridade: "media",
      icon: IconBus,
      cor: "text-yellow-600",
      corBg: "bg-yellow-600/10",
      impacto: "Reduz tempo disponível para estudos",
    },
    {
      id: "sem_internet",
      titulo: "Alunos sem Acesso à Internet",
      total: stats.fatoresCriticos.sem_internet,
      percentual: ((stats.fatoresCriticos.sem_internet / stats.totalAlunos) * 100).toFixed(1),
      prioridade: "media",
      icon: IconWifi,
      cor: "text-blue-500",
      corBg: "bg-blue-500/10",
      impacto: "Limita acesso a conteúdos e pesquisas",
    },
  ];

  // Planos de ação recomendados
  const planosAcao = [
    {
      id: 1,
      titulo: "Programa de Reforço Alimentar",
      categoria: "Assistência Social",
      prioridade: "alta",
      icon: IconApple,
      alunosImpactados: stats.fatoresCriticos.inseg_alimentar,
      descricao: "Garantir alimentação adequada através da merenda escolar reforçada e cestas básicas",
      acoes: [
        "Ampliar o programa de merenda escolar com café reforçado",
        "Distribuir cestas básicas mensais para famílias em vulnerabilidade",
        "Estabelecer parceria com bancos de alimentos locais",
        "Criar horta comunitária na escola para educação alimentar",
      ],
      recursos: "R$ 45.000 mensais",
      prazo: "Imediato - 3 meses",
      responsavel: "Coordenação Social + Nutricionista",
      indicadores: ["Frequência escolar", "Notas de concentração", "IMC dos alunos"],
      status: "pendente",
    },
    {
      id: 2,
      titulo: "Apoio para Alunos Trabalhadores",
      categoria: "Flexibilização Pedagógica",
      prioridade: "alta",
      icon: IconClock,
      alunosImpactados: stats.fatoresCriticos.trabalho,
      descricao: "Criar alternativas de aprendizagem para alunos que precisam trabalhar",
      acoes: [
        "Implementar aulas de reforço em horários flexíveis",
        "Disponibilizar material de estudo online e assíncrono",
        "Criar programa de monitoria entre pares",
        "Estabelecer convênio com empresas para ajustar horários",
      ],
      recursos: "R$ 15.000 mensais",
      prazo: "1-2 meses",
      responsavel: "Coordenação Pedagógica",
      indicadores: ["Taxa de abandono", "Notas médias", "Frequência"],
      status: "em_andamento",
    },
    {
      id: 3,
      titulo: "Programa de Inclusão Digital",
      categoria: "Tecnologia Educacional",
      prioridade: "media",
      icon: IconWifi,
      alunosImpactados: stats.fatoresCriticos.sem_internet,
      descricao: "Garantir acesso à tecnologia e internet para todos os alunos",
      acoes: [
        "Disponibilizar chips com internet móvel subsidiada",
        "Criar laboratório de informática com horário estendido",
        "Emprestar tablets/notebooks para alunos sem dispositivos",
        "Estabelecer parceria com lan houses para uso educacional",
      ],
      recursos: "R$ 25.000 inicial + R$ 8.000 mensais",
      prazo: "2-4 meses",
      responsavel: "Coordenação de TI",
      indicadores: ["Acesso a plataformas", "Entregas de trabalhos", "Engajamento digital"],
      status: "pendente",
    },
    {
      id: 4,
      titulo: "Otimização de Transporte Escolar",
      categoria: "Logística",
      prioridade: "media",
      icon: IconBus,
      alunosImpactados: stats.fatoresCriticos.deslocamento_longo,
      descricao: "Reduzir tempo de deslocamento e melhorar condições de transporte",
      acoes: [
        "Reavaliar rotas de transporte escolar para otimização",
        "Negociar com prefeitura mais pontos de parada",
        "Criar parcerias para carona solidária entre famílias",
        "Disponibilizar vale-transporte para casos críticos",
      ],
      recursos: "R$ 20.000 mensais",
      prazo: "2-3 meses",
      responsavel: "Administração + Secretaria Municipal",
      indicadores: ["Tempo médio de deslocamento", "Pontualidade", "Frequência"],
      status: "pendente",
    },
    {
      id: 5,
      titulo: "Apoio Socioemocional e Familiar",
      categoria: "Assistência Psicossocial",
      prioridade: "alta",
      icon: IconHeartHandshake,
      alunosImpactados: stats.alunosRiscoAlto,
      descricao: "Oferecer suporte psicológico e aproximação com famílias",
      acoes: [
        "Ampliar atendimento psicológico individual e em grupo",
        "Realizar reuniões periódicas com famílias vulneráveis",
        "Criar grupos de apoio entre pais/responsáveis",
        "Implementar programa de visitas domiciliares",
      ],
      recursos: "R$ 18.000 mensais",
      prazo: "Imediato - 2 meses",
      responsavel: "Equipe Psicossocial",
      indicadores: ["Bem-estar emocional", "Participação familiar", "Evasão escolar"],
      status: "em_andamento",
    },
    {
      id: 6,
      titulo: "Programa de Nivelamento por Cluster",
      categoria: "Pedagógico",
      prioridade: "alta",
      icon: IconBook,
      alunosImpactados: 125, // Alunos do cluster de baixo desempenho
      descricao: "Ações pedagógicas específicas para cada perfil de aluno identificado",
      acoes: [
        "Criar turmas de reforço segmentadas por cluster",
        "Desenvolver material didático adaptado às necessidades",
        "Implementar metodologias ativas e personalizadas",
        "Capacitar professores para trabalho com diversidade",
      ],
      recursos: "R$ 30.000 mensais",
      prazo: "1-3 meses",
      responsavel: "Coordenação Pedagógica",
      indicadores: ["Evolução de notas por cluster", "Engajamento", "Aprovação"],
      status: "planejamento",
    },
  ];

  const filteredPlanos = selectedPriority === "all" 
    ? planosAcao 
    : planosAcao.filter(p => p.prioridade === selectedPriority);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pendente: { label: "Pendente", variant: "secondary" },
      planejamento: { label: "Em Planejamento", variant: "outline" },
      em_andamento: { label: "Em Andamento", variant: "default" },
      concluido: { label: "Concluído", variant: "default" },
    };
    const status_info = statusMap[status] || statusMap.pendente;
    return <Badge variant={status_info.variant}>{status_info.label}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    if (prioridade === "alta") {
      return <Badge variant="destructive">Prioridade Alta</Badge>;
    } else if (prioridade === "media") {
      return <Badge variant="secondary">Prioridade Média</Badge>;
    }
    return <Badge variant="outline">Prioridade Baixa</Badge>;
  };

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <IconTarget className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planos de Ação</h1>
            <p className="text-muted-foreground">
              Ações prioritárias para intervenção pedagógica
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Análise */}
      <Tabs defaultValue="planos" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vulnerabilidades">Vulnerabilidades</TabsTrigger>
          <TabsTrigger value="planos">Planos de Ação</TabsTrigger>
          <TabsTrigger value="clusters">Análise por Perfil</TabsTrigger>
        </TabsList>

        {/* Tab: Vulnerabilidades */}
        <TabsContent value="vulnerabilidades" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vulnerabilidades.slice(0, 3).map((vuln) => {
              const Icon = vuln.icon;
              return (
                <Card key={vuln.id}>
                  <CardContent className="pt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${vuln.corBg}`}>
                        <Icon className={`size-5 ${vuln.cor}`} />
                      </div>
                      {getPrioridadeBadge(vuln.prioridade)}
                    </div>
                    <h3 className="mb-2 text-sm font-semibold">{vuln.titulo}</h3>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{vuln.total}</span>
                      <span className="text-xs text-muted-foreground">
                        alunos
                      </span>
                    </div>
                    <Progress value={parseFloat(vuln.percentual)} className="h-1.5" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab: Planos de Ação */}
        <TabsContent value="planos" className="space-y-6">
          {/* Filtros */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={selectedPriority === "all" ? "default" : "outline"}
              onClick={() => setSelectedPriority("all")}
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={selectedPriority === "alta" ? "destructive" : "outline"}
              onClick={() => setSelectedPriority("alta")}
            >
              Alta Prioridade
            </Button>
            <Button
              size="sm"
              variant={selectedPriority === "media" ? "secondary" : "outline"}
              onClick={() => setSelectedPriority("media")}
            >
              Média Prioridade
            </Button>
          </div>

          {/* Lista de Planos */}
          <div className="space-y-3">
            {filteredPlanos.map((plano) => {
              const Icon = plano.icon;
              return (
                <Card key={plano.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1.5 flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg">{plano.titulo}</CardTitle>
                            {getStatusBadge(plano.status)}
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            {getPrioridadeBadge(plano.prioridade)}
                            <Badge variant="outline" className="text-xs">
                              {plano.categoria}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <IconUsers className="mr-1 size-3" />
                              {plano.alunosImpactados} alunos
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {/* Detalhes compactos em uma linha */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <IconCoin className="size-4 text-muted-foreground" />
                        <span className="font-medium">{plano.recursos}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IconClock className="size-4 text-muted-foreground" />
                        <span>{plano.prazo}</span>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => {
                          openChat(`Quero implementar o plano de ação: ${plano.titulo}. Me ajude com os próximos passos.`);
                        }}
                      >
                        <IconSparkles className="size-4" />
                        Iniciar Implementação
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Icon className="size-5 text-primary" />
                              {plano.titulo}
                            </DialogTitle>
                            <DialogDescription>
                              {plano.descricao}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                              {getPrioridadeBadge(plano.prioridade)}
                              <Badge variant="outline">{plano.categoria}</Badge>
                              {getStatusBadge(plano.status)}
                            </div>

                            {/* Ações Propostas */}
                            <div>
                              <h4 className="mb-2 text-sm font-semibold">Ações Propostas</h4>
                              <ul className="space-y-1.5">
                                {plano.acoes.map((acao, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                                    {acao}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Detalhes */}
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="rounded-lg border p-3">
                                <div className="mb-1 text-xs text-muted-foreground">Recursos</div>
                                <div className="font-semibold">{plano.recursos}</div>
                              </div>
                              <div className="rounded-lg border p-3">
                                <div className="mb-1 text-xs text-muted-foreground">Prazo</div>
                                <div className="font-semibold">{plano.prazo}</div>
                              </div>
                            </div>

                            {/* Indicadores */}
                            <div>
                              <h4 className="mb-2 text-sm font-semibold">Indicadores de Sucesso</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {plano.indicadores.map((indicador, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {indicador}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Botão de Ação */}
                            <div className="flex justify-end pt-3 border-t">
                              <Button 
                                className="flex items-center gap-2"
                                onClick={() => {
                                  openChat(`Quero implementar o plano de ação: ${plano.titulo}. Me ajude com os próximos passos.`);
                                }}
                              >
                                <IconSparkles className="size-4" />
                                Iniciar Implementação
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab: Clusters */}
        <TabsContent value="clusters" className="space-y-4">
          <div className="space-y-3">
            {clusters.map((cluster: any, idx: number) => (
              <Card key={cluster.cluster_id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Perfil {cluster.cluster_id + 1} - {cluster.percentual}%
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {cluster.total_alunos} alunos • Média: {cluster.caracteristicas.media_notas}
                      </CardDescription>
                    </div>
                    <Badge variant={idx === 0 ? "destructive" : idx === 1 ? "secondary" : "default"}>
                      {cluster.caracteristicas.media_notas < 3 ? "Crítico" : 
                       cluster.caracteristicas.media_notas < 6 ? "Atenção" : "Bom"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Dados compactos */}
                  <div className="grid gap-2 grid-cols-2 md:grid-cols-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Renda</div>
                      <div className="font-medium">R$ {cluster.caracteristicas.renda_media}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Trabalham</div>
                      <div className="font-medium">{cluster.caracteristicas.pct_trabalha}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Deslocamento</div>
                      <div className="font-medium">{cluster.caracteristicas.tempo_desl_medio}min</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Inseg. Alim.</div>
                      <div className="font-medium">{cluster.caracteristicas.pct_inseg_alimentar}%</div>
                    </div>
                  </div>

                  {/* Recomendação resumida */}
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="text-sm">
                      {idx === 0 && "Priorizar apoio alimentar e socioemocional. Reforço escolar intensivo."}
                      {idx === 1 && "Reforço pontual em disciplinas específicas. Grupos de estudo."}
                      {idx === 2 && "Estimular liderança e desafios acadêmicos avançados."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
