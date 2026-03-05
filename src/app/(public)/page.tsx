import type { Metadata } from "next";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { LandingHighlights } from "./_components/landing-highlights";
import { Professionals } from "./_components/professionals";
import { getBarbers } from "./_data-access/get-barbers";
import { getSiteUrl } from "@/lib/seo";

export const revalidate = 60;
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Agende em Barbearias da Sua Região",
  description:
    "Encontre barbearias profissionais, compare opções e agende seu serviço online em poucos minutos com a BarberPro.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Agende em Barbearias da Sua Região | BarberPro",
    description:
      "Descubra barbearias com atendimento profissional e agende online com rapidez e praticidade.",
    url: "/",
  },
};

export default async function HomePage() {
  const barbers = await getBarbers();
  const premiumBarbers = barbers.filter(
    (barber) =>
      barber.subscriptions?.status === "active" &&
      barber.subscriptions?.plan === "PROFESSIONAL",
  ).length;
  const uniqueCities = new Set(
    barbers
      .map((barber) => barber.address?.split("-").pop()?.trim())
      .filter(Boolean),
  );
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Barbearias disponíveis na BarberPro",
    itemListElement: barbers.slice(0, 12).map((barber, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: barber.name ?? "Barbearia",
      url: `${siteUrl}/barber/${barber.id}`,
    })),
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BarberPro",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/#barbearias`,
      "query-input": "required name=barbearia",
    },
  };

  return (
    <main className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Header />

      <div>
        <Hero
          totalBarbers={barbers.length}
          premiumBarbers={premiumBarbers}
          citiesCount={uniqueCities.size}
        />
        <LandingHighlights />
        <Professionals barbers={barbers} />
        <Footer />
      </div>
    </main>
  );
}
