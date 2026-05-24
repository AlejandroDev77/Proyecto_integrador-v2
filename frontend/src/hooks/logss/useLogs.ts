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
        const realData = data.data && data.success !== undefined ? data.data : data;
        const itemsArray = realData.content || realData.data || (Array.isArray(realData) ? realData : []);
        setLogs(itemsArray);
        setTotalPages(realData.totalPages || realData.total_pages || realData.last_page || 1);
        setTotalItems(realData.totalElements || realData.total_elements || realData.total || itemsArray.length);
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
