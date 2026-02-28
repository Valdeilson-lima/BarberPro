import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import { SubscriptionButton } from "./subscription-button";

export function GrisdPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {subscriptionPlans.map((plan, index) => {
        const isProfessional = plan.id === "PROFESSIONAL";

        return (
          <Card
            key={index}
            className={`relative overflow-hidden transition-all hover:shadow-xl bg-barber-primary ${
              isProfessional
                ? "border-2 border-barber-gold shadow-lg shadow-barber-gold/25 hover:-translate-y-1"
                : "border-barber-gold/30 hover:border-barber-gold/55"
            }`}
          >
            {isProfessional && (
              <div className="absolute top-0 right-0 bg-linear-to-l from-barber-gold to-barber-gold-light text-barber-primary px-4 py-2 md:py-3 rounded-t-lg font-semibold text-sm md:text-lg flex items-center gap-1 w-full justify-center">
                <Sparkles className="w-4 h-4" />
                Promoção Exclusiva
              </div>
            )}

            <CardHeader className={isProfessional ? "pt-15 space-y-2" : "space-y-2"}>
              <div className="flex items-center gap-2 mb-2">
                {isProfessional && (
                  <Crown className="w-6 h-6 text-barber-gold" />
                )}
                <CardTitle
                  className={`text-2xl ${
                    isProfessional ? "text-barber-gold" : "text-white"
                  }`}
                >
                  {plan.name}
                </CardTitle>
              </div>
              <CardDescription className="text-base text-gray-300">
                {plan.description}
              </CardDescription>
              <div className="inline-flex w-fit rounded-full border border-barber-gold/20 bg-barber-primary-light px-2.5 py-1 text-xs text-gray-200">
                {isProfessional ? "Mais escolhido por barbearias em crescimento" : "Ideal para começar"}
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-6 p-4 bg-barber-primary-light rounded-lg border border-barber-gold/20">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-bold ${
                      isProfessional ? "text-barber-gold" : "text-white"
                    }`}
                  >
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">/mês</span>
                </div>
                <span className="text-lg text-gray-400 line-through">
                  De R$ {plan.olPrice.toFixed(2)}
                </span>
                <p className="text-xs text-emerald-300 mt-1">
                  Economia de R$ {(plan.olPrice - plan.price).toFixed(2)} por mês
                </p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        isProfessional ? "text-barber-gold" : "text-gray-200"
                      }`}
                    />
                    <span className="text-sm text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <SubscriptionButton
                type={plan.id === "PROFESSIONAL" ? "PROFESSIONAL" : "BASIC"}
              />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
