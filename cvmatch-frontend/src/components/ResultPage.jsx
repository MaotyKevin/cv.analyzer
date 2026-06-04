import { useState } from "react";
import jsPDF from "jspdf";

export default function ResultPage({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const copyCV = () => {
    navigator.clipboard.writeText(result.optimized_cv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
    };

    const addSection = (title, items) => {
      y += 4;
      addText(title, 13, true);
      y += 2;
      items.forEach((item) => {
        addText(`• ${item}`, 10);
      });
    };

    // Title
    addText("CV Match Analysis Report", 18, true);
    y += 4;

    // Score
    addText(`Match Score: ${result.score} / 100`, 14, true);
    y += 2;

    // Sections
    addSection("Strengths", result.strengths);
    addSection("Weaknesses", result.weaknesses);
    addSection("Missing Keywords", result.missing_keywords);
    addSection("Improvements", result.improvements);

    // Optimized CV
    y += 4;
    addText("Optimized CV", 13, true);
    y += 2;
    addText(result.optimized_cv, 10);

    doc.save("optimized-cv.pdf");
  };

  const scoreColor =
    result.score >= 70 ? "#22c55e" : result.score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Score */}
        <div style={styles.scoreBox}>
          <p style={styles.scoreLabel}>Match Score</p>
          <p style={{ ...styles.scoreNumber, color: scoreColor }}>{result.score}</p>
          <p style={styles.scoreSubtext}>out of 100</p>
        </div>

        {/* Strengths */}
        <Section title="✅ Strengths" items={result.strengths} color="#22c55e" />

        {/* Weaknesses */}
        <Section title="⚠️ Weaknesses" items={result.weaknesses} color="#ef4444" />

        {/* Missing Keywords */}
        <Section title="🔍 Missing Keywords" items={result.missing_keywords} color="#f59e0b" />

        {/* Improvements */}
        <Section title="📈 Improvements" items={result.improvements} color="#4f46e5" />

        {/* Optimized CV */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🚀 Optimized CV</h2>
          <pre style={styles.cvBox}>{result.optimized_cv}</pre>

          <div style={styles.buttonRow}>
            <button onClick={copyCV} style={styles.copyButton}>
              {copied ? "✅ Copied!" : "Copy Optimized CV"}
            </button>
            <button onClick={downloadPDF} style={styles.pdfButton}>
              ⬇️ Download PDF
            </button>
          </div>
        </div>

        {/* Try Again */}
        <button onClick={onReset} style={styles.resetButton}>
          ← Analyze Another CV
        </button>

      </div>
    </div>
  );
}

function Section({ title, items, color }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <ul style={styles.list}>
        {items.map((item, i) => (
          <li key={i} style={{ ...styles.listItem, borderLeft: `3px solid ${color}` }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f9",
    display: "flex",
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
    height: "fit-content",
  },
  scoreBox: {
    textAlign: "center",
    marginBottom: "2rem",
    padding: "1.5rem",
    background: "#f8f9ff",
    borderRadius: "12px",
  },
  scoreLabel: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "0.25rem",
  },
  scoreNumber: {
    fontSize: "4rem",
    fontWeight: "800",
    margin: "0",
  },
  scoreSubtext: {
    fontSize: "0.85rem",
    color: "#999",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    marginBottom: "0.75rem",
    color: "#1a1a2e",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "0.6rem 0.75rem",
    marginBottom: "0.5rem",
    background: "#f8f9ff",
    borderRadius: "6px",
    fontSize: "0.9rem",
    color: "#333",
  },
  cvBox: {
    background: "#f8f9ff",
    padding: "1rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#333",
    maxHeight: "400px",
    overflowY: "auto",
  },
  buttonRow: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.75rem",
  },
  copyButton: {
    flex: 1,
    padding: "0.6rem 1.2rem",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  pdfButton: {
    flex: 1,
    padding: "0.6rem 1.2rem",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  resetButton: {
    width: "100%",
    padding: "0.8rem",
    background: "transparent",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#666",
    fontSize: "0.95rem",
  },
};