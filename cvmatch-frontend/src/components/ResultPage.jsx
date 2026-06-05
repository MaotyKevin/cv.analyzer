import { useState } from "react";
import jsPDF from "jspdf";
import "../styles/components/ResultPage.css";

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
    <div className="result-page">
      <div className="result-wrapper">

        <div className="result-top-bar">
          <div className="result-logo">
            <div className="result-logo-mark" />
            <span className="result-logo-text">CVMatch</span>
          </div>
          <button onClick={onReset} className="result-back-button">
            Back to analyzer
          </button>
        </div>

        <div className="result-score-card" style={{ background: scoreBg }}>
          <div>
            <p className="result-score-label" style={{ color: scoreColor }}>{scoreLabel}</p>
            <p className="result-score-hint">Based on keyword alignment, experience, and profile fit</p>
          </div>
          <div className="result-score-number" style={{ color: scoreColor }}>
            {score}<span className="result-score-max">/100</span>
          </div>
        </div>

        <div className="result-grid">
          <Section title="Strengths" items={result.strengths} accent="#1A6B3C" bg="#EBF7F1" />
          <Section title="Weaknesses" items={result.weaknesses} accent="#8B2020" bg="#FDEAEA" />
        </div>

        <Section title="Missing keywords" items={result.missing_keywords} accent="#8A5A00" bg="#FEF6E4" tags />

        <Section title="Recommended improvements" items={result.improvements} accent="#1A1A2E" bg="#F0EFF9" numbered />

        <div className="result-cv-section">
          <div className="result-cv-header">
            <div>
              <p className="result-cv-title">Optimized CV</p>
              <p className="result-cv-subtitle">Rewritten to match this job description</p>
            </div>
            <div className="result-cv-actions">
              <button onClick={copyCV} className="result-action-button">
                {copied ? "Copied" : "Copy text"}
              </button>
              <button onClick={downloadPDF} className="result-action-button result-action-primary">
                Download PDF
              </button>
            </div>
          </div>
          <pre className="result-cv-box">{result.optimized_cv}</pre>
        </div>

      </div>
    </div>
  );
}

function Section({ title, items, accent, bg, tags, numbered }) {
  return (
    <div className="result-section" style={{ borderLeftColor: accent }}>
      <p className="result-section-title">{title}</p>
      {tags ? (
        <div className="result-tag-row">
          {items.map((item, i) => (
            <span key={i} className="result-tag" style={{ background: bg, color: accent }}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="result-section-list">
          {items.map((item, i) => (
            <li key={i} className="result-section-item">
              <span className="result-section-bullet" style={{ background: accent }}>
                {numbered ? i + 1 : ""}
              </span>
              <span className="result-section-text">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
