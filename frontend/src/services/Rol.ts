import axios from "axios";

const API_URL = "http://localhost:8000/api/roles";

export const getRoles = async (page: number = 1, perPage: number = 20) => {
  const response = await axios.get(API_URL, {
    params: { page, per_page: perPage },
  });
  return response.data;
};