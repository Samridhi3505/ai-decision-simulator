import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [value, setValue] = useState(50);

  // dark mode
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  // ✅ reusable navigation logic
  const handleStart = () => {
    const token = !!localStorage.getItem("token");

    if (token) {
      navigate("/decision");
    } else {
      navigate("/login-prompt");
    }
  };

  return (
    <div className="home-page">

      {/* BACKGROUND */}
      <div className="bg-illustration"></div>
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      {/* HERO */}
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="home-title">
          Smart Decision Simulator ✨
        </h1>

        <p className="home-subtitle">
          Compare choices, analyze outcomes, and make smarter decisions with clarity and confidence.
        </p>

        {/* ✅ FIXED BUTTON */}
        <button onClick={handleStart}>
          {localStorage.getItem("token") ? "Continue 🚀" : "Get Started 🔐"}
        </button>
      </motion.div>

      {/* STATS */}
      <motion.div
  className="tag-cloud"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <span>✨ Smart</span>
  <span>🚀 Future</span>
  <span>💡 Insight</span>
  <span>🎯 Clarity</span>
  <span>🌱 Growth</span>
</motion.div>

      {/* FEATURES */}
      <motion.div
        className="home-features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="home-feature-card">
          ✨ Compare Options
          <p>Easily compare multiple choices side-by-side.</p>
        </div>

        <div className="home-feature-card">
          🧠 AI Suggestions
          <p>Get smart recommendations based on your inputs.</p>
        </div>

        <div className="home-feature-card">
          📊 Score Decisions
          <p>Analyze outcomes with a simple scoring system.</p>
        </div>
      </motion.div>

      {/* HOW IT WORKS */}
      <motion.div
        className="how-it-works"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">1️⃣ Enter your options</div>
          <div className="step">2️⃣ Add criteria</div>
          <div className="step">3️⃣ Get smart results</div>
        </div>
      </motion.div>

      {/* DEMO */}
      <motion.div
        className="demo-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3>Try a Sample Decision 🎯</h3>

        <p>How important is salary?</p>

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <p className="score-box">Score: {value}</p>
      </motion.div>

      {/* CTA */}
      <div className="cta-section">
        <h2>Start Making Smarter Decisions Today 🚀</h2>

        {/* ✅ FIXED CTA */}
        <button onClick={handleStart}>
          Try Now 🚀
        </button>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <p>© 2026 Decision Simulator</p>
        <p>Built with React • Designed for clarity</p>
      </div>

    </div>
  );
};

export default Home;