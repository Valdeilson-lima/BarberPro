"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { canPermission } from "@/utils/permissions/canPermission";

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

export async function createNewService(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Usuário não autenticado.",
    };
  }

  const permission = await canPermission({ type: "service" });
  if (!permission.hasPermision) {
    return {
      error: "Assine um plano para começar.",
    };
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    const newService = await prisma.service.create({
      data: {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        userId: session.user.id,
      },
    });
    revalidatePath("/dashboard/services");
    return { service: newService };
  } catch (error) {
    return {
      error: "Erro ao criar o serviço. Tente novamente mais tarde.",
    };
  }
}
