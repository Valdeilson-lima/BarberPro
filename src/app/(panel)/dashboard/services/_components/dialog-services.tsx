"use client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  useDialogServiceForm,
  DialogServiceFormData,
} from "./dialog-service-form";
import { changeCurrency, convertRealToCents } from "@/utils/formatValue";
import { createNewService } from "../_actions/create-service";
import { updateService } from "../_actions/update-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DialogServicesProps {
  closeModal: () => void;
  serviceId?: string;
  initialValues?: {
    name: string;
    description: string;
    price: string;
    hours: string;
    minuts: string;
  };
}

export function DialogServices({
  closeModal,
  serviceId,
  initialValues,
}: DialogServicesProps) {
  const form = useDialogServiceForm({ initialValues });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: DialogServiceFormData) {
    setLoading(true);
    const cents = convertRealToCents(values.price);
    const hours = parseInt(values.hours) || 0;
    const minuts = parseInt(values.minuts) || 0;
    const durationInMinutes = hours * 60 + minuts;

    if (serviceId) {
      await editServiceById({
        serviceId: serviceId,
        name: values.name,
        description: values.description,
        priceInCents: cents,
        duration: durationInMinutes,
      });
      setLoading(false);
      toast.success("Serviço editado com sucesso!");
      handleCloseModal();
      router.refresh();
      return;
    }

    const response = await createNewService({
      name: values.name,
      description: values.description,
      price: cents,
      duration: durationInMinutes,
    });

    setLoading(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Serviço criado com sucesso!");
    handleCloseModal();
    router.refresh();
  }

  async function editServiceById({
    serviceId,
    name,
    description,
    priceInCents,
    duration,
  }: {
    serviceId: string;
    name: string;
    description: string;
    priceInCents: number;
    duration: number;
  }) {
    const response = await updateService({
      serviceId: serviceId,
      name: name,
      description: description,
      price: priceInCents,
      duration: duration,
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success("Serviço editado com sucesso!");
    router.refresh();
    handleCloseModal();
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-white text-xl font-bold flex justify-between items-center">
          {serviceId ? "Editar Serviço" : "Criar Novo Serviço"}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-barber-gold-dark hover:bg-barber-gold-dark/20 text-white hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogTitle>
        <DialogDescription className="text-white mt-2 mb-4">
          {serviceId
            ? "Edite os detalhes do serviço abaixo."
            : "Preencha o formulário abaixo para criar um novo serviço."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="text-white">Nome do Serviço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Corte de Cabelo"
                      className="text-white border-barber-gold-dark "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="text-white">
                    Descrição do Serviço
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do serviço oferecido"
                      className="text-white border-barber-gold-dark focus:border-barber-gold-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="text-white">Preço do Serviço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 50,00"
                      className="text-white border-barber-gold-dark "
                      {...field}
                      onChange={(e) => {
                        changeCurrency(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel className="text-white">
                      Duração do Serviço - Horas
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="text-white border-barber-gold-dark "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minuts"
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel className="text-white">
                      Duração do Serviço - Minutos
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        className="text-white border-barber-gold-dark "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-barber-gold-dark hover:bg-barber-gold-light text-white mt-2 cursor-pointer"
          >
            {loading
              ? "Salvando..."
              : `${serviceId ? "Salvar Alterações" : "Criar Serviço"}`}
          </Button>
        </form>
      </Form>

      <DialogFooter></DialogFooter>
    </>
  );
}
