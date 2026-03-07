import { useRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildDimensionGroup } from "./DimensionLines.ts";

export type LightPreset = "studio" | "natural" | "dramatic" | "soft";

function ModelEnhanced({
  url,
  onPartClick,
  reset,
  makeWhite,
  showWireframe,
  showDimensions,
  showGrid,
  showAxes,
  autoRotate,
  rotationSpeed,
  selectedPart,
  onSceneReady,
  dimensionsVersion,
}: {
  url: string;
  onPartClick: (part: THREE.Mesh) => void;
  reset: boolean;
  makeWhite: boolean;
  showWireframe: boolean;
  showDimensions: boolean;
  showGrid: boolean;
  showAxes: boolean;
  autoRotate: boolean;
  rotationSpeed: number;
  selectedPart: THREE.Mesh | null;
  onSceneReady?: (scene: THREE.Group) => void;
  dimensionsVersion?: number;
}) {
  const { scene } = useGLTF(url);
  const dimensionLines = useRef<THREE.Group>(new THREE.Group());
  const outlineMeshes = useRef<THREE.LineSegments[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  // Create grid helper
  const gridHelper = useMemo(() => {
    const grid = new THREE.GridHelper(10, 20, 0x6b7280, 0xd1d5db);
    grid.position.y = -0.01;
    return grid;
  }, []);

  // Create axes helper
  const axesHelper = useMemo(() => {
    return new THREE.AxesHelper(3);
  }, []);

  // Center and scale model on load
  useEffect(() => {
    if (onSceneReady) {
      try {
        onSceneReady(scene as THREE.Group);
      } catch (e) {
        // ignore
      }
    }
    try {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);

      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 5) {
        const scale = 5 / maxDim;
        scene.scale.setScalar(scale);
      }
    } catch (e) {
      // ignore
    }
  }, [scene, onSceneReady]);

  // Handle wireframe, colors, and materials
  useEffect(() => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        if (reset) {
          child.material.color.set(0xffffff);
          child.material.wireframe = false;
        }
        if (makeWhite) {
          child.material.color.set(0xffffff);
        }
        child.material.wireframe = showWireframe;
      }
    });

    // Handle dimensions
    if (showDimensions) {
      dimensionLines.current.clear();
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const dimGroup = buildDimensionGroup(box, size, center);
      dimensionLines.current.add(dimGroup);
    } else {
      dimensionLines.current.clear();
    }
  }, [
    reset,
    makeWhite,
    showWireframe,
    showDimensions,
    scene,
    dimensionsVersion,
  ]);

  // Handle selection outline
  useEffect(() => {
    // Clear previous outlines
    outlineMeshes.current.forEach((outline) => {
      outline.parent?.remove(outline);
      outline.geometry.dispose();
      if (outline.material instanceof THREE.Material) {
        outline.material.dispose();
      }
    });
    outlineMeshes.current = [];

    // Create outline for selected part
    if (selectedPart && selectedPart.geometry) {
      const edges = new THREE.EdgesGeometry(selectedPart.geometry, 30);
      const outline = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color: 0x3b82f6,
          linewidth: 2,
        })
      );
      outline.position.copy(selectedPart.position);
      outline.rotation.copy(selectedPart.rotation);
      outline.scale.copy(selectedPart.scale);
      selectedPart.parent?.add(outline);
      outlineMeshes.current.push(outline);
    }

    return () => {
      outlineMeshes.current.forEach((outline) => {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        if (outline.material instanceof THREE.Material) {
          outline.material.dispose();
        }
      });
    };
  }, [selectedPart]);

  // Auto-rotation
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    if (event.object instanceof THREE.Mesh) {
      onPartClick(event.object);
    }
  };

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        onPointerDown={handlePointerDown}
        position={[0, 0, 0]}
      />
      <primitive object={dimensionLines.current} />
      {showGrid && <primitive object={gridHelper} />}
      {showAxes && <primitive object={axesHelper} />}
    </group>
  );
}

export default ModelEnhanced;
