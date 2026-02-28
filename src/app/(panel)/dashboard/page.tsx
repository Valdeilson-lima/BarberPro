import { Button } from "@/components/ui/button";
import getSession from "@/lib/getSession";
import { Calendar, Link2, Scissors } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonCopyLink } from "./_components/button-copy-link";
import { Reminders } from "./_components/remindres/reminders";
import { Appointments } from "./_components/appointments/appointments";
import { checkSubscriptionExpiredByUserId } from "@/utils/permissions/checkSubscription";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const subscriptionStatus = await checkSubscriptionExpiredByUserId(
    session?.user?.id!,
  );

  if (subscriptionStatus.subscriptionSatuds === "EXPIRED") {
    return (
      <main className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-200">
          Seu acesso foi interrompido
        </h1>
        <p className="max-w-xl text-center text-gray-400">
          Seu período de teste terminou ou não há uma assinatura ativa no
          momento. Escolha um plano para reativar sua conta e continuar usando
          todos os recursos do BarberPro.
        </p>
        <Link href="/dashboard/plans" className="w-full md:w-auto">
          <Button className="bg-barber-gold hover:bg-barber-gold-dark text-white">
            Escolher Plano
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section className="rounded-xl border border-barber-gold/20 bg-linear-to-br from-barber-primary-light to-barber-primary p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-white text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Scissors className="h-6 w-6 text-barber-gold" />
              Painel do Barbeiro
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Acompanhe sua rotina do dia, agendamentos e lembretes em um só
              lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
            <Link href={`/barber/${session?.user?.id}`} target="_blank">
              <Button
                className="w-full bg-barber-gold-dark cursor-pointer hover:bg-barber-gold hover:brightness-110 transition-all hover:shadow-md hover:shadow-barber-gold/30 text-white hover:text-black"
                title="Agendar"
              >
                <Calendar className="mr-2 h-5 w-5" />
                <span>Novo Agendamento</span>
              </Button>
            </Link>

            <div className="w-full">
              <ButtonCopyLink userId={session!.user!.id} />
            </div>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-barber-gold/30 bg-barber-primary/60 px-3 py-1 text-xs text-gray-200">
          <Link2 className="h-3.5 w-3.5 text-barber-gold" />
          Compartilhe seu link de agendamento para preencher horários vagos.
        </div>
      </section>

      {subscriptionStatus.subscriptionSatuds === "TRIAL" && (
        <section className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm md:text-base">{subscriptionStatus.message}</p>
            <Link href="/dashboard/plans" className="w-full md:w-auto">
              <Button className="w-full bg-barber-gold hover:bg-barber-gold-dark text-white md:w-auto">
                Ver Assinaturas
              </Button>
            </Link>
          </div>
        </section>
      )}

      {subscriptionStatus.subscriptionSatuds !== "EXPIRED" && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <Appointments userId={session!.user!.id} />
          <Reminders userId={session!.user!.id} />
        </section>
      )}
    </main>
  );
}
