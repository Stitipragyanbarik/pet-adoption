import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config/api";
import "./EditPetPage.css";


const EditPetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    location: "",
    vaccination_status: "",
    description: "",
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/pets/adoption/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData({
          name: res.data.name || "",
          type: res.data.type || "",
          breed: res.data.breed || "",
          age: res.data.age || "",
          location: res.data.location || "",
          vaccination_status: res.data.vaccination_status || "",
          description: res.data.description || "",
        });
      } catch {
        setError("Failed to load pet details");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, token]);

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.put(
        `${API_BASE_URL}/pets/adoption/${id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/user-dashboard");
    } catch {
      setError("Failed to update pet");
    }
  };

  if (loading) {
    return <div className="register-page1">Loading pet details...</div>;
  }

  return (
    <div className="register-page1">
      <h1>Edit Pet Listing</h1>

      <form onSubmit={handleSubmit} className="register-layout1">
        <div className="register-main1">
          <input
            name="name"
            placeholder="Pet Name"
            value={formData.name}
            onChange={handleChange}
            required/>

          <input
            name="breed"
            placeholder="Breed"
            value={formData.breed}
            onChange={handleChange}/>

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required/>

          <input
            name="vaccination_status"
            placeholder="Vaccination Status"
            value={formData.vaccination_status}
            onChange={handleChange}/>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}/>

          <button className="submit-btn1">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPetPage;
