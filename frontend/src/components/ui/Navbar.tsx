import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Menu, X } from 'lucide-react';

const links = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-[hsl(222,25%,7%)]/90 backdrop-blur-lg border-b border-white/8 shadow-xl shadow-black/20'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
            <CheckCircle2 className="w-4 h-4 text-[hsl(222,25%,7%)]" strokeWidth={2.5} />
          </div>
          <span className="text-white font-display font-semibold text-base tracking-tight">Naumin</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${isActive(link.to)
                  ? 'text-white bg-white/10'
                  : 'text-white/55 hover:text-white hover:bg-white/8'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 h-9 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/8 transition-colors flex items-center font-medium"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 h-9 rounded-xl text-sm bg-amber-500 hover:bg-amber-600 text-[hsl(222,25%,7%)] font-semibold transition-colors flex items-center shadow-md shadow-amber-500/25"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[hsl(222,25%,7%)] border-t border-white/8 px-6 py-4">
          <nav className="flex flex-col gap-1 mb-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2.5 rounded-lg text-sm ${isActive(link.to) ? 'text-white bg-white/10' : 'text-white/55 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-4 border-t border-white/8">
            <Link to="/login" className="w-full h-10 rounded-xl text-sm text-white/70 border border-white/15 hover:bg-white/8 transition-colors flex items-center justify-center font-medium">
              Log in
            </Link>
            <Link to="/signup" className="w-full h-10 rounded-xl text-sm bg-amber-500 hover:bg-amber-600 text-[hsl(222,25%,7%)] font-semibold transition-colors flex items-center justify-center">
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
