"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// Define PaymentMethod enum if not present in @prisma/client
const PaymentMethod = {
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  PIX: "PIX",
} as const;
type PaymentMethod = keyof typeof PaymentMethod;
import { revalidatePath } from "next/cache";
import { z } from "zod";

const completeAppointmentSchema = z.object({
  appointmentId: z.string().cuid("ID de agendamento inválido"),
  paymentMethod: z
    .nativeEnum(PaymentMethod)
    .refine((val) => Object.values(PaymentMethod).includes(val), {
      message: "Forma de pagamento inválida",
    }),
  notes: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type CompleteAppointmentInput = z.infer<typeof completeAppointmentSchema>;

export async function completeAppointment(data: CompleteAppointmentInput) {
  try {
    // Valida sessão do usuário
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Validação do schema
    const validatedData = completeAppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.issues[0]?.message || "Dados inválidos",
      };
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
        message: "Sem permissão para concluir este agendamento",
      };
    }

    // Verifica se já foi cancelado
    if (appointment.status === false) {
      return {
        success: false,
        message: "Não é possível concluir um agendamento finalizado",
      };
    }

    // Atualiza o agendamento para COMPLETED
    await prisma.appointment.update({
      where: { id: validatedData.data.appointmentId },
      data: {
        status: false,
        paymentMethod: validatedData.data.paymentMethod,
        completionNotes: validatedData.data.notes,
        completedAt: new Date(),
      },
    });

    // Revalida o dashboard para atualizar UI
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Serviço de ${appointment.name} concluído com sucesso!`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    console.error("Erro ao concluir agendamento:", error);
    return {
      success: false,
      message: "Erro ao concluir agendamento. Tente novamente.",
    };
  }
}
