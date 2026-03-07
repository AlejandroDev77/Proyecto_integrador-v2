import { useState, useEffect } from "react";
import { getDetallesDevoluciones } from "../../services/detalle_devolucionService";

interface DetalleDevolucion {
    id_det_dev: number;
    cod_det_dev?: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    id_dev: number;
    devolucion?: {
        fec_dev: string;
        est_dev: string;
    };
    id_mue: number;
    mueble?: {
        nom_mue: string;
    };
}

export function useDetallesDevoluciones() {
  const [detallesdevoluciones, setDetallesDevoluciones] = useState<DetalleDevolucion[]>([]);
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
          per_page: itemsPerPage 
        };
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[`filter[${key}]`] = value;
        });

        if (sort && typeof sort === 'string' && sort.trim() !== '') {
          params.sort = sort;
        }

        const data = await getDetallesDevoluciones(currentPage, itemsPerPage, params);
        setDetallesDevoluciones(data.data || data);
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

  const filtered = detallesdevoluciones.filter((c) =>
    `${c.cantidad} ${c.precio_unitario} ${c.subtotal} ${c.devolucion?.fec_dev} ${c.devolucion?.est_dev} ${c.id_mue} ${c.mueble?.nom_mue}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    detallesdevoluciones,
    setDetallesDevoluciones,
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
