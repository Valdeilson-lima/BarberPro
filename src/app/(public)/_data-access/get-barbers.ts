"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBarbers() {
  try {
    const barbers = await prisma.user.findMany({});
    return barbers;
  } catch (error) {
    return [];
  }
}
