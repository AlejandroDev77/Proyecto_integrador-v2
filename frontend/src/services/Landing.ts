import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const getMuebles = async () => {
  const res = await API.get("/mueble");
  // API returns paginated response, data is in res.data.data
  return res.data.data || res.data;
};

export const sendContacto = async (data: any) => {
  return await API.post("/contacto", data);
};
