"use server";
import { prisma } from "@/lib/prisma";
import { addDays, differenceInDays, isAfter } from "date-fns";
import { TRIAL_PERIOD_DAYS } from "./trial-limit";

export async function checkSubscriptionExpiredByUserId(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      subscriptions: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (user.subscriptions && user.subscriptions.status === "active") {
    return {
      subscriptionSatuds: "ACTIVE",
      message: "Assinatura ativa. Você tem acesso total ao serviço.",
      planId: user.subscriptions.plan,
    };
  }

  const trialEndDate = addDays(user.createdAt, TRIAL_PERIOD_DAYS);

  if (isAfter(new Date(), trialEndDate)) {
    return {
      subscriptionSatuds: "EXPIRED",
      message:
        "Período de teste expirado. Por favor, adquira um plano para continuar usando o serviço.",
      planId: "TRIAL",
    };
  }

  return {
    subscriptionSatuds: "TRIAL",
    message: `Você está no período de teste. Faltam ${differenceInDays(trialEndDate, new Date())} dias para o término do período de teste.`,
    planId: "TRIAL",
  };
}
