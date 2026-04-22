import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Plus, User, Settings, LogOut, 
  PawPrint, AlertCircle, Clock, Trash2, Edit3,
  Mailbox,} from "lucide-react";

import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { API_BASE_URL, buildMediaUrl } from "../config/api";
import "./UserDashboard.css";


const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const { favorites } = useFavorites();

  const [myPets, setMyPets] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
  if (authLoading) return;

  if (!user) {
    navigate("/login");
    return;
  }

  fetchDashboardData();
}, [user, authLoading]);

  const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token || !user?.id) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    const [petsRes, reportsRes, requestsRes, responsesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/pets/user/${user.id}/pets/`, config),
      axios.get(`${API_BASE_URL}/pets/reports/user/${user.id}/`, config),
      axios.get(`${API_BASE_URL}/pets/adoption/requests/owner/`, config),
      axios.get(`${API_BASE_URL}/pets/reports/responses/owner/`, config),
    ]);
    
    setMyPets(petsRes.data || []);
    setMyReports(reportsRes.data || []);
    setAdoptionRequests(requestsRes.data || []);
    setResponses(responsesRes.data || []);
  } catch (error) {
    console.error(
      "Dashboard fetch failed:",
      error.response?.status,
      error.response?.data
    );
  } finally {
    setLoading(false);
  }
};

const handleResponseReject = async (id) => {
  try {
    const token = localStorage.getItem("access_token");

    await axios.patch(
      `${API_BASE_URL}/pets/reports/response/${id}/update/`,
      { status: "rejected" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchDashboardData();
  } catch (err) {
    console.error("Failed to reject response", err.response?.data);
  }
};

const handleLogout = async () => {
  try {
    await logout();
    navigate("/");
  } catch (err) {
    console.error("Logout failed", err);
  }
};

const handleRequest = async (id, status) => {
  try {
    const token = localStorage.getItem("access_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.patch(
      `${API_BASE_URL}/pets/adoption/request/${id}/update/`,
      { status },
      config
    );

    fetchDashboardData();
  } catch (err) {
    console.error("Failed to update request", err.response?.data);
  }
};

const toggleGroup = (key) => {
  setOpenGroups(prev => ({
    ...prev,
    [key]: !prev[key]
  }));
};

  const handleDeletePet = async (petId) => {
  if (!window.confirm("Are you sure you want to delete this pet?")) return;

  try {
    const token = localStorage.getItem("access_token");

    await axios.delete(
      `${API_BASE_URL}/pets/adoption/${petId}/delete/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMyPets((prev) => prev.filter((p) => p.id !== petId));
  } catch (error) {
    console.error("Delete failed:", error.response?.data);
    alert("Failed to delete pet");
  }
};

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

const groupedAdoptionRequests = adoptionRequests.reduce((acc, req) => {
  if (!acc[req.pet_name]) acc[req.pet_name] = [];
  acc[req.pet_name].push(req);
  return acc;
}, {});

