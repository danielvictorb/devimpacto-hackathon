"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconClipboardList,
  IconSearch,
  IconFileText,
  IconEye,
  IconChartBar,
  IconCalendar,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - Provas
const provasMock = [
  {
    id: 1,
    titulo: "Prova de Matemática - Equações",
    disciplina: "Matemática",
    turma: "9º Ano A",
    turmaId: 1,
    data: "20 Nov 2025",
    status: "concluida",
    totalAlunos: 32,
    alunosResponderam: 32,
    mediaGeral: 7.5,
    totalQuestoes: 10,
  },
  {
    id: 2,
    titulo: "Avaliação de Português - Interpretação",
    disciplina: "Português",
    turma: "9º Ano A",
    turmaId: 1,
    data: "18 Nov 2025",
    status: "concluida",
    totalAlunos: 32,
    alunosResponderam: 32,
    mediaGeral: 8.2,
    totalQuestoes: 8,
  },
  {
    id: 3,
    titulo: "Prova de Matemática - Geometria",
    disciplina: "Matemática",
    turma: "9º Ano B",
    turmaId: 2,
    data: "15 Nov 2025",
    status: "em_correcao",
    totalAlunos: 28,
    alunosResponderam: 28,
    mediaGeral: null,
    totalQuestoes: 12,
  },
  {
    id: 4,
    titulo: "Prova de Português - Gramática",
    disciplina: "Português",
    turma: "1º Ano EM A",
    turmaId: 3,
    data: "12 Nov 2025",
    status: "concluida",
    totalAlunos: 35,
    alunosResponderam: 35,
    mediaGeral: 6.8,
    totalQuestoes: 15,
  },
  {
    id: 5,
    titulo: "Avaliação Diagnóstica - Matemática",
    disciplina: "Matemática",
    turma: "1º Ano EM B",
    turmaId: 4,
    data: "10 Nov 2025",
    status: "publicada",
    totalAlunos: 30,
    alunosResponderam: 18,
    mediaGeral: null,
    totalQuestoes: 10,
  },
];

export default function ProvasPage() {
  const [busca, setBusca] = useState("");
  const [filtroTurma, setFiltroTurma] = useState("todas");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Filtrar provas
  const provasFiltradas = provasMock.filter((prova) => {
    const matchBusca = prova.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchTurma = filtroTurma === "todas" || prova.turma === filtroTurma;
    const matchDisciplina =
      filtroDisciplina === "todas" || prova.disciplina === filtroDisciplina;
    const matchStatus =
      filtroStatus === "todos" || prova.status === filtroStatus;

    return matchBusca && matchTurma && matchDisciplina && matchStatus;
  });

  const turmasUnicas = [...new Set(provasMock.map((p) => p.turma))];

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Provas</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas provas e avaliações
        </p>
      </div>

      {/* Busca e Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título da prova..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Turma</label>
              <Select value={filtroTurma} onValueChange={setFiltroTurma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as turmas</SelectItem>
                  {turmasUnicas.map((turma) => (
                    <SelectItem key={turma} value={turma}>
                      {turma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Disciplina</label>
              <Select
                value={filtroDisciplina}
                onValueChange={setFiltroDisciplina}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="Português">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="em_correcao">Em Correção</SelectItem>
                  <SelectItem value="publicada">Publicada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Provas */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {provasFiltradas.length}{" "}
          {provasFiltradas.length === 1
            ? "prova encontrada"
            : "provas encontradas"}
        </p>
      </div>

      <div className="space-y-4">
        {provasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <IconClipboardList className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhuma prova encontrada
              </h3>
              <p className="text-sm text-muted-foreground">
                Tente ajustar os filtros ou criar uma nova prova
              </p>
            </CardContent>
          </Card>
        ) : (
          provasFiltradas.map((prova) => (
            <Card key={prova.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                      <IconFileText className="size-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <CardTitle className="text-xl">
                          {prova.titulo}
                        </CardTitle>
                        {prova.status === "concluida" && (
                          <Badge
                            variant="outline"
                            className="text-green-600 dark:text-green-400"
                          >
                            Concluída
                          </Badge>
                        )}
                        {prova.status === "em_correcao" && (
                          <Badge
                            variant="outline"
                            className="text-orange-600 dark:text-orange-400"
                          >
                            Em Correção
                          </Badge>
                        )}
                        {prova.status === "publicada" && (
                          <Badge variant="outline" className="text-primary">
                            Publicada
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="size-4" />
                          {prova.data}
                        </span>
                        <span>•</span>
                        <span>{prova.turma}</span>
                        <span>•</span>
                        <span>{prova.disciplina}</span>
                        <span>•</span>
                        <span>{prova.totalQuestoes} questões</span>
                        <span>•</span>
                        <span>
                          {prova.alunosResponderam}/{prova.totalAlunos} alunos
                        </span>
                        {prova.mediaGeral && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-foreground">
                              Média: {prova.mediaGeral}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/provas/${prova.id}/gabarito`}>
                    <Button variant="ghost" size="sm">
                      <IconFileText className="size-4" />
                      Ver Gabarito
                    </Button>
                  </Link>
                  <Link href={`/dashboard/provas/${prova.id}/respostas`}>
                    <Button variant="ghost" size="sm">
                      <IconEye className="size-4" />
                      Ver Respostas
                    </Button>
                  </Link>
                  {prova.status === "concluida" && (
                    <Link href={`/dashboard/provas/${prova.id}/insights`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-secondary"
                      >
                        <IconChartBar className="size-4" />
                        Ver Insights
                      </Button>
                    </Link>
                  )}
                  {prova.status === "em_correcao" && (
                    <Link href={`/dashboard/provas/${prova.id}/corrigir`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600"
                      >
                        Continuar Correção
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
