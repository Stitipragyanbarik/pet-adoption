import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../config/api";

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

const API_URL = `${API_BASE_URL}/pets/favorites/`;

export const FavoritesProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setFavorites([]);
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(API_URL, headers);
        setFavorites(res.data.map(pet => pet.id));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [user, loading]);

  const toggleFavorite = async (petId) => {
    if (!user) {
      alert("Please login to save favorites");
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    try {
      await axios.post(API_URL, { pet_id: petId }, headers);

      setFavorites(prev =>
        prev.includes(petId)
          ? prev.filter(id => id !== petId)
          : [...prev, petId]
      );
    } catch (err) {
      console.error("Toggle favorite failed", err);
    }
  };

  const isFavorite = (petId) => favorites.includes(petId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
