import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const login = async ({ username, password }) => {
  const response = await axios.post(`${API_URL}/users/login/`, {
    username,
    password,
  });
console.log("LOGIN PAYLOAD:", { username, password });

  const { access, refresh, user } = response.data;

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};


const register = async (userData) => {
  const res = await axios.post(
    `${API_URL}/users/register/`,
    {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || ""
    }
  );

  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data.user;
};


const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  getAccessToken,
};
