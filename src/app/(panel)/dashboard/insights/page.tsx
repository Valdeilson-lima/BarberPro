import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import getSession from "@/lib/getSession";
import { formatValue } from "@/utils/formatValue";
import {
  Banknote,
  CalendarCheck,
  CalendarClock,
  ChartColumn,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardInsights } from "./_data-access/get-dashboard-insights";
import { checkDashboardInsightsPermission } from "./_data-access/get-permision";

function formatPercentage(value: number) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

function getCurrentMonthLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default async function InsightsPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/");
  }

  const permission = await checkDashboardInsightsPermission();

  if (!permission.allowed) {
    return (
      <main className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <Card className="w-full max-w-2xl border border-barber-gold/20 bg-barber-primary-light">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Insights bloqueados</CardTitle>
            <CardDescription className="text-gray-300">
              Esta área está disponível apenas para assinantes do plano Profissional.
              Faça o upgrade para liberar os insights avançados da sua barbearia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/plans" className="w-full md:w-auto">
              <Button className="w-full bg-barber-gold text-barber-primary hover:bg-barber-gold-light md:w-auto">
                Ver planos e fazer upgrade
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const insights = await getDashboardInsights(session.user.id);
  const currentMonthLabel = getCurrentMonthLabel();

  return (
    <main className="space-y-4 md:space-y-6">
      <section className="rounded-xl border border-barber-gold/20 bg-linear-to-br from-barber-primary-light to-barber-primary p-4 md:p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
          <ChartColumn className="h-6 w-6 text-barber-gold" />
          Insights da Barbearia
        </h1>
        <p className="mt-2 text-sm text-gray-300 md:text-base">
          Visão geral do desempenho, faturamento e comportamento dos seus clientes.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-barber-gold/20 bg-barber-primary-light">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-gray-400">
              <Banknote className="h-4 w-4 text-barber-gold" />
              Faturamento total
            </CardDescription>
            <CardTitle className="text-2xl text-white">{formatValue(insights.totalRevenue)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-barber-gold/20 bg-barber-primary-light">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-gray-400">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Faturamento em {currentMonthLabel}
            </CardDescription>
            <CardTitle className="text-2xl text-white">{formatValue(insights.monthRevenue)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-barber-gold/20 bg-barber-primary-light">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4 text-barber-gold" />
              Clientes atendidos
            </CardDescription>
            <CardTitle className="text-2xl text-white">{insights.uniqueClientsServed}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-barber-gold/20 bg-barber-primary-light">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-gray-400">
              <Receipt className="h-4 w-4 text-barber-gold" />
              Ticket médio
            </CardDescription>
            <CardTitle className="text-2xl text-white">{formatValue(insights.averageTicket)}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="border border-barber-gold/20 bg-barber-primary-light xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Faturamento por forma de pagamento</CardTitle>
            <CardDescription className="text-gray-300">
              Distribuição do faturamento dos atendimentos finalizados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.paymentBreakdown.map((payment) => (
              <div key={payment.method} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white">{payment.label}</p>
                  <p className="text-sm text-gray-300">
                    {formatValue(payment.revenue)} ({payment.count} atendimento
                    {payment.count === 1 ? "" : "s"})
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-barber-gold"
                    style={{ width: `${payment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-barber-gold/20 bg-barber-primary-light">
          <CardHeader>
            <CardTitle className="text-white">Indicadores rápidos</CardTitle>
            <CardDescription className="text-gray-300">
              O que está acontecendo no seu negócio agora.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="flex items-center gap-2 text-gray-300">
                <CalendarCheck className="h-4 w-4 text-barber-gold" />
                Agendamentos totais
              </span>
              <span className="font-semibold text-white">{insights.totalAppointments}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="text-gray-300">Agendamentos do mês</span>
              <span className="font-semibold text-white">{insights.monthAppointments}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="text-gray-300">Clientes que agendaram</span>
              <span className="font-semibold text-white">{insights.uniqueClientsBooked}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="text-gray-300">Atendimentos concluídos</span>
              <span className="font-semibold text-white">{insights.completedAppointments}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="text-gray-300">Agendamentos pendentes</span>
              <span className="font-semibold text-white">{insights.pendingAppointments}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="flex items-center gap-2 text-gray-300">
                <TrendingDown className="h-4 w-4 text-red-400" />
                Desistências/cancelamentos
              </span>
              <span className="font-semibold text-white">{insights.cancelledAppointments}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="text-gray-300">Taxa de conclusão</span>
              <span className="font-semibold text-emerald-400">
                {formatPercentage(insights.completionRate)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="text-gray-300">Taxa de desistência</span>
              <span className="font-semibold text-red-400">
                {formatPercentage(insights.cancellationRate)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3">
              <span className="flex items-center gap-2 text-gray-300">
                <CalendarClock className="h-4 w-4 text-barber-gold" />
                Próximos atendimentos
              </span>
              <span className="font-semibold text-white">{insights.upcomingAppointments}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border border-barber-gold/20 bg-barber-primary-light">
          <CardHeader>
            <CardTitle className="text-white">Serviços mais vendidos</CardTitle>
            <CardDescription className="text-gray-300">
              Ranking baseado nos atendimentos finalizados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {insights.topServices.length === 0 ? (
              <p className="text-sm text-gray-300">
                Ainda não há atendimentos concluídos para montar o ranking.
              </p>
            ) : (
              <div className="space-y-2">
                {insights.topServices.map((service, index) => (
                  <div
                    key={service.name}
                    className="flex flex-col gap-2 rounded-lg border border-barber-gold/20 bg-barber-primary/60 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <p className="text-sm font-medium text-white">
                      {index + 1}. {service.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {service.count} atendimento{service.count === 1 ? "" : "s"} • {formatValue(service.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
