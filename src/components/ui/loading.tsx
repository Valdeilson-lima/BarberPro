import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "barber" | "dots" | "pulse";
  text?: string;
  fullscreen?: boolean;
  className?: string;
}

export function Loading({
  size = "md",
  variant = "barber",
  text,
  fullscreen = false,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const renderSpinner = () => {
    switch (variant) {
      case "spinner":
        return (
          <div
            className={cn(
              "animate-spin rounded-full border-4 border-barber-gold/30 border-t-barber-gold",
              sizeClasses[size]
            )}
          />
        );

      case "barber":
        return (
          <div className="relative">
            {/* Tesoura animada */}
            <svg
              className={cn("animate-bounce", sizeClasses[size])}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lâmina esquerda */}
              <path
                d="M6 7C7.10457 7 8 6.10457 8 5C8 3.89543 7.10457 3 6 3C4.89543 3 4 3.89543 4 5C4 6.10457 4.89543 7 6 7Z"
                className="fill-barber-gold animate-pulse"
              />
              {/* Lâmina direita */}
              <path
                d="M18 7C19.1046 7 20 6.10457 20 5C20 3.89543 19.1046 3 18 3C16.8954 3 16 3.89543 16 5C16 6.10457 16.8954 7 18 7Z"
                className="fill-barber-gold-light animate-pulse"
                style={{ animationDelay: "150ms" }}
              />
              {/* Corpo da tesoura */}
              <path
                d="M6 5L12 12M18 5L12 12M12 12L12 21"
                className="stroke-barber-gold-dark"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Círculo central */}
              <circle
                cx="12"
                cy="12"
                r="1.5"
                className="fill-barber-gold animate-ping"
              />
            </svg>
          </div>
        );

      case "dots":
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={cn(
                  "rounded-full bg-barber-gold animate-bounce",
                  size === "sm" && "w-2 h-2",
                  size === "md" && "w-3 h-3",
                  size === "lg" && "w-4 h-4",
                  size === "xl" && "w-6 h-6"
                )}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div className="relative">
            <div
              className={cn(
                "rounded-full bg-barber-gold animate-ping absolute inset-0",
                sizeClasses[size]
              )}
            />
            <div
              className={cn(
                "rounded-full bg-barber-gold-dark relative",
                sizeClasses[size]
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullscreen && "fixed inset-0 bg-barber-primary/95 z-50",
        className
      )}
    >
      {renderSpinner()}
      {text && (
        <p
          className={cn(
            "font-medium text-white animate-pulse",
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  return content;
}

// Componente de Loading inline para textos
export function LoadingInline({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="inline-block w-4 h-4 border-2 border-barber-gold/30 border-t-barber-gold rounded-full animate-spin" />
      <span className="text-sm text-white/80">Carregando...</span>
    </span>
  );
}

// Componente de Loading para botões
export function LoadingButton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>Carregando...</span>
    </div>
  );
}

// Skeleton Loader personalizado
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = "bg-barber-gold/10 animate-pulse";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const skeletonElement = (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{
        width: width || "100%",
        height: height || (variant === "text" ? "1rem" : "100%"),
      }}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{skeletonElement}</div>
        ))}
      </div>
    );
  }

  return skeletonElement;
}

// Loading específico para cards
export function LoadingCard() {
  return (
    <div className="bg-barber-primary-light p-6 rounded-lg border-2 border-barber-gold/20 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={100} />
      <div className="flex justify-between">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

// Loading específico para tabelas
export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-barber-primary-light rounded-t-lg">
        <Skeleton width="30%" height={20} />
        <Skeleton width="25%" height={20} />
        <Skeleton width="25%" height={20} />
        <Skeleton width="20%" height={20} />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 bg-barber-primary-light/50 border-b border-barber-gold/10"
        >
          <Skeleton width="30%" height={16} />
          <Skeleton width="25%" height={16} />
          <Skeleton width="25%" height={16} />
          <Skeleton width="20%" height={16} />
        </div>
      ))}
    </div>
  );
}
