"use client";

import { useReminderForm } from "./reminder-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { ReminderFormData } from "./reminder-form";
import { createReminder } from "../../_actions/create-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReminderContentProps {
  closeDialog: () => void;
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {

    const form = useReminderForm();
    const router = useRouter();

    async function onSubmit(formData: ReminderFormData) {
        const response = await createReminder(formData);

        if (response.erro) {
            toast.error(response.erro);
            return;
        }

        toast.success("Lembrete criado com sucesso.");
        form.reset();
        router.refresh();
        closeDialog();

    }


  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-semibold">Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição do lembrete" {...field} className="border-barber-gold/40 resize-none max-h-60 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-barber-gold hover:bg-barber-gold-light cursor-pointer transition-all duration-300 w-full" disabled={!form.formState.isValid}>Cadastrar Lembrete</Button>
        </form>
      </Form>
    </div>
  );
}
