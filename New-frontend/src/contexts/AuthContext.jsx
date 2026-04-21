import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    const storedToken = localStorage.getItem("access_token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async ({ username, password }) => {
  const user = await authService.login({ username, password });
  setUser(user);
  setToken(localStorage.getItem("access_token"));
  return user;
};

  const register = async (userData) => {
    const newUser = await authService.register(userData);

    setUser(newUser);
    setToken(localStorage.getItem("access_token"));

    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
