import { IconClipboardList } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AlunoProvasPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minhas Provas</h1>
        <p className="text-muted-foreground">Veja suas provas e resultados</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <IconClipboardList className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Em breve</h3>
          <p className="text-sm text-muted-foreground">
            Aqui você verá todas as suas provas e notas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
