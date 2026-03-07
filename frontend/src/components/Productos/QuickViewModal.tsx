import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  ShoppingCart,
  Package,
  Maximize2,
  Box,
  Image as ImageIcon,
  Sparkles,
  Ruler,
  Check,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { useCart } from "../../context/CartContext";
import type { Product } from "./ProductCard";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";

// 3D Model Component with error handling
function Model3D({ url, onError }: { url: string; onError?: () => void }) {
  try {
    const { scene } = useGLTF(url);
    return (
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>
    );
  } catch (e) {
    onError?.();
    return null;
  }
}

// Loading fallback for 3D
function ModelLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#a67c52" wireframe />
    </mesh>
  );
}

// No model available message
function NoModelMessage() {
  return (
    <div className="w-full h-[380px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
      <Box className="w-20 h-20 text-gray-300 mb-4" />
      <p className="text-gray-500 font-medium text-lg">
        Modelo 3D no disponible
      </p>
      <p className="text-gray-400 text-sm mt-1">
        Este producto no cuenta con un modelo 3D
      </p>
    </div>
  );
}

type Props = {
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  onToggleFavorite?: (id: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
};

export default function QuickViewModal({
  quickView,
  setQuickView,
  onToggleFavorite,
  isFavorite: initialFavorite = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<"image" | "3d">("image");
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem, setIsOpen } = useCart();
  const modelViewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quickView) {
      setActiveTab("image");
      setQuantity(1);
      setIsFavorite(initialFavorite);
    }
  }, [quickView, initialFavorite]);

  if (!quickView) return null;

  const stock = quickView.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const priceNum = parseInt(quickView.price.replace(/\D/g, "")) || 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem({
        id_mue: quickView.id,
        nom_mue: quickView.title,
        img_mue: quickView.img,
        precio_venta: priceNum,
      });
    }
    setTimeout(() => {
      setIsAdding(false);
      setIsOpen(true);
    }, 500);
  };

  const handleToggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onToggleFavorite?.(quickView.id, newState);
  };

  const has3DModel = !!quickView.modelo_3d;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={() => setQuickView(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#a67c52] to-[#8b6914] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  Vista del Producto
                </h2>
                <p className="text-white/70 text-sm">Ref: {quickView.cod}</p>
              </div>
            </div>
            <button
              onClick={() => setQuickView(null)}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 max-h-[80vh]">
            {/* Left: Image/3D Viewer */}
            <div className="bg-gradient-to-br from-[#faf8f5] to-[#f3ebe0] flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-[#e8dcc7]">
                <button
                  onClick={() => setActiveTab("image")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
                    activeTab === "image"
                      ? "bg-white text-[#a67c52] border-b-2 border-[#a67c52]"
                      : "text-gray-500 hover:text-[#a67c52]"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Imagen 2D
                </button>
                <button
                  onClick={() => has3DModel && setActiveTab("3d")}
                  disabled={!has3DModel}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
                    activeTab === "3d"
                      ? "bg-white text-[#a67c52] border-b-2 border-[#a67c52]"
                      : has3DModel
                      ? "text-gray-500 hover:text-[#a67c52]"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Box className="w-4 h-4" />
                  Modelo 3D
                  {!has3DModel && (
                    <span className="text-xs bg-gray-200 text-gray-500 px-1.5 rounded">
                      No disponible
                    </span>
                  )}
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex items-center justify-center p-8 min-h-[400px] relative">
                {activeTab === "image" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <img
                      src={quickView.img}
                      alt={quickView.title}
                      className={`max-w-full max-h-[380px] object-contain rounded-lg shadow-lg ${
                        isOutOfStock ? "grayscale" : ""
                      }`}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg">
                          Sin Stock
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex items-center justify-center"
                    ref={modelViewerRef}
                  >
                    {has3DModel ? (
                      <div className="w-full h-[380px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                        <Suspense
                          fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <Loader2 className="w-8 h-8 animate-spin text-[#a67c52]" />
                            </div>
                          }
                        >
                          <Canvas
                            camera={{ position: [0, 0, 8], fov: 45 }}
                            style={{ width: "100%", height: "100%" }}
                          >
                            <ambientLight intensity={0.7} />
                            <spotLight
                              position={[10, 10, 10]}
                              angle={0.15}
                              penumbra={1}
                            />
                            <pointLight position={[-10, -10, -10]} />
                            <Suspense fallback={<ModelLoader />}>
                              <Model3D
                                url={
                                  quickView.modelo_3d?.replace("public", "") ||
                                  ""
                                }
                              />
                            </Suspense>
                            <OrbitControls
                              autoRotate
                              autoRotateSpeed={0.8}
                              enableZoom={true}
                              enablePan={false}
                            />
                            <Environment preset="apartment" />
                          </Canvas>
                        </Suspense>
                      </div>
                    ) : (
                      <NoModelMessage />
                    )}
                  </motion.div>
                )}

                {/* Fullscreen button */}
                <button className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-lg shadow-md hover:bg-white transition">
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="p-8 overflow-y-auto max-h-[80vh]">
              {/* Category */}
              <div className="inline-flex items-center gap-1.5 bg-[#f3e7d7] text-[#7c5e3c] px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                {quickView.category}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#3a2f22] mb-2">
                {quickView.title}
              </h3>

              {/* Price & Stock */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-[#a67c52]">
                  {quickView.price}
                </span>
                {!isOutOfStock ? (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Package className="w-4 h-4" />
                    {stock} en stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Package className="w-4 h-4" />
                    Sin stock
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#7c5e3c] mb-2">
                  Descripción
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {quickView.desc ||
                    "Mueble de alta calidad fabricado con los mejores materiales."}
                </p>
              </div>

              {/* Specs */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#7c5e3c] mb-3">
                  Características
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <Sparkles className="w-4 h-4 text-[#a67c52]" />
                    <div>
                      <p className="text-xs text-gray-500">Categoría</p>
                      <p className="font-medium text-sm">
                        {quickView.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <Ruler className="w-4 h-4 text-[#a67c52]" />
                    <div>
                      <p className="text-xs text-gray-500">Dimensiones</p>
                      <p className="font-medium text-sm">
                        {quickView.dimensiones || "Por definir"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <Box className="w-4 h-4 text-[#a67c52]" />
                    <div>
                      <p className="text-xs text-gray-500">Material</p>
                      <p className="font-medium text-sm">Madera maciza</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <Check className="w-4 h-4 text-[#a67c52]" />
                    <div>
                      <p className="text-xs text-gray-500">Garantía</p>
                      <p className="font-medium text-sm">3 años</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="border-t border-gray-200 pt-6">
                {!isOutOfStock && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Cantidad:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100 rounded-l-lg transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(stock, quantity + 1))
                        }
                        className="px-3 py-2 hover:bg-gray-100 rounded-r-lg transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Subtotal:{" "}
                      <strong>
                        Bs. {(priceNum * quantity).toLocaleString()}
                      </strong>
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-xl border-2 transition ${
                      isFavorite
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition ${
                      isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isAdding
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-[#a67c52] to-[#8b6914] text-white hover:shadow-lg"
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-5 h-5" />
                        ¡Añadido!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {isOutOfStock ? "Agotado" : "Añadir al carrito"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
