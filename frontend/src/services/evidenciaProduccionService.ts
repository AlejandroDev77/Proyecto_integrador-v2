const API_URL = "http://localhost:8000/api/evidencia-produccion";

export async function getEvidenciasProduccion(
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
  if (!response.ok) throw new Error("Error al obtener evidencias");
  return response.json();
}

export async function getEvidenciaProduccion(id: number) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener evidencia");
  return response.json();
}

export async function createEvidenciaProduccion(formData: FormData) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Error al crear evidencia");
  return response.json();
}

export async function updateEvidenciaProduccion(
  id: number,
  formData: FormData
) {
  // Laravel needs _method for PUT with FormData
  formData.append("_method", "PUT");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Error al actualizar evidencia");
  return response.json();
}

export async function deleteEvidenciaProduccion(id: number) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar evidencia");
  return response.json();
}

export async function getEvidenciasPorProduccion(idPro: number) {
  const response = await fetch(`${API_URL}/por-produccion/${idPro}`);
  if (!response.ok) throw new Error("Error al obtener evidencias");
  return response.json();
}
