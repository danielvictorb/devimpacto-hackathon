import Link from "next/link";
import Image from "next/image";
import { IconHome, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="flex flex-col items-center gap-8 px-4 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/sabiar_icon.png"
            alt="SabiaR Logo"
            width={60}
            height={60}
            className="rounded-lg"
          />
          <div className="flex items-center gap-0.5">
            <span className="text-2xl font-bold">Sabia</span>
            <span className="flex size-8 items-center justify-center rounded border-2 border-border text-2xl font-bold">
              R
            </span>
          </div>
        </div>

        {/* 404 */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-secondary">404</h1>
          <h2 className="text-3xl font-bold">Página não encontrada</h2>
          <p className="max-w-md text-lg text-muted-foreground">
            Ops! Parece que esta página ainda não existe ou foi movida.
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button variant="outline" size="lg">
              <IconHome className="size-4" />
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">
              <IconArrowLeft className="size-4" />
              Ir para o Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
