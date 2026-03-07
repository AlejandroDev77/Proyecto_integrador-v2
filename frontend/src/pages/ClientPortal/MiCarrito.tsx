import {
  ShoppingCart,
  Package,
  Trash2,
  Plus,
  Minus,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function MiCarrito() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  if (items.length === 0) {
    return (
      <>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-[#3a2f22] flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-[#a67c52]" />
            Mi Carrito
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Productos en tu carrito de compras
          </p>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Explora nuestro catálogo y añade productos para solicitar una
            cotización
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#a67c52] text-white rounded-xl font-medium hover:bg-[#8b6914] transition"
          >
            <Package className="w-4 h-4" />
            Ver Catálogo
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#3a2f22] flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-[#a67c52]" />
            Mi Carrito
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalItems} producto(s) en tu carrito
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-red-500 text-sm font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Vaciar carrito
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id_mue}
            className="flex gap-4 p-4 bg-gray-50 rounded-xl"
          >
            {item.img_mue ? (
              <img
                src={item.img_mue.replace("public", "")}
                alt={item.nom_mue}
                className="w-20 h-20 rounded-lg object-cover bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-[#3a2f22] truncate">
                  {item.nom_mue}
                </p>
                <button
                  onClick={() => removeItem(item.id_mue)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[#a67c52] font-bold">
                Bs. {Number(item.precio_venta).toLocaleString("es-ES")} c/u
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                  <button
                    onClick={() =>
                      updateQuantity(item.id_mue, item.cantidad - 1)
                    }
                    className="p-1.5 hover:bg-gray-50 rounded-l-lg transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-medium">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id_mue, item.cantidad + 1)
                    }
                    className="p-1.5 hover:bg-gray-50 rounded-r-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  = Bs.{" "}
                  {(item.precio_venta * item.cantidad).toLocaleString("es-ES")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-[#a67c52] rounded-xl p-5 text-white">
        <div className="flex justify-between items-center mb-4">
          <span className="opacity-80">Total Estimado:</span>
          <span className="text-2xl font-bold">
            Bs. {totalPrice.toLocaleString("es-ES")}
          </span>
        </div>
        <Link
          to="/solicitar-cotizacion"
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#3a2f22] text-white rounded-xl font-semibold hover:bg-[#2a1f12] transition"
        >
          <FileText className="w-5 h-5" />
          Solicitar Cotización
        </Link>
        <p className="text-xs opacity-60 text-center mt-3">
          * El precio final será confirmado por nuestro equipo
        </p>
      </div>
    </>
  );
}
