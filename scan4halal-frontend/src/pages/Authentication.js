import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

function AuthPage({ onLogin, onSignup }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin({ email: formData.email, password: formData.password });
    } else {
      onSignup(formData); // signup requires name + email + password
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Only show name for signup */}
            {!isLogin && (
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button className="btn btn-outline w-full flex items-center gap-2">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center mt-4 text-sm">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span
                  className="link link-primary"
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="link link-primary"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
