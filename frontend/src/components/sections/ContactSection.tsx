import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const inputBase =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 transition-colors";

  return (
    <section id="contact" className="w-full py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — info */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
              Contact
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Let's talk.
            </h2>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-10">
              Whether you have a question, a feature request, or just want to
              say hello — we read every message.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground mb-0.5">
                    Email
                  </div>
                  <div className="text-sm text-muted-foreground">
                    hello@taskmanager.app
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground mb-0.5">
                    Based in
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Remote-first — team across 3 continents
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-card border border-border rounded-2xl p-7">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-64 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Send className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-semibold text-foreground">Message sent!</h3>
                <p className="text-muted-foreground text-sm">
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Smith"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@example.com"
                      className={inputBase}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-medium text-muted-foreground mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium text-muted-foreground mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more..."
                    className={inputBase + " resize-none"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-semibold text-sm transition-colors"
                >
                  {sending ? "Sending…" : "Send message"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
