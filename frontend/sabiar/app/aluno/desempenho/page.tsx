import { IconChartBar } from "@tabler/icons-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function AlunoDesempenhoPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Desempenho</h1>
        <p className="text-muted-foreground">
          Acompanhe sua evolução ao longo do tempo
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <IconChartBar className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Em breve</h3>
          <p className="text-sm text-muted-foreground">
            Aqui você verá gráficos da sua evolução
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