const groupedResponses = responses.reduce((acc, r) => {
  const key = `Report #${r.report_id || "Unknown"}`;
  if (!acc[key]) acc[key] = [];
  acc[key].push(r);
  return acc;
}, {});

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
       <div className="user-info">
         <div className="dashboard-avatar">
           {user?.avatar ? (
             <img
               src={
                 user.avatar.startsWith("http")
                   ? user.avatar
                   : buildMediaUrl(user.avatar)
               }
               alt="User Avatar"
               className="dashboard-avatar-img"
             />
           ) : (
             <User className="dashboard-avatar-fallback" />
           )}
         </div>
     
         <div className="user-data">
           <h1>Hello, {user.username}</h1>
           {user.bio ? (
    <p className="user-bio">{user.bio}</p>
  ) : (
    <p className="muted">No bio added yet</p>
  )}
         </div>
       </div>
         <div className="icon-btn1">
         <button onClick={() => navigate("/settings")} className="icon-btn">
           <Settings />
         </button>
         <br/>
         <button className="icon-btn danger" onClick={handleLogout}>
           <LogOut />
         </button>
       </div>
     </div>
     <div className="dashboard-stats">
       <StatCard label="My Pets" value={myPets.length} icon={<PawPrint />} />
       <StatCard label="Reports" value={myReports.length} icon={<AlertCircle />} />
       <StatCard label="Favorites" value={favorites.length} icon={<Heart />} />
       <StatCard label="Requests & Responses" value={adoptionRequests.length+responses.length} icon={< Mailbox/>} />
     </div>
     <section className="dashboard-section">
       <h2>My Pets</h2>
       <div className="card-grid">
         {myPets.map((pet) => (
           <div key={pet.id} className="pet-card">
             <img src={ pet.images?.[0]?.image
             ? buildMediaUrl(pet.images[0].image)
             : "/images/no-pet.png"}alt={pet.name}/>
             <div className="card-body">
               <h3>{pet.name}</h3>
               <p>{pet.breed}</p>
               <div className="card-actions">
                 <Link to={`/pets/edit/${pet.id}`} className="btn-secondary">
                 <Edit3 /> Edit</Link>
                 <button
                   className="btn-danger"
                   onClick={() => handleDeletePet(pet.id)}>
                   <Trash2 />
                 </button>
               </div>
             </div>
       </div>
       ))}
        <Link to="/registerPet" className="add-card">
          <Plus />
          <span>Add Pet</span>
        </Link>
        </div>
     </section>

      <section className="dashboard-section">
        <h2>My Reports</h2>

      <div className="dashboard-actions">
        <Link to="/reportPet" className="primary-btn">
          <Plus /> Make a Report
        </Link>
        </div>
        {myReports.length === 0 ? (
          <div className="empty-state">
            <AlertCircle />
            <p>No reports submitted yet</p>
          </div>
        ) : (
          myReports.map((report) => (
            <div key={report.id} className="report-card">
              <img src={ report.images?.[0]?.image
              ? buildMediaUrl(report.images[0].image)
              : "/images/no-pet.png"} alt="report"/>

              <div className="report-info">
                <h3>{report.pet_name || "Unknown Pet"}</h3>
                <p>
                  <MapPin /> {report.location_found}
                </p>
              </div>

              <span className={`status-badge1 ${report.status}`}>
                <Clock /> {report.status}
              </span>
            </div>
          ))
        )}
      </section>
      <section className="dashboard-section">
        <div className="toggle-tabs1">
          <button
            className={`tab-btn1 ${activePanel === "adoption" ? "active" : ""}`}
            onClick={() =>
              setActivePanel(activePanel === "adoption" ? null : "adoption")
            }>
            Adoption Requests
            <span className="count-badge">{adoptionRequests.length}</span>
          </button>
      
          <button
            className={`tab-btn1 ${activePanel === "lostfound" ? "active" : ""}`}
            onClick={() =>
              setActivePanel(activePanel === "lostfound" ? null : "lostfound")
            }>
            Lost & Found Responses
            <span className="count-badge">{responses.length}</span>
          </button>
        </div>
      </section>
      {activePanel === "adoption" &&
        Object.entries(groupedAdoptionRequests).map(([petName, requests]) => (
          <div key={petName} className="group-card">
            <div
              className="group-header clickable"
              onClick={() => toggleGroup(petName)}
            >
              <h3>{petName}</h3>
              <span className="count-badge">{requests.length}</span>
            </div>
      
            {openGroups[petName] && (
              <div className="group-content">
                {requests.map(req => (
                  <div key={req.id} className="request-card clean nested">
                    <p><strong>Name:</strong> {req.requester_name}</p>
                    <p><strong>Email:</strong> {req.requester_email}</p>
                    <p><strong>Phone:</strong> {req.phone}</p>
                    {req.message && (
                      <p className="request-message">“{req.message}”</p>
                    )}
      
                    <button
                      className="req-btn r"
                      onClick={() => handleRequest(req.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
      ))}
      
      {activePanel === "lostfound" &&
        Object.entries(groupedResponses).map(([key, resps]) => (
          <div key={key} className="group-card">
            <div
              className="group-header clickable"
              onClick={() => toggleGroup(key)}>
              <h3>{key}</h3>
              <span className="count-badge">{resps.length}</span>
            </div>
      
            {openGroups[key] && (
              <div className="group-content">
                {resps.map(r => (
                  <div key={r.id} className="request-card clean nested">
                    <p><strong>Name:</strong> {r.responder_name}</p>
                    <p><strong>Email:</strong> {r.responder_email}</p>
                    <p><strong>Phone:</strong> {r.phone}</p>
                    <p className="request-message">“{r.message}”</p>
      
                    <button
                      className="req-btn r"
                      onClick={() => handleResponseReject(r.id)}>
                      Reject
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
      ))}

  </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="stat-card">   
    <div className="stat-icon">{icon}</div>
    <div>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

export default UserDashboard;
