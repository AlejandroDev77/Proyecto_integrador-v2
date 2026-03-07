import { useState, useEffect } from "react";
import { BarChart3, Cpu, Box, Layers } from "lucide-react";
import * as THREE from "three";

type Props = {
  scene: THREE.Group | null;
  selectedPart: THREE.Mesh | null;
  visible: boolean;
  onToggle: () => void;
};

export default function StatsPanel({
  scene,
  selectedPart,
  visible,
  onToggle,
}: Props) {
  const [stats, setStats] = useState({
    vertices: 0,
    faces: 0,
    objects: 0,
    partName: "",
  });

  useEffect(() => {
    if (!scene) return;

    let vertices = 0;
    let faces = 0;
    let objects = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        objects++;
        const geometry = child.geometry;
        if (geometry instanceof THREE.BufferGeometry) {
          const position = geometry.getAttribute("position");
          if (position) {
            vertices += position.count;
          }
          const index = geometry.getIndex();
          if (index) {
            faces += index.count / 3;
          } else if (position) {
            faces += position.count / 3;
          }
        }
      }
    });

    setStats((prev) => ({
      ...prev,
      vertices,
      faces: Math.round(faces),
      objects,
    }));
  }, [scene]);

  useEffect(() => {
    if (selectedPart) {
      setStats((prev) => ({
        ...prev,
        partName: selectedPart.name || "Sin nombre",
      }));
    }
  }, [selectedPart]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          visible
            ? "bg-indigo-500 text-white"
            : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200"
        } backdrop-blur-sm hover:scale-110`}
        title="Estadísticas del modelo"
      >
        <BarChart3 className="w-5 h-5" />
      </button>

      {/* Stats Panel */}
      {visible && (
        <div className="absolute top-16 right-4 z-20 w-64 animate-fade-in">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </h3>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Vértices</span>
                </div>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {stats.vertices.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Layers className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Caras</span>
                </div>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {stats.faces.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Box className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Objetos</span>
                </div>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {stats.objects}
                </span>
              </div>

              {selectedPart && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Parte seleccionada:
                  </p>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                    {stats.partName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
