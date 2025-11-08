import Link from "next/link";
import { IconArrowLeft, IconSchool } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AlunoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="container flex max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
          <IconSchool className="size-10 text-primary" />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold">Área do Aluno</h1>
          <p className="text-lg text-muted-foreground">
            Em breve você poderá responder provas digitalmente e acompanhar seu
            desempenho!
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Funcionalidades Futuras</CardTitle>
            <CardDescription>
              O que você poderá fazer na área do aluno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 size-1.5 rounded-full bg-primary" />
              <p className="text-sm">
                Acessar provas disponibilizadas pelo professor
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 size-1.5 rounded-full bg-primary" />
              <p className="text-sm">Responder questões direto no sistema</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 size-1.5 rounded-full bg-primary" />
              <p className="text-sm">Ver suas notas e histórico completo</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 size-1.5 rounded-full bg-primary" />
              <p className="text-sm">
                Receber feedback personalizado do professor
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 size-1.5 rounded-full bg-primary" />
              <p className="text-sm">
                Acompanhar sua evolução com gráficos e estatísticas
              </p>
            </div>
          </CardContent>
        </Card>

        <Link href="/">
          <Button variant="outline" size="lg">
            <IconArrowLeft />
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
}
