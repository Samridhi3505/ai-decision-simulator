import { useState } from "react";
import { motion } from "framer-motion";
import "./DecisionForm.css";
import ResultCard from "../decision/ResultCard";

function DecisionForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [result, setResult] = useState(null);

  const handleChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question || options.some((o) => !o)) {
      alert("Fill all fields");
      return;
    }

    const fake = options.map((opt) => ({
      option: opt,
      pros: ["Growth", "Opportunity"],
      cons: ["Risk involved"],
      risk: ["Low", "Medium", "High"][
        Math.floor(Math.random() * 3)
      ],
    }));

    setResult(fake);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Enter your decision..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleChange(e.target.value, i)}
          />
        ))}

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Simulate 🚀
        </motion.button>

        {options.length < 4 && (
          <span className="add-option" onClick={addOption}>
            + Add Option
          </span>
        )}
      </form>

      {result && <ResultCard data={result} />}
    </>
  );
}

export default DecisionForm;