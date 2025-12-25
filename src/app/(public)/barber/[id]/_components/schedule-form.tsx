"use client";
import { email, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export const appointmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z
    .string()
    .email({ message: "E-mail é obrigatório e deve ser válido" }),
  phone: z
    .string()
    .min(11, { message: "O telefone deve ter pelo menos 11 dígitos" }),
  date: z.date({ message: "Selecione uma data para o agendamento" }),
  serviceId: z.string().min(1, { message: "O serviço é obrigatório" }),
});
export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function UseAppointmentForm() {
  return useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: new Date(),
      serviceId: "",
    },
  });
}
