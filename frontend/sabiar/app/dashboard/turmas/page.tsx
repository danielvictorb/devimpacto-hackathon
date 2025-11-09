"use client";

import Link from "next/link";
import {
  IconSchool,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { listarTurmas } from "@/lib/dados";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TurmasPage() {
  // Carregar turmas do JSON
  const turmas = listarTurmas();

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
        <p className="text-muted-foreground">
          Visão detalhada de cada turma do 1º Ano - ECIT João Goulart
        </p>
      </div>

      {turmas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <IconSchool className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Nenhuma turma cadastrada
            </h3>
            <p className="text-sm text-muted-foreground">
              Os dados das turmas serão carregados automaticamente
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Grid de Turmas */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {turmas.map((turma) => {
            // Determinar status da turma baseado na média
            const mediaNotas = turma.estatisticas.media_notas;
            const status =
              mediaNotas < 4 ? "critical" : mediaNotas < 7 ? "warning" : "good";
            const alunosRisco = turma.alunos.filter(
              (a) => a.risco === "Alto"
            ).length;

            return (
              <Card key={turma.turma_id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-12 items-center justify-center rounded-lg ${
                          status === "critical"
                            ? "bg-red-500/10"
                            : status === "warning"
                            ? "bg-orange-500/10"
                            : "bg-green-500/10"
                        }`}
                      >
                        <IconSchool
                          className={`size-6 ${
                            status === "critical"
                              ? "text-red-500"
                              : status === "warning"
                              ? "text-orange-500"
                              : "text-green-500"
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{turma.nome}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-1">
                            <IconUsers className="size-3" />
                            {turma.total_alunos} alunos
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        status === "critical"
                          ? "destructive"
                          : status === "warning"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {status === "critical" ? (
                        <>
                          <IconTrendingDown className="mr-1 size-3" />
                          Crítico
                        </>
                      ) : status === "warning" ? (
                        <>
                          <IconAlertTriangle className="mr-1 size-3" />
                          Atenção
                        </>
                      ) : (
                        <>
                          <IconTrendingUp className="mr-1 size-3" />
                          Bom
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Métricas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Média de Notas
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          status === "critical"
                            ? "text-red-600"
                            : status === "warning"
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {mediaNotas.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Frequência Média
                      </p>
                      <p className="text-2xl font-bold">
                        {turma.estatisticas.frequencia_media.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Aprovação Est.
                      </p>
                      <p className="text-lg font-semibold">
                        {turma.estatisticas.aprovacao_estimada.toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Alunos em Risco
                      </p>
                      <div className="flex items-center gap-1">
                        <p
                          className={`text-lg font-semibold ${
                            alunosRisco > 5 ? "text-red-600" : ""
                          }`}
                        >
                          {alunosRisco}
                        </p>
                        {alunosRisco > 5 && (
                          <IconAlertTriangle className="size-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clusters */}
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Clusters identificados
                    </p>
                    <div className="flex gap-2">
                      {turma.clusters.map((cluster) => (
                        <Badge
                          key={cluster.cluster_id}
                          variant="outline"
                          className="text-xs"
                        >
                          Cluster {cluster.cluster_id}:{" "}
                          {cluster.percentual.toFixed(0)}%
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/dashboard/turmas/${turma.turma_id}/insights`}
                      className="flex-1"
                    >
                      <Button variant="secondary" className="w-full">
                        <IconChartBar className="mr-2 size-4" />
                        Ver Insights
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
