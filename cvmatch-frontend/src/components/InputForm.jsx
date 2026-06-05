import "../styles/components/InputForm.css";
import api from "../api/axios";

export default function InputForm({ onSubmit, loading, error, user, onLogout }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const cv = e.target.cv.value.trim();
    const jobDescription = e.target.jobDescription.value.trim();
    if (cv && jobDescription) onSubmit(cv, jobDescription);
  };

  const handleUpgrade = async () => {
    try {
      const res = await api.post("/create-checkout-session/");
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const remaining = user?.is_paid ? "Unlimited" : user ? user.free_limit - user.analyses_used : null;

  return (
    <div className="input-page">
      <div className="input-wrapper">

        {/* Top bar */}
        <div className="input-top-bar">
          <div className="input-header">
            <div className="input-logo-mark" />
            <span className="input-logo-text">CVMatch</span>
          </div>

          {user && (
            <div className="input-status-right">
              <span className="input-usage-pill">
                {user?.is_paid ? "Unlimited analyses" : `${remaining} free ${remaining === 1 ? "analysis" : "analyses"} remaining`}
              </span>
              <span className="input-username">{user.username}</span>
              <button onClick={onLogout} className="input-logout-button">Sign out</button>
            </div>
          )}
        </div>

        <div className="input-hero">
          <h1 className="input-title">Know exactly how your CV performs</h1>
          <p className="input-subtitle">
            Paste your CV and a job description. Get an instant match score, a gap analysis, and a tailored rewrite — ready to submit.
          </p>
        </div>

        {error === "limit_reached" ? (
          <div className="input-upgrade-box">
            <div className="input-upgrade-inner">
              <p className="input-upgrade-title">You have used all {user?.free_limit} free analyses</p>
              <p className="input-upgrade-text">
                Upgrade to continue analyzing and optimizing CVs without limits.
              </p>
              <button className="input-upgrade-button" onClick={handleUpgrade}>
                Upgrade — $5 one-time
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-row">
              <div className="input-field">
                <label className="input-label">Your CV</label>
                <textarea
                  name="cv"
                  placeholder="Paste your CV here..."
                  className="input-textarea"
                  required
                />
              </div>
              <div className="input-field">
                <label className="input-label">Job Description</label>
                <textarea
                  name="jobDescription"
                  placeholder="Paste the job description here..."
                  className="input-textarea"
                  required
                />
              </div>
            </div>

            {error && <p className="input-error">{error}</p>}

            <button
              type="submit"
              className={`input-submit${loading ? " input-submit-disabled" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="input-button-inner">
                  <span className="input-spinner" />
                  Analyzing...
                </span>
              ) : (
                "Analyze CV"
              )}
            </button>
          </form>
        )}

        <div className="input-trust">
          <span className="input-trust-item">Instant analysis</span>
          <span className="input-dot" />
          <span className="input-trust-item">ATS-aware scoring</span>
          <span className="input-dot" />
          <span className="input-trust-item">Rewritten CV included</span>
        </div>

      </div>
    </div>
  );
}