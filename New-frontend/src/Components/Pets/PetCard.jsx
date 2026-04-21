import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Calendar, ArrowRight, MapPin } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";
import "./PetCard.css";

const API_HOST = "http://localhost:8000";
const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x300?text=No+Image";

const PetCard = ({ pet, variant = "adoption", distanceInfo }) => {
  const navigate = useNavigate(); 
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  if (!pet?.id) return null;

  const isLostFound = variant === "lost-found";

  const name = isLostFound ? pet.pet_name || "Unknown Pet" : pet.name;
  const type = isLostFound ? pet.pet_type : pet.type;
  const location = isLostFound ? pet.location_found : pet.location;
  const breed = pet.breed;
  const createdAt = pet.created_at;

  const imagePath = pet.images?.[0]?.image;
  const imageUrl = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${API_HOST}${imagePath}`
    : FALLBACK_IMAGE;

  const favorite = !isLostFound && isFavorite(pet.id);

  return (
    <motion.div className="pet-card1">
      <div className="pet-image-wrapper1">
        <img src={imageUrl} alt={name} className="pet-image1" />

          {isLostFound && (
            <span className={`status ${pet.report_type}`}>
              {pet.report_type.toUpperCase()}
            </span>
          )}
        <div className="pet-badges">
          {!isLostFound &&(
          <span className="badge primary">{type}</span>)}
          {breed && <span className="badge secondary">{breed}</span>}
        </div>

        {!isLostFound && (
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(pet.id);
            }}>
            <Heart size={18} />
          </button>
        )}
      </div>

      <div className="pet-content">
        <h3>{name}</h3>

        <div className="pet-meta">
  <MapPin size={14} />
  <span>{location}</span>

  {distanceInfo && (
    <span className="distance-info">
      • {distanceInfo.duration} away
    </span>
  )}

          {createdAt && (
            <>
              <Calendar size={14} />
              {new Date(createdAt).toLocaleDateString()}
            </>
          )}
        </div>

        {user && (
          <button
            className="pet-action-btn"
            onClick={() =>
              navigate(
                isLostFound ? `/lost-found/${pet.id}` : `/adopt/${pet.id}`
              )
            }
          >
            View Details <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PetCard;
