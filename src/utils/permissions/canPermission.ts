"use server";

import { auth } from "@/lib/auth";
import { planDetailInfo } from "./get-plans";
import { prisma } from "@/lib/prisma";
import { canCreateService } from "./canCreateService";

export type PLAN_PROPS = "BASIC" | "PROFESSIONAL" | "TRIAL" | "EXPIRED";
type typeCheck = "service";

export interface ResultPermissionProp {
  hasPermision: boolean;
  planId: PLAN_PROPS;
  expired: boolean;
  plan: planDetailInfo | null;
}

interface CanPermissionProps {
  type: typeCheck;
}

export async function canPermission({
  type,
}: CanPermissionProps): Promise<ResultPermissionProp> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      hasPermision: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { createdAt: true },
  });

  if (!user?.createdAt) {
    return {
      hasPermision: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: {
        equals: "active",
        mode: "insensitive",
      },
    },
  });

  switch (type) {
    case "service":
        const permissions = await canCreateService(
          subscription,
          session.user.id,
          user.createdAt,
        );
        return permissions;
      
      default:
        return {
        hasPermision: false,
        planId: "EXPIRED",
        expired: true,
        plan: null,
      };
  }
}
