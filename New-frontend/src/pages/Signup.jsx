import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // ✅ Remove confirmPassword ONLY
      const { confirmPassword, ...registerData } = formData;

      await register(registerData);

      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      setError(
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.password?.[0] ||
        data?.non_field_errors?.[0] ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-wrapper">
      <div className="pet-image">
        <div className="image">
          <h1 className="title">PetRescue</h1>
          <p className="tagline">Join the community. Save lives.</p>
        </div>
      </div>

      <div className="container">
        <div className="l-card">
          <img
            src="/images/card-header.png"
            alt="Pets"
            className="form-top-image"
          />

          <h2>Create Account</h2>
          <p className="subtitle">
            Join PetRescue and start making a difference.
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
                required
              />
            </div>

            <div className="field-group">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <input
                type="password"
                name="password"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="l-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <p className="l-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
