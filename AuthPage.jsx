import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthPage.css";

const AuthPage = ({ isSignUpMode = false, setIsLoggedIn }) => {
  const [isSignUp, setIsSignUp] = useState(isSignUpMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Signup/Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
        if (isSignUp) {
            const response = await axios.post("http://localhost:3019/signup", formData);
            alert(response.data.message);
            setIsSignUp(false);  
            navigate("/login");
        } else {
            const loginResponse = await axios.post("http://localhost:3019/login", {
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("token", loginResponse.data.token);
            localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
            localStorage.setItem("userId", loginResponse.data.user._id);
            alert("Login successful!");
            setIsLoggedIn(true);
            navigate("/");
            window.location.reload();
        }
    } catch (err) {
        console.error("Error:", err.response?.data || err.message); 
        setError(err.response?.data?.message || "Something went wrong. Check backend logs.");
    }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
          <p>{isSignUp ? "Sign up to get started" : "Sign in to continue"}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="back-to-home">
          <span onClick={() => navigate('/')} className="back-link">← Back to Home</span>
        </div>

        <div className="auth-footer">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="toggle-link"
            >
              {isSignUp ? " Login" : " Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
