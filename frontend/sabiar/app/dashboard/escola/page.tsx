"use client";

import { IconSchool, IconUsers, IconAward, IconCalendar } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EscolaPage() {
  return (
    <div className="px-4 py-6 md:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Informações da Escola
        </h1>
        <p className="text-sm text-muted-foreground">
          Dados gerais e características da instituição
        </p>
      </div>

      {/* School Info Cards */}
      <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Nome da Escola */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Nome da Escola</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">ECIT João Goulart</p>
            <p className="text-xs text-muted-foreground mt-1">
              Escola Estadual de Referência
            </p>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Localização</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Recife - PE</p>
            <p className="text-xs text-muted-foreground mt-1">
              Região Metropolitana
            </p>
          </CardContent>
        </Card>

        {/* Fundação */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ano de Fundação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">2015</p>
            <p className="text-xs text-muted-foreground mt-1">
              9 anos de atuação
            </p>
          </CardContent>
        </Card>

        {/* CNPJ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">CNPJ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">12.345.678/0001-00</p>
            <p className="text-xs text-muted-foreground mt-1">
              Instituição Pública
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <div
              className="flex size-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
            >
              <IconUsers className="size-5" style={{ color: "#294f5c" }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
            <p className="text-xs text-muted-foreground">Matriculados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
            <div
              className="flex size-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
            >
              <IconSchool className="size-5" style={{ color: "#294f5c" }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">1º Ano do Ensino Médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <div
              className="flex size-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
            >
              <IconAward className="size-5" style={{ color: "#294f5c" }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Profissionais docentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ano Letivo</CardTitle>
            <div
              className="flex size-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "hsl(var(--sabiar-teal) / 0.1)" }}
            >
              <IconCalendar className="size-5" style={{ color: "#294f5c" }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2025</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre a Escola</CardTitle>
          <CardDescription>
            Informações institucionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Missão</h3>
            <p className="text-sm text-muted-foreground">
              Promover educação de qualidade, inclusiva e equitativa, preparando alunos para os desafios do século XXI com foco em desenvolvimento integral e cidadania responsável.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Visão</h3>
            <p className="text-sm text-muted-foreground">
              Ser referência em educação pública no estado de Pernambuco, reconhecida pela excelência acadêmica e pelo impacto positivo na formação de cidadãos críticos e transformadores.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Valores</h3>
            <p className="text-sm text-muted-foreground">
              Excelência, Inclusão, Inovação, Respeito à Diversidade, Responsabilidade Social e Sustentabilidade.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

