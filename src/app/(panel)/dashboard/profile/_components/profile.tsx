"use client";

import { useProfileForm } from "./profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import img from ".././../../../../../public/imagem01.jpg";

export function ProfileContent() {
  const form = useProfileForm();

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form>
          <Card className="bg-barber-primary-light shadow-lg rounded-lg border-barber-gold-dark/20 border">
            <CardHeader>
              <CardTitle className="text-white font-bold text-2xl text-center lg:text-start">
                Perfil da Barbearia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative rounded-full h-32 w-32 overflow-hidden">
                  <Image
                    src={img}
                    fill
                    alt="Imagem de perfil"
                    className="rounded-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome da barbearia"
                          {...field}
                          className="bg-barber-primary-dark text-white border-barber-gold-dark/20"
                        />
                      </FormControl>
                      <FormMessage className="text-barber-gold-light" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Endereço Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Endereço da barbearia"
                          {...field}
                          className="bg-barber-primary-dark text-white border-barber-gold-dark/20"
                        />
                      </FormControl>
                      <FormMessage className="text-barber-gold-light" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Telefone da barbearia"
                          {...field}
                          className="bg-barber-primary-dark text-white border-barber-gold-dark/20"
                        />
                      </FormControl>
                      <FormMessage className="text-barber-gold-light" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Status da Barbearia</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value ? "active" : "inactive"}>
                          <SelectTrigger className="w-full bg-barber-primary-dark text-white border-barber-gold-dark/20">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent className="bg-barber-primary-dark text-white border-barber-gold-dark/20">
                            <SelectGroup>
                              <SelectLabel className="text-white">Status</SelectLabel>
                              <SelectItem value="active" className="text-white">
                                Ativo (Barbearia aberta)
                              </SelectItem>
                              <SelectItem value="inactive" className="text-white">
                                Inativo (Barbearia fechada)
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-barber-gold-light" />
                    </FormItem>
                  )}
                />

              



              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
