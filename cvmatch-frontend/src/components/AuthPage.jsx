import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/env";
import "../styles/components/AuthPage.css";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "register") {
        await axios.post(`${API_BASE_URL}/register/`, form);
        setMode("login");
        setError(null);
        return;
      }
      const res = await axios.post(`${API_BASE_URL}/login/`, {
        username: form.username,
        password: form.password,
      });
      onLogin(res.data.access);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-row">
          <div className="auth-logo-mark" />
          <span className="auth-logo-text">CVMatch</span>
        </div>

        <h1 className="auth-title">
          {mode === "login" ? "Sign in to your account" : "Create your account"}
        </h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Welcome back. Enter your credentials to continue."
            : "Get 3 free CV analyses. No credit card required."}
        </p>

        <form onSubmit={submit} className="auth-form">
          <Field label="Username" name="username" value={form.username} onChange={handle} />
          {mode === "register" && (
            <Field label="Email" name="email" type="email" value={form.email} onChange={handle} />
          )}
          <Field label="Password" name="password" type="password" value={form.password} onChange={handle} />

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className={`auth-button${loading ? " auth-button-disabled" : ""}`}
            disabled={loading}
          >
            {loading
              ? mode === "login" ? "Signing in..." : "Creating account..."
              : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="auth-switch-text">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            className="auth-switch-link"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange }) {
  return (
    <div className="auth-field">
      <label className="auth-label">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="auth-input"
      />
    </div>
  );
}
