import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

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
        await axios.post(`${API}/register/`, form);
        setMode("login");
        setError(null);
        return;
      }
      const res = await axios.post(`${API}/login/`, {
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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark} />
          <span style={styles.logoText}>CVMatch</span>
        </div>

        <h1 style={styles.title}>
          {mode === "login" ? "Sign in to your account" : "Create your account"}
        </h1>
        <p style={styles.subtitle}>
          {mode === "login"
            ? "Welcome back. Enter your credentials to continue."
            : "Get 3 free CV analyses. No credit card required."}
        </p>

        <form onSubmit={submit} style={styles.form}>
          <Field label="Username" name="username" value={form.username} onChange={handle} />
          {mode === "register" && (
            <Field label="Email" name="email" type="email" value={form.email} onChange={handle} />
          )}
          <Field label="Password" name="password" type="password" value={form.password} onChange={handle} />

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            disabled={loading}
          >
            {loading
              ? mode === "login" ? "Signing in..." : "Creating account..."
              : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p style={styles.switchText}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            style={styles.switchLink}
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F6F3; font-family: 'Sora', sans-serif; }
        input:focus { outline: none; border-color: #1A1A2E !important; background: #fff !important; }
        button:hover:not(:disabled) { background: #2D2B4E !important; }
      `}</style>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F6F3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Sora', sans-serif",
  },
  card: {
    background: "#fff",
    border: "1px solid #E8E6E1",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "2rem",
  },
  logoMark: {
    width: "28px",
    height: "28px",
    background: "#1A1A2E",
    borderRadius: "6px",
  },
  logoText: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1A1A2E",
    letterSpacing: "-0.02em",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1A1A2E",
    letterSpacing: "-0.02em",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#6B6966",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    marginBottom: "1.5rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.8125rem",
    fontWeight: "500",
    color: "#1A1A2E",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #E8E6E1",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontFamily: "'Sora', sans-serif",
    color: "#1A1A2E",
    background: "#FAFAF8",
    transition: "border-color 0.15s, background 0.15s",
  },
  button: {
    padding: "0.875rem",
    background: "#1A1A2E",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9375rem",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "background 0.15s",
    marginTop: "0.25rem",
  },
  buttonDisabled: {
    background: "#9490A8",
    cursor: "not-allowed",
  },
  error: {
    color: "#C0392B",
    fontSize: "0.875rem",
    padding: "0.75rem 1rem",
    background: "#FDF2F2",
    borderRadius: "8px",
    border: "1px solid #F5C6C6",
  },
  switchText: {
    fontSize: "0.875rem",
    color: "#6B6966",
    textAlign: "center",
  },
  switchLink: {
    color: "#1A1A2E",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};