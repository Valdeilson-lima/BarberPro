"use server";

import { prisma } from "@/lib/prisma";

export async function getBarbers() {
  try {
    const barbers = await prisma.user.findMany({
      where: {
        status: true,
      },
      include: {
        subscriptions: true,
      },
    });
    return barbers;
  } catch (error) {
    return [];
  }
}
