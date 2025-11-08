"use client";

import { useState } from "react";
import {
  IconSchool,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconSparkles,
  IconAward,
  IconTarget,
  IconClipboardList,
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
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  const [tipoVisualizacao, setTipoVisualizacao] = useState<
    "provas" | "periodos"
  >("provas");
  const dadosGrafico =
    tipoVisualizacao === "provas"
      ? insightsMock.evolucaoProvas
      : insightsMock.evolucaoPeriodos;

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

      {/* Cards de Métricas */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <IconTarget className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insightsMock.metricas.mediaGeral.toFixed(1)}
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                insightsMock.metricas.tendencia === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-orange-600 dark:text-orange-400"
              )}
            >
              {insightsMock.metricas.tendencia === "up" ? (
                <IconTrendingUp className="size-3" />
              ) : (
                <IconTrendingDown className="size-3" />
              )}
              {insightsMock.metricas.variacao}% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Acerto
            </CardTitle>
            <IconTarget className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insightsMock.metricas.taxaAcerto}%
            </div>
            <p className="text-xs text-muted-foreground">
              Média de acertos nas {insightsMock.metricas.totalProvas} provas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Provas Realizadas
            </CardTitle>
            <IconClipboardList className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insightsMock.metricas.totalProvas}
            </div>
            <p className="text-xs text-muted-foreground">
              {insightsMock.metricas.horasEconomizadas}h economizadas com IA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alunos em Risco
            </CardTitle>
            <IconAlertTriangle className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insightsMock.gruposAlunos.risco.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (insightsMock.gruposAlunos.risco.length /
                  insightsMock.turma.alunos) *
                100
              ).toFixed(1)}
              % da turma
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Evolução da Turma */}
        <Card>
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
                onValueChange={(value: "provas" | "periodos") =>
                  setTipoVisualizacao(value)
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="provas">Por Prova</SelectItem>
                  <SelectItem value="periodos">Por Período</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
          </CardContent>
        </Card>

        {/* Distribuição de Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Notas</CardTitle>
            <CardDescription>
              Quantidade de alunos por faixa de nota
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insightsMock.distribuicaoNotas}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="faixa"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value} alunos`, "Quantidade"]}
                />
                <Bar
                  dataKey="quantidade"
                  fill="hsl(var(--secondary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
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
