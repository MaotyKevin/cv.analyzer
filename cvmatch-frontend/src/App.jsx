import { useState } from "react";
import axios from "axios";
import InputForm from "./components/InputForm";
import ResultPage from "./components/ResultPage";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeCV = async (cv, jobDescription) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/analyze-cv/", {
        cv,
        job_description: jobDescription,
      });
      setResult(response.data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setResult(null);

  return (
    <div>
      {result ? (
        <ResultPage result={result} onReset={reset} />
      ) : (
        <InputForm onSubmit={analyzeCV} loading={loading} error={error} />
      )}
    </div>
  );
}