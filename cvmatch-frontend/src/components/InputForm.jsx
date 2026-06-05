export default function InputForm({ onSubmit, loading, error, user, onLogout }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const cv = e.target.cv.value.trim();
    const jobDescription = e.target.jobDescription.value.trim();
    if (cv && jobDescription) onSubmit(cv, jobDescription);
  };

  const remaining = user ? user.free_limit - user.analyses_used : null;

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.header}>
            <div style={styles.logoMark} />
            <span style={styles.logoText}>CVMatch</span>
          </div>

          {user && (
            <div style={styles.statusRight}>
              <span style={styles.usagePill}>
                {remaining} free {remaining === 1 ? "analysis" : "analyses"} remaining
              </span>
              <span style={styles.username}>{user.username}</span>
              <button onClick={onLogout} style={styles.logoutButton}>Sign out</button>
            </div>
          )}
        </div>

        <div style={styles.hero}>
          <h1 style={styles.title}>Know exactly how your CV performs</h1>
          <p style={styles.subtitle}>
            Paste your CV and a job description. Get an instant match score,
            a gap analysis, and a tailored rewrite — ready to submit.
          </p>
        </div>

        {error === "limit_reached" ? (
          <div style={styles.upgradeBox}>
            <div style={styles.upgradeInner}>
              <p style={styles.upgradeTitle}>You have used all {user?.free_limit} free analyses</p>
              <p style={styles.upgradeText}>
                Upgrade to continue analyzing and optimizing CVs without limits.
              </p>
              <button style={styles.upgradeButton}>
                Upgrade — coming soon
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Your CV</label>
                <textarea
                  name="cv"
                  placeholder="Paste your CV here..."
                  style={styles.textarea}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Job Description</label>
                <textarea
                  name="jobDescription"
                  placeholder="Paste the job description here..."
                  style={styles.textarea}
                  required
                />
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              type="submit"
              style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.buttonInner}>
                  <span style={styles.spinner} />
                  Analyzing...
                </span>
              ) : (
                "Analyze CV"
              )}
            </button>
          </form>
        )}

        <div style={styles.trust}>
          <span style={styles.trustItem}>Instant analysis</span>
          <span style={styles.dot} />
          <span style={styles.trustItem}>ATS-aware scoring</span>
          <span style={styles.dot} />
          <span style={styles.trustItem}>Rewritten CV included</span>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #F7F6F3;
          font-family: 'Sora', sans-serif;
        }

        textarea:focus {
          outline: none;
          border-color: #1A1A2E !important;
          background: #fff !important;
        }

        textarea::placeholder {
          color: #AEACAA;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
        }

        button:hover:not(:disabled) {
          opacity: 0.85;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 700px) {
          .form-row { flex-direction: column !important; }
        }
      `}</style>
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
    padding: "3rem 1.5rem",
    fontFamily: "'Sora', sans-serif",
  },
  wrapper: {
    width: "100%",
    maxWidth: "900px",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "3rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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
  statusRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  usagePill: {
    fontSize: "0.8125rem",
    color: "#6B6966",
    background: "#F0EFF9",
    padding: "0.3rem 0.75rem",
    borderRadius: "20px",
    fontWeight: "500",
  },
  username: {
    fontSize: "0.875rem",
    color: "#3A3835",
    fontWeight: "500",
  },
  logoutButton: {
    fontSize: "0.8125rem",
    color: "#6B6966",
    background: "transparent",
    border: "1px solid #E8E6E1",
    borderRadius: "6px",
    padding: "0.3rem 0.75rem",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "opacity 0.15s",
  },
  hero: {
    marginBottom: "2.5rem",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "600",
    color: "#1A1A2E",
    letterSpacing: "-0.03em",
    lineHeight: "1.2",
    marginBottom: "0.75rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6B6966",
    lineHeight: "1.65",
    maxWidth: "560px",
  },
  form: {
    background: "#fff",
    border: "1px solid #E8E6E1",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "1.5rem",
  },
  row: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  field: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.8125rem",
    fontWeight: "500",
    color: "#1A1A2E",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  textarea: {
    width: "100%",
    height: "240px",
    padding: "0.875rem 1rem",
    border: "1px solid #E8E6E1",
    borderRadius: "10px",
    fontSize: "0.875rem",
    lineHeight: "1.6",
    resize: "vertical",
    fontFamily: "'Sora', sans-serif",
    color: "#1A1A2E",
    background: "#FAFAF8",
    transition: "border-color 0.15s, background 0.15s",
  },
  button: {
    width: "100%",
    padding: "0.9rem",
    background: "#1A1A2E",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.9375rem",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    letterSpacing: "-0.01em",
    transition: "opacity 0.15s",
  },
  buttonDisabled: {
    background: "#9490A8",
    cursor: "not-allowed",
  },
  buttonInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  error: {
    color: "#C0392B",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    padding: "0.75rem 1rem",
    background: "#FDF2F2",
    borderRadius: "8px",
    border: "1px solid #F5C6C6",
  },
  upgradeBox: {
    background: "#fff",
    border: "1px solid #E8E6E1",
    borderRadius: "16px",
    padding: "3rem 2rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeInner: {
    textAlign: "center",
    maxWidth: "380px",
  },
  upgradeTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1A1A2E",
    letterSpacing: "-0.02em",
    marginBottom: "0.625rem",
  },
  upgradeText: {
    fontSize: "0.9rem",
    color: "#6B6966",
    lineHeight: "1.6",
    marginBottom: "1.75rem",
  },
  upgradeButton: {
    padding: "0.8rem 2rem",
    background: "#1A1A2E",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "opacity 0.15s",
  },
  trust: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    justifyContent: "center",
  },
  trustItem: {
    fontSize: "0.8125rem",
    color: "#9B9894",
  },
  dot: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "#C8C6C2",
  },
};