import React, { createContext, useState, useContext } from "react";
import petService from "../services/petService";

export const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await petService.getAllPets();
      setPets(data || []);
    } catch (err) {
      setError(err.message || "Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (petData) => {
    setLoading(true);
    setError(null);

    try {
      const newPet = await petService.createPet(petData);

      setPets((prevPets) => [...prevPets, newPet]);
      return newPet;
    } catch (err) {
      setError(err.message || "Failed to add pet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePet = async (petId, petData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPet = await petService.updatePet(petId, petData);

      setPets((prevPets) =>
        prevPets.map((pet) => (pet.id === petId ? updatedPet : pet))
      );

      return updatedPet;
    } catch (err) {
      setError(err.message || "Failed to update pet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId) => {
    setLoading(true);
    setError(null);

    try {
      await petService.deletePet(petId);

      setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
    } catch (err) {
      setError(err.message || "Failed to delete pet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        loading,
        error,
        fetchPets,
        addPet,
        updatePet,
        deletePet,
      }}>
      {children}
    </PetContext.Provider>
  );
};


export const usePets = () => {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error("usePets must be used within a PetProvider");
  }

  return context;
};
