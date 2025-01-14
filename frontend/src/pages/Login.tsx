import React, { useState } from "react";  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email === "" || formData.password === "") {
      setError("Please fill in all fields.");
    } else {
      // Handle login logic here (e.g., API call)
      console.log("Logging in with:", formData);
    }

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json();

      
      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
      
    }

    navigate("/");

    setFormData({
        email: "",
        password: "",
    })
  };

  return (
    <div className="flex items-center justify-center h-screen">
    <div className="w-full max-w-sm mx-auto p-6 border rounded-xl shadow-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <h2 className="text-center text-3xl font-extrabold text-white mb-6">Login</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            className="w-full p-3 rounded-lg bg-white text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-white mb-2">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
            className="w-full p-3 rounded-lg bg-white text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showPassword ? <EyeOffIcon className="w-5 h-5 top-1 right-1 absolute" /> : <EyeIcon className="w-5 h-5 top-1 right-1 absolute" />}
          </button>
        </div>
        <Button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out"
        >
          Login
        </Button>
      </form>
      <div className="mt-4 text-center text-white">
        <span>Don't have an account? </span>
        <a href="/signup" className="text-blue-200 hover:underline">
          Sign Up
        </a>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
