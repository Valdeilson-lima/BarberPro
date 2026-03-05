"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import img from "../../../../../../public/hero-image.jpg";
import { CalendarDays, Clock3, MapPin, Scissors } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { UseAppointmentForm, AppointmentFormData } from "./schedule-form";
import { formatPhone } from "@/utils/formatPhone";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimerPicker } from "./date-picker";
import { ScheduleTimesList } from "./schedule-times-list";
import { createNewAppointment } from "../_actions/create-appointments";

type UserWhithhServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    services: true;
    subscriptions: true;
  };
}>;

interface ScheduleContentProps {
  barber: UserWhithhServiceAndSubscription;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ barber }: ScheduleContentProps) {
  const form = UseAppointmentForm();

  const selectedDate = form.watch("date");
  const selectedServiceId = form.watch("serviceId");
  const selectedService = barber.services.find(
    (service) => service.id === selectedServiceId,
  );

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true);
      try {
        const dateString = formatDateToLocalString(date);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const query = new URLSearchParams({
          barberId: barber.id,
          date: dateString,
        }).toString();

        const url = baseUrl
          ? `${baseUrl}/api/schedule/get-appointments?${query}`
          : `/api/schedule/get-appointments?${query}`;

        const response = await fetch(url, { cache: "no-store" });
        const json = await response.json();
        setLoadingSlots(false);
        return json.blockedTimes || [];
      } catch (error) {
        setLoadingSlots(false);
        return [];
      }
    },
    [barber.id],
  );

  useEffect(() => {
    if (selectedDate) {
      const date = selectedDate
        ? new Date(selectedDate + "T00:00:00")
        : new Date();
      fetchBlockedTimes(date).then((blocked) => {
        setBlockedTimes(blocked);

        const times = barber.times || [];

        const finalSlots = times.map((time) => ({
          time,
          available: !blocked.includes(time),
        }));

        setAvailableTimeSlots(finalSlots);

        const stillAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available,
        );

        if (!stillAvailable) {
          setSelectedTime("");
        }
      });
    }
  }, [selectedDate, barber.times, fetchBlockedTimes, selectedTime]);

  async function handleRegister(formData: AppointmentFormData) {
    if (!selectedTime) {
      toast.error("Por favor, selecione um horário para o agendamento.");
      return;
    }

    const date = new Date(formData.date + "T00:00:00");
    const currentBlocked = await fetchBlockedTimes(date);
    if (currentBlocked.includes(selectedTime)) {
      toast.error(
        "Este horário acabou de ser reservado. Por favor, escolha outro.",
      );
      setBlockedTimes(currentBlocked);
      setSelectedTime("");
      return;
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: selectedTime,
      serviceId: formData.serviceId,
      userId: barber.id,
    });

    if (response.error) {
      toast.error(response.error);

      const blocked = await fetchBlockedTimes(date);
      setBlockedTimes(blocked);
      setSelectedTime("");
    } else {
      toast.success("Agendamento criado com sucesso!");

      setSelectedTime("");
      setAvailableTimeSlots([]);
      setBlockedTimes([]);
      form.reset({
        name: "",
        email: "",
        phone: "",
        date: "",
        serviceId: "",
      });
    }
  }

  useEffect(() => {
    if (selectedDate && selectedServiceId) {
      const interval = setInterval(() => {
        const date = new Date(selectedDate + "T00:00:00");
        fetchBlockedTimes(date).then((blocked) => {
          setBlockedTimes(blocked);

          const times = barber.times || [];
          const finalSlots = times.map((time) => ({
            time,
            available: !blocked.includes(time),
          }));

          setAvailableTimeSlots(finalSlots);

          if (selectedTime && blocked.includes(selectedTime)) {
            setSelectedTime("");
            toast.warning("O horário selecionado não está mais disponível.");
          }
        });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [
    selectedDate,
    selectedServiceId,
    barber.times,
    fetchBlockedTimes,
    selectedTime,
  ]);

  return (
    <div className="min-h-screen bg-barber-primary pb-10 text-white">
      <section className="relative overflow-hidden border-b border-barber-gold/15 bg-linear-to-br from-barber-primary to-barber-primary-light pb-10 pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.14),transparent_44%)]" />
        <div className="container relative mx-auto px-4">
          <article className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-barber-gold/50 shadow-lg shadow-black/40 md:h-36 md:w-36">
              <Image
                src={barber.image || img}
                alt="Barber Shop"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-barber-gold/30 bg-barber-primary-light/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-barber-gold">
              <Scissors className="h-3.5 w-3.5" />
              Agendamento online
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
              {barber.name}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/85 md:text-base">
              <MapPin className="h-4 w-4 text-barber-gold" />
              <span>{barber.address || "Endereço não disponível"}</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                  barber.status
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}
              >
                {barber.status ? "Atendendo agora" : "Indisponível no momento"}
              </span>
              <span className="inline-flex rounded-full border border-barber-gold/30 bg-barber-primary-light/60 px-3 py-1 text-xs font-semibold text-white/90">
                {barber.services.length} serviço(s) disponível(is)
              </span>
            </div>
          </article>
        </div>
      </section>

      <Form {...form}>
        <form
          className="container mx-auto mt-8 max-w-4xl space-y-7 rounded-2xl border border-barber-gold/20 bg-linear-to-b from-barber-primary-light to-barber-primary p-6 shadow-xl shadow-black/25 md:p-8"
          onSubmit={form.handleSubmit(handleRegister)}
        >
          <div className="space-y-2 border-b border-barber-gold/15 pb-5">
            <h2 className="text-2xl font-bold tracking-tight">Finalizar agendamento</h2>
            <p className="text-sm text-white/75">
              Preencha os dados abaixo, escolha o serviço e selecione o melhor horário para você.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Label className="text-sm font-semibold text-white">Nome Completo</Label>
                  <FormControl>
                    <Input
                      placeholder="Seu nome completo"
                      {...field}
                      className="border-barber-gold-dark bg-barber-primary-dark/50 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Label className="text-sm font-semibold text-white">E-mail</Label>
                  <FormControl>
                    <Input
                      placeholder="Seu e-mail"
                      type="email"
                      autoComplete="email"
                      {...field}
                      className="border-barber-gold-dark bg-barber-primary-dark/50 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Label className="text-sm font-semibold text-white">Telefone</Label>
                  <FormControl>
                    <Input
                      placeholder="Seu telefone"
                      {...field}
                      className="border-barber-gold-dark bg-barber-primary-dark/50 text-white placeholder:text-white/50"
                      onChange={(e) => {
                        const formattedPhone = formatPhone(e.target.value);
                        field.onChange(formattedPhone);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-semibold text-white">
                    Clique e selecione a data do agendamento
                  </Label>
                  <FormControl>
                    <DateTimerPicker
                      initialDate={
                        field.value ? new Date(field.value + "T00:00:00") : new Date()
                      }
                      minDate={new Date()}
                      className="barber-datepicker-input"
                      onChange={(date) => {
                        if (date) {
                          const dateString = formatDateToLocalString(date);
                          field.onChange(dateString);
                          setSelectedTime("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <Label className="block text-sm font-semibold text-white">
                  Selecione o serviço
                </Label>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedTime("");
                    }}
                  >
                    <SelectTrigger className="w-full border-2 border-barber-gold-dark bg-barber-primary-light text-white transition-colors hover:border-barber-gold">
                      <SelectValue placeholder="Escolha seu serviço" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-barber-gold-dark bg-barber-primary">
                      <SelectGroup>
                        <SelectLabel className="py-2 text-base font-bold text-barber-gold">
                          Nossos serviços
                        </SelectLabel>
                        {barber.services.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id}
                            className="cursor-pointer px-4 py-3 text-white hover:bg-barber-gold/20 focus:bg-barber-gold/20"
                          >
                            <div className="flex w-full items-center justify-between gap-3">
                              <span className="font-medium text-white">{service.name}</span>
                              <div className="flex items-center gap-3 whitespace-nowrap text-sm">
                                <span className="text-white/60">|</span>
                                <span className="font-bold text-barber-gold">
                                  R$ {(service.price / 100).toFixed(2).replace(".", ",")}
                                </span>

                                <span className="text-gray-400"> |</span>
                                <span className="text-white">
                                  {Math.floor(service.duration / 60)}h
                                  {service.duration % 60 > 0 && ` ${service.duration % 60}min`}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedServiceId && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label className="block text-sm font-semibold text-white">
                  Horários disponíveis
                </Label>
                {selectedService && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-barber-gold/25 bg-barber-primary-light/70 px-3 py-1 text-xs text-white/90">
                    <Clock3 className="h-3.5 w-3.5 text-barber-gold" />
                    Duração: {Math.floor(selectedService.duration / 60)}h
                    {selectedService.duration % 60 > 0 && ` ${selectedService.duration % 60}min`}
                  </span>
                )}
              </div>
              <div className="rounded-xl border border-barber-gold/20 bg-barber-primary p-4">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-barber-gold/20 bg-barber-primary-light/60 px-3 py-1 text-xs text-white/80">
                  <CalendarDays className="h-3.5 w-3.5 text-barber-gold" />
                  Slots atualizados automaticamente
                </div>
                {loadingSlots ? (
                  <div className="flex justify-center py-5">
                    <Loading size="md" variant="dots" text="Carregando horários..." />
                  </div>
                ) : availableTimeSlots.length === 0 ? (
                  <p className="py-2 text-sm text-white/70">
                    Nenhum horário disponível para esta data.
                  </p>
                ) : (
                  <ScheduleTimesList
                    onSelectTime={(time) => setSelectedTime(time)}
                    barberTimes={barber.times}
                    blockedTimes={blockedTimes}
                    availableTimeSlots={availableTimeSlots}
                    selectedTime={selectedTime}
                    selectedDate={
                      selectedDate ? new Date(selectedDate + "T00:00:00") : new Date()
                    }
                    requiredSlots={selectedService ? Math.ceil(selectedService.duration / 30) : 1}
                  />
                )}
              </div>
            </div>
          )}

          {barber.status ? (
            <Button
              type="submit"
              className="h-12 w-full bg-barber-gold text-base font-semibold text-barber-primary transition-all duration-300 hover:bg-barber-gold-light hover:shadow-lg hover:shadow-barber-gold/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Agendar serviço
            </Button>
          ) : (
            <p className="flex w-full justify-center">
              <strong className="rounded-md border border-barber-gold/20 bg-barber-gold-light/10 p-4 text-sm font-semibold text-white">
                Barbeiro indisponível para agendamentos no momento.
              </strong>
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
