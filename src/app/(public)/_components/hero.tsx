import { Button } from "@/components/ui/button";
import Image from "next/image";
import imageBarber from "../../../../public/hero-image.jpg";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Star } from "lucide-react";

interface HeroProps {
  totalBarbers: number;
  premiumBarbers: number;
  citiesCount: number;
}

export function Hero({ totalBarbers, premiumBarbers, citiesCount }: HeroProps) {
  const citiesLabel = citiesCount > 0 ? citiesCount : 1;

  return (
    <section className="relative overflow-hidden bg-barber-primary-dark/95 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.20),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.16),transparent_45%)]" />

      <div className="container relative mx-auto px-4 pt-16 sm:px-6 lg:px-8">
        <main className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-barber-gold/35 bg-barber-primary-light/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-barber-gold">
              <Star className="h-3.5 w-3.5 fill-barber-gold text-barber-gold" />
              Plataforma para barbearias de alto padrão
            </p>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Agende seu horário em barbearias com presença e credibilidade
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              A BarberPro conecta clientes e barbearias profissionais em um ambiente moderno, rápido e visualmente
              forte para gerar autoridade e atrair novos agendamentos.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="bg-barber-gold-dark/90 text-white transition-colors duration-300 hover:bg-barber-gold"
              >
                <Link href="#barbearias">
                  Buscar barbearias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-barber-gold/60 bg-transparent text-white hover:bg-barber-gold/10"
              >
                <Link href="#como-funciona">Como funciona</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-barber-gold/20 bg-barber-primary-light/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-white/70">Barbearias ativas</p>
                <p className="text-2xl font-bold text-barber-gold">{totalBarbers}+</p>
              </div>
              <div className="rounded-xl border border-barber-gold/20 bg-barber-primary-light/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-white/70">Perfis premium</p>
                <p className="text-2xl font-bold text-barber-gold">{premiumBarbers}+</p>
              </div>
              <div className="rounded-xl border border-barber-gold/20 bg-barber-primary-light/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-white/70">Cidades atendidas</p>
                <p className="text-2xl font-bold text-barber-gold">{citiesLabel}+</p>
              </div>
            </div>
          </article>

          <div className="relative mx-auto hidden max-w-md lg:block">
            <div className="absolute -bottom-5 -left-6 rounded-xl border border-barber-gold/35 bg-barber-primary/85 px-4 py-3 shadow-lg shadow-barber-gold/20 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.1em] text-barber-gold">Alta visibilidade</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white">
                <MapPin className="h-4 w-4 text-barber-gold" />
                Destaque regional para seu negócio
              </p>
            </div>
            <Image
              src={imageBarber}
              alt="Imagem de destaque mostrando uma barbearia moderna"
              width={420}
              height={520}
              className="rounded-2xl border border-barber-gold/20 object-cover shadow-xl shadow-black/50"
              quality={100}
              priority
            />
            <div className="absolute -right-6 top-8 rounded-xl border border-barber-gold/35 bg-barber-primary/85 p-3 backdrop-blur-sm">
              <ShieldCheck className="h-6 w-6 text-barber-gold" />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
