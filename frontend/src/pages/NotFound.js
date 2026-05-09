import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: "40px" }}>404</h1>
      <p style={{ color: "#94a3b8", margin: "20px 0" }}>
        Page not found. The page you are looking for does not exist.
      </p>

      <Button text="Go Home" onClick={() => navigate("/")} />
    </div>
  );
};

export default NotFound;