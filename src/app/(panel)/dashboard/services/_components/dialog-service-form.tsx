import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { de } from "zod/v4/locales";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  price: z.string().min(1, "O preço é obrigatório"),
  hours: z.string(),
  minuts: z.string(),
});

export interface UseDialogServiceFormProps {
  initialValues?: {
    name: string;
    description: string;
    price: string;
    hours: string;
    minuts: string;
  };
}

export type DialogServiceFormData = z.infer<typeof formSchema>;

export function useDialogServiceForm({
  initialValues,
}: UseDialogServiceFormProps) {
  return useForm<DialogServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      price: "",
      hours: "",
      minuts: "",
    },
  });
}
