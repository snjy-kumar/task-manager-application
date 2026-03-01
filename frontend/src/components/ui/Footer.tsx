import { Link } from "react-router-dom";
import { CheckCircle2, Github, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";

const nav = {
  Product: [
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Changelog", to: "/blog" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ],
  Resources: [
    { label: "FAQ", to: "/faq" },
    { label: "Documentation", to: "#" },
    { label: "API", to: "#" },
  ],
  Legal: [
    { label: "Privacy", to: "#" },
    { label: "Terms", to: "#" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      className="border-t border-white/8 text-white"
      style={{ background: "hsl(222,25%,5%)" }}
    >
      {/* Newsletter strip */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-white">Stay in the loop</p>
            <p className="text-white/50 text-sm mt-0.5">
              Product updates, tips, and productivity guides.
            </p>
          </div>
          {subscribed ? (
            <span className="text-amber-400 text-sm font-medium">
              ✓ You're subscribed!
            </span>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 sm:w-56 px-4 py-2 rounded-lg bg-white/8 border border-white/12 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-6 gap-10">
        {/* Brand col */}
        <div className="col-span-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-black" />
            </div>
            <span
              className="font-bold text-white text-lg"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Naumin
            </span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            The Naumin built for how people actually work. Fast, focused,
            and smart.
          </p>

          {/* Socials */}
          <div className="flex gap-3 mt-6">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg border border-white/12 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Nav cols */}
        {Object.entries(nav).map(([group, links]) => (
          <div key={group}>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">
              {group}
            </p>
            <ul className="space-y-3">
              {links.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© {new Date().getFullYear()} Naumin. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="#" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white/60 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
