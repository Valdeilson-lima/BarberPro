"use server";

import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/utils/stripe";

export async function createPortalCustomer() {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      sessionId: "",
      error: "Usuário não autenticado.",
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user?.stripeCustomerId) {
    return {
      sessionId: "",
      error: "Cliente Stripe não encontrado.",
    };
  }

  const sessionId = user.stripeCustomerId;

  if (!sessionId) {
    return {
      sessionId: "",
      error: "ID do cliente Stripe inválido.",
    };
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sessionId,
      return_url: process.env.STRIPE_SUCCESS_URL as string,
    });

    return {
      sessionId: portalSession.url!,
      error: null,
    };
  } catch (error) {
    return {
      sessionId: "",
      error: "Erro ao criar sessão do portal de cliente.",
    };
  }
}
