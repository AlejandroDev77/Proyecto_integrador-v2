import { useState, useEffect } from "react";
import { getEtapasProducciones } from "../../services/etapa_produccionService";

interface EtapaProduccion {
    id_eta: number;
    cod_eta?: string;
    nom_eta: string;
    desc_eta: string;
    duracion_estimada: number;
    orden_secuencia: number;
}

export function useEtapasProducciones() {
  const [etapasproducciones, setEtapasProducciones] = useState<EtapaProduccion[]>([]);
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

        const data = await getEtapasProducciones(currentPage, itemsPerPage, params);
        setEtapasProducciones(data.data || data);
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

  const filtered = etapasproducciones.filter((c) =>
    `${c.nom_eta} ${c.desc_eta} ${c.duracion_estimada} ${c.orden_secuencia}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    etapasproducciones,
    setEtapasProducciones,
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
