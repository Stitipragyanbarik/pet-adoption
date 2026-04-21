import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
  username: "",
  password: "",
});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const user = await login({
      username: formData.username,
      password: formData.password,
    });

    if (user.is_staff) {
      navigate("/admin");
    } else {
      navigate("/user-dashboard");
    }
  } catch (err) {
    setError("Invalid credentials");
  }
};

  return (
    <div className="pet-wrapper">
      <div className="pet-image">
        <div className="image">
          <h1 className="title">PetRescue</h1>
          <p className="tagline">Adopt. Rescue. Protect.</p>
        </div>
      </div>

      <div className="container">
        <div className="l-card">
          <img
            src="/images/card-header.png"
            alt="Pets"
            className="form-header-image"
          />

          <h2>Welcome Back</h2>
          <p className="subtitle">
            Login to continue your PetRescue journey.
          </p>

          {error && <div className="error-text">{error}</div>}

          <form className="l-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required/>
            </div>

            <div className="field-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="l-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="l-link">
              Not registered yet?{" "}
              <span onClick={() => navigate("/signup")}>
                Create account
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
