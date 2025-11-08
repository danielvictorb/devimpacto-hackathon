import Image from "next/image";
import Link from "next/link";
import {
  IconUserCircle,
  IconSchool,
  IconSparkles,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="w-full border-b bg-white/50 backdrop-blur-sm dark:bg-black/50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/sabiar_icon.png"
              alt="SabiaR Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="flex items-center gap-0.5">
              <span className="text-xl font-bold">Sabia</span>
              <span className="flex size-6 items-center justify-center rounded border-2 border-border text-xl font-bold">
                R
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                Área do Professor
              </Button>
            </Link>
            <Link href="/aluno">
              <Button size="sm">Área do Aluno</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container flex flex-1 flex-col items-center justify-center gap-12 px-4 py-16 md:px-8">
        <div className="flex max-w-4xl flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <IconSparkles className="size-4" />
            Correção Inteligente com IA
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Transforme a{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              correção
            </span>{" "}
            em um plano de ação
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            O SabiaR usa IA para corrigir provas dissertativas em minutos, gerar
            insights pedagógicos e criar feedbacks personalizados para cada
            aluno.
          </p>

          {/* Features */}
          <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
              <IconClock className="size-8 text-primary" />
              <h3 className="font-semibold">Economize Tempo</h3>
              <p className="text-center text-sm text-muted-foreground">
                2 horas de correção viram 15 minutos de revisão
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
              <IconChartBar className="size-8 text-primary" />
              <h3 className="font-semibold">Insights em Tempo Real</h3>
              <p className="text-center text-sm text-muted-foreground">
                Veja exatamente onde sua turma teve dificuldade
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
              <IconSparkles className="size-8 text-primary" />
              <h3 className="font-semibold">Feedback Personalizado</h3>
              <p className="text-center text-sm text-muted-foreground">
                IA gera feedback individual para cada aluno
              </p>
            </div>
          </div>
        </div>

        {/* Access Cards */}
        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          {/* Área do Professor */}
          <Link href="/dashboard" className="group">
            <Card className="h-full transition-all hover:scale-[1.02] hover:shadow-lg">
              <CardHeader className="space-y-4 pb-8">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                  <IconUserCircle className="size-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Área do Professor</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Crie provas, corrija com IA e acompanhe o desempenho da sua
                    turma
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-secondary" />
                  <p className="text-sm text-muted-foreground">
                    Cadastre gabaritos com rubricas de correção
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-secondary" />
                  <p className="text-sm text-muted-foreground">
                    Revise sugestões da IA em minutos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-secondary" />
                  <p className="text-sm text-muted-foreground">
                    Acesse dashboards com insights pedagógicos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-secondary" />
                  <p className="text-sm text-muted-foreground">
                    Envie feedbacks personalizados aos alunos
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="secondary" className="w-full" size="lg">
                    Acessar Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Área do Aluno */}
          <Link href="/aluno" className="group">
            <Card className="h-full transition-all hover:scale-[1.02] hover:shadow-lg">
              <CardHeader className="space-y-4 pb-8">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <IconSchool className="size-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Área do Aluno</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Responda provas digitalmente e receba feedback personalizado
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Responda provas direto no sistema
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Veja suas notas e histórico de desempenho
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Receba feedback detalhado do professor
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-1.5 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Acompanhe sua evolução ao longo do tempo
                  </p>
                </div>
                <div className="pt-4">
                  <Button className="w-full" size="lg">
                    Acessar Área do Aluno
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground md:px-8">
          <p>
            © 2025 SabiaR - DevImpacto Hackathon. Transformando educação com
            tecnologia.
          </p>
        </div>
      </footer>
    </div>
  );
}
