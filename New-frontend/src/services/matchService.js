import apiClient from "../api/apiClients";

const matchService = {

  createMatchRequest: async (requestData) => {
    const response = await apiClient.post("/matches/", requestData);
    return response.data;
  },

  getMatchRequests: async (userId) => {
    const response = await apiClient.get(`/matches/?user=${userId}`);
    return response.data;
  },

  updateMatchRequest: async (requestId, updateData) => {
    const response = await apiClient.patch(`/matches/${requestId}/`, updateData);
    return response.data;
  },

  deleteMatchRequest: async (requestId) => {
    const response = await apiClient.delete(`/matches/${requestId}/`);
    return response.data || true;
  },

  searchMatches: async (searchCriteria) => {
    const response = await apiClient.post("/matches/search/", searchCriteria);
    return response.data;
  },
};

export default matchService;
