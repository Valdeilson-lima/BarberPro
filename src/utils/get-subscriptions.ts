"use server";
import { prisma } from "@/lib/prisma";

export async function getSubscriptions({ userId }: { userId: string }) {
  if (!userId) {
    throw new Error("Nenhuma assinatura encontrada para este usuário.");
  }
  try {
    const subscriptions = await prisma.subscription.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return subscriptions;
  } catch (error) {
    return null;
  }
}
