import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — every plan comes with a 14-day free trial. No credit card required. You can upgrade, downgrade, or cancel at any time.",
  },
  {
    q: "Can I import data from Trello, Asana, or Notion?",
    a: "Yes. We support one-click CSV import and direct integrations with Trello and Asana. Notion import is available on Professional and above.",
  },
  {
    q: "How does the AI prioritisation work?",
    a: "Our model looks at due dates, task dependencies, your historical completion patterns, and calendar availability to suggest what to work on next. It learns from your feedback over time.",
  },
  {
    q: "Is my data encrypted?",
    a: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Enterprise plans also support single-tenant deployments with your own encryption keys.",
  },
  {
    q: "How many team members can I invite?",
    a: "Starter is for solo users. Professional allows unlimited team members. Enterprise adds role-based access controls and SSO.",
  },
  {
    q: "Can I self-host the application?",
    a: "Self-hosting is available on the Enterprise plan. We provide a Docker Compose setup and a Helm chart for Kubernetes.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full py-24 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
            FAQ
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Common questions
          </h2>
        </div>

        {/* Items */}
        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
              >
                <span className="font-medium text-foreground">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? "max-h-40 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <p className="mt-12 text-sm text-muted-foreground">
          Still have questions?{" "}
          <Link
            to="/contact"
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            Talk to us →
          </Link>
        </p>
      </div>
    </section>
  );
}
