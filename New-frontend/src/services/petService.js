import apiClient from "../api/apiClients";

const getPetById = async (id) => {
  const res = await apiClient.get(`/pets/adoption/${id}/`);
  return res.data;
};

export default {
  getPetById,
};
