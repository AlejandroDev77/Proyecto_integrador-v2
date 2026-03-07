import { useState, useEffect } from "react";
import { getCategoriasMuebles } from "../../services/Categoria_MuebleService";

interface CategoriaMueble {
  cod_cat?: string;
  id_cat: number;
  nom_cat: string;
  desc_cat: string;
};


export function useCategoriasMuebles() {
  const [categoriasmuebles, setCategoriasMuebles] = useState<CategoriaMueble[]>([]);
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
          if (value) {
            if (key.startsWith('filter[')) {
              params[key] = value;
            } else {
              params[`filter[${key}]`] = value;
            }
          }
        });

        if (sort && typeof sort === 'string' && sort.trim() !== '') {
          params.sort = sort;
        }

        const data = await getCategoriasMuebles(currentPage, itemsPerPage, params);
        setCategoriasMuebles(data.data || data);
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

  const filtered = categoriasmuebles.filter((c) =>
    `${c.nom_cat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    categoriasmuebles,
    setCategoriasMuebles,
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
