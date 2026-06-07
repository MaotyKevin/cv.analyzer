import { useEffect, useRef, useState } from "react";
import "../styles/components/ScoreCard.css";

const TAGS_BEFORE = [
  "Python",
  "Docker",
  "Bac+3 (ongoing)",
  "devops",
];

const TAGS_AFTER = [
  "Backend scripts",
  "Containerization",
  "Bac+5 Pathway",
  "Jenkins Pipelines",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function ScoreCard() {
  const [score, setScore] = useState(34);
  const [phase, setPhase] = useState("before");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Waiting...");
  const [tagStates, setTagStates] = useState(TAGS_BEFORE.map(() => "bad"));
  const [tagVisible, setTagVisible] = useState(TAGS_BEFORE.map(() => true));
  const [cvReady, setCvReady] = useState(false);

  const getScoreColor = (s) => {
    if (s >= 70) return { num: "#3B6D11", bar: "#639922", badge: "#EAF3DE", badgeText: "#3B6D11", label: "Strong match" };
    if (s >= 50) return { num: "#854F0B", bar: "#BA7517", badge: "#FAEEDA", badgeText: "#854F0B", label: "Moderate match" };
    return { num: "#8B2020", bar: "#E24B4A", badge: "#FDEAEA", badgeText: "#8B2020", label: "Weak match" };
  };

  useEffect(() => {
    let cancelled = false;

    async function cycle() {
      while (!cancelled) {
        // reset
        setScore(34);
        setPhase("before");
        setProgress(0);
        setProgressLabel("Waiting...");
        setTagStates(TAGS_BEFORE.map(() => "bad"));
        setTagVisible(TAGS_BEFORE.map(() => true));
        setCvReady(false);

        await sleep(1800);
        if (cancelled) break;

        // phase: analyzing
        setPhase("analyzing");

        const animateProgress = async (from, to, dur, label) => {
          setProgressLabel(label);
          const steps = 30;
          const stepDur = dur / steps;
          for (let i = 0; i <= steps; i++) {
            if (cancelled) return;
            setProgress(Math.round(from + (to - from) * (i / steps)));
            await sleep(stepDur);
          }
        };

        await animateProgress(0, 40, 900, "Scanning keywords...");
        await animateProgress(40, 75, 800, "Scoring profile fit...");
        await animateProgress(75, 100, 600, "Rewriting CV...");
        if (cancelled) break;
        await sleep(400);

        // phase: after — flip tags one by one
        setPhase("after");
        setProgressLabel("CV optimized");

        for (let i = 0; i < TAGS_BEFORE.length; i++) {
          if (cancelled) break;
          setTagVisible((prev) => prev.map((v, idx) => (idx === i ? false : v)));
          await sleep(200);
          setTagStates((prev) => prev.map((s, idx) => (idx === i ? "good" : s)));
          setTagVisible((prev) => prev.map((v, idx) => (idx === i ? true : v)));
          await sleep(220);
        }

        // animate score climbing
        const animateScore = async (from, to, dur) => {
          const steps = 40;
          const stepDur = dur / steps;
          for (let i = 0; i <= steps; i++) {
            if (cancelled) return;
            setScore(Math.round(from + (to - from) * (i / steps)));
            await sleep(stepDur);
          }
        };

        await animateScore(34, 87, 1400);
        if (cancelled) break;

        setCvReady(true);
        await sleep(2800);

        // fade out tags before reset
        for (let i = TAGS_BEFORE.length - 1; i >= 0; i--) {
          if (cancelled) break;
          setTagVisible((prev) => prev.map((v, idx) => (idx === i ? false : v)));
          await sleep(80);
        }

        await sleep(500);
      }
    }

    cycle();
    return () => { cancelled = true; };
  }, []);

  const colors = getScoreColor(score);

  return (
    <div className="sc-wrap">
      <div className="sc-card">

        <p className="sc-phase-label">
          {phase === "before" && "Before — original CV"}
          {phase === "analyzing" && "Analyzing..."}
          {phase === "after" && "After — optimized CV"}
        </p>

        <div className="sc-score-row">
          <span className="sc-score-num" style={{ color: colors.num }}>
            {score}
          </span>
          <span className="sc-badge" style={{ background: colors.badge, color: colors.badgeText }}>
            {colors.label}
          </span>
        </div>

        <div className="sc-bar-track">
          <div className="sc-bar-fill" style={{ width: `${score}%`, background: colors.bar }} />
        </div>

        <div className="sc-tags">
          {TAGS_BEFORE.map((_, i) => (
            <span
              key={i}
              className={`sc-tag sc-tag-${tagStates[i]} ${tagVisible[i] ? "sc-tag-visible" : "sc-tag-hidden"}`}
            >
              {tagStates[i] === "good" ? TAGS_AFTER[i] : TAGS_BEFORE[i]}
            </span>
          ))}
        </div>

        <div className="sc-divider" />

        <div className="sc-cv-row">
          <span className="sc-cv-label">
            {cvReady ? "Optimized CV ready" : "Optimized CV"}
          </span>
          <span className={`sc-cv-dot ${cvReady ? "sc-cv-dot-ready" : ""}`} />
        </div>

      </div>

      <div className="sc-progress-track">
        <div
          className="sc-progress-fill"
          style={{
            width: `${progress}%`,
            background: progress === 100 ? "#639922" : undefined,
          }}
        />
      </div>
      <p className="sc-step-label">{progressLabel}</p>
    </div>
  );
}
