import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { Crown, Sparkles } from "lucide-react";
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
                ? "border-2 border-barber-gold shadow-lg shadow-barber-gold/20"
                : "border-barber-gold/30"
            }`}
          >
            {isProfessional && (
              <div className="absolute top-0 right-0 bg-linear-to-l from-barber-gold to-barber-gold-light text-barber-primary px-4 py-2 md:py-3 rounded-t-lg font-semibold text-sm md:text-lg flex items-center gap-1 w-full justify-center">
                <Sparkles className="w-4 h-4" />
                Promoção Exclusiva
              </div>
            )}

            <CardHeader className={isProfessional ? "pt-15" : ""}>
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
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div
                      className={`mt-1 w-1.5 h-1.5 rounded-full ${
                        isProfessional ? "bg-barber-gold" : "bg-white"
                      }`}
                    />
                    <span className="text-sm text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            < CardFooter>
              <SubscriptionButton type={plan.id === "PROFESSIONAL" ? "PROFESSIONAL" : "BASIC"} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
