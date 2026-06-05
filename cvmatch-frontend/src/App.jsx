import { useState, useEffect } from "react";
import axios from "axios";
import InputForm from "./components/InputForm";
import ResultPage from "./components/ResultPage";
import AuthPage from "./components/AuthPage";
import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from "./config/env";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || null);
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      logout();
    }
  };

  const login = (accessToken) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setResult(null);
  };

  const analyzeCV = async (cv, jobDescription) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/analyze-cv/`,
        { cv, job_description: jobDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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