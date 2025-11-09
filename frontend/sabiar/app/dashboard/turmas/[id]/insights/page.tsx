"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconSchool,
  IconAlertTriangle,
  IconArrowLeft,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/turmas">
          <Button variant="ghost" size="sm" className="mb-4">
            <IconArrowLeft className="mr-2 size-4" />
            Voltar para Turmas
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
            <IconSchool className="size-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{turma.nome}</h1>
            <p className="text-muted-foreground">
              Análise Detalhada • {turma.total_alunos} alunos • {turma.serie}
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Média de Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Frequência Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {turma.estatisticas.frequencia_media.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Presença dos alunos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Aprovação Estimada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {turma.estatisticas.aprovacao_estimada.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Projeção de aprovação
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Alunos em Risco Alto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alunosRiscoAlto.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((alunosRiscoAlto.length / turma.total_alunos) * 100).toFixed(0)}
              % do total (notas 0-4)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Layout Principal: Gráfico + Resumo */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Lado Esquerdo - Gráfico de Clusters (2 colunas) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle>Distribuição dos Alunos</CardTitle>
                <CardDescription>
                  Visualização por notas (vertical) e renda familiar
                  (horizontal)
                </CardDescription>
              </div>

              {/* Filtros */}
              {isHydrated && (
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
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

                  <div className="flex-1 min-w-[200px]">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
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
          <CardHeader>
            <CardTitle>Resumo da Turma</CardTitle>
            <CardDescription>
              Principais características identificadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Resumo Principal */}
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-3">
              <h4 className="mb-1 text-sm font-semibold text-secondary">
                Perfil da Turma
              </h4>
              <p className="text-xs">
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

            {/* Clusters Identificados */}
            <div>
              <h4 className="mb-2 text-sm font-semibold">
                Grupos Identificados:
              </h4>
              <div className="space-y-2">
                {turma.clusters.map((cluster) => (
                  <div
                    key={`resumo-${cluster.cluster_id}`}
                    className="rounded-lg border p-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="size-3 rounded-full"
                        style={{
                          backgroundColor: getCorPorCluster(cluster.cluster_id),
                        }}
                      />
                      <span className="text-xs font-semibold">
                        {getNomeCluster(cluster.cluster_id)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {cluster.percentual.toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cluster.total_alunos} alunos • Média:{" "}
                      {cluster.caracteristicas.media_notas.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridade */}
            {alunosRiscoAlto.length > 0 && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-950/20">
                <div className="mb-1 flex items-center gap-2">
                  <IconAlertTriangle className="size-4 text-red-600" />
                  <h4 className="text-sm font-semibold text-red-600">
                    Alerta Crítico
                  </h4>
                </div>
                <p className="text-xs text-red-900 dark:text-red-100">
                  <strong>{alunosRiscoAlto.length} alunos</strong> (
                  {(
                    (alunosRiscoAlto.length / turma.total_alunos) *
                    100
                  ).toFixed(0)}
                  %) com notas 0-4. Requerem intervenção imediata.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
