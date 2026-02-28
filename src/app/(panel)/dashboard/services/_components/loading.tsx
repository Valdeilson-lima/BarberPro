export function Loading() {
  return (
    <section className="space-y-4 animate-pulse">
      <div className="rounded-xl border border-barber-gold/20 bg-barber-primary-light p-6 space-y-5">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-md bg-barber-gold/20" />
          <div className="h-4 w-80 max-w-full rounded-md bg-white/10" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="h-24 rounded-lg bg-white/10" />
          <div className="h-24 rounded-lg bg-white/10" />
          <div className="h-24 rounded-lg bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-44 rounded-xl border border-barber-gold/10 bg-barber-primary-light" />
        <div className="h-44 rounded-xl border border-barber-gold/10 bg-barber-primary-light" />
        <div className="h-44 rounded-xl border border-barber-gold/10 bg-barber-primary-light" />
        <div className="h-44 rounded-xl border border-barber-gold/10 bg-barber-primary-light" />
      </div>
    </section>
  );
}
