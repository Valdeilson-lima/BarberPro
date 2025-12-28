"use client";

import { Prisma } from "@/generated/prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatValue } from "@/utils/formatValue";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  DollarSign,
  FileText,
} from "lucide-react";

type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: { service: true };
}>;

interface AppointmentDetailDialogProps {
  appointment: AppointmentWithService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AppointmentDetailDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailDialogProps) {
  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-barber-primary-light border-barber-gold/20 text-white md:min-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-barber-gold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Detalhes do Agendamento
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Informações completas sobre o agendamento selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-barber-gold border-b border-barber-gold/20 pb-2">
              Cliente
            </h3>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10 hover:border-barber-gold/20 transition-colors">
                <User className="w-5 h-5 text-barber-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Nome</p>
                  <p className="font-semibold truncate">{appointment.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10 hover:border-barber-gold/20 transition-colors">
                <Mail className="w-5 h-5 text-barber-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">E-mail</p>
                  <p className="font-semibold text-sm truncate">
                    {appointment.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10 hover:border-barber-gold/20 transition-colors">
                <Phone className="w-5 h-5 text-barber-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Telefone</p>
                  <p className="font-semibold">{appointment.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Serviço */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-barber-gold border-b border-barber-gold/20 pb-2">
              Serviço
            </h3>

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10">
                <FileText className="w-5 h-5 text-barber-gold shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Nome do Serviço</p>
                  <p className="font-semibold">{appointment.service.name}</p>
                  {appointment.service.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {appointment.service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10">
                  <Clock className="w-5 h-5 text-barber-gold shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Duração</p>
                    <p className="font-semibold">
                      {appointment.service.duration} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10">
                  <DollarSign className="w-5 h-5 text-barber-gold shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Valor</p>
                    <p className="font-semibold">
                      {formatValue(appointment.service.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-barber-gold border-b border-barber-gold/20 pb-2">
              Agendamento
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10">
                <Calendar className="w-5 h-5 text-barber-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Data</p>
                  <p className="font-semibold">
                    {format(
                      new Date(appointment.appointmentDate),
                      "dd/MM/yyyy",
                      {
                        locale: ptBR,
                      }
                    )}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {format(new Date(appointment.appointmentDate), "EEEE", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-barber-primary border border-barber-gold/10">
                <Clock className="w-5 h-5 text-barber-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Horário</p>
                  <p className="font-semibold text-lg">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
