/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconSchool, IconArrowLeft } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { obterTurma } from "@/lib/dados";
import Link from "next/link";

export default function TurmaInsightsPage() {
  const params = useParams();
  const router = useRouter();
  const turmaId = params.id as string;

  const turma = obterTurma(turmaId);
  const [tipoVisualizacao, setTipoVisualizacao] =
    useState<string>("desempenho");
  const [filtroGrupo, setFiltroGrupo] = useState<string>("todos");
  const [isHydrated, setIsHydrated] = useState(false);
  const [clusterSelecionado, setClusterSelecionado] = useState<number | null>(
    null
  );
  const [metricaSelecionada, setMetricaSelecionada] = useState<string | null>(
    null
  );

  // Safe hydration check - standard pattern in Next.js
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Quando muda para "Por Perfil Socioeconômico", selecionar o primeiro cluster automaticamente
  useEffect(() => {
    if (tipoVisualizacao === "cluster" && filtroGrupo === "todos" && turma) {
      if (turma.clusters.length > 0) {
        setFiltroGrupo(turma.clusters[0].cluster_id.toString());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoVisualizacao]);

  if (!turma) {
    return (
      <div className="px-4 py-8 md:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <IconSchool className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Turma não encontrada</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Os dados desta turma não estão disponíveis
            </p>
            <Link href="/dashboard/turmas">
              <Button variant="secondary">Voltar para Turmas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preparar dados para o scatter plot
  const todosAlunosScatter = useMemo(() => {
    const dados = turma.alunos.map((aluno) => ({
      id: aluno.id,
      nome: aluno.nome_aluno,
      nota: aluno.nota_media,
      renda: aluno.renda_familiar,
      status: aluno.nivel_desempenho,
      risco: aluno.risco,
      cluster: aluno.cluster_global,
      grupoRisco:
        aluno.nota_media < 4
          ? "risco_alto"
          : aluno.nota_media < 7
          ? "medio"
          : "sem_risco",
    }));
    return dados;
  }, [turma.alunos]);

  // Filtrar alunos baseado no filtro selecionado
  const alunosParaScatter = useMemo(() => {
    if (tipoVisualizacao === "desempenho") {
      return filtroGrupo === "todos"
        ? todosAlunosScatter
        : todosAlunosScatter.filter((a) => a.grupoRisco === filtroGrupo);
    } else {
      return filtroGrupo === "todos"
        ? todosAlunosScatter
        : todosAlunosScatter.filter(
            (a) => a.cluster?.toString() === filtroGrupo
          );
    }
  }, [tipoVisualizacao, filtroGrupo, todosAlunosScatter]);

  // Agrupar alunos por nível de desempenho baseado nas notas
  const alunosRiscoAlto = turma.alunos.filter((a) => a.nota_media < 4);

  // Cores por grupo de risco (baseado nas notas)
  const getCorPorGrupoRisco = (grupoRisco: string) => {
    const cores = {
      risco_alto: "#ef4444", // Vermelho
      medio: "#f59e0b", // Laranja/Amarelo
      sem_risco: "#22c55e", // Verde
    };
    return cores[grupoRisco as keyof typeof cores] || "#6b7280";
  };

  // Cores por cluster socioeconômico (modelo ML)
  const getCorPorCluster = (cluster: number) => {
    const cores = [
      "#f97316", // Laranja - Cluster 0
      "#3b82f6", // Azul - Cluster 1
      "#22c55e", // Verde - Cluster 2
      "#a855f7", // Roxo - Cluster 3
      "#ec4899", // Rosa - Cluster 4
      "#eab308", // Amarelo - Cluster 5
    ];
    return cores[cluster] || "#6b7280";
  };

  // Nomes descritivos para os clusters baseados em características reais
  const getNomeCluster = (clusterId: number): string => {
    const nomes: Record<number, string> = {
      0: "Crítico - Múltiplos fatores de risco",
      1: "Vulnerável - Potencial de recuperação",
      2: "Estável - Condições favoráveis",
      3: "Resiliente - Nota boa apesar de dificuldades",
    };
    return nomes[clusterId] || `Cluster ${clusterId}`;
  };

  // Informações detalhadas de cada métrica
  const getInfoMetrica = (
    metrica: string
  ): {
    titulo: string;
    descricao: string;
    detalhes: string[];
    alunos?: any[];
  } => {
    const metricas: Record<
      string,
      { titulo: string; descricao: string; detalhes: string[]; alunos?: any[] }
    > = {
      media: {
        titulo: "Média de Notas",
        descricao: `A turma possui média geral de ${turma.estatisticas.media_notas.toFixed(
          2
        )} pontos. `,
        detalhes: [
          turma.estatisticas.media_notas < 4
            ? "⚠️ Situação crítica: Média abaixo de 4. Requer ação imediata e intervenções intensivas."
            : turma.estatisticas.media_notas < 7
            ? "⚠️ Atenção: Média entre 4 e 7. Necessário acompanhamento e reforço pedagógico."
            : "✅ Desempenho satisfatório: Média acima de 7. Continue monitorando.",
          "Essa métrica reflete o desempenho acadêmico geral da turma.",
          "Compare com a frequência e aprovação para ter visão completa.",
        ],
      },
      frequencia: {
        titulo: "Frequência Média",
        descricao: `A turma mantém frequência média de ${turma.estatisticas.frequencia_media.toFixed(
          0
        )}%. `,
        detalhes: [
          turma.estatisticas.frequencia_media < 75
            ? "⚠️ Abaixo da meta: Frequência inferior a 75%. Investigue causas de absenteísmo."
            : turma.estatisticas.frequencia_media < 90
            ? "⚠️ Moderada: Frequência entre 75-90%. Há oportunidade de melhora."
            : "✅ Excelente: Frequência acima de 90%. Alunos engajados com presença.",
          "Frequência é fator crítico para o sucesso acadêmico.",
          "Absenteísmo frequente pode indicar problemas sociais ou desengajamento.",
        ],
      },
      aprovacao: {
        titulo: "Aprovação Estimada",
        descricao: `Estimamos taxa de aprovação de ${turma.estatisticas.aprovacao_estimada.toFixed(
          0
        )}%. `,
        detalhes: [
          turma.estatisticas.aprovacao_estimada < 50
            ? "🚨 Crítico: Menos de 50% aprovação. Necessária revisão urgente de estratégias."
            : turma.estatisticas.aprovacao_estimada < 75
            ? "⚠️ Preocupante: Entre 50-75% aprovação. Intensifique o acompanhamento."
            : "✅ Bom: Acima de 75% aprovação. Manutenha as estratégias atuais.",
          "Baseado em média de notas ≥5 e frequência ≥75%.",
          "Alunos abaixo desses critérios correm risco de reprovação.",
        ],
      },
      risco: {
        titulo: "Alunos em Risco Alto",
        descricao: `${alunosRiscoAlto.length} alunos (${(
          (alunosRiscoAlto.length / turma.total_alunos) *
          100
        ).toFixed(0)}% da turma) estão em risco alto. `,
        detalhes: [
          "Estes alunos têm notas entre 0-4, classificados como risco elevado.",
          "Priorize intervenção pedagógica, apoio familiar e acompanhamento individualizado.",
          "Considere: reforço extraturno, tutoria de pares, apoio socioemocional.",
          "Monitore mensalmente para identificar progresso ou piora.",
        ],
        alunos: alunosRiscoAlto,
      },
    };
    return metricas[metrica] || { titulo: "", descricao: "", detalhes: [] };
  };

  // Descrições e recomendações para cada cluster
  const getDescricaoCluster = (
    clusterId: number
  ): { descricao: string; recomendacoes: string[] } => {
    const descricoes: Record<
      number,
      { descricao: string; recomendacoes: string[] }
    > = {
      0: {
        descricao:
          "Alunos com notas baixas, que frequentemente trabalham, têm baixa renda e enfrentam insegurança alimentar. Este é o grupo com maior número de fatores adversos e requer intervenção imediata.",
        recomendacoes: [
          "Programa de reforço escolar intensivo",
          "Auxílio alimentar e apoio social",
          "Flexibilização de horários para compatibilizar trabalho e estudo",
          "Orientação profissional e oportunidades de renda melhorada",
        ],
      },
      1: {
        descricao:
          "Alunos com notas baixas, mas que não trabalham e têm renda média. Este grupo tem potencial de recuperação pois não enfrenta todos os fatores de risco do grupo anterior.",
        recomendacoes: [
          "Acompanhamento pedagógico focado",
          "Mentoria e tutoria entre pares",
          "Atividades motivacionais e de engajamento",
          "Apoio familiar para reforço em casa",
        ],
      },
      2: {
        descricao:
          "Alunos com bom desempenho acadêmico e condições socioeconômicas favoráveis. Este é o grupo mais estável com menos fatores de risco.",
        recomendacoes: [
          "Programa de enriquecimento curricular",
          "Oportunidades de liderança e protagonismo",
          "Preparação para provas de seleção",
          "Desenvolvimento de habilidades para o futuro",
        ],
      },
      3: {
        descricao:
          "Alunos que conseguem manter bom desempenho apesar de condições socioeconômicas difíceis. São exemplos de resiliência e potencial.",
        recomendacoes: [
          "Reconhecimento e valorização do esforço",
          "Bolsas de estudo e oportunidades de ampliação",
          "Mentoria para dar continuidade ao trajeto",
          "Rede de apoio para potencializar talentos",
        ],
      },
    };
    return descricoes[clusterId] || { descricao: "", recomendacoes: [] };
  };

  // Função que retorna a cor baseada no tipo de visualização
  const getCorAluno = (aluno: (typeof alunosParaScatter)[0]) => {
    if (tipoVisualizacao === "desempenho") {
      return getCorPorGrupoRisco(aluno.grupoRisco);
    } else {
      return getCorPorCluster(aluno.cluster);
    }
  };

  // Handler para clicar no aluno
  const handleAlunoClick = (data: { id?: number }) => {
    if (data && data.id) {
      router.push(`/dashboard/alunos/${data.id}`);
    }
  };

  // Analisar problemas dos alunos filtrados
  const analisarProblemas = (alunos: any[]) => {
    if (alunos.length === 0) return [];

    const problemas = {
      transporte_longo: alunos.filter((a) => a.tempo_deslocamento_min > 60)
        .length,
      inseguranca_alimentar: alunos.filter(
        (a) => a.inseguranca_alimentar === "Sim"
      ).length,
      bairro_perigoso: alunos.filter(
        (a) =>
          a.tipo_moradia?.toLowerCase().includes("risco") ||
          a.endereco_completo?.toLowerCase().includes("risco")
      ).length,
      trabalha_estudando: alunos.filter((a) => a.trabalha === "Sim").length,
    };

    const resultado = [
      {
        icon: "🚌",
        label: "Dificuldade no transporte",
        valor: problemas.transporte_longo,
        descricao: `${problemas.transporte_longo} alunos com deslocamento > 1h`,
      },
      {
        icon: "🍽️",
        label: "Insegurança alimentar",
        valor: problemas.inseguranca_alimentar,
        descricao: `${problemas.inseguranca_alimentar} alunos com fome`,
      },
      {
        icon: "🏠",
        label: "Habitação em risco",
        valor: problemas.bairro_perigoso,
        descricao: `${problemas.bairro_perigoso} alunos em áreas vulneráveis`,
      },
      {
        icon: "💼",
        label: "Trabalha enquanto estuda",
        valor: problemas.trabalha_estudando,
        descricao: `${problemas.trabalha_estudando} alunos trabalham`,
      },
    ];

    return resultado.sort((a, b) => b.valor - a.valor);
  };

  const problemasAlunosFiltrados = useMemo(
    () => analisarProblemas(alunosParaScatter),
    [alunosParaScatter]
  );

  return (
    <div className="px-4 py-4 md:px-8">
      {/* Header */}
      <div className="mb-3">
        <Link href="/dashboard/turmas">
          <Button variant="ghost" size="sm" className="mb-2">
            <IconArrowLeft className="mr-2 size-4" />
            Voltar para Turmas
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary/10">
            <IconSchool className="size-4 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{turma.nome}</h1>
            <p className="text-xs text-muted-foreground">
              Análise Detalhada • {turma.total_alunos} alunos • {turma.serie}
            </p>
          </div>
        </div>
      </div>

      {/* Layout Principal: Gráfico + Resumo */}
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        {/* Lado Esquerdo - Gráfico de Clusters (2 colunas) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-1.5">
              <div>
                <CardTitle className="text-lg">
                  Distribuição dos Alunos
                </CardTitle>
                <CardDescription className="text-xs">
                  Notas (vertical) vs Renda familiar (horizontal)
                </CardDescription>
              </div>

              {/* Filtros */}
              {isHydrated && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1.0 block text-xs font-medium text-muted-foreground">
                      Tipo de Visualização
                    </label>
                    <Select
                      value={tipoVisualizacao}
                      onValueChange={(value) => {
                        setTipoVisualizacao(value);
                        setFiltroGrupo("todos"); // Reset filtro ao mudar tipo
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desempenho">
                          Por Desempenho
                        </SelectItem>
                        <SelectItem value="cluster">
                          Por Perfil Socioeconômico
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <label className="mb-1.0 block text-xs font-medium text-muted-foreground">
                      Filtrar Grupo
                    </label>
                    <Select value={filtroGrupo} onValueChange={setFiltroGrupo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoVisualizacao === "desempenho" ? (
                          <>
                            <SelectItem value="todos">
                              Todos os Grupos
                            </SelectItem>
                            <SelectItem value="risco_alto">
                              🔴 Risco Alto (0-4)
                            </SelectItem>
                            <SelectItem value="medio">
                              🟡 Médio (4-7)
                            </SelectItem>
                            <SelectItem value="sem_risco">
                              🟢 Sem Risco (7-10)
                            </SelectItem>
                          </>
                        ) : (
                          <>
                            {turma.clusters
                              .filter((cluster) => cluster.cluster_id != null)
                              .map((cluster) => (
                                <SelectItem
                                  key={cluster.cluster_id}
                                  value={cluster.cluster_id.toString()}
                                >
                                  {getNomeCluster(cluster.cluster_id)} (
                                  {cluster.total_alunos} alunos)
                                </SelectItem>
                              ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  dataKey="renda"
                  name="Renda Familiar"
                  domain={[0, "auto"]}
                  label={{
                    value: "Renda Familiar (R$)",
                    position: "bottom",
                    offset: 0,
                  }}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  type="number"
                  dataKey="nota"
                  name="Nota Média"
                  domain={[0, 10]}
                  label={{ value: "Nota Média", angle: -90, position: "left" }}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const aluno = payload[0].payload;

                      let grupoLabel = "";
                      if (tipoVisualizacao === "desempenho") {
                        grupoLabel =
                          aluno.grupoRisco === "risco_alto"
                            ? "Risco Alto (0-4)"
                            : aluno.grupoRisco === "medio"
                            ? "Médio (4-7)"
                            : "Sem Risco (7-10)";
                      } else {
                        const cluster = turma.clusters.find(
                          (c) => c.cluster_id === aluno.cluster
                        );
                        grupoLabel = getNomeCluster(aluno.cluster);
                        if (cluster) {
                          grupoLabel += ` - Média: ${cluster.caracteristicas.media_notas.toFixed(
                            1
                          )}`;
                        }
                      }

                      return (
                        <div className="rounded-lg border bg-card p-3 shadow-lg">
                          <p className="font-semibold">{aluno.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            Nota Média: {aluno.nota.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Renda: R$ {aluno.renda.toFixed(0)}
                          </p>
                          <p className="text-xs font-semibold">{grupoLabel}</p>
                          <p className="mt-2 text-xs font-medium text-secondary">
                            👆 Clique para ver o perfil completo
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter
                  data={alunosParaScatter}
                  onClick={handleAlunoClick}
                  cursor="pointer"
                >
                  {alunosParaScatter.map((aluno) => (
                    <Cell key={aluno.id} fill={getCorAluno(aluno)} r={6} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lado Direito - Resumo da Turma */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Resumo da Turma</CardTitle>
            <CardDescription className="text-xs">
              Principais características
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Resumo Principal */}
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-2">
              <h3 className="text-sm font-semibold text-secondary mb-2">
                Perfil da Turma
              </h3>
              <p className="text-xs leading-snug">
                Média geral de{" "}
                <strong>{turma.estatisticas.media_notas.toFixed(2)}</strong>{" "}
                pontos. Frequência de{" "}
                <strong>
                  {turma.estatisticas.frequencia_media.toFixed(0)}%
                </strong>
                .
                {turma.estatisticas.media_notas < 4
                  ? " Situação crítica requer ação imediata."
                  : turma.estatisticas.media_notas < 7
                  ? " Precisa de atenção e intervenções."
                  : " Desempenho satisfatório."}
              </p>
            </div>

            {/* Problemas do Grupo Filtrado OU Grupos Identificados */}
            {filtroGrupo !== "todos" && problemasAlunosFiltrados.length > 0 ? (
              // Mostrar Desafios quando filtrado
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Desafios do Grupo
                </h4>
                <div className="space-y-2">
                  {problemasAlunosFiltrados.slice(0, 4).map((problema, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-orange-200/50 bg-orange-50/30 p-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{problema.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold">
                            {problema.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {problema.descricao}
                          </p>
                        </div>
                        <div className="shrink-0 bg-orange-100 text-orange-700 rounded px-2 py-1">
                          <p className="text-xs font-bold">{problema.valor}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Mostrar Grupos Identificados quando não filtrado
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Grupos Identificados
                </h4>
                <div className="space-y-2">
                  {turma.clusters.map((cluster) => (
                    <button
                      key={`resumo-${cluster.cluster_id}`}
                      onClick={() => setClusterSelecionado(cluster.cluster_id)}
                      className="w-full rounded-lg border p-3 text-left transition-all hover:bg-muted/50 hover:border-secondary cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="size-4 rounded-full"
                          style={{
                            backgroundColor: getCorPorCluster(
                              cluster.cluster_id
                            ),
                          }}
                        />
                        <span className="text-xs font-semibold">
                          {getNomeCluster(cluster.cluster_id)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {cluster.total_alunos} alunos • Média:{" "}
                        {cluster.caracteristicas.media_notas.toFixed(1)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid gap-3 md:grid-cols-4">
        <button
          onClick={() => setMetricaSelecionada("media")}
          className="rounded-lg border bg-card hover:bg-muted/50 hover:border-secondary transition-all text-left p-8 cursor-pointer"
        >
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            Média de Notas
          </h3>
          <div
            className={`text-2xl font-bold ${
              turma.estatisticas.media_notas < 4
                ? "text-red-600"
                : turma.estatisticas.media_notas < 7
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {turma.estatisticas.media_notas.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Desempenho geral</p>
        </button>
        <button
          onClick={() => setMetricaSelecionada("frequencia")}
          className="rounded-lg border bg-card hover:bg-muted/50 hover:border-secondary transition-all text-left p-4 cursor-pointer"
        >
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            Frequência Média
          </h3>
          <div className="text-2xl font-bold">
            {turma.estatisticas.frequencia_media.toFixed(0)}%
          </div>
          <p className="text-xs text-muted-foreground">Presença dos alunos</p>
        </button>
        <button
          onClick={() => setMetricaSelecionada("aprovacao")}
          className="rounded-lg border bg-card hover:bg-muted/50 hover:border-secondary transition-all text-left p-4 cursor-pointer"
        >
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            Aprovação Estimada
          </h3>
          <div className="text-2xl font-bold text-blue-600">
            {turma.estatisticas.aprovacao_estimada.toFixed(0)}%
          </div>
          <p className="text-xs text-muted-foreground">Projeção de aprovação</p>
        </button>
        <button
          onClick={() => setMetricaSelecionada("risco")}
          className="rounded-lg border bg-card hover:bg-muted/50 hover:border-secondary transition-all text-left p-4 cursor-pointer"
        >
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            Alunos em Risco Alto
          </h3>
          <div className="text-2xl font-bold text-red-600">
            {alunosRiscoAlto.length}
          </div>
          <p className="text-xs text-muted-foreground">
            {((alunosRiscoAlto.length / turma.total_alunos) * 100).toFixed(0)}%
            do total (notas 0-4)
          </p>
        </button>
      </div>

      {/* Dialog com Explicação do Cluster */}
      {clusterSelecionado !== null && (
        <Dialog
          open={clusterSelecionado !== null}
          onOpenChange={(open) => {
            if (!open) setClusterSelecionado(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="size-5 rounded-full"
                  style={{
                    backgroundColor: getCorPorCluster(clusterSelecionado),
                  }}
                />
                <DialogTitle>{getNomeCluster(clusterSelecionado)}</DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                Detalhes e recomendações para o grupo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Sobre este grupo:</h3>
                <p className="text-sm text-muted-foreground">
                  {getDescricaoCluster(clusterSelecionado).descricao}
                </p>
              </div>
              <div>
                <h3 className="mb-3 font-semibold">Recomendações de Ação:</h3>
                <ul className="space-y-2">
                  {getDescricaoCluster(clusterSelecionado).recomendacoes.map(
                    (rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <div className="mt-1.5 size-1.5 rounded-full bg-secondary shrink-0" />
                        <span>{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => setClusterSelecionado(null)}
                  className="w-full"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog com Explicação das Métricas */}
      {metricaSelecionada && (
        <Dialog
          open={metricaSelecionada !== null}
          onOpenChange={(open) => {
            if (!open) setMetricaSelecionada(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {getInfoMetrica(metricaSelecionada).titulo}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detalhes sobre a métrica
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Situação Atual:</h3>
                <p className="text-sm text-muted-foreground">
                  {getInfoMetrica(metricaSelecionada).descricao}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Detalhes & Contexto:</h3>
                <ul className="space-y-2">
                  {getInfoMetrica(metricaSelecionada).detalhes.map(
                    (detalhe, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <div className="mt-1.5 size-1.5 rounded-full bg-secondary shrink-0" />
                        <span>{detalhe}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Seção de Alunos em Risco (se aplicável) */}
              {getInfoMetrica(metricaSelecionada).alunos &&
                getInfoMetrica(metricaSelecionada).alunos!.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">
                      Alunos em Risco (
                      {getInfoMetrica(metricaSelecionada).alunos!.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getInfoMetrica(metricaSelecionada).alunos!.map(
                        (aluno) => (
                          <button
                            key={aluno.id}
                            onClick={() =>
                              router.push(`/dashboard/alunos/${aluno.id}`)
                            }
                            className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-all text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">
                                  {aluno.nome_aluno}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Nota: {aluno.nota_media.toFixed(2)} •
                                  Frequência: {aluno.frequencia_pct.toFixed(0)}%
                                </p>
                              </div>
                              <span className="text-xs font-semibold text-red-600">
                                🔴 Risco
                              </span>
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div className="pt-4">
                <Button
                  onClick={() => setMetricaSelecionada(null)}
                  className="w-full"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
