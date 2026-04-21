import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "../Components/Pets/PetCard";
import { useAuth } from "../contexts/AuthContext";
import "./FavoritesPage.css";

const API_URL = "http://localhost:8000/api/pets/favorites/";

const FavoritesPage = () => {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setPets([]);
      setLoading(false);
      return;
    }

    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPets(res.data))
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          Your Wishlist
        </motion.h1>
        <p>Pets you’ve saved and might want to adopt ❤️</p>
      </div>

      {loading ? (
        <p className="favorites-loading">Loading favorites...</p>
      ) : pets.length === 0 ? (
        <div className="favorites-empty">
          <Heart size={48} />
          <h3>No favorites yet</h3>
          <Link to="/adopt" className="favorites-btn">Browse Pets</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {pets.map(pet => (
            <Link key={pet.id} to={`/adopt/${pet.id}`}>
              <PetCard pet={pet} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
