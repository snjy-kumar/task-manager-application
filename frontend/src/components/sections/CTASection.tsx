import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  const perks = [
    "14-day free trial, no credit card required",
    "Unlimited tasks on all paid plans",
    "Priority support & onboarding call",
  ];

  return (
    <section
      id="cta"
      className="w-full py-24 md:py-32"
      style={{ background: "hsl(222,25%,7%)" }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
        {/* Label */}
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-6">
          Get started today
        </span>

        {/* Headline */}
        <h2
          className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          You're one click away from{" "}
          <span className="text-amber-400">getting more done.</span>
        </h2>

        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
          Join thousands of teams who ship faster, stress less, and stay
          focused with a Naumin built for real work.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-white/15 text-white/80 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Perks */}
        <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-white/50 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
