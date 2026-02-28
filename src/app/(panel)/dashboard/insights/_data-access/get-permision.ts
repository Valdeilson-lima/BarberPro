"use server";
import { auth } from "@/lib/auth";
import { Plan } from "@/generated/prisma/enums";
import { checkSubscriptionExpiredByUserId } from "@/utils/permissions/checkSubscription";

export async function checkDashboardInsightsPermission() {
  const session = await auth();

  if (!session) {
    return {
      allowed: false,
      reason: "UNAUTHENTICATED" as const,
    };
  }

  const subscriptionStatus = await checkSubscriptionExpiredByUserId(session.user.id);

  if (subscriptionStatus.subscriptionSatuds === "TRIAL") {
    return {
      allowed: true,
      reason: null,
      plan: "TRIAL" as const,
    };
  }

  if (subscriptionStatus.subscriptionSatuds !== "ACTIVE") {
    return {
      allowed: false,
      reason: "NO_ACTIVE_SUBSCRIPTION" as const,
      plan: null,
    };
  }

  const isProfessionalPlan = subscriptionStatus.planId === Plan.PROFESSIONAL;

  if (!isProfessionalPlan) {
    return {
      allowed: false,
      reason: "INSUFFICIENT_PLAN" as const,
      plan: subscriptionStatus.planId,
    };
  }

  return {
    allowed: true,
    reason: null,
    plan: subscriptionStatus.planId,
  };
}
