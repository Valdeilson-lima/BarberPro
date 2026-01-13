import { Loading as LoadingSpinner } from "@/components/ui/loading";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-32">
      <LoadingSpinner
        size="lg"
        variant="barber"
        text="Carregando serviços..."
      />
    </div>
  );
}
