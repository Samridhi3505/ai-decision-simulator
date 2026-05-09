import { useState } from "react";
import "../styles/dashboard.css";

const AdvancedDashboard = () => {
  const [options, setOptions] = useState([""]);
  const [criteria, setCriteria] = useState([""]);
  const [weights, setWeights] = useState([""]);
  const [scores, setScores] = useState([]);
  const [matrix, setMatrix] = useState({});

  // Add option
  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  // Add criterion
  const addCriterion = () => {
    setCriteria((prev) => [...prev, ""]);
    setWeights((prev) => [...prev, ""]);
  };

  // Update option
  const updateOption = (index, value) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Update criterion
  const updateCriterion = (index, value) => {
    setCriteria((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Update weight
  const updateWeight = (index, value) => {
    setWeights((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Update matrix safely
  const updateMatrix = (optIndex, critIndex, value) => {
    const key = `${optIndex}-${critIndex}`;
    setMatrix((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  // Calculate weighted scores
  const calculate = () => {
    if (options.length === 0 || criteria.length === 0) {
      alert("Please add options and criteria");
      return;
    }

    const result = options.map((opt, i) => {
      let total = 0;

      criteria.forEach((_, j) => {
        const key = `${i}-${j}`;
        const val = matrix[key] || 0;
        const weight = Number(weights[j] || 0);

        total += val * weight;
      });

      return { option: opt, score: total };
    });

    setScores(result);
  };

  // Safe best calculation
  const best =
    scores.length > 0
      ? scores.reduce(
          (max, item) => (item.score > max.score ? item : max),
          scores[0]
        )
      : null;

  return (
  <div className="dashboard">

    <h1 className="dashboard-title">Decision Engine 🧠</h1>

    <div className="dashboard-grid">

      {/* LEFT PANEL */}
      <div className="left-panel">

        {/* OPTIONS */}
        <div className="card">
          <h3>Options</h3>

          {options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
            />
          ))}

          <button onClick={addOption}>+ Add Option</button>
        </div>

        {/* CRITERIA */}
        <div className="card">
          <h3>Criteria & Weights</h3>

          {criteria.map((c, i) => (
            <div key={i} className="row">
              <input
                placeholder={`Criterion ${i + 1}`}
                value={c}
                onChange={(e) => updateCriterion(i, e.target.value)}
              />

              <input
                type="number"
                placeholder="Weight"
                value={weights[i]}
                onChange={(e) => updateWeight(i, e.target.value)}
              />
            </div>
          ))}

          <button onClick={addCriterion}>+ Add Criterion</button>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">

        {/* MATRIX */}
        <div className="card">
          <h3>Score Matrix</h3>

          {options.map((opt, i) => (
            <div key={i} className="matrix-block">
              <h4>{opt.trim() || `Option ${i + 1}`}</h4>

              {criteria.map((c, j) => (
                <input
                  key={j}
                  type="number"
                  placeholder={`${c || "Criterion"} score`}
                  onChange={(e) =>
                    updateMatrix(i, j, e.target.value)
                  }
                />
              ))}
            </div>
          ))}
        </div>

        {/* ACTION */}
        <button className="calculate-btn" onClick={calculate}>
          Calculate 🚀
        </button>

        {/* RESULTS */}
        <div className="results">
          {scores.map((item, i) => (
            <div
              key={i}
              className={`result-card ${item === best ? "best" : ""}`}
            >
              <h3>{item.option.trim() || `Option ${i + 1}`}</h3>

              <p>{item.score}</p>

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>

              {item === best && (
                <span className="badge">🏆 Best</span>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  </div>
);
};

export default AdvancedDashboard;