import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PetImageCarousel from "../../pages/PetImageCarousel";
import "./PetDetail.css";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL, buildMediaUrl } from "../../config/api";

const PetDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);
  const isLostFound = location.pathname.startsWith("/lost-found");

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const url = isLostFound
        ? `${API_BASE_URL}/pets/reports/${id}/`
        : `${API_BASE_URL}/pets/adoption/${id}/`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPet(res.data);
    } catch (err) {
      console.error("Detail fetch failed:", err.response?.data);
      setError("Details not found");
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [id, isLostFound, navigate]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (error || !pet) return <div className="pd-error">Details not found</div>;

  const images =
    pet.images?.map(img =>
      img.image.startsWith("http")
        ? img.image
        : buildMediaUrl(img.image)
    ) || [];

  return (
    <div className="pd-wrapper">
      <Link to={-1} className="back-link">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="pd-card">
        <div className="pd-image-section">
          <PetImageCarousel images={images} />

          {isLostFound && (
            <span className={`pd-status-badge ${pet.report_type}`}>
              {pet.report_type.toUpperCase()}
            </span>
          )}
        </div>

        <div className="pd-info">
          <h1>{pet.name || pet.pet_name}</h1>

          <p><strong>Type:</strong> {pet.type || pet.pet_type}</p>
          {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
          {pet.age && <p><strong>Age:</strong> {pet.age}</p>}

          <p>
            <strong>Location:</strong>{" "}
            {pet.location || pet.location_found}
          </p>

          <p className="pd-description">{pet.description}</p>

          {!isLostFound && (
            <button
              className="primary-btn"
              onClick={() => navigate(`/adopt/${pet.id}/request`)}>
              Request Adoption
            </button>
          )}
          {isLostFound && (
            <button
            className="primary-btn"
            onClick={() => navigate(`/lost-found/${pet.id}/respond`)}>
              Respond to Report
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
