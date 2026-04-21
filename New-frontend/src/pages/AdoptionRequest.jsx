import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./AdoptionRequest.css";

const API_BASE = "http://localhost:8000/api";

const AdoptionRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      alert("Please login to send adoption request");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const submitRequest = async (e) => {
    e.preventDefault();

    if (!id) {
      alert("Invalid pet ID");
      return;
    }

    if (!message.trim()) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Authentication required");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
  `${API_BASE}/pets/adoption/${id}/request/`,
  { message },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }
);
      alert("Adoption request sent successfully!");
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Request failed:", err.response?.data || err);
      alert(
        err.response?.data?.detail ||
        "Failed to send adoption request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adoption-request-container">
      <h1>Adoption Request</h1>

      <form className="adoption-form" onSubmit={submitRequest}>
        <label>Note:<br />  
        <span>Your conact details are sent to pet owner.</span>
        </label>

        <label>Message</label>
        <textarea
          placeholder="Tell the owner why you'd like to adopt this pet"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
};

export default AdoptionRequest;
