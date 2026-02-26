"use client";

import { Subscription } from "@/generated/prisma/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionPlans } from "@/utils/plans";
import { createPortalCustomer } from "../_actions/create-portal-customer";
import { Check } from "lucide-react";

interface SubscriptionDetailProps {
  subscriptionId: Subscription;
}

export function SubscriptionDetail({
  subscriptionId,
}: SubscriptionDetailProps) {


  async function handleMangeSubscription() {
    const portal = await createPortalCustomer();
    if (portal.error) {
      toast.error(portal.error);
      return;
    }

    window.location.href = portal.sessionId;
    toast.info("Redirecionando para o portal de gerenciamento...");
  }

  return (
    <Card className="w-full bg-barber-primary-light border border-barber-gold/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-3xl font-bold text-white">
          Seu Plano atual
        </CardTitle>
        <CardDescription className="text-gray-400">
          Informações sobre sua assinatura atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-white">
            {subscriptionId.plan === "BASIC"
              ? "Plano Básico"
              : "Plano Profissional"}
          </h3>

          <div>
            {subscriptionId.status === "active" ? (
              <p className="text-green-500 font-bold bg-emerald-50 py-2 px-2 rounded-md">
                Plano Ativo
              </p>
            ) : (
              <p className="text-red-500 font-bold bg-red-50 py-2 px-2 rounded-md">
                Plano Inativo - {subscriptionId.status}
              </p>
            )}
          </div>
        </div>

        <ul>
          {subscriptionPlans
            .find((plan) => plan.id === subscriptionId.plan)!
            .features.map((feature) => (
              <li
                key={feature}
                className="text-white mt-2 flex items-center gap-2"
              >
                <Check className="h-5 w-5 text-barber-gold shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={"default"}
          className="bg-barber-gold text-black hover:bg-barber-gold/80 cursor-pointer transition-all duration-300"
          onClick={handleMangeSubscription}
        >
          Gerenciar Assinatura
        </Button>
      </CardFooter>
    </Card>
  );
}
