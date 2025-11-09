"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconUser,
  IconSchool,
  IconPhone,
  IconMapPin,
  IconHome,
  IconCoin,
  IconClock,
  IconBus,
  IconWifi,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconChartBar,
  IconUsers,
  IconShoppingCart,
  IconBook,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { obterAluno } from "@/lib/dados";

export default function AlunoPerfilPage() {
  const params = useParams();
  const alunoId = parseInt(params.id as string);

  const aluno = obterAluno(alunoId);

  if (!aluno) {
    return (
      <div className="px-4 py-8 md:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <IconUser className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Aluno não encontrado</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Os dados deste aluno não estão disponíveis
            </p>
            <Link href="/dashboard/alunos">
              <Button variant="secondary">Voltar para Alunos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const statusColor =
    aluno.risco === "Alto"
      ? "bg-red-500/10 text-red-600 border-red-200"
      : aluno.nivel_desempenho === "Alto"
      ? "bg-green-500/10 text-green-600 border-green-200"
      : "bg-blue-500/10 text-blue-600 border-blue-200";

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/alunos">
          <Button variant="ghost" size="sm" className="mb-4">
            <IconArrowLeft className="mr-2 size-4" />
            Voltar para Alunos
          </Button>
        </Link>

        <div className="flex items-start gap-6">
          <Avatar className="size-24">
            <AvatarFallback className={`text-2xl font-bold ${statusColor}`}>
              {getInitials(aluno.nome_aluno)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {aluno.nome_aluno}
                </h1>
                <p className="text-muted-foreground">
                  {aluno.idade_aluno} anos • {aluno.genero === "M" ? "Masculino" : "Feminino"}
                </p>
              </div>
              {aluno.risco === "Alto" && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/20">
                  <IconAlertTriangle className="size-5 text-red-600" />
                  <span className="font-semibold text-red-600">Risco Alto</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <IconSchool className="size-3" />
                Turma {aluno.turma}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {aluno.serie}
              </Badge>
              <Badge
                variant={aluno.risco === "Alto" ? "destructive" : "default"}
              >
                {aluno.nivel_desempenho}
              </Badge>
              {aluno.deficiencia && aluno.deficiencia !== "Nenhuma" && (
                <Badge variant="secondary">{aluno.deficiencia}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Desempenho */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                aluno.nota_media >= 7
                  ? "text-green-600"
                  : aluno.nota_media >= 4
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {aluno.nota_media.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {aluno.nota_media >= 7
                ? "Excelente"
                : aluno.nota_media >= 4
                ? "Regular"
                : "Crítico"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Matemática</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {aluno.media_matematica?.toFixed(2) || "0.00"}
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${((aluno.media_matematica || 0) / 10) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Português</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {aluno.media_portugues?.toFixed(2) || "0.00"}
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-secondary"
                style={{
                  width: `${((aluno.media_portugues || 0) / 10) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Frequência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {aluno.frequencia_pct.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {aluno.frequencia_pct >= 75 ? "Adequada" : "Baixa"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Esquerda - Informações Pessoais */}
        <div className="space-y-6 lg:col-span-2">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconUser className="size-5 text-secondary" />
                <CardTitle>Informações Pessoais</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CPF
                  </label>
                  <p className="text-sm">{aluno.cpf_aluno}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Telefone
                  </label>
                  <p className="text-sm">{aluno.telefone_aluno}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Idade
                  </label>
                  <p className="text-sm">{aluno.idade_aluno} anos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cor/Raça
                  </label>
                  <p className="text-sm">{aluno.cor_raca}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IconMapPin className="size-4" />
                  Endereço
                </label>
                <p className="text-sm">{aluno.endereco_completo}</p>
                <p className="text-sm text-muted-foreground">
                  {aluno.municipio} - {aluno.uf} • CEP: {aluno.cep}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Responsável */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconUsers className="size-5 text-secondary" />
                <CardTitle>Responsável Legal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nome
                  </label>
                  <p className="text-sm">{aluno.nome_responsavel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Parentesco
                  </label>
                  <p className="text-sm">{aluno.parentesco}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CPF
                  </label>
                  <p className="text-sm">{aluno.cpf_responsavel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Telefone
                  </label>
                  <p className="text-sm">{aluno.telefone_responsavel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condições Socioeconômicas */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconCoin className="size-5 text-secondary" />
                <CardTitle>Condições Socioeconômicas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Renda Familiar
                  </label>
                  <p className="text-lg font-semibold">
                    R$ {aluno.renda_familiar.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Benefícios Sociais
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {aluno.bolsa_familia === "Sim" && (
                      <Badge variant="outline" className="text-xs">
                        Bolsa Família
                      </Badge>
                    )}
                    {aluno.auxilio_brasil === "Sim" && (
                      <Badge variant="outline" className="text-xs">
                        Auxílio Brasil
                      </Badge>
                    )}
                    {aluno.bolsa_familia === "Não" &&
                      aluno.auxilio_brasil === "Não" && (
                        <span className="text-sm">Nenhum</span>
                      )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tipo de Moradia
                  </label>
                  <p className="text-sm">{aluno.tipo_moradia}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Número de Cômodos
                  </label>
                  <p className="text-sm">{aluno.num_comodos}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Segurança Alimentar
                  </label>
                  <p className="text-sm">{aluno.seguranca_alimentar}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Ambiente Familiar
                  </label>
                  <p className="text-sm">{aluno.ambiente_familiar}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Cards Adicionais */}
        <div className="space-y-6">
          {/* Transporte e Acesso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transporte e Acesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <IconBus className="size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Meio de Transporte</p>
                  <p className="text-sm text-muted-foreground">
                    {aluno.meio_transporte}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconClock className="size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Tempo de Deslocamento</p>
                  <p className="text-sm text-muted-foreground">
                    {aluno.tempo_deslocamento_min} minutos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconWifi className="size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Acesso à Internet</p>
                  <p className="text-sm text-muted-foreground">
                    {aluno.acesso_internet}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trabalho */}
          {aluno.trabalha === "Sim" && (
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconShoppingCart className="size-5 text-orange-600" />
                  <CardTitle className="text-base text-orange-600">
                    Trabalha
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {aluno.hrs_trab_semana} horas por semana
                </p>
                {aluno.hrs_trab_semana && aluno.hrs_trab_semana > 20 && (
                  <p className="mt-2 text-xs text-orange-600">
                    ⚠️ Carga horária pode impactar os estudos
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Apoio aos Estudos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconBook className="size-5 text-secondary" />
                <CardTitle className="text-base">Apoio aos Estudos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Apoio Familiar</p>
                <p className="text-sm text-muted-foreground">
                  {aluno.apoio_estudos}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Atividades Extraclasse</p>
                <p className="text-sm text-muted-foreground">
                  {aluno.ativ_extraclasse || "Não informado"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cluster e Análise */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconChartBar className="size-5 text-secondary" />
                <CardTitle className="text-base">Perfil Analítico</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Cluster</p>
                <Badge variant="outline" className="mt-1">
                  Grupo {aluno.cluster_global}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Nível de Risco</p>
                <Badge
                  variant={aluno.risco === "Alto" ? "destructive" : "default"}
                  className="mt-1"
                >
                  {aluno.risco}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Tendência</p>
                <div className="mt-1 flex items-center gap-2">
                  {aluno.nota_media >= 5 ? (
                    <>
                      <IconTrendingUp className="size-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        Desempenho positivo
                      </span>
                    </>
                  ) : (
                    <>
                      <IconTrendingDown className="size-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        Precisa de intervenção
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

