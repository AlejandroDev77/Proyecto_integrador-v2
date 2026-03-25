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

function Model() {
  try {
    const gltf = useGLTF("/models/mueble2.glb");
    return <primitive object={gltf.scene} scale={1.7} position={[0, 0, 0]} />;
  } catch (e) {
    return <FallbackModel />;
  }
}

export function MuebleModel() {
  return (
    <Suspense fallback={<FallbackModel />}>
      <Model />
    </Suspense>
  );
}


try {
  useGLTF.preload("/models/mueble2.glb");
} catch (e) {
  console.warn("archivo no encontrado");
}
