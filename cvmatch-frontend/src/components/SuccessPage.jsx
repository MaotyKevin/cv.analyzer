import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark} />
          <span style={styles.logoText}>CVMatch</span>
        </div>
        <p style={styles.title}>Payment confirmed</p>
        <p style={styles.text}>
          Your account has been upgraded. You now have unlimited CV analyses.
          Redirecting you back...
        </p>
      </div>
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
    fontFamily: "'Sora', sans-serif",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #E8E6E1",
    borderRadius: "16px",
    padding: "2.5rem",
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1A6B3C",
    marginBottom: "0.75rem",
    letterSpacing: "-0.02em",
  },
  text: {
    fontSize: "0.9rem",
    color: "#6B6966",
    lineHeight: "1.6",
  },
};