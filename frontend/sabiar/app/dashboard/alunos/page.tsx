"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconSearch,
  IconSchool,
  IconAlertTriangle,
  IconFilter,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { listarTodosAlunos, listarTurmas } from "@/lib/dados";
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

export default function AlunosPage() {
  const alunos = listarTodosAlunos();
  const turmas = listarTurmas();

  const [busca, setBusca] = useState("");
  const [filtroTurma, setFiltroTurma] = useState<string>("todas");
  const [filtroRisco, setFiltroRisco] = useState<string>("todos");
  const [filtroDesempenho, setFiltroDesempenho] = useState<string>("todos");

  // Filtrar alunos
  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const matchBusca = aluno.nome_aluno
        .toLowerCase()
        .includes(busca.toLowerCase());
      const matchTurma = filtroTurma === "todas" || aluno.turma === filtroTurma;
      const matchRisco = filtroRisco === "todos" || aluno.risco === filtroRisco;
      const matchDesempenho =
        filtroDesempenho === "todos" ||
        aluno.nivel_desempenho === filtroDesempenho;

      return matchBusca && matchTurma && matchRisco && matchDesempenho;
    });
  }, [alunos, busca, filtroTurma, filtroRisco, filtroDesempenho]);

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Estatísticas rápidas
  const stats = {
    total: alunos.length,
    emRisco: alunos.filter((a) => a.risco === "Alto").length,
    baixoDesempenho: alunos.filter((a) => a.nivel_desempenho === "Baixo")
      .length,
    altoDesempenho: alunos.filter((a) => a.nivel_desempenho === "Alto").length,
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho individual dos 180 alunos da escola
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Matriculados na escola
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Em Risco Alto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.emRisco}
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.emRisco / stats.total) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Baixo Desempenho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.baixoDesempenho}
            </div>
            <p className="text-xs text-muted-foreground">
              Nota média abaixo de 4
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Alto Desempenho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.altoDesempenho}
            </div>
            <p className="text-xs text-muted-foreground">
              Nota média acima de 7
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconFilter className="size-5 text-secondary" />
            <CardTitle className="text-lg">Buscar e Filtrar</CardTitle>
          </div>
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
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Turma</label>
              <Select value={filtroTurma} onValueChange={setFiltroTurma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as turmas</SelectItem>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.turma_id} value={turma.turma_id}>
                      {turma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Risco</label>
              <Select value={filtroRisco} onValueChange={setFiltroRisco}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os níveis</SelectItem>
                  <SelectItem value="Alto">Risco Alto</SelectItem>
                  <SelectItem value="Baixo">Risco Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Desempenho
              </label>
              <Select
                value={filtroDesempenho}
                onValueChange={setFiltroDesempenho}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os níveis</SelectItem>
                  <SelectItem value="Alto">Alto Desempenho</SelectItem>
                  <SelectItem value="Médio">Desempenho Médio</SelectItem>
                  <SelectItem value="Baixo">Baixo Desempenho</SelectItem>
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
        {(busca ||
          filtroTurma !== "todas" ||
          filtroRisco !== "todos" ||
          filtroDesempenho !== "todos") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBusca("");
              setFiltroTurma("todas");
              setFiltroRisco("todos");
              setFiltroDesempenho("todos");
            }}
          >
            Limpar Filtros
          </Button>
        )}
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
          alunosFiltrados.map((aluno) => {
            const statusColor =
              aluno.risco === "Alto"
                ? "bg-red-500/10 text-red-600 border-red-200"
                : aluno.nivel_desempenho === "Alto"
                ? "bg-green-500/10 text-green-600 border-green-200"
                : "bg-blue-500/10 text-blue-600 border-blue-200";

            return (
              <Card key={aluno.id} className="relative overflow-hidden">
                {/* Indicador de Risco */}
                {aluno.risco === "Alto" && (
                  <div className="absolute right-2 top-2">
                    <IconAlertTriangle className="size-5 text-red-500" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-12">
                      <AvatarFallback
                        className={`font-semibold ${statusColor}`}
                      >
                        {getInitials(aluno.nome_aluno)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-1">
                        {aluno.nome_aluno}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <IconSchool className="size-3" />
                        Turma {aluno.turma}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge
                      variant={
                        aluno.risco === "Alto" ? "destructive" : "outline"
                      }
                      className="text-xs"
                    >
                      {aluno.risco === "Alto" ? "Risco Alto" : "OK"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {aluno.nivel_desempenho}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Métricas Principais */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Média Geral
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          aluno.nota_media >= 7
                            ? "text-green-600"
                            : aluno.nota_media >= 4
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {aluno.nota_media.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Frequência
                      </p>
                      <p className="text-xl font-bold">
                        {aluno.frequencia_pct.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Notas por Matéria */}
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Matemática</span>
                      <span className="font-semibold">
                        {aluno.media_matematica?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            ((aluno.media_matematica || 0) / 10) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Português</span>
                      <span className="font-semibold">
                        {aluno.media_portugues?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-secondary"
                        style={{
                          width: `${
                            ((aluno.media_portugues || 0) / 10) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="space-y-1 border-t pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Trabalha</span>
                      <span className="font-medium">{aluno.trabalha}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Renda Familiar
                      </span>
                      <span className="font-medium">
                        R$ {aluno.renda_familiar?.toFixed(0) || "0"}
                      </span>
                    </div>
                  </div>

                  {/* Tendência */}
                  <div className="flex items-center gap-1 text-xs">
                    {aluno.nota_media >= 5 ? (
                      <>
                        <IconTrendingUp className="size-3 text-green-600" />
                        <span className="text-green-600">Bom desempenho</span>
                      </>
                    ) : (
                      <>
                        <IconTrendingDown className="size-3 text-red-600" />
                        <span className="text-red-600">Precisa atenção</span>
                      </>
                    )}
                  </div>

                  {/* Ação */}
                  <Link href={`/dashboard/alunos/${aluno.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Perfil Completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
