"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconSchool,
  IconAlertTriangle,
  IconSparkles,
  IconAward,
  IconTarget,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

// Mock data - Insights da turma
const insightsMock = {
  turma: {
    id: 1,
    nome: "9º Ano A",
    alunos: 32,
  },
  metricas: {
    mediaGeral: 7.2,
    taxaAcerto: 72,
    totalProvas: 8,
    horasEconomizadas: 16,
    tendencia: "up" as "up" | "down",
    variacao: 8.5,
  },
  evolucaoProvas: [
    {
      nome: "Prova 1",
      data: "15/Ago",
      media: 6.2,
      matematica: 6.0,
      portugues: 6.4,
    },
    {
      nome: "Prova 2",
      data: "28/Ago",
      media: 6.5,
      matematica: 6.2,
      portugues: 6.8,
    },
    {
      nome: "Prova 3",
      data: "12/Set",
      media: 6.8,
      matematica: 6.5,
      portugues: 7.1,
    },
    {
      nome: "Prova 4",
      data: "25/Set",
      media: 6.9,
      matematica: 6.6,
      portugues: 7.2,
    },
    {
      nome: "Prova 5",
      data: "10/Out",
      media: 7.0,
      matematica: 6.7,
      portugues: 7.3,
    },
    {
      nome: "Prova 6",
      data: "23/Out",
      media: 7.1,
      matematica: 6.8,
      portugues: 7.4,
    },
    {
      nome: "Prova 7",
      data: "08/Nov",
      media: 7.2,
      matematica: 6.9,
      portugues: 7.5,
    },
    {
      nome: "Prova 8",
      data: "20/Nov",
      media: 7.2,
      matematica: 6.8,
      portugues: 7.6,
    },
  ],
  evolucaoPeriodos: [
    { periodo: "1º Bim", media: 6.4, matematica: 6.1, portugues: 6.7 },
    { periodo: "2º Bim", media: 6.9, matematica: 6.6, portugues: 7.2 },
    { periodo: "3º Bim", media: 7.1, matematica: 6.8, portugues: 7.4 },
    { periodo: "4º Bim", media: 7.2, matematica: 6.8, portugues: 7.6 },
  ],
  distribuicaoNotas: [
    { faixa: "0-2", quantidade: 2 },
    { faixa: "3-4", quantidade: 2 },
    { faixa: "5-6", quantidade: 8 },
    { faixa: "7-8", quantidade: 12 },
    { faixa: "9-10", quantidade: 8 },
  ],
  // Dados para Cluster (scatter plot)
  alunosCluster: [
    {
      id: 1,
      nome: "Ana Silva",
      matematica: 8.5,
      portugues: 9.0,
      media: 8.75,
      status: "destaque",
    },
    {
      id: 2,
      nome: "Bruno Santos",
      matematica: 6.8,
      portugues: 7.2,
      media: 7.0,
      status: "intermediario",
    },
    {
      id: 3,
      nome: "Carlos Eduardo",
      matematica: 4.2,
      portugues: 4.5,
      media: 4.35,
      status: "risco",
    },
    {
      id: 4,
      nome: "Diana Oliveira",
      matematica: 9.2,
      portugues: 8.8,
      media: 9.0,
      status: "destaque",
    },
    {
      id: 5,
      nome: "Eduardo Costa",
      matematica: 7.2,
      portugues: 7.0,
      media: 7.1,
      status: "intermediario",
    },
    {
      id: 6,
      nome: "Fernanda Lima",
      matematica: 3.8,
      portugues: 4.0,
      media: 3.9,
      status: "risco",
    },
    {
      id: 7,
      nome: "Gabriel Mendes",
      matematica: 7.8,
      portugues: 7.5,
      media: 7.65,
      status: "intermediario",
    },
    {
      id: 8,
      nome: "Helena Rodrigues",
      matematica: 8.9,
      portugues: 9.1,
      media: 9.0,
      status: "destaque",
    },
    {
      id: 9,
      nome: "Igor Santos",
      matematica: 5.5,
      portugues: 6.0,
      media: 5.75,
      status: "intermediario",
    },
    {
      id: 10,
      nome: "Julia Lima",
      matematica: 7.0,
      portugues: 7.8,
      media: 7.4,
      status: "intermediario",
    },
  ],
  disciplinas: [
    {
      nome: "Matemática",
      media: 6.8,
      taxaAcerto: 68,
      provas: 4,
      status: "atencao",
    },
    { nome: "Português", media: 7.6, taxaAcerto: 76, provas: 4, status: "bom" },
  ],
  gruposAlunos: {
    risco: [
      { id: 1, nome: "João Silva", media: 4.2, provas: 7 },
      { id: 2, nome: "Maria Santos", media: 3.8, provas: 6 },
      { id: 3, nome: "Pedro Oliveira", media: 4.5, provas: 8 },
      { id: 4, nome: "Ana Costa", media: 3.2, provas: 5 },
    ],
    intermediario: [
      { id: 5, nome: "Carlos Souza", media: 6.5, provas: 8 },
      { id: 6, nome: "Julia Lima", media: 7.0, provas: 7 },
      { id: 7, nome: "Rafael Mendes", media: 6.8, provas: 8 },
    ],
    destaque: [
      { id: 8, nome: "Beatriz Alves", media: 9.2, provas: 8 },
      { id: 9, nome: "Lucas Ferreira", media: 8.8, provas: 8 },
      { id: 10, nome: "Camila Rocha", media: 9.5, provas: 8 },
    ],
  },
  insightsIA: [
    "A turma apresentou melhora de 8.5% na média geral nos últimos 2 meses",
    "Matemática precisa de atenção especial - 68% dos alunos tiveram dificuldade em equações",
    "4 alunos (12.5%) estão em situação de risco e precisam de reforço",
    "Destaque para Beatriz, Lucas e Camila que mantêm médias acima de 8.5",
    "Recomendação: Agendar aula de reforço de Matemática para o grupo de risco",
  ],
};

