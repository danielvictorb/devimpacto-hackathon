import Link from "next/link";
import {
  IconSchool,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - turmas com estatísticas
const turmasMock = [
  {
    id: 1,
    nome: "9º Ano A",
    alunos: 32,
    mediaGeral: 7.2,
    taxaAcerto: 72,
    alunosRisco: 4,
    provasRealizadas: 8,
    tendencia: "up",
  },
  {
    id: 2,
    nome: "9º Ano B",
    alunos: 28,
    mediaGeral: 6.8,
    taxaAcerto: 68,
    alunosRisco: 6,
    provasRealizadas: 7,
    tendencia: "down",
  },
  {
    id: 3,
    nome: "1º Ano EM A",
    alunos: 35,
    mediaGeral: 7.8,
    taxaAcerto: 78,
    alunosRisco: 2,
    provasRealizadas: 9,
    tendencia: "up",
  },
  {
    id: 4,
    nome: "1º Ano EM B",
    alunos: 30,
    mediaGeral: 6.5,
    taxaAcerto: 65,
    alunosRisco: 8,
    provasRealizadas: 6,
    tendencia: "down",
  },
];

export default function TurmasPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
        <p className="text-muted-foreground">
          Gerencie suas turmas e acompanhe o desempenho
        </p>
      </div>

      {/* Grid de Turmas */}
      <div className="grid gap-6 md:grid-cols-2">
        {turmasMock.map((turma) => (
          <Card key={turma.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                    <IconSchool className="size-6 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{turma.nome}</CardTitle>
                    <CardDescription>{turma.alunos} alunos</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={turma.tendencia === "down" ? "secondary" : "outline"}
                >
                  {turma.tendencia === "up" ? (
                    <IconTrendingUp className="size-3" />
                  ) : (
                    <IconTrendingDown className="size-3" />
                  )}
                  {turma.tendencia === "up" ? "Melhorando" : "Precisa atenção"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Média Geral</p>
                  <p className="text-2xl font-bold">
                    {turma.mediaGeral.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Taxa de Acerto
                  </p>
                  <p className="text-2xl font-bold">{turma.taxaAcerto}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Provas Realizadas
                  </p>
                  <p className="text-lg font-semibold">
                    {turma.provasRealizadas}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Alunos em Risco
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-semibold">{turma.alunosRisco}</p>
                    {turma.alunosRisco > 5 && (
                      <IconAlertTriangle className="size-4 text-orange-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/dashboard/turmas/${turma.id}/insights`}
                  className="flex-1"
                >
                  <Button variant="secondary" className="w-full">
                    <IconChartBar className="size-4" />
                    Ver Insights
                  </Button>
                </Link>
                <Link href={`/dashboard/turmas/${turma.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Gerenciar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
