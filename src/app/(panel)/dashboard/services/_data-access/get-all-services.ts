"use server";

import { prisma } from "@/lib/prisma";
import { tr } from "zod/v4/locales";

export async function getAllServices({ userId }: { userId: string }) {
  if (!userId) {
    return {
      error: "Falha ao obter os serviços.",
    };
  }

  try {
    const service = await prisma.service.findMany({
      where: {
        userId: userId,
        status: true,
      },
    });

    return {
      data: service,
    };
  } catch (error) {
    return {
      error: "Falha ao obter os serviços.",
    };
  }
}
