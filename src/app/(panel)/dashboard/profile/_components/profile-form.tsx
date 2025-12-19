import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(3, { message: "O fuso horário é obrigatório" }),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export function useProfileForm() {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "",
            address: "",
            phone: "",
            status: "active",
            timeZone: "",
        },
    });
}