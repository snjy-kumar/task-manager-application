import { ClipboardList, Zap, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Capture everything",
    description:
      "Add tasks in seconds from any device. Voice, text, or paste from your clipboard — nothing gets lost.",
  },
  {
    number: "02",
    icon: Zap,
    title: "Organise automatically",
    description:
      "Smart labels, priorities, and due-date nudges keep your list from turning into a graveyard.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Track what matters",
    description:
      "Live analytics show where time goes. Spot blockers before they become problems.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="w-full py-24 md:py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
            How it works
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Simple by design.{" "}
            <span className="text-amber-500">Powerful by nature.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {/* connector line on md+ */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-border" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex flex-col md:items-start gap-5 p-6">
                {/* Number badge */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 shrink-0 relative z-10">
                  <Icon className="w-7 h-7 text-amber-500" />
                </div>

                <div>
                  <div className="text-xs font-bold tracking-widest text-amber-500/60 mb-2">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA row */}
        <div className="mt-16 flex items-center gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors"
          >
            Try it free <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-muted-foreground text-sm">
            No credit card needed
          </span>
        </div>
      </div>
    </section>
  );
}
