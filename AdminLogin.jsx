import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/components/AdminLogin.css"; 
import { AdminPanelSettings, Logout } from "@mui/icons-material";  // ✅ Icons

const AdminLogin = ({ setIsAdmin }) => {
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validAdmin = {
      email: "admin@example.com",
      password: "admin123",
    };

    if (adminData.email === validAdmin.email && adminData.password === validAdmin.password) {
      alert("Admin Login Successful!");
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");  
      navigate("/admin-dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div className="admin-login-container">
      <h2><AdminPanelSettings style={{ verticalAlign: "middle", marginRight: "8px" }} /> Admin Login</h2>
      
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Admin Email" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">
          <AdminPanelSettings style={{ marginRight: "5px" }} /> Login as Admin
        </button>
      </form>

      {/* Optional Logout Button */}
      {localStorage.getItem("isAdmin") === "true" && (
        <button onClick={handleLogout} className="logout-btn">
          <Logout style={{ marginRight: "5px" }} /> Logout
        </button>
      )}
    </div>
  );
};

export default AdminLogin;
