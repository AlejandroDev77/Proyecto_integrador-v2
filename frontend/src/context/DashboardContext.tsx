import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface DashboardData {
  metrics: {
    customers: {
      total: number;
      percentage: number;
    };
    employees: {
      total: number;
      percentage: number;
    };
    ventasDelMes: number;
    ventasDelPeriodo: number;
    cotizacionesPendientes: number;
    produccionesActivas: number;
    stockBajo: number;
  };
  usuarios: {
    percentage: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  ganancias_mensuales: number[];
  ganancias_ano_anterior: number[];
  cotizaciones_mensuales: {
    aprobado: number[];
    rechazado: number[];
    pendiente: number[];
  };
  ventas_vs_compras: {
    ventas: number[];
    compras: number[];
  };
  ventas_por_categoria: Array<{
    categoria: string;
    total: number;
  }>;
  estado_producciones: Array<{
    estado: string;
    total: number;
  }>;
  top_muebles: Array<{
    nombre: string;
    cantidad: number;
    total: number;
  }>;
  alertas_stock: {
    materiales: Array<{
      nombre: string;
      stock: number;
      stock_min: number;
      unidad_medida: string;
    }>;
    muebles: Array<{
      nombre: string;
      stock: number;
      stock_min: number;
    }>;
  };
  conversion_cotizaciones: {
    tasa: number;
    total: number;
    aprobadas: number;
  };
  producciones_mensuales: number[];
  compras_por_proveedor: Array<{
    proveedor: string;
    total: number;
    cantidad: number;
  }>;
  stock_muebles: Array<{
    nombre: string;
    stock: number;
    stock_min: number;
  }>;
  ventas_cantidad: number[];
}

interface DateFilters {
  year: number;
  month: number | null; // null = todo el año
  startDate: string | null; // formato YYYY-MM-DD
  endDate: string | null;
}

interface DashboardContextType {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  filters: DateFilters;
  setFilters: (filters: Partial<DateFilters>) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number | null;
  setSelectedMonth: (month: number | null) => void;
  dateRange: { start: string | null; end: string | null };
  setDateRange: (start: string | null, end: string | null) => void;
  refetch: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFiltersState] = useState<DateFilters>({
    year: currentYear,
    month: currentMonth,
    startDate: null,
    endDate: null,
  });

  const setFilters = useCallback((newFilters: Partial<DateFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Convenience setters
  const setSelectedYear = useCallback((year: number) => {
    setFiltersState((prev) => ({
      ...prev,
      year,
      startDate: null,
      endDate: null,
    }));
  }, []);

  const setSelectedMonth = useCallback((month: number | null) => {
    setFiltersState((prev) => ({
      ...prev,
      month,
      startDate: null,
      endDate: null,
    }));
  }, []);

  const setDateRange = useCallback(
    (start: string | null, end: string | null) => {
      setFiltersState((prev) => ({
        ...prev,
        startDate: start,
        endDate: end,
        // Clear year/month when using date range
        month: null,
      }));
    },
    []
  );

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      params.append("year", filters.year.toString());

      if (filters.month !== null) {
        params.append("month", filters.month.toString());
        params.append("month_filter", "specific"); // Indicate specific month filter
      }

      if (filters.startDate && filters.endDate) {
        params.append("start_date", filters.startDate);
        params.append("end_date", filters.endDate);
      }

      const response = await fetch(
        `http://localhost:8080/api/dashboard/all?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos del dashboard");
      }

      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardContext.Provider
      value={{
        data,
        loading,
        error,
        filters,
        setFilters,
        selectedYear: filters.year,
        setSelectedYear,
        selectedMonth: filters.month,
        setSelectedMonth,
        dateRange: { start: filters.startDate, end: filters.endDate },
        setDateRange,
        refetch,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard debe ser usado dentro de DashboardProvider");
  }
  return context;
};
