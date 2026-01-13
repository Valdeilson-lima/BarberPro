"use client";

import { Button } from "@/components/ui/button";
import { Plan } from "@/generated/prisma/enums";
import { createSubscription } from "../_actions/create-subscription";
import { getStripeJs } from "@/utils/stripe-js";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  type: Plan;
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  async function handleCreateBilling() {
    const { sessionId, error, url } = await createSubscription({ type });
    console.log({ sessionId, error, url });

    if (error) {
      toast.error("Error creating subscription: " + error);
      return;
    }

    const stripe = await getStripeJs();

    if (stripe && url) {
      window.location.href = url;
    } else {
      toast.error("Erro ao redirecionar para o Stripe.");
    }
  }
  return (
    <Button
      onClick={handleCreateBilling}
      className={`w-full font-semibold ${
        type === Plan.PROFESSIONAL
          ? "bg-barber-gold hover:bg-barber-gold-dark text-barber-primary shadow-lg shadow-barber-gold/30 transition-all duration-300 cursor-pointer"
          : "bg-barber-gold/50 hover:bg-barber-gold text-barber-primary transition-all duration-300 cursor-pointer"
      }`}
    >
      Assinar {type === Plan.PROFESSIONAL ? "Profissional" : "Básico"}
    </Button>
  );
}
