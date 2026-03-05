import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getInfoSchedule } from "./_data-access/get-info-schedule";
import { ScheduleContent } from "./_components/schedule-content";
import { getSiteUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();
const getScheduleInfo = cache((id: string) => getInfoSchedule({ userId: id }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getScheduleInfo(id);

  if (!result?.user) {
    return {
      title: "Barbearia não encontrada",
      description: "A barbearia solicitada não foi encontrada.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const barber = result.user;
  const barberName = barber.name || "Barbearia";
  const title = `${barberName} - Agendamento Online`;
  const description = `Agende online na ${barberName}. ${
    barber.address ? `Endereço: ${barber.address}. ` : ""
  }Escolha serviço, data e horário em poucos passos.`;
  const image = barber.image || "/hero-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `/barber/${id}`,
    },
    openGraph: {
      title: `${title} | BarberPro`,
      description,
      url: `/barber/${id}`,
      images: [{ url: image, width: 1200, height: 630, alt: barberName }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | BarberPro`,
      description,
      images: [image],
    },
  };
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getScheduleInfo(id);
  const barber = result?.user;

  if (!barber) {
    redirect("/");
  }

  const barberJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: barber.name || "Barbearia",
    image: barber.image || `${siteUrl}/hero-image.jpg`,
    address: barber.address || "Endereço não informado",
    url: `${siteUrl}/barber/${id}`,
    areaServed: "Brasil",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de barbearia",
      itemListElement: barber.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        price: (service.price / 100).toFixed(2),
        priceCurrency: "BRL",
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(barberJsonLd) }}
      />
      <ScheduleContent barber={barber} />
    </>
  );
}
