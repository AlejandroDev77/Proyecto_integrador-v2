import { useState, useEffect } from "react";
import { getMueblesMateriales } from "../../services/mueble_materialService";

interface MuebleMaterial {
  id_mue_mat: number;
  
  cod_mue_mat?: string;

    id_mue: number;
    mueble?: {
    id_mue: number;
    nom_mue: string;
    img_mue: string;
    precio_venta: number;
    precio_costo: number;
    stock: number;
    };
    id_mat: number;
    material?: {
    id_mat: number;
    nom_mat: string;
    stock_mat: number;
    costo_mat: number;
    unidad_medida: string;
    img_mat: string;
    };
    cantidad: number;

};


export function useMueblesMateriales() {
  const [mueblesmateriales, setMueblesMateriales] = useState<MuebleMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getMueblesMateriales(currentPage, itemsPerPage, filters, sort);
        setMueblesMateriales(data.data || data);
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

  const filtered = mueblesmateriales.filter((c) =>
    `${c.mueble?.nom_mue ?? ""} ${c.material?.nom_mat ?? ""} ${c.material?.stock_mat ?? ""} ${c.material?.costo_mat ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // already paginated by server

  return {
    mueblesmateriales,
    setMueblesMateriales,
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
