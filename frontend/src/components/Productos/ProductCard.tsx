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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOutOfStock) return;
    setIsAdding(true);
    const priceNum = parseInt(p.price.replace(/\D/g, "")) || 0;
    addItem({
      id_mue: p.id,
      nom_mue: p.title,
      img_mue: p.img,
      precio_venta: priceNum,
    });

    // Flying animation
    const button = e.currentTarget;
    const card = button.closest('article');
    const img = card?.querySelector('img');
    const cartIcon = document.getElementById('cart-icon') || document.getElementById('cart-icon-mobile');

    if (img && cartIcon) {
      const imgRect = img.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const flyingImg = document.createElement('img');
      flyingImg.src = p.img;
      flyingImg.style.position = 'fixed';
      flyingImg.style.left = `${imgRect.left}px`;
      flyingImg.style.top = `${imgRect.top}px`;
      flyingImg.style.width = `${imgRect.width}px`;
      flyingImg.style.height = `${imgRect.height}px`;
      flyingImg.style.objectFit = 'contain';
      flyingImg.style.zIndex = '999999';
      flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      flyingImg.style.pointerEvents = 'none';

      document.body.appendChild(flyingImg);

      requestAnimationFrame(() => {
        flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingImg.style.width = '20px';
        flyingImg.style.height = '20px';
        flyingImg.style.opacity = '0';
        flyingImg.style.transform = 'scale(0.1) rotate(15deg) translate(-50%, -50%)';
      });

      setTimeout(() => {
        flyingImg.remove();
        setIsAdding(false);
        setIsOpen(true);
      }, 800);
    } else {
      setTimeout(() => {
        setIsAdding(false);
        setIsOpen(true);
      }, 300);
    }
  };

  const handleToggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onToggleFavorite?.(p.id, newState);
  };

  return (
    <motion.article
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
        <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#7c5e3c] shadow-[0_4px_12px_rgba(166,124,82,0.15)] border border-white/60 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#a67c52]" />
          {p.category}
        </div>

        {/* Stock badge */}
        {!isOutOfStock && (
          <div className="absolute top-4 right-14 bg-green-500/90 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-green-500/20 border border-green-400/50">
            <Package className="w-3.5 h-3.5" />
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
        <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center gap-2 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
          <button
            onClick={() => onQuickView(p)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl text-sm font-bold text-[#3a2f22] shadow-[0_8px_16px_rgba(58,47,34,0.1)] hover:bg-white hover:scale-105 transition-all border border-white/60"
          >
            <Eye className="w-4 h-4 text-[#a67c52]" />
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
              flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden
              ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : isAdding
                  ? "bg-green-500 text-white scale-95 shadow-inner"
                  : "bg-gradient-to-r from-[#a67c52] to-[#8b6914] text-white hover:shadow-[0_8px_20px_rgba(166,124,82,0.4)] hover:scale-[1.03] group/btn"
              }
            `}
          >
            {/* Glossy overlay effect for the button */}
            {!isOutOfStock && !isAdding && (
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover/btn:translate-y-[100%] transition-transform duration-700 ease-in-out" />
            )}
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
