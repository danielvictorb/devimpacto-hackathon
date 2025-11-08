"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconUpload,
  IconCheck,
  IconX,
  IconLoader2,
  IconSparkles,
  IconArrowLeft,
} from "@tabler/icons-react";
import { uploadProvaAluno } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ResultadoCorrecao = {
  nomeAluno: string;
  respostas: Array<{
    questao: number;
    respostaAluno: string;
    respostaCorreta: string;
    acertou: boolean;
    pontos: number;
    pontosObtidos: number;
    justificativa: string;
  }>;
  notaTotal: number;
  notaMaxima: number;
};

// Mock: Simular OCR e correção da IA
const simularCorrecaoIA = async (
  _file: File,
  _gabarito?: unknown
): Promise<ResultadoCorrecao> => {
  // Simular processamento
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock de resposta da IA
  return {
    nomeAluno: "João Silva",
    respostas: [
      {
        questao: 1,
        respostaAluno: "B",
        respostaCorreta: "B",
        acertou: true,
        pontos: 2.0,
        pontosObtidos: 2.0,
        justificativa: "Resposta correta!",
      },
      {
        questao: 2,
        respostaAluno:
          "As plantas usam a luz do sol para fazer comida e soltar ar.",
        respostaCorreta: "Deve mencionar fotossíntese e oxigênio",
        acertou: false,
        pontos: 3.0,
        pontosObtidos: 1.5,
        justificativa:
          "Aluno não citou o termo 'fotossíntese'. Mencionou vagamente 'oxigênio' (soltar ar). Conceito parcialmente correto.",
      },
    ],
    notaTotal: 3.5,
    notaMaxima: 5.0,
  };
};

export default function CorrigirProvaPage() {
  const [etapa, setEtapa] = useState<"upload" | "revisao" | "concluido">(
    "upload"
  );
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCorrecao | null>(null);
  const [notaAjustada, setNotaAjustada] = useState<number | null>(null);

  const handleUpload = async (file: File) => {
    setArquivo(file);
    setProcessando(true);

    try {
      // 1. Fazer upload do arquivo para o backend
      console.log("📤 Enviando arquivo para backend...");
      const uploadResult = await uploadProvaAluno(file);
      console.log("✅ Arquivo salvo:", uploadResult);
      
      // 2. TODO: Chamar endpoint de OCR do backend
      // Por enquanto, simular
      const correcao = await simularCorrecaoIA(file, {});
      
      setResultado(correcao);
      setNotaAjustada(correcao.notaTotal);
      setEtapa("revisao");
    } catch (error) {
      console.error("Erro ao processar prova:", error);
      alert("Erro ao processar prova! Verifique o console.");
    } finally {
      setProcessando(false);
    }
  };

  const handleConfirmar = () => {
    if (!resultado) return;

    // TODO: Salvar nota no banco
    console.log("Nota confirmada:", notaAjustada);
    alert(`✅ Nota ${notaAjustada} confirmada para ${resultado.nomeAluno}!`);
    setEtapa("concluido");

    // Reset para próximo aluno
    setTimeout(() => {
      setArquivo(null);
      setResultado(null);
      setNotaAjustada(null);
      setEtapa("upload");
    }, 1500);
  };

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Correção Inteligente
          </h1>
          <p className="text-muted-foreground">
            Faça upload das provas e revise as sugestões da IA
          </p>
        </div>
        <Link href="/dashboard/provas">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="size-4" />
            Voltar para Provas
          </Button>
        </Link>
      </div>

      {/* Etapa 1: Upload */}
      {etapa === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload da Prova do Aluno</CardTitle>
            <CardDescription>
              Envie a foto ou PDF da prova preenchida pelo aluno
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!arquivo ? (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-16 transition-colors hover:border-secondary hover:bg-secondary/5">
                <IconUpload className="mb-4 size-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">
                  Arraste e solte ou clique para selecionar
                </h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  PDF, JPG, PNG até 10MB
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-2">
                  <span className="text-sm font-medium text-secondary">
                    Deixa que corrigimos para você!
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </label>
            ) : processando ? (
              <div className="flex flex-col items-center justify-center py-16">
                <IconLoader2 className="mb-4 size-16 animate-spin text-secondary" />
                <h3 className="mb-2 text-xl font-semibold">
                  Processando com IA...
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Extraindo respostas e comparando com o gabarito
                </p>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-3 text-green-600" />
                    <span>OCR - Lendo prova</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-3 text-green-600" />
                    <span>Comparando com gabarito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconLoader2 className="size-3 animate-spin" />
                    <span>Gerando sugestão de nota...</span>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Etapa 2: Revisão */}
      {etapa === "revisao" && resultado && (
        <div className="space-y-6">
          {/* Info do Aluno */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="bg-secondary/10 text-lg font-semibold text-secondary">
                    {resultado.nomeAluno
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">
                    {resultado.nomeAluno}
                  </CardTitle>
                  <CardDescription>Prova analisada pela IA</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Nota Sugerida</p>
                  <p className="text-4xl font-bold text-secondary">
                    {resultado.notaTotal.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de {resultado.notaMaxima.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Análise por Questão */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconSparkles className="size-5 text-secondary" />
                <CardTitle>Análise da IA por Questão</CardTitle>
              </div>
              <CardDescription>
                Revise as sugestões e ajuste se necessário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resultado.respostas.map((resp, index) => (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 ${
                    resp.acertou
                      ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/20"
                      : "border-orange-200 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-950/20"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                        {resp.questao}
                      </div>
                      <div>
                        <p className="font-semibold">Questão {resp.questao}</p>
                        <p className="text-xs text-muted-foreground">
                          Vale {resp.pontos} pontos
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        resp.acertou ? "text-green-600" : "text-orange-600"
                      }
                    >
                      {resp.acertou ? (
                        <IconCheck className="size-3" />
                      ) : (
                        <IconX className="size-3" />
                      )}
                      {resp.acertou ? "Correta" : "Parcial"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Resposta do aluno:
                      </p>
                      <p className="rounded bg-background p-2">
                        {resp.respostaAluno}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-muted-foreground">
                        Resposta esperada:
                      </p>
                      <p className="rounded bg-background p-2">
                        {resp.respostaCorreta}
                      </p>
                    </div>

                    <div className="rounded-lg bg-secondary/5 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <IconSparkles className="size-4 text-secondary" />
                        <p className="text-xs font-semibold text-secondary">
                          Análise da IA:
                        </p>
                      </div>
                      <p className="text-sm">{resp.justificativa}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                      <span className="text-sm font-medium">
                        Pontos sugeridos:
                      </span>
                      <span className="text-lg font-bold text-secondary">
                        {resp.pontosObtidos.toFixed(1)} /{" "}
                        {resp.pontos.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ajustar Nota Final */}
          <Card>
            <CardHeader>
              <CardTitle>Nota Final</CardTitle>
              <CardDescription>
                Confirme ou ajuste a nota sugerida pela IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="nota">Nota Final</Label>
                  <Input
                    id="nota"
                    type="number"
                    min="0"
                    max={resultado.notaMaxima}
                    step="0.5"
                    value={notaAjustada || ""}
                    onChange={(e) =>
                      setNotaAjustada(parseFloat(e.target.value))
                    }
                    className="text-2xl font-bold"
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo: {resultado.notaMaxima.toFixed(1)} pontos
                  </p>
                </div>

                <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Sugestão da IA
                  </p>
                  <p className="text-3xl font-bold text-secondary">
                    {resultado.notaTotal.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setArquivo(null);
                    setResultado(null);
                    setEtapa("upload");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmar}
                  variant="secondary"
                  className="flex-1"
                  disabled={!notaAjustada}
                >
                  <IconCheck className="size-4" />
                  Confirmar Nota
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Etapa 3: Concluído */}
      {etapa === "concluido" && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <IconCheck className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold">Nota Salva!</h3>
            <p className="mb-6 text-muted-foreground">
              Preparando para próxima prova...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Lateral - Gabarito */}
      {etapa !== "upload" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Gabarito da Prova</CardTitle>
            <CardDescription>Referência para correção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded bg-muted p-2">
                <span>Questão 1 (Múltipla)</span>
                <Badge variant="outline">Resposta: B</Badge>
              </div>
              <div className="flex items-center justify-between rounded bg-muted p-2">
                <span>Questão 2 (Dissertativa)</span>
                <Badge variant="outline">2-3 pontos</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
