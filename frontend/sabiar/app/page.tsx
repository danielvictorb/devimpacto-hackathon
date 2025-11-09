import Image from "next/image";
import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

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
        </div>
      </header>

      {/* Hero Section */}
      <main className="container flex flex-1 flex-col items-center justify-center gap-12 px-4 py-16 md:px-8">
        <div className="flex max-w-4xl flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <IconSparkles className="size-4" />
            Gestão Escolar Inteligente
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Decisões{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              baseadas em dados
            </span>{" "}
            para sua escola
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            O sabiar oferece uma visão completa do desempenho acadêmico da sua
            escola, com insights gerados por IA para apoiar decisões
            estratégicas.
          </p>

          {/* CTA Button */}
          <div className="mt-12">
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="px-12 text-lg">
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6">
        <div className="flex justify-center px-4 text-center text-sm text-muted-foreground md:px-8">
          <p>
            © 2025 SabiaR - DevImpacto Hackathon. Gestão escolar baseada em
            dados.
          </p>
        </div>
      </footer>
    </div>
  );
}
