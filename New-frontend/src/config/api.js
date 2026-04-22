const API_ORIGIN =
  process.env.REACT_APP_API_ORIGIN || "https://pet-adoption-5-rc0b.onrender.com";

const API_BASE_URL = `${API_ORIGIN}/api`;

const buildMediaUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
};

export { API_ORIGIN, API_BASE_URL, buildMediaUrl };
