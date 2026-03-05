"'use client'";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import image01 from "../../../../public/imagem01.jpg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { PremiumBadge } from "./premium-badge";

type UserWithSubscriptions = Prisma.UserGetPayload<{
  include: { subscriptions: true };
}>;

interface ProfessionalsProps {
  barbers: UserWithSubscriptions[];
}

export function Professionals({ barbers }: ProfessionalsProps) {
  return (
    <section id="barbearias" className="bg-barber-primary-dark py-16 text-white scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-barber-gold">
            Catálogo de barbearias
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Encontre a melhor opção para seu próximo atendimento
          </h2>
        </div>

        {barbers.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-barber-gold/20 bg-barber-primary-light/60 p-8 text-center">
            <h3 className="mb-3 text-xl font-semibold">Nenhuma barbearia ativa no momento</h3>
            <p className="text-sm text-white/80">
              Atualize em instantes para verificar novos estabelecimentos disponíveis na sua região.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {barbers.map((barber) => (
              <Card
                className="overflow-hidden rounded-2xl border border-barber-gold/15 bg-barber-primary-light/90 p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-barber-gold/15"
                key={barber.id}
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={barber.image || image01}
                      alt={`Barbearia ${barber.name}`}
                      fill
                      className="object-cover"
                    />
                    {barber.subscriptions?.status === "active" &&
                      barber.subscriptions?.plan === "PROFESSIONAL" && (
                        <PremiumBadge />
                      )}
                  </div>

                  <div className="flex flex-col gap-4 p-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-white">{barber.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={barber.status ? "text-green-500" : "text-red-500"}>
                            {barber.status ? "Aberta" : "Fechada"}
                          </div>
                          <div
                            className={`h-2.5 w-2.5 rounded-lg ${barber.status ? "bg-green-500" : "bg-red-500"}`}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-white/90">
                        {barber.address ?? "Endereço não disponível no momento."}
                      </p>
                    </div>

                    <Link href={`/barber/${barber.id}`}>
                      <Button className="flex w-full items-center justify-center bg-barber-gold-dark/90 p-0 text-sm font-medium text-white hover:bg-barber-gold/90 lg:text-base">
                        Agendar serviço
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </section>
  );
}
