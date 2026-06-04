import { useState } from "react";
import { Search, Info, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "./types";

interface ProductSidebarProps {
  products: Product[];
  addToRoom: (product: Product) => void;
}

export function ProductSidebar({ products, addToRoom }: ProductSidebarProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className={`${isOpen ? "w-[344px]" : "w-[60px]"} h-full bg-white border-r border-gray-200 flex flex-col z-10 shrink-0 transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 -right-4 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md z-20 hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
      </button>

      {isOpen ? (
        <>
          {/* Search Header */}
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-[#111] mb-4">Catálogo</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f5f5f5] rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0058a3] transition-all"
              />
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 hide-scrollbars">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Resultados ({filteredProducts.length})
            </p>

            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToRoom(p)}
                  className="group cursor-pointer flex flex-col relative"
                >
                  <div className="aspect-square bg-white rounded-lg p-2 mb-2 relative flex items-center justify-center transition-all group-hover:scale-105">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/no-image.png";
                      }}
                    />
                    
                    <div className="absolute bottom-2 right-2 bg-[#0058a3] text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                       <ShoppingCart className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#111] uppercase line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mb-1">
                      Modelo 3D disponible
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-sm font-bold text-[#111]">
                        {p.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-10">
                  <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No encontramos productos.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center pt-8">
           <ShoppingCart className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
}
