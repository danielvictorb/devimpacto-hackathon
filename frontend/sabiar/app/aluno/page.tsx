"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { IconArrowLeft, IconSchool, IconLoader2, IconUserCircle, IconBook } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentStats } from "@/components/student-stats"
import { PerformanceCharts } from "@/components/student-performance-charts"
import { StudentInsights } from "@/components/student-insights"
import { studentsAPI } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { StudentPerformance } from "@/lib/types/student"

export default function AlunoPage() {
  const [accessCode, setAccessCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [studentData, setStudentData] = useState<StudentPerformance | null>(null)
  const [error, setError] = useState("")

  // Para demo/dev, você pode descomentar isso para carregar dados mockados
  // useEffect(() => {
  //   loadMockData()
  // }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // TODO: Implementar busca por código de acesso
      // Por enquanto, usando ID fixo para demonstração
      const performance = await studentsAPI.getPerformance("STUDENT_ID_HERE")
      setStudentData(performance)
    } catch (err) {
      setError("Código de acesso inválido ou erro ao carregar dados")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function loadMockData() {
    // Dados mockados para demonstração
    const mockData: StudentPerformance = {
      student: {
        id: "1",
        class_id: "1",
        name: "Maria Silva",
        access_code: "ABC123",
        math_grade: 8.5,
        portuguese_grade: 9.0,
        overall_average: 8.75,
        attendance_percentage: 92.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      exams: [
        {
          exam: {
            id: "1",
            class_id: "1",
            teacher_id: "1",
            title: "Prova de Matemática - 1º Bimestre",
            total_points: 10,
            exam_date: "2024-03-15",
            period_type: "bimestral",
            period_number: 1,
            school_year: 2024,
            created_at: new Date().toISOString(),
          },
          studentExam: {
            id: "1",
            exam_id: "1",
            student_id: "1",
            total_score: 7.5,
            percentage: 75,
            submitted_at: new Date().toISOString(),
            status: "graded",
          },
          answers: [],
        },
        {
          exam: {
            id: "2",
            class_id: "1",
            teacher_id: "1",
            title: "Prova de Português - 1º Bimestre",
            total_points: 10,
            exam_date: "2024-03-20",
            period_type: "bimestral",
            period_number: 1,
            school_year: 2024,
            created_at: new Date().toISOString(),
          },
          studentExam: {
            id: "2",
            exam_id: "2",
            student_id: "1",
            total_score: 8.5,
            percentage: 85,
            submitted_at: new Date().toISOString(),
            status: "graded",
          },
          answers: [],
        },
        {
          exam: {
            id: "3",
            class_id: "1",
            teacher_id: "1",
            title: "Prova de Matemática - 2º Bimestre",
            total_points: 10,
            exam_date: "2024-05-15",
            period_type: "bimestral",
            period_number: 2,
            school_year: 2024,
            created_at: new Date().toISOString(),
          },
          studentExam: {
            id: "3",
            exam_id: "3",
            student_id: "1",
            total_score: 9.0,
            percentage: 90,
            submitted_at: new Date().toISOString(),
            status: "graded",
          },
          answers: [],
        },
      ],
      statistics: {
        totalExams: 3,
        averageScore: 83.33,
        bestScore: 90,
        worstScore: 75,
        improvementRate: 15,
      },
    }
    setStudentData(mockData)
  }

  // Tela de login
  if (!studentData) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
        <div className="container flex max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
            <IconSchool className="size-10 text-primary" />
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold">Área do Aluno</h1>
            <p className="text-lg text-muted-foreground">
              Acompanhe seu desempenho e receba insights personalizados
            </p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Acesse sua conta</CardTitle>
              <CardDescription>
                Digite seu código de acesso para ver seu desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Código de Acesso</Label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Digite seu código"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <IconLoader2 className="mr-2 size-4 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    "Acessar"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={loadMockData}
                >
                  Ver Demonstração
                </Button>
              </form>
            </CardContent>
          </Card>

          <Button variant="ghost" asChild>
            <Link href="/">
              <IconArrowLeft className="mr-2 size-4" />
              Voltar para o início
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Tela principal com dados do aluno
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-lg bg-primary/10">
              <IconUserCircle className="size-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{studentData.student.name}</h1>
              <p className="text-muted-foreground">
                Código: {studentData.student.access_code}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setStudentData(null)}
          >
            <IconArrowLeft className="mr-2 size-4" />
            Sair
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="mb-8">
          <StudentStats
            statistics={studentData.statistics}
            attendance={studentData.student.attendance_percentage}
            classAverage={75} // TODO: Buscar da API
            bestSubject={{ name: "Matemática", average: 85.5 }} // TODO: Buscar da API
          />
        </div>

        {/* Tabs com conteúdo detalhado */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="exams">Minhas Provas</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceCharts
              exams={studentData.exams}
              classAverages={[70, 72, 75]} // TODO: Buscar da API
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <StudentInsights
              averageScore={studentData.statistics.averageScore}
              improvementRate={studentData.statistics.improvementRate}
              totalExams={studentData.statistics.totalExams}
              attendance={studentData.student.attendance_percentage}
              strengths={[
                "Desempenho excelente em Português",
                "Melhoria constante nas notas",
              ]}
              weaknesses={[
                "Pode melhorar em questões de geometria",
              ]}
              recommendations={[
                "Pratique mais exercícios de álgebra",
                "Participe das aulas de reforço às terças-feiras",
              ]}
            />
          </TabsContent>

          <TabsContent value="exams" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Histórico de Provas</CardTitle>
                    <CardDescription>
                      Todas as suas avaliações e resultados
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.exams.map((examData) => (
                    <div
                      key={examData.exam.id}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                        <IconBook className="size-6 text-secondary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{examData.exam.title}</h3>
                          <Badge
                            variant="secondary"
                            className={cn(
                              (examData.studentExam.percentage || 0) >= 70
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            )}
                          >
                            {examData.studentExam.percentage?.toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {examData.exam.exam_date && new Date(examData.exam.exam_date).toLocaleDateString('pt-BR')}
                          {" • "}
                          Nota: {examData.studentExam.total_score?.toFixed(1)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Nota</p>
                        <p className="text-2xl font-bold">
                          {examData.studentExam.total_score?.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
