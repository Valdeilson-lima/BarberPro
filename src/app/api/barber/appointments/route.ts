import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(request) {
  if (!request.auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const dateString = searchParams.get("date") as string;

  const barberId = request.auth?.user?.id;

  if (!dateString) {
    return NextResponse.json({ error: "Data é obrigatória" }, { status: 400 });
  }

  if (!barberId) {
    return NextResponse.json(
      { error: "Barbeiro não autenticado" },
      { status: 401 }
    );
  }

  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const appointments = await prisma.appointment.findFirst({
      where: {
        userId: barberId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
});
