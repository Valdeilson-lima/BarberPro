import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, Crown, Scissors, Sparkles, Timer, Users } from "lucide-react";

const benefits = [
  {
    icon: Scissors,
    title: "Profissionais selecionados",
    description: "Perfis completos para facilitar sua escolha com segurança e confiança.",
  },
  {
    icon: Timer,
    title: "Agendamento em minutos",
    description: "Escolha data, hora e serviço com fluxo rápido e sem burocracia.",
  },
  {
    icon: Crown,
    title: "Barbearias premium",
    description: "Destaque para estabelecimentos com atendimento diferenciado na plataforma.",
  },
];

const steps = [
  {
    number: "01",
    title: "Escolha sua barbearia",
    description: "Compare opções, localização e disponibilidade.",
  },
  {
    number: "02",
    title: "Selecione o horário",
    description: "Agende no melhor horário para a sua rotina.",
  },
  {
    number: "03",
    title: "Confirme e compareça",
    description: "Atendimento organizado para uma experiência profissional.",
  },
];

export function LandingHighlights() {
  return (
    <>
      <section className="bg-barber-primary-dark py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-barber-gold/30 bg-barber-primary-light/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-barber-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Diferenciais da BarberPro
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Mais visibilidade para barbearias e mais praticidade para clientes
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-barber-gold/20 bg-linear-to-b from-barber-primary-light to-barber-primary p-6"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-barber-gold/15 text-barber-gold">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-barber-primary py-16 text-white scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-barber-gold">
              Como funciona
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Seu próximo corte em 3 passos
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-barber-gold/20 bg-barber-primary-light/70 p-6"
              >
                <span className="mb-4 inline-block text-sm font-bold tracking-[0.2em] text-barber-gold">
                  {step.number}
                </span>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{step.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-barber-gold/20 bg-linear-to-r from-barber-primary-light to-barber-primary p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl space-y-2">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-barber-gold">
                  <Users className="h-4 w-4" />
                  Dono de barbearia?
                </p>
                <h3 className="text-2xl font-bold tracking-tight">Cadastre seu negócio e atraia novos clientes</h3>
                <p className="text-sm text-white/80">
                  Entre para a BarberPro e destaque seus serviços com agenda online e presença digital.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-barber-gold text-barber-primary hover:bg-barber-gold-light">
                  <Link href="/dashboard">
                    <CalendarCheck2 className="mr-2 h-4 w-4" />
                    Acessar painel
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-barber-gold/60 bg-transparent text-white hover:bg-barber-gold/10">
                  <Link href="#barbearias">Ver barbearias</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
