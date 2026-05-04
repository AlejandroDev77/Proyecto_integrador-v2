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
import { CustomRoomModal, CustomRoomConfig } from "../../components/Productos/RoomBuilder/CustomRoomModal";

// Estancias data - for the room planner feature
const ESTANCIAS_DATA = [
  {
    id: 1,
    name: "Sala de estar",
    image: "/images/room_builder/empty_sala.png",
    icon: Sofa,
  },
  {
    id: 2,
    name: "Dormitorio",
    image: "/images/room_builder/empty_dormitorio.png",
    icon: Bed,
  },
  { id: 3, name: "Cocina", image: "/images/room_builder/empty_cocina.png", icon: ChefHat },
  {
    id: 4,
    name: "Oficina",
    image: "/images/room_builder/empty_sala.png",
    icon: Briefcase,
  },
  {
    id: 5,
    name: "Habitación infantil",
    image: "/images/room_builder/empty_dormitorio.png",
    icon: Baby,
  },
  { id: 6, name: "Comedor", image: "/images/room_builder/empty_cocina.png", icon: Home },
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
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customConfig, setCustomConfig] = useState<CustomRoomConfig | null>(null);

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
    <div className={`min-h-screen ${activeEstancia ? 'bg-[#e5e5e5]' : 'bg-[#fcfbf8]'}`}>
      <ProductsHeader query={query} setQuery={setQuery} />

      <main className={`max-w-[1800px] mx-auto ${!activeEstancia ? 'px-2 md:px-4 lg:px-6 pt-8 pb-20' : 'p-0'}`}>
        {!activeEstancia && (
          <CategoriesScroll
            categories={categoryViewModels}
            estancias={ESTANCIAS_DATA}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

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
          /* Estancias View - Room Planner Layout (IKEA Style) */
          <section className="pb-8">
            {activeEstancia ? (
                <RoomViewer 
                  initialConfig={customConfig}
                  roomName={activeEstancia === 999 ? "Personalizada" : ESTANCIAS_DATA.find((e) => e.id === activeEstancia)?.name}
                  onBack={() => setActiveEstancia(null)}
                />
            ) : (
              /* Landing Home Design */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 1. Hero Banner */}
                <div className="w-full bg-[#f3f4f6] rounded-3xl overflow-hidden flex flex-col lg:flex-row items-stretch mb-12">
                  <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                    <span className="text-xs font-bold tracking-widest text-[#0058a3] uppercase mb-4">Nuevo Planificador 3D</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">
                      Crea y visualiza <br/> tu espacio ideal
                    </h1>
                    <p className="text-gray-600 text-lg mb-8 max-w-md">
                      Explora herramientas de diseño fáciles de usar. Empieza con una habitación vacía, arrastra los muebles y encuentra la inspiración para tu hogar.
                    </p>
                    <div>
                      <button 
                        onClick={() => setActiveEstancia(ESTANCIAS_DATA[0].id)}
                        className="px-8 py-4 bg-[#0058a3] text-white rounded-full font-bold hover:bg-[#004f93] transition-all shadow-lg shadow-blue-900/20 transform hover:-translate-y-1"
                      >
                        Abre el diseñador
                      </button>
                    </div>
                  </div>
                  <div className="lg:w-1/2 min-h-[300px] relative">
                    <img 
                      src="/images/room_builder/hero.png" 
                      alt="Diseño interior 3D" 
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: "brightness(0.95)" }}
                    />
                  </div>
                </div>

                {/* 2. Cómo empezar Cards */}
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-[#111] mb-6">Elige cómo quieres empezar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Custom Dimensions */}
                    <div 
                      onClick={() => setShowCustomModal(true)}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#0058a3] hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col"
                    >
                      <div className="h-40 w-full overflow-hidden mb-4 bg-gray-50">
                        <img 
                          src="/images/room_builder/start_custom.png" 
                          alt="Crear con medidas" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-6 pb-6">
                        <h3 className="text-lg font-bold text-[#111] mb-2 flex items-center gap-2">
                          <Box className="w-5 h-5 text-[#0058a3]" /> Estancia a medida
                        </h3>
                        <p className="text-gray-500 text-sm">Configura el ancho y profundidad exactos que se adapten a tu hogar.</p>
                      </div>
                    </div>

                    {/* From scratch */}
                    <div 
                      onClick={() => {
                        setCustomConfig(null);
                        setActiveEstancia(1);
                      }}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#0058a3] hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col"
                    >
                      <div className="h-40 w-full overflow-hidden mb-4 bg-gray-50">
                        <img 
                          src="/images/room_builder/start_blank.png" 
                          alt="Diseñar desde cero" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-6 pb-6">
                        <h3 className="text-lg font-bold text-[#111] mb-2 flex items-center gap-2">
                          <Box className="w-5 h-5 text-[#0058a3]" /> Diseñar desde cero
                        </h3>
                        <p className="text-gray-500 text-sm">Abre el planificador 3D con un lienzo en blanco (12x12m) por defecto.</p>
                      </div>
                    </div>

                    {/* From template */}
                    <div 
                      onClick={() => document.getElementById("plantillas")?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#0058a3] hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col"
                    >
                      <div className="h-40 w-full overflow-hidden mb-4 bg-gray-50">
                        <img 
                          src="/images/room_builder/start_template.png" 
                          alt="Usar una plantilla" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-6 pb-6">
                        <h3 className="text-lg font-bold text-[#111] mb-2 flex items-center gap-2">
                          <Home className="w-5 h-5 text-[#a67c52]" /> Usar una plantilla
                        </h3>
                        <p className="text-gray-500 text-sm">Elige entre una de nuestras estancias pre-diseñadas y amuéblala.</p>
                      </div>
                    </div>

                    {/* Catalog */}
                    <div 
                      onClick={() => setActiveTab('categorias')}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#0058a3] hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col"
                    >
                      <div className="h-40 w-full overflow-hidden mb-4 bg-gray-50">
                        <img 
                          src="/images/room_builder/start_catalog.png" 
                          alt="Explorar catálogo" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-6 pb-6">
                        <h3 className="text-lg font-bold text-[#111] mb-2 flex items-center gap-2">
                          <Sofa className="w-5 h-5 text-green-600" /> Ver catálogo
                        </h3>
                        <p className="text-gray-500 text-sm">Explora todos nuestros muebles disponibles fuera del modo 3D.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Galería de Habitaciones (Plantillas) */}
                <div id="plantillas" className="pt-4 scroll-mt-20">
                  <h2 className="text-2xl font-bold text-[#111] mb-6">
                    Plantillas de habitaciones vacías
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ESTANCIAS_DATA.map((estancia) => {
                      const Icon = estancia.icon;
                      return (
                        <div
                          key={estancia.id}
                          onClick={() => setActiveEstancia(estancia.id)}
                          className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
                        >
                          <div className="h-[240px] bg-gray-100 overflow-hidden relative">
                            <img
                              src={estancia.image}
                              alt={estancia.name}
                              className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Simulate empty 3D room look */}
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                          </div>

                          <div className="p-5 bg-white">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-lg font-bold text-[#111]">
                                  {estancia.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                  <Icon className="w-4 h-4" /> Sala configurable
                                </p>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#0058a3] group-hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5 rotate-180" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </section>
        )}
      </main>

      {/* Modals */}
      <CustomRoomModal 
        isOpen={showCustomModal} 
        onClose={() => setShowCustomModal(false)} 
        onSubmit={(config) => {
          setCustomConfig(config);
          setActiveEstancia(999);
          setShowCustomModal(false);
        }} 
      />

      <QuickViewModal quickView={quickView} setQuickView={setQuickView} />

      {activeTab === "categorias" && <FooterSimple />}
    </div>
  );
}
