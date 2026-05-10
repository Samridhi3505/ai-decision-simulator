import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/decision.css";

const DecisionPage = () => {
  const [situation, setSituation] = useState("");
  const [options, setOptions] = useState([""]);
  const [result, setResult] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const resultRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

 const extractBestOption = (text) => {

  const match = text.match(
    /BEST OPTION:\s*🔥?\s*(.*)/i
  );

  return match ? match[1].trim() : null;
};

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index) => {
    if (options.length === 1) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  // ✅ FIXED FUNCTION (NO STATIC LOGIC)
 const simulateDecision = async () => {
  // ✅ CLEAN OPTIONS
  const cleanOptions = options.filter(opt => opt.trim() !== "");

  // ✅ FIXED VALIDATION
  if (!situation.trim() || cleanOptions.length === 0) {
    setMessage( " ⚠️ Please enter situation and at least one option");
    return;
  }

  setLoading(true);
  setMessage("");
  setDisplayedText("");
  setResult("");

  try {
    // ✅ SEND CLEAN OPTIONS
    const res = await API.post("/decision", {
      title: situation,
      options: cleanOptions
    });

    const fullText = res.data?.result || "";
    if (!fullText) {
  setMessage("No result returned from server ❌");
  setLoading(false);
  return;
}

    setResult(fullText);

    // typing effect (unchanged)
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText[index]);
      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 15);

   window.scrollTo({
  top: 0,
  behavior: "smooth",
});

  } catch (err) {
    console.error(err);

    // ✅ better error message
    setMessage(err.response?.data?.msg || "Failed to generate decision ❌");

    setLoading(false);
  }
};
  const bestOption = extractBestOption(displayedText);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="layout">
        <div className="decision-container">

          <div className="top-bar">
            <h1>🧠 AI Decision Simulator</h1>
            <div className="top-actions">
              <button onClick={() => navigate("/history")}>
                🕒 History
              </button>

              <button
                className="theme-btn"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>

          <textarea
            placeholder="Describe your situation..."
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />

          <div className="options-section">
            <h3>Options</h3>

            {options.map((opt, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value)
                  }
                />
                <button onClick={() => removeOption(index)}>❌</button>
              </div>
            ))}

            <button className="add-btn" onClick={addOption}>
              + Add Option
            </button>
          </div>

          <button
            className="simulate-btn"
            onClick={simulateDecision}
            disabled={loading}
          >
            {loading ? "⏳ Thinking..." : "🚀 Simulate Decision"}
          </button>
           {message && (
  <div className="message-box">
    {message}
  </div>
)}

          <div className="result-box" ref={resultRef}>
            <h3>📊 AI Recommendation</h3>

            {!displayedText && !loading && (
              <p className="placeholder">
                Your AI recommendation will appear here...
              </p>
            )}

            <div className="formatted-result">
  {displayedText}
</div>

            {bestOption && (
              <div className="best-card">
                🏆 Best Choice: <strong>{bestOption}</strong>
              </div>
            )}
          </div>

          <button
            className="help-btn"
            onClick={() => setShowHelp(!showHelp)}
          >
            ❓
          </button>

        </div>

        {showHelp && (
          <div className="help-panel">
            <h2>🤖 Need Help? I got you!</h2>
            <p className="help-sub">
              Don't worry, I won't judge your life decisions... probably 😌
            </p>

            <button onClick={() => setShowHelp(false)}>
              Got it 👍
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionPage;