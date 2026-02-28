"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock3,
  Crown,
  Pencil,
  Plus,
  Scissors,
  Sparkles,
  Trash,
  Wallet,
} from "lucide-react";
import { DialogServices } from "./dialog-services";
import { Service } from "@/generated/prisma/client";
import { formatValue } from "@/utils/formatValue";
import { deleteService } from "../_actions/delete-service";
import { toast } from "sonner";
import { ResultPermissionProp } from "@/utils/permissions/canPermission";
import Link from "next/link";

interface ServicesListProps {
  services: Service[];
  permissions: ResultPermissionProp;
}

function formatDuration(durationInMinutes: number) {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}

function getPlanLabel(planId: ResultPermissionProp["planId"]) {
  if (planId === "PROFESSIONAL") return "Profissional";
  if (planId === "BASIC") return "Básico";
  if (planId === "TRIAL") return "Teste grátis";
  return "Expirado";
}

export function ServicesList({ services, permissions }: ServicesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editinService, setEditingService] = useState<Service | null>(null);
  const isTrial = permissions.planId === "TRIAL";
  const isExpired = permissions.planId === "EXPIRED";
  const maxServices = permissions.plan?.maxServices ?? null;
  const servicesCount = services.length;
  const hasLimit = !isTrial && typeof maxServices === "number";
  const hasReachedLimit = hasLimit ? servicesCount >= maxServices : false;
  const canAddService = permissions.hasPermision && (isTrial || !hasReachedLimit);
  const usagePercent = hasLimit
    ? Math.min((servicesCount / maxServices) * 100, 100)
    : 0;

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

  function openCreateDialog() {
    setEditingService(null);
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
      <section className="mx-auto space-y-4">
        <Card className="border border-barber-gold/20 bg-linear-to-br from-barber-primary-light to-barber-primary shadow-lg">
          <CardHeader className="gap-4 pb-0">
            <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-white text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Scissors className="h-6 w-6 text-barber-gold" />
                  Catálogo de Serviços
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Organize seus cortes e mantenha o cardápio sempre atualizado.
                </CardDescription>
              </div>
              {canAddService && (
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="bg-barber-gold hover:bg-barber-gold-light text-black font-semibold flex items-center justify-center cursor-pointer w-full md:w-auto h-11 px-5 shadow-lg shadow-barber-gold/30 transition-all duration-300 hover:scale-[1.01]"
                    title="Adicionar Serviço"
                    onClick={openCreateDialog}
                  >
                    <Plus className="h-4 w-4" />
                    Novo serviço
                  </Button>
                </DialogTrigger>
              )}
              {!canAddService && (
                <div className="text-sm text-gray-400 flex items-center gap-1 rounded-md border border-barber-gold/20 bg-barber-primary/60 px-3 py-2">
                  <Wallet className="h-4 w-4 text-barber-gold" />
                  {isExpired ? (
                    <Link href="/dashboard/plans" className="underline font-medium">
                      Assine um plano para começar.
                    </Link>
                  ) : hasReachedLimit ? (
                    <>
                      <span>Você atingiu o limite do seu plano.</span>
                      <Link href="/dashboard/plans" className="underline font-medium">
                        Fazer upgrade
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard/plans" className="underline font-medium">
                      Atualize seu plano para adicionar mais serviços.
                    </Link>
                  )}
                </div>
              )}
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              <Card className="border border-barber-gold/15 bg-barber-primary/70 py-4 gap-3">
                <CardHeader className="px-4 pb-0 gap-1">
                  <CardDescription className="text-gray-400 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-barber-gold" />
                    Serviços cadastrados
                  </CardDescription>
                  <CardTitle className="text-white text-2xl">
                    {servicesCount}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border border-barber-gold/15 bg-barber-primary/70 py-4 gap-3">
                <CardHeader className="px-4 pb-0 gap-1">
                  <CardDescription className="text-gray-400 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-barber-gold" />
                    Plano atual
                  </CardDescription>
                  <CardTitle className="text-white text-2xl">
                    {getPlanLabel(permissions.planId)}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border border-barber-gold/15 bg-barber-primary/70 py-4 gap-3">
                <CardHeader className="px-4 pb-0 gap-2">
                  <CardDescription className="text-gray-400 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-barber-gold" />
                    Limite de serviços
                  </CardDescription>
                  <CardTitle className="text-white text-xl">
                    {isExpired
                      ? "Limite indisponível"
                      : hasLimit
                        ? `${servicesCount}/${maxServices}`
                        : "Ilimitado"}
                  </CardTitle>
                  {hasLimit && (
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-barber-gold transition-all duration-500"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  )}
                </CardHeader>
              </Card>
            </section>

            <DialogContent
              className="sm:max-w-lg bg-barber-primary-dark border-barber-gold-dark/20 border [&>button]:text-white [&>button]:hover:text-barber-gold"
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

          <CardContent className="pt-4">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.length === 0 ? (
                <Card className="col-span-full border border-dashed border-barber-gold/30 bg-barber-primary/70 py-12">
                  <CardContent className="flex flex-col items-center gap-3 text-center">
                    <Scissors className="h-8 w-8 text-barber-gold" />
                    <p className="text-white text-lg font-semibold">
                      Nenhum serviço cadastrado ainda
                    </p>
                    <p className="text-gray-300 text-sm">
                      Comece criando seu primeiro serviço para aparecer na sua agenda online.
                    </p>
                    {canAddService ? (
                      <Button
                        variant="secondary"
                        className="bg-barber-gold hover:bg-barber-gold-light text-black font-semibold mt-2 shadow-lg shadow-barber-gold/30"
                        onClick={openCreateDialog}
                      >
                        <Plus className="h-4 w-4" />
                        Cadastrar primeiro serviço
                      </Button>
                    ) : (
                      <Link
                        href="/dashboard/plans"
                        className="text-barber-gold underline text-sm font-medium mt-1"
                      >
                        {isExpired
                          ? "Assine um plano para começar"
                          : "Aumentar limite do plano"}
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                services.map((serviceItem) => (
                  <Card
                    key={serviceItem.id}
                    className="bg-barber-primary-light border-barber-gold-dark/20 border hover:border-barber-gold/40 transition-colors py-4 gap-4"
                  >
                    <CardHeader className="pb-0 gap-2">
                      <CardTitle className="text-white text-lg font-semibold leading-tight">
                        {serviceItem.name}
                      </CardTitle>
                      <CardDescription className="text-gray-300 line-clamp-2 min-h-10">
                        {serviceItem.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2 text-xs text-gray-200">
                      <span className="inline-flex items-center gap-1 rounded-full border border-barber-gold/40 px-2.5 py-1">
                        <Clock3 className="h-3.5 w-3.5 text-barber-gold" />
                        {formatDuration(serviceItem.duration)}
                      </span>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <span className="text-white font-bold text-lg">
                        {formatValue(serviceItem.price)}
                      </span>
                      <Button
                        variant="secondary"
                        className="bg-barber-gold-dark hover:bg-barber-gold-light text-white ml-auto cursor-pointer"
                        title="Editar Serviço"
                        onClick={() => handleEditService(serviceItem)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="hidden sm:inline">Editar</span>
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
                        <span className="hidden sm:inline">Excluir</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  );
}
