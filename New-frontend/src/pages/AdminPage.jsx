import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./AdminPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const AdminReports = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [view, setView] = useState("reports");
  const [aiMatches, setAiMatches] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRunning, setAiRunning] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_URL}/pets/reports/admin/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Failed to load admin reports", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId, status) => {
    try {
      await axios.patch(
        `${API_URL}/pets/reports/${reportId}/update-status/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status");
    }
  };

  const fetchAIMatches = async () => {
    setAiLoading(true);
    try {
      const res = await axios.get(`${API_URL}/ai/matches/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAiMatches(res.data);
    } catch (err) {
      console.error("Failed to load AI matches", err);
    } finally {
      setAiLoading(false);
    }
  };

  const confirmMatch = async (matchId) => {
    await axios.post(
      `${API_URL}/ai/matches/${matchId}/confirm/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchAIMatches();
  };

  const notifyMatch = async (matchId) => {
    await axios.post(
      `${API_URL}/ai/matches/${matchId}/notify/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchAIMatches();
  };

  if (!user || !user.is_staff) {
    return (
      <div className="warning-wrapper">
        <div className="warning-card">
          <div className="admin-warning">Admin access only</div>
        </div>
      </div>
    );
  }

  const filteredReports = reports.filter(
    (r) => r.status === activeTab
  );

  const counts = {
    pending: reports.filter((r) => r.status === "pending").length,
    active: reports.filter((r) => r.status === "active").length,
    inactive: reports.filter((r) => r.status === "inactive").length,
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Admin</h1>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${view === "reports" ? "active" : ""}`}
          onClick={() => setView("reports")}
        >
          Reports
        </button>
        <button
          className={`admin-tab ${view === "ai-matches" ? "active" : ""}`}
          onClick={() => {
            setView("ai-matches");
            fetchAIMatches();
          }}
        >
          AI Matches
        </button>
      </div>

      {view === "reports" && (
        <>
          <div className="admin-stats">
            <div className="stat pending">
              Pending <span>{counts.pending}</span>
            </div>
            <div className="stat active">
              Active <span>{counts.active}</span>
            </div>
            <div className="stat inactive">
              Inactive <span>{counts.inactive}</span>
            </div>
          </div>

          <div className="admin-tabs">
            {["pending", "active", "inactive"].map((tab) => (
              <button
                key={tab}
                className={`admin-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="admin-loading">Loading reports...</p>
          ) : error ? (
            <p className="admin-error">{error}</p>
          ) : filteredReports.length === 0 ? (
            <p className="admin-empty">No {activeTab} reports</p>
          ) : (
            <div className="admin-list">
              {filteredReports.map((report) => (
                <div key={report.id} className="admin-card">
                  <div className="admin-image">
                    {report.images?.length > 0 ? (
                      <img
                        src={`http://localhost:8000${report.images[0].image}`}
                        alt="Pet"
                        className="admin-pet-image"
                      />
                    ) : (
                      <div className="admin-no-image">No Image</div>
                    )}
                  </div>

                  <div className="admin-info">
                    <h3>{report.pet_name || "Unknown Pet"}</h3>
                    <p>{report.description}</p>

                    <div className="admin-meta">
                      <span>Type: {report.pet_type}</span>
                      <span>Location: {report.location_found}</span>
                      <span className={`status-badge ${report.status}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <div className="admin-actions">
                    {report.status !== "active" && (
                      <button
                        className="btn-activate"
                        onClick={() => updateStatus(report.id, "active")}>
                        Activate
                      </button>
                    )}

                    {report.status !== "inactive" && (
                      <button
                        className="btn-deactivate"
                        onClick={() => updateStatus(report.id, "inactive")}>
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === "ai-matches" && (
  <>
    <div style={{ marginBottom: "20px" }}>
  <button
    className="btn-activate"
    disabled={aiRunning}
    onClick={async () => {
      try {
        setAiRunning(true);

        await axios.post(
          `${API_URL}/ai/run/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchAIMatches();
      } catch (err) {
        console.error("AI run failed", err);
        alert("Failed to run AI matching");
      } finally {
        setAiRunning(false);
      }
    }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      opacity: aiRunning ? 0.7 : 1,
      cursor: aiRunning ? "not-allowed" : "pointer",
    }}>

    {aiRunning && (
      <span
        className="spinner"/>
    )}

    {aiRunning ? "Running AI..." : "Run AI Matching"}
  </button>
</div>

    {aiLoading ? (
      <p className="admin-loading">Loading AI matches...</p>
    ) : aiMatches.length === 0 ? (
      <p className="admin-empty">No AI matches found</p>
    ) : (
      <div className="admin-list">
        {aiMatches.map((match) => (
          <div key={match.id} className="admin-card">
            <div className="admin-image">
              <img
                src={`http://localhost:8000${match.lost_report.images[0]?.image}`}
                alt="Lost"
              />
            </div>

            <div className="admin-image">
              <img
                src={`http://localhost:8000${match.found_report.images[0]?.image}`}
                alt="Found"
              />
            </div>

            <div className="admin-info">
              <h3>
                {match.lost_report.pet_name || "Lost"} ↔{" "}
                {match.found_report.pet_name || "Found"}
              </h3>

              <p>
                Confidence:{" "}
                <strong>{(match.score * 100).toFixed(1)}%</strong>
              </p>
            </div>

            <div className="admin-actions">
              {!match.admin_verified && (
                <button
                  className="btn-activate"
                  onClick={() => confirmMatch(match.id)}
                >
                  Confirm Match
                </button>
              )}

              {match.admin_verified && !match.notified && (
                <button
                  className="btn-activate"
                  onClick={() => notifyMatch(match.id)}
                >
                  Notify User
                </button>
              )}

              {match.notified && (
                <span className="status-badge active">Notified</span>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}
</div>
  );
};

export default AdminReports;
