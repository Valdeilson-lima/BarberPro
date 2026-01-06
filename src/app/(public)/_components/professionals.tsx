"'use client'";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import image01 from "../../../../public/imagem01.jpg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { User } from "@/generated/prisma/client";

interface ProfessionalsProps {
  barbers: User[];
}

export function Professionals({ barbers }: ProfessionalsProps) {
  return (
    <section className="bg-barber-primary-dark text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Barbearias Disponíveis
        </h2>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((barber) => (
            <Card
              className="bg-barber-primary-light/90 border-0 shadow-barber-gold hover:shadow-lg p-0 rounded-t-md overflow-hidden duration-500 transition-shadow"
              key={barber.id}
            >
              <CardContent className="p-0">
                <div>
                  <div className="relative h-48">
                    <Image
                      src={barber.image || image01}
                      alt={`Barbearia ${barber.name}`}
                      fill
                      className="object-cover "
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4">
                  <div className="">
                    <div className="flex items-center gap-2 mb-1 justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {barber.name}
                      </h3>
                      {barber.status === true ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="text-green-600">Aberta</div>
                            <div className="w-2.5 h-2.5 rounded-lg bg-green-600"></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="text-red-600">Fechada</div>
                            <div className="w-2.5 h-2.5 rounded-lg bg-red-600"></div>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-white/90">
                      {barber.address ?? "Endereço não disponível..."}
                    </p>
                  </div>

                  <Link href={`/barber/${barber.id}`} target="_blank">
                    <Button className="w-full bg-barber-gold-dark/90 hover:bg-barber-gold/90 text-white cursor-pointer flex items-center justify-center font-medium text-sm lg:text-base p-0">
                      Agendar Serviço
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </section>
  );
}
