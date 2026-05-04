import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import { X, ArrowLeft, Palette, Trash2 } from "lucide-react";
import { WALL_COLORS, FLOOR_COLORS, FLOOR_TEXTURES, DOOR_CATALOG, WINDOW_CATALOG, WALL_HEIGHT, WALL_THICKNESS } from "./constants";

// ==================== TYPES ====================

export interface PlacedElement {
  id: string;
  type: "door" | "window";
  style: string;
  wallIndex: number;
  position: number; // 0-1 along wall
}

export interface CustomRoomConfig {
  width: number;
  depth: number;
  shape: string;
  hasWindow: boolean;
  wallColor: string;
  floorColor: string;
  floorTexture?: string | null;
  elements?: PlacedElement[];
}

// ==================== CONSTANTS ====================

const PW_H = WALL_HEIGHT;
const PW_T = WALL_THICKNESS * 0.7;

const SHAPES = [
  { id: "rectangular", name: "Rectangular" },
  { id: "l-shape", name: "En forma de L" },
  { id: "cortado", name: "Cortado" },
  { id: "t-shape", name: "En forma de T" },
  { id: "u-shape", name: "En forma de U" },
  { id: "biselado", name: "Biselado" },
];

// Door & Window styles are now imported from constants (DOOR_CATALOG, WINDOW_CATALOG)

// ==================== SHAPE GEOMETRY ====================

function getShapeVertices(
  shape: string,
  w: number,
  d: number
): [number, number][] {
  const hw = w / 2,
    hd = d / 2;
  switch (shape) {
    case "l-shape": {
      const cw = hw * 0.5,
        cd = hd * 0.5;
      return [
        [-hw, -hd],
        [hw, -hd],
        [hw, cd],
        [cw, cd],
        [cw, hd],
        [-hw, hd],
      ];
    }
    case "cortado": {
      const cut = Math.min(hw, hd) * 0.4;
      return [
        [-hw, -hd],
        [hw, -hd],
        [hw, hd - cut],
        [hw - cut, hd],
        [-hw, hd],
      ];
    }
    case "t-shape": {
      const arm = hw * 0.35;
      return [
        [-hw, -hd],
        [hw, -hd],
        [hw, -hd * 0.4],
        [arm, -hd * 0.4],
        [arm, hd],
        [-arm, hd],
        [-arm, -hd * 0.4],
        [-hw, -hd * 0.4],
      ];
    }
    case "u-shape": {
      const arm = hw * 0.3,
        gap = hd * 0.35;
      return [
        [-hw, -hd],
        [-hw + arm, -hd],
        [-hw + arm, gap],
        [hw - arm, gap],
        [hw - arm, -hd],
        [hw, -hd],
        [hw, hd],
        [-hw, hd],
      ];
    }
    case "biselado": {
      const b = Math.min(hw, hd) * 0.3;
      return [
        [-hw + b, -hd],
        [hw - b, -hd],
        [hw, -hd + b],
        [hw, hd],
        [-hw, hd],
        [-hw, -hd + b],
      ];
    }
    default:
      return [
        [-hw, -hd],
        [hw, -hd],
        [hw, hd],
        [-hw, hd],
      ];
  }
}

interface WallSeg {
  from: [number, number];
  to: [number, number];
  length: number;
  angle: number;
  center: [number, number];
  normal: [number, number];
  controlsDimension: "width" | "depth";
}

function computeWalls(verts: [number, number][]): WallSeg[] {
  return verts.map((v, i) => {
    const next = verts[(i + 1) % verts.length];
    const dx = next[0] - v[0];
    const dz = next[1] - v[1];
    const len = Math.sqrt(dx * dx + dz * dz);
    const cx = (v[0] + next[0]) / 2;
    const cz = (v[1] + next[1]) / 2;
    const dirX = dx / len;
    const dirZ = dz / len;
    const n1: [number, number] = [-dirZ, dirX];
    const n2: [number, number] = [dirZ, -dirX];
    const dot1 = n1[0] * cx + n1[1] * cz;
    const normal = dot1 >= 0 ? n1 : n2;
    const controlsDimension: "width" | "depth" =
      Math.abs(normal[0]) >= Math.abs(normal[1]) ? "width" : "depth";
    return {
      from: v,
      to: next,
      length: len,
      angle: Math.atan2(dz, dx),
      center: [cx, cz] as [number, number],
      normal,
      controlsDimension,
    };
  });
}

// ==================== SVG ICONS ====================

