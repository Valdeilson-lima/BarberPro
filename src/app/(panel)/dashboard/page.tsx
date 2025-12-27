import { Button } from "@/components/ui/button";
import getSession from "@/lib/getSession";
import { se } from "date-fns/locale";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonCopyLink } from "./_components/button-copy-link";
import { Reminders } from "./_components/remindres/reminders";
import { Appointments } from "./_components/appointments/appointments";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <main>
      <div className="space-x-2 flex items-center justify-end">
        <Link href={`/barber/${session?.user?.id}`} target="_blank">
          <Button
            className="bg-barber-primary-light cursor-pointer hover:bg-barber-gold hover:brightness-110 hover:scale-[1.02] transition-all hover:shadow-md hover:shadow-barber-gold/30 hover:text-black"
            title="Agendar"
          >
            <Calendar className="mr-2 h-5 w-5" />
            <span>Novo Agendamento</span>
          </Button>
        </Link>
        <ButtonCopyLink userId={session!.user!.id} />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
        <Appointments userId={session!.user!.id} />
        <Reminders userId={session!.user!.id} />
      </section>
    </main>
  );
}
