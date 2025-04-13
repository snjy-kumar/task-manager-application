import React, { useState, useEffect } from "react";  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, UserIcon, MailIcon, LockIcon, Sparkles } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Animation states
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [darkMode]);

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

    if (
      formData.name.trim() === "" ||
      formData.email.trim() === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    } else if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error:any) {
      setError("There was an issue connecting to the server.");
    }

    setLoading(false);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    setAnimate(true);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-4xl ${animate ? 'animate-pulse' : ''}`}>
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Header Cell - Spans 3 columns */}
          <div className={`col-span-1 md:col-span-3 rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg transform hover:scale-[1.01]`}>
            <div className="flex justify-between items-center">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          {/* Main Form Cell - Spans 2 columns */}
          <div className={`col-span-1 md:col-span-2 rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
            {error && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-600'} transition-all duration-300`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`rounded-xl p-4 transition-all duration-300 ${activeField === 'name' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    placeholder="John Doe"
                    className={`pl-10 w-full p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              <div className={`rounded-xl p-4 transition-all duration-300 ${activeField === 'email' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                    className={`pl-10 w-full p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 transition-all duration-300 ${activeField === 'password' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={`pl-10 w-full p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
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

                <div className={`rounded-xl p-4 transition-all duration-300 ${activeField === 'confirmPassword' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => handleFocus('confirmPassword')}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={`pl-10 w-full p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? 
                        <EyeOffIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /> : 
                        <EyeIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      }
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div>
                    <span>Creating...</span>
                  </div>
                ) : "Create Account"}
              </Button>
            </form>
          </div>

          {/* Side Tiles - Stacked in a column */}
          <div className="col-span-1 space-y-4">
            {/* Top Highlight Tile */}
            <div className={`rounded-2xl p-6 h-40 flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} shadow-lg transform hover:scale-[1.02]`}>
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Join Today</h3>
              </div>
            </div>

            {/* Password Match Indicator */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${
              formData.password && formData.confirmPassword 
                ? (formData.password === formData.confirmPassword 
                  ? (darkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800') 
                  : (darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'))
                : (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500')
            } shadow-lg`}>
              <div className="text-center">
                <h3 className="text-lg font-medium">Password Status</h3>
                <p className="mt-2">
                  {!formData.password && !formData.confirmPassword 
                    ? "Enter passwords" 
                    : (formData.password === formData.confirmPassword 
                      ? "Passwords match ✓" 
                      : "Passwords don't match ✗")}
                </p>
              </div>
            </div>

            {/* Login Link Tile */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} shadow-lg transform hover:scale-[1.02]`}>
              <div className="text-center">
                <p className="mb-2">Already have an account?</p>
                <a 
                  href="/login" 
                  className={`inline-block px-6 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Log In
                </a>
              </div>
            </div>
          </div>

          {/* Footer Cell - Spans 3 columns */}
          <div className={`col-span-1 md:col-span-3 rounded-2xl p-4 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'} shadow-lg text-center text-sm`}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;