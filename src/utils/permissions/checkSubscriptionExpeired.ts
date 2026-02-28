"use server";

import { addDays, isAfter } from "date-fns";
import { ResultPermissionProp } from "./canPermission";
import { TRIAL_PERIOD_DAYS } from "./trial-limit";


export async function checkSubscriptionExpired(
  userCreatedAt: Date | string | null | undefined,
): Promise<ResultPermissionProp> {
  if (!userCreatedAt) {
    return {
      hasPermision: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }

  const createdAt = new Date(userCreatedAt);
  if (Number.isNaN(createdAt.getTime())) {
    return {
      hasPermision: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }

  const trialEnddate = addDays(createdAt, TRIAL_PERIOD_DAYS);

  if (isAfter(new Date(), trialEnddate)) {
    return {
      hasPermision: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }

  return {
    hasPermision: true,
    planId: "TRIAL",
    expired: false,
    plan: null,
  };
}
