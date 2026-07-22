import React from "react";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Rocket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { findUserByEmail, login } from "../store/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    dispatch(login({ user }));
    toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
    setLoading(false);
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-10 animate-scalein">
      <div className="auth-card w-full max-w-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <span className="w-10 h-10 rounded-xl bg-volt text-ink flex items-center justify-center mb-2">
            <Rocket size={20} className="fill-ink" />
          </span>
          <h1 className="font-heading text-xl font-bold">Welcome back</h1>
          <p className="text-white/40 text-sm">Login to continue to SkyMart</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            className="field"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <div className="relative">
            <input
              className="field pr-10"
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((shown) => !shown)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button disabled={loading} className="btn-volt mt-1 w-full py-2.5 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-volt font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
