import { Search, User2, Heart, ShoppingCart, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

type Props = {
  query?: string;
  setQuery?: (q: string) => void;
};

export default function ProductsHeader({ query = "", setQuery }: Props) {
  const navigate = useNavigate();
  const { totalItems, setIsOpen } = useCart();

  return (
    <header className="w-full sticky top-0 bg-white/80 backdrop-blur-md shadow-md z-40">
      <div className="max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6 py-4 md:py-5">
        <div className="flex items-center">
          <div className="flex items-center gap-6 flex-1">
            <a href="/" className="flex items-center gap-3">
              <img
                src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
                alt="Bosquejo"
                className="h-12 md:h-14 w-auto"
              />
              <span className="font-bold text-xl text-[#7c5e3c] hidden sm:block">
                Bosquejo
              </span>
            </a>
            {setQuery ? (
              <div className="relative flex max-w-[500px] w-full">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#a67c52]" />
                <input
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#e8dcc7] rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52] bg-white/80"
                  placeholder="Buscar Productos"
                  value={query}
                  onChange={(e) => setQuery && setQuery(e.target.value)}
                />
              </div>
            ) : (
              <div />
            )}
          </div>

          <nav className="flex md:hidden items-center gap-3">
            <button
              onClick={() => navigate("/user-profile")}
              className="hover:text-[#a67c52] p-2 rounded-full hover:bg-[#f3e7d7]"
              title="Mi cuenta"
            >
              <User2 className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate("/favoritos")}
              className="hover:text-[#a67c52] p-2 rounded-full hover:bg-[#f3e7d7]"
              title="Favoritos"
            >
              <Heart className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:text-[#a67c52] p-2 rounded-full hover:bg-[#f3e7d7]"
              title="Carrito"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#a67c52] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </nav>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[#7c5e3c] pl-8 border-l border-[#e8dcc7]">
            <a
              href="/"
              className="hover:text-[#a67c52] flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#f3e7d7] transition-colors"
            >
              <Home className="w-7 h-7" />
              <span>Inicio</span>
            </a>

            <button
              className="hover:text-[#a67c52] flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#f3e7d7] transition-colors"
              onClick={() => navigate("/user-profile")}
            >
              <User2 className="w-7 h-7" />
              <span>Mi cuenta</span>
            </button>
            <button
              onClick={() => navigate("/favoritos")}
              className="hover:text-[#a67c52] flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#f3e7d7] transition-colors"
            >
              <Heart className="w-7 h-7" />
              <span>Favoritos</span>
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:text-[#a67c52] flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#f3e7d7] transition-colors"
            >
              <ShoppingCart className="w-7 h-7" />
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#a67c52] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
