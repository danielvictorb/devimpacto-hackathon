"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconSearch,
  IconSchool,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconAward,
  IconChartBar,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data - Alunos
const alunosMock = [
  {
    id: 1,
    nome: "Ana Carolina Silva",
    turma: "9º Ano A",
    turmaId: 1,
    mediaGeral: 8.5,
    provasRealizadas: 8,
    taxaPresenca: 100,
    tendencia: "up",
    status: "destaque",
  },
  {
    id: 2,
    nome: "Bruno Santos",
    turma: "9º Ano A",
    turmaId: 1,
    mediaGeral: 6.8,
    provasRealizadas: 7,
    taxaPresenca: 87,
    tendencia: "up",
    status: "intermediario",
  },
  {
    id: 3,
    nome: "Carlos Eduardo",
    turma: "9º Ano B",
    turmaId: 2,
    mediaGeral: 4.2,
    provasRealizadas: 6,
    taxaPresenca: 75,
    tendencia: "down",
    status: "risco",
  },
  {
    id: 4,
    nome: "Diana Oliveira",
    turma: "1º Ano EM A",
    turmaId: 3,
    mediaGeral: 9.2,
    provasRealizadas: 9,
    taxaPresenca: 100,
    tendencia: "up",
    status: "destaque",
  },
  {
    id: 5,
    nome: "Eduardo Costa",
    turma: "9º Ano A",
    turmaId: 1,
    mediaGeral: 7.2,
    provasRealizadas: 8,
    taxaPresenca: 100,
    tendencia: "up",
    status: "intermediario",
  },
  {
    id: 6,
    nome: "Fernanda Lima",
    turma: "1º Ano EM B",
    turmaId: 4,
    mediaGeral: 3.8,
    provasRealizadas: 5,
    taxaPresenca: 62,
    tendencia: "down",
    status: "risco",
  },
  {
    id: 7,
    nome: "Gabriel Mendes",
    turma: "9º Ano B",
    turmaId: 2,
    mediaGeral: 7.8,
    provasRealizadas: 7,
    taxaPresenca: 100,
    tendencia: "up",
    status: "intermediario",
  },
  {
    id: 8,
    nome: "Helena Rodrigues",
    turma: "1º Ano EM A",
    turmaId: 3,
    mediaGeral: 8.9,
    provasRealizadas: 9,
    taxaPresenca: 100,
    tendencia: "up",
    status: "destaque",
  },
];

export default function AlunosPage() {
  const [busca, setBusca] = useState("");
  const [filtroTurma, setFiltroTurma] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Filtrar alunos
  const alunosFiltrados = alunosMock.filter((aluno) => {
    const matchBusca = aluno.nome.toLowerCase().includes(busca.toLowerCase());
    const matchTurma = filtroTurma === "todas" || aluno.turma === filtroTurma;
    const matchStatus =
      filtroStatus === "todos" || aluno.status === filtroStatus;

    return matchBusca && matchTurma && matchStatus;
  });

  const turmasUnicas = [...new Set(alunosMock.map((a) => a.turma))];

  const getStatusBadge = (status: string) => {
    if (status === "risco")
      return (
        <Badge variant="outline" className="text-orange-600">
          <IconAlertTriangle className="size-3" />
          Em Risco
        </Badge>
      );
    if (status === "destaque")
      return (
        <Badge variant="outline">
          <IconAward className="size-3" />
          Destaque
        </Badge>
      );
    return (
      <Badge variant="outline" className="text-primary">
        Intermediário
      </Badge>
    );
  };

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho individual de seus alunos
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
              placeholder="Buscar por nome do aluno..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="grid gap-4 md:grid-cols-2">
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
              <label className="text-sm font-medium">Desempenho</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="destaque">Destaque</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="risco">Em Risco</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contador */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {alunosFiltrados.length}{" "}
          {alunosFiltrados.length === 1
            ? "aluno encontrado"
            : "alunos encontrados"}
        </p>
      </div>

      {/* Grid de Alunos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alunosFiltrados.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <IconUsers className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  Nenhum aluno encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros de busca
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          alunosFiltrados.map((aluno) => (
            <Card key={aluno.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-secondary/10 text-secondary font-semibold">
                      {getInitials(aluno.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">{aluno.nome}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <IconSchool className="size-3" />
                      {aluno.turma}
                    </CardDescription>
                  </div>
                </div>
                <div className="mt-2">{getStatusBadge(aluno.status)}</div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Métricas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Média Geral</p>
                    <p className="text-xl font-bold">
                      {aluno.mediaGeral.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Provas</p>
                    <p className="text-xl font-bold">
                      {aluno.provasRealizadas}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Presença</span>
                    <span className="font-semibold">{aluno.taxaPresenca}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${aluno.taxaPresenca}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {aluno.tendencia === "up" ? (
                    <>
                      <IconTrendingUp className="size-3" />
                      <span>Melhorando</span>
                    </>
                  ) : (
                    <>
                      <IconTrendingDown className="size-3 text-orange-600" />
                      <span className="text-orange-600">Precisa atenção</span>
                    </>
                  )}
                </div>

                {/* Ação */}
                <Link href={`/dashboard/alunos/${aluno.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-secondary"
                  >
                    <IconChartBar className="size-4" />
                    Ver Detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
