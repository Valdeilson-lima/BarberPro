"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reminder } from "@/generated/prisma/client";
import { Bell, NotebookPen, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteReminder } from "../../_actions/delete-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

  function openDialog() {
    setIsDialogOpen(true);
  }

  return (
    <div className="flex flex-col bg-barber-primary-light rounded-lg gap-3 border-barber-gold/20 border">
      <Card className="bg-barber-primary-light border-0">
        <CardHeader className="border-b border-barber-gold/20 gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-white font-semibold text-xl md:text-2xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-barber-gold" />
                Lembretes
              </CardTitle>
              <CardDescription className="text-gray-300">
                Registre recados importantes para não perder tarefas do dia.
              </CardDescription>
            </div>
            <div className="rounded-full border border-barber-gold/25 bg-barber-primary/70 px-3 py-1 text-xs text-white">
              {reminders.length} ativo(s)
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="w-full bg-barber-gold-dark hover:bg-barber-gold-light text-white cursor-pointer"
                title="Adicionar Lembrete"
              >
                <Plus className="h-4 w-4" />
                Novo lembrete
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
              <div className="rounded-lg border border-dashed border-barber-gold/30 bg-barber-primary/40 p-5 text-center">
                <NotebookPen className="h-7 w-7 text-barber-gold mx-auto mb-2" />
                <p className="text-white font-semibold">Nenhum lembrete encontrado.</p>
                <p className="text-gray-300 text-sm mt-1">
                  Adicione recados rápidos para organizar sua rotina.
                </p>
                <Button
                  variant="secondary"
                  className="mt-3 bg-barber-gold-dark hover:bg-barber-gold-light text-white"
                  onClick={openDialog}
                >
                  <Plus className="h-4 w-4" />
                  Criar lembrete
                </Button>
              </div>
            ) : (
              reminders.map((reminder) => (
                <article
                  key={reminder.id}
                  className="bg-barber-primary/50 rounded-lg border border-barber-gold/20 p-3 mb-3 gap-3 flex items-center justify-between hover:border-barber-gold/45 transition-colors"
                >
                  <p className="text-white text-sm md:text-base flex-1 min-w-0 wrap-anywhere whitespace-pre-line">
                    {reminder.description}
                  </p>
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="p-0 w-8 h-8 rounded-full bg-barber-primary hover:bg-barber-gold/20 text-white hover:scale-105 transition-all hover:text-white cursor-pointer shrink-0"
                    title="Excluir Lembrete"
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
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
