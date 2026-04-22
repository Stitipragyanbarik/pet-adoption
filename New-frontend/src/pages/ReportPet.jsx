import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Upload, MapPin, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config/api";
import "./ReportPet.css";


const ReportPetPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
  report_type: "",
  pet_name: "",
  pet_type: "",
  breed: "",
  location_found: "",
  lat: null,
  lng: null,
  description: "",
});


  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 10) {
      setError("You can upload up to 10 images only.");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject();
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err)
    );
  });

  const handleUseCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setFormData((prev) => ({
        ...prev,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }));
    },
    () => alert("Location permission denied")
  );
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    images.forEach(img => payload.append("images", img));

    await axios.post(`${API_BASE_URL}/pets/report/create/`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setIsSubmitted(true);
  } catch (err) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.detail ||
      "Failed to submit report."
    );
  } finally {
    setLoading(false);
  }
};


  if (!user) {
    return (
      <div className="success-wrapper">
        <div className="success-card">
          <h2>Please log in</h2>
          <p className="warning">You must be logged in to report a pet.</p>
          <Link to="/login" className="primary-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="success-wrapper">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-card"
        >
          <div className="success-icon">
            <CheckCircle2 size={48} />
          </div>
          <h2>Report Submitted!</h2>
          <p>
            Your report has been sent to the admin for verification. Once
            approved, it will appear in Lost & Found listings.
          </p>

          <div className="success-actions">
            <Link to="/lost-found" className="primary-btn">
              View Reports
            </Link>
            <Link to="/" className="ghost-btn">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="page-header">
        <h1>Report a Pet</h1>
        <p>Fill out the details below to help us find or return a pet.</p>
      </div>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="report-layout">
        <div className="report-main">
          <section>
            <h3><span>1</span> Basic Information</h3>

            <div className="grid-2">
              <select name="report_type" onChange={handleChange} required>
                <option value="">Report Type</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>

              <input name="pet_name"
                placeholder="Pet Name (optional)"
                onChange={handleChange}/>

              <select name="pet_type" onChange={handleChange} required>
                <option value="">Pet Species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>

              <input name="breed" placeholder="Breed"
                onChange={handleChange}/>
            </div>
          </section>

          <section>
            <h3><span>2</span> Location & Details</h3>

            <div className="input-icon">
  <MapPin size={16} />
  <input
    name="location_found"
    placeholder="Last seen / found location"
    onChange={handleChange}
    required
  />
</div> 
            <textarea name="description"
              placeholder="Describe the pet's appearance, collar, behavior, etc."
              onChange={handleChange} required/>
          </section>

          <section>
            <h3><span>3</span> Upload Photos</h3>

            <div className="image-grid">
              {previews.map((src, i) => (
                <div key={i} className="image-preview">
                  <img src={src} alt="preview" />
                </div>
              ))}

              <label className="upload-box">
                <Upload size={20} />
                <span>Add Photo</span>
                <input type="file" hidden multiple accept="image/*"
                  onChange={handleImageChange}/>
              </label>
            </div>
          </section>
        </div>

        <aside className="report-sidebar">
          <div className="tips-card">
            <div className="tips-header">
              <Info size={18} />
              <h4>Tips for Reporting</h4>
            </div>

            <ul>
              <li>Include identifying marks like collars or scars.</li>
              <li>Clear photos increase chances of success.</li>
              <li>Provide accurate location information.</li>
            </ul>

            <button className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default ReportPetPage;
