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
    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
      {availableTimeSlots.map((timeSlot) => {
        const sequenceOK = isSlotSequenceAvailable(
          timeSlot.time,
          requiredSlots,
          barberTimes,
          blockedTimes
        );

        const slotIsPast = dateIsToday && isSlotinThePast(timeSlot.time);

        const slotEnabled = timeSlot.available && sequenceOK && !slotIsPast;

        return (
          <Button
            onClick={() => onSelectTime(timeSlot.time)}
            type="button"
            variant={"outline"}
            key={timeSlot.time}
            className={cn(
              "m-1 px-4 py-2 bg-barber-primary-light border border-barber-gold-dark/50 rounded text-white hover:bg-barber-gold-dark/30 hover:text-white cursor-pointer",
              selectedTime === timeSlot.time &&
                "bg-barber-gold/80 border-white cursor-pointer",
              !slotEnabled && "opacity-50 cursor-not-allowed"
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
