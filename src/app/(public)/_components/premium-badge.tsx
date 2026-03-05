import { Star } from "lucide-react";

export function PremiumBadge() {
  return (
    <div className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full border border-barber-gold/35 bg-barber-primary/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-barber-gold shadow-md shadow-barber-gold/30 backdrop-blur-sm">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-barber-gold/20">
        <Star className="h-3 w-3 fill-barber-gold text-barber-gold" />
      </span>
      Premium
    </div>
  );
}
