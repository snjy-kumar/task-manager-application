import React, { useState } from "react";  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react"; 
import { useNavigate } from "react-router-dom";



interface SignupFormData {
  name:string,
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    name:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    formData.name === "" ||
    formData.email === "" ||
    formData.password === "" ||
    formData.confirmPassword === ""
  ) {
    setError("Please fill in all fields.");
    return;
  } else if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
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
      // Handle success: save token, redirect, etc.
      console.log("Signup successful:", data);
      localStorage.setItem("token", data.token);  // Save token to localStorage or cookies
    } else {
      // Handle errors, show error message
      setError(data.error || "An error occurred. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    setError("There was an issue connecting to the server.");
  }

  navigate("/");

  // Reset form after submission
  setFormData({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
}
  return (

    <div className="flex items-center justify-center h-screen">
    <div className="w-full max-w-sm mx-auto p-6 border rounded-xl shadow-xl bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600">
      <h2 className="text-center text-3xl font-extrabold text-white mb-6">Sign Up</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 rounded-lg bg-white text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
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
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full p-3 rounded-lg bg-white text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showConfirmPassword ? <EyeOffIcon className="w-5 h-5 top-1 right-1 absolute" /> : <EyeIcon className="w-5 h-5 top-1 right-1 absolute" />}
          </button>
        </div>
        <Button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out"
        >
          Sign Up
        </Button>
      </form>
      <div className="mt-4 text-center text-white">
        <span>Already have an account? </span>
        <a href="/login" className="text-blue-200 hover:underline">
          Login
        </a>
      </div>
    </div>
    </div>
  );
};

export default SignupPage;
