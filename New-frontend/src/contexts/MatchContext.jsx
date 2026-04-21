import React, { createContext, useState, useEffect } from "react";
import matchService from "../services/matchService";

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await matchService.getMatches();
        setMatches(data || []); 
      } catch (err) {
        setError(err.message || "Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const addMatch = async (matchData) => {
    setError(null);

    try {
      const newMatch = await matchService.createMatch(matchData);

      setMatches((prev) => [...prev, newMatch]);
      return newMatch;
    } catch (err) {
      setError(err.message || "Failed to add match");
      throw err;
    }
  };

  const removeMatch = async (matchId) => {
    setError(null);

    try {
      await matchService.deleteMatch(matchId);

      setMatches((prev) => prev.filter((match) => match.id !== matchId));
    } catch (err) {
      setError(err.message || "Failed to delete match");
      throw err;
    }
  };

  return (
    <MatchContext.Provider
      value={{
        matches,
        loading,
        error,
        addMatch,
        removeMatch,
      }}>
      {children}
    </MatchContext.Provider>
  );
};
