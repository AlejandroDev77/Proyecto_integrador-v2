import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, CameraControls } from "@react-three/drei";
import { Loader2, ArrowLeft } from "lucide-react";
import { PlacedItem, Product, ViewMode } from "./RoomBuilder/types";
import { WALL_COLORS, FLOOR_COLORS } from "./RoomBuilder/constants";
import { RoomEnvironment } from "./RoomBuilder/RoomEnvironment";
import { FurnitureItem } from "./RoomBuilder/FurnitureItem";
import { PropertiesSidebar } from "./RoomBuilder/PropertiesSidebar";
import { ProductSidebar } from "./RoomBuilder/ProductSidebar";
import { BottomControls } from "./RoomBuilder/BottomControls";
import { CustomRoomConfig } from "./RoomBuilder/CustomRoomModal";

// Dynamic Camera Manager for sleek transitions
function CameraManager({ viewMode, globalDragging, roomWidth, roomDepth }: { viewMode: ViewMode, globalDragging: boolean, roomWidth: number, roomDepth: number }) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      const eyeHeight = 1.8;
      const margin = 0.05; // Almost flush with the wall

      if (viewMode === "isometric") {
        const isoDist = Math.max(roomWidth, roomDepth) * 1.5;
        controlsRef.current.setLookAt(isoDist, isoDist * 0.8, isoDist, 0, 0, 0, true);
      } else if (viewMode === "top") {
        controlsRef.current.setLookAt(0, Math.max(roomWidth, roomDepth) * 2, 0.01, 0, 0, 0, true); 
      } else if (viewMode === "sideFront") {
        controlsRef.current.setLookAt(0, eyeHeight, (roomDepth / 2) - margin, 0, eyeHeight, -10, true);
      } else if (viewMode === "sideBack") {
        controlsRef.current.setLookAt(0, eyeHeight, -(roomDepth / 2) + margin, 0, eyeHeight, 10, true);
      } else if (viewMode === "sideLeft") {
        controlsRef.current.setLookAt(-(roomWidth / 2) + margin, eyeHeight, 0, 10, eyeHeight, 0, true);
      } else if (viewMode === "sideRight") {
        controlsRef.current.setLookAt((roomWidth / 2) - margin, eyeHeight, 0, -10, eyeHeight, 0, true);
      }
    }
  }, [viewMode, roomWidth, roomDepth]);

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      enabled={!globalDragging}
      minDistance={2} 
      maxDistance={45} 
      maxPolarAngle={Math.PI / 2 - 0.05} // No going below ground
      dollySpeed={1.5}
      truckSpeed={1.5}
    />
  );
}

interface RoomViewerProps {
  initialConfig?: CustomRoomConfig | null;
  roomName?: string;
  onBack?: () => void;
}

