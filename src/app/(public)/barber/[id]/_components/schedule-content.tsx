"use client";

import { useState, useCallback, useEffect, use } from "react";
import Image from "next/image";
import img from "../../../../../../public/hero-image.jpg";
import { MapPin } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { UseAppointmentForm, AppointmentFormData } from "./schedule-form";
import { formatPhone } from "@/utils/formatPhone";
import { toast } from "sonner";

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

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  // ✅ Função auxiliar para formatar data sem conversão de timezone
  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Funcção que busca os horarios bloqueados na API
  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true);
      try {
        // ✅ Usar formatação local em vez de toISOString
        const dateString = formatDateToLocalString(date);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        const url = `${baseUrl}/api/schedule/get-appointments?barberId=${barber.id}&date=${dateString}`;

        const response = await fetch(url);

        const json = await response.json();
        setLoadingSlots(false);
        return json.blockedTimes || [];
      } catch (error) {
        setLoadingSlots(false);
        return [];
      }
    },
    [barber.id]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked);

        const times = barber.times || [];

        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time),
        }));

        setAvailableTimeSlots(finalSlots);

        const stillAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
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

    // ✅ Revalidar disponibilidade antes de enviar
    const currentBlocked = await fetchBlockedTimes(formData.date);
    if (currentBlocked.includes(selectedTime)) {
      toast.error(
        "Este horário acabou de ser reservado. Por favor, escolha outro."
      );
      setBlockedTimes(currentBlocked);
      setSelectedTime("");
      return;
    }

    // ✅ Enviar data no formato local YYYY-MM-DD
    const dateString = formatDateToLocalString(formData.date);

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: dateString, // ✅ Agora envia apenas a data local
      time: selectedTime,
      serviceId: formData.serviceId,
      userId: barber.id,
    });

    if (response.error) {
      toast.error(response.error);

      // ✅ Atualizar horários disponíveis após erro
      const blocked = await fetchBlockedTimes(formData.date);
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
        date: new Date(),
        serviceId: "",
      });
    }
  }

  // ✅ Revalidar horários a cada 30 segundos
  useEffect(() => {
    if (selectedDate && selectedServiceId) {
      const interval = setInterval(() => {
        fetchBlockedTimes(selectedDate).then((blocked) => {
          setBlockedTimes(blocked);

          const times = barber.times || [];
          const finalSlots = times.map((time) => ({
            time: time,
            available: !blocked.includes(time),
          }));

          setAvailableTimeSlots(finalSlots);

          // Limpar seleção se não estiver mais disponível
          if (selectedTime && blocked.includes(selectedTime)) {
            setSelectedTime("");
            toast.warning("O horário selecionado não está mais disponível.");
          }
        });
      }, 30000); // 30 segundos

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
    <div className="min-h-screen flex flex-col bg-barber-primary ">
      <div className="h-32 bg-barber-primary-light " />
      <section className="container mx-auto px-4 -mt-16 ">
        <div className="max-w-3xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-33 h-33 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={barber.image ? barber.image : img}
                alt="Barber Shop"
                fill
                className="object-cover rounded-lg shadow-lg mt-6"
              />
            </div>
            <h1 className="text-2xl font-bold mt-4 lg:text-3xl text-white">
              {barber.name}
            </h1>
            <div className="mt-2 flex items-center">
              <MapPin className="inline-block mr-2 text-white" />
              <span className="text-white">
                {" "}
                {barber.address ? barber.address : "Endereço não disponível"}
              </span>
            </div>
          </article>
        </div>
      </section>

      <Form {...form}>
        <form
          className="space-y-6 bg-barber-primary-light p-6 rounded-lg shadow-md mt-8 container mx-auto max-w-3xl mb-3"
          onSubmit={form.handleSubmit(handleRegister)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Label className="text-white text-sm font-semibold">
                  Nome Completo
                </Label>
                <FormControl>
                  <Input
                    placeholder="Seu nome completo"
                    {...field}
                    className="border-barber-gold-dark text-white placeholder-white"
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
                <Label className="text-white text-sm font-semibold">
                  E-mail
                </Label>
                <FormControl>
                  <Input
                    placeholder="Seu e-mail"
                    type="email"
                    autoComplete="email"
                    {...field}
                    className="border-barber-gold-dark text-white placeholder-white"
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
                <Label className="text-white text-sm font-semibold">
                  Telefone
                </Label>
                <FormControl>
                  <Input
                    placeholder="Seu telefone"
                    {...field}
                    className="border-barber-gold-dark text-white placeholder-white"
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
              <FormItem className="">
                <Label className="text-white text-sm font-semibold">
                  Clique e Selecione a Data do Agendamento
                </Label>
                <FormControl>
                  <DateTimerPicker
                    initialDate={new Date()}
                    className="w-full rounded-md border p-1.5 border-barber-gold-dark cursor-pointer text-white bg-barber-primary-light pr-10"
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date);
                        setSelectedTime("");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <Label className="text-white text-sm font-semibold block">
                  Selecione o Serviço
                </Label>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedTime("");
                    }}
                  >
                    <SelectTrigger className="w-full border-2 border-barber-gold-dark bg-barber-primary-light text-white hover:border-barber-gold transition-colors ">
                      <SelectValue placeholder="Escolha seu serviço" />
                    </SelectTrigger>
                    <SelectContent className="bg-barber-primary border-2 border-barber-gold-dark">
                      <SelectGroup>
                        <SelectLabel className="text-barber-gold font-bold text-base py-2">
                          Nossos Serviços
                        </SelectLabel>
                        {barber.services.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id}
                            className="text-white cursor-pointer hover:bg-barber-gold/20 focus:bg-barber-gold/20 py-3 px-4"
                          >
                            <div className="flex items-center justify-between w-full gap-3">
                              <span className="font-medium text-white">
                                {service.name}
                              </span>
                              <div className="flex items-center gap-3 text-sm whitespace-nowrap">
                                <span className="text-white/60">|</span>
                                <span className="text-barber-gold font-bold">
                                  R${" "}
                                  {(service.price / 100)
                                    .toFixed(2)
                                    .replace(".", ",")}
                                </span>

                                <span className="text-gray-400"> |</span>
                                <span className="text-white">
                                  {Math.floor(service.duration / 60)}h
                                  {service.duration % 60 > 0 &&
                                    ` ${service.duration % 60}min`}
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
              <Label className="text-white text-sm font-semibold block">
                Horarios Disponíveis
              </Label>
              <div className="bg-barber-primary p-4 rounded-md">
                {loadingSlots ? (
                  <p className="text-white">Carregando horarios...</p>
                ) : availableTimeSlots.length === 0 ? (
                  <p className="text-white">Nenhum horario disponível</p>
                ) : (
                  <ScheduleTimesList
                    onSelectTime={(time) => setSelectedTime(time)}
                    barberTimes={barber.times}
                    blockedTimes={blockedTimes}
                    availableTimeSlots={availableTimeSlots}
                    selectedTime={selectedTime}
                    selectedDate={selectedDate}
                    requiredSlots={
                      barber.services.find((s) => s.id === selectedServiceId)
                        ? Math.ceil(
                            barber.services.find(
                              (s) => s.id === selectedServiceId
                            )!.duration / 30
                          )
                        : 1
                    }
                  />
                )}
              </div>
            </div>
          )}

          {barber.status ? (
            <Button
              type="submit"
              className="w-full bg-barber-gold hover:bg-barber-gold-dark text-white font-bold py-3 px-6 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agendar Serviço
            </Button>
          ) : (
            <p className="w-full flex justify-center">
              <strong className="text-white font-bold  bg-barber-gold-light/20 p-4 rounded-md">
                Barbeiro indisponível para agendamentos no momento.
              </strong>
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
