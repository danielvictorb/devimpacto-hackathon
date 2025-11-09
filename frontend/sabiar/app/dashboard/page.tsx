"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconFileText,
  IconUsers,
  IconChartBar,
  IconTrendingUp,
  IconPlus,
  IconLoader2,
} from "@tabler/icons-react";
import { listarProvas, listarTurmas } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [provas, setProvas] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [provasData, turmasData] = await Promise.all([
          listarProvas(),
          listarTurmas(),
        ]);
        setProvas(provasData);
        setTurmas(turmasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Calcular estatísticas a partir dos dados reais
  const totalTurmas = turmas.length;
  const totalAlunos = turmas.reduce(
    (sum, t) => sum + (t.student_count || 0),
    0
  );
  const provasRecentes = provas.slice(0, 3); // Primeiras 3 provas

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Visão Geral da Escola
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, Diretor(a)!
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-12 text-center">
          <IconLoader2 className="mx-auto mb-4 size-12 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total de Alunos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Alunos
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <IconUsers className="size-5 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAlunos}</div>
                <p className="text-xs text-muted-foreground">
                  Matriculados na escola
                </p>
              </CardContent>
            </Card>

            {/* Turmas Ativas */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Turmas Ativas
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconUsers className="size-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTurmas}</div>
                <p className="text-xs text-muted-foreground">
                  Em funcionamento
                </p>
              </CardContent>
            </Card>

            {/* Nota Média Geral (IDEB) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Nota Média Geral
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <IconChartBar className="size-5 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2</div>
                <p className="text-xs text-muted-foreground">
                  Matemática e Português
                </p>
              </CardContent>
            </Card>

            {/* Taxa de Frequência */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Frequência
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconTrendingUp className="size-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <IconTrendingUp className="size-3" />
                  +2% vs mês anterior
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
              {provasRecentes.length === 0 ? (
                <div className="py-12 text-center">
                  <IconFileText className="mx-auto mb-4 size-12 text-muted-foreground" />
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
              ) : (
                <div className="space-y-4">
                  {provasRecentes.map((prova) => (
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
                            <h3 className="font-semibold">{prova.title}</h3>
                            <Badge variant="outline" className="text-green-600">
                              Criada
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(prova.exam_date).toLocaleDateString(
                              "pt-BR"
                            )}{" "}
                            • {prova.subject}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-secondary"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
