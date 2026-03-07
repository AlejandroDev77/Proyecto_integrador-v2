import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Center, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Box,
  Maximize2,
  Loader2,
  Trash2,
  RefreshCw,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Layers,
  Eye,
} from "lucide-react";

// Room views with floor boundaries
const ROOM_VIEWS = [
  {
    id: 1,
    name: "Vista Isométrica",
    image: "/images/planos/1_habitacion/pano_1.jpg",
    cameraAngle: "isometric",
    floor: { xMin: 15, xMax: 85, yMin: 50, yMax: 90 },
  },
  {
    id: 2,
    name: "Vista Lateral",
    image: "/images/planos/1_habitacion/pano_2.jpg",
    cameraAngle: "side",
    floor: { xMin: 10, xMax: 90, yMin: 55, yMax: 88 },
  },
  {
    id: 3,
    name: "Vista Frontal",
    image: "/images/planos/1_habitacion/pano_3.jpg",
    cameraAngle: "front",
    floor: { xMin: 15, xMax: 85, yMin: 50, yMax: 85 },
  },
  {
    id: 4,
    name: "Vista Superior",
    image: "/images/planos/1_habitacion/pano_4.jpg",
    cameraAngle: "top",
    floor: { xMin: 20, xMax: 80, yMin: 20, yMax: 80 },
  },
  {
    id: 5,
    name: "Vista Esquina",
    image: "/images/planos/1_habitacion/pano_5.jpg",
    cameraAngle: "corner",
    floor: { xMin: 20, xMax: 85, yMin: 45, yMax: 88 },
  },
  {
    id: 6,
    name: "Vista Detalle",
    image: "/images/planos/1_habitacion/pano_6.jpg",
    cameraAngle: "detail",
    floor: { xMin: 15, xMax: 85, yMin: 50, yMax: 90 },
  },
];

// Wall colors
const WALL_COLORS = [
  { name: "Original", color: "transparent", preview: "#f5f0e6" },
  { name: "Blanco", color: "rgba(255,255,255,0.2)", preview: "#ffffff" },
  { name: "Beige", color: "rgba(245,235,220,0.25)", preview: "#f5ebdc" },
  { name: "Gris", color: "rgba(200,200,200,0.2)", preview: "#c8c8c8" },
  { name: "Azul", color: "rgba(180,210,240,0.2)", preview: "#b4d2f0" },
  { name: "Verde", color: "rgba(180,230,200,0.2)", preview: "#b4e6c8" },
  { name: "Rosa", color: "rgba(255,210,220,0.2)", preview: "#ffd2dc" },
  { name: "Lavanda", color: "rgba(220,200,240,0.2)", preview: "#dcc8f0" },
];

type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  modelo_3d: string;
};

type PlacedItem = {
  id: string;
  product: Product;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

// 3D Model Component - Small scale to fit in view
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene.clone()} scale={2} />
    </Center>
  );
}

