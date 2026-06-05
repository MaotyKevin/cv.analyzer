import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { AUTH_TOKEN_STORAGE_KEY } from "../config/env";

export default function useAuth() {
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || null);
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/me/");
      setUser(res.data);
    } catch {
      logout();
    }
  }, []);

  useEffect(() => {
    if (token) fetchUser();
  }, [token, fetchUser]);

  const login = useCallback((accessToken) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return { token, user, setUser, login, logout, fetchUser };
}
