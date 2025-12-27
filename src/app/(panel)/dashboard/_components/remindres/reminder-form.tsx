"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const reminderSchema = z.object({
  description: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres"),
  
});


export type ReminderFormData = z.infer<typeof reminderSchema>;

export function useReminderForm() {
  return useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      description: "",
    },
  });
}