import { useRef, useMemo, Suspense } from "react";
import { Grid, useGLTF } from "@react-three/drei";
import { WALL_HEIGHT, WALL_THICKNESS, DEFAULT_ROOM_SIZE } from "./constants";
import { ViewMode } from "./types";
import { PlacedElement } from "./CustomRoomModal";
import * as THREE from "three";
import { useLoader, useFrame, useThree } from "@react-three/fiber";

function TexturedFloor({ floorTexture, roomWidth, roomDepth, onFloorClick }: { floorTexture: string, roomWidth: number, roomDepth: number, onFloorClick: () => void }) {
  const colorMap = useLoader(THREE.TextureLoader, floorTexture);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(roomWidth / 4, roomDepth / 4);
  colorMap.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      position={[0, -WALL_THICKNESS / 2, 0]}
      receiveShadow
      onPointerDown={(e) => {
        e.stopPropagation();
        onFloorClick();
      }}
    >
      <boxGeometry args={[roomWidth, WALL_THICKNESS, roomDepth]} />
      <meshStandardMaterial 
        color="#ffffff" 
        map={colorMap}
        roughness={0.8}
      />
    </mesh>
  );
}

interface RoomEnvironmentProps {
  wallColor: string;
  floorColor: string;
  floorTexture?: string | null;
  onFloorClick: () => void;
  viewMode: ViewMode;
  roomWidth?: number;
  roomDepth?: number;
  hasWindow?: boolean;
  windowOpacity?: number;
  windowSize?: number;
  elements?: PlacedElement[];
}

// Map element styles to GLB models (same as CustomRoomModal)
const ELEMENT_MODEL_MAP: Record<string, string> = {
  "single": "/models/modelos_habitacion/PanelDoorSingle001.glb",
  "glass": "/models/modelos_habitacion/GlassDoorSingle001.glb",
  "french": "/models/modelos_habitacion/FrenchDoorDouble.glb",
  "double-panel": "/models/modelos_habitacion/2025-07-03T1615-PanelDoorDouble004.glb",
  "double-glass": "/models/modelos_habitacion/GlassDoorDouble001.glb",
  "sliding": "/models/modelos_habitacion/BifoldPanelDoorDouble001.glb",
  "standard": "/models/modelos_habitacion/GlassWindowSingle001.glb",
  "double": "/models/modelos_habitacion/GlassWindowDouble001.glb",
};

/** 3D GLTF door/window model for the designer view */
function DesignerGLTFModel({ modelPath, elemW, elemH }: { modelPath: string; elemW: number; elemH: number }) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            const name = (mat.name || mesh.name || "").toLowerCase();
            const isGlass = name.includes("glass") || name.includes("vidrio") || name.includes("window") || mat.transparent || mat.opacity < 0.9;
            if (isGlass) {
              mat.color.setHex(0xd0e8f5);
              mat.emissive.setHex(0x1a3040);
              mat.emissiveIntensity = 0.15;
              mat.transparent = true;
              mat.opacity = 0.35;
              mat.roughness = 0.05;
              mat.metalness = 0.1;
              mat.side = THREE.DoubleSide;
              mat.depthWrite = false;
            } else {
              mat.color.setHex(0xf5f5f5);
              mat.emissive.setHex(0xffffff);
              mat.emissiveIntensity = 0.08;
              mat.envMapIntensity = 0.3;
              mat.metalness = 0.0;
              mat.roughness = 0.5;
            }
          }
        }
      }
    });
    return clone;
  }, [scene]);

  const { sx, sy, sz, scaledCenter } = useMemo(() => {
    clonedScene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clonedScene);
    const s = new THREE.Vector3(); box.getSize(s);
    const c = new THREE.Vector3(); box.getCenter(c);
    const scaleW = s.x > 0.001 ? elemW / s.x : 1;
    const scaleH = s.y > 0.001 ? elemH / s.y : 1;
    return { sx: scaleW, sy: scaleH, sz: (scaleW + scaleH) / 2, scaledCenter: c };
  }, [clonedScene, elemW, elemH]);

  return (
    <group scale={[sx, sy, sz]} position={[-scaledCenter.x * sx, -scaledCenter.y * sy, -scaledCenter.z * sz]}>
      <primitive object={clonedScene} />
    </group>
  );
}

