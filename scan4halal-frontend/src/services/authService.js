import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../pages/Authentication";
import { AuthContext } from "../contexts/AuthContext";

function AuthService() {
  const { login } = useContext(AuthContext); // use login from context
  const [success, setSuccess] = useState(false); // for success image
  const navigate = useNavigate();

  // Handle success for both login and signup
  const handleSuccess = (data) => {
    // Update AuthContext (token + user)
    login(data.access_token, data.user);

    // Show success state
    setSuccess(true);

    // Redirect to home after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  // Login API call
  const handleLogin = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log("Login success:", data);
      handleSuccess(data);
    } catch (err) {
      console.error(err);
      alert("Login failed. Check credentials.");
    }
  };

  // Signup API call
  const handleSignup = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Signup failed");

      const data = await res.json();
      console.log("Signup success:", data);
      handleSuccess(data);
    } catch (err) {
      console.error(err);
      alert("Signup failed. Email may already exist.");
    }
  };

  // Show success image before redirect
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src="/success.png"
          alt="Success"
          className="w-32 h-32 mb-4"
        />
        <h2 className="text-xl font-semibold">Login successful!</h2>
        <p>Redirecting to home...</p>
      </div>
    );
  }

  return (
    <AuthPage
      onLogin={handleLogin}
      onSignup={handleSignup}
    />
  );
}

export default AuthService;
