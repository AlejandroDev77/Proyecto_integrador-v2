import { ChevronRight, Grid3X3, Home } from "lucide-react";

type Category = {
  id: number;
  name: string;
  image: string;
};

type Props = {
  categories: Category[];
  estancias: Category[];
  activeCategory: string;
  setActiveCategory: (s: string) => void;
  activeTab: "categorias" | "estancias";
  setActiveTab: (t: "categorias" | "estancias") => void;
};

export default function CategoriesScroll({
  categories,
  estancias,
  activeCategory,
  setActiveCategory,
  activeTab,
  setActiveTab,
}: Props) {
  const items = activeTab === "categorias" ? categories : estancias;

  return (
    <section className="mb-6">
      {/* Tabs - Rectangular design */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className={`
            flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300
            ${
              activeTab === "categorias"
                ? "bg-gradient-to-r from-[#3a2f22] to-[#4a3b2b] text-white shadow-[0_4px_12px_rgba(58,47,34,0.3)] scale-105"
                : "bg-white text-[#7c5e3c] hover:bg-[#f3e7d7] border border-[#e8dcc7] shadow-sm hover:shadow-md"
            }
          `}
          onClick={() => setActiveTab("categorias")}
        >
          <Grid3X3 className="w-4 h-4" />
          Categorías
        </button>
        <button
          className={`
            flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300
            ${
              activeTab === "estancias"
                ? "bg-gradient-to-r from-[#3a2f22] to-[#4a3b2b] text-white shadow-[0_4px_12px_rgba(58,47,34,0.3)] scale-105"
                : "bg-white text-[#7c5e3c] hover:bg-[#f3e7d7] border border-[#e8dcc7] shadow-sm hover:shadow-md"
            }
          `}
          onClick={() => setActiveTab("estancias")}
        >
          <Home className="w-4 h-4" />
          Estancias
        </button>
      </div>

      {/* Category Cards Scroll */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-[0_4px_15px_rgba(166,124,82,0.15)] rounded-full p-2.5 hover:bg-white transition-all border border-[#e8dcc7]/50 opacity-0 group-hover/scroll:opacity-100 hover:scale-110 -ml-4"
          onClick={() => {
            const container = document.querySelector(".categories-scroll");
            if (container) container.scrollLeft -= 300;
          }}
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-[#7c5e3c]" />
        </button>

        {/* Scrollable Container */}
        <div
          className="overflow-x-auto categories-scroll scroll-smooth px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-4 py-2">
            {/* "Todos" button */}
            <button
              key="todos-category"
              className={`
                flex-none flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-bold
                min-w-[100px] transition-all duration-300
                ${
                  activeCategory === "Todos"
                    ? "bg-gradient-to-r from-[#a67c52] to-[#8b6914] text-white shadow-[0_4px_12px_rgba(166,124,82,0.3)]"
                    : "bg-white text-[#7c5e3c] hover:bg-[#f3e7d7] border border-[#e8dcc7] shadow-sm"
                }
              `}
              onClick={() => setActiveCategory("Todos")}
            >
              Todos
            </button>

            {/* Category Cards */}
            {items.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.name)}
                className={`
                  flex-none group/card relative rounded-2xl overflow-hidden transition-all duration-300
                  ${
                    activeCategory === c.name
                      ? "ring-4 ring-[#a67c52] ring-offset-2 shadow-[0_8px_20px_rgba(166,124,82,0.2)] scale-[1.02]"
                      : "hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:scale-[1.02] border border-[#e8dcc7]/50"
                  }
                `}
              >
                {/* Image */}
                <div className="w-[160px] h-[100px] bg-[#f8f5f0] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/no-image.png";
                    }}
                  />
                </div>

                {/* Overlay with name */}
                <div
                  className={`
                  absolute inset-0 flex items-end p-3
                  bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-300
                `}
                >
                  <span className="text-white font-bold text-sm drop-shadow-md translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                    {c.name}
                  </span>
                </div>

                {/* Active indicator */}
                {activeCategory === c.name && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-[#a67c52] rounded-full shadow-lg" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-[0_4px_15px_rgba(166,124,82,0.15)] rounded-full p-2.5 hover:bg-white transition-all border border-[#e8dcc7]/50 opacity-0 group-hover/scroll:opacity-100 hover:scale-110 -mr-4"
          onClick={() => {
            const container = document.querySelector(".categories-scroll");
            if (container) container.scrollLeft += 300;
          }}
        >
          <ChevronRight className="w-5 h-5 text-[#7c5e3c]" />
        </button>
      </div>
    </section>
  );
}
