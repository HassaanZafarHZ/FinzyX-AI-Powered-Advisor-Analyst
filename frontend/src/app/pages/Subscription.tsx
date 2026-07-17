import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Check } from "lucide-react";
import { Alert } from "../components/Alert";

const plans = [
  {
    name: "Free Trial",
    price: "PKR 0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Basic stock screening",
      "Limited AI queries (10/day)",
      "Portfolio tracking",
      "Email support",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    name: "Premium",
    price: "PKR 2,999",
    period: "/month",
    description: "Everything you need to invest smart",
    features: [
      "Unlimited AI Rahbar queries",
      "Advanced NLP stock screener",
      "Shariah compliance filter",
      "Roman Urdu support",
      "Real-time PSX data",
      "Dividend calendar",
      "Priority support",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    name: "Annual",
    price: "PKR 29,999",
    period: "/year",
    description: "Best value for serious investors",
    features: [
      "Everything in Premium",
      "2 months free (save 17%)",
      "Advanced portfolio analytics",
      "API access",
      "Dedicated account manager",
      "Early access to new features",
    ],
    cta: "Upgrade Now",
    popular: false,
  },
];

export const Subscription = () => {
  return (
    <AppLayout>
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Unlock the full power of AI-driven investment insights
          </p>
        </div>

        <Alert variant="warning">
          <div>
            <p className="font-semibold">Your free trial expires in 7 days</p>
            <p className="text-sm mt-1">Upgrade now to continue enjoying unlimited access to all features.</p>
          </div>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? "border-primary shadow-lg relative overflow-hidden"
                  : ""
              }
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                    Recommended
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.name === "Free Trial"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>All plans include 14-day money-back guarantee</p>
          <p>Cancel anytime. No questions asked.</p>
        </div>
      </div>
    </AppLayout>
  );
};
