import { getAllServices } from "../_data-access/get-all-services";
import { ServicesList } from "./services-list";
import { canPermission } from "@/utils/permissions/canPermission";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ServiceContentProps {
  userId: string;
}

export async function ServiceContent({ userId }: ServiceContentProps) {
  const services = await getAllServices({ userId });
  const permissions = await canPermission({ type: "service" });

  console.log("Permissions:", permissions);

  if (services.error) {
    return (
      <Card className="bg-barber-primary-light border-barber-red-dark/40 border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-barber-gold" />
            Falha ao carregar serviços
          </CardTitle>
          <CardDescription className="text-gray-300">
            Atualize a página para tentar novamente.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <section>
      <ServicesList services={services.data || []} permissions={permissions} />
    </section>
  );
}
