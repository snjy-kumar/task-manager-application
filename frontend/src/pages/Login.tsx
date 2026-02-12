import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, Rocket, Moon, Sun } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      await login(trimmedEmail, trimmedPassword);

      // Redirect to the page they tried to visit or dashboard
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });

      setFormData({ email: "", password: "" });
      setError("");
    } catch (error: any) {
      // Handle different error types
      if (error.message) {
        setError(error.message);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        setError(errors.map((e: any) => e.message).join(', '));
      } else {
        setError("Invalid credentials. Please try again.");
      }
    }
    setLoading(false);
  };

  const darkMode = theme === 'dark';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Header Cell */}
          <div className={`col-span-1 md:col-span-3 rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg transform hover:scale-[1.01]`}>
            <div className="flex justify-between items-center">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
              >
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Main Form Cell */}
          <div className={`col-span-1 md:col-span-2 rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
            {error && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-600'} transition-all duration-300`}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`rounded-xl p-4 transition-all duration-300 ${activeField === 'email' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}>
                <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                    className={`pl-10 w-full py-3 pr-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              <div className={`rounded-xl p-4 transition-all duration-300 ${activeField === 'password' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}>
                <label htmlFor="password" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={`pl-10 w-full py-3 pr-10 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ?
                      <EyeOffIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /> :
                      <EyeIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    }
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 ${darkMode
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div>
                    <span>Signing In...</span>
                  </div>
                ) : "Login"}
              </Button>
            </form>
          </div>

          {/* Side Tiles */}
          <div className="col-span-1 space-y-4">
            <div className={`rounded-2xl p-6 h-40 flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} shadow-lg transform hover:scale-[1.02]`}>
              <div className="text-center">
                <Rocket className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Fast & Secure</h3>
              </div>
            </div>

            <div className={`rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} shadow-lg`}>
              <div className="text-center">
                <p className="mb-2">Trouble signing in?</p>
                <Link
                  to="/forgot-password"
                  className={`inline-block px-6 py-2 rounded-lg font-medium transition-colors ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                >
                  Reset Password
                </Link>
              </div>
            </div>

            <div className={`rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} shadow-lg transform hover:scale-[1.02]`}>
              <div className="text-center">
                <p className="mb-2">New here?</p>
                <Link
                  to="/signup"
                  className={`inline-block px-6 py-2 rounded-lg font-medium transition-colors ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Cell */}
          <div className={`col-span-1 md:col-span-3 rounded-2xl p-4 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'} shadow-lg text-center text-sm`}>
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-gray-200">Terms of Service</Link> and{" "}
            <Link to="/privacy" className="underline hover:text-gray-200">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;