import { useCart } from "../../context/CartContext";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Package,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ModalCompraCliente from "../ui/modal/cliente/ModalCompraCliente";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    setIsOpen,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleComprar = () => {
    setIsOpen(false);
    setShowCheckout(true);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#3a2f22] flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#a67c52]" />
            Carrito
            {totalItems > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#a67c52] text-white text-sm rounded-full">
                {totalItems}
              </span>
            )}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-20 h-20 text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-400 mb-6">
              Explora nuestros productos y añade los que te gusten
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-[#a67c52] text-white rounded-xl font-medium hover:bg-[#8b6914] transition"
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-[#3a2f22] truncate pr-2">
                        {item.nom_mue}
                      </p>
                      <button
                        onClick={() => removeItem(item.id_mue)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-[#a67c52] font-bold mt-1">
                      Bs. {Number(item.precio_venta).toLocaleString("es-ES")}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.id_mue, item.cantidad - 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-l-lg transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-medium">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id_mue, item.cantidad + 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-r-lg transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-bold text-[#3a2f22]">
                        Bs.{" "}
                        {(item.precio_venta * item.cantidad).toLocaleString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-5 space-y-4 bg-white">
              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                Vaciar carrito
              </button>

              {/* Total */}
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium text-gray-600">Total:</span>
                <span className="font-bold text-[#3a2f22]">
                  Bs. {totalPrice.toLocaleString("es-ES")}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleComprar}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  <CreditCard className="w-5 h-5" />
                  Comprar Ahora
                </button>
                <Link
                  to="/solicitar-cotizacion"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 bg-linear-to-r from-[#a67c52] to-[#8b6914] text-white rounded-xl font-semibold text-center hover:shadow-lg transition"
                >
                  Solicitar Cotización
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      <ModalCompraCliente
        showModal={showCheckout}
        setShowModal={setShowCheckout}
        cartItems={items}
        onSuccess={() => {
          clearCart();
          setShowCheckout(false);
        }}
      />
    </>
  );
}
