import { useState, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, Center } from "@react-three/drei";
import { RotateCcw, RotateCw, Trash2, Plus, Minus } from "lucide-react";
import { PlacedItem } from "./types";
import { WALL_THICKNESS } from "./constants";

interface FurnitureItemProps {
  item: PlacedItem;
  isSelected: boolean;
  onSelect: () => void;
  isGlobalDragging: boolean;
  setGlobalDragging: (val: boolean) => void;
  onUpdate: (updates: Partial<PlacedItem>) => void;
  onRemove: () => void;
  roomWidth: number;
  roomDepth: number;
}

export function FurnitureItem({
  item,
  isSelected,
  onSelect,
  isGlobalDragging,
  setGlobalDragging,
  onUpdate,
  onRemove,
  roomWidth,
  roomDepth,
}: FurnitureItemProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load and setup GLTF
  const { scene } = useGLTF(item.product.modelo_3d);
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Compute metrics for selection ring & UI float
  const box = useMemo(() => new THREE.Box3().setFromObject(clonedScene), [clonedScene]);
  const rawSize = useMemo(() => {
    const s = new THREE.Vector3();
    box.getSize(s);
    return s;
  }, [box]);

  // Auto-Normalization Base Scale: Prevent giant or microscopic models
  const autoScaleBase = useMemo(() => {
    const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z);
    if (maxDim > 2.5) {
      return 2.5 / maxDim; // Shrink giants down
    }
    if (maxDim > 0 && maxDim < 0.2) {
      return 0.5 / maxDim; // Expand microscopic items
    }
    return 1;
  }, [rawSize]);

  const activeScale = (item.scale || 1) * autoScaleBase;
  const radius = (Math.max(rawSize.x, rawSize.z) / 2 || 1) * activeScale;
  const uiHeight = (rawSize.y * autoScaleBase) + 0.6;

  // Local drag mechanics (Frame sequence to avoid React re-render lag)
  const [isLocalDragging, setIsLocalDragging] = useState(false);
  const { raycaster, camera, pointer } = useThree();
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (isLocalDragging && groupRef.current) {
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(floorPlane, intersectPoint);
      if (intersectPoint) {
        // Strict boundary clamp (prevent custom walls inner-face clipping with true AABB)
        const theta = item.rotation || 0;
        const cosTheta = Math.abs(Math.cos(theta));
        const sinTheta = Math.abs(Math.sin(theta));
        
        const halfX = (rawSize.x / 2) * activeScale;
        const halfZ = (rawSize.z / 2) * activeScale;

        // World constraints matching true physical rectangular dimensions
        const marginX = halfX * cosTheta + halfZ * sinTheta;
        const marginZ = halfX * sinTheta + halfZ * cosTheta;

        const innerBoundX = (roomWidth / 2) - (WALL_THICKNESS / 2);
        const innerBoundZ = (roomDepth / 2) - (WALL_THICKNESS / 2);

        const limitX = Math.max(0, innerBoundX - marginX);
        const limitZ = Math.max(0, innerBoundZ - marginZ);

        const x = Math.max(-limitX, Math.min(limitX, intersectPoint.x));
        const z = Math.max(-limitZ, Math.min(limitZ, intersectPoint.z));
        groupRef.current.position.set(x, 0, z);
      }
    }
  });

  // End drag
  useEffect(() => {
    if (!isLocalDragging) return;
    const handleUp = () => {
      setIsLocalDragging(false);
      setGlobalDragging(false);
      if (groupRef.current) {
        onUpdate({ x: groupRef.current.position.x, z: groupRef.current.position.z });
      }
    };
    window.addEventListener("pointerup", handleUp);
    return () => window.removeEventListener("pointerup", handleUp);
  }, [isLocalDragging, onUpdate, setGlobalDragging]);

  return (
    <group
      ref={groupRef}
      position={[item.x, 0, item.z]}
      rotation={[0, item.rotation, 0]}
      scale={activeScale}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        setIsLocalDragging(true);
        setGlobalDragging(true);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <Center disableY>
        <group position={[0, -box.min.y, 0]}>
          <primitive object={clonedScene} />
        </group>
      </Center>

      {/* Selection Base Indicator */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.1 / activeScale, (radius * 1.1 + 0.1) / activeScale, 32]} />
          <meshBasicMaterial color="#a67c52" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Float Tools UI */}
      {isSelected && !isLocalDragging && (
        <Html position={[0, uiHeight / activeScale, 0]} center zIndexRange={[100, 0]}>
          <div
            className="flex items-center gap-2 bg-white/95 backdrop-blur-xl px-3 py-2 rounded-full shadow-2xl border border-gray-100 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onUpdate({ scale: Math.max((item.scale || 1) - 0.1, 0.1) })}
              className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-full transition"
              title="Reducir Tamaño"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdate({ scale: Math.min((item.scale || 1) + 0.1, 5) })}
              className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-full transition"
              title="Aumentar Tamaño"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <button
              onClick={() => onUpdate({ rotation: item.rotation - Math.PI / 4 })}
              className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-full transition"
              title="Rotar Izquierda"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdate({ rotation: item.rotation + Math.PI / 4 })}
              className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-full transition"
              title="Rotar Derecha"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <button
              onClick={onRemove}
              className="p-1.5 hover:bg-red-50 text-red-500 rounded-full transition"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
