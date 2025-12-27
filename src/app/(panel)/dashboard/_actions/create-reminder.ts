"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";

const formSchema = z.object({
  description: z
    .string({ message: "Descrição do lembrete é obrigatória" })
    .min(1, "Descrição do lembrete é obrigatória"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createReminder(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      erro: "Usuário não autenticado.",
    };
  }
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      erro: schema.error.issues[0].message,
    };
  }

  try {
    await prisma.reminder.create({
      data: {
        description: formData.description,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: "Lembrete criado com sucesso.",
    };
  } catch (error) {
    return {
      erro: "Erro ao criar o lembrete.",
    };
  }
}
