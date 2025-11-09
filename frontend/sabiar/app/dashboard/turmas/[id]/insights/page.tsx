"use client";

import { useParams } from "next/navigation";
import {
  IconSchool,
  IconAlertTriangle,
  IconAward,
  IconTarget,
  IconUsers,
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
  const turmaId = params.id as string;

  const turma = obterTurma(turmaId);

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

  // Preparar dados para o scatter plot (cluster)
  const alunosParaScatter = turma.alunos.map((aluno) => ({
    id: aluno.id,
    nome: aluno.nome_aluno,
    nota: aluno.nota_media,
    renda: aluno.renda_familiar,
    status: aluno.nivel_desempenho,
    risco: aluno.risco,
    cluster: aluno.cluster_global,
  }));

  // Agrupar alunos por nível de desempenho
  const alunosRisco = turma.alunos.filter((a) => a.risco === "Alto");
  const alunosIntermediario = turma.alunos.filter(
    (a) =>
      a.nivel_desempenho === "Médio" || a.nivel_desempenho === "Intermediário"
  );
  const alunosDestaque = turma.alunos.filter(
    (a) => a.nivel_desempenho === "Alto"
  );

  const getCorPorCluster = (cluster: number) => {
    const cores = [
      "#f97316",
      "#3b82f6",
      "#22c55e",
      "#a855f7",
      "#ec4899",
      "#eab308",
    ];
    return cores[cluster] || "#6b7280";
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
              Alunos em Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alunosRisco.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((alunosRisco.length / turma.total_alunos) * 100).toFixed(0)}% do
              total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Layout Principal: Gráfico + Resumo */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Lado Esquerdo - Gráfico de Clusters (2 colunas) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Distribuição por Clusters</CardTitle>
              <CardDescription>
                Visualização de alunos agrupados por perfil socioeconômico (Nota
                vs Renda)
              </CardDescription>
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
                      return (
                        <div className="rounded-lg border bg-card p-3 shadow-lg">
                          <p className="font-semibold">{aluno.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            Nota Média: {aluno.nota.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Renda: R$ {aluno.renda.toFixed(0)}
                          </p>
                          <p className="text-xs font-semibold">
                            Cluster: {aluno.cluster}
                          </p>
                          <p className="text-xs">Status: {aluno.risco}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={alunosParaScatter} cursor="pointer">
                  {alunosParaScatter.map((aluno, index) => (
                    <Cell
                      key={index}
                      fill={getCorPorCluster(aluno.cluster)}
                      r={6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Legenda dos Clusters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {turma.clusters.map((cluster) => (
                <Badge
                  key={cluster.cluster_id}
                  variant="outline"
                  style={{ borderColor: getCorPorCluster(cluster.cluster_id) }}
                >
                  <div
                    className="size-2 mr-1.5 rounded-full"
                    style={{
                      backgroundColor: getCorPorCluster(cluster.cluster_id),
                    }}
                  />
                  Cluster {cluster.cluster_id} ({cluster.total_alunos} alunos)
                </Badge>
              ))}
            </div>
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
                    key={cluster.cluster_id}
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
                        Cluster {cluster.cluster_id}
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
            {alunosRisco.length > 0 && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-950/20">
                <div className="mb-1 flex items-center gap-2">
                  <IconAlertTriangle className="size-4 text-red-600" />
                  <h4 className="text-sm font-semibold text-red-600">
                    Alerta Crítico
                  </h4>
                </div>
                <p className="text-xs text-red-900 dark:text-red-100">
                  <strong>{alunosRisco.length} alunos</strong> (
                  {((alunosRisco.length / turma.total_alunos) * 100).toFixed(0)}
                  %) estão em risco alto. Requerem intervenção imediata.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Características dos Clusters */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconUsers className="size-5 text-secondary" />
            <CardTitle>Detalhes dos Clusters</CardTitle>
          </div>
          <CardDescription>
            Perfil detalhado de cada grupo identificado na turma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {turma.clusters.map((cluster) => (
              <Card key={cluster.cluster_id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-4 rounded-full"
                        style={{
                          backgroundColor: getCorPorCluster(cluster.cluster_id),
                        }}
                      />
                      <CardTitle className="text-base">
                        Cluster {cluster.cluster_id}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {cluster.total_alunos} alunos (
                      {cluster.percentual.toFixed(0)}%)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Média de Notas</p>
                      <p className="font-semibold">
                        {cluster.caracteristicas.media_notas.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Renda Média</p>
                      <p className="font-semibold">
                        R$ {cluster.caracteristicas.renda_media.toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trabalham</p>
                      <p className="font-semibold">
                        {cluster.caracteristicas.pct_trabalha.toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Inseg. Alimentar</p>
                      <p className="font-semibold">
                        {cluster.caracteristicas.pct_inseg_alimentar.toFixed(0)}
                        %
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-sm font-medium">
                      Características Relevantes:
                    </p>
                    <div className="space-y-1">
                      {cluster.features_relevantes.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="mt-1.5 size-1.5 rounded-full bg-secondary" />
                          <p className="text-xs text-muted-foreground">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grupos de Alunos */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Grupo de Risco */}
        <Card className="border-red-200 dark:border-red-900/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconAlertTriangle className="size-5 text-red-500" />
              <CardTitle>Grupo de Risco Alto</CardTitle>
            </div>
            <CardDescription>
              {alunosRisco.length} alunos precisam de atenção urgente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alunosRisco.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum aluno em risco alto
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alunosRisco.slice(0, 10).map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{aluno.nome_aluno}</p>
                      <p className="text-xs text-muted-foreground">
                        Freq: {aluno.frequencia_pct.toFixed(0)}% •{" "}
                        {aluno.trabalha}
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {aluno.nota_media.toFixed(1)}
                    </Badge>
                  </div>
                ))}
                {alunosRisco.length > 10 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    + {alunosRisco.length - 10} alunos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grupo Intermediário */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconTarget className="size-5 text-primary" />
              <CardTitle>Desempenho Médio</CardTitle>
            </div>
            <CardDescription>
              {alunosIntermediario.length} alunos com potencial de melhoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alunosIntermediario.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum aluno nesta faixa
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alunosIntermediario.slice(0, 10).map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{aluno.nome_aluno}</p>
                      <p className="text-xs text-muted-foreground">
                        Freq: {aluno.frequencia_pct.toFixed(0)}%
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {aluno.nota_media.toFixed(1)}
                    </Badge>
                  </div>
                ))}
                {alunosIntermediario.length > 10 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    + {alunosIntermediario.length - 10} alunos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grupo Destaque */}
        <Card className="border-green-200 dark:border-green-900/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconAward className="size-5 text-green-600 dark:text-green-400" />
              <CardTitle>Alto Desempenho</CardTitle>
            </div>
            <CardDescription>
              {alunosDestaque.length} alunos com excelente desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alunosDestaque.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum aluno nesta faixa
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alunosDestaque.slice(0, 10).map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{aluno.nome_aluno}</p>
                      <p className="text-xs text-muted-foreground">
                        Freq: {aluno.frequencia_pct.toFixed(0)}%
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-600 text-xs">
                      {aluno.nota_media.toFixed(1)}
                    </Badge>
                  </div>
                ))}
                {alunosDestaque.length > 10 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    + {alunosDestaque.length - 10} alunos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
