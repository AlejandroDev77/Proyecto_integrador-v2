import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Home,
  Sofa,
  Bed,
  ChefHat,
  Briefcase,
  Baby,
  Sparkles,
  ArrowLeft,
  Box,
} from "lucide-react";
import ProductCard from "../../components/Productos/ProductCard";
import ProductsHeader from "../../components/Productos/ProductsHeader";
import CategoriesScroll from "../../components/Productos/CategoriesScroll";
import FiltersMenu from "../../components/Productos/FiltersMenu";
import QuickViewModal from "../../components/Productos/QuickViewModal";
import FooterSimple from "../../components/Productos/FooterSimple";
import RoomViewer from "../../components/Productos/RoomViewer";

// Category images mapping
const CATEGORY_IMAGES: Record<string, string> = {
  Mesas: "/images/Mesa de Comedor.jpg",
  Sillas: "/images/Silla Ejecutiva.jpg",
  Sofás: "/images/Sofá 3 Plazas.jpg",
  Camas: "/images/Cama Matrimonial.jpg",
  Escritorios: "/images/Escritorio Ejecutivo.jpg",
  Estantes: "/images/Estantería Modular.jpg",
  "Muebles TV": "/images/Mueble TV Moderno.jpg",
  Cocina: "/images/Isla de Cocina.jpg",
  Baño: "/images/Mueble de Baño.jpg",
  Jardín: "/images/Juego de Jardín.jpg",
  Infantil: "/images/Cuna Infantil.jpg",
  Oficina: "/images/Recepción Ejecutiva.jpg",
};

// Estancias data - for the room planner feature
const ESTANCIAS_DATA = [
  {
    id: 1,
    name: "Sala de estar",
    image: "/images/Sofá 3 Plazas.jpg",
    icon: Sofa,
  },
  {
    id: 2,
    name: "Dormitorio",
    image: "/images/Cama Matrimonial.jpg",
    icon: Bed,
  },
  { id: 3, name: "Cocina", image: "/images/Isla de Cocina.jpg", icon: ChefHat },
  {
    id: 4,
    name: "Oficina",
    image: "/images/Escritorio Ejecutivo.jpg",
    icon: Briefcase,
  },
  {
    id: 5,
    name: "Habitación infantil",
    image: "/images/Cuna Infantil.jpg",
    icon: Baby,
  },
  { id: 6, name: "Comedor", image: "/images/Mesa de Comedor.jpg", icon: Home },
];

type Product = {
  id: number;
  title: string;
  img: string;
  category: string;
  price: string;
  desc?: string;
  cod: string;
  stock?: number;
  modelo_3d?: string;
  dimensiones?: string;
};

