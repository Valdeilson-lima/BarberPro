"use server";

import { prisma } from "@/lib/prisma";

interface UserInfo {
  userId: string;
}

export async function getUserData({ userId }: UserInfo) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        subscriptions: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Could not fetch user data");
  }
}
