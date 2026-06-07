import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultPage from "./components/ResultPage";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import api from "./api/axios";
import useAuth from "./hooks/useAuth";

export default function App() {
  const { token, user, setUser, login, logout } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const appLogout = () => { logout(); setResult(null); setShowAuth(false); };

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

  const reset = () => { setResult(null); setError(null); };

  // 1. Not logged in + not asking for auth → Landing page
  if (!token && !showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // 2. Not logged in + clicked Get Started → Auth page
  if (!token && showAuth) {
    return <AuthPage onLogin={login} />;
  }

  // 3. Logged in + has result → Result page
  if (result) {
    return <ResultPage result={result} onReset={reset} onLogout={appLogout} user={user} />;
  }

  // 4. Logged in → Input form
  return (
    <InputForm
      onSubmit={analyzeCV}
      loading={loading}
      error={error}
      user={user}
      onLogout={appLogout}
    />
  );
}
