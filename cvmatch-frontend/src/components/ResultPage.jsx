import { useState } from "react";
import jsPDF from "jspdf";

export default function ResultPage({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const copyCV = () => {
    navigator.clipboard.writeText(result.optimized_cv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let y = 20;

    const addText = (text, fontSize = 11, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += lineHeight;
      });
    };

    const addSection = (title, items) => {
      y += 4;
      addText(title, 13, true);
      y += 2;
      items.forEach((item) => addText(`• ${item}`, 10));
    };

    addText("CV Match Analysis Report", 18, true);
    y += 4;
    addText(`Match Score: ${result.score} / 100`, 14, true);
    y += 2;
    addSection("Strengths", result.strengths);
    addSection("Weaknesses", result.weaknesses);
    addSection("Missing Keywords", result.missing_keywords);
    addSection("Improvements", result.improvements);
    y += 4;
    addText("Optimized CV", 13, true);
    y += 2;
    addText(result.optimized_cv, 10);
    doc.save("optimized-cv.pdf");
  };

  const score = result.score;
  const scoreColor = score >= 70 ? "#1A6B3C" : score >= 50 ? "#8A5A00" : "#8B2020";
  const scoreBg = score >= 70 ? "#EBF7F1" : score >= 50 ? "#FEF6E4" : "#FDEAEA";
  const scoreLabel = score >= 70 ? "Strong match" : score >= 50 ? "Moderate match" : "Weak match";

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        <div style={styles.topBar}>
          <div style={styles.logo}>
            <div style={styles.logoMark} />
            <span style={styles.logoText}>CVMatch</span>
          </div>
          <button onClick={onReset} style={styles.backButton}>
            Back to analyzer
          </button>
        </div>

        <div style={{ ...styles.scoreCard, background: scoreBg }}>
          <div>
            <p style={{ ...styles.scoreLabel, color: scoreColor }}>{scoreLabel}</p>
            <p style={styles.scoreHint}>Based on keyword alignment, experience, and profile fit</p>
          </div>
          <div style={{ ...styles.scoreNumber, color: scoreColor }}>
            {score}<span style={styles.scoreMax}>/100</span>
          </div>
        </div>

        <div style={styles.grid}>
          <Section title="Strengths" items={result.strengths} accent="#1A6B3C" bg="#EBF7F1" />
          <Section title="Weaknesses" items={result.weaknesses} accent="#8B2020" bg="#FDEAEA" />
        </div>

        <Section title="Missing keywords" items={result.missing_keywords} accent="#8A5A00" bg="#FEF6E4" tags />

        <Section title="Recommended improvements" items={result.improvements} accent="#1A1A2E" bg="#F0EFF9" numbered />

        <div style={styles.cvSection}>
          <div style={styles.cvHeader}>
            <div>
              <p style={styles.cvTitle}>Optimized CV</p>
              <p style={styles.cvSubtitle}>Rewritten to match this job description</p>
            </div>
            <div style={styles.cvActions}>
              <button onClick={copyCV} style={styles.actionButton}>
                {copied ? "Copied" : "Copy text"}
              </button>
              <button onClick={downloadPDF} style={{ ...styles.actionButton, ...styles.actionPrimary }}>
                Download PDF
              </button>
            </div>
          </div>
          <pre style={styles.cvBox}>{result.optimized_cv}</pre>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F6F3; font-family: 'Sora', sans-serif; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}

function Section({ title, items, accent, bg, tags, numbered }) {
  return (
    <div style={{ ...sectionStyles.container, borderLeftColor: accent }}>
      <p style={sectionStyles.title}>{title}</p>
      {tags ? (
        <div style={sectionStyles.tagRow}>
          {items.map((item, i) => (
            <span key={i} style={{ ...sectionStyles.tag, background: bg, color: accent }}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul style={sectionStyles.list}>
          {items.map((item, i) => (
            <li key={i} style={sectionStyles.item}>
              <span style={{ ...sectionStyles.bullet, background: accent }}>
                {numbered ? i + 1 : ""}
              </span>
              <span style={sectionStyles.text}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F6F3",
    padding: "3rem 1.5rem",
    fontFamily: "'Sora', sans-serif",
  },
  wrapper: {
    width: "100%",
    maxWidth: "820px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  logo: {
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
  backButton: {
    fontSize: "0.875rem",
    color: "#6B6966",
    background: "transparent",
    border: "1px solid #E8E6E1",
    borderRadius: "8px",
    padding: "0.4rem 0.875rem",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "opacity 0.15s",
  },
  scoreCard: {
    borderRadius: "14px",
    padding: "1.75rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  scoreLabel: {
    fontSize: "1rem",
    fontWeight: "600",
    letterSpacing: "-0.01em",
    marginBottom: "0.25rem",
  },
  scoreHint: {
    fontSize: "0.8125rem",
    color: "#6B6966",
    lineHeight: "1.5",
  },
  scoreNumber: {
    fontSize: "3.5rem",
    fontWeight: "600",
    letterSpacing: "-0.04em",
    lineHeight: "1",
    flexShrink: 0,
  },
  scoreMax: {
    fontSize: "1.25rem",
    fontWeight: "400",
    opacity: 0.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.25rem",
  },
  cvSection: {
    background: "#fff",
    border: "1px solid #E8E6E1",
    borderRadius: "14px",
    overflow: "hidden",
  },
  cvHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #E8E6E1",
    flexWrap: "wrap",
    gap: "1rem",
  },
  cvTitle: {
    fontSize: "0.9375rem",
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: "0.2rem",
  },
  cvSubtitle: {
    fontSize: "0.8125rem",
    color: "#9B9894",
  },
  cvActions: {
    display: "flex",
    gap: "0.625rem",
  },
  actionButton: {
    fontSize: "0.8125rem",
    fontWeight: "500",
    padding: "0.45rem 0.875rem",
    border: "1px solid #E8E6E1",
    borderRadius: "8px",
    background: "#fff",
    color: "#1A1A2E",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "opacity 0.15s",
  },
  actionPrimary: {
    background: "#1A1A2E",
    color: "#fff",
    border: "none",
  },
  cvBox: {
    padding: "1.5rem",
    fontSize: "0.8125rem",
    lineHeight: "1.75",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#3A3835",
    fontFamily: "'Sora', sans-serif",
    maxHeight: "480px",
    overflowY: "auto",
  },
};

const sectionStyles = {
  container: {
    background: "#fff",
    border: "1px solid #E8E6E1",
    borderLeft: "3px solid",
    borderRadius: "14px",
    padding: "1.25rem 1.5rem",
  },
  title: {
    fontSize: "0.8125rem",
    fontWeight: "600",
    color: "#1A1A2E",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: "0.875rem",
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.625rem",
  },
  bullet: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.6875rem",
    fontWeight: "600",
    color: "#fff",
  },
  text: {
    fontSize: "0.875rem",
    color: "#3A3835",
    lineHeight: "1.6",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  tag: {
    fontSize: "0.8125rem",
    fontWeight: "500",
    padding: "0.3rem 0.7rem",
    borderRadius: "6px",
  },
};
