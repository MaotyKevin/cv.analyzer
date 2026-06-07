import { useEffect, useRef } from "react";
import "../styles/components/LandingPage.css";

export default function LandingPage({ onGetStarted }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp">

      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-mark" />
            <span className="lp-logo-text">CVMatch</span>
          </div>
          <button className="lp-nav-cta" onClick={onGetStarted}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-inner">
          <div className="lp-badge reveal">AI-powered CV analysis</div>

          <h1 className="lp-headline reveal">
            Your CV has a score.<br />
            <span className="lp-headline-accent">Do you know it?</span>
          </h1>

          <p className="lp-subheadline reveal">
            Paste your CV and a job description. In seconds, get a match score,
            a precise gap analysis, and a fully rewritten CV tailored to that job.
          </p>

          <div className="lp-hero-actions reveal">
            <button className="lp-cta-primary" onClick={onGetStarted}>
              Analyze my CV — it's free
            </button>
            <span className="lp-cta-note">3 free analyses. No credit card.</span>
          </div>

          {/* Score preview card */}
          <div className="lp-preview reveal">
            <div className="lp-preview-card">
              <div className="lp-preview-top">
                <span className="lp-preview-label">Match Score</span>
                <span className="lp-preview-badge weak">Weak match</span>
              </div>
              <div className="lp-preview-score">34</div>
              <div className="lp-preview-bar">
                <div className="lp-preview-bar-fill" style={{ width: "34%" }} />
              </div>
              <div className="lp-preview-tags">
                <span className="lp-tag missing">Python</span>
                <span className="lp-tag missing">Docker</span>
                <span className="lp-tag missing">Bac+5</span>
                <span className="lp-tag missing">CI/CD</span>
              </div>
              <div className="lp-preview-optimized">
                <span className="lp-preview-optimized-label">Optimized CV ready</span>
                <span className="lp-preview-optimized-dot" />
              </div>
            </div>
            <div className="lp-preview-glow" />
          </div>
        </div>

        {/* Background grain */}
        <div className="lp-hero-grain" />
      </section>

      {/* How it works */}
      <section className="lp-how">
        <div className="lp-section-inner">
          <p className="lp-section-label reveal">How it works</p>
          <h2 className="lp-section-title reveal">Three steps to a better CV</h2>

          <div className="lp-steps">
            {[
              {
                number: "01",
                title: "Paste your CV and the job",
                text: "Copy your CV and the job description you are applying for. No formatting required.",
              },
              {
                number: "02",
                title: "Get your match score",
                text: "Our AI scores your CV from 0 to 100 and identifies exactly what is missing.",
              },
              {
                number: "03",
                title: "Download your optimized CV",
                text: "Receive a fully rewritten CV tailored to that specific job. Ready to submit.",
              },
            ].map((step, i) => (
              <div className="lp-step reveal" key={i}>
                <span className="lp-step-number">{step.number}</span>
                <h3 className="lp-step-title">{step.title}</h3>
                <p className="lp-step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="lp-features">
        <div className="lp-section-inner">
          <p className="lp-section-label reveal">What you get</p>
          <h2 className="lp-section-title reveal">Everything in one analysis</h2>

          <div className="lp-feature-grid">
            {[
              {
                title: "Match score",
                text: "A precise score from 0 to 100 based on keyword alignment, experience level, and profile fit.",
              },
              {
                title: "Gap analysis",
                text: "A clear list of what is missing — skills, keywords, qualifications — and how to address each one.",
              },
              {
                title: "Rewritten CV",
                text: "A complete, restructured version of your CV reworded to match the job description as closely as possible.",
              },
              {
                title: "PDF export",
                text: "Download the full analysis report and optimized CV as a clean PDF, ready to use.",
              },
            ].map((f, i) => (
              <div className="lp-feature reveal" key={i}>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="lp-pricing">
        <div className="lp-section-inner">
          <p className="lp-section-label reveal">Pricing</p>
          <h2 className="lp-section-title reveal">Simple and honest</h2>

          <div className="lp-pricing-grid">
            <div className="lp-plan reveal">
              <p className="lp-plan-name">Free</p>
              <p className="lp-plan-price">$0</p>
              <ul className="lp-plan-features">
                <li>3 CV analyses</li>
                <li>Full gap analysis</li>
                <li>Optimized CV rewrite</li>
                <li>PDF export</li>
              </ul>
              <button className="lp-plan-cta-outline" onClick={onGetStarted}>
                Start free
              </button>
            </div>

            <div className="lp-plan lp-plan-pro reveal">
              <div className="lp-plan-popular">Most popular</div>
              <p className="lp-plan-name">Pro</p>
              <p className="lp-plan-price">$5 <span className="lp-plan-period">one-time</span></p>
              <ul className="lp-plan-features">
                <li>Unlimited analyses</li>
                <li>Full gap analysis</li>
                <li>Optimized CV rewrite</li>
                <li>PDF export</li>
              </ul>
              <button className="lp-plan-cta" onClick={onGetStarted}>
                Get Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-final">
        <div className="lp-section-inner lp-final-inner">
          <h2 className="lp-final-title reveal">
            Stop guessing.<br />Start knowing.
          </h2>
          <p className="lp-final-text reveal">
            Every job application deserves a CV written for that job specifically.
          </p>
          <button className="lp-cta-primary reveal" onClick={onGetStarted}>
            Analyze my CV — it's free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-mark" />
            <span className="lp-logo-text">CVMatch</span>
          </div>
          <span className="lp-footer-note">Built for job seekers.</span>
        </div>
      </footer>

    </div>
  );
}
