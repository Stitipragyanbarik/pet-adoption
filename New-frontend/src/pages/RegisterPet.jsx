import { motion } from "framer-motion";
import { ArrowLeft, Upload, MapPin, CheckCircle2, ShieldCheck, HeartPulse, Camera} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./RegisterPet.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const RegisterPetPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
  name: "",
  type: "",
  breed: "",
  age: "",
  location: "",
  lat: null,
  lng: null,
  vaccination_status: "",
  description: "",
});


  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      setError("You can upload up to 5 images.");
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

  const handleUseCurrentLocation = async () => {
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

    await axios.post(
      `${API_URL}/pets/adoption/create/`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setIsSubmitted(true);
  } catch (err) {
    console.error(err.response?.data);
    setError("Failed to submit report.");
  } finally {
    setLoading(false);
  }
};


  if (!user) {
    return (
    <div className="success-wrapper">
      <div className="success-card">
        <h2>Please log in</h2>
        <p className="warning">You must be logged in to register a pet for adoption.</p>
        <Link to="/login" className="primary-btn">Login</Link>
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
          <h2>Registration Successful!</h2>
          <p>
            Your pet is now live and visible in the adoptable pets section.
          </p>

          <div className="success-actions">
            <Link to="/adopt" className="primary-btn">
              Browse All Pets
            </Link>
            <Link to="/user-dashboard" className="ghost-btn">
              Go to Dashboard
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
    <div className="register-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Adoption </button>

      <div className="page-header">
        <h1>Register for Adoption</h1>
        <p>Create a beautiful profile to help a pet find a loving home.</p>
      </div>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="register-layout">
        <div className="register-main">
          <section>
            <h3><span>1</span> Pet Photos</h3>

            <div className="image-grid">
              <label className="featured-upload">
                {previews[0] ? (
                  <img src={previews[0]} alt="Featured" />
                ) : (
                  <>
                    <Camera size={36} />
                    <span>Add Featured Photo</span>
                  </>
                )}
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </label>

              {previews.slice(1).map((src, i) => (
                <div key={i} className="image-preview">
                  <img src={src} alt="preview" />
                </div>
              ))}

              {previews.length < 5 && (
                <label className="upload-box">
                  <Upload size={20} />
                  <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </section>

          <section>
            <h3><span>2</span> Basic Details</h3>

            <div className="grid-2">
              <input name="name" placeholder="Pet Name" onChange={handleChange} required />
              <select name="type" onChange={handleChange} required>
                <option value="">Species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="rabbit">Other</option>
              </select>
              <input name="breed" placeholder="Breed" onChange={handleChange} required />
              <select name="age" onChange={handleChange} required>
                <option value="">Age Group</option>
                <option value="baby">Baby</option>
                <option value="young">Young</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </section>

          <section>
            <h3><span>3</span> Health & Location</h3>

            <div className="input-icon">
  <MapPin size={16} />
  <input
    name="location"
    placeholder="City, Area"
    onChange={handleChange}
    required
  />
</div>
            <select name="vaccination_status" onChange={handleChange}>
              <option value="">Vaccination Status</option>
              <option value="fully">Fully Vaccinated</option>
              <option value="partially">Partially Vaccinated</option>
              <option value="not">Not Vaccinated</option>
              <option value="unknown">Unknown</option>
            </select>

            <textarea name="description" placeholder="Tell their story...
            (Description)"
              onChange={handleChange} required/>
          </section>
        </div>

        <aside className="register-sidebar">
          <div className="sidebar-card">
            <ShieldCheck size={28} />
            <h4>Safe Adoption</h4>
            <p>We ensure every pet finds a verified and loving home.</p>
              <span>
              <HeartPulse size={18} className="heart" />
              <h4>Tip for Registering</h4>Upload vaccination records to build trust.</span>
            <button className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Profile"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default RegisterPetPage;