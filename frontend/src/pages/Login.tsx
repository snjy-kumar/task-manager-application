import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.message ||
        err.response?.data?.message ||
        "Invalid credentials. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — Editorial brand side */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 bg-[hsl(222,25%,7%)] relative overflow-hidden">
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Amber glow blobs */}
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-500/12 blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-56 h-56 rounded-full bg-amber-400/8 blur-[90px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <CheckCircle2 className="w-5 h-5 text-[hsl(222,25%,7%)]" strokeWidth={2.5} />
          </div>
          <span className="text-white font-display text-xl font-semibold tracking-tight">Naumin</span>
        </div>

        {/* Main editorial copy */}
        <div className="relative z-10">
          <p className="text-amber-400/80 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            Welcome back
          </p>
          <h1 className="font-display text-5xl font-bold text-white leading-[1.1] mb-5">
            Pick up
            <br />
            where you
            <br />
            <span className="text-amber-400">left off.</span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-xs">
            Your tasks, priorities, and goals — all waiting exactly where you left them.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { value: "50k+", label: "Active users" },
            { value: "2M+", label: "Tasks completed" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="text-2xl font-display font-bold text-amber-400 mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
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
            <h2 className="font-display text-3xl font-bold text-foreground mb-2 tracking-tight">Sign in</h2>
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
                Create one free
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-amber-600 dark:text-amber-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-[hsl(222,25%,7%)] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[hsl(222,25%,7%)]/30 border-t-[hsl(222,25%,7%)] rounded-full animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground transition-colors">Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;