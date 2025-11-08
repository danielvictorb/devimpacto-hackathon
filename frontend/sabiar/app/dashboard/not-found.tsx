import Link from "next/link";
import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/10">
            <span className="text-4xl font-bold text-secondary">404</span>
          </div>
          <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          <CardDescription>
            Esta seção ainda não foi implementada ou não existe.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full" size="lg">
              <IconArrowLeft className="size-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              <IconHome className="size-4" />
              Ir para a Página Inicial
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
