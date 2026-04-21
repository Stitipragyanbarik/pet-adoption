import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import authService from "../services/authService";

const useAuth = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setIsAuthenticated]);

  const login = async (credentials) => {
    try {
      const loggedInUser = await authService.login(credentials);

      setUser(loggedInUser);
      setIsAuthenticated(true);

      return loggedInUser;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
};

export default useAuth;