export default function TurmaInsightsPage() {
  const router = useRouter();
  const [tipoVisualizacao, setTipoVisualizacao] = useState<
    "provas" | "periodos" | "cluster"
  >("provas");
  const dadosGrafico =
    tipoVisualizacao === "provas"
      ? insightsMock.evolucaoProvas
      : insightsMock.evolucaoPeriodos;

  const getCorPorStatus = (status: string) => {
    if (status === "risco") return "#f97316"; // orange
    if (status === "destaque") return "#22c55e"; // green
    return "hsl(var(--primary))"; // azul para intermediário
  };

  const handleClickAluno = (aluno: { id: number; nome: string }) => {
    router.push(`/dashboard/alunos/${aluno.id}`);
  };

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
            <IconSchool className="size-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {insightsMock.turma.nome}
            </h1>
            <p className="text-muted-foreground">
              Raio-X da Turma • {insightsMock.turma.alunos} alunos
            </p>
          </div>
        </div>
      </div>

      {/* Layout Principal: Gráfico + Resumo LLM */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Lado Esquerdo - Gráfico (2 colunas) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Evolução da Turma</CardTitle>
                <CardDescription>
                  Acompanhe o desempenho ao longo do tempo
                </CardDescription>
              </div>
              <Select
                value={tipoVisualizacao}
                onValueChange={(value: "provas" | "periodos" | "cluster") =>
                  setTipoVisualizacao(value)
                }
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="provas">Linhas - Por Prova</SelectItem>
                  <SelectItem value="periodos">Linhas - Por Período</SelectItem>
                  <SelectItem value="cluster">Cluster - Por Aluno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {tipoVisualizacao === "cluster" ? (
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    type="number"
                    dataKey="matematica"
                    name="Matemática"
                    domain={[0, 10]}
                    label={{ value: "Matemática", position: "bottom" }}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="portugues"
                    name="Português"
                    domain={[0, 10]}
                    label={{ value: "Português", angle: -90, position: "left" }}
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
                              Matemática: {aluno.matematica}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Português: {aluno.portugues}
                            </p>
                            <p className="text-xs font-semibold">
                              Média: {aluno.media}
                            </p>
                            <p className="mt-1 text-xs text-secondary">
                              Clique para ver detalhes
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter
                    data={insightsMock.alunosCluster}
                    onClick={(data) => data && handleClickAluno(data)}
                    cursor="pointer"
                  >
                    {insightsMock.alunosCluster.map((aluno, index) => (
                      <Cell
                        key={index}
                        fill={getCorPorStatus(aluno.status)}
                        r={8}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dadosGrafico}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey={tipoVisualizacao === "provas" ? "data" : "periodo"}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="matematica"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Matemática"
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="portugues"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    name="Português"
                    dot={{ fill: "hsl(var(--secondary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="media"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    name="Média Geral"
                    dot={{ fill: "hsl(var(--foreground))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Lado Direito - Resumo da IA */}
        <Card>
          <CardHeader>
            <CardTitle>Plano de Ação</CardTitle>
            <CardDescription>Recomendações da IA para a turma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Resumo Principal */}
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-3">
              <h4 className="mb-1 text-sm font-semibold text-secondary">
                Visão Geral
              </h4>
              <p className="text-xs">
                A turma apresentou <strong>melhora de 8.5%</strong> na média
                geral nos últimos 2 meses. Matemática precisa de atenção
                especial.
              </p>
            </div>

            {/* Ações Recomendadas */}
            <div>
              <h4 className="mb-2 text-sm font-semibold">
                Ações Recomendadas:
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="mt-1 size-1.5 rounded-full bg-secondary" />
                  <p className="text-xs">
                    <strong>Reforço de Matemática:</strong> 4 alunos precisam de
                    aula extra sobre equações
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-1 size-1.5 rounded-full bg-secondary" />
                  <p className="text-xs">
                    <strong>Feedback Individual:</strong> Enviar mensagens
                    personalizadas para grupo de risco
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-1 size-1.5 rounded-full bg-secondary" />
                  <p className="text-xs">
                    <strong>Celebrar:</strong> 3 alunos mantêm médias acima de
                    8.5 - reconhecer desempenho
                  </p>
                </div>
              </div>
            </div>

            {/* Prioridade */}
            <div className="rounded-lg border-2 border-orange-200 bg-orange-50/50 p-3 dark:border-orange-900/30 dark:bg-orange-950/20">
              <div className="mb-1 flex items-center gap-2">
                <IconAlertTriangle className="size-4 text-orange-600" />
                <h4 className="text-sm font-semibold text-orange-600">
                  Prioridade Alta
                </h4>
              </div>
              <p className="text-xs text-orange-900 dark:text-orange-100">
                4 alunos (12.5%) estão em risco de reprovação. Agendar
                atendimento individual esta semana.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Ações */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:border-secondary hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Enviar Feedbacks</CardTitle>
            <CardDescription className="text-xs">
              Feedback personalizado para cada aluno
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              IA gerou 32 rascunhos de feedback prontos para revisar e enviar
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-secondary hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Agendar Reforço</CardTitle>
            <CardDescription className="text-xs">
              Criar aula de reforço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Sugestão: Aula de Matemática para 4 alunos do grupo de risco
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-secondary hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Exportar Relatório</CardTitle>
            <CardDescription className="text-xs">
              Gerar PDF completo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Baixar análise completa para compartilhar com coordenação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights da IA */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconSparkles className="size-5 text-secondary" />
            <CardTitle>Insights da IA</CardTitle>
          </div>
          <CardDescription>
            Análises automáticas geradas pela Inteligência Artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insightsMock.insightsIA.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-secondary/5 p-4"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">
                  {index + 1}
                </div>
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise por Disciplina */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Desempenho por Disciplina</CardTitle>
          <CardDescription>
            Média e taxa de acerto em cada matéria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insightsMock.disciplinas.map((disc) => (
              <div key={disc.nome} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{disc.nome}</span>
                      <Badge
                        variant={
                          disc.status === "bom" ? "secondary" : "outline"
                        }
                      >
                        {disc.status === "bom" ? "Bom" : "Precisa Atenção"}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {disc.provas} provas
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Média</span>
                        <span className="font-semibold">{disc.media}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-secondary"
                          style={{ width: `${(disc.media / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Taxa Acerto
                        </span>
                        <span className="font-semibold">
                          {disc.taxaAcerto}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${disc.taxaAcerto}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grupos de Alunos */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Grupo de Risco */}
        <Card className="border-orange-200 dark:border-orange-900/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconAlertTriangle className="size-5 text-orange-500" />
              <CardTitle>Grupo de Risco</CardTitle>
            </div>
            <CardDescription>Alunos com média abaixo de 5.0</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insightsMock.gruposAlunos.risco.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{aluno.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {aluno.provas} provas realizadas
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-600">
                    {aluno.media.toFixed(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grupo Intermediário */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconTarget className="size-5 text-primary" />
              <CardTitle>Intermediário</CardTitle>
            </div>
            <CardDescription>Alunos com média entre 5.0 e 7.9</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insightsMock.gruposAlunos.intermediario.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{aluno.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {aluno.provas} provas realizadas
                    </p>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    {aluno.media.toFixed(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grupo Destaque */}
        <Card className="border-green-200 dark:border-green-900/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconAward className="size-5 text-green-600 dark:text-green-400" />
              <CardTitle>Destaque</CardTitle>
            </div>
            <CardDescription>Alunos com média acima de 8.0</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insightsMock.gruposAlunos.destaque.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{aluno.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {aluno.provas} provas realizadas
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 dark:text-green-400"
                  >
                    {aluno.media.toFixed(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
