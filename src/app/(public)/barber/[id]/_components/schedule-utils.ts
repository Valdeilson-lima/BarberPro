export function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Verificar se o horário selecionado está no passado
 */
export function isSlotinThePast(slotTime: string) {
  const [slothour, slotMinute] = slotTime.split(":").map(Number);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (slothour < currentHour) {
    return true;
  } else if (slothour === currentHour && slotMinute <= currentMinute) {
    return true;
  }
  return false;
}


export function isSlotSequenceAvailable(
  startTime: string,
  requiredSlots: number,
  allSlots: string[],
  blockedSlots: string[]
) {
    const startIndex = allSlots.indexOf(startTime);
    
    if (startIndex === -1 || startIndex + requiredSlots > allSlots.length) {
        return false;
    }

    for (let i = startIndex; i < startIndex + requiredSlots; i++) {
        const slotTime = allSlots[i];

        if (blockedSlots.includes(slotTime)) {
            console.log(`Slot ${slotTime} is blocked.`);
            return false;
        }
    }
    return true;
}