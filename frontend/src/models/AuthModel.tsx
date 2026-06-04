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

function Model() {
  const gltf = useGLTF("/models/outdoor_couch.glb");
  // Aumentar escala para que se vea más cerca
  return <primitive object={gltf.scene} scale={2.2} position={[0, -1.0, 0]} />;
}

export function AuthModel() {
  return (
    <Suspense fallback={<FallbackModel />}>
      <Model />
    </Suspense>
  );
}

useGLTF.preload("/models/outdoor_couch.glb");
