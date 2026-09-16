export type ModalPagination = {
  currentPage: number;
  lastPage: number;
  total: number;
};

type PageResponse<T> = {
  items: T[];
  pagination: ModalPagination;
};

/**
 * Normaliza respuestas paginadas del backend y el formato histórico usado
 * por algunos modales. El backend actual devuelve ApiResponse<PageResult>.
 */
export function normalizePageResponse<T>(response: unknown): PageResponse<T> {
  const outer = response && typeof response === "object" ? response as Record<string, unknown> : {};
  const candidate = outer.data;
  const page = candidate && typeof candidate === "object" && !Array.isArray(candidate)
    ? candidate as Record<string, unknown>
    : outer;

  const rawItems = Array.isArray(candidate)
    ? candidate as T[]
    : Array.isArray(page.content)
      ? page.content as T[]
      : Array.isArray(page.data)
        ? page.data as T[]
        : [];

  // Algunas entidades se serializan con `id` aunque los modales usan el
  // identificador específico de la relación (id_dev, id_mue, etc.).
  // Conservamos ambos formatos para que una comparación nunca termine siendo
  // `undefined === undefined` y marque todas las tarjetas.
  const relationIds = [
    "id_cli", "id_emp", "id_mue", "id_dev", "id_ven", "id_cot",
    "id_pro", "id_eta", "id_mat", "id_usu", "id_cat", "id_rol",
  ];
  const items = rawItems.map((item) => {
    if (!item || typeof item !== "object" || !("id" in item)) return item;
    const record = item as Record<string, unknown>;
    const id = record.id;
    if (typeof id !== "number") return item;
    const aliases = Object.fromEntries(
      relationIds
        .filter((key) => record[key] == null)
        .map((key) => [key, id])
    );
    return { ...record, ...aliases } as T;
  });

  const number = (value: unknown, fallback: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

  return {
    items,
    pagination: {
      currentPage: number(page.page ?? page.current_page ?? outer.current_page, 1),
      lastPage: number(page.totalPages ?? page.total_pages ?? page.last_page ?? outer.last_page, 1),
      total: number(page.totalElements ?? page.total_elements ?? page.total ?? outer.total, items.length),
    },
  };
}
