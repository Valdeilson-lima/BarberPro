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
import { CalendarClock, Check, CircleDollarSign, Crown } from "lucide-react";

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
    <Card className="w-full bg-gradient-to-br from-barber-primary-light to-barber-primary border border-barber-gold/20">
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Crown className="h-6 w-6 text-barber-gold" />
          Seu Plano Atual
        </CardTitle>
        <CardDescription className="text-gray-400">
          Informações sobre sua assinatura ativa e recursos disponíveis.
        </CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="rounded-md border border-barber-gold/20 bg-barber-primary/60 p-3">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <CircleDollarSign className="h-3.5 w-3.5 text-barber-gold" />
              Plano
            </p>
            <p className="text-white font-semibold mt-1">
              {subscriptionId.plan === "BASIC" ? "Básico" : "Profissional"}
            </p>
          </div>
          <div className="rounded-md border border-barber-gold/20 bg-barber-primary/60 p-3">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5 text-barber-gold" />
              Status
            </p>
            <p className="text-white font-semibold mt-1">
              {subscriptionId.status === "active" ? "Ativo" : subscriptionId.status}
            </p>
          </div>
          <div className="rounded-md border border-barber-gold/20 bg-barber-primary/60 p-3">
            <p className="text-xs text-gray-400">Preço</p>
            <p className="text-white font-semibold mt-1">
              {subscriptionId.plan === "BASIC" ? "R$ 19,99/mês" : "R$ 59,99/mês"}
            </p>
          </div>
        </div>
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
              <p className="text-green-500 font-bold bg-emerald-50 py-2 px-2 rounded-md text-sm">
                Plano Ativo
              </p>
            ) : (
              <p className="text-red-500 font-bold bg-red-50 py-2 px-2 rounded-md text-sm">
                Plano Inativo - {subscriptionId.status}
              </p>
            )}
          </div>
        </div>

        <ul className="mt-4 space-y-2">
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
