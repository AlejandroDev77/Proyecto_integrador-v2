import { useState, useEffect } from "react";
import { getLogs, LogFilters } from "../../services/LogService";

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
  const [action, setAction] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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
        const filters: LogFilters = {
          ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
          ...(action ? { action } : {}),
          ...(fromDate ? { from_date: fromDate } : {}),
          ...(toDate ? { to_date: toDate } : {}),
        };
        const data = await getLogs(currentPage, itemsPerPage, filters);
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
  }, [currentPage, itemsPerPage, searchTerm, action, fromDate, toDate]);

  const clearFilters = () => {
    setSearchTerm("");
    setAction("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return {
    logs,
    setLogs,
    searchTerm,
    setSearchTerm,
    action,
    setAction,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    clearFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    showModalAgregar,
    setShowModalAgregar,  
    totalItems,
    totalPages,
    loading,
    paginatedData: logs,
    
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
