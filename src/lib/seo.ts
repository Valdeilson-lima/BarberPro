const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

  if (!envUrl) return DEFAULT_SITE_URL;

  try {
    return normalizeSiteUrl(new URL(envUrl).toString());
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const seoConfig = {
  siteName: "BarberPro",
  defaultTitle: "BarberPro | Agendamento Online para Barbearias",
  titleTemplate: "%s | BarberPro",
  defaultDescription:
    "Agende serviços em barbearias com rapidez e segurança. A BarberPro conecta clientes e profissionais com agenda online e presença digital.",
  defaultKeywords: [
    "barbearia",
    "agendamento online",
    "corte de cabelo",
    "barber shop",
    "barbeiro",
    "barbearia perto de mim",
  ],
  defaultOgImage: "/hero-image.jpg",
};
