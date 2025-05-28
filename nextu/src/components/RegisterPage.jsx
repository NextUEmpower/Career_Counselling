import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supaBaseClient";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Registration failed:", error.message);
      alert("❌ Registration failed. Please try again.");
    } else {
      alert("🎉 Registration successful! Redirecting to the first test...");
      navigate("/personality"); // Redirect to the first test
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-64"
      />
      <button
        onClick={handleRegister}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Register
      </button>
    </div>
  );
};

export default RegisterPage;