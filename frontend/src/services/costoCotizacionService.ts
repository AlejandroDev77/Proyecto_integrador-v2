const API_URL = "http://localhost:8080/api/costo-cotizacion";

export async function getCostosCotizacion(
  page = 1,
  perPage = 20,
  params: Record<string, any> = {}
) {
  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    ...params,
  });
  const response = await fetch(`${API_URL}?${searchParams.toString()}`);
  if (!response.ok) throw new Error("Error al obtener costos de cotización");
  return response.json();
}

export async function getCostoCotizacion(id: number) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener costo");
  return response.json();
}

export async function createCostoCotizacion(data: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear costo");
  return response.json();
}

export async function updateCostoCotizacion(id: number, data: any) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar costo");
  return response.json();
}

export async function deleteCostoCotizacion(id: number) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar costo");
  return response.json();
}