const RoomIcon = ({ type, active }: { type: string; active: boolean }) => {
  const color = active ? "#0058a3" : "#484848";
  const sw = 2.5;
  return (
    <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
      {type === "rectangular" && (
        <rect
          x="8"
          y="10"
          width="24"
          height="20"
          stroke={color}
          strokeWidth={sw}
          rx="1"
        />
      )}
      {type === "l-shape" && (
        <path
          d="M8 8H32V22H22V34H8Z"
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {type === "cortado" && (
        <path
          d="M8 8H32V22L22 34H8Z"
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {type === "t-shape" && (
        <path
          d="M6 8H34V20H26V34H14V20H6Z"
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {type === "u-shape" && (
        <path
          d="M6 8H16V22H24V8H34V34H6Z"
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {type === "biselado" && (
        <path
          d="M14 8H26L34 16V34H6V16Z"
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
};



// ==================== 3D SUB-COMPONENTS ====================

function FloorMesh({
  vertices,
  color,
}: {
  vertices: [number, number][];
  color: string;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(vertices[0][0], -vertices[0][1]);
    for (let i = 1; i < vertices.length; i++) {
      shape.lineTo(vertices[i][0], -vertices[i][1]);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [vertices]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.01, 0]}
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function TexturedFloorInner({
  vertices,
  texturePath,
  width,
  depth,
}: {
  vertices: [number, number][];
  texturePath: string;
  width: number;
  depth: number;
}) {
  const texture = useTexture(texturePath);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // Natural plank scale: ~3m per texture tile for realistic wood plank size
  texture.repeat.set(width / 3, depth / 3);
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(vertices[0][0], -vertices[0][1]);
    for (let i = 1; i < vertices.length; i++) {
      shape.lineTo(vertices[i][0], -vertices[i][1]);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [vertices]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.02, 0]}
    >
      <meshStandardMaterial
        map={texture}
        color="#ffffff"
        roughness={0.25}
        metalness={0.1}
      />
    </mesh>
  );
}

function WallMesh({
  wall,
  color,
  height,
  highlight,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: {
  wall: WallSeg;
  color: string;
  height: number;
  highlight: false | "drag" | "place";
  onPointerDown?: (e: any) => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}) {
  // Walls are always rendered in their actual color (white by default).
  // On hover, a thin dark edge-line appears on top — NOT a full blue fill.
  return (
    <group>
      {/* Main wall body */}
      <mesh
        position={[wall.center[0], height / 2, wall.center[1]]}
        rotation={[0, -wall.angle, 0]}
        receiveShadow
        castShadow
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[wall.length + PW_T, height, PW_T]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      {/* Thin dark edge line on hover (IKEA-style WallLine) */}
      {highlight && (
        <mesh
          position={[
            wall.center[0] + wall.normal[0] * (PW_T / 2 + 0.005),
            height / 2,
            wall.center[1] + wall.normal[1] * (PW_T / 2 + 0.005),
          ]}
          rotation={[0, -wall.angle, 0]}
        >
          <boxGeometry args={[wall.length + PW_T + 0.02, height + 0.02, 0.008]} />
          <meshBasicMaterial
            color={highlight === "place" ? "#f59e0b" : "#111111"}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}

// Map element style IDs to their actual 3D GLB models
const ELEMENT_MODEL_MAP: Record<string, string> = {
  // Doors
  "single": "/models/modelos_habitacion/PanelDoorSingle001.glb",
  "glass": "/models/modelos_habitacion/GlassDoorSingle001.glb",
  "french": "/models/modelos_habitacion/FrenchDoorDouble.glb",
  "double-panel": "/models/modelos_habitacion/2025-07-03T1615-PanelDoorDouble004.glb",
  "double-glass": "/models/modelos_habitacion/GlassDoorDouble001.glb",
  "sliding": "/models/modelos_habitacion/BifoldPanelDoorDouble001.glb",
  // Windows
  "standard": "/models/modelos_habitacion/GlassWindowSingle001.glb",
  "double": "/models/modelos_habitacion/GlassWindowDouble001.glb",
};

/** Renders an actual 3D GLTF model for the door or window */
function GLTFElementModel({
  modelPath,
  elemW,
  elemH,
}: {
  modelPath: string;
  elemW: number;
  elemH: number;
}) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            const name = (mat.name || mesh.name || "").toLowerCase();
            // Detect glass: by name, original transparency, or very low roughness
            const isGlass =
              name.includes("glass") ||
              name.includes("vidrio") ||
              name.includes("window") ||
              name.includes("cristal") ||
              mat.transparent ||
              mat.opacity < 0.9 ||
              (mat.roughness < 0.15 && mat.metalness > 0.3);

            if (isGlass) {
              // Realistic glass: light blue tint, transparent, reflective
              mat.color.setHex(0xd0e8f5);
              mat.emissive.setHex(0x1a3040);
              mat.emissiveIntensity = 0.15;
              mat.transparent = true;
              mat.opacity = 0.35;
              mat.roughness = 0.05;
              mat.metalness = 0.1;
              mat.envMapIntensity = 1.0;
              mat.side = THREE.DoubleSide;
              mat.depthWrite = false;
            } else {
              // Solid structure (frame, panels): clean white, self-lit to resist color bleeding
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

  // Compute bounding box for accurate scaling
  const { scaledCenter, sx, sy, sz } = useMemo(() => {
    clonedScene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clonedScene);
    const s = new THREE.Vector3();
    box.getSize(s);
    const c = new THREE.Vector3();
    box.getCenter(c);

    // Scale width and height to fit the opening; keep depth proportional
    const scaleW = s.x > 0.001 ? elemW / s.x : 1;
    const scaleH = s.y > 0.001 ? elemH / s.y : 1;
    // Use the average of the two scales for depth so the model keeps
    // a natural proportion (not squashed flat)
    const scaleD = (scaleW + scaleH) / 2;

    return {
      scaledCenter: c,
      sx: scaleW,
      sy: scaleH,
      sz: scaleD,
    };
  }, [clonedScene, elemW, elemH]);

  return (
    <group
      scale={[sx, sy, sz]}
      position={[
        -scaledCenter.x * sx,
        -scaledCenter.y * sy,
        -scaledCenter.z * sz,
      ]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function ElementOnWall({
  element,
  walls,
}: {
  element: PlacedElement;
  walls: WallSeg[];
}) {
  const wall = walls[element.wallIndex];
  if (!wall) return null;

  const t = element.position;
  const x = wall.from[0] + t * (wall.to[0] - wall.from[0]);
  const z = wall.from[1] + t * (wall.to[1] - wall.from[1]);
  const isDoor = element.type === "door";
  const elemW = isDoor ? 1.0 : 1.1;
  const elemH = isDoor ? 2.2 : 1.2;
  // Doors sit on the floor; windows sit at ~55% of wall height
  const yPos = isDoor ? elemH / 2 : PW_H * 0.55;

  const modelPath = ELEMENT_MODEL_MAP[element.style];

  // Position model on the INTERIOR wall surface.
  // wall.normal points OUTWARD, so subtract it to move inward.
  // Offset by 55% of wall thickness to sit slightly proud of interior face.
  const inX = x - wall.normal[0] * (PW_T * 0.55);
  const inZ = z - wall.normal[1] * (PW_T * 0.55);

  return (
    <group>
      {/* 3D model — on interior wall surface, rotated to face room interior */}
      <group position={[inX, yPos, inZ]} rotation={[0, -wall.angle + Math.PI, 0]}>
        {modelPath ? (
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[elemW, elemH, 0.08]} />
                <meshStandardMaterial color={isDoor ? "#e8ddd0" : "#b8d4e8"} />
              </mesh>
            }
          >
            <GLTFElementModel modelPath={modelPath} elemW={elemW} elemH={elemH} />
          </Suspense>
        ) : null}
      </group>
    </group>
  );
}

// ==================== 3D ROOM SCENE ====================

interface Room3DProps {
  shape: string;
  width: number;
  depth: number;
  wallColor: string;
  floorColor: string;
  floorTexture: string | null;
  placedElements: PlacedElement[];
  step: number;
  selectedTool: { type: "door" | "window"; styleId: string } | null;
  onDimensionChange: (dim: "width" | "depth", value: number) => void;
  onPlaceElement: (wallIndex: number, position: number) => void;
}

function Room3DScene(props: Room3DProps) {
  const {
    shape,
    width,
    depth,
    wallColor,
    floorColor,
    floorTexture,
    placedElements,
    step,
    selectedTool,
    onDimensionChange,
    onPlaceElement,
  } = props;

  const vertices = useMemo(
    () => getShapeVertices(shape, width, depth),
    [shape, width, depth]
  );
  const walls = useMemo(() => computeWalls(vertices), [vertices]);

  const [hoveredWall, setHoveredWall] = useState<number | null>(null);
  const [drag, setDrag] = useState<{
    dim: "width" | "depth";
    startPoint: THREE.Vector3;
    startWidth: number;
    startDepth: number;
    normal: [number, number];
  } | null>(null);

  // Refs for dollhouse wall-culling
  const wallGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const { camera } = useThree();

  // Dollhouse culling: hide walls that face toward the camera
  // Step 1 = top-down, show all walls; Steps 3-4 = dollhouse
  useFrame(() => {
    // Step 1: force camera to top-down position
    if (step === 1) {
      const dist = Math.max(width, depth) * 2.0 + 3;
      camera.position.set(0, dist, 0.001);
      camera.lookAt(0, 0, 0);
      // All walls visible from top
      walls.forEach((_, i) => {
        const ref = wallGroupRefs.current[i];
        if (ref) ref.visible = true;
      });
      return;
    }

    // Steps 3-4: dollhouse culling
    walls.forEach((wall, i) => {
      const ref = wallGroupRefs.current[i];
      if (!ref) return;
      const toCamX = camera.position.x - wall.center[0];
      const toCamZ = camera.position.z - wall.center[1];
      const dot = toCamX * wall.normal[0] + toCamZ * wall.normal[1];
      ref.visible = dot <= 0.3;
    });
  });

  const handleWallPointerDown = useCallback(
    (e: any, wallIdx: number) => {
      // Prevent interaction with culled (invisible) walls
      const wallRef = wallGroupRefs.current[wallIdx];
      if (wallRef && !wallRef.visible) return;

      if (step === 2) {
        e.stopPropagation();
        const wall = walls[wallIdx];
        setDrag({
          dim: wall.controlsDimension,
          startPoint: e.point.clone(),
          startWidth: width,
          startDepth: depth,
          normal: wall.normal,
        });
      } else if (step === 3 && selectedTool) {
        e.stopPropagation();
        const wall = walls[wallIdx];
        const point = e.point;
        const dx = wall.to[0] - wall.from[0];
        const dz = wall.to[1] - wall.from[1];
        const t =
          ((point.x - wall.from[0]) * dx + (point.z - wall.from[1]) * dz) /
          (wall.length * wall.length);
        onPlaceElement(wallIdx, Math.max(0.15, Math.min(0.85, t)));
      }
    },
    [step, walls, width, depth, selectedTool, onPlaceElement]
  );

  const handleDragMove = useCallback(
    (e: any) => {
      if (!drag) return;
      const delta = new THREE.Vector3().subVectors(e.point, drag.startPoint);
      const projected =
        delta.x * drag.normal[0] + delta.z * drag.normal[1];
      if (drag.dim === "width") {
        const newW = Math.round((drag.startWidth + projected * 2) * 10) / 10;
        onDimensionChange("width", Math.max(2, Math.min(30, newW)));
      } else {
        const newD = Math.round((drag.startDepth + projected * 2) * 10) / 10;
        onDimensionChange("depth", Math.max(2, Math.min(30, newD)));
      }
    },
    [drag, onDimensionChange]
  );

  const handleDragEnd = useCallback(() => setDrag(null), []);

  const getHighlight = (i: number): false | "drag" | "place" => {
    if (hoveredWall !== i) return false;
    if (step === 2) return "drag";
    if (step === 3 && selectedTool) return "place";
    return false;
  };

  // Ensure refs array is the right length
  wallGroupRefs.current.length = walls.length;

  return (
    <>
      {/* Environment map for realistic reflections and lighting on 3D models */}
      <Environment preset="apartment" />

      {/* Lighting — even and bright, no hard shadows (like IKEA) */}
      <ambientLight intensity={1.0} />
      <directionalLight
        position={[8, 15, 8]}
        intensity={0.6}
      />
      <directionalLight
        position={[-6, 10, -6]}
        intensity={0.3}
      />
      <hemisphereLight args={["#ffffff", "#e0e0e0", 0.5]} />

      {/* Floor */}
      {floorTexture ? (
        <Suspense
          fallback={<FloorMesh vertices={vertices} color={floorColor} />}
        >
          <TexturedFloorInner
            vertices={vertices}
            texturePath={floorTexture}
            width={width}
            depth={depth}
          />
        </Suspense>
      ) : (
        <FloorMesh vertices={vertices} color={floorColor} />
      )}

      {/* Walls — wrapped in groups for dollhouse culling */}
      {walls.map((wall, i) => (
        <group
          key={i}
          ref={(el) => { wallGroupRefs.current[i] = el; }}
        >
          <WallMesh
            wall={wall}
            color={wallColor}
            height={PW_H}
            highlight={getHighlight(i)}
            onPointerDown={(e: any) => handleWallPointerDown(e, i)}
            onPointerEnter={() => setHoveredWall(i)}
            onPointerLeave={() => setHoveredWall(null)}
          />
          {/* Elements placed on this specific wall — they will auto-hide when the wall hides */}
          {placedElements
            .filter((el) => el.wallIndex === i)
            .map((el) => (
              <ElementOnWall key={el.id} element={el} walls={walls} />
            ))}
        </group>
      ))}

      {/* Recessed ceiling light spots (IKEA-style) */}
      {(() => {
        const SPACING = 3.2;
        const cols = Math.max(2, Math.round(width / SPACING));
        const rows = Math.max(2, Math.round(depth / SPACING));
        const lights: { lx: number; lz: number }[] = [];
        const stepX = width / cols;
        const stepZ = depth / rows;
        const startX = -width / 2 + stepX / 2;
        const startZ = -depth / 2 + stepZ / 2;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            lights.push({ lx: startX + c * stepX, lz: startZ + r * stepZ });
          }
        }
        return lights.map((pos, idx) => (
          <group key={`ceil-${idx}`} position={[pos.lx, PW_H - 0.02, pos.lz]}>
            {/* Point light creating warm glow on floor */}
            <pointLight
              color="#fff0dd"
              intensity={0.8}
              distance={5}
              decay={2}
            />
          </group>
        ));
      })()}

      {/* Dimension labels */}
      {step === 2 &&
        walls.map((wall, i) => (
          <Html
            key={`label-${i}`}
            position={[wall.center[0], PW_H + 0.5, wall.center[1]]}
            center
            style={{ pointerEvents: "none" }}
          >
            <div className="bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-[#0058a3] whitespace-nowrap shadow border border-gray-100">
              {(wall.length * 100).toFixed(0)} cm
            </div>
          </Html>
        ))}

      {/* Ground reference — darker gray for contrast with white walls */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#808080" roughness={1} />
      </mesh>

      {/* Invisible drag plane (appears during wall drag) */}
      {drag && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.1, 0]}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
        </mesh>
      )}

      {/* Camera controls — disabled in Step 1 (top-down fixed view) */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={step !== 1}
        enableZoom={step !== 1}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={25}
        enabled={!drag && step !== 1}
      />
    </>
  );
}

// ==================== 2D BLUEPRINT (IKEA-STYLE) ====================

function RoomBlueprint2D({
  shape,
  width,
  depth,
  onDimensionChange,
}: {
  shape: string;
  width: number;
  depth: number;
  onDimensionChange: (dim: "width" | "depth", value: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredWall, setHoveredWall] = useState<number | null>(null);
  const [cSize, setCSize] = useState({ w: 600, h: 500 });
  const [drag, setDrag] = useState<{
    wallIdx: number;
    startX: number;
    startY: number;
    startWidth: number;
    startDepth: number;
    dim: "width" | "depth";
    normal: [number, number];
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCSize({ w: r.width, h: r.height });
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setCSize({ w: rect.width, h: rect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const vertices = useMemo(() => getShapeVertices(shape, width, depth), [shape, width, depth]);
  const walls = useMemo(() => computeWalls(vertices), [vertices]);

  const pad = 90;
  const scale = Math.min((cSize.w - pad * 2) / width, (cSize.h - pad * 2) / depth) * 0.78;
  const cx = cSize.w / 2;
  const cy = cSize.h / 2;
  const toS = useCallback((rx: number, ry: number): [number, number] => [cx + rx * scale, cy + ry * scale], [cx, cy, scale]);

  const floorPath = useMemo(() => {
    return vertices.map((v, i) => {
      const [sx, sy] = toS(v[0], v[1]);
      return `${i === 0 ? "M" : "L"}${sx},${sy}`;
    }).join(" ") + " Z";
  }, [vertices, toS]);

  const WPX = 16;

  const handleDown = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const w = walls[idx];
    setDrag({ wallIdx: idx, startX: e.clientX, startY: e.clientY, startWidth: width, startDepth: depth, dim: w.controlsDimension, normal: w.normal });
  }, [walls, width, depth]);

  useEffect(() => {
    if (!drag) return;
    const move = (e: MouseEvent) => {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const proj = (dx * drag.normal[0] + dy * drag.normal[1]) / scale;
      if (drag.dim === "width") {
        onDimensionChange("width", Math.max(2, Math.min(30, Math.round((drag.startWidth + proj * 2) * 10) / 10)));
      } else {
        onDimensionChange("depth", Math.max(2, Math.min(30, Math.round((drag.startDepth + proj * 2) * 10) / 10)));
      }
    };
    const up = () => setDrag(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [drag, scale, onDimensionChange]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden" style={{ backgroundColor: "#c8cacd" }}>
      <svg width={cSize.w} height={cSize.h} className="absolute inset-0">
        <defs>
          <filter id="wallShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
          </filter>
          <marker id="arrS" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#666" strokeWidth="1" /></marker>
          <marker id="arrE" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6" fill="none" stroke="#666" strokeWidth="1" /></marker>
        </defs>

        {/* Room body with walls */}
        <g filter="url(#wallShadow)">
          <path d={floorPath} fill="#f5f0e8" stroke="white" strokeWidth={WPX} strokeLinejoin="miter" />
        </g>

        {/* Inner edge */}
        <path d={floorPath} fill="none" stroke="#bbb" strokeWidth={0.5} />

        {/* Outer edge of walls — offset stroke trick: draw again with thinner stroke on top */}
        <path d={floorPath} fill="none" stroke="#999" strokeWidth={WPX} strokeLinejoin="miter" strokeOpacity={0} />
        <path d={floorPath} fill="none" stroke="#aaa" strokeWidth={WPX + 1} strokeLinejoin="miter" strokeOpacity={0} />

        {/* Outer contour line */}
        {walls.map((wall, i) => {
          const [x1, y1] = toS(wall.from[0], wall.from[1]);
          const [x2, y2] = toS(wall.to[0], wall.to[1]);
          const ox = wall.normal[0] * (WPX / 2);
          const oy = wall.normal[1] * (WPX / 2);
          return <line key={`oc-${i}`} x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy} stroke="#bbb" strokeWidth={0.8} />;
        })}

        {/* Interactive walls + WallLine hover */}
        {walls.map((wall, i) => {
          const [x1, y1] = toS(wall.from[0], wall.from[1]);
          const [x2, y2] = toS(wall.to[0], wall.to[1]);
          const isActive = hoveredWall === i || drag?.wallIdx === i;
          const cursor = wall.controlsDimension === "width" ? "ew-resize" : "ns-resize";
          return (
            <g key={`w-${i}`}>
              {/* Fat invisible hit area */}
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={WPX + 14} style={{ cursor }} onMouseEnter={() => setHoveredWall(i)} onMouseLeave={() => setHoveredWall(null)} onMouseDown={(e) => handleDown(e, i)} />
              {/* WallLine — thin black line on hover */}
              {isActive && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth={2.5} strokeLinecap="round" style={{ pointerEvents: "none" }} />}
            </g>
          );
        })}

        {/* Dimension lines */}
        {walls.map((wall, i) => {
          const [fx, fy] = toS(wall.from[0], wall.from[1]);
          const [tx, ty] = toS(wall.to[0], wall.to[1]);
          const off = WPX / 2 + 28;
          const nx = wall.normal[0] * off;
          const ny = wall.normal[1] * off;
          const eOff = WPX / 2 + 6;
          const enx = wall.normal[0] * eOff;
          const eny = wall.normal[1] * eOff;
          const mx = (fx + tx) / 2 + nx;
          const my = (fy + ty) / 2 + ny;
          const cm = (wall.length * 100).toFixed(0);
          return (
            <g key={`d-${i}`} style={{ pointerEvents: "none" }}>
              {/* Extension lines */}
              <line x1={fx + enx} y1={fy + eny} x2={fx + nx + wall.normal[0] * 6} y2={fy + ny + wall.normal[1] * 6} stroke="#888" strokeWidth={0.6} />
              <line x1={tx + enx} y1={ty + eny} x2={tx + nx + wall.normal[0] * 6} y2={ty + ny + wall.normal[1] * 6} stroke="#888" strokeWidth={0.6} />
              {/* Dimension line with arrows */}
              <line x1={fx + nx} y1={fy + ny} x2={tx + nx} y2={ty + ny} stroke="#666" strokeWidth={0.8} markerStart="url(#arrE)" markerEnd="url(#arrS)" />
              {/* Background for text */}
              <rect x={mx - 22} y={my - 9} width={44} height={18} rx={3} fill="#c8cacd" />
              {/* Measurement text */}
              <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fill="#333" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">{cm} cm</text>
            </g>
          );
        })}
      </svg>

      {/* Corner dots */}
      <svg width={cSize.w} height={cSize.h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        {vertices.map((v, i) => {
          const [sx, sy] = toS(v[0], v[1]);
          return <circle key={`c-${i}`} cx={sx} cy={sy} r={4} fill="white" stroke="#999" strokeWidth={1.5} />;
        })}
      </svg>
    </div>
  );
}

// ==================== MAIN MODAL ====================

interface CustomRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: CustomRoomConfig) => void;
}

export function CustomRoomModal({
  isOpen,
  onClose,
  onSubmit,
}: CustomRoomModalProps) {
  const [step, setStep] = useState(1);
  const [shape, setShape] = useState("rectangular");
  const [width, setWidth] = useState(5);
  const [depth, setDepth] = useState(4);

  // Walls default to white; floor starts as solid color (no texture)
  const [wallColor, setWallColor] = useState(WALL_COLORS[0].color);
  const [floorColor, setFloorColor] = useState(FLOOR_COLORS[0].color);
  const [floorTexture, setFloorTexture] = useState<string | null>(null);

  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<{
    type: "door" | "window";
    styleId: string;
  } | null>(null);

  const TOTAL_STEPS = 4;
  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleComplete = () => {
    onSubmit({
      width,
      depth,
      shape,
      // hasWindow is legacy (turns entire front wall to glass).
      // Individual window models are now rendered via `elements`.
      hasWindow: false,
      wallColor,
      floorColor,
      floorTexture,
      elements: placedElements,
    });
    setTimeout(() => {
      setStep(1);
      setPlacedElements([]);
      setSelectedTool(null);
    }, 300);
  };

  const handleDimensionChange = useCallback(
    (dim: "width" | "depth", value: number) => {
      if (dim === "width") setWidth(value);
      else setDepth(value);
    },
    []
  );

  const handlePlaceElement = useCallback(
    (wallIndex: number, position: number) => {
      if (!selectedTool) return;
      setPlacedElements((prev) => [
        ...prev,
        {
          id: `${selectedTool.type}-${Date.now()}`,
          type: selectedTool.type,
          style: selectedTool.styleId,
          wallIndex,
          position,
        },
      ]);
      // Deselect tool after placement to prevent duplicate placing
      setSelectedTool(null);
    },
    [selectedTool]
  );

  const removeElement = useCallback((id: string) => {
    setPlacedElements((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const stepsInfo = [
    { title: "Establecer forma y tamaño" },
    { title: "Ajusta tus dimensiones" },
    { title: "Añadir puertas y ventanas" },
    { title: "Estilo interior" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[900px]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-30 p-2.5 bg-white/90 hover:bg-gray-100 text-gray-600 rounded-full shadow-sm border border-gray-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ========== LEFT PANEL ========== */}
            <div className="w-full md:w-[420px] bg-white flex flex-col border-r border-gray-200 z-10">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 relative">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="absolute left-5 top-6 text-gray-400 hover:text-[#111] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="text-center">
                  <span className="text-xs font-bold tracking-widest text-[#0058a3] uppercase">
                    Paso {step} de {TOTAL_STEPS}
                  </span>
                  <h2 className="text-xl font-bold text-[#111] mt-1">
                    {stepsInfo[step - 1].title}
                  </h2>
                </div>
                <div className="flex gap-1.5 mt-4">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < step ? "bg-[#0058a3]" : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* ===== STEP 1: Shape ===== */}
                {step === 1 && (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm">
                      Selecciona la forma de tu habitación. La vista 3D se
                      actualiza en tiempo real.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {SHAPES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setShape(s.id)}
                          className={`p-3 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${
                            shape === s.id
                              ? "border-[#0058a3] bg-blue-50/30"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <RoomIcon type={s.id} active={shape === s.id} />
                          <span
                            className={`text-[11px] font-bold ${
                              shape === s.id ? "text-[#0058a3]" : "text-[#333]"
                            }`}
                          >
                            {s.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===== STEP 2: Dimensions ===== */}
                {step === 2 && (
                  <div className="space-y-5">
                    <p className="text-gray-500 text-sm">
                      Arrastra los muros en el plano 2D, o escribe las
                      medidas exactas aquí.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Ancho
                        </label>
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            onClick={() =>
                              setWidth((w) =>
                                Math.max(2, Math.round((w - 0.1) * 10) / 10)
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-gray-200 text-lg font-bold hover:bg-gray-50 flex-shrink-0"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={(width * 100).toFixed(0)}
                            onChange={(e) =>
                              setWidth(
                                Math.max(
                                  2,
                                  Math.min(30, Number(e.target.value) / 100)
                                )
                              )
                            }
                            className="w-full text-center text-sm font-bold border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:border-[#0058a3]"
                          />
                          <button
                            onClick={() =>
                              setWidth((w) =>
                                Math.min(30, Math.round((w + 0.1) * 10) / 10)
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-gray-200 text-lg font-bold hover:bg-gray-50 flex-shrink-0"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5 block text-center">
                          cm
                        </span>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Profundidad
                        </label>
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            onClick={() =>
                              setDepth((d) =>
                                Math.max(2, Math.round((d - 0.1) * 10) / 10)
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-gray-200 text-lg font-bold hover:bg-gray-50 flex-shrink-0"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={(depth * 100).toFixed(0)}
                            onChange={(e) =>
                              setDepth(
                                Math.max(
                                  2,
                                  Math.min(30, Number(e.target.value) / 100)
                                )
                              )
                            }
                            className="w-full text-center text-sm font-bold border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:border-[#0058a3]"
                          />
                          <button
                            onClick={() =>
                              setDepth((d) =>
                                Math.min(30, Math.round((d + 0.1) * 10) / 10)
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-gray-200 text-lg font-bold hover:bg-gray-50 flex-shrink-0"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5 block text-center">
                          cm
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 flex items-start gap-2 border border-gray-200">
                      <span className="text-lg">↔️</span>
                      <span>
                        Pasa el mouse sobre un muro para ver la línea de
                        selección. Haz clic y arrastra para redimensionar.
                      </span>
                    </div>
                  </div>
                )}

                {/* ===== STEP 3: Doors & Windows ===== */}
                {step === 3 && (
                  <div className="space-y-5">
                    {/* Door Catalog — real images */}
                    <div>
                      <h3 className="text-sm font-bold text-[#111] mb-3">
                        Estilos de puerta
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {DOOR_CATALOG.map((d) => (
                          <button
                            key={d.id}
                            onClick={() =>
                              setSelectedTool(
                                selectedTool?.type === "door" &&
                                  selectedTool.styleId === d.id
                                  ? null
                                  : { type: "door", styleId: d.id }
                              )
                            }
                            className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                              selectedTool?.type === "door" &&
                              selectedTool.styleId === d.id
                                ? "border-[#0058a3] bg-blue-50/30 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={d.image}
                              alt={d.name}
                              className="w-10 h-14 object-contain rounded"
                            />
                            <span className="text-[10px] font-semibold text-gray-600 leading-tight text-center">
                              {d.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Window Catalog — real images */}
                    <div>
                      <h3 className="text-sm font-bold text-[#111] mb-3">
                        Estilos de ventana
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {WINDOW_CATALOG.map((w) => (
                          <button
                            key={w.id}
                            onClick={() =>
                              setSelectedTool(
                                selectedTool?.type === "window" &&
                                  selectedTool.styleId === w.id
                                  ? null
                                  : { type: "window", styleId: w.id }
                              )
                            }
                            className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                              selectedTool?.type === "window" &&
                              selectedTool.styleId === w.id
                                ? "border-[#0058a3] bg-blue-50/30 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={w.image}
                              alt={w.name}
                              className="w-12 h-10 object-contain rounded"
                            />
                            <span className="text-[10px] font-semibold text-gray-600 leading-tight text-center">
                              {w.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tool Hint */}
                    {selectedTool && (
                      <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                        <span className="text-lg">👆</span>
                        <span>
                          Haz clic en cualquier pared de la vista 3D para
                          colocar{" "}
                          {selectedTool.type === "door"
                            ? "la puerta"
                            : "la ventana"}
                          .
                        </span>
                      </div>
                    )}

                    {/* Placed elements list */}
                    {placedElements.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-[#111] mb-2">
                          Elementos colocados
                        </h3>
                        <div className="space-y-1.5">
                          {placedElements.map((el) => {
                            const styleName =
                              el.type === "door"
                                ? DOOR_CATALOG.find((d) => d.id === el.style)
                                    ?.name
                                : WINDOW_CATALOG.find((w) => w.id === el.style)
                                    ?.name;
                            return (
                              <div
                                key={el.id}
                                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                              >
                                <span className="text-xs font-medium text-gray-700">
                                  {el.type === "door" ? "🚪" : "🪟"}{" "}
                                  {styleName} — Pared {el.wallIndex + 1}
                                </span>
                                <button
                                  onClick={() => removeElement(el.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ===== STEP 4: Style ===== */}
                {step === 4 && (
                  <div className="space-y-5">
                    {/* Wall Colors */}
                    <div>
                      <h3 className="text-sm font-bold text-[#111] mb-3">
                        Color de paredes
                      </h3>
                      <div className="grid grid-cols-7 gap-2">
                        {WALL_COLORS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setWallColor(c.color)}
                            className={`w-9 h-9 rounded-full border-2 transition-all ${
                              wallColor === c.color
                                ? "border-[#0058a3] scale-110 shadow-md"
                                : "border-gray-200"
                            }`}
                            style={{ backgroundColor: c.preview }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Floor Solid Colors */}
                    <div>
                      <h3 className="text-sm font-bold text-[#111] mb-3">
                        Suelo — Colores sólidos
                      </h3>
                      <div className="grid grid-cols-7 gap-2">
                        {FLOOR_COLORS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => {
                              setFloorTexture(null);
                              setFloorColor(c.color);
                            }}
                            className={`w-9 h-9 rounded-lg border-2 transition-all ${
                              !floorTexture && floorColor === c.color
                                ? "border-[#0058a3] scale-110 shadow-md"
                                : "border-gray-200"
                            }`}
                            style={{ backgroundColor: c.preview }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Floor Textures */}
                    <div>
                      <h3 className="text-sm font-bold text-[#111] mb-3">
                        Suelo — Texturas
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {FLOOR_TEXTURES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setFloorTexture(t.path)}
                            className={`p-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                              floorTexture === t.path
                                ? "border-[#0058a3] bg-blue-50/20"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={t.preview}
                              alt={t.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <span className="text-xs font-semibold text-gray-700 truncate">
                              {t.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3.5 border-2 border-[#111] text-[#111] font-bold rounded-full hover:bg-gray-50 transition-all"
                  >
                    Volver
                  </button>
                )}
                {step < TOTAL_STEPS ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3.5 bg-[#111] text-white font-bold rounded-full hover:bg-black shadow-lg transition-all"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-3.5 bg-[#0058a3] text-white font-bold rounded-full shadow-[0_0_20px_rgba(0,88,163,0.3)] hover:bg-[#004f93] transition-all flex items-center justify-center gap-2"
                  >
                    <Palette className="w-4 h-4" /> Abrir Diseñador 3D
                  </button>
                )}
              </div>
            </div>

            {/* ========== RIGHT PANEL — 3D PREVIEW ========== */}
            <div className="flex-1 bg-[#bdbdbd] relative overflow-hidden">
              {step === 2 ? (
                /* ===== 2D BLUEPRINT VIEW (Step 2) ===== */
                <>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm z-20 text-xs font-bold text-[#333]">
                    Plano 2D • Arrastra un muro para redimensionar
                  </div>
                  <RoomBlueprint2D
                    shape={shape}
                    width={width}
                    depth={depth}
                    onDimensionChange={handleDimensionChange}
                  />
                </>
              ) : (
                /* ===== 3D PREVIEW (Steps 1, 3, 4) ===== */
                <>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm z-20 text-xs font-bold text-[#333]">
                    {step === 1 ? "Vista superior" : "Vista 3D • Gira con el mouse"}
                  </div>
                  <Canvas
                    shadows
                    camera={{ position: [8, 6, 8], fov: 45 }}
                    className="w-full h-full"
                    style={{ background: '#8a8a8a' }}
                  >
                    <Room3DScene
                      shape={shape}
                      width={width}
                      depth={depth}
                      wallColor={wallColor}
                      floorColor={floorColor}
                      floorTexture={floorTexture}
                      placedElements={placedElements}
                      step={step}
                      selectedTool={selectedTool}
                      onDimensionChange={handleDimensionChange}
                      onPlaceElement={handlePlaceElement}
                    />
                  </Canvas>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
