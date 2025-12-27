"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface AppointmentsListProps {
  times: string[];
}

export function AppointmentsList({ times }: AppointmentsListProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const { data, isLoading } = useQuery({
    queryKey: ["barber-appointments", date],
    queryFn: async () => {

      let activeDate = date;

      if (!activeDate) {
        const today = new Date();
        activeDate = format(today, "yyyy-MM-dd");
        
      }

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/barber/appointments?date=${activeDate}`;
      const response = await fetch(url);
      const json = await response.json();
      console.log("Agendamentos:", json);

      if (!response.ok) {
        return [];
      }
      return json;
    },
  });
   


  return (
    <Card className="bg-barber-primary-light border border-barber-gold/20 ">
      <CardHeader className="border-b border-barber-gold/20 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white font-semibold text-xl md:text-2xl">
          Agenda
        </CardTitle>
        <button className="text-white">Ver todos</button>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
          {times.map((time) => (
            <Card
              key={time}
              className="mb-2 bg-barber-primary/50 border border-barber-gold/20 hover:bg-barber-gold/20 transition-colors"
            >
              <CardContent className="p-4 flex">
                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                  <p className="text-white font-semibold">{time}</p>
                  <span className="text-white">-</span>
                  <p className="text-white/80 text-sm">Disponível</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
