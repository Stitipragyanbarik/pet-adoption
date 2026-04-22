import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Camera, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config/api";
import "./SettingsPage.css";


export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, setUser, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    bio: user.bio || ""
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const saveProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${API_BASE_URL}/users/profile/`,
        profile,
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      setUser(res.data);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.post(
    `${API_BASE_URL}/users/avatar/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  setUser(prev => ({
    ...prev,
    avatar: res.data.avatar,
  }));
};


  const changePassword = async () => {
    if (password.new !== password.confirm) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/users/change-password/`,
        {
          current_password: password.current,
          new_password: password.new
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      alert("Password updated");
      setPassword({ current: "", new: "", confirm: "" });
    } catch {
      alert("Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
  if (!window.confirm("This will permanently delete your account. Continue?")) {
    return;
  }

  try {
    await axios.delete(`${API_BASE_URL}/users/delete-account/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    logout();          // clear auth context
    navigate("/");     // redirect to home
  } catch (err) {
    alert("Failed to delete account");
    console.error(err.response?.data);
  }
};

  return (
    <div className="settings-container">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Profile
      </button>
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="muted">Manage your account preferences and security</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar2">
          {["profile", "security", "danger"].map(tab => (
            <button
              key={tab}
              className={`tab-btn2 ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </aside>

        <main className="settings-content">
          {activeTab === "profile" && (
<section className="card">
  <h2>Profile</h2>

  <div className="avatar-row">
    <div className="avatar">
      <img
        src={avatarPreview || "/avatar-placeholder.png"}
        alt="Avatar"/>

      <label className="camera-btn">
        <Camera size={16} />
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => uploadAvatar(e.target.files[0])}/>
      </label>
    </div>

    <div>
      <strong>{user.first_name} {user.last_name}</strong>
      <p className="muted">{user.email}</p>
    </div>
  </div>

  <div className="form-grid">
    <input
      placeholder="First name"
      value={profile.first_name}
      onChange={e => setProfile({ ...profile, first_name: e.target.value })}/>
    <input
      placeholder="Last name"
      value={profile.last_name}
      onChange={e => setProfile({ ...profile, last_name: e.target.value })}/>
    <textarea
      placeholder="Bio"
      value={profile.bio}
      onChange={e => setProfile({ ...profile, bio: e.target.value })}/>
  </div>

  <button
    className="primary-btn"
    onClick={saveProfile}
    disabled={loading}>
    {loading ? "Saving..." : "Save Changes"}
  </button>
</section>
          )}

          {activeTab === "security" && (
            <section className="card">
              <h2>Security</h2>

              <div className="pass">
              <input
                type="password"
                placeholder="Current password"
                value={password.current}
                onChange={e => setPassword({ ...password, current: e.target.value })}/>

              <input
                type="password"
                placeholder="New password"
                value={password.new}
                onChange={e => setPassword({ ...password, new: e.target.value })}/>

              <input
                type="password"
                placeholder="Confirm new password"
                value={password.confirm}
                onChange={e => setPassword({ ...password, confirm: e.target.value })}/>

              <button
                className="primary-btn"
                onClick={changePassword}
                disabled={loading}>
                Update Password
              </button>
              </div>
            </section>
          )}

          {activeTab === "danger" && (
            <section className="card danger">
              <h2>Danger Zone</h2>
              <p className="muted">
                These actions are irreversible.
              </p>

              <button className="danger-btn outline" onClick={logout}>
                Log out
              </button>
              <br/>
              <button
                className="danger-btn"
                onClick={deleteAccount}>
                Delete account
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
