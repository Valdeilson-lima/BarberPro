"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Prisma } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye } from "lucide-react";
import { AppointmentDetailDialog } from "./appointment-detail-dialog";
import { AppointmentFinishDialog } from "./appointment-finish-dialog";
import { ButtonPickerAppointmentDate } from "../appointments/button-date";

type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: { service: true };
}>;

interface AppointmentsListProps {
  times: string[];
}

export function AppointmentsList({ times }: AppointmentsListProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithService | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointmentToFinish, setSelectedAppointmentToFinish] =
    useState<AppointmentWithService | null>(null);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

  const handleOpenDetails = (appointment: AppointmentWithService) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleOpenFinish = (appointment: AppointmentWithService) => {
    setSelectedAppointmentToFinish(appointment);
    setIsFinishDialogOpen(true);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["barber-appointments"] });
    refetch();
    router.refresh();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["barber-appointments", date],
    queryFn: async () => {
      let activeDate = date;

      if (!activeDate) {
        const today = new Date();
        activeDate = format(today, "yyyy-MM-dd");
      }

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/barber/appointments?date=${activeDate}`;
      const response = await fetch(url);
      const json = (await response.json()) as AppointmentWithService[];

      if (!response.ok) {
        return [];
      }
      return Array.isArray(json) ? json : [json];
    },
    staleTime: 20000,
    refetchInterval: 30000,
  });

  const occupantMap: Record<string, AppointmentWithService> = {};

  if (data && data.length > 0) {
    for (const appointment of data) {
      const requiredSlots = Math.ceil(appointment.service.duration / 30);

      const startIndex = times.indexOf(appointment.time);
      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            const slotTime = times[slotIndex];
            occupantMap[slotTime] = appointment;
          }
        }
      }
    }
  }

  return (
    <Card className="bg-barber-primary-light border border-barber-gold/20 ">
      <CardHeader className="border-b border-barber-gold/20 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white font-semibold text-xl md:text-2xl">
          Agenda
        </CardTitle>
        <ButtonPickerAppointmentDate />
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
          {isLoading ? (
            <div className="text-white text-center bg-barber-primary p-2 border border-barber-gold/20 rounded-md">
              Carregando Agendamentos...
            </div>
          ) : (
            <div className="space-y-4">
              {times.map((slot) => {
                const occupant = occupantMap[slot];

                return occupant ? (
                  <Card
                    key={slot}
                    className="bg-barber-secondary-light border border-barber-gold/20"
                  >
                    <CardHeader>
                      <CardTitle className="text-white font-semibold text-sm lg:text-base">
                        {slot} - {occupant.service.name}
                      </CardTitle>
                      <CardDescription className="text-white">
                        {occupant.name} - {occupant.phone}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <span className="text-barber-gold">
                        Duração: {occupant.service.duration} min
                      </span>

                      <div className="flex flex-row justify-between md:justify-end items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                        <Button
                          variant="secondary"
                          className="w-auto bg-barber-gold text-barber-primary hover:bg-barber-gold/80 hover:text-barber-primary/80 cursor-pointer duration-300 transition-all flex-1"
                          onClick={() => handleOpenDetails(occupant)}
                        >
                          <Eye className="w-4 h-4" />
                          Detalhes
                        </Button>

                        <Button
                          variant="outline"
                          className=" w-auto bg-barber-primary text-barber-gold border-barber-gold hover:bg-barber-primary/80 hover:border-barber-gold/80 hover:text-barber-gold/60 cursor-pointer duration-300 transition-all flex-1"
                          onClick={() => handleOpenFinish(occupant)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Finalizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    key={slot}
                    className="bg-barber-secondary-light border border-barber-gold/20"
                  >
                    <CardContent>
                      <span className="text-white font-semibold text-sm lg:text-base">
                        {slot} - Disponível
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />

      <AppointmentFinishDialog
        appointment={selectedAppointmentToFinish}
        open={isFinishDialogOpen}
        onOpenChange={setIsFinishDialogOpen}
        onSuccess={handleSuccess}
      />
    </Card>
  );
}
