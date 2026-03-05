import Link from "next/link";
import { CalendarCheck2, Scissors, ShieldCheck } from "lucide-react";
import Image from "next/image";
import logo from "../../../../public/logo.svg";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-barber-gold/20 bg-barber-primary/95 py-12 text-white">
      <div className="container mx-auto space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <article className="space-y-4">
            <Link href="/" className="inline-flex">
              <Image src={logo} alt="BarberPro Logo" className="h-auto w-32" />
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-white/80">
              Plataforma para dar visibilidade a barbearias profissionais e facilitar o agendamento dos clientes.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-barber-gold/30 bg-barber-primary-light/50 px-3 py-1 text-xs text-white/90">
                <Scissors className="h-3.5 w-3.5 text-barber-gold" />
                Barbearias qualificadas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-barber-gold/30 bg-barber-primary-light/50 px-3 py-1 text-xs text-white/90">
                <ShieldCheck className="h-3.5 w-3.5 text-barber-gold" />
                Presença digital forte
              </span>
            </div>
          </article>

          <article>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-barber-gold">
              Navegação
            </h3>
            <nav className="flex flex-col gap-2 text-sm text-white/80">
              <Link href="#barbearias" className="hover:text-barber-gold">
                Barbearias
              </Link>
              <Link href="#como-funciona" className="hover:text-barber-gold">
                Como funciona
              </Link>
              <Link href="/dashboard" className="hover:text-barber-gold">
                Portal da barbearia
              </Link>
            </nav>
          </article>

          <article className="rounded-xl border border-barber-gold/20 bg-barber-primary-light/60 p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-barber-gold">
              Comece agora
            </h3>
            <p className="mb-4 text-sm text-white/80">
              Entre no painel e fortaleça sua barbearia com agendamento online.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-md bg-barber-gold px-4 py-2 text-sm font-semibold text-barber-primary transition-colors hover:bg-barber-gold-light"
            >
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Acessar painel
            </Link>
          </article>
        </div>

        <div className="flex flex-col gap-2 border-t border-barber-gold/15 pt-5 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} BarberPro. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{" "}
            <Link
              href="https://github.com/Valdeilson-lima?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-barber-gold hover:underline"
            >
              Valdeilson Lima
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
