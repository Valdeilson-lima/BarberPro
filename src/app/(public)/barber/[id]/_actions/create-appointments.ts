"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z
    .string()
    .email({ message: "E-mail é obrigatório e deve ser válido" }),
  phone: z
    .string()
    .min(11, { message: "O telefone deve ter pelo menos 11 dígitos" }),
  date: z.string({ message: "Data do agendamento é obrigatória" }),
  time: z.string({ message: "Hora do agendamento é obrigatória" }),
  serviceId: z.string().min(1, { message: "O serviço é obrigatório" }),
  userId: z.string().min(1, { message: "O barbeiro é obrigatório" }),
});

export type CreateAppointmentFormData = z.infer<typeof formSchema>;

export async function createNewAppointment(
  formData: CreateAppointmentFormData
) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    const selectedDate = new Date(formData.date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
   

    const newAppointment = await prisma.appointment.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointmentDate: appointmentDate,
        time: formData.time,
        serviceId: formData.serviceId,
        userId: formData.userId,
      },
    });

    return { data: newAppointment };
  } catch (error) {
    return {
      error: "Erro ao criar o agendamento. Por favor, tente novamente.",
    };
  }
}
