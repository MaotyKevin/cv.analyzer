export default function InputForm({ onSubmit, loading, error }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const cv = e.target.cv.value.trim();
    const jobDescription = e.target.jobDescription.value.trim();
    if (cv && jobDescription) onSubmit(cv, jobDescription);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CV Match Analyzer</h1>
        <p style={styles.subtitle}>
          Paste your CV and a job description to get your match score and an optimized CV.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Your CV</label>
            <textarea
              name="cv"
              placeholder="Paste your full CV here..."
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

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Analyzing CV..." : "Analyze CV"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "720px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "#1a1a2e",
  },
  subtitle: {
    color: "#666",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },
  field: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#333",
  },
  textarea: {
    width: "100%",
    height: "180px",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.9rem",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "#e53e3e",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
};