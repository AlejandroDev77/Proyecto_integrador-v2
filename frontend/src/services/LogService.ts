import axiosClient from "../api/axios";

const API_URL = "/api/logs";

export async function getLogs(page: number = 1, perPage: number = 20) {
  const response = await axiosClient.get(API_URL, { params: { page, per_page: perPage } });
  return response.data;
}
