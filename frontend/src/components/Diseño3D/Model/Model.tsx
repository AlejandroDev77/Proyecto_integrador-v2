import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { buildDimensionGroup } from "./DimensionLines.ts";

function Model({
  url,
  onPartClick,
  reset,
  makeWhite,
  showWireframe,
  showDimensions,
  onSceneReady,
  dimensionsVersion,
}: {
  url: string;
  onPartClick: (part: THREE.Mesh) => void;
  reset: boolean;
  makeWhite: boolean;
  showWireframe: boolean;
  showDimensions: boolean;
  onSceneReady?: (scene: THREE.Group) => void;
  dimensionsVersion?: number;
}) {
  const { scene } = useGLTF(url);
  const dimensionLines = useRef<THREE.Group>(new THREE.Group());

  // Centrar modelo al cargar
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
      // mover escena para que su centro quede en el origen
      scene.position.sub(center);

      // opcional: escalar modelos muy grandes para mejor ajuste (si es necesario)
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 5) {
        const scale = 5 / maxDim;
        scene.scale.setScalar(scale);
      }
    } catch (e) {
      // no bloquear si falla
    }
  }, [scene]);

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

    // antes se calculaban estadísticas; eliminado
  }, [reset, makeWhite, showWireframe, showDimensions, scene, dimensionsVersion]);

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    if (event.object instanceof THREE.Mesh) {
      onPartClick(event.object);
    }
  };

  return (
    <>
      <primitive
        object={scene}
        onPointerDown={handlePointerDown}
        position={[0, 0, 0]}
      />
      <primitive object={dimensionLines.current} />
    </>
  );
}

export default Model;
