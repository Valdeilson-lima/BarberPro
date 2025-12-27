"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reminder } from "@/generated/prisma/client";
import { Car, Plus, Trash } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { deleteReminder } from "../../_actions/delete-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReminderContent } from "./reminder-content";
interface ReminderListProps {
  reminders: Reminder[];
}

export function ReminderList({ reminders }: ReminderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  async function handleDeleteReminder(reminderId: string) {
    const response = await deleteReminder({ reminderId });

    if (response.erro) {
      toast.error(response.erro);
      return;
    }

    toast.success("Lembrete deletado com sucesso.");
    router.refresh();
  }

  return (
    <div className="flex flex-col bg-barber-primary-light rounded-lg gap-3 border-barber-gold/20 border">
      <Card className="bg-barber-primary-light border-0 ">
        <CardHeader className=" border-b border-barber-gold/20 flex items-center justify-between">
          <CardTitle className="text-white text-lg font-semibold">
            Lembretes
          </CardTitle>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size={"lg"}
                className="p-0 w-8 h-8 rounded-full bg-barber-primary hover:bg-barber-gold/20 text-white hover:scale-105 transition-all hover:text-white cursor-pointer"
                title="Adicionar Lembrete"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl bg-barber-primary-light border-barber-gold/20 border rounded-lg [&>button]:text-white [&>button]:hover:text-barber-gold">
              <DialogHeader>
                <DialogTitle className="text-white text-lg font-semibold">
                  Adicionar Lembrete
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  Para adicionar lembretes, por favor utilize o aplicativo
                  móvel.
                </DialogDescription>
              </DialogHeader>

              <ReminderContent
                closeDialog={() => {
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          <ScrollArea className="h-100 lg:max-h-[calc(100vh-15rem)] w-full pr-0 flex-1">
            {reminders.length === 0 ? (
              <p className="text-white text-center bg-barber-primary/50 rounded-lg border border-barber-gold/20 p-3">
                Nenhum lembrete encontrado.
              </p>
            ) : (
              reminders.map((reminder) => (
                <article
                  key={reminder.id}
                  className="bg-barber-primary/50 rounded-lg border border-barber-gold/20 p-3 flex flex-wrap justify-between items-center py-2 mb-4"
                >
                  <p className="text-white flex-1 min-w-0 wrap-break-word">
                    {reminder.description}
                  </p>
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="p-0 w-8 h-8 rounded-full bg-barber-primary hover:bg-barber-gold/20 text-white hover:scale-105 transition-all hover:text-white cursor-pointer"
                    title="Excluir Lembrete"
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <Trash className="h-5 w-5 rotate-45 text-red-700" />
                  </Button>
                </article>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
