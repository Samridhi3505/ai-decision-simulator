import { motion } from "framer-motion";
import "./ResultCard.css";

function ResultCard({ data }) {
  return (
    <div className="result-container">
      {data.map((item, index) => (
        <motion.div
          key={index}
          className="result-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <h3>{item.option}</h3>

          <p className="green">Pros</p>
          <ul>
            {item.pros.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>

          <p className="red">Cons</p>
          <ul>
            {item.cons.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>

          <p className="risk">Risk: {item.risk}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default ResultCard;