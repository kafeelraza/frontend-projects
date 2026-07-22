import React from "react";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Rocket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { emailExists, register } from "../store/authSlice";

const strengthOf = (password) => {
  if (password.length < 6) return { label: "Weak", color: "bg-red-500", width: "33%" };
  if (password.length < 10) return { label: "Medium", color: "bg-amber-400", width: "66%" };
  return { label: "Strong", color: "bg-volt", width: "100%" };
};

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const strength = form.password ? strengthOf(form.password) : null;

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const { name, email, password, confirm } = form;
    if (!name || !email || !password || !confirm) return setError("All fields are required");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    if (emailExists(email)) return setError("Email already registered!");

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    dispatch(register({ name, email, password }));
    toast.success(`Welcome, ${name.split(" ")[0]}!`);
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
          <h1 className="font-heading text-xl font-bold">Create account</h1>
          <p className="text-white/40 text-sm">Join SkyMart today</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input className="field" placeholder="Full name" value={form.name} onChange={set("name")} />
          <input className="field" type="email" placeholder="Email address" value={form.email} onChange={set("email")} />
          <div className="relative">
            <input
              className="field pr-10"
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={set("password")}
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
          {strength && (
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
              </div>
              <span className="text-[11px] text-white/45">{strength.label}</span>
            </div>
          )}
          <input
            className="field"
            type={showPw ? "text" : "password"}
            placeholder="Confirm password"
            value={form.confirm}
            onChange={set("confirm")}
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button disabled={loading} className="btn-volt mt-1 w-full py-2.5 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-volt font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
