import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const barberId = searchParams.get("barberId");
  const dateParam = searchParams.get("date");

  if (!barberId || barberId === null || !dateParam || dateParam === null) {
    return NextResponse.json(
      { error: "Nenhum agendamento encontrado." },
      { status: 400 }
    );
  }

  try {
    const [year, month, day] = dateParam.split("-").map(Number);

    const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const user = await prisma.user.findFirst({
      where: {
        id: barberId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Barbeiro não encontrado." },
        { status: 404 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: barberId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: true,
      },
      include: { service: true },
    });

    const blockedSlots = new Set<string>();

    for (const apt of appointments) {
      const requireSlots = Math.ceil(apt.service.duration / 30);
      const startIndex = user.times.indexOf(apt.time);

      if (startIndex !== -1) {
        for (let i = 0; i < requireSlots; i++) {
          const blockedSlot = user.times[startIndex + i];
          if (blockedSlot) {
            blockedSlots.add(blockedSlot);
          }
        }
      }
    }

    const blockedTimes = Array.from(blockedSlots);

    return NextResponse.json({
      blockedTimes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos." },
      { status: 500 }
    );
  }
}
