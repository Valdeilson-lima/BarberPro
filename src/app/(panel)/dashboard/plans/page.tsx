import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GrisdPlans } from "./_components/grid-plans";
import { getSubscriptions } from "@/utils/get-subscriptions";
import { Subscript } from "lucide-react";
import { SubscriptionDetail } from "./_components/subscription-detail";

export default async function Plans() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const subscription = await getSubscriptions({ userId: session?.user?.id!});
  return (
    <div>
     {subscription?.status !== "active" ? (
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">Escolha seu Plano</h1>
          <GrisdPlans />
        </div>
      ) : (
        <div>
          <SubscriptionDetail subscriptionId={subscription!} />
        </div>
      )}
    </div>
  );
}