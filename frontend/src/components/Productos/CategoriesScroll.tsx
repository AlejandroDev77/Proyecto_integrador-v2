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
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all
            ${
              activeTab === "categorias"
                ? "bg-[#3a2f22] text-white shadow-lg"
                : "bg-white text-[#7c5e3c] hover:bg-[#f3e7d7] border-2 border-[#e8dcc7]"
            }
          `}
          onClick={() => setActiveTab("categorias")}
        >
          <Grid3X3 className="w-4 h-4" />
          Categorías
        </button>
        <button
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all
            ${
              activeTab === "estancias"
                ? "bg-[#3a2f22] text-white shadow-lg"
                : "bg-white text-[#7c5e3c] hover:bg-[#f3e7d7] border-2 border-[#e8dcc7]"
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-xl p-2 hover:bg-[#f3e7d7] transition-colors"
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
              className={`
                flex-none flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold
                min-w-[100px] transition-all
                ${
                  activeCategory === "Todos"
                    ? "bg-[#a67c52] text-white shadow-md"
                    : "bg-white text-[#7c5e3c] hover:bg-[#f3e7d7] border-2 border-[#e8dcc7]"
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
                  flex-none group relative rounded-xl overflow-hidden transition-all
                  ${
                    activeCategory === c.name
                      ? "ring-3 ring-[#a67c52] ring-offset-2 shadow-lg scale-105"
                      : "hover:shadow-lg hover:scale-102"
                  }
                `}
              >
                {/* Image */}
                <div className="w-[160px] h-[100px] bg-[#f8f5f0] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                  bg-gradient-to-t from-black/70 via-black/20 to-transparent
                `}
                >
                  <span className="text-white font-medium text-sm drop-shadow-lg">
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-xl p-2 hover:bg-[#f3e7d7] transition-colors"
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
