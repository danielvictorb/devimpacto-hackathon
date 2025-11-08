import {
  IconClipboardList,
  IconChartBar,
  IconTrendingUp,
  IconAward,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - substituir por API depois
const alunoMock = {
  nome: "Maria Silva",
  codigo: "ABC123",
  turma: "9º Ano A",
  mediaGeral: 8.3,
  provasRealizadas: 3,
  melhorNota: 9.0,
  piorNota: 7.5,
  frequencia: 92.5,
  melhorMateria: "Matemática",
  mediaMateria: 8.55,
};

export default function AlunoDashboardPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Olá, {alunoMock.nome.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) à sua área do aluno
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alunoMock.mediaGeral}</div>
            <div className="flex items-center gap-1">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Excelente
              </Badge>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <IconTrendingUp className="size-3" />
                +1.5%
              </div>
            </div>
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
              {alunoMock.provasRealizadas}
            </div>
            <p className="text-xs text-muted-foreground">
              Melhor: {alunoMock.melhorNota} • Menor: {alunoMock.piorNota}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alunoMock.frequencia}%</div>
            <p className="text-xs text-muted-foreground">Ótima frequência!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Melhor Matéria
            </CardTitle>
            <IconAward className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alunoMock.melhorMateria}</div>
            <p className="text-xs text-muted-foreground">
              {alunoMock.mediaMateria} pts de média
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Aluno</CardTitle>
          <CardDescription>Seus dados de cadastro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Nome Completo</p>
              <p className="font-semibold">{alunoMock.nome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Turma</p>
              <p className="font-semibold">{alunoMock.turma}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Código de Acesso</p>
              <p className="font-semibold">{alunoMock.codigo}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

