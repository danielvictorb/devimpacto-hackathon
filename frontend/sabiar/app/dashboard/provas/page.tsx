"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconClipboardList,
  IconSearch,
  IconFileText,
  IconUpload,
  IconChartBar,
  IconCalendar,
  IconLoader2,
} from "@tabler/icons-react";
import { listarProvas } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProvasPage() {
  const [provas, setProvas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarProvas();
        setProvas(data);
      } catch (error) {
        console.error("Erro ao carregar provas:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Filtrar provas
  const provasFiltradas = provas.filter((prova) => {
    const matchBusca = prova.title.toLowerCase().includes(busca.toLowerCase());
    const matchDisciplina =
      filtroDisciplina === "todas" || prova.subject === filtroDisciplina;
    return matchBusca && matchDisciplina;
  });

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Provas</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas provas e avaliações
        </p>
      </div>

      {/* Busca e Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título da prova..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de Disciplina */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Disciplina</label>
            <Select
              value={filtroDisciplina}
              onValueChange={setFiltroDisciplina}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Matemática">Matemática</SelectItem>
                <SelectItem value="Português">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading ? (
        <div className="py-12 text-center">
          <IconLoader2 className="mx-auto mb-4 size-12 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando provas...</p>
        </div>
      ) : (
        <>
          {/* Contador */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {provasFiltradas.length}{" "}
              {provasFiltradas.length === 1
                ? "prova encontrada"
                : "provas encontradas"}
            </p>
          </div>

          {/* Lista de Provas */}
          <div className="space-y-4">
            {provasFiltradas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <IconClipboardList className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    Nenhuma prova encontrada
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros ou criar uma nova prova
                  </p>
                </CardContent>
              </Card>
            ) : (
              provasFiltradas.map((prova) => (
                <Card key={prova.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10">
                        <IconFileText className="size-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <CardTitle className="text-xl">
                            {prova.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-green-600">
                            Criada
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <IconCalendar className="size-4" />
                            {new Date(prova.exam_date).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                          <span>•</span>
                          <span>{prova.subject}</span>
                          {prova.period_type && (
                            <>
                              <span>•</span>
                              <span>{prova.period_type}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/provas/${prova.id}`}>
                        <Button variant="ghost" size="sm">
                          <IconFileText className="size-4" />
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link href={`/dashboard/provas/${prova.id}/corrigir`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-secondary"
                        >
                          <IconUpload className="size-4" />
                          Corrigir Prova
                        </Button>
                      </Link>
                      <Link href={`/dashboard/provas/${prova.id}/insights`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-secondary"
                        >
                          <IconChartBar className="size-4" />
                          Ver Insights
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
