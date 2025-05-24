import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Backend logout API call (optional, JWT token ko invalidate karne ke liye)
      await axios.post("http://localhost:5000/user/api/logout/v1", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout} className="btn btn-danger">Logout</button>;
};

export default Logout;
