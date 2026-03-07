import { useState, useEffect } from "react";
import { getDetallesCotizaciones } from "../../services/detalle_cotizacionService";

interface DetalleCotizacion {
  id_det_cot: number;
  cod_det_cot?: string;
  desc_personalizacion?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_cot: number;
  cotizacion?: {
    fec_cot: string;
    est_cot: string;
  };
  id_mue?: number | null;
  mueble?: {
    nom_mue: string;
  };
  // Campos para muebles personalizados
  nombre_mueble?: string;
  tipo_mueble?: string;
  dimensiones?: string;
  material_principal?: string;
  color_acabado?: string;
  img_referencia?: string;
  herrajes?: string;
}

export function useDetallesCotizaciones() {
  const [detallescotizaciones, setDetallesCotizaciones] = useState<
    DetalleCotizacion[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page: currentPage,
          per_page: itemsPerPage,
        };

        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[`filter[${key}]`] = value;
        });

        if (sort && typeof sort === "string" && sort.trim() !== "") {
          params.sort = sort;
        }

        const data = await getDetallesCotizaciones(
          currentPage,
          itemsPerPage,
          params
        );
        setDetallesCotizaciones(data.data || data);
        setTotalPages(data.last_page || 1);
        setTotalItems(data.total || (data.data ? data.data.length : 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [currentPage, itemsPerPage, filters, sort]);

  const filtered = detallescotizaciones.filter((c) =>
    `${c.desc_personalizacion || ""} ${c.cantidad} ${c.precio_unitario} ${
      c.subtotal
    } ${c.id_cot} ${c.cotizacion?.fec_cot} ${c.cotizacion?.est_cot} ${
      c.id_mue
    } ${c.mueble?.nom_mue} ${c.nombre_mueble || ""} ${c.tipo_mueble || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    detallescotizaciones,
    setDetallesCotizaciones,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,

    showModalAgregar,
    setShowModalAgregar,
    totalItems,
    totalPages,
    loading,
    paginatedData,
    filters,
    setFilters,
    sort,
    setSort,

    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    handlePageChange: (page: number) => setCurrentPage(page),
    handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    },
  };
}
