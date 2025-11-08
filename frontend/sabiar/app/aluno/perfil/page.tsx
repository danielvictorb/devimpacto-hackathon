import { IconUser } from "@tabler/icons-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function AlunoPerfilPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <IconUser className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Em breve</h3>
          <p className="text-sm text-muted-foreground">
            Aqui você poderá editar seus dados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

