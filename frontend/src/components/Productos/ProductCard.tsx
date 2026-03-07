import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Sparkles, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

export type Product = {
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

type Props = {
  p: Product;
  onQuickView: (p: Product) => void;
  onToggleFavorite?: (id: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
};

export default function ProductCard({
  p,
  onQuickView,
  onToggleFavorite,
  isFavorite: initialFavorite = false,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, setIsOpen } = useCart();

  // Sync with prop changes
  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const stock = p.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    const priceNum = parseInt(p.price.replace(/\D/g, "")) || 0;
    addItem({
      id_mue: p.id,
      nom_mue: p.title,
      img_mue: p.img,
      precio_venta: priceNum,
    });
    setTimeout(() => {
      setIsAdding(false);
      setIsOpen(true);
    }, 300);
  };

  const handleToggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onToggleFavorite?.(p.id, newState);
  };

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-[#faf8f5] to-[#f3ebe0] flex items-center justify-center h-[240px] overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              Sin Stock
            </span>
          </div>
        )}

        {/* Product image with zoom effect */}
        <motion.img
          src={p.img}
          alt={p.title}
          className={`max-h-[85%] max-w-[85%] object-contain p-4 transition-transform duration-500 group-hover:scale-110 ${
            isOutOfStock ? "grayscale" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#7c5e3c] shadow-lg border border-[#e8dcc7] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          {p.category}
        </div>

        {/* Stock badge */}
        {!isOutOfStock && (
          <div className="absolute top-4 right-14 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Package className="w-3 h-3" />
            {stock}
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={`
            absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-300
            ${
              isFavorite
                ? "bg-red-500 text-white scale-110"
                : "bg-white/95 text-gray-400 hover:text-red-500 hover:scale-110"
            }
          `}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => onQuickView(p)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm font-medium text-[#3a2f22] shadow-lg hover:bg-white transition border border-white/50"
          >
            <Eye className="w-4 h-4" />
            Vista rápida
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Price */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-[#3a2f22] line-clamp-1 group-hover:text-[#a67c52] transition-colors">
            {p.title}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold bg-gradient-to-r from-[#a67c52] to-[#8b6914] bg-clip-text text-transparent">
              {p.price}
            </span>
            {stock > 0 && stock <= 5 && (
              <span className="text-xs text-orange-500 font-medium">
                ¡Últimas unidades!
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{p.desc}</p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300
              ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isAdding
                  ? "bg-green-500 text-white scale-95"
                  : "bg-gradient-to-r from-[#a67c52] to-[#8b6914] text-white hover:shadow-lg hover:scale-[1.02]"
              }
            `}
          >
            {isOutOfStock ? (
              <>
                <Package className="w-4 h-4" />
                Agotado
              </>
            ) : isAdding ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Añadir al carrito
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a67c52] via-[#d4a574] to-[#a67c52] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.article>
  );
}
