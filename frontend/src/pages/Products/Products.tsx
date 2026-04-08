import { useState, useEffect } from "react";
import {
  Home,
  Sofa,
  Bed,
  ChefHat,
  Briefcase,
  Baby,
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
import {
  useFetchCategories,
  useFetchProducts,
  useUserId,
  useFavorites,
  useMapProductsToVM,
  useProductFilters,
  CATEGORY_IMAGES,
} from "../../hooks/useProducts";
import { ProductViewModel, FilterState } from "../../services/products/types";

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

export default function ProductsPage() {
  // Hooks personalizados
  const userId = useUserId();
  const { categories } = useFetchCategories();
  const {
    products: rawProducts,
    pagination,
    fetchProducts,
  } = useFetchProducts();
  const { favoriteIds, toggleFavorite } = useFavorites(userId);

  // Mapeo de productos a ViewModel
  const productsVM = useMapProductsToVM(rawProducts);

  // Estados locales
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [query, setQuery] = useState<string>("");
  const [quickView, setQuickView] = useState<ProductViewModel | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [showFilterMenu, setShowFilterMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"categorias" | "estancias">(
    "categorias"
  );
  const [activeEstancia, setActiveEstancia] = useState<number | null>(null);

  // Obtener categorías de categoriesFromAPI
  const categoryViewModels = categories.map((c) => ({
    id: c.id_cat,
    name: c.nom_cat,
    image: CATEGORY_IMAGES[c.nom_cat] || "/images/Sofá 3 Plazas.avif",
  }));

  // Cargar productos iniciales
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Filtrar productos
  const filtered = useProductFilters(
    productsVM,
    activeCategory,
    query,
    activeFilters
  );

  // Nombres de categorías para filtros
  const categoryNames = categoryViewModels.map((c) => c.name);

  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      <ProductsHeader query={query} setQuery={setQuery} />

      <main className="max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6 pt-8 pb-20">
        <CategoriesScroll
          categories={categoryViewModels}
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
                    onToggleFavorite={(productId, isFav) =>
                      toggleFavorite(productId, isFav)
                    }
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
