"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const cancelAppointmentSchema = z.object({
  appointmentId: z.string().cuid("ID de agendamento inválido"),
  reason: z
    .string()
    .min(5, "Motivo deve ter no mínimo 5 caracteres")
    .max(500, "Máximo 500 caracteres"),
});

type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;

export async function cancelAppointment(data: CancelAppointmentInput) {
  try {
    // Valida sessão do usuário
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Validação do schema
    const validatedData = cancelAppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, message: validatedData.error.issues[0].message };
    }

    // Busca o agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: validatedData.data.appointmentId },
      select: {
        userId: true,
        status: true,
        name: true,
      },
    });

    if (!appointment) {
      return { success: false, message: "Agendamento não encontrado" };
    }

    // Verifica se o agendamento pertence ao barbeiro logado
    if (appointment.userId !== session.user.id) {
      return {
        success: false,
        message: "Sem permissão para cancelar este agendamento",
      };
    }

    // Verifica se já foi cancelado
    if (appointment.status === false) {
      return {
        success: false,
        message: "Este agendamento já foi finalizado",
      };
    }


    // Atualiza o agendamento para CANCELLED
    await prisma.appointment.update({
      where: { id: validatedData.data.appointmentId },
      data: {
        status: false,
        cancellationReason: validatedData.data.reason,
      },
    });
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Agendamento de ${appointment.name} cancelado com sucesso!`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    console.error("Erro ao cancelar agendamento:", error);
    return {
      success: false,
      message: "Erro ao cancelar agendamento. Tente novamente.",
    };
  }
}
