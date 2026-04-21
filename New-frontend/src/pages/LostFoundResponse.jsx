import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./AdoptionRequest.css";

const API_BASE = "http://localhost:8000/api";

const LostFoundResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const submitResponse = async (e) => {
    e.preventDefault();

    if (!message) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${API_BASE}/pets/reports/${id}/respond/`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      alert("Response sent successfully!");
      navigate("/lost-found");
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to send response");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="adoption-request-container">
      <h1>Respond to Lost / Found Report</h1>

      <form className="adoption-form" onSubmit={submitResponse}>
        <label>Note:<br />  
        <span>Your conact details are sent to pet owner.</span>
        </label>
        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button disabled={submitting}>
          {submitting ? "Sending..." : "Send Response"}
        </button>
      </form>
    </div>
  );
};

export default LostFoundResponse;
