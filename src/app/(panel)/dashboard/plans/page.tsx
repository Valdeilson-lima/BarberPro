import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GrisdPlans } from "./_components/grid-plans";
import { getSubscriptions } from "@/utils/get-subscriptions";

export default async function Plans() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const subscription = await getSubscriptions({ userId: session?.user?.id!});
  console.log("User Subscription:", subscription);
  return (
    <div>
     {subscription?.status !== "ACTIVE" ? (
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">Escolha seu Plano</h1>
          <GrisdPlans />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Você já possui uma assinatura ativa.</h1>
        </div>
      )}
    </div>
  );
}