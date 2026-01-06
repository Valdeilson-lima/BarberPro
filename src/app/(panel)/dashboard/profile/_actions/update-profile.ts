"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ message: "O nome é obrigatório" })
    .min(3, "O nome deve ter no mínimo 3 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z
    .string({ message: "O fuso horário é obrigatório" })
    .min(3, { message: "O fuso horário é obrigatório" }),
  times: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateProfile(formData: FormSchema) {

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    throw new Error("Dados do formulário inválidos");
  }
  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        status: formData.status,
        timeZone: formData.timeZone,
        times: formData.times || [],
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/"); 

    return {
      data: "Perfil da barbearia atualizado com sucesso",
    }
    
  } catch (error) {
   return {
      error: "Erro ao atualizar o perfil",
    };
    
  }

}
