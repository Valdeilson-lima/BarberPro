"use server";
import { prisma } from "@/lib/prisma";

export async function getInfoSchedule({ userId }: { userId: string }) {
  try {
    if (!userId) {
      return {
        message: "Usuario não autenticado",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        subscriptions: true,
        services: {
          where: {
            status: true,
          },
        },
      },
    });

    if (!user) {
      return {
        message: "Usuario não encontrado",
      };
    }
    return { user };
  } catch (error) {}
}
