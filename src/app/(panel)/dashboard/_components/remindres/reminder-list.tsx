"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Reminder } from "@/generated/prisma/client";
import { Plus, Trash } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ReminderListProps {
  reminders: Reminder[];
}

export function ReminderList({ reminders }: ReminderListProps) {
  console.log(reminders);
  return (
    <div className="flex flex-col bg-barber-primary-light rounded-lg gap-3 border-barber-gold/20 border">
      <Card className="bg-barber-primary-light border-0 ">
        <CardHeader className=" border-b border-barber-gold/20 flex items-center justify-between">
          <h3 className="text-white text-lg font-medium">Lembretes</h3>
          <Button
            variant="ghost"
            size={"lg"}
            className="p-0 w-8 h-8 rounded-full bg-barber-primary hover:bg-barber-gold/20 text-white hover:scale-105 transition-all hover:text-white cursor-pointer"
            title="Adicionar Lembrete"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {reminders.length === 0 ? (
            <p className="text-white text-center bg-barber-primary/50 rounded-lg border border-barber-gold/20 p-3">
              Nenhum lembrete encontrado.
            </p>
          ) : (
            reminders.map((reminder) => (
              <article
                key={reminder.id}
                className="bg-barber-primary/50 rounded-lg border border-barber-gold/20 p-3 flex flex-wrap justify-between items-center py-2"
              >
                <p className="text-white">{reminder.description}</p>
                <Button
                  variant="ghost"
                  size={"sm"}
                  className="p-0 w-8 h-8 rounded-full bg-barber-primary hover:bg-barber-gold/20 text-white hover:scale-105 transition-all hover:text-white cursor-pointer"
                  title="Excluir Lembrete"
                >
                  <Trash className="h-5 w-5 rotate-45 text-red-700" />
                </Button>
              </article>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
