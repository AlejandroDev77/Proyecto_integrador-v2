import axios from "axios";

const API_URL = "http://localhost:8080/api/cliente";

// Get auth headers from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Get current client data for authenticated user
 */
export async function getClienteActual() {
  const response = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

/**
 * Get client's quotations
 */
export async function getMisCotizaciones(
  page: number = 1,
  perPage: number = 10
) {
  const response = await axios.get(`${API_URL}/cotizaciones`, {
    headers: getAuthHeaders(),
    params: { page, per_page: perPage },
  });
  return response.data;
}

/**
 * Get single quotation details
 */
export async function getCotizacionDetalle(id: number) {
  const response = await axios.get(`${API_URL}/cotizaciones/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

/**
 * Request a new quotation
 */
export interface ProductoSolicitud {
  id_mue: number;
  cantidad: number;
  personalizacion?: string;
}

export interface SolicitudCotizacion {
  tipo_proyecto: string;
  presupuesto_cliente?: number;
  plazo_esperado?: number;
  direccion_instalacion?: string;
  notas?: string;
  productos: ProductoSolicitud[];
}

export async function solicitarCotizacion(data: SolicitudCotizacion) {
  const response = await axios.post(`${API_URL}/cotizaciones/solicitar`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

/**
 * Cancel a pending quotation
 */
export async function cancelarCotizacion(id: number) {
  const response = await axios.post(
    `${API_URL}/cotizaciones/${id}/cancelar`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
}

/**
 * Get client's orders
 */
export async function getMisPedidos(page: number = 1, perPage: number = 10) {
  const response = await axios.get(`${API_URL}/pedidos`, {
    headers: getAuthHeaders(),
    params: { page, per_page: perPage },
  });
  return response.data;
}

/**
 * Get single order details
 */
export async function getPedidoDetalle(id: number) {
  const response = await axios.get(`${API_URL}/pedidos/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

/**
 * Get client's productions (furniture being manufactured)
 */
export async function getMisProducciones(
  page: number = 1,
  perPage: number = 10
) {
  const response = await axios.get(`${API_URL}/producciones`, {
    headers: getAuthHeaders(),
    params: { page, per_page: perPage },
  });
  return response.data;
}

/**
 * Get single production details with stages and evidence
 */
export async function getProduccionDetalle(id: number) {
  const response = await axios.get(`${API_URL}/producciones/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}
