import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // ✅ ADD THIS
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ UPDATED LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Please fill all fields ❌");
      return;
    }

    try {
      const res = await API.post("/auth/login", formData);

      // ✅ store real JWT token
      localStorage.setItem("token", res.data.token);

      setMessage("Login successful ✅");

      setTimeout(() => {
        navigate("/decision");
      }, 1200);

    } catch (err) {
      setMessage("Invalid email or password ❌");
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

      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
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

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <label>Password</label>

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit">Login</button>
          </form>

          <p className="extra-text">
            Don’t have an account?
            <span onClick={() => navigate("/signup")}> Sign up</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;