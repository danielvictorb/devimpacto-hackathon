"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  IconArrowLeft,
  IconCheck,
  IconSchool,
  IconFileText,
  IconClipboardList,
  IconX,
  IconPlus,
  IconLayoutDashboard,
  IconUsers,
  IconUpload,
  IconEdit,
  IconCamera,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { name: "Turmas", href: "/dashboard/turmas", icon: IconSchool },
  { name: "Provas", href: "/dashboard/provas", icon: IconClipboardList },
  { name: "Alunos", href: "/dashboard/alunos", icon: IconUsers },
];

// Mock data - turmas disponíveis
const turmasMock = [
  { id: 1, nome: "9º Ano A", alunos: 32 },
  { id: 2, nome: "9º Ano B", alunos: 28 },
  { id: 3, nome: "1º Ano EM A", alunos: 35 },
  { id: 4, nome: "1º Ano EM B", alunos: 30 },
];

type Questao = {
  id: string;
  tipo: "multipla" | "dissertativa";
  enunciado: string;
  respostaCorreta?: string; // Para múltipla escolha: A, B, C, D, E
  alternativas?: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
  }; // Para múltipla escolha
  rubrica?: string; // Para dissertativa
  peso: number;
};

export default function NovaProvaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(1);

  // Step 1: Turma
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);

  // Step 2: Informações da Prova
  const [tituloProva, setTituloProva] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [dataProva, setDataProva] = useState("");
  const [periodoTipo, setPeriodoTipo] = useState<string>("");
  const [periodoNumero, setPeriodoNumero] = useState<string>("");

  // Step 3: Gabarito
  const [metodoGabarito, setMetodoGabarito] = useState<
    "manual" | "upload" | null
  >(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [showAddQuestao, setShowAddQuestao] = useState(false);
  const [novaQuestao, setNovaQuestao] = useState<Questao>({
    id: "",
    tipo: "multipla",
    enunciado: "",
    peso: 1,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  const steps = [
    { number: 1, name: "Turma", icon: IconSchool },
    { number: 2, name: "Informações", icon: IconFileText },
    { number: 3, name: "Gabarito", icon: IconClipboardList },
  ];

  const turma = turmasMock.find((t) => t.id === turmaSelecionada);

  const handleAddQuestao = () => {
    if (!novaQuestao.enunciado) return;

    // Validação para múltipla escolha
    if (novaQuestao.tipo === "multipla") {
      const alternativasPreenchidas =
        novaQuestao.alternativas?.A &&
        novaQuestao.alternativas?.B &&
        novaQuestao.alternativas?.C &&
        novaQuestao.alternativas?.D;
      if (!alternativasPreenchidas || !novaQuestao.respostaCorreta) return;
    }

    // Validação para dissertativa
    if (novaQuestao.tipo === "dissertativa" && !novaQuestao.rubrica) return;

    setQuestoes([...questoes, { ...novaQuestao, id: Date.now().toString() }]);
    setNovaQuestao({
      id: "",
      tipo: "multipla",
      enunciado: "",
      alternativas: undefined,
      respostaCorreta: undefined,
      rubrica: undefined,
      peso: 1,
    });
    setShowAddQuestao(false);
  };

  const handleRemoveQuestao = (id: string) => {
    setQuestoes(questoes.filter((q) => q.id !== id));
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessingOCR(true);

    // TODO: Chamar API de OCR
    // Simulação para hackathon:
    setTimeout(() => {
      // Mock: adicionar questões extraídas do OCR
      const questoesExtraidas: Questao[] = [
        {
          id: "ocr-1",
          tipo: "multipla",
          enunciado:
            "Qual é o processo que as plantas usam para produzir energia?",
          alternativas: {
            A: "Respiração celular",
            B: "Fotossíntese",
            C: "Digestão",
            D: "Fermentação",
          },
          respostaCorreta: "B",
          peso: 2,
        },
        {
          id: "ocr-2",
          tipo: "dissertativa",
          enunciado:
            "Explique o processo de fotossíntese e cite seus produtos.",
          rubrica:
            "O aluno deve (1) citar a fotossíntese como o processo e (2) mencionar que ela libera oxigênio e glicose.",
          peso: 3,
        },
      ];
      setQuestoes(questoesExtraidas);
      setIsProcessingOCR(false);
    }, 2000);
  };

  const handleSubmit = () => {
    // TODO: Enviar para API
    console.log({
      turma: turmaSelecionada,
      titulo: tituloProva,
      descricao,
      disciplina,
      dataProva,
      periodoTipo,
      periodoNumero,
      totalPontos,
      questoes,
    });
    router.push("/dashboard");
  };

  const canProceedStep1 = turmaSelecionada !== null;
  const canProceedStep2 = Boolean(tituloProva && disciplina && dataProva);
  const canFinish = questoes.length > 0;

  const totalPontos = questoes.reduce((sum, q) => sum + q.peso, 0);

  // Debug
  console.log({
    tituloProva,
    disciplina,
    dataProva,
    canProceedStep2,
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-zinc-950/95">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/sabiar_icon.png"
              alt="SabiaR Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <div className="flex items-center gap-0.5">
              <span className="text-lg font-bold">Sabia</span>
              <span className="flex size-6 items-center justify-center rounded border-2 border-border text-lg font-bold">
                R
              </span>
            </div>
          </Link>

          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <IconArrowLeft className="size-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-white dark:bg-zinc-950 lg:block">
          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="mx-auto flex-1 px-4 py-8 md:px-8 lg:max-w-5xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Nova Prova</h1>
            <p className="text-muted-foreground">
              Crie uma nova avaliação para sua turma
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isActive = step === s.number;
                const isCompleted = step > s.number;
                const canNavigate =
                  isCompleted ||
                  (s.number === 1 && canProceedStep1) ||
                  (s.number === 2 && canProceedStep2);

                return (
                  <div key={s.number} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          if (canNavigate || isCompleted) {
                            setStep(s.number);
                            if (s.number < 3) {
                              setMetodoGabarito(null);
                              setShowAddQuestao(false);
                            }
                          }
                        }}
                        disabled={!canNavigate && !isCompleted && !isActive}
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full border-2 transition-all",
                          isCompleted &&
                            "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90",
                          isActive && "border-secondary text-secondary",
                          !isActive &&
                            !isCompleted &&
                            "border-border text-muted-foreground cursor-not-allowed",
                          (canNavigate || isCompleted) &&
                            !isActive &&
                            "cursor-pointer hover:border-secondary/70 hover:bg-secondary/10"
                        )}
                      >
                        {isCompleted ? (
                          <IconCheck className="size-6" />
                        ) : (
                          <Icon className="size-6" />
                        )}
                      </button>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive && "text-foreground",
                          !isActive && "text-muted-foreground"
                        )}
                      >
                        {s.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "mx-4 h-0.5 flex-1",
                          step > s.number ? "bg-secondary" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Selecionar Turma */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Selecione a Turma</CardTitle>
                <CardDescription>
                  Escolha em qual turma esta prova será aplicada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {turmasMock.map((turma) => (
                    <button
                      key={turma.id}
                      onClick={() => setTurmaSelecionada(turma.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all hover:border-secondary/50",
                        turmaSelecionada === turma.id
                          ? "border-secondary bg-secondary/5"
                          : "border-border"
                      )}
                    >
                      <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                        <IconSchool className="size-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{turma.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {turma.alunos} alunos
                        </p>
                      </div>
                      {turmaSelecionada === turma.id && (
                        <IconCheck className="size-5 text-secondary" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    variant="secondary"
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Informações da Prova */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Informações da Prova</CardTitle>
                <CardDescription>
                  Preencha os dados básicos da avaliação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Título e Descrição */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">
                      Título da Prova{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="titulo"
                      placeholder="Ex: Prova de Biologia - Fotossíntese"
                      value={tituloProva}
                      onChange={(e) => setTituloProva(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição (opcional)</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Instruções gerais para os alunos..."
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Disciplina e Data */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="disciplina">
                      Disciplina <span className="text-destructive">*</span>
                    </Label>
                    <Select value={disciplina} onValueChange={setDisciplina}>
                      <SelectTrigger id="disciplina">
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Matemática">Matemática</SelectItem>
                        <SelectItem value="Português">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data">
                      Data da Prova <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="data"
                      type="date"
                      value={dataProva}
                      onChange={(e) => setDataProva(e.target.value)}
                    />
                  </div>
                </div>

                {/* Período */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="periodoTipo">Tipo de Período</Label>
                    <Select value={periodoTipo} onValueChange={setPeriodoTipo}>
                      <SelectTrigger id="periodoTipo">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bimestral">Bimestral</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                        <SelectItem value="diagnostic">Diagnóstica</SelectItem>
                        <SelectItem value="recovery">Recuperação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {periodoTipo &&
                    periodoTipo !== "anual" &&
                    periodoTipo !== "diagnostic" &&
                    periodoTipo !== "recovery" && (
                      <div className="space-y-2">
                        <Label htmlFor="periodoNumero">Número do Período</Label>
                        <Select
                          value={periodoNumero}
                          onValueChange={setPeriodoNumero}
                        >
                          <SelectTrigger id="periodoNumero">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">
                              1º{" "}
                              {periodoTipo === "bimestral"
                                ? "Bimestre"
                                : periodoTipo === "trimestral"
                                ? "Trimestre"
                                : "Semestre"}
                            </SelectItem>
                            <SelectItem value="2">
                              2º{" "}
                              {periodoTipo === "bimestral"
                                ? "Bimestre"
                                : periodoTipo === "trimestral"
                                ? "Trimestre"
                                : "Semestre"}
                            </SelectItem>
                            {periodoTipo !== "semestral" && (
                              <>
                                <SelectItem value="3">
                                  3º{" "}
                                  {periodoTipo === "bimestral"
                                    ? "Bimestre"
                                    : "Trimestre"}
                                </SelectItem>
                                {periodoTipo === "bimestral" && (
                                  <SelectItem value="4">4º Bimestre</SelectItem>
                                )}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                </div>

                {turma && (
                  <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Turma selecionada:{" "}
                      </span>
                      <span className="font-semibold text-foreground">
                        {turma.nome}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        • {turma.alunos} alunos
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button onClick={() => setStep(1)} variant="outline">
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    variant="secondary"
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Gabarito */}
          {step === 3 && !metodoGabarito && (
            <Card>
              <CardHeader>
                <CardTitle>Como deseja adicionar o gabarito?</CardTitle>
                <CardDescription>
                  Escolha entre criar manualmente ou fazer upload de PDF/foto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Upload de Gabarito */}
                  <button
                    onClick={() => setMetodoGabarito("upload")}
                    className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8 text-center transition-all hover:border-secondary hover:bg-secondary/5"
                  >
                    <div className="flex size-16 items-center justify-center rounded-full bg-secondary/10">
                      <IconCamera className="size-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">Upload de Gabarito</h3>
                      <p className="text-sm text-muted-foreground">
                        Envie PDF ou foto da prova
                        <br />
                        <span className="font-medium text-secondary">
                          Deixe tudo com a gente!
                        </span>
                      </p>
                    </div>
                  </button>

                  {/* Criar Manualmente */}
                  <button
                    onClick={() => setMetodoGabarito("manual")}
                    className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8 text-center transition-all hover:border-secondary hover:bg-secondary/5"
                  >
                    <div className="flex size-16 items-center justify-center rounded-full bg-secondary/10">
                      <IconEdit className="size-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">Criar Manualmente</h3>
                      <p className="text-sm text-muted-foreground">
                        Digite as questões e gabarito
                        <br />
                        uma por uma
                      </p>
                    </div>
                  </button>
                </div>

                <div className="mt-6 flex justify-start">
                  <Button onClick={() => setStep(2)} variant="outline">
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Upload de Gabarito */}
          {step === 3 && metodoGabarito === "upload" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload de Gabarito</CardTitle>
                  <CardDescription>
                    Envie uma foto ou PDF do gabarito da prova
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!uploadedFile ? (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 transition-colors hover:border-secondary hover:bg-secondary/5">
                      <IconUpload className="mb-4 size-12 text-muted-foreground" />
                      <h3 className="mb-2 font-semibold">
                        Arraste e solte ou clique para selecionar
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        PDF, JPG, PNG até 10MB
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </label>
                  ) : isProcessingOCR ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <IconLoader2 className="mb-4 size-12 animate-spin text-secondary" />
                      <h3 className="mb-2 font-semibold">
                        Processando com OCR...
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Extraindo questões e gabarito da imagem
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconCheck className="size-5 text-secondary" />
                          <div>
                            <p className="font-semibold">{uploadedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {questoes.length} questões extraídas
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setUploadedFile(null);
                            setQuestoes([]);
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          Trocar arquivo
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      onClick={() => {
                        setMetodoGabarito(null);
                        setUploadedFile(null);
                        setQuestoes([]);
                      }}
                      variant="outline"
                    >
                      Voltar
                    </Button>
                    {questoes.length > 0 && (
                      <Button onClick={handleSubmit} variant="secondary">
                        Criar Prova
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preview das Questões Extraídas */}
              {questoes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Gabarito Extraído ({questoes.length} questões)
                    </CardTitle>
                    <CardDescription>
                      Revise o gabarito antes de criar a prova
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Resumo da Prova */}
                      <div className="mb-4 rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total de Questões
                            </p>
                            <p className="text-2xl font-bold">
                              {questoes.length}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Total de Pontos
                            </p>
                            <p className="text-2xl font-bold">
                              {totalPontos.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Lista de questões extraídas */}
                      {questoes.map((questao, index) => (
                        <div
                          key={questao.id}
                          className="flex items-start gap-4 rounded-lg border p-4"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 font-semibold text-secondary">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <Badge variant="outline">
                                {questao.tipo === "multipla"
                                  ? "Múltipla Escolha"
                                  : "Dissertativa"}
                              </Badge>
                              <Badge variant="secondary">
                                {questao.peso}{" "}
                                {questao.peso === 1 ? "ponto" : "pontos"}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">
                              {questao.enunciado}
                            </p>
                            {questao.tipo === "multipla" &&
                              questao.alternativas && (
                                <div className="mt-2 space-y-1">
                                  {Object.entries(questao.alternativas).map(
                                    ([letra, texto]) =>
                                      texto && (
                                        <p
                                          key={letra}
                                          className="text-sm text-muted-foreground"
                                        >
                                          <strong
                                            className={
                                              questao.respostaCorreta === letra
                                                ? "text-secondary"
                                                : ""
                                            }
                                          >
                                            {letra})
                                          </strong>{" "}
                                          {texto}
                                          {questao.respostaCorreta ===
                                            letra && (
                                            <IconCheck className="ml-1 inline size-3 text-secondary" />
                                          )}
                                        </p>
                                      )
                                  )}
                                </div>
                              )}
                            {questao.tipo === "dissertativa" && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                Rubrica: {questao.rubrica}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Gabarito Manual */}
          {step === 3 && metodoGabarito === "manual" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Gabarito da Prova</CardTitle>
                      <CardDescription>
                        Adicione as questões e respostas corretas
                      </CardDescription>
                    </div>
                    {!showAddQuestao && (
                      <Button
                        onClick={() => setShowAddQuestao(true)}
                        variant="secondary"
                        size="sm"
                      >
                        <IconPlus className="size-4" />
                        Adicionar Questão
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {questoes.length === 0 && !showAddQuestao ? (
                    <>
                      <div className="py-12 text-center">
                        <IconClipboardList className="mx-auto mb-4 size-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">
                          Nenhuma questão adicionada
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Comece adicionando a primeira questão da prova
                        </p>
                        <Button
                          onClick={() => setShowAddQuestao(true)}
                          variant="secondary"
                        >
                          <IconPlus className="size-4" />
                          Adicionar Questão
                        </Button>
                      </div>
                      <div className="mt-6 flex justify-start">
                        <Button
                          onClick={() => {
                            setMetodoGabarito(null);
                          }}
                          variant="outline"
                        >
                          Voltar
                        </Button>
                      </div>
                    </>
                  ) : questoes.length > 0 && !showAddQuestao ? (
                    <>
                      {/* Resumo da Prova */}
                      <div className="mb-4 rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total de Questões
                            </p>
                            <p className="text-2xl font-bold">
                              {questoes.length}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Total de Pontos
                            </p>
                            <p className="text-2xl font-bold">
                              {totalPontos.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {questoes.map((questao, index) => (
                          <div
                            key={questao.id}
                            className="flex items-start gap-4 rounded-lg border p-4"
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 font-semibold text-secondary">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <Badge variant="outline">
                                  {questao.tipo === "multipla"
                                    ? "Múltipla Escolha"
                                    : "Dissertativa"}
                                </Badge>
                                <Badge variant="secondary">
                                  {questao.peso}{" "}
                                  {questao.peso === 1 ? "ponto" : "pontos"}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">
                                {questao.enunciado}
                              </p>
                              {questao.tipo === "multipla" &&
                                questao.alternativas && (
                                  <div className="mt-2 space-y-1">
                                    {Object.entries(questao.alternativas).map(
                                      ([letra, texto]) =>
                                        texto && (
                                          <p
                                            key={letra}
                                            className="text-sm text-muted-foreground"
                                          >
                                            <strong
                                              className={
                                                questao.respostaCorreta ===
                                                letra
                                                  ? "text-secondary"
                                                  : ""
                                              }
                                            >
                                              {letra})
                                            </strong>{" "}
                                            {texto}
                                            {questao.respostaCorreta ===
                                              letra && (
                                              <IconCheck className="ml-1 inline size-3 text-secondary" />
                                            )}
                                          </p>
                                        )
                                    )}
                                  </div>
                                )}
                              {questao.tipo === "dissertativa" && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Rubrica: {questao.rubrica}
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={() => handleRemoveQuestao(questao.id)}
                              variant="ghost"
                              size="icon"
                            >
                              <IconX className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {!showAddQuestao && questoes.length > 0 && (
                    <div className="mt-6 flex justify-between">
                      <Button
                        onClick={() => {
                          setMetodoGabarito(null);
                          setQuestoes([]);
                        }}
                        variant="outline"
                      >
                        Voltar
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!canFinish}
                        variant="secondary"
                      >
                        Criar Prova
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modal para adicionar questão */}
              {showAddQuestao && (
                <Card className="border-secondary">
                  <CardHeader>
                    <CardTitle>Nova Questão</CardTitle>
                    <CardDescription>
                      Preencha os dados da questão
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de Questão</Label>
                      <Select
                        value={novaQuestao.tipo}
                        onValueChange={(value: "multipla" | "dissertativa") =>
                          setNovaQuestao({ ...novaQuestao, tipo: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multipla">
                            Múltipla Escolha
                          </SelectItem>
                          <SelectItem value="dissertativa">
                            Dissertativa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="enunciado">Enunciado</Label>
                      <Textarea
                        id="enunciado"
                        placeholder="Digite o enunciado da questão..."
                        value={novaQuestao.enunciado}
                        onChange={(e) =>
                          setNovaQuestao({
                            ...novaQuestao,
                            enunciado: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    {novaQuestao.tipo === "multipla" ? (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label>Alternativas</Label>
                          {["A", "B", "C", "D", "E"].map((letra) => (
                            <div
                              key={letra}
                              className="flex items-center gap-2"
                            >
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                {letra}
                              </span>
                              <Input
                                placeholder={`Alternativa ${letra}${
                                  letra === "E" ? " (opcional)" : ""
                                }`}
                                value={
                                  novaQuestao.alternativas?.[
                                    letra as keyof typeof novaQuestao.alternativas
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setNovaQuestao({
                                    ...novaQuestao,
                                    alternativas: {
                                      A: novaQuestao.alternativas?.A || "",
                                      B: novaQuestao.alternativas?.B || "",
                                      C: novaQuestao.alternativas?.C || "",
                                      D: novaQuestao.alternativas?.D || "",
                                      E: novaQuestao.alternativas?.E || "",
                                      ...novaQuestao.alternativas,
                                      [letra]: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="resposta">Resposta Correta</Label>
                          <Select
                            value={novaQuestao.respostaCorreta}
                            onValueChange={(value) =>
                              setNovaQuestao({
                                ...novaQuestao,
                                respostaCorreta: value,
                              })
                            }
                          >
                            <SelectTrigger id="resposta">
                              <SelectValue placeholder="Selecione a alternativa correta" />
                            </SelectTrigger>
                            <SelectContent>
                              {["A", "B", "C", "D", "E"].map((letra) => (
                                <SelectItem
                                  key={letra}
                                  value={letra}
                                  disabled={
                                    !novaQuestao.alternativas?.[
                                      letra as keyof typeof novaQuestao.alternativas
                                    ]
                                  }
                                >
                                  {letra}
                                  {novaQuestao.alternativas?.[
                                    letra as keyof typeof novaQuestao.alternativas
                                  ] &&
                                    ` - ${novaQuestao.alternativas[
                                      letra as keyof typeof novaQuestao.alternativas
                                    ]?.substring(0, 30)}...`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="rubrica">Rubrica de Correção</Label>
                        <Textarea
                          id="rubrica"
                          placeholder="Ex: O aluno deve (1) citar a fotossíntese como o processo e (2) mencionar que ela libera oxigênio."
                          value={novaQuestao.rubrica}
                          onChange={(e) =>
                            setNovaQuestao({
                              ...novaQuestao,
                              rubrica: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso (pontos)</Label>
                      <Input
                        id="peso"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={novaQuestao.peso}
                        onChange={(e) =>
                          setNovaQuestao({
                            ...novaQuestao,
                            peso: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => {
                          setShowAddQuestao(false);
                          setNovaQuestao({
                            id: "",
                            tipo: "multipla",
                            enunciado: "",
                            alternativas: undefined,
                            respostaCorreta: undefined,
                            rubrica: undefined,
                            peso: 1,
                          });
                        }}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddQuestao}
                        variant="secondary"
                        disabled={
                          !novaQuestao.enunciado ||
                          (novaQuestao.tipo === "multipla" &&
                            (!novaQuestao.alternativas?.A ||
                              !novaQuestao.alternativas?.B ||
                              !novaQuestao.alternativas?.C ||
                              !novaQuestao.alternativas?.D ||
                              !novaQuestao.respostaCorreta)) ||
                          (novaQuestao.tipo === "dissertativa" &&
                            !novaQuestao.rubrica)
                        }
                      >
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