type Category = {
  id: number;
  name: string;
  image: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [query, setQuery] = useState<string>("");
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [showFilterMenu, setShowFilterMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"categorias" | "estancias">(
    "categorias"
  );
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [activeEstancia, setActiveEstancia] = useState<number | null>(null);

  // Get user ID from token
  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.id_usu;
      }
    } catch {
      return null;
    }
    return null;
  };

  const userId = getUserId();

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categoria");
      const cats = (res.data.data || res.data)
        .filter((c: any) => c.est_cat)
        .map((c: any) => ({
          id: c.id_cat,
          name: c.nom_cat,
          image: CATEGORY_IMAGES[c.nom_cat] || "/images/no-image.png",
        }));
      setCategories(cats);
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  };

  const fetchProducts = (page: number = 1) => {
    axios
      .get(`http://localhost:8000/api/mueble?page=${page}`)
      .then((res) => {
        const muebles = res.data.data
          .filter((m: any) => m.est_mue === true)
          .map((m: any) => ({
            id: m.id_mue,
            cod: m.cod_mue,
            title: m.nom_mue,
            img: m.img_mue
              ? m.img_mue.replace("public", "")
              : "/images/no-image.png",
            category: m.categoria?.nom_cat || "Sin categoría",
            price: `Bs. ${m.precio_venta}`,
            desc: m.desc_mue,
            stock: m.stock,
            modelo_3d: m.modelo_3d,
            dimensiones: m.dimensiones,
          }));
        setProducts(muebles);
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          per_page: res.data.per_page,
          total: res.data.total,
        });
      })
      .catch(() => {
        setProducts([]);
      });
  };

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
    fetchFavoriteIds();
  }, []);

  const fetchFavoriteIds = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `http://localhost:8000/api/cliente/favoritos/ids`,
        {
          headers: { "X-USER-ID": userId.toString() },
        }
      );
      const ids = await res.json();
      setFavoriteIds(Array.isArray(ids) ? ids : []);
    } catch (e) {
      console.error("Error loading favorites:", e);
    }
  };

  const toggleFavorite = async (productId: number, isFav: boolean) => {
    if (!userId) return;
    try {
      await fetch(`http://localhost:8000/api/cliente/favoritos/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId.toString(),
        },
        body: JSON.stringify({ id_mue: productId }),
      });
      if (isFav) {
        setFavoriteIds((prev) => [...prev, productId]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== productId));
      }
    } catch (e) {
      console.error("Error toggling favorite:", e);
    }
  };

  // Filter products
  const filtered = useMemo(() => {
    let items = [...products];

    // By category from scroll
    if (activeCategory !== "Todos") {
      items = items.filter((p) => p.category === activeCategory);
    }

    // By search query
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.cod?.toLowerCase().includes(q) ||
          p.desc?.toLowerCase().includes(q)
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([filterKey, values]) => {
      if (!values || values.length === 0) return;

      switch (filterKey) {
        case "Ordenar":
          if (values.includes("Precio: menor a mayor")) {
            items.sort((a, b) => {
              const priceA = parseInt(a.price.replace(/\D/g, "")) || 0;
              const priceB = parseInt(b.price.replace(/\D/g, "")) || 0;
              return priceA - priceB;
            });
          } else if (values.includes("Precio: mayor a menor")) {
            items.sort((a, b) => {
              const priceA = parseInt(a.price.replace(/\D/g, "")) || 0;
              const priceB = parseInt(b.price.replace(/\D/g, "")) || 0;
              return priceB - priceA;
            });
          } else if (values.includes("Alfabético: A-Z")) {
            items.sort((a, b) => a.title.localeCompare(b.title, "es"));
          } else if (values.includes("Alfabético: Z-A")) {
            items.sort((a, b) => b.title.localeCompare(a.title, "es"));
          }
          break;

        case "Precio":
          items = items.filter((item) => {
            const price = parseInt(item.price.replace(/\D/g, "")) || 0;
            return values.some((range) => {
              if (range === "Menos de Bs. 500") return price < 500;
              if (range === "Bs. 500 - 1.000")
                return price >= 500 && price <= 1000;
              if (range === "Bs. 1.000 - 2.000")
                return price >= 1000 && price <= 2000;
              if (range === "Bs. 2.000 - 5.000")
                return price >= 2000 && price <= 5000;
              if (range === "Más de Bs. 5.000") return price > 5000;
              return true;
            });
          });
          break;

        case "Categoría":
          items = items.filter((p) => values.includes(p.category));
          break;
      }
    });

    return items;
  }, [products, activeCategory, query, activeFilters]);

  // Category names for filters
  const categoryNames = categories.map((c) => c.name);

  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      <ProductsHeader query={query} setQuery={setQuery} />

      <main className="max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6 pt-8 pb-20">
        <CategoriesScroll
          categories={categories}
          estancias={ESTANCIAS_DATA}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Conditional render based on activeTab */}
        {activeTab === "categorias" ? (
          <>
            {/* Filters and Results */}
            <section className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#3a2f22]">
                    {filtered.length} productos
                    {activeCategory !== "Todos" && ` en ${activeCategory}`}
                    {query && ` para "${query}"`}
                  </h2>
                </div>

                <FiltersMenu
                  showFilterMenu={showFilterMenu}
                  setShowFilterMenu={setShowFilterMenu}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  categories={categoryNames}
                />
              </div>
            </section>

            {/* Products Grid */}
            <section>
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                }}
              >
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    onQuickView={(prod) => setQuickView(prod)}
                    isFavorite={favoriteIds.includes(p.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* Pagination */}
            <section className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => fetchProducts(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-6 py-3 bg-[#a67c52] text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#8b6842] transition font-medium"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <span className="text-[#3a2f22] font-medium">
                  Página {pagination.current_page} de {pagination.last_page}
                </span>
              </div>

              <button
                onClick={() => fetchProducts(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-6 py-3 bg-[#a67c52] text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#8b6842] transition font-medium"
              >
                Siguiente →
              </button>
            </section>
          </>
        ) : (
          /* Estancias View - Room Planner */
          <section className="py-8">
            {activeEstancia ? (
              /* Show RoomViewer when a room is selected */
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setActiveEstancia(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-[#3a2f22] font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a estancias
                  </button>
                  <h2 className="text-2xl font-bold text-[#3a2f22]">
                    {ESTANCIAS_DATA.find((e) => e.id === activeEstancia)?.name}
                  </h2>
                </div>
                <RoomViewer />
              </div>
            ) : (
              /* Show Estancias Grid */
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-[#3a2f22] mb-4">
                    Explora nuestras estancias
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Selecciona una estancia para ver cómo lucirían nuestros
                    muebles en diferentes espacios con vista 3D interactiva.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ESTANCIAS_DATA.map((estancia) => {
                    const Icon = estancia.icon;
                    return (
                      <div
                        key={estancia.id}
                        onClick={() => setActiveEstancia(estancia.id)}
                        className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                      >
                        <div className="h-[280px] overflow-hidden">
                          <img
                            src={estancia.image}
                            alt={estancia.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                              {estancia.name}
                            </h3>
                          </div>
                          <p className="text-white/80 text-sm">
                            Clic para explorar en 3D
                          </p>
                        </div>

                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#a67c52] text-white text-xs font-semibold rounded-full">
                          <Box className="w-3 h-3" />
                          Vista 3D
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <QuickViewModal quickView={quickView} setQuickView={setQuickView} />

      <FooterSimple />
    </div>
  );
}
