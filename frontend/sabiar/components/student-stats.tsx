"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconMinus,
  IconAward,
  IconBook,
  IconCalendarCheck,
  IconUsers,
  IconTarget
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface StudentStatsProps {
  statistics: {
    totalExams: number
    averageScore: number
    bestScore: number
    worstScore: number
    improvementRate: number
  }
  attendance?: number
  classAverage?: number
  bestSubject?: {
    name: string
    average: number
  }
}

export function StudentStats({ 
  statistics, 
  attendance = 0,
  classAverage = 0,
  bestSubject = { name: "Matemática", average: 0 },
}: StudentStatsProps) {
  const getTrendIcon = (rate: number) => {
    if (rate > 5) return <IconTrendingUp className="size-4" />
    if (rate < -5) return <IconTrendingDown className="size-4" />
    return <IconMinus className="size-4" />
  }

  const getTrendColor = (rate: number) => {
    if (rate > 5) return "text-green-600 dark:text-green-400"
    if (rate < -5) return "text-red-600 dark:text-red-400"
    return "text-yellow-600 dark:text-yellow-400"
  }

  const getPerformanceStatus = (score: number) => {
    if (score >= 80) return { label: "Excelente", color: "bg-green-500" }
    if (score >= 70) return { label: "Bom", color: "bg-blue-500" }
    if (score >= 60) return { label: "Regular", color: "bg-yellow-500" }
    return { label: "Precisa Melhorar", color: "bg-red-500" }
  }

  const performanceStatus = getPerformanceStatus(statistics.averageScore)
  const comparisonDiff = statistics.averageScore - classAverage

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Média Geral */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
            <IconTarget className="size-5 text-secondary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.averageScore.toFixed(1)}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn("text-xs", performanceStatus.color, "text-white")}
            >
              {performanceStatus.label}
            </Badge>
            {statistics.totalExams > 0 && (
              <div className={cn("flex items-center gap-1 text-xs", getTrendColor(statistics.improvementRate))}>
                {getTrendIcon(statistics.improvementRate)}
                {Math.abs(statistics.improvementRate).toFixed(1)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Provas Realizadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Provas Realizadas</CardTitle>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <IconBook className="size-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalExams}</div>
          <div className="mt-2 flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              Melhor: <span className="font-semibold text-green-600 dark:text-green-400">
                {statistics.bestScore.toFixed(1)}
              </span>
            </div>
            {statistics.totalExams > 1 && (
              <div className="text-xs text-muted-foreground">
                Menor: <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {statistics.worstScore.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Frequência */}
      {attendance > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência</CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <IconCalendarCheck className="size-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {attendance >= 75 ? "Ótima frequência!" : "Atenção: frequência baixa"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Melhor Matéria */}
      {bestSubject && bestSubject.average > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Matéria</CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <IconAward className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestSubject.name}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-green-600 dark:text-green-400">
                {bestSubject.average.toFixed(1)} pts
              </span>
              <span className="text-muted-foreground">de média</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
