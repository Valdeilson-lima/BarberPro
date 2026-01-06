"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

export function ButtonPickerAppointmentDate() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);

    const url = new URL(window.location.href);
    url.searchParams.set("date", event.target.value);
    router.push(url.toString());
  };

  return (
    <div className="relative w-fit">
      <input
        type="date"
        id="start"
        className="border border-barber-gold text-white p-2 rounded-md bg-barber-dark focus:outline-none focus:ring-2 focus:ring-barber-gold transition"
        value={selectedDate}
        onChange={handleChangeDate}
        style={{
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
        }}
      />
      <Calendar
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        size={20}
        color="#b8941f" 
      />
    </div>
  );
}