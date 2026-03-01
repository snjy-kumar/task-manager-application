import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, ArrowRight, CheckCircle2, Check } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/authService";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const perks = [
  "Unlimited tasks & projects",
  "Smart reminders & priorities",
  "Team collaboration tools",
  "Analytics & productivity insights",
];

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const validation = authService.validatePassword(formData.password);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err.message ||
        err.response?.data?.message ||
        "An error occurred. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 bg-[hsl(222,25%,7%)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-amber-400/8 blur-[90px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <CheckCircle2 className="w-5 h-5 text-[hsl(222,25%,7%)]" strokeWidth={2.5} />
          </div>
          <span className="text-white font-display text-xl font-semibold tracking-tight">Naumin</span>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <p className="text-amber-400/80 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            Get started free
          </p>
          <h1 className="font-display text-5xl font-bold text-white leading-[1.1] mb-5">
            Organize
            <br />
            everything.
            <br />
            <span className="text-amber-400">Stress less.</span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-xs mb-8">
            Join thousands of teams who ship more with Naumin's AI-powered task management.
          </p>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white/70 text-sm">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-amber-400" strokeWidth={2.5} />
                </div>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Free badge */}
        <div className="relative z-10 bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="text-amber-400 text-sm font-semibold mb-1">Free forever plan</div>
          <div className="text-white/40 text-sm">No credit card required. Upgrade whenever you're ready.</div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[hsl(40,30%,97%)] dark:bg-[hsl(222,22%,8%)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-xl">Naumin</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2 tracking-tight">Create your account</h2>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                autoComplete="name"
                className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
              />
            </div>

            {/* Passwords side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password match hint */}
            {formData.password && formData.confirmPassword && (
              <p className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-[hsl(222,25%,7%)] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[hsl(222,25%,7%)]/30 border-t-[hsl(222,25%,7%)] rounded-full animate-spin" />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create free account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground transition-colors">Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
