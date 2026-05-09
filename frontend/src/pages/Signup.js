import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // ✅ ADD THIS
import "../styles/signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ UPDATED SIGNUP FUNCTION
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill all fields ❌");
      return;
    }

    try {
      await API.post("/auth/signup", formData);

      setMessage("Signup successful 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setMessage("User already exists ❌");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <div className="gradient-bg"></div>

      {message && <div className="toast">{message}</div>}

      <div className="signup-container">
        <div className="signup-card">
          <h2>Sign Up</h2>

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <label>Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <label>Password</label>
            </div>

            <button type="submit">Create Account</button>
          </form>

          <p className="extra-text">
            Already have an account?
            <span onClick={() => navigate("/login")}> Login</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;