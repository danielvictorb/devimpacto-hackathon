"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck } from "@tabler/icons-react";
import { criarTurma } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NovaTurmaPage() {
  const router = useRouter();

  const [nomeTurma, setNomeTurma] = useState("");
  const [nivelEscolar, setNivelEscolar] = useState("");
  const [secao, setSecao] = useState("");
  const [turno, setTurno] = useState("");
  const [anoLetivo, setAnoLetivo] = useState(
    new Date().getFullYear().toString()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await criarTurma({
        name: nomeTurma,
        grade_level: nivelEscolar,
        section: secao,
        shift: turno || undefined,
        school_year: parseInt(anoLetivo),
      });

      alert("✅ Turma criada com sucesso!");
      router.push("/dashboard/turmas");
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      alert("❌ Erro ao criar turma. Verifique se o backend está rodando!");
    }
  };

  const canSubmit = nomeTurma && nivelEscolar && secao && anoLetivo;

  // Gerar nome automaticamente
  const nomeGerado = nivelEscolar && secao ? `${nivelEscolar} ${secao}` : "";

  return (
    <div className="mx-auto px-4 py-8 md:px-8 lg:max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nova Turma</h1>
        <p className="text-muted-foreground">
          Cadastre uma nova turma no sistema
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Turma</CardTitle>
            <CardDescription>
              Preencha os dados básicos da nova turma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nível Escolar e Seção */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nivel">
                  Nível Escolar <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={nivelEscolar}
                  onValueChange={(value) => {
                    setNivelEscolar(value);
                    if (value && secao) setNomeTurma(`${value} ${secao}`);
                  }}
                >
                  <SelectTrigger id="nivel">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6º Ano">6º Ano</SelectItem>
                    <SelectItem value="7º Ano">7º Ano</SelectItem>
                    <SelectItem value="8º Ano">8º Ano</SelectItem>
                    <SelectItem value="9º Ano">9º Ano</SelectItem>
                    <SelectItem value="1º Ano EM">1º Ano EM</SelectItem>
                    <SelectItem value="2º Ano EM">2º Ano EM</SelectItem>
                    <SelectItem value="3º Ano EM">3º Ano EM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secao">
                  Seção <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={secao}
                  onValueChange={(value) => {
                    setSecao(value);
                    if (nivelEscolar && value)
                      setNomeTurma(`${nivelEscolar} ${value}`);
                  }}
                >
                  <SelectTrigger id="secao">
                    <SelectValue placeholder="Selecione a seção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nome da Turma (auto-gerado, mas editável) */}
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome da Turma <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Ex: 9º Ano A"
                value={nomeTurma}
                onChange={(e) => setNomeTurma(e.target.value)}
              />
              {nomeGerado && nomeTurma !== nomeGerado && (
                <p className="text-xs text-muted-foreground">
                  Sugestão: {nomeGerado}
                </p>
              )}
            </div>

            {/* Turno e Ano Letivo */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="turno">Turno (opcional)</Label>
                <Select value={turno} onValueChange={setTurno}>
                  <SelectTrigger id="turno">
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matutino">Matutino</SelectItem>
                    <SelectItem value="Vespertino">Vespertino</SelectItem>
                    <SelectItem value="Noturno">Noturno</SelectItem>
                    <SelectItem value="Integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">
                  Ano Letivo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ano"
                  type="number"
                  min="2020"
                  max="2030"
                  value={anoLetivo}
                  onChange={(e) => setAnoLetivo(e.target.value)}
                />
              </div>
            </div>

            {/* Preview */}
            {nomeTurma && (
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                <div className="flex items-center gap-3">
                  <IconCheck className="size-5 text-secondary" />
                  <div>
                    <p className="font-semibold">Preview da Turma</p>
                    <p className="text-sm text-muted-foreground">
                      {nomeTurma}
                      {turno && ` • ${turno}`}
                      {` • ${anoLetivo}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                onClick={() => router.push("/dashboard/turmas")}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!canSubmit} variant="secondary">
                Criar Turma
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
