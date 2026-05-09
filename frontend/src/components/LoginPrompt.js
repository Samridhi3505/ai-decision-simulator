import { useNavigate } from "react-router-dom";

const LoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        background:
          "linear-gradient(-45deg, #fbc2eb, #a6c1ee, #d4fc79, #96e6a1)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite"
      }}
    >
      {/* Title */}
      <h2 style={{ fontSize: "28px", color: "#1e293b" }}>
        Oops! 😅
      </h2>

      {/* Message */}
      <p style={{ margin: "10px 0 20px", color: "#475569" }}>
        You need to login first to use this feature 💖
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "linear-gradient(135deg, #a5b4fc, #818cf8)",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.9")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        Go to Login 🔐
      </button>

      {/* Animation keyframes (inline safe fallback) */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPrompt;