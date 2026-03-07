import { useState, useEffect } from "react";
import { getDetallesVentas } from "../../services/detalle_ventaService";

interface DetalleVenta {
    id_det_ven: number;
    cod_det_ven?: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    descuento_item: number;
    id_ven: number;
    venta?: {
        fec_ven: string;
        est_ven: string;
    };
    id_mue: number;
    mueble?: {
        nom_mue: string;
    };
}

export function useDetallesVentas() {
  const [detallesventas, setDetallesVentas] = useState<DetalleVenta[]>([]);
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

        const data = await getDetallesVentas(currentPage, itemsPerPage, params);
        setDetallesVentas(data.data || data);
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

  const filtered = detallesventas.filter((c) =>
    `${c.cantidad} ${c.precio_unitario} ${c.subtotal} ${c.descuento_item} ${c.id_ven} ${c.id_mue}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    detallesventas,
    setDetallesVentas,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    loading,
    showModalAgregar,
    setShowModalAgregar,  
    
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
