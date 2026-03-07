import React, { useState, useEffect } from "react";
import { EyeIcon } from "../../../../icons";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Image as ImageIcon, Box, Package, DollarSign, Tag, X, Grid3x3 } from 'lucide-react';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModalVerMuebleProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  muebleSeleccionado: any;
}

function MuebleModelContent({ modelPath }: { modelPath: string }) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf) => {
        setModel(gltf.scene);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error cargando modelo 3D:", err);
        setError("No se puede cargar el modelo 3D. Verifica la configuración CORS en Cloudflare R2.");
        setLoading(false);
      }
    );
  }, [modelPath]);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-500">Cargando modelo 3D...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-red-600 dark:text-red-400 font-semibold mb-2">⚠️ Error al cargar modelo 3D</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{error}</p>
        <a
          href={modelPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          Descargar archivo
        </a>
      </div>
    );
  }

  if (!model) {
    return <div className="flex items-center justify-center h-full text-gray-500">Modelo no cargado</div>;
  }

  return (
    <Canvas camera={{ position: [2, 2, 9], fov: 80 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />
      <primitive object={model} scale={2.2} />
      <OrbitControls enablePan={true} enableRotate={true} enableZoom={true} />
    </Canvas>
  );
}

const ModalVerMueble: React.FC<ModalVerMuebleProps> = ({ showModal, setShowModal, muebleSeleccionado }) => {
  const [activeTab, setActiveTab] = useState<'DETALLES' | '2D' | '3D'>('DETALLES');

  if (!showModal || !muebleSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            Detalles del Mueble
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-white">
          {(['DETALLES', '2D', '3D'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 sm:px-6 py-4 font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
              }`}
            >
              {tab === 'DETALLES' && <Package className="w-5 h-5" />}
              {tab === '2D' && <ImageIcon className="w-5 h-5" />}
              {tab === '3D' && <Box className="w-5 h-5" />}
              <span className="hidden sm:inline">{tab === 'DETALLES' ? 'Detalles' : tab === '2D' ? 'Imagen' : 'Modelo 3D'}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          {activeTab === 'DETALLES' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailItem label="Nombre" value={muebleSeleccionado.nom_mue} icon={<Tag className="w-5 h-5 text-blue-600" />} />
                <DetailItem label="Descripción" value={muebleSeleccionado.desc_mue} icon={<Tag className="w-5 h-5 text-blue-600" />} />
                <DetailItem label="Precio Venta" value={`${muebleSeleccionado.precio_venta} Bs.`} icon={<DollarSign className="w-5 h-5 text-green-600" />} />
                <DetailItem label="Precio Costo" value={`${muebleSeleccionado.precio_costo} Bs.`} icon={<DollarSign className="w-5 h-5 text-red-600" />} />
                <DetailItem label="Stock" value={`${muebleSeleccionado.stock} unidades`} icon={<Package className="w-5 h-5 text-yellow-600" />} />
                <DetailItem label="Stock Mínimo" value={`${muebleSeleccionado.stock_min} unidades`} icon={<Package className="w-5 h-5 text-orange-600" />} />
                <DetailItem label="Dimensiones" value={muebleSeleccionado.dimensiones} icon={<Box className="w-5 h-5 text-indigo-600" />} />
                <DetailItem label="Categoría" value={muebleSeleccionado.categoria?.nom_cat || "Sin categoría"} icon={<Grid3x3 className="w-5 h-5 text-purple-600" />} />
              </div>
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className={`w-4 h-4 rounded-full ${muebleSeleccionado.est_mue ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  <span className="text-lg font-semibold text-gray-900">
                    Estado: <span className={muebleSeleccionado.est_mue ? 'text-green-600' : 'text-red-600'}>
                      {muebleSeleccionado.est_mue ? 'Disponible' : 'No Disponible'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === '2D' && (
            <div className="flex justify-center items-center w-full h-[500px]">
              {muebleSeleccionado.img_mue ? (
                <img
                  src={muebleSeleccionado.img_mue}
                  alt="Imagen del mueble"
                  className="w-full h-full border border-gray-200 rounded-xl shadow-md object-contain hover:shadow-lg transition-shadow"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Sin imagen disponible</p>
                </div>
              )}
            </div>
          )}

          {activeTab === '3D' && (
            <div className="w-full min-h-96">
              {muebleSeleccionado.modelo_3d ? (
                <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200">
                  <MuebleModelContent modelPath={muebleSeleccionado.modelo_3d} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <Box className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Sin modelo 3D disponible</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 sm:px-8 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 sm:px-8 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 sm:px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para mostrar detalles
function DetailItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white break-words">{value}</p>
      </div>
    </div>
  );
}

export default ModalVerMueble;
