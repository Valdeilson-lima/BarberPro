"use client";

import Image from "next/image";
import img from "../../../../../../public/hero-image.jpg";
import { ArrowBigDown, ChevronDown, MapPin } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { UseAppointmentForm, AppointmentFormData } from "./schedule-form";
import { formatPhone } from "@/utils/formatPhone";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimerPicker } from "./date-picker";

type UserWhithhServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    services: true;
    subscriptions: true;
  };
}>;

interface ScheduleContentProps {
  barber: UserWhithhServiceAndSubscription;
}

export function ScheduleContent({ barber }: ScheduleContentProps) {
  const form = UseAppointmentForm();

  return (
    <div className="min-h-screen flex flex-col bg-barber-primary ">
      <div className="h-32 bg-barber-primary-light " />
      <section className="container mx-auto px-4 -mt-16 ">
        <div className="max-w-3xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-38 h-38 rounded-full overflow-hidden border-4 border-white">
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
        <form className="space-y-6 bg-barber-primary-light p-6 rounded-lg shadow-md mt-8 container mx-auto max-w-3xl">
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
                    className="border-barber-gold-dark"
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
                    {...field}
                    className="border-barber-gold-dark"
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
                    className="border-barber-gold-dark"
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
                    // Adicionado pr-10 para dar espaço ao ícone
                    className="w-full rounded-md border p-1.5 border-barber-gold-dark cursor-pointer text-white bg-barber-primary-light pr-10"
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
