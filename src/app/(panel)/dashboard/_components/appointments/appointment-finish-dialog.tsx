"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethod } from "@/generated/prisma/enums";

type Service = {
  id: string;
  name: string;
  price: number;
};

type Appointment = {
  id: string;

  serviceId: string;
};

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Banknote,
  CheckCircle,
  CreditCard,
  Loader2,
  Smartphone,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cancelAppointment } from "../../_actions/cancel-appointment";
import { completeAppointment } from "../../_actions/complete-appointment";

type AppointmentWithService = Appointment & { service: Service };

interface AppointmentFinishDialogProps {
  appointment: AppointmentWithService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Schemas de validação
const completeSchema = z.object({
  paymentMethod: z.nativeEnum(
    PaymentMethod,
    "Selecione uma forma de pagamento"
  ),
  notes: z.string().max(500, "Máximo 500 caracteres").optional(),
});

const cancelSchema = z.object({
  reason: z
    .string()
    .min(5, "Motivo deve ter no mínimo 5 caracteres")
    .max(500, "Máximo 500 caracteres"),
});

type CompleteFormData = z.infer<typeof completeSchema>;
type CancelFormData = z.infer<typeof cancelSchema>;

// Configuração dos métodos de pagamento
const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: "Dinheiro", icon: Banknote },
  {
    value: PaymentMethod.CREDIT_CARD,
    label: "Cartão de Crédito",
    icon: CreditCard,
  },
  {
    value: PaymentMethod.DEBIT_CARD,
    label: "Cartão de Débito",
    icon: CreditCard,
  },
  { value: PaymentMethod.PIX, label: "PIX", icon: Smartphone },
] as const;

export function AppointmentFinishDialog({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: AppointmentFinishDialogProps) {
  const [action, setAction] = useState<"complete" | "cancel" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form de conclusão
  const completeForm = useForm<CompleteFormData>({
    resolver: zodResolver(completeSchema),
  });

  // Form de cancelamento
  const cancelForm = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
  });

  // Reset ao fechar
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAction(null);
      completeForm.reset();
      cancelForm.reset();
    }
    onOpenChange(newOpen);
  };

  // Submissão de conclusão
  const handleComplete = async (data: CompleteFormData) => {
    if (!appointment) return;

    setIsSubmitting(true);
    try {
      const result = await completeAppointment({
        appointmentId: appointment.id,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      });

      if (result.success) {
        toast.success(result.message);
        handleOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao concluir agendamento");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submissão de cancelamento
  const handleCancel = async (data: CancelFormData) => {
    if (!appointment) return;

    setIsSubmitting(true);
    try {
      const result = await cancelAppointment({
        appointmentId: appointment.id,
        reason: data.reason,
      });

      if (result.success) {
        toast.success(result.message);
        handleOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao cancelar agendamento");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-barber-primary-light border-barber-gold/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-barber-gold">
            Finalizar Agendamento
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {action
              ? action === "complete"
                ? "Informe a forma de pagamento para concluir o serviço"
                : "Informe o motivo do cancelamento"
              : "Escolha uma ação para finalizar este agendamento"}
          </DialogDescription>
        </DialogHeader>

        {/* Escolha inicial */}
        {!action && (
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => setAction("complete")}
              size="lg"
              className="h-24 flex-col gap-2 bg-barber-gold hover:bg-barber-gold-light text-black transition-colors cursor-pointer"
            >
              <CheckCircle className="h-8 w-8" />
              <span className="text-lg font-semibold">Concluir Serviço</span>
            </Button>

            <Button
              onClick={() => setAction("cancel")}
              size="lg"
              className="h-24 flex-col gap-2 bg-barber-red hover:bg-barber-red-light text-white transition-colors cursor-pointer"
            >
              <XCircle className="h-8 w-8" />
              <span className="text-lg font-semibold">
                Cancelar Agendamento
              </span>
            </Button>
          </div>
        )}

        {/* Form de conclusão */}
        {action === "complete" && (
          <form
            onSubmit={completeForm.handleSubmit(handleComplete)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-white">
                Forma de Pagamento *
              </Label>
              <Controller
                control={completeForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="paymentMethod"
                      className="bg-barber-primary border-barber-gold/20 text-white w-full"
                    >
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-barber-primary border-barber-gold/20">
                      {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-white hover:bg-barber-primary-light focus:bg-barber-primary-light"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-barber-gold" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {completeForm.formState.errors.paymentMethod && (
                <p className="text-sm text-red-400">
                  {completeForm.formState.errors.paymentMethod.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">
                Observações (opcional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Ex: Cliente solicitou corte específico..."
                className="min-h-25 bg-barber-primary border-barber-gold/20 text-white placeholder:text-gray-500"
                {...completeForm.register("notes")}
              />
              {completeForm.formState.errors.notes && (
                <p className="text-sm text-red-400">
                  {completeForm.formState.errors.notes.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <div className="flex w-full gap-2 sm:gap-0 md:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAction(null)}
                  disabled={isSubmitting}
                  className="bg-barber-primary border-barber-gold/30 text-white hover:bg-barber-gold/10 hover:text-white flex-1 cursor-pointer duration-300 transition-all flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-barber-gold hover:bg-barber-gold-light text-black flex-1 cursor-pointer duration-300 transition-all flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Concluindo...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Concluir Serviço
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}

        {/* Form de cancelamento */}
        {action === "cancel" && (
          <form
            onSubmit={cancelForm.handleSubmit(handleCancel)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-white">
                Motivo do Cancelamento *
              </Label>
              <Textarea
                id="reason"
                placeholder="Ex: Cliente não compareceu, remarcado para outra data..."
                className="min-h-37.5 bg-barber-primary border-barber-gold/20 text-white placeholder:text-gray-500"
                {...cancelForm.register("reason")}
              />
              {cancelForm.formState.errors.reason && (
                <p className="text-sm text-red-400">
                  {cancelForm.formState.errors.reason.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <div className="flex w-full gap-2 sm:gap-0 md:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAction(null)}
                  disabled={isSubmitting}
                  className="bg-barber-primary border-barber-gold/30 text-white hover:bg-barber-gold/10 hover:text-white flex-1 cursor-pointer duration-300 transition-all flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-barber-red hover:bg-barber-red-light text-white flex-1 cursor-pointer duration-300 transition-all flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Cancelar Agendamento
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
