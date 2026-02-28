import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GrisdPlans } from "./_components/grid-plans";
import { getSubscriptions } from "@/utils/get-subscriptions";
import { Crown, ShieldCheck } from "lucide-react";
import { SubscriptionDetail } from "./_components/subscription-detail";

export default async function Plans() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const subscription = await getSubscriptions({ userId: session?.user?.id! });

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-barber-gold/20 bg-gradient-to-br from-barber-primary-light to-barber-primary p-4 md:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Crown className="h-6 w-6 text-barber-gold" />
            Planos e Assinatura
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Escolha o plano ideal para o momento da sua barbearia e gerencie sua assinatura sem complicação.
          </p>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-barber-gold/25 bg-barber-primary/60 px-3 py-1 text-xs text-gray-200">
            <ShieldCheck className="h-3.5 w-3.5 text-barber-gold" />
            Pagamento seguro via Stripe
          </div>
        </div>
      </section>

      {subscription?.status !== "active" ? (
        <div>
          <GrisdPlans />
        </div>
      ) : (
        <div>
          <SubscriptionDetail subscriptionId={subscription!} />
        </div>
      )}
    </div>
  );
}
