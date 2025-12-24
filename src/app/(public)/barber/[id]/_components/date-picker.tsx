"uae client";
import { useState } from "react";
import Datepicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";


registerLocale("ptBR", ptBR);

interface DateTimerPickerProps {
  minDate?: Date;
  className?: string;
  initialDate?: Date;
  onChange: (date: Date) => void;
}

export function DateTimerPicker({
  minDate,
  className,
  initialDate,
  onChange,
}: DateTimerPickerProps) {
  const [startDate, setStartDate] = useState(initialDate || new Date());

  function handleChange(date: Date | null) {
    if (date) {
      console.log(date);
      setStartDate(date);
      onChange(date);
    }
  }

  return (
    <Datepicker
      className={className}
      selected={startDate}
      locale="ptBR"
      minDate={minDate ?? new Date()}
      onChange={handleChange}
    />
  );
}
