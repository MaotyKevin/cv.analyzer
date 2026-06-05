import { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import ResultPage from "./components/ResultPage";
import AuthPage from "./components/AuthPage";
import api from "./api/axios";
import useAuth from "./hooks/useAuth";

export default function App() {
  const { token, user, setUser, login, logout } = useAuth();
  // keep local setters for compatibility
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // App-level logout should also clear result state
  const appLogout = () => { logout(); setResult(null); };

  const analyzeCV = async (cv, jobDescription) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/analyze-cv/`, { cv, job_description: jobDescription });
      setResult(res.data);
      setUser((u) => ({ ...u, analyses_used: res.data.analyses_used }));
    } catch (err) {
      if (err.response?.data?.error === "limit_reached") {
        setError("limit_reached");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  if (!token) return <AuthPage onLogin={login} />;

  if (result) return <ResultPage result={result} onReset={reset} onLogout={logout} user={user} />;

  return (
    <InputForm
      onSubmit={analyzeCV}
      loading={loading}
      error={error}
      user={user}
      onLogout={logout}
    />
  );
}