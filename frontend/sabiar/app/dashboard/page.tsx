"use client";

import Link from "next/link";
import {
  IconUsers,
  IconSchool,
  IconAlertTriangle,
  IconTrendingDown,
  IconChartPie,
  IconAlertCircle,
  IconHome,
  IconShoppingCart,
  IconClock,
  IconWifi,
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
import { obterEstatisticasGerais } from "@/lib/dados";

export default function DashboardPage() {
  // Carregar dados do JSON
  const stats = obterEstatisticasGerais();

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Visão Geral da Escola
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, Diretor(a)! ECIT João Goulart
        </p>
      </div>

      {/* Stats Cards Principais */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Alunos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <IconUsers className="size-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlunos}</div>
            <p className="text-xs text-muted-foreground">
              Matriculados na escola
            </p>
          </CardContent>
        </Card>

        {/* Turmas Ativas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <IconSchool className="size-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTurmas}</div>
            <p className="text-xs text-muted-foreground">
              1º Ano do Ensino Médio
            </p>
          </CardContent>
        </Card>

        {/* Média Geral */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nota Média Geral
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
              <IconTrendingDown className="size-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mediaGeral}</div>
            <p className="text-xs text-muted-foreground">
              Desempenho preocupante
            </p>
          </CardContent>
        </Card>

        {/* Alunos em Risco Alto */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alunos em Risco Alto
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
              <IconAlertTriangle className="size-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.alunosRiscoAlto}
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.alunosRiscoAlto / stats.totalAlunos) * 100).toFixed(1)}%
              do total - atenção urgente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Desempenho */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {stats.distribuicaoPorFaixa.map((faixa: any) => (
          <Card key={faixa.faixa}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{faixa.faixa}</CardTitle>
                <Badge
                  variant={
                    faixa.faixa.includes("Baixo")
                      ? "destructive"
                      : faixa.faixa.includes("Alto")
                      ? "default"
                      : "secondary"
                  }
                >
                  {faixa.percentual}%
                </Badge>
              </div>
              <CardDescription>
                {faixa.total_alunos} alunos • Média:{" "}
                {faixa.intervalo_notas.media.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Trabalham</span>
                <span className="font-medium">
                  {faixa.pct_trabalha.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Renda média</span>
                <span className="font-medium">
                  R$ {faixa.renda_media.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pretos/Pardos</span>
                <span className="font-medium">
                  {faixa.pct_pretos_pardos.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fatores Críticos */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconAlertCircle className="size-5 text-orange-500" />
            <div>
              <CardTitle>Fatores Críticos de Atenção</CardTitle>
              <CardDescription>
                Condições socioeconômicas que impactam o desempenho
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
                <IconShoppingCart className="size-5 text-orange-500" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.trabalho} alunos
                </div>
                <p className="text-sm text-muted-foreground">Trabalham</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <IconHome className="size-5 text-red-500" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.inseg_alimentar} alunos
                </div>
                <p className="text-sm text-muted-foreground">
                  Insegurança Alimentar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                <IconClock className="size-5 text-yellow-500" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.deslocamento_longo} alunos
                </div>
                <p className="text-sm text-muted-foreground">
                  Deslocamento Longo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                <IconUsers className="size-5 text-purple-500" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.baixa_renda} alunos
                </div>
                <p className="text-sm text-muted-foreground">Baixa Renda</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <IconWifi className="size-5 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.sem_internet} alunos
                </div>
                <p className="text-sm text-muted-foreground">Sem Internet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <IconChartPie className="size-5 text-green-500" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.pretos_pardos_indigenas} alunos
                </div>
                <p className="text-sm text-muted-foreground">
                  Pretos, Pardos, Indígenas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Recomendadas</CardTitle>
          <CardDescription>
            Próximos passos para melhorar o desempenho da escola
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/dashboard/turmas">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <IconSchool className="mr-2 size-5" />
              Ver Análise Detalhada por Turma
            </Button>
          </Link>
          <Link href="/dashboard/alunos">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <IconUsers className="mr-2 size-5" />
              Visualizar Lista Completa de Alunos
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
