"use client";
import { useRouter, useSearchParams } from "next/navigation";

interface AppointmentsListProps {
  times: string[];
}

export function AppointmentsList({ times }: AppointmentsListProps) {
    const searchParams = useSearchParams();
    const date = searchParams.get("date");
    console.log(date); // --- IGNORE ---

    console.log(times); // --- IGNORE ---
  return (
    <div>
      <h2 className="text-white">Appointments List Component</h2>
      {/* Add your appointments list related code here */}
    </div>
  );
}