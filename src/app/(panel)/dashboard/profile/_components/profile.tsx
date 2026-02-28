"use client";

import { useState } from "react";
import { useProfileForm } from "./profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import img from ".././../../../../../public/imagem01.jpg";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Building2,
  Clock3,
  Globe2,
  LogOut,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { ProfileFormData } from "./profile-form";
import { UserGetPayload } from "@/generated/prisma/internal/prismaNamespaceBrowser";
import { updateProfile } from "../_actions/update-profile";
import { toast } from "sonner";
import { formatPhone, exractPhoneNumber } from "@/utils/formatPhone";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserWithSubscriptions = UserGetPayload<{
  include: {
    subscriptions: true;
  };
}> & {
  times?: string[] | null;
};

interface ProfileContentProps {
  user: UserWithSubscriptions;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const [slectedhours, setSelectedHours] = useState<string[]>(user.times ?? []);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();

  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
  });

  function generateTimeSlots() {
    const hours: string[] = [];
    for (let i = 8; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 30).toString().padStart(2, "0");
        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  }

  const timeSlots = generateTimeSlots();

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  }

  const timeZones = Intl.supportedValuesOf("timeZone").filter(
    (tz) =>
      tz.startsWith("America/Sao_Paulo") ||
      tz.startsWith("America/Recife") ||
      tz.startsWith("Europe/Belem") ||
      tz.startsWith("Europe/Cuiaba") ||
      tz.startsWith("Asia/Boa_Vista") ||
      tz.startsWith("America/Manaus") ||
      tz.startsWith("America/Porto_Velho") ||
      tz.startsWith("America/Rio_Branco") ||
      tz.startsWith("America/Noronha") ||
      tz.startsWith("America/Eirunepe")
  );

  async function onSubmit(values: ProfileFormData) {
    setIsLoading(true);
    const extractValue = exractPhoneNumber(values.phone || "");
    values.phone = extractValue;

    const response = await updateProfile({
      name: values.name,
      address: values.address,
      phone: values.phone,
      status: values.status === "active" ? true : false,
      timeZone: values.timeZone,
      times: slectedhours,
    });

    if (response.error) {
      setIsLoading(false);
      toast.error(response.error, { closeButton: true });
      return;
    }

    setIsLoading(false);
    toast.success(response.data, { closeButton: true });
  }

  async function handleSignOut() {
    await signOut();
    await update();
    router.replace("/");
  }

  return (
    <div className="mx-auto space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-gradient-to-br from-barber-primary-light to-barber-primary shadow-lg rounded-lg border-barber-gold-dark/20 border">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-white font-bold text-2xl text-center lg:text-start flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-barber-gold" />
                    Perfil da Barbearia
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Atualize dados do negócio, horários e disponibilidade pública.
                  </CardDescription>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                    user.status
                      ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-200"
                      : "border-red-400/50 bg-red-500/20 text-red-200"
                  }`}
                >
                  {user.status ? "Barbearia ativa" : "Barbearia inativa"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 items-center md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative rounded-full h-24 w-24 overflow-hidden border-2 border-barber-gold/40">
                    <Image
                      src={user.image ? user.image : img}
                      fill
                      alt="Imagem de perfil"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-semibold">{user.name}</h2>
                    <p className="text-barber-gold-light text-sm">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                  <div className="rounded-md border border-barber-gold/20 bg-barber-primary/60 px-3 py-2">
                    <p className="text-xs text-gray-400">Horários ativos</p>
                    <p className="text-white font-semibold">{slectedhours.length}</p>
                  </div>
                  <div className="rounded-md border border-barber-gold/20 bg-barber-primary/60 px-3 py-2">
                    <p className="text-xs text-gray-400">Plano</p>
                    <p className="text-white font-semibold">
                      {user.subscriptions?.plan ?? "Sem plano"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-barber-gold" />
                          Nome
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome da barbearia"
                            {...field}
                            className="bg-barber-primary-dark text-white border-barber-gold-dark/20"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center gap-2">
                          <Phone className="h-4 w-4 text-barber-gold" />
                          Telefone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(99) 99999-9999"
                            {...field}
                            onChange={(e) => {
                              const formateedValue = formatPhone(e.target.value);
                              field.onChange(formateedValue);
                            }}
                            className="bg-barber-primary-dark text-white border-barber-gold-dark/20"
                          />
                        </FormControl>
                        <FormMessage className="text-barber-gold-light" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-barber-gold" />
                        Endereço Completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Endereço da barbearia"
                          {...field}
                          className="bg-barber-primary-dark text-white border-barber-gold-dark/20"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
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
                        <Select value={field.value} onValueChange={field.onChange}>
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

                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-barber-gold" />
                    Configurar horários da Barbearia
                  </Label>

                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-barber-primary-dark text-white border-barber-gold-dark/20 w-full justify-between hover:bg-barber-gold-dark/10 cursor-pointer hover:text-white"
                        variant={"outline"}
                        type="button"
                      >
                        {slectedhours.length > 0
                          ? `${slectedhours.length} horários configurados`
                          : "Clique aqui para configurar os horários"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-barber-primary-dark text-white border-barber-gold-dark/20">
                      <DialogHeader>
                        <DialogTitle>Configurar Horários</DialogTitle>
                        <DialogDescription>
                          Defina os horários de funcionamento da sua barbearia.
                        </DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p>Clique nos horários abaixo para marcar ou desmarcar.</p>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-5 mt-4">
                          {timeSlots.map((hour) => (
                            <button
                              key={hour}
                              className="m-1 px-4 py-2 bg-barber-primary-light border border-barber-gold-dark/50 rounded text-white hover:bg-barber-gold-dark/10 cursor-pointer"
                              onClick={() => toggleHour(hour)}
                              type="button"
                              style={{
                                backgroundColor: slectedhours.includes(hour)
                                  ? "rgba(255, 215, 0, 0.3)"
                                  : "",
                              }}
                            >
                              {hour}
                            </button>
                          ))}
                        </div>
                      </section>

                      <Button
                        className="mt-4 bg-barber-gold-dark text-white border-barber-gold-dark/20 w-full hover:bg-barber-gold-dark/50 cursor-pointer hover:text-white"
                        variant={"outline"}
                        onClick={() => setDialogIsOpen(false)}
                        type="button"
                      >
                        Fechar Modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-barber-gold" />
                        Fuso Horário da Barbearia
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full bg-barber-primary-dark text-white border-barber-gold-dark/20">
                            <SelectValue placeholder="Selecione o fuso horário" />
                          </SelectTrigger>
                          <SelectContent className="bg-barber-primary-dark text-white border-barber-gold-dark/20">
                            <SelectGroup>
                              <SelectLabel className="text-white">Fuso Horário</SelectLabel>
                              {timeZones.map((tz) => (
                                <SelectItem key={tz} value={tz} className="text-white">
                                  {tz}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-barber-gold-dark text-white border-barber-gold-dark/20 w-full hover:bg-barber-gold-dark/50 cursor-pointer hover:text-white"
                  variant={"outline"}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <section>
        <Button
          className="bg-barber-red-dark text-white border-barber-red-dark/20 hover:bg-barber-red-light cursor-pointer hover:text-white self-end"
          variant={"outline"}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sair da Conta
        </Button>
      </section>
    </div>
  );
}