export default function RoomViewer({ initialConfig, roomName, onBack }: RoomViewerProps) {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [globalDragging, setGlobalDragging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("isometric");

  const [activeWidth, setActiveWidth] = useState(initialConfig?.width || 12);
  const [activeDepth, setActiveDepth] = useState(initialConfig?.depth || 12);
  const [hasWindow, setHasWindow] = useState(initialConfig?.hasWindow || false);
  const [windowOpacity, setWindowOpacity] = useState(0.35);
  const [windowSize, setWindowSize] = useState(1);

  // Environment Aesthetics (Support Wizard Initial Colors)
  const [wallColor, setWallColor] = useState(
    initialConfig?.wallColor 
      ? { id: 'wizard', name: 'Pre-configurado', color: initialConfig.wallColor } 
      : WALL_COLORS[0]
  );
  const [floorColor, setFloorColor] = useState(
    initialConfig?.floorColor 
      ? { id: 'wizard', name: 'Pre-configurado', color: initialConfig.floorColor } 
      : FLOOR_COLORS[0]
  );
  const [floorTexture, setFloorTexture] = useState<string | null>(initialConfig?.floorTexture || null);

  // UI toggles
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch Items & Load Local 
  useEffect(() => {
    const localMocks: Product[] = [
      { id: 9001, name: "Sofá Chesterfield", image: "/images/no-image.png", price: "Libre", modelo_3d: "/models/chesterfield-sofa.glb" },
      { id: 9002, name: "Cama Doble", image: "/images/no-image.png", price: "Libre", modelo_3d: "/models/cama.glb" },
      { id: 9003, name: "Ropero", image: "/images/no-image.png", price: "Libre", modelo_3d: "/models/wardrobe.glb" },
      { id: 9004, name: "Librero", image: "/images/no-image.png", price: "Libre", modelo_3d: "/models/bookcase.glb" },
      { id: 9005, name: "Silla Escritorio", image: "/images/no-image.png", price: "Libre", modelo_3d: "/models/chair.glb" },
      { id: 9006, name: "Sofá Nórdico", image: "/images/no-image.png", price: "Libre", modelo_3d: "/models/mid_century_modern_sofa.glb" },
    ];

    axios
      .get("http://localhost:8080/api/mueble")
      .then((res) => {
        const apiMuebles = (res.data.data || res.data)
          .filter((m: any) => m.est_mue && m.modelo_3d)
          .map((m: any) => ({
            id: m.id_mue,
            name: m.nom_mue,
            image: m.img_mue?.replace("public", "") || "/images/no-image.png",
            price: `Bs. ${m.precio_venta}`,
            modelo_3d: m.modelo_3d,
          }));
        setProducts([...localMocks, ...apiMuebles]);
      })
      .catch((err) => {
        console.error(err);
        setProducts(localMocks);
      });
  }, []);

  // Actions
  const addToRoom = useCallback((product: Product) => {
    const x = (Math.random() - 0.5) * 1.5;
    const z = (Math.random() - 0.5) * 1.5;

    setPlacedItems((prev) => [
      ...prev,
      {
        id: `${product.id}-${Date.now()}`,
        product,
        x,
        z,
        scale: 1,
        rotation: 0,
      },
    ]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<PlacedItem>) => {
    setPlacedItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates } : it))
    );
  }, []);

  const removeItem = useCallback(
    (id: string) => {
      setPlacedItems((prev) => prev.filter((it) => it.id !== id));
      if (selectedItemId === id) setSelectedItemId(null);
    },
    [selectedItemId]
  );

  return (
    <div
      className={`flex w-full bg-[#d1d5db] font-sans ${
        isFullscreen
          ? "fixed inset-0 z-[100] object-cover"
          : "rounded-[24px] overflow-hidden shadow-sm border border-gray-200"
      }`}
      style={{ height: isFullscreen ? "100dvh" : "calc(100vh - 120px)", minHeight: "600px" }}
    >
      {/* 1. LEFT SIDEBAR (Product Catalog) */}
      <ProductSidebar products={products} addToRoom={addToRoom} />

      {/* 2. MAIN 3D WORKSPACE */}
      <div className="relative flex-1 min-w-0 h-full cursor-crosshair">
        <Canvas shadows camera={{ position: [3, 5, 10], fov: 45 }}>
          {/* Global Symmetrical Lighting */}
          <ambientLight intensity={0.35} />
          <hemisphereLight args={["#ffffff", "#d1d5db", 0.4]} />
          <directionalLight
            castShadow
            position={[0, 15, 0]}
            intensity={0.4}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          >
            <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15]} />
          </directionalLight>
          <Environment preset="city" />

          {/* Smooth Camera Transitions */}
          <CameraManager viewMode={viewMode} globalDragging={globalDragging} roomWidth={activeWidth} roomDepth={activeDepth} />

          {/* Architecture */}
          <Suspense fallback={null}>
            <RoomEnvironment
              wallColor={wallColor.color}
              floorColor={floorColor.color}
              floorTexture={floorTexture}
              onFloorClick={() => setSelectedItemId(null)}
              viewMode={viewMode}
              roomWidth={activeWidth}
              roomDepth={activeDepth}
              hasWindow={hasWindow}
              windowOpacity={windowOpacity}
              windowSize={windowSize}
              elements={initialConfig?.elements || []}
            />
          </Suspense>

          {/* Furniture Injection */}
          {placedItems.map((item) => (
            <Suspense
              key={item.id}
              fallback={
                <group position={[item.x, 0.5, item.z]}>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#ededed" />
                  </mesh>
                  <Html center>
                    <Loader2 className="w-5 h-5 text-[#0058a3] animate-spin" />
                  </Html>
                </group>
              }
            >
              <FurnitureItem
                item={item}
                isSelected={selectedItemId === item.id}
                onSelect={() => setSelectedItemId(item.id)}
                isGlobalDragging={globalDragging}
                setGlobalDragging={setGlobalDragging}
                onUpdate={(upd) => updateItem(item.id, upd)}
                onRemove={() => removeItem(item.id)}
                roomWidth={activeWidth}
                roomDepth={activeDepth}
              />
            </Suspense>
          ))}
        </Canvas>

        {/* 3. OVERLAYS ON CANVAS */}

        {/* Top Left Floating Title & Exit */}
        {onBack && (
          <div className="absolute top-6 left-6 z-[100] flex items-center gap-3">
             <button 
               onClick={onBack}
               className="w-10 h-10 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-200 flex items-center justify-center text-[#111] hover:bg-gray-50 transition-all"
               title="Volver a las estancias"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
             {roomName && (
               <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200">
                 <h2 className="text-sm font-bold text-[#111]">Habitación: <span className="font-medium">{roomName}</span></h2>
               </div>
             )}
          </div>
        )}

        {/* TopControls removed - properties are now in the Right Sidebar */}



        {/* Bottom Floating Menu (Camera Views) */}
        <BottomControls 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          onClear={() => {
            setPlacedItems([]);
            setSelectedItemId(null);
          }}
        />
      </div>

      {/* 3. RIGHT SIDEBAR (Properties) */}
      <PropertiesSidebar
        wallColor={wallColor}
        setWallColor={setWallColor}
        floorColor={floorColor}
        setFloorColor={setFloorColor}
        floorTexture={floorTexture}
        setFloorTexture={setFloorTexture}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        hasItems={placedItems.length > 0}
        onClearAll={() => {
          setPlacedItems([]);
          setSelectedItemId(null);
        }}
        activeWidth={activeWidth}
        setActiveWidth={setActiveWidth}
        activeDepth={activeDepth}
        setActiveDepth={setActiveDepth}
        hasWindow={hasWindow}
        setHasWindow={setHasWindow}
      />
    </div>
  );
}
