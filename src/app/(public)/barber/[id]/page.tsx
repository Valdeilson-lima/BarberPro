import { redirect } from "next/navigation";
import { getInfoSchedule } from "./_data-access/get-info-schedule";
import { ScheduleContent } from "./_components/schedule-content";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Renomeei para 'result' para evitar confusão, pois ele contém { user: ... } ou erro
  const result = await getInfoSchedule({ userId: id });
  
  // Verifica se o resultado existe e se tem a propriedade user
  if (!result || !result.user) {
    redirect("/");
  }

  return (
   // Passa apenas o objeto user para o componente
   <ScheduleContent barber={result.user} />
  );
}
