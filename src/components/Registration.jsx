import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supaBaseClient";

export const Registration = () => {
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [currentQualification, setCurrentQualification] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const navigate = useNavigate();

  const verifyToken = async () => {
    try {
      if (!token) {
        setErrorMessage("Please enter your access token");
        return;
      }

      // First verify if token exists and is unused
      const { data, error } = await supabase
        .from("access_tokens")
        .select("token, is_used")
        .eq("token", token.trim().toUpperCase())
        .is("is_used", false)
        .maybeSingle();

      if (error) {
        console.error("Token verification error:", error);
        setErrorMessage("Error verifying token. Please try again.");
        return;
      }

      if (!data) {
        setErrorMessage("Invalid token or token has already been used.");
        return;
      }

      // Update token status to used
      const { error: updateError } = await supabase
        .from("access_tokens")
        .update({ is_used: true })
        .eq("token", token.trim().toUpperCase());

      if (updateError) {
        console.error("Token update error:", updateError);
        setErrorMessage("Failed to validate token");
        return;
      }

      setIsTokenVerified(true);
      localStorage.setItem("userToken", token.trim().toUpperCase());
      setErrorMessage("");
    } catch (err) {
      console.error("Token verification error:", err);
      setErrorMessage("Failed to verify token");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name || !phoneNo || !currentQualification || !email) {
        setErrorMessage("Please fill in all the fields.");
        return;
      }

      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        setErrorMessage("No access token found. Please verify your token first.");
        return;
      }

      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (existingUser) {
        setErrorMessage("This email is already registered.");
        return;
      }

      const { error } = await supabase.from("users").insert([
        {
          name,
          phone_no: phoneNo,
          current_qualification: currentQualification,
          email,
          access_token: userToken,
        },
      ]);

      if (error) {
        console.error("Error saving user details:", error.message);
        if (error.code === "23505") {
          setErrorMessage("This email is already registered.");
        } else {
          setErrorMessage("Failed to save your details. Please try again.");
        }
      } else {
        setErrorMessage("");
        navigate("/instructions");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  if (!isTokenVerified) {
    return (
      <div
        className="flex items-center h-screen bg-cover bg-center pl-8"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center w-full max-w-lg bg-white bg-opacity-90 text-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Enter Access Token</h1>

          {errorMessage && (
            <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter your access token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mb-4 px-4 py-2 border rounded w-full"
          />

          <button
            onClick={verifyToken}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          >
            Verify Token
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center h-screen bg-cover bg-center pl-8"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      <div className="flex flex-col items-center justify-center w-full max-w-lg bg-white bg-opacity-90 text-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {errorMessage && (
          <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Current Educational Qualification"
          value={currentQualification}
          onChange={(e) => setCurrentQualification(e.target.value)}
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <button
          onClick={handleSubmit}
          className={`px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full ${
            !name || !phoneNo || !currentQualification || !email
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!name || !phoneNo || !currentQualification || !email}
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
};

export default Registration;