"use client";

import { useState } from "react";
import {
  Loading,
  LoadingInline,
  LoadingButton,
  Skeleton,
  LoadingCard,
  LoadingTable,
} from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Página de demonstração dos componentes de Loading
 * Acesse em: /demo/loading
 */
export default function LoadingDemoPage() {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleButtonClick = () => {
    setIsButtonLoading(true);
    setTimeout(() => setIsButtonLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-barber-primary p-8">
      {showFullscreen && (
        <Loading fullscreen variant="barber" size="xl" text="Processando..." />
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-barber-gold mb-4">
            Sistema de Loading - BarberPro
          </h1>
          <p className="text-white/80">
            Componentes de loading personalizados com tema da barbearia
          </p>
        </div>

        {/* Variantes de Loading */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Variantes de Loading</CardTitle>
            <CardDescription className="text-white/60">
              Diferentes estilos de animação
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-3">
              <Loading variant="barber" size="lg" />
              <span className="text-white text-sm">Barber (Tesoura)</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Loading variant="spinner" size="lg" />
              <span className="text-white text-sm">Spinner</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Loading variant="dots" size="lg" />
              <span className="text-white text-sm">Dots</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Loading variant="pulse" size="lg" />
              <span className="text-white text-sm">Pulse</span>
            </div>
          </CardContent>
        </Card>

        {/* Tamanhos */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Tamanhos</CardTitle>
            <CardDescription className="text-white/60">
              Do menor ao maior
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-3">
              <Loading variant="barber" size="sm" />
              <span className="text-white text-xs">Small</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Loading variant="barber" size="md" />
              <span className="text-white text-sm">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Loading variant="barber" size="lg" />
              <span className="text-white text-base">Large</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Loading variant="barber" size="xl" />
              <span className="text-white text-lg">Extra Large</span>
            </div>
          </CardContent>
        </Card>

        {/* Com Texto */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Com Texto</CardTitle>
            <CardDescription className="text-white/60">
              Loading com mensagens customizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Loading
              variant="barber"
              size="lg"
              text="Carregando agendamentos..."
            />
            <Loading variant="spinner" size="md" text="Processando..." />
            <Loading variant="dots" size="lg" text="Buscando serviços..." />
          </CardContent>
        </Card>

        {/* Loading Inline e Button */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Inline e Button</CardTitle>
            <CardDescription className="text-white/60">
              Para uso em textos e botões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-barber-primary p-4 rounded-md">
              <p className="text-white">
                Processando pagamento... <LoadingInline />
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleButtonClick}
                disabled={isButtonLoading}
                className="bg-barber-gold hover:bg-barber-gold-dark"
              >
                {isButtonLoading ? <LoadingButton /> : "Clique para Testar"}
              </Button>

              <Button
                onClick={() => setShowFullscreen(true)}
                variant="outline"
                className="border-barber-gold text-white"
              >
                Mostrar Fullscreen (3s)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skeletons */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Skeletons</CardTitle>
            <CardDescription className="text-white/60">
              Placeholders animados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-white text-sm mb-2">Texto</h3>
              <Skeleton variant="text" count={3} />
            </div>

            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-white text-sm mb-2">Avatar Circular</h3>
                <Skeleton variant="circular" width={64} height={64} />
              </div>

              <div className="flex-1">
                <h3 className="text-white text-sm mb-2">Card</h3>
                <Skeleton variant="rectangular" height={100} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Card */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Loading Card</CardTitle>
            <CardDescription className="text-white/60">
              Skeleton pré-configurado para cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          </CardContent>
        </Card>

        {/* Loading Table */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Loading Table</CardTitle>
            <CardDescription className="text-white/60">
              Skeleton para tabelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingTable rows={5} />
          </CardContent>
        </Card>

        {/* Casos de Uso Reais */}
        <Card className="bg-barber-primary-light border-barber-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Casos de Uso Reais</CardTitle>
            <CardDescription className="text-white/60">
              Exemplos práticos no contexto da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Simulando lista de agendamentos */}
            <div className="bg-barber-primary p-4 rounded-md">
              <h3 className="text-white font-semibold mb-4">
                Lista de Agendamentos
              </h3>
              <Loading
                size="lg"
                variant="barber"
                text="Carregando agendamentos..."
              />
            </div>

            {/* Simulando busca de horários */}
            <div className="bg-barber-primary p-4 rounded-md">
              <h3 className="text-white font-semibold mb-4">
                Horários Disponíveis
              </h3>
              <div className="flex justify-center">
                <Loading
                  size="md"
                  variant="dots"
                  text="Verificando disponibilidade..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timer para ocultar fullscreen */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowFullscreen(false)}
        >
          <Loading
            fullscreen
            variant="barber"
            size="xl"
            text="Clique para fechar..."
          />
        </div>
      )}

      {showFullscreen &&
        setTimeout(() => setShowFullscreen(false), 3000) &&
        null}
    </div>
  );
}
