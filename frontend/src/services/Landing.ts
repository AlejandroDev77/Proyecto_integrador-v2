import axiosClient from "../api/axios";

export const getMuebles = async () => {
  const res = await axiosClient.get("/api/muebles");
  // API returns paginated response, data is in res.data.data
  return res.data.data || res.data;
};

export const sendContacto = async (data: any) => {
  return await axiosClient.post("/api/contacto", data);
};
