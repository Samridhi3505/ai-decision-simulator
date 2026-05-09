import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // ✅ ADD THIS
import "../styles/history.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/decision");
        setHistory(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHistory();
  }, []);

  /* ❌ Delete ONE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this decision?")) return;

    try {
      await API.delete(`/decision/${id}`);
      setHistory(history.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  /* 🧹 Clear ALL */
  const handleClearAll = async () => {
    if (!window.confirm("Clear all decisions?")) return;

    try {
      // delete all one by one
      await Promise.all(
        history.map((item) => API.delete(`/decision/${item._id}`))
      );
      setHistory([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={dark ? "history-page dark" : "history-page"}>

      {/* TOP CONTROL BAR */}
      <div className="action-section">

        <button
          className="back-btn"
          onClick={() => navigate("/decision")}
        >
          ← Back to Decision Page
        </button>

        {history.length > 0 && (
          <button onClick={handleClearAll}>
            Clear All Decisions
          </button>
        )}

        <button onClick={() => setDark(!dark)}>
          {dark ? "Light ☀️" : "Dark 🌙"}
        </button>

      </div>

      <h1 className="history-title">Your Decisions 🧠✨</h1>

      {history.length === 0 ? (
        <div className="empty-state">
          <h2>No decisions yet 😴</h2>
          <p>Start making decisions to see them here!</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div className="history-card" key={item._id}>
              <div className="history-top">
                <h3>{item.title}</h3>
                <span>
                  {new Date(item.createdAt).toLocaleDateString()} •{" "}
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <p className="history-result">
                👉 {item.result}
              </p>

              <button
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}