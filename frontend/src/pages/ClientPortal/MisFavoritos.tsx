import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Heart,
  Package,
  ShoppingCart,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const API = "http://localhost:8000/api";

interface FavoritoItem {
  id_fav: number;
  id_mue: number;
  mueble: {
    id_mue: number;
    nom_mue: string;
    cod_mue: string;
    desc_mue?: string;
    img_mue?: string;
    precio_venta: number;
    stock: number;
    modelo_3d?: string;
    categoria?: string;
  } | null;
  created_at: string;
}

// Get user ID from token
const getUserId = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.id_usu;
    }
  } catch {
    return null;
  }
  return null;
};

export default function MisFavoritos() {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const { addItem, setIsOpen } = useCart();

  const userId = getUserId();

  useEffect(() => {
    fetchFavoritos();
  }, []);

  const fetchFavoritos = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/cliente/favoritos`, {
        headers: {
          "X-USER-ID": userId.toString(),
        },
      });
      const data = await res.json();
      setFavoritos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Error al cargar favoritos");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id_mue: number) => {
    if (!userId) return;

    setRemovingId(id_mue);
    try {
      await fetch(`${API}/cliente/favoritos/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId.toString(),
        },
        body: JSON.stringify({ id_mue }),
      });
      setFavoritos((prev) => prev.filter((f) => f.id_mue !== id_mue));
    } catch (e) {
      console.error("Error removing favorite:", e);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (mueble: FavoritoItem["mueble"]) => {
    if (!mueble) return;
    addItem({
      id_mue: mueble.id_mue,
      nom_mue: mueble.nom_mue,
      img_mue: mueble.img_mue,
      precio_venta: mueble.precio_venta,
    });
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#a67c52]" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#3a2f22] flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          Mis Favoritos
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {favoritos.length > 0
            ? `${favoritos.length} producto${
                favoritos.length !== 1 ? "s" : ""
              } guardado${favoritos.length !== 1 ? "s" : ""}`
            : "Tus productos guardados"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {favoritos.length === 0 ? (
        <>
          {/* Empty State */}
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-pink-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Explora nuestro catálogo y marca tus productos favoritos con el
              corazón
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#a67c52] text-white rounded-xl font-medium hover:bg-[#8b6914] transition"
            >
              <Package className="w-4 h-4" />
              Ver Catálogo
            </Link>
          </div>

          {/* Info Note */}
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-sm text-amber-700">
              <strong>💡 Consejo:</strong> Cuando navegues por los productos,
              haz clic en el icono de corazón para guardarlos aquí.
            </p>
          </div>
        </>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoritos.map((fav) => {
            const m = fav.mueble;
            if (!m) return null;

            const imgUrl = m.img_mue?.replace("public", "") || "";

            return (
              <div
                key={fav.id_fav}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition group"
              >
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-[#faf8f5] to-[#f3ebe0] flex items-center justify-center">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={m.nom_mue}
                      className="max-h-[90%] max-w-[90%] object-contain"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-gray-300" />
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(m.id_mue)}
                    disabled={removingId === m.id_mue}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
                  >
                    {removingId === m.id_mue ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Stock badge */}
                  {m.stock <= 0 && (
                    <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Sin stock
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-[#3a2f22] line-clamp-1">
                        {m.nom_mue}
                      </h4>
                      {m.categoria && (
                        <p className="text-xs text-gray-500">{m.categoria}</p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-[#a67c52]">
                      Bs. {m.precio_venta.toLocaleString()}
                    </span>
                  </div>

                  {m.desc_mue && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {m.desc_mue}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(m)}
                      disabled={m.stock <= 0}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#a67c52] text-white text-sm font-medium rounded-lg hover:bg-[#8b6914] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Añadir
                    </button>
                    <Link
                      to={`/products?view=${m.id_mue}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
