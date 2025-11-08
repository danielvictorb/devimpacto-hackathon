"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconClipboardList,
  IconPlus,
  IconLayoutDashboard,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { name: "Turmas", href: "/dashboard/turmas", icon: IconSchool },
  { name: "Provas", href: "/dashboard/provas", icon: IconClipboardList },
  { name: "Alunos", href: "/dashboard/alunos", icon: IconUsers },
];

export default function ProvasPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950/95">
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

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Voltar ao Início
              </Button>
            </Link>
            <Link href="/dashboard/nova-prova">
              <Button variant="secondary" size="sm">
                <IconPlus className="size-4" />
                Nova Prova
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
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

        <main className="flex-1 px-4 py-8 md:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Provas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas provas e avaliações
            </p>
          </div>

          <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <IconClipboardList className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Em breve</h3>
              <p className="text-sm text-muted-foreground">
                Página de gerenciamento de provas
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
