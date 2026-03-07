import axios from "axios";

const API_URL = "http://localhost:8000/api/roles-permisos";

export const getRolesPermisos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};