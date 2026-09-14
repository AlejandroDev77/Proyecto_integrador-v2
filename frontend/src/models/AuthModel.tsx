import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function FallbackModel() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#a67c52" wireframe />
    </mesh>
  );
}

import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

function Model() {
  const gltf = useGLTF("/models/outdoor_couch.glb");
  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);

  // Aumentar escala para que se vea más cerca
  return <primitive object={clone} scale={2.2} position={[0, -1.0, 0]} />;
}

export function AuthModel() {
  return (
    <Suspense fallback={<FallbackModel />}>
      <Model />
    </Suspense>
  );
}


