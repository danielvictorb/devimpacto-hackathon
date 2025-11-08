"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconSchool, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AlunoLoginPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Validar código no backend
    if (codigo) {
      router.push("/aluno/dashboard");
    } else {
      alert("Digite seu código de acesso!");
    }
  };

  const handleDemo = () => {
    router.push("/aluno/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-zinc-50 to-white px-4 dark:from-zinc-950 dark:to-black">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
            <IconSchool className="size-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Área do Aluno</h1>
          <p className="mt-2 text-muted-foreground">
            Acompanhe seu desempenho e receba insights personalizados
          </p>
        </div>

        {/* Card de Acesso */}
        <Card>
          <CardHeader>
            <CardTitle>Acesse sua conta</CardTitle>
            <CardDescription>
              Digite seu código de acesso para ver seu desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código de Acesso</Label>
                <Input
                  id="codigo"
                  placeholder="Digite seu código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Acessar
              </Button>

              <Button
                type="button"
                onClick={handleDemo}
                variant="outline"
                className="w-full"
              >
                Ver Demonstração
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Voltar */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost">
              <IconArrowLeft className="size-4" />
              Voltar para o início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