// Furniture with 3D model - Complete model visibility
function Furniture({
  item,
  isSelected,
  floorBounds,
  onSelect,
  onUpdate,
  onRemove,
  containerRef,
}: {
  item: PlacedItem;
  isSelected: boolean;
  floorBounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  onSelect: () => void;
  onUpdate: (updates: Partial<PlacedItem>) => void;
  onRemove: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [itemStart, setItemStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setItemStart({ x: item.x, y: item.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;
      // Free movement - no bounds restrictions
      const newX = itemStart.x + deltaX;
      const newY = itemStart.y + deltaY;
      onUpdate({ x: newX, y: newY });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, itemStart]);

  // Large container
  const size = 250 * item.scale;

  return (
    <div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: size,
        height: size,
        transform: `translate(-50%, -100%) rotate(${item.rotation}deg) ${
          isDragging ? "scale(1.05)" : ""
        }`,
        transition: isDragging ? "none" : "transform 0.15s ease",
        zIndex: isSelected ? 100 : 10,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 3D Canvas - Interactive with OrbitControls */}
      <Canvas
        camera={{
          position: [0, 2, 8],
          fov: 40,
          near: 0.1,
          far: 1000,
        }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 7]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />

        <Suspense fallback={null}>
          <Model url={item.product.modelo_3d} />
        </Suspense>

        {/* OrbitControls - allows rotating/zooming the 3D model */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={!isSelected}
          autoRotateSpeed={1}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>

      {/* Shadow under furniture */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-dashed border-[#a67c52] rounded-lg pointer-events-none opacity-60" />
      )}

      {/* Controls - appear when selected */}
      <AnimatePresence>
        {isSelected && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 z-50"
            style={{ top: "calc(100% + 8px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls: Scale, Rotate, Delete */}
            <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1.5 shadow-xl">
              <button
                onClick={() =>
                  onUpdate({ scale: Math.max(0.3, item.scale - 0.15) })
                }
                className="p-1.5 hover:bg-gray-100 rounded-full"
                title="Reducir"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-xs text-gray-500 w-8 text-center">
                {Math.round(item.scale * 100)}%
              </span>
              <button
                onClick={() =>
                  onUpdate({ scale: Math.min(3, item.scale + 0.15) })
                }
                className="p-1.5 hover:bg-gray-100 rounded-full"
                title="Ampliar"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button
                onClick={() => onUpdate({ rotation: item.rotation - 45 })}
                className="p-1.5 hover:bg-gray-100 rounded-full"
                title="Rotar izquierda"
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onUpdate({ rotation: item.rotation + 45 })}
                className="p-1.5 hover:bg-gray-100 rounded-full"
                title="Rotar derecha"
              >
                <RotateCw className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button
                onClick={onRemove}
                className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoomViewer() {
  const [currentView, setCurrentView] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showProductList, setShowProductList] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [wallColor, setWallColor] = useState(WALL_COLORS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentRoom = ROOM_VIEWS[currentView];

  // Fetch products with 3D models
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/mueble")
      .then((res) => {
        const muebles = (res.data.data || res.data)
          .filter((m: any) => m.est_mue && m.modelo_3d)
          .map((m: any) => ({
            id: m.id_mue,
            name: m.nom_mue,
            image: m.img_mue?.replace("public", "") || "/images/no-image.png",
            price: `Bs. ${m.precio_venta}`,
            modelo_3d: m.modelo_3d,
          }));
        setProducts(muebles);
      })
      .catch(console.error);
  }, []);

  const addToRoom = useCallback(
    (product: Product) => {
      const floor = currentRoom.floor;
      setPlacedItems((prev) => [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          product,
          x: (floor.xMin + floor.xMax) / 2,
          y: (floor.yMin + floor.yMax) / 2,
          scale: 1,
          rotation: 0,
        },
      ]);
    },
    [currentRoom]
  );

  const updateItem = useCallback((id: string, updates: Partial<PlacedItem>) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setPlacedItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItemId(null);
  }, []);

  return (
    <div
      className={`relative ${
        isFullscreen ? "fixed inset-0 z-50" : "rounded-2xl overflow-hidden"
      }`}
    >
      {/* Room Container */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{
          height: isFullscreen ? "100vh" : "600px",
          background: "#d8d0c4",
        }}
        onClick={() => setSelectedItemId(null)}
      >
        {/* Room Image - Full size */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              src={currentRoom.image}
              alt={currentRoom.name}
              className="max-w-full max-h-full"
              style={{ objectFit: "contain" }}
            />
            {wallColor.color !== "transparent" && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: wallColor.color,
                  mixBlendMode: "multiply",
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Placed 3D Furniture */}
        {placedItems.map((item) => (
          <Furniture
            key={item.id}
            item={item}
            isSelected={selectedItemId === item.id}
            floorBounds={currentRoom.floor}
            onSelect={() => setSelectedItemId(item.id)}
            onUpdate={(updates) => updateItem(item.id, updates)}
            onRemove={() => removeItem(item.id)}
            containerRef={containerRef}
          />
        ))}

        {/* Navigation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentView(
              (p) => (p - 1 + ROOM_VIEWS.length) % ROOM_VIEWS.length
            );
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg z-40"
        >
          <ChevronLeft className="w-5 h-5 text-[#3a2f22]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentView((p) => (p + 1) % ROOM_VIEWS.length);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg z-40"
        >
          <ChevronRight className="w-5 h-5 text-[#3a2f22]" />
        </button>

        {/* View dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/50 rounded-full z-40">
          {ROOM_VIEWS.map((v, i) => (
            <button
              key={v.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(i);
              }}
              className={`w-2 h-2 rounded-full ${
                currentView === i ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Top bar */}
        <div className="absolute top-3 left-3 right-3 flex justify-between z-40">
          <div className="flex items-center gap-2 px-3 py-2 bg-black/50 rounded-xl text-white">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{currentRoom.name}</span>
          </div>

          <div className="flex gap-2">
            {/* Wall color picker */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white/95 rounded-xl shadow-lg"
              >
                <Palette className="w-4 h-4 text-[#a67c52]" />
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: wallColor.preview }}
                />
              </button>
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-3 w-44 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-xs font-bold text-[#3a2f22] mb-2">
                      Paredes
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {WALL_COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setWallColor(c);
                            setShowColorPicker(false);
                          }}
                          className={`w-7 h-7 rounded-lg ${
                            wallColor.name === c.name
                              ? "ring-2 ring-[#a67c52]"
                              : "border border-gray-200"
                          }`}
                          style={{ backgroundColor: c.preview }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProductList(!showProductList);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg ${
                showProductList
                  ? "bg-[#a67c52] text-white"
                  : "bg-white/95 text-[#3a2f22]"
              }`}
            >
              <Box className="w-4 h-4" />
              <span className="text-sm font-medium">Muebles</span>
            </button>

            {placedItems.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPlacedItems([]);
                  setSelectedItemId(null);
                }}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(!isFullscreen);
              }}
              className="p-2 bg-white/95 rounded-xl shadow-lg"
            >
              {isFullscreen ? (
                <X className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {placedItems.length > 0 && (
          <div className="absolute top-14 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#a67c52] text-white rounded-lg text-sm z-40">
            <Layers className="w-3.5 h-3.5" />
            <span>{placedItems.length}</span>
          </div>
        )}
      </div>

      {/* Products Panel */}
      <AnimatePresence>
        {showProductList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-t border-gray-200"
          >
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <Box className="w-4 h-4 text-[#a67c52]" />
                <span className="text-sm font-bold text-[#3a2f22]">
                  Muebles 3D ({products.length})
                </span>
              </div>
              {products.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm">Cargando muebles...</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {products.map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToRoom(p)}
                      className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md group"
                    >
                      <div className="aspect-square bg-[#f8f5f0] relative">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/no-image.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-[#a67c52]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-xs font-bold">
                            + Agregar
                          </span>
                        </div>
                      </div>
                      <div className="p-1 bg-white">
                        <p className="text-[9px] font-medium text-[#3a2f22] truncate">
                          {p.name}
                        </p>
                        <p className="text-[9px] font-bold text-[#a67c52]">
                          {p.price}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
