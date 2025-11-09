"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconSchool,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { listarTurmas } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Tipo para turmas do backend
type TurmaBackend = {
  id: string; // UUID
  name: string;
  grade_level?: string;
  section?: string;
  student_count?: number;
  teacher_id: string;
  school_year?: number;
  created_at: string;
};

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<TurmaBackend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarTurmas();
        setTurmas(data);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
        <p className="text-muted-foreground">
          Gerencie suas turmas e acompanhe o desempenho
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-12 text-center">
          <IconLoader2 className="mx-auto mb-4 size-12 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando turmas...</p>
        </div>
      ) : turmas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <IconSchool className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Nenhuma turma cadastrada
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Crie sua primeira turma para começar
            </p>
            <Link href="/dashboard/nova-turma">
              <Button variant="secondary">Nova Turma</Button>
            </Link>
          </CardContent>
        </Card>
        ) : (
          /* Grid de Turmas */
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card para Adicionar Nova Turma */}
            <Link href="/dashboard/nova-turma">
              <Card className="flex h-full cursor-pointer items-center justify-center border-2 border-dashed transition-all hover:border-secondary hover:bg-secondary/5">
                <CardContent className="flex flex-col items-center gap-4 py-16">
                  <div className="flex size-16 items-center justify-center rounded-full bg-secondary/10">
                    <span className="text-4xl text-secondary">+</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">Adicionar Turma</h3>
                    <p className="text-sm text-muted-foreground">
                      Criar uma nova turma
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {turmas.map((turma) => {
            // Mock de estatísticas (até o backend implementar)
            const estatisticasMock = {
              mediaGeral: 7.0,
              taxaAcerto: 70,
              alunosRisco: Math.floor((turma.student_count || 0) * 0.12),
              provasRealizadas: 5,
              tendencia: Math.random() > 0.5 ? "up" : "down",
            };

            return (
              <Card key={turma.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                        <IconSchool className="size-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{turma.name}</CardTitle>
                        <CardDescription>
                          {turma.student_count || 0} alunos
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        estatisticasMock.tendencia === "down"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {estatisticasMock.tendencia === "up" ? (
                        <IconTrendingUp className="size-3" />
                      ) : (
                        <IconTrendingDown className="size-3" />
                      )}
                      {estatisticasMock.tendencia === "up"
                        ? "Melhorando"
                        : "Precisa atenção"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Métricas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Média Geral
                      </p>
                      <p className="text-2xl font-bold">
                        {estatisticasMock.mediaGeral.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Taxa de Acerto
                      </p>
                      <p className="text-2xl font-bold">
                        {estatisticasMock.taxaAcerto}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Provas Realizadas
                      </p>
                      <p className="text-lg font-semibold">
                        {estatisticasMock.provasRealizadas}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Alunos em Risco
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-lg font-semibold">
                          {estatisticasMock.alunosRisco}
                        </p>
                        {estatisticasMock.alunosRisco > 5 && (
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
                    <Link
                      href={`/dashboard/turmas/${turma.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        Gerenciar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
