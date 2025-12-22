"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres." })
    .max(500),
  price: z.number().min(1, { message: "O preço deve ser maior que zero." }),
  duration: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateService(
  formData: FormSchema & { serviceId: string }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Usuário não autenticado.",
    };
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session.user.id,
      },
      data: {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration < 30 ? 30 : formData.duration,
      },
    });
    revalidatePath("/dashboard/services");
    return {data: "Serviço editado com sucesso!" };
  } catch (error) {
    return {
      error: "Erro ao editar o serviço. Tente novamente mais tarde.",
    };
  }
}
