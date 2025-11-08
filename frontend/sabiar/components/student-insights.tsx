"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  IconBulb,
  IconTrendingUp,
  IconAlertCircle,
  IconSparkles,
  IconTarget,
  IconBook,
  IconChartBar
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface StudentInsightsProps {
  averageScore: number
  improvementRate: number
  totalExams: number
  attendance?: number
  strengths?: string[]
  weaknesses?: string[]
  recommendations?: string[]
}

export function StudentInsights({ 
  averageScore, 
  improvementRate,
  totalExams,
  attendance = 0,
  strengths = [],
  weaknesses = [],
  recommendations = []
}: StudentInsightsProps) {
  
  // Gerar insights automáticos baseados nos dados
  const generateInsights = () => {
    const insights: Array<{ type: 'success' | 'warning' | 'info'; message: string; icon: React.ReactNode }> = []

    // Insights sobre média
    if (averageScore >= 80) {
      insights.push({
        type: 'success',
        message: 'Excelente desempenho! Continue assim!',
        icon: <IconSparkles className="size-5" />
      })
    } else if (averageScore >= 60) {
      insights.push({
        type: 'info',
        message: 'Bom desempenho! Com mais dedicação, você pode alcançar a excelência.',
        icon: <IconTrendingUp className="size-5" />
      })
    } else {
      insights.push({
        type: 'warning',
        message: 'É importante dedicar mais tempo aos estudos para melhorar suas notas.',
        icon: <IconAlertCircle className="size-5" />
      })
    }

    // Insights sobre evolução
    if (improvementRate > 10) {
      insights.push({
        type: 'success',
        message: `Parabéns! Você melhorou ${improvementRate.toFixed(1)}% nas últimas provas!`,
        icon: <IconTrendingUp className="size-5" />
      })
    } else if (improvementRate < -10) {
      insights.push({
        type: 'warning',
        message: 'Suas notas estão em queda. Que tal revisar o conteúdo e pedir ajuda?',
        icon: <IconAlertCircle className="size-5" />
      })
    }

    // Insights sobre frequência
    if (attendance > 0 && attendance < 75) {
      insights.push({
        type: 'warning',
        message: 'Sua frequência está abaixo do ideal. A presença regular é fundamental para o aprendizado.',
        icon: <IconAlertCircle className="size-5" />
      })
    } else if (attendance >= 90) {
      insights.push({
        type: 'success',
        message: 'Ótima frequência! Você está sempre presente nas aulas.',
        icon: <IconSparkles className="size-5" />
      })
    }

    return insights
  }

  const autoInsights = generateInsights()

  // Gerar recomendações personalizadas
  const generateRecommendations = () => {
    const recs: string[] = [...recommendations]

    if (averageScore < 70) {
      recs.push('Dedique pelo menos 1 hora por dia para revisar o conteúdo das aulas')
      recs.push('Faça resumos e mapas mentais para fixar melhor os conceitos')
    }

    if (improvementRate < 0) {
      recs.push('Converse com seu professor sobre as dificuldades que está enfrentando')
      recs.push('Participe de grupos de estudo com seus colegas')
    }

    if (totalExams < 3) {
      recs.push('Continue realizando as provas para ter um histórico mais completo')
    }

    if (recs.length === 0) {
      recs.push('Continue estudando e se dedicando aos estudos!')
      recs.push('Mantenha uma rotina de estudos organizada')
    }

    return recs.slice(0, 5) // Máximo 5 recomendações
  }

  const finalRecommendations = generateRecommendations()

  // Calcular pontos fortes e fracos automáticos
  const autoStrengths = [...strengths]
  const autoWeaknesses = [...weaknesses]

  if (averageScore >= 80 && autoStrengths.length === 0) {
    autoStrengths.push('Desempenho consistente nas avaliações')
  }
  if (improvementRate > 5 && autoStrengths.length < 2) {
    autoStrengths.push('Boa evolução ao longo do tempo')
  }
  if (attendance >= 85 && autoStrengths.length < 3) {
    autoStrengths.push('Frequência exemplar')
  }

  if (averageScore < 60 && autoWeaknesses.length === 0) {
    autoWeaknesses.push('Necessita reforço nos conteúdos básicos')
  }
  if (improvementRate < -5 && autoWeaknesses.length < 2) {
    autoWeaknesses.push('Queda no desempenho recente')
  }
  if (attendance < 75 && attendance > 0 && autoWeaknesses.length < 3) {
    autoWeaknesses.push('Frequência irregular')
  }

  return (
    <div className="space-y-6">
      {/* Insights Principais */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
              <IconBulb className="size-5 text-secondary" />
            </div>
            <div>
              <CardTitle>Insights Personalizados</CardTitle>
              <CardDescription>
                Análise do seu desempenho acadêmico
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {autoInsights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4",
                insight.type === 'success' && "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20",
                insight.type === 'warning' && "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20",
                insight.type === 'info' && "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20"
              )}
            >
              <div className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                insight.type === 'success' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                insight.type === 'warning' && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
                insight.type === 'info' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              )}>
                {insight.icon}
              </div>
              <p className="text-sm leading-relaxed">{insight.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pontos Fortes */}
        {autoStrengths.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                  <IconSparkles className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Seus Pontos Fortes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {autoStrengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-950/20">
                  <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-green-600 dark:bg-green-400" />
                  <p className="text-sm">{strength}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Áreas de Melhoria */}
        {autoWeaknesses.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <IconTarget className="size-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-lg">Áreas de Melhoria</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {autoWeaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                  <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                  <p className="text-sm">{weakness}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <IconBook className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>Recomendações para Você</CardTitle>
              <CardDescription>
                Dicas para melhorar ainda mais seu desempenho
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {finalRecommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg border p-4">
              <Badge 
                variant="secondary" 
                className="mt-0.5 size-7 shrink-0 items-center justify-center rounded-lg p-0 font-semibold"
              >
                {index + 1}
              </Badge>
              <p className="text-sm leading-relaxed">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meta de Progresso */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
              <IconChartBar className="size-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Sua Jornada de Aprendizado</CardTitle>
              <CardDescription>
                Progresso em direção à excelência
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso Atual</span>
              <span className="text-2xl font-bold">{averageScore.toFixed(1)}%</span>
            </div>
            <Progress value={averageScore} className="h-3" />
          </div>
          
          {averageScore < 100 && (
            <div className="rounded-lg border bg-muted/50 p-4 text-sm">
              <p className="text-muted-foreground">
                Faltam <span className="font-semibold text-foreground">
                  {(100 - averageScore).toFixed(1)} pontos
                </span> para alcançar a pontuação máxima!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
