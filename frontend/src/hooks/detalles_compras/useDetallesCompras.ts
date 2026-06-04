import { useState, useEffect } from "react";
import { getDetallesCompras } from "../../services/detalle_compraService";

export interface DetalleCompra {
    id_det_comp: number;
    cod_det_comp?: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    id_comp: number;
    compra?: {
        fec_comp: string;
    }
    id_mat: number;
    material?: {
        nom_mat: string;
        
    };
    
}

export function useDetallesCompras() {
  const [detallescompras, setDetallesCompra] = useState<DetalleCompra[]>([]);
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

        const data = await getDetallesCompras(currentPage, itemsPerPage, filters, sort);
        const realData = data.data && data.success !== undefined ? data.data : data;
        const itemsArray = realData.content || realData.data || (Array.isArray(realData) ? realData : []);
        setDetallesCompra(itemsArray);
        setTotalPages(realData.totalPages || realData.total_pages || realData.last_page || 1);
        setTotalItems(realData.totalElements || realData.total_elements || realData.total || itemsArray.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [currentPage, itemsPerPage, filters, sort]);

  const filtered = detallescompras.filter((c) =>
    `${c.id_det_comp} ${c.cantidad} ${c.precio_unitario} ${c.subtotal} ${c.id_comp} ${c.id_mat} ${c.material?.nom_mat || ""} ${c.compra?.fec_comp || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    detallescompras,
    setDetallesCompra,
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
