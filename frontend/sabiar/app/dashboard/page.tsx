"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { obterEstatisticasGerais } from "@/lib/dados";

export default function DashboardPage() {
  // Carregar dados do JSON
  const stats = obterEstatisticasGerais();
  const [dialogAberto, setDialogAberto] = useState(false);

  // Mapear faixa para parâmetro de URL
  const getFiltroDesempenho = (faixa: string): string => {
    if (faixa.includes("Baixo")) return "Baixo";
    if (faixa.includes("Médio")) return "Médio";
    if (faixa.includes("Alto")) return "Alto";
    return "Todos";
  };

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Welcome Section */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">
          Visão Geral da Escola
        </h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta, Diretor(a) ECIT João Goulart!
        </p>
      </div>

      {/* Stats Cards Principais */}
      <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Alunos */}
        <Link href="/dashboard/alunos">
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Alunos
              </CardTitle>
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconUsers className="size-5" style={{ color: "#294f5c" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlunos}</div>
              <p className="text-xs text-muted-foreground">
                Matriculados na escola
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Turmas Ativas */}
        <Link href="/dashboard/turmas">
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Turmas Ativas
              </CardTitle>
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconSchool className="size-5" style={{ color: "#294f5c" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTurmas}</div>
              <p className="text-xs text-muted-foreground">
                1º Ano do Ensino Médio
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Média Geral */}
        <button onClick={() => setDialogAberto(true)} className="text-left">
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nota Média Geral
              </CardTitle>
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconTrendingDown
                  className="size-5"
                  style={{ color: "#294f5c" }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mediaGeral}</div>
              <p className="text-xs text-muted-foreground">
                Desempenho preocupante
              </p>
            </CardContent>
          </Card>
        </button>

        {/* Alunos em Risco Alto */}
        <Link href="/dashboard/alunos?risco=Alto">
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alunos em Risco Alto
              </CardTitle>
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconAlertTriangle
                  className="size-5"
                  style={{ color: "#294f5c" }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.alunosRiscoAlto}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.alunosRiscoAlto / stats.totalAlunos) * 100).toFixed(1)}
                % do total - atenção urgente
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Distribuição por Desempenho */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {stats.distribuicaoPorFaixa.map((faixa: any) => (
          <Link
            key={faixa.faixa}
            href={`/dashboard/alunos?desempenho=${getFiltroDesempenho(
              faixa.faixa
            )}`}
          >
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{faixa.faixa}</CardTitle>
                  <Badge
                    variant={
                      faixa.faixa.includes("Baixo")
                        ? "destructive"
                        : faixa.faixa.includes("Alto")
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {faixa.percentual}%
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {faixa.total_alunos} alunos • Média:{" "}
                  {faixa.intervalo_notas.media.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Trabalham</span>
                  <span className="font-medium">
                    {faixa.pct_trabalha.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Renda média</span>
                  <span className="font-medium">
                    R$ {faixa.renda_media.toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Pretos/Pardos</span>
                  <span className="font-medium">
                    {faixa.pct_pretos_pardos.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Fatores Críticos */}
      <Card className="mb-6">
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconShoppingCart
                  style={{ color: "#294f5c" }}
                  className="size-5"
                />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.trabalho} alunos
                </div>
                <p className="text-sm text-muted-foreground">Trabalham</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconHome style={{ color: "#294f5c" }} className="size-5" />
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
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconClock style={{ color: "#294f5c" }} className="size-5" />
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
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconUsers style={{ color: "#294f5c" }} className="size-5" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.baixa_renda} alunos
                </div>
                <p className="text-sm text-muted-foreground">Baixa Renda</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconWifi style={{ color: "#294f5c" }} className="size-5" />
              </div>
              <div>
                <div className="font-semibold">
                  {stats.fatoresCriticos.sem_internet} alunos
                </div>
                <p className="text-sm text-muted-foreground">Sem Internet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
              >
                <IconChartPie style={{ color: "#294f5c" }} className="size-5" />
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

      {/* Dialog - Detalhes da Média Geral */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconTrendingDown
                className="size-5"
                style={{ color: "#d1663d" }}
              />
              Análise da Nota Média Geral
            </DialogTitle>
            <DialogDescription>
              Visão detalhada do desempenho acadêmico da escola
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Situação Atual:</h3>
              <p className="text-sm text-muted-foreground">
                A escola possui uma nota média geral de{" "}
                <strong>{stats.mediaGeral}</strong>, indicando um desempenho
                preocupante que requer atenção imediata.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Distribuição por Faixa:</h3>
              <div className="space-y-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {stats.distribuicaoPorFaixa.map((faixa: any) => (
                  <div
                    key={faixa.faixa}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div>
                      <p className="font-semibold text-sm">{faixa.faixa}</p>
                      <p className="text-xs text-muted-foreground">
                        {faixa.total_alunos} alunos • Média:{" "}
                        {faixa.intervalo_notas.media.toFixed(2)}
                      </p>
                    </div>
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
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Recomendações:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-sm">
                  <div className="mt-1.5 size-1.5 rounded-full bg-secondary shrink-0" />
                  <span>
                    Intensificar programas de reforço escolar, especialmente
                    para alunos com notas entre 0-4
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="mt-1.5 size-1.5 rounded-full bg-secondary shrink-0" />
                  <span>
                    Revisar metodologias de ensino e estratégias pedagógicas
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="mt-1.5 size-1.5 rounded-full bg-secondary shrink-0" />
                  <span>
                    Realizar diagnóstico individualizado de cada aluno em
                    dificuldade
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="mt-1.5 size-1.5 rounded-full bg-secondary shrink-0" />
                  <span>
                    Envolver famílias no processo educativo e no acompanhamento
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Button onClick={() => setDialogAberto(false)} className="w-full">
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
