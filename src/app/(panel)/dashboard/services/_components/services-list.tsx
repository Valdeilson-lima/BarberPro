"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { DialogServices } from "./dialog-services";
import { Service } from "@/generated/prisma/client";
import { formatValue } from "@/utils/formatValue";
import { deleteService } from "../_actions/delete-service";
import { toast } from "sonner";
import { set } from "zod";

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editinService, setEditingService] = useState<Service | null>(null);

  async function handleDeleteService(serviceId: string) {
    const response = await deleteService({ serviceId });
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Serviço excluído com sucesso!");
    }
  }

  function confirmDelete(serviceId: string, serviceName: string) {
    toast.warning(
      `Tem certeza que deseja excluir o serviço "${serviceName}"?`,
      {
        action: {
          label: "Excluir",
          onClick: () => {
            handleDeleteService(serviceId);
          },
        },
        cancel: {
          label: "Cancelar",
          onClick: () => toast.info("Ação de exclusão cancelada."),
        },
        duration: 5000,
      }
    );
  }

  function handleEditService(service: Service) {
    setEditingService(service);
    setIsDialogOpen(true);
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingService(null);
        }
      }}
    >
      <section className="mx-auto ">
        <Card className="bg-barber-primary-light shadow-lg rounded-lg border-barber-gold-dark/20 border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white text-xl md:text-2xl font-bold text-center lg:text-left">
              Listar de Cortes Disponíveis
            </CardTitle>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="bg-barber-gold-dark hover:bg-barber-gold-light text-white flex items-center justify-center cursor-pointer"
                title="Adicionar Serviço"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-lg bg-barber-primary-dark border-barber-gold-dark/20 border"
              onInteractOutside={(e) => {
                e.preventDefault();
                setIsDialogOpen(false);
                setEditingService(null);
              }}
            >
              <DialogServices
                closeModal={() => {
                  setIsDialogOpen(false), setEditingService(null);
                }}
                serviceId={editinService ? editinService.id : undefined}
                initialValues={
                  editinService
                    ? {
                        name: editinService.name,
                        description: editinService.description,
                        price: (editinService.price / 100)
                          .toFixed(2)
                          .replace(".", ","),
                        hours:
                          editinService.duration / 60
                            ? Math.floor(editinService.duration / 60).toString()
                            : "0",
                        minuts:
                          editinService.duration % 60
                            ? (editinService.duration % 60).toString()
                            : "0",
                      }
                    : undefined
                }
              />
            </DialogContent>
          </CardHeader>

          <section className="space-y-4">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {services.length === 0 ? (
                <p className="text-white col-span-full text-center">
                  Nenhum serviço disponível.
                </p>
              ) : (
                services.map((serviceItem) => (
                  <Card
                    key={serviceItem.id}
                    className="bg-barber-primary-light border-barber-gold-dark/20 border"
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-lg font-semibold">
                        {serviceItem.name}
                      </CardTitle>
                      <CardDescription className="text-white">
                        {serviceItem.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <span className="text-white font-bold">
                        {formatValue(serviceItem.price)}
                      </span>

                      <Button
                        variant="secondary"
                        className="bg-barber-gold-dark hover:bg-barber-gold-light text-white ml-auto cursor-pointer"
                        title="Editar Serviço"
                        onClick={() => handleEditService(serviceItem)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        className="ml-2 cursor-pointer bg-barber-red-dark hover:bg-barber-red-light text-white"
                        title="Excluir Serviço"
                        onClick={() => {
                          confirmDelete(serviceItem.id, serviceItem.name);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </section>
          </section>
        </Card>
      </section>
    </Dialog>
  );
}
