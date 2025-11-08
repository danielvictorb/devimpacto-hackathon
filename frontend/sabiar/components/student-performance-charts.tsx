"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import type { StudentExam } from "@/lib/types/student"

interface PerformanceChartsProps {
  exams: Array<{
    exam: {
      id: string
      title: string
      exam_date?: string
      period_type?: string
    }
    studentExam: StudentExam
  }>
  classAverages?: number[]
}

export function PerformanceCharts({ exams, classAverages = [] }: PerformanceChartsProps) {
  // Preparar dados para gráfico de evolução
  const evolutionData = exams.map((exam, index) => ({
    name: exam.exam.title.substring(0, 20) + (exam.exam.title.length > 20 ? '...' : ''),
    data: exam.exam.exam_date || `Prova ${index + 1}`,
    aluno: exam.studentExam.percentage || 0,
    turma: classAverages[index] || 0,
  }))

  // Preparar dados para gráfico de distribuição de notas
  const scoreDistribution = [
    { 
      range: "0-40", 
      quantidade: exams.filter(e => (e.studentExam.percentage || 0) < 40).length,
      fill: "hsl(var(--chart-5))"
    },
    { 
      range: "40-60", 
      quantidade: exams.filter(e => (e.studentExam.percentage || 0) >= 40 && (e.studentExam.percentage || 0) < 60).length,
      fill: "hsl(var(--chart-4))"
    },
    { 
      range: "60-80", 
      quantidade: exams.filter(e => (e.studentExam.percentage || 0) >= 60 && (e.studentExam.percentage || 0) < 80).length,
      fill: "hsl(var(--chart-3))"
    },
    { 
      range: "80-100", 
      quantidade: exams.filter(e => (e.studentExam.percentage || 0) >= 80).length,
      fill: "hsl(var(--chart-1))"
    },
  ]

  // Preparar dados para comparação por período
  const periodData: Record<string, { total: number; sum: number; count: number }> = {}
  
  exams.forEach((exam) => {
    const period = exam.exam.period_type || "Geral"
    if (!periodData[period]) {
      periodData[period] = { total: 0, sum: 0, count: 0 }
    }
    periodData[period].sum += exam.studentExam.percentage || 0
    periodData[period].count += 1
  })

  const periodComparison = Object.entries(periodData).map(([period, data]) => ({
    periodo: period.charAt(0).toUpperCase() + period.slice(1),
    media: data.sum / data.count,
    fill: "hsl(var(--chart-2))"
  }))

  const chartConfig = {
    aluno: {
      label: "Você",
      color: "hsl(var(--chart-1))",
    },
    turma: {
      label: "Média da Turma",
      color: "hsl(var(--chart-2))",
    },
  }

  if (exams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráficos de Desempenho</CardTitle>
          <CardDescription>
            Nenhuma prova realizada ainda
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          Realize provas para ver seus gráficos de desempenho
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Gráfico de Evolução */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Desempenho</CardTitle>
          <CardDescription>
            Acompanhe seu progresso ao longo das provas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorAluno" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorTurma" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="aluno"
                  name="Você"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorAluno)"
                  strokeWidth={2}
                />
                {classAverages.length > 0 && (
                  <Area
                    type="monotone"
                    dataKey="turma"
                    name="Média da Turma"
                    stroke="#60a5fa"
                    fillOpacity={1}
                    fill="url(#colorTurma)"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Distribuição de Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Notas</CardTitle>
            <CardDescription>
              Quantidade de provas por faixa de nota
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="range" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="quantidade" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Média por Período */}
        {periodComparison.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Período</CardTitle>
              <CardDescription>
                Média de notas em cada período avaliativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={periodComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="periodo" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="media" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
