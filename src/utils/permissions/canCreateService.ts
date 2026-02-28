"use server";

import { Subscription } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { getPlan } from "./get-plans";
import { PLANS } from "../plans";
import { checkSubscriptionExpired } from "./checkSubscriptionExpeired";
import { ResultPermissionProp } from "./canPermission";

export async function canCreateService(
  subcription: Subscription | null,
  userId: string,
  userCreatedAt: Date | null,
): Promise<ResultPermissionProp> {
  try {
    const seerviceCount = await prisma.service.count({
      where: {
        userId,
        status: true,
      },
    });

    if (subcription && subcription.status.toUpperCase() === "ACTIVE") {
      const plan = subcription.plan;
      const planLImit = await getPlan(plan);
      console.log("Plan limit:", planLImit);

      return {
        hasPermision:
          planLImit.maxServices === null ||
          seerviceCount < planLImit.maxServices,
        planId: plan,
        expired: false,
        plan: PLANS[subcription.plan],
      };
    }

    console.log("No active subscription found. Falling back to trial/expired check.");
    const checkTextLimit = await checkSubscriptionExpired(userCreatedAt);

    return checkTextLimit;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return {
      hasPermision: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }
}
