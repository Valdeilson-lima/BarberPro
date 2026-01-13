"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/utils/stripe";
import { Plan } from "@/generated/prisma/enums";
import { url } from "inspector";

interface SubscriptionsProps {
  type: Plan;
}

export async function createSubscription({ type }: SubscriptionsProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      sessionId: null,
      error: "Falha ao autenticar o usuário.",
    };
  }

  const findUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!findUser) {
    return {
      sessionId: "",
      error: "Falha ao encontrar o usuário.",
    };
  }

  let customerId = findUser.stripeCustomerId;

  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email || undefined,
    });

    customerId = stripeCustomer.id;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeCustomerId: customerId,
      },
    });
  }

  try {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price:
            type === Plan.PROFESSIONAL
              ? process.env.STRIPE_PLAN_PRO
              : process.env.STRIPE_PLAN_BASIC,
          quantity: 1,
        },
      ],
      metadata: {
        type: type,
      },
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return {
      sessionId: stripeCheckoutSession.id,
      url: stripeCheckoutSession.url,
      error: null,
    };
  } catch (error) {
    return {
      sessionId: null,
      error: "Erro ao criar sessão de checkout: " + (error as Error).message,
    };
  }
}