export function RoomEnvironment({
  wallColor,
  floorColor,
  floorTexture = null,
  onFloorClick,
  viewMode,
  roomWidth = DEFAULT_ROOM_SIZE,
  roomDepth = DEFAULT_ROOM_SIZE,
  hasWindow = false,
  windowOpacity = 0.35,
  windowSize = 1,
  elements = [],
}: RoomEnvironmentProps) {
  const frontWallRef = useRef<THREE.Group>(null);
  const backWallRef = useRef<THREE.Group>(null);
  const leftWallRef = useRef<THREE.Group>(null);
  const rightWallRef = useRef<THREE.Group>(null);

  const { camera } = useThree();

  // Smart Dollhouse Culling: Hides walls that block the camera's view automatically
  useFrame(() => {
    if (viewMode === "top") {
      // In top view, keep all walls visible (ceiling is hidden below)
      if (frontWallRef.current) frontWallRef.current.visible = true;
      if (backWallRef.current) backWallRef.current.visible = true;
      if (leftWallRef.current) leftWallRef.current.visible = true;
      if (rightWallRef.current) rightWallRef.current.visible = true;
      return;
    }

    const margin = 0.5;
    if (frontWallRef.current) frontWallRef.current.visible = camera.position.z < (roomDepth / 2) + margin;
    if (backWallRef.current) backWallRef.current.visible = camera.position.z > -(roomDepth / 2) - margin;
    if (leftWallRef.current) leftWallRef.current.visible = camera.position.x > -(roomWidth / 2) - margin;
    if (rightWallRef.current) rightWallRef.current.visible = camera.position.x < (roomWidth / 2) + margin;
  });

  let showCeiling = false;
  if (viewMode.startsWith("side")) {
    showCeiling = true; // Show ceiling to simulate cutaway section for side views
  }

  // Generate Recessed Ceiling Lights Grid
  const LIGHT_SPACING = 3.5; // Every ~3.5 meters
  const cols = Math.max(2, Math.round(roomWidth / LIGHT_SPACING));
  const rows = Math.max(2, Math.round(roomDepth / LIGHT_SPACING));
  const ceilingLights = [];
  
  const stepX = roomWidth / cols;
  const stepZ = roomDepth / rows;
  const startX = -roomWidth / 2 + stepX / 2;
  const startZ = -roomDepth / 2 + stepZ / 2;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      ceilingLights.push({
        x: startX + i * stepX,
        z: startZ + j * stepZ,
      });
    }
  }

  // Baseboard specs
  const ZOCALO_HEIGHT = 0.15;
  const ZOCALO_DEPTH = 0.04;
  const ZOCALO_COLOR = "#ffffff";

  return (
    <group>
      {/* Suelo */}
      {floorTexture ? (
         <TexturedFloor 
            floorTexture={floorTexture} 
            roomWidth={roomWidth} 
            roomDepth={roomDepth} 
            onFloorClick={onFloorClick} 
         />
      ) : (
         <mesh
           position={[0, -WALL_THICKNESS / 2, 0]}
           receiveShadow
           onPointerDown={(e) => {
             e.stopPropagation();
             onFloorClick();
           }}
         >
           <boxGeometry args={[roomWidth, WALL_THICKNESS, roomDepth]} />
           <meshStandardMaterial 
             color={floorColor} 
             roughness={0.55}
           />
         </mesh>
      )}

      {/* Techo y Focos */}
      {showCeiling && (
        <group>
          <mesh
            position={[0, WALL_HEIGHT + WALL_THICKNESS / 2, 0]}
            receiveShadow
          >
            <boxGeometry args={[roomWidth, WALL_THICKNESS, roomDepth]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.9} />
          </mesh>
          
          {ceilingLights.map((pos, idx) => (
            <group key={idx} position={[pos.x, WALL_HEIGHT, pos.z]}>
              <mesh>
                <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
                <meshStandardMaterial emissive="#fff5e6" emissiveIntensity={2.5} color="#ffffff" />
              </mesh>
              <pointLight 
                position={[0, -0.1, 0]} 
                color="#fff0dd" 
                intensity={1.2} 
                distance={6} 
                decay={1.8} 
              />
            </group>
          ))}
        </group>
      )}

      {/* Grid Guide */}
      <Grid
        infiniteGrid
        fadeDistance={Math.max(roomWidth, roomDepth) * 1.5}
        sectionColor="#0058a3"
        sectionThickness={0.5}
        cellColor="#e0e0e0"
        cellThickness={0.3}
        position={[0, 0.01, 0]}
      />

      {/* PARED TRASERA (-Z) = wallIndex 0 */}
      <group ref={backWallRef} position={[0, 0, -roomDepth / 2]}>
        <mesh position={[0, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[roomWidth, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
        <mesh position={[0, ZOCALO_HEIGHT / 2, WALL_THICKNESS / 2 + ZOCALO_DEPTH / 2]} receiveShadow>
          <boxGeometry args={[roomWidth, ZOCALO_HEIGHT, ZOCALO_DEPTH]} />
          <meshStandardMaterial color={ZOCALO_COLOR} roughness={0.5} />
        </mesh>
        {/* Elements on wall 0 — local coords (no rotation on this group) */}
        {elements.filter(el => el.wallIndex === 0).map(el => {
          const isDoor = el.type === "door";
          const elemW = isDoor ? 1.0 : 1.1;
          const elemH = isDoor ? 2.2 : 1.2;
          const yPos = isDoor ? elemH / 2 : WALL_HEIGHT * 0.55;
          const modelPath = ELEMENT_MODEL_MAP[el.style];
          if (!modelPath) return null;
          return (
            <group key={el.id} position={[(-roomWidth / 2) + el.position * roomWidth, yPos, WALL_THICKNESS * 0.55]}>
              <Suspense fallback={<mesh><boxGeometry args={[elemW, elemH, 0.08]} /><meshStandardMaterial color={isDoor ? "#e8ddd0" : "#b8d4e8"} /></mesh>}>
                <DesignerGLTFModel modelPath={modelPath} elemW={elemW} elemH={elemH} />
              </Suspense>
            </group>
          );
        })}
      </group>

      {/* PARED IZQUIERDA (-X) = wallIndex 3 */}
      <group ref={leftWallRef} position={[-roomWidth / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[roomDepth, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
        <mesh position={[0, ZOCALO_HEIGHT / 2, WALL_THICKNESS / 2 + ZOCALO_DEPTH / 2]} receiveShadow>
          <boxGeometry args={[roomDepth, ZOCALO_HEIGHT, ZOCALO_DEPTH]} />
          <meshStandardMaterial color={ZOCALO_COLOR} roughness={0.5} />
        </mesh>
        {/* Elements on wall 3 — local coords (group rotated PI/2) */}
        {elements.filter(el => el.wallIndex === 3).map(el => {
          const isDoor = el.type === "door";
          const elemW = isDoor ? 1.0 : 1.1;
          const elemH = isDoor ? 2.2 : 1.2;
          const yPos = isDoor ? elemH / 2 : WALL_HEIGHT * 0.55;
          const modelPath = ELEMENT_MODEL_MAP[el.style];
          if (!modelPath) return null;
          return (
            <group key={el.id} position={[(-roomDepth / 2) + el.position * roomDepth, yPos, WALL_THICKNESS * 0.55]} rotation={[0, Math.PI, 0]}>
              <Suspense fallback={<mesh><boxGeometry args={[elemW, elemH, 0.08]} /><meshStandardMaterial color={isDoor ? "#e8ddd0" : "#b8d4e8"} /></mesh>}>
                <DesignerGLTFModel modelPath={modelPath} elemW={elemW} elemH={elemH} />
              </Suspense>
            </group>
          );
        })}
      </group>

      {/* PARED FRONTAL (+Z) = wallIndex 2 */}
      <group ref={frontWallRef} position={[0, 0, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[hasWindow ? roomWidth * windowSize : roomWidth, WALL_HEIGHT, WALL_THICKNESS]} />
          {hasWindow ? (
            <meshStandardMaterial color="#b3e0ff" transparent opacity={windowOpacity} roughness={0.05} metalness={0.9} />
          ) : (
            <meshStandardMaterial color={wallColor} roughness={0.55} />
          )}
        </mesh>
        <mesh position={[0, ZOCALO_HEIGHT / 2, WALL_THICKNESS / 2 + ZOCALO_DEPTH / 2]} receiveShadow>
          <boxGeometry args={[roomWidth, ZOCALO_HEIGHT, ZOCALO_DEPTH]} />
          <meshStandardMaterial color={ZOCALO_COLOR} roughness={0.5} />
        </mesh>
        {/* Elements on wall 2 — local coords (group rotated PI) */}
        {elements.filter(el => el.wallIndex === 2).map(el => {
          const isDoor = el.type === "door";
          const elemW = isDoor ? 1.0 : 1.1;
          const elemH = isDoor ? 2.2 : 1.2;
          const yPos = isDoor ? elemH / 2 : WALL_HEIGHT * 0.55;
          const modelPath = ELEMENT_MODEL_MAP[el.style];
          if (!modelPath) return null;
          return (
            <group key={el.id} position={[(-roomWidth / 2) + el.position * roomWidth, yPos, WALL_THICKNESS * 0.55]}>
              <Suspense fallback={<mesh><boxGeometry args={[elemW, elemH, 0.08]} /><meshStandardMaterial color={isDoor ? "#e8ddd0" : "#b8d4e8"} /></mesh>}>
                <DesignerGLTFModel modelPath={modelPath} elemW={elemW} elemH={elemH} />
              </Suspense>
            </group>
          );
        })}
      </group>

      {/* PARED DERECHA (+X) = wallIndex 1 */}
      <group ref={rightWallRef} position={[roomWidth / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[roomDepth, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
        <mesh position={[0, ZOCALO_HEIGHT / 2, WALL_THICKNESS / 2 + ZOCALO_DEPTH / 2]} receiveShadow>
          <boxGeometry args={[roomDepth, ZOCALO_HEIGHT, ZOCALO_DEPTH]} />
          <meshStandardMaterial color={ZOCALO_COLOR} roughness={0.5} />
        </mesh>
        {/* Elements on wall 1 — local coords (group rotated -PI/2) */}
        {elements.filter(el => el.wallIndex === 1).map(el => {
          const isDoor = el.type === "door";
          const elemW = isDoor ? 1.0 : 1.1;
          const elemH = isDoor ? 2.2 : 1.2;
          const yPos = isDoor ? elemH / 2 : WALL_HEIGHT * 0.55;
          const modelPath = ELEMENT_MODEL_MAP[el.style];
          if (!modelPath) return null;
          return (
            <group key={el.id} position={[(-roomDepth / 2) + el.position * roomDepth, yPos, WALL_THICKNESS * 0.55]} rotation={[0, Math.PI, 0]}>
              <Suspense fallback={<mesh><boxGeometry args={[elemW, elemH, 0.08]} /><meshStandardMaterial color={isDoor ? "#e8ddd0" : "#b8d4e8"} /></mesh>}>
                <DesignerGLTFModel modelPath={modelPath} elemW={elemW} elemH={elemH} />
              </Suspense>
            </group>
          );
        })}
      </group>
    </group>
  );
}
