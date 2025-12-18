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

export function Professionals() {
  return (
    <section className="bg-barber-primary-dark text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Barbearias Disponíveis
        </h2>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-barber-primary-light/90 border-0 shadow-barber-gold shadow-md p-0 rounded-t-md overflow-hidden">
            <CardContent className="p-0">
              <div>
                <div className="relative h-48">
                  <Image
                    src={image01}
                    alt="Barbearia Estilo Clássico"
                    fill
                    className="object-cover "
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Main Barbearia</h3>
                    <p className="text-sm text-white/90">Rua: Profeta João Alvez</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-lg bg-white"></div>
                </div>

                <Link href="/barbearia/main-barbearia" >
                  <Button className="w-full bg-barber-gold-dark/90 hover:bg-barber-gold/90 text-white cursor-pointer flex items-center justify-center font-medium text-sm lg:text-base p-0">
                    Agendar Serviço
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-barber-primary-light/90 border-0 shadow-barber-gold shadow-md p-0 rounded-t-md overflow-hidden">
            <CardContent className="p-0">
              <div>
                <div className="relative h-48">
                  <Image
                    src={image01}
                    alt="Barbearia Estilo Clássico"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Main Barbearia</h3>
                    <p className="text-sm text-white/90">Rua: Profeta João Alvez</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-lg bg-white"></div>
                </div>

                <Link href="/barbearia/main-barbearia" >
                  <Button className="w-full bg-barber-gold-dark/90 hover:bg-barber-gold/90 text-white cursor-pointer flex items-center justify-center font-medium text-sm lg:text-base p-0">
                    Agendar Serviço
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-barber-primary-light/90 border-0 shadow-barber-gold shadow-md p-0 rounded-t-md overflow-hidden">
            <CardContent className="p-0">
              <div>
                <div className="relative h-48">
                  <Image
                    src={image01}
                    alt="Barbearia Estilo Clássico"
                    fill
                    className="object-cover "
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Main Barbearia</h3>
                    <p className="text-sm text-white/90">Rua: Profeta João Alvez</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-lg bg-white"></div>
                </div>

                <Link href="/barbearia/main-barbearia" >
                  <Button className="w-full bg-barber-gold-dark/90 hover:bg-barber-gold/90 text-white cursor-pointer flex items-center justify-center font-medium text-sm lg:text-base p-0">
                    Agendar Serviço
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-barber-primary-light/90 border-0 shadow-barber-gold shadow-md p-0 rounded-t-md overflow-hidden">
            <CardContent className="p-0">
              <div>
                <div className="relative h-48">
                  <Image
                    src={image01}
                    alt="Barbearia Estilo Clássico"
                    fill
                    className="object-cover "
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Main Barbearia</h3>
                    <p className="text-sm text-white/90">Rua: Profeta João Alvez</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-lg bg-white"></div>
                </div>

                <Link href="/barbearia/main-barbearia" >
                  <Button className="w-full bg-barber-gold-dark/90 hover:bg-barber-gold/90 text-white cursor-pointer flex items-center justify-center font-medium text-sm lg:text-base p-0">
                    Agendar Serviço
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
}
