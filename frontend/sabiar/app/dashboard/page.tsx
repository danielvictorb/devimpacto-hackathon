import Link from "next/link";
import {
  IconFileText,
  IconUsers,
  IconClock,
  IconChartBar,
  IconTrendingUp,
  IconPlus,
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

// Mock data - substituir por API real depois
const mockData = {
  provasCorrigidas: 24,
  alunosAtivos: 156,
  horasEconomizadas: 42,
  taxaAcertoMedia: 72,
  provasRecentes: [
    {
      id: 1,
      titulo: "Prova de Biologia - Fotossíntese",
      data: "15 Nov 2025",
      alunos: 32,
      status: "concluida",
      mediaGeral: 6.2,
    },
    {
      id: 2,
      titulo: "Avaliação de História - Rev. Francesa",
      data: "12 Nov 2025",
      alunos: 28,
      status: "em_correcao",
      mediaGeral: null,
    },
    {
      id: 3,
      titulo: "Teste de Matemática - Equações",
      data: "08 Nov 2025",
      alunos: 30,
      status: "concluida",
      mediaGeral: 7.5,
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, Professor(a)!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Provas Corrigidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Provas Corrigidas
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
              <IconFileText className="size-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.provasCorrigidas}
            </div>
            <p className="text-xs text-muted-foreground">Total até o momento</p>
          </CardContent>
        </Card>

        {/* Alunos Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <IconUsers className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.alunosAtivos}</div>
            <p className="text-xs text-muted-foreground">Nas suas turmas</p>
          </CardContent>
        </Card>

        {/* Horas Economizadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas Economizadas
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
              <IconClock className="size-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.horasEconomizadas}
            </div>
            <p className="text-xs text-muted-foreground">Tempo ganho com IA</p>
          </CardContent>
        </Card>

        {/* Taxa de Acerto Média */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Acerto Média
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <IconChartBar className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.taxaAcertoMedia}%
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <IconTrendingUp className="size-3" />
              +5% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provas Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Provas Recentes</CardTitle>
              <CardDescription>
                Suas últimas avaliações e seu status
              </CardDescription>
            </div>
            <Link href="/dashboard/provas">
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.provasRecentes.map((prova) => (
              <Link
                key={prova.id}
                href={`/dashboard/provas/${prova.id}`}
                className="block"
              >
                <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                    <IconFileText className="size-6 text-secondary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{prova.titulo}</h3>
                      {prova.status === "concluida" ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                          Concluída
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        >
                          Em Correção
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {prova.data} • {prova.alunos} alunos
                      {prova.mediaGeral && ` • Média: ${prova.mediaGeral}`}
                    </p>
                  </div>

                  <Button variant="ghost" size="sm">
                    {prova.status === "concluida"
                      ? "Ver Insights"
                      : "Continuar"}
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          {mockData.provasRecentes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconFileText className="mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhuma prova ainda
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Comece criando sua primeira prova com IA
              </p>
              <Link href="/dashboard/nova-prova">
                <Button variant="secondary">
                  <IconPlus className="size-4" />
                  Criar Primeira Prova
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
