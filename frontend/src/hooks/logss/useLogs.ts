import { useState, useEffect } from "react";
import { getLogs } from "../../services/LogService";

interface log {
    id: number;
    user_id: number;
    table_name: string;
    action: string;
    record_id: number;
    old_values: string | null;
    new_values: string | null;
    created_at: string;
    updated_at: string | null;
    cod_usu: string;

  
};


export function useLogs() {
  const [logs, setLogs] = useState<log[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getLogs(currentPage, itemsPerPage);
        setLogs(data.data || data);
        setTotalPages(data.last_page || 1);
        setTotalItems(data.total || (data.data ? data.data.length : 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [currentPage, itemsPerPage]);

  const filtered = logs.filter((c) =>
    `${c.cod_usu} ${c.action}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    logs,
    setLogs,
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
