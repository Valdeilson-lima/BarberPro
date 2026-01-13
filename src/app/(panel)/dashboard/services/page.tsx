import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServiceContent } from "./_components/service-content";
import { Loading } from "./_components/loading";
import { Suspense } from "react";

export default async function Services() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  return (
    <div>
      <Suspense
        fallback={
          <Loading />
        }
      >
        <ServiceContent userId={session.user?.id!} />
      </Suspense>
    </div>
  );
}
