"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  IconFileText,
  IconArrowLeft,
  IconUpload,
  IconChartBar,
  IconLoader2,
  IconCalendar,
  IconSchool,
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
import { buscarProva, buscarQuestoes } from "@/lib/api";

export default function ProvaDetalhesPage() {
  const params = useParams();
  const [prova, setProva] = useState<any>(null);
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const provaId = params.id as string;
        const [provaData, questoesData] = await Promise.all([
          buscarProva(provaId),
          buscarQuestoes(provaId),
        ]);
        setProva(provaData);
        setQuestoes(questoesData);
      } catch (error) {
        console.error("Erro ao carregar prova:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [params.id]);

  if (loading) {
    return (
      <div className="px-4 py-8 md:px-8">
        <div className="py-12 text-center">
          <IconLoader2 className="mx-auto mb-4 size-12 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando prova...</p>
        </div>
      </div>
    );
  }

  if (!prova) {
    return (
      <div className="px-4 py-8 md:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <IconFileText className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Prova não encontrada</h3>
            <p className="text-sm text-muted-foreground">
              Esta prova não existe ou foi removida
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{prova.title}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconCalendar className="size-4" />
              {new Date(prova.exam_date).toLocaleDateString("pt-BR")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <IconSchool className="size-4" />
              {prova.subject}
            </span>
          </div>
        </div>
        <Link href="/dashboard/provas">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="size-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Ações Principais */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Link href={`/dashboard/provas/${params.id}/corrigir`}>
          <Card className="cursor-pointer transition-all hover:border-secondary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                <IconUpload className="size-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Corrigir Provas</h3>
                <p className="text-sm text-muted-foreground">
                  Upload e correção com IA
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/dashboard/provas/${params.id}/gabarito`}>
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <IconFileText className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Ver Gabarito</h3>
                <p className="text-sm text-muted-foreground">
                  Respostas corretas
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/dashboard/provas/${params.id}/insights`}>
          <Card className="cursor-pointer transition-all hover:border-secondary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                <IconChartBar className="size-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Ver Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Análise da turma
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Informações da Prova */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações da Prova</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Disciplina</p>
              <p className="font-semibold">{prova.subject}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-semibold">
                {new Date(prova.exam_date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            {prova.description && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p>{prova.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Total de Pontos</p>
              <p className="font-semibold">{prova.total_points}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Período</p>
              <p className="font-semibold">
                {prova.period_type ? `${prova.period_type}` : "Não definido"}
                {prova.period_number && ` - ${prova.period_number}º`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questões */}
      <Card>
        <CardHeader>
          <CardTitle>Questões ({questoes.length})</CardTitle>
          <CardDescription>Gabarito da prova</CardDescription>
        </CardHeader>
        <CardContent>
          {questoes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma questão cadastrada ainda
            </p>
          ) : (
            <div className="space-y-3">
              {questoes.map((questao, index) => (
                <div key={questao.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                      {index + 1}
                    </div>
                    <Badge variant="outline">
                      {questao.question_type === "multiple_choice"
                        ? "Múltipla Escolha"
                        : "Dissertativa"}
                    </Badge>
                    <Badge variant="secondary">{questao.points} pontos</Badge>
                  </div>

                  {questao.question_type === "multiple_choice" &&
                    questao.options && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(questao.options).map(
                          ([letra, texto]) => (
                            <p
                              key={letra}
                              className="text-sm text-muted-foreground"
                            >
                              <strong
                                className={
                                  questao.expected_answer === letra
                                    ? "text-secondary"
                                    : ""
                                }
                              >
                                {letra})
                              </strong>{" "}
                              {texto as string}
                              {questao.expected_answer === letra && " ✓"}
                            </p>
                          )
                        )}
                      </div>
                    )}

                  {questao.question_type === "essay" && (
                    <div className="mt-2 rounded bg-muted p-2 text-sm">
                      <p className="font-medium">Critério de correção:</p>
                      <p className="text-muted-foreground">
                        {questao.grading_criteria}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
