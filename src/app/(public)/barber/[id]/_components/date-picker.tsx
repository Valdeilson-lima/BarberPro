"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (initialDate) {
      setStartDate(initialDate);
    }
  }, [initialDate]);

  function handleChange(date: Date | null) {
    if (!date) return;
    setStartDate(date);
    onChange(date);
  }

  return (
    <Datepicker
      className={className}
      selected={startDate}
      locale="ptBR"
      minDate={minDate ?? new Date()}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"
      popperClassName="barber-datepicker-popper"
      calendarClassName="barber-datepicker"
      showPopperArrow={false}
      wrapperClassName="w-full"
    />
  );
}
