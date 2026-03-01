import { CheckCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "9",
    period: "/ mo",
    description: "Perfect for solo workers managing their own workflow.",
    features: [
      "Up to 3 projects",
      "Basic task organisation",
      "1 GB storage",
      "Email support",
      "Standard analytics",
    ],
    cta: "Start free trial",
    ctaHref: "/signup?plan=starter",
  },
  {
    name: "Professional",
    price: "19",
    period: "/ mo",
    description: "For teams that need collaboration and smart features.",
    features: [
      "Unlimited projects",
      "AI priority suggestions",
      "10 GB storage",
      "Priority support",
      "Team collaboration",
      "Custom integrations",
      "Advanced analytics",
    ],
    cta: "Get Professional",
    ctaHref: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "49",
    period: "/ mo",
    description: "For organisations that need control and compliance.",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "SSO / SAML",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom contracts",
    ],
    cta: "Contact sales",
    ctaHref: "/contact",
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="w-full py-24 md:py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
            Pricing
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Simple plans.{" "}
            <span className="text-amber-500">No surprises.</span>
          </h2>
          <p className="text-muted-foreground mt-4">
            14-day free trial on every plan. No credit card required. Cancel
            anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-7 border transition-all ${
                plan.highlighted
                  ? "border-amber-500/50 bg-amber-500/5"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-7">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
                    <Zap className="w-3 h-3" /> Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm font-semibold text-amber-500 mb-1">
                  {plan.name}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm pb-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-3">
                  {plan.description}
                </p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaHref}
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-amber-500 hover:bg-amber-400 text-black"
                    : "border border-border hover:border-foreground/30 text-foreground"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
