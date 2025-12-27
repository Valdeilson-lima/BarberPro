import { getTimesBarber } from "@/app/(panel)/dashboard/_data-access/get-times-barber";
import { AppointmentsList } from "./appointments-list";


export async function Appointments({ userId }: { userId: string }) {
    const { times, userId: id } = await getTimesBarber(userId);

  return (
    <AppointmentsList times={times} />
  );
}