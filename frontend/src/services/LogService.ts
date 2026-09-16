import axiosClient from "../api/axios";

const API_URL = "/api/logs";

export interface LogFilters {
  search?: string;
  action?: string;
  from_date?: string;
  to_date?: string;
}

export async function getLogs(page: number = 1, perPage: number = 20, filters: LogFilters = {}) {
  const response = await axiosClient.get(API_URL, { params: { page, per_page: perPage, ...filters } });
  return response.data;
}

export async function exportLogs(filters: LogFilters = {}) {
  return axiosClient.get(`${API_URL}/export`, { params: filters, responseType: "blob" });
}
