"use server";

import { PaymentMethod } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export interface DashboardInsightsData {
  totalRevenue: number;
  monthRevenue: number;
  totalAppointments: number;
  monthAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  upcomingAppointments: number;
  uniqueClientsBooked: number;
  uniqueClientsServed: number;
  averageTicket: number;
  completionRate: number;
  cancellationRate: number;
  paymentBreakdown: Array<{
    method: PaymentMethod;
    label: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  topServices: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  PIX: "PIX",
};

function getClientKey(email: string, phone: string) {
  return email?.trim().toLowerCase() || phone?.trim() || "sem-identificacao";
}

function isSameMonth(date: Date, monthStart: Date, nextMonthStart: Date) {
  return date >= monthStart && date < nextMonthStart;
}

export async function getDashboardInsights(
  userId: string,
): Promise<DashboardInsightsData> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const appointments = await prisma.appointment.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      appointmentDate: true,
      createdAt: true,
      paymentMethod: true,
      completedAt: true,
      cancellationReason: true,
      service: {
        select: {
          name: true,
          price: true,
        },
      },
    },
  });

  const completedAppointments = appointments.filter(
    (appointment) => appointment.completedAt !== null,
  );

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.cancellationReason !== null &&
      appointment.cancellationReason.trim().length > 0,
  );

  const pendingAppointments = appointments.filter((appointment) => appointment.status)
    .length;

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status && appointment.appointmentDate >= now,
  ).length;

  const totalRevenue = completedAppointments.reduce(
    (total, appointment) => total + appointment.service.price,
    0,
  );

  const monthRevenue = completedAppointments
    .filter(
      (appointment) =>
        appointment.completedAt &&
        isSameMonth(appointment.completedAt, monthStart, nextMonthStart),
    )
    .reduce((total, appointment) => total + appointment.service.price, 0);

  const monthAppointments = appointments.filter((appointment) =>
    isSameMonth(appointment.appointmentDate, monthStart, nextMonthStart),
  ).length;

  const uniqueClientsBooked = new Set(
    appointments.map((appointment) => getClientKey(appointment.email, appointment.phone)),
  ).size;

  const uniqueClientsServed = new Set(
    completedAppointments.map((appointment) =>
      getClientKey(appointment.email, appointment.phone),
    ),
  ).size;

  const averageTicket =
    completedAppointments.length > 0
      ? Math.round(totalRevenue / completedAppointments.length)
      : 0;

  const completionRate =
    appointments.length > 0
      ? Number(((completedAppointments.length / appointments.length) * 100).toFixed(1))
      : 0;

  const cancellationRate =
    appointments.length > 0
      ? Number(((cancelledAppointments.length / appointments.length) * 100).toFixed(1))
      : 0;

  const paymentAccumulator = {
    [PaymentMethod.CASH]: { count: 0, revenue: 0 },
    [PaymentMethod.CREDIT_CARD]: { count: 0, revenue: 0 },
    [PaymentMethod.DEBIT_CARD]: { count: 0, revenue: 0 },
    [PaymentMethod.PIX]: { count: 0, revenue: 0 },
  };

  for (const appointment of completedAppointments) {
    if (!appointment.paymentMethod) {
      continue;
    }

    paymentAccumulator[appointment.paymentMethod].count += 1;
    paymentAccumulator[appointment.paymentMethod].revenue += appointment.service.price;
  }

  const paymentBreakdown = Object.values(PaymentMethod)
    .map((method) => {
      const revenue = paymentAccumulator[method].revenue;
      const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

      return {
        method,
        label: PAYMENT_LABELS[method],
        count: paymentAccumulator[method].count,
        revenue,
        percentage: Number(percentage.toFixed(1)),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const serviceStats = new Map<string, { count: number; revenue: number }>();

  for (const appointment of completedAppointments) {
    const previous = serviceStats.get(appointment.service.name) ?? {
      count: 0,
      revenue: 0,
    };

    serviceStats.set(appointment.service.name, {
      count: previous.count + 1,
      revenue: previous.revenue + appointment.service.price,
    });
  }

  const topServices = [...serviceStats.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalRevenue,
    monthRevenue,
    totalAppointments: appointments.length,
    monthAppointments,
    completedAppointments: completedAppointments.length,
    cancelledAppointments: cancelledAppointments.length,
    pendingAppointments,
    upcomingAppointments,
    uniqueClientsBooked,
    uniqueClientsServed,
    averageTicket,
    completionRate,
    cancellationRate,
    paymentBreakdown,
    topServices,
  };
}
