import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UserProfileProps {
  name: string | null;
  address?: string | null;
  phone?: string | null;
  status: boolean;
  timeZone: string | null;
}

const profileFormSchema = z.object({
  name: z.string({message: "O nome é obrigatório"}).min(3, "O nome deve ter no mínimo 3 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string({message: "O fuso horário é obrigatório"}).min(3, { message: "O fuso horário é obrigatório" }),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export function useProfileForm({
  name,
  address,
  phone,
  status,
  timeZone,
}: UserProfileProps) {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: name || "",
            address: address || "",
            phone: phone || "",
            status: status ? "active" : "inactive",
            timeZone: timeZone || "",
        },
    });
}