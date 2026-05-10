import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/history.css";

export default function History() {

  const [history, setHistory] = useState([]);
  const [dark, setDark] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ FETCH HISTORY
  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await API.get("/decision");

        setHistory(res.data);

      } catch (err) {

        console.log(err);

        setMessage("❌ Failed to load history");
      }
    };

    fetchHistory();

  }, []);

  // ✅ DELETE SINGLE DECISION
  const handleDelete = async (id) => {

    try {

      await API.delete(`/decision/${id}`);

      setHistory(
        history.filter((item) => item._id !== id)
      );

      setMessage("✅ Decision deleted successfully");

    } catch (err) {

      console.log(err);

      setMessage("❌ Failed to delete decision");
    }
  };

  // ✅ CLEAR ALL DECISIONS
  const handleClearAll = async () => {

    try {

      await Promise.all(
        history.map((item) =>
          API.delete(`/decision/${item._id}`)
        )
      );

      setHistory([]);

      setMessage("🧹 All decisions cleared");

    } catch (err) {

      console.log(err);

      setMessage("❌ Failed to clear decisions");
    }
  };

  return (
    <div className={dark ? "history-page dark" : "history-page"}>

      {/* TOP ACTION BAR */}
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

      {/* PAGE TITLE */}
      <h1 className="history-title">
        Your Decisions 🧠✨
      </h1>

      {/* ✅ MESSAGE BOX */}
      {message && (
        <div className="message-box">
          {message}
        </div>
      )}

      {/* EMPTY STATE */}
      {history.length === 0 ? (

        <div className="empty-state">

          <h2>No decisions yet 😴</h2>

          <p>
            Start making decisions to see them here!
          </p>

        </div>

      ) : (

        <div className="history-grid">

          {history.map((item) => (

            <div
              className="history-card"
              key={item._id}
            >

              <div className="history-top">

                <h3>{item.title}</h3>

                <span>
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                  {" • "}
                  {new Date(
                    item.createdAt
                  ).toLocaleTimeString()}
                </span>

              </div>

              {/* ✅ PRESERVE AI FORMATTING */}
              <div className="history-result">
                {item.result}
              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(item._id)
                }
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