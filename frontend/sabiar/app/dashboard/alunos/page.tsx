"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconSearch,
  IconSchool,
  IconTrendingUp,
  IconChartBar,
  IconLoader2,
} from "@tabler/icons-react";
import { listarAlunos } from "@/lib/api";
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
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarAlunos();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Filtrar alunos
  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.name.toLowerCase().includes(busca.toLowerCase())
  );

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

      {/* Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Buscar Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do aluno..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading ? (
        <div className="py-12 text-center">
          <IconLoader2 className="mx-auto mb-4 size-12 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando alunos...</p>
        </div>
      ) : (
        <>
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
              alunosFiltrados.map((aluno) => {
                // Usar dados do banco ou mock quando não disponível
                const media = aluno.overall_average || 7.0;
                const presenca = aluno.attendance_percentage || 85;

                return (
                  <Card key={aluno.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-12">
                          <AvatarFallback className="bg-secondary/10 font-semibold text-secondary">
                            {getInitials(aluno.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-base">{aluno.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <IconSchool className="size-3" />
                            {aluno.registration_number || "Aluno"}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline">{aluno.enrollment_status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Métricas */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Média Geral
                          </p>
                          <p className="text-xl font-bold">{media.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Presença</p>
                          <p className="text-xl font-bold">
                            {presenca.toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Matemática
                          </span>
                          <span className="font-semibold">
                            {aluno.math_grade?.toFixed(1) || "-"}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `${((aluno.math_grade || 0) / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">Português</span>
                          <span className="font-semibold">
                            {aluno.portuguese_grade?.toFixed(1) || "-"}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-secondary"
                            style={{
                              width: `${((aluno.portuguese_grade || 0) / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <IconTrendingUp className="size-3" />
                        <span>Acompanhando desempenho</span>
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
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
