import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, buildMediaUrl } from "../../config/api";
import "./AdoptablePetSlider.css";

const AdoptablePetSlider = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/pets/adoption/`);
        setPets(res.data || []);
      } catch (error) {
        console.error(
          "Failed to load adoptable pets:",
          error.response?.status,
          error.response?.data
        );
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    if (!pets.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % pets.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [pets]);

  if (!pets.length) return null;

  const pet = pets[index];

  const imageUrl = pet.images?.[0]?.image
    ? buildMediaUrl(pet.images[0].image)
    : "/images/no-pet.png";

  return (
    <div className="hero-pet-slider">
      <h1 className="hero-pet-title">Adoptable Pet</h1>
      <div
        className="hero-pet-card"
        onClick={() => navigate(`/adopt/${pet.id}`)}>
        <h3 className="hero-pet-name">{pet.name}</h3>

        <div className="hero-pet-image">
          <img src={imageUrl} alt={pet.name} />
        </div>

        <p className="hero-pet-location">
          <MapPin size={14} /> {pet.location}
        </p>
      </div>
    </div>
  );
};

export default AdoptablePetSlider;
