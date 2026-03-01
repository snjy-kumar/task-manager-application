import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Switching to this tool cut our sprint planning from 2 hours to 20 minutes. Our team ships twice as fast now.",
    author: "Sarah M.",
    title: "Engineering Lead, Vercel",
    initials: "SM",
  },
  {
    quote:
      "Finally a task manager that gets out of my way. The amber dashboard is clean and the keyboard shortcuts are A+.",
    author: "David Chen",
    title: "Senior Software Engineer",
    initials: "DC",
  },
  {
    quote:
      "We tried Asana, Notion, Linear. This is the first one our whole team actually uses every day.",
    author: "Emily J.",
    title: "Head of Product, Stripe",
    initials: "EJ",
  },
  {
    quote:
      "The analytics showed me I was spending 60% of my time on low-priority work. That alone was worth it.",
    author: "Michael Brown",
    title: "Founder, Launchpad",
    initials: "MB",
  },
  {
    quote:
      "Set it up in under 5 minutes and imported my Trello boards in one click. Genuinely impressive onboarding.",
    author: "Jane Doe",
    title: "Freelance Designer",
    initials: "JD",
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <section
      id="testimonials"
      className="w-full py-24 md:py-32"
      style={{ background: "hsl(222,25%,7%)" }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            What people say
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Trusted by teams that{" "}
            <span className="text-amber-400">ship.</span>
          </h2>
        </div>

        {/* Card */}
        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8">
            "{t.quote}"
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: "hsl(38,95%,54%)" }}
            >
              {t.initials}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{t.author}</div>
              <div className="text-white/50 text-xs">{t.title}</div>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-amber-400 w-4" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
