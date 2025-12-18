import { Button } from "@/components/ui/button";
import Image from "next/image";
import imageBarber from "../../../../public/hero-image.jpg";

export function Hero() {
  return (
    <section className="bg-barber-primary-dark/93 text-white py-20">
      <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">

        <main className="flex items-center justify-center flex-2">

          <article className="space-y-8 max-w-3xl flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl max-w-2xl font-bold tracking-tight">Encontre as melhores barbearias em um único lugar!</h1>
            <p className="text-base md:text-lg">
              Nos somos a plataforma definitiva para conectar você às melhores
              barbearias da sua região. Agende seu horário com facilidade e
              descubra serviços de qualidade perto de você.
            </p>

            <Button className="text-white text-lg transition-colors duration-300 font-medium mt-6 cursor-pointer w-fit bg-barber-gold-dark/90 hover:bg-barber-gold/90">
                Buscar Barbearias
            </Button>

          </article>

          <div className="ml-10 hidden md:block shadow-barber-gold-light shadow-md rounded-md">
            <Image
              src={imageBarber}
              alt="Imagem de destaque mostrando uma barbearia moderna"
              width={340}
              height={450}
              className="object-contain rounded-md"
              quality={100}
              priority
            />
          </div>
        </main>

      </div>
    </section>
  );
}
