import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";


function FallbackModel() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#a67c52" />
    </mesh>
  );
}

import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

function Model() {
  const gltf = useGLTF("/models/mueble2.glb");
  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  return <primitive object={clone} scale={1.7} position={[0, 0, 0]} />;
}

export function MuebleModel() {
  return (
    <Suspense fallback={<FallbackModel />}>
      <Model />
    </Suspense>
  );
}

