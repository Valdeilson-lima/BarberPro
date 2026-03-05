"use client";

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/lib/utils";
import { isSlotinThePast, isToday } from "./schedule-utils";
import { isSlotSequenceAvailable } from "./schedule-utils";

interface ScheduleTimesListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlots: TimeSlot[];
  barberTimes: string[];
  onSelectTime: (time: string) => void;
}

export function ScheduleTimesList({
  selectedDate,
  selectedTime,
  requiredSlots,
  blockedTimes,
  availableTimeSlots,
  barberTimes,
  onSelectTime,
}: ScheduleTimesListProps) {
  const dateIsToday = isToday(selectedDate);

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {availableTimeSlots.map((timeSlot) => {
        const sequenceOK = isSlotSequenceAvailable(
          timeSlot.time,
          requiredSlots,
          barberTimes,
          blockedTimes,
        );

        const slotIsPast = dateIsToday && isSlotinThePast(timeSlot.time);
        const slotEnabled = timeSlot.available && sequenceOK && !slotIsPast;

        return (
          <Button
            onClick={() => onSelectTime(timeSlot.time)}
            type="button"
            variant="outline"
            key={timeSlot.time}
            className={cn(
              "m-0 h-10 rounded-lg border border-barber-gold-dark/50 bg-barber-primary-light/70 px-2 text-sm font-medium text-white transition-all hover:border-barber-gold hover:bg-barber-gold/15 hover:text-white",
              selectedTime === timeSlot.time &&
                "border-barber-gold bg-barber-gold/80 text-barber-primary shadow-md shadow-barber-gold/20",
              !slotEnabled && "cursor-not-allowed border-white/10 bg-barber-primary-dark/70 text-white/35",
            )}
            disabled={slotIsPast || !slotEnabled}
          >
            {timeSlot.time}
          </Button>
        );
      })}
    </div>
  );
}
