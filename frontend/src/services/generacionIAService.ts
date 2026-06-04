import axios from "axios";
import { GeneracionIA } from "../types/generacionIA";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const generacionIAService = {
    getAll: async (page = 1, perPage = 20) => {
        const response = await axios.get(`${API_URL}/generaciones-ia`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axios.get(`${API_URL}/generaciones-ia/${id}`);
        return response.data;
    },

    create: async (data: GeneracionIA) => {
        const response = await axios.post(`${API_URL}/generaciones-ia`, data);
        return response.data;
    },

    update: async (id: number, data: Partial<GeneracionIA>) => {
        const response = await axios.put(`${API_URL}/generaciones-ia/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await axios.delete(`${API_URL}/generaciones-ia/${id}`);
    }
};
