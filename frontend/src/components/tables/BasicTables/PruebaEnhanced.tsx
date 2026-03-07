import React, { useState, useRef, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Enhanced components
import ModelEnhanced from "../../Diseño3D/Model/ModelEnhanced";
import DimensionsPanelEnhanced from "../../Diseño3D/UI/DimensionsPanelEnhanced";
import ColorPalette from "../../Diseño3D/UI/ColorPalette";
import TextureCardEnhanced from "../../Diseño3D/UI/TextureCardEnhanced";
import ViewCardEnhanced from "../../Diseño3D/UI/ViewCardEnhanced";
import ActionsCardEnhanced from "../../Diseño3D/UI/ActionsCardEnhanced";
import UploadButtonEnhanced from "../../Diseño3D/UI/UploadButtonEnhanced";
import ZoomControlsEnhanced from "../../Diseño3D/UI/ZoomControlsEnhanced";
import StatsPanel from "../../Diseño3D/UI/StatsPanel";
import AnimationControls from "../../Diseño3D/UI/AnimationControls";
import LightPresets, { type LightPreset } from "../../Diseño3D/UI/LightPresets";
import ToolbarQuickActions from "../../Diseño3D/UI/ToolbarQuickActions";
import LoadingOverlay from "../../Diseño3D/UI/LoadingOverlay";

import useUndo from "../../../hooks/useUndo";
import { exportScene } from "../../../utils/exporter";

// Perspective Controls Component
function PerspectiveControls({
  onChangePerspective,
}: {
  onChangePerspective: (view: string) => void;
}) {
  const views = [
    { id: "front", label: "Frontal" },
    { id: "back", label: "Trasera" },
    { id: "left", label: "Izquierda" },
    { id: "right", label: "Derecha" },
    { id: "top", label: "Superior" },
    { id: "bottom", label: "Inferior" },
  ];

  return (
    <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
      <p className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Perspectivas
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onChangePerspective(view.id)}
            className="px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            {view.label}
          </button>
        ))}
        <button
          onClick={() => onChangePerspective("isometric")}
          className="px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium col-span-2 shadow-sm hover:shadow-md"
        >
          Isométrica
        </button>
      </div>
    </div>
  );
}

export default function PruebaEnhanced() {
  // State
  const [selectedPart, setSelectedPart] = useState<THREE.Mesh | null>(null);
  const sceneRef = useRef<THREE.Group | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelFileName, setModelFileName] = useState<string>("");
  const [dimensionsVersion, setDimensionsVersion] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    depth: 0,
  });
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [reset, setReset] = useState(false);
  const [makeWhite, setMakeWhite] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(false);
  const [shading, setShading] = useState<"flat" | "smooth">("smooth");
  const orbitControlsRef = useRef<any>(null);
  const [showDimensionsPanel, setShowDimensionsPanel] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [lightPreset, setLightPreset] = useState<LightPreset>("studio");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Undo hook
  const { push, undo, canUndo } = useUndo();

  // Environment presets map
  const getEnvironmentPreset = (preset: LightPreset) => {
    switch (preset) {
      case "studio":
        return "studio";
      case "natural":
        return "sunset";
      case "dramatic":
        return "night";
      case "soft":
        return "dawn";
      default:
        return "studio";
    }
  };

  // Zoom functions
  const zoomByFactor = (factor: number) => {
    if (!orbitControlsRef.current) return;
    const cam = orbitControlsRef.current.object;
    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    cam.position.addScaledVector(dir, factor);
    orbitControlsRef.current.update();

    // Update zoom level indicator
    const distance = cam.position.length();
    setZoomLevel(Math.round((5 / distance) * 100));
  };

  const zoomIn = () => zoomByFactor(-0.5);
  const zoomOut = () => zoomByFactor(0.5);

  const fitView = useCallback(() => {
    if (!orbitControlsRef.current || !sceneRef.current) return;
    orbitControlsRef.current.target.set(0, 0, 0);
    orbitControlsRef.current.object.position.set(3, 3, 3);
    orbitControlsRef.current.update();
    setZoomLevel(100);
  }, []);

  const resetView = useCallback(() => {
    if (!orbitControlsRef.current) return;
    orbitControlsRef.current.target.set(0, 0, 0);
    orbitControlsRef.current.object.position.set(2, 2, 2);
    orbitControlsRef.current.update();
    setZoomLevel(100);
  }, []);

  // File handling
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setModelFile(file);
      setModelFileName(file.name);
      setReset(false);
      setMakeWhite(false);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  // Save/Export
  const saveCopy = async () => {
    if (!sceneRef.current) return;
    try {
      await exportScene(sceneRef.current, modelFile);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  // Color change
  const changeColor = (color: string) => {
    if (selectedPart?.material instanceof THREE.MeshStandardMaterial) {
      const mat = selectedPart.material;
      push({
        part: selectedPart,
        prev: {
          color: mat.color.getHex(),
          map: mat.map || null,
          flatShading: !!mat.flatShading,
          scale: {
            x: selectedPart.scale.x,
            y: selectedPart.scale.y,
            z: selectedPart.scale.z,
          },
        },
      });
      mat.color.set(color);
      mat.needsUpdate = true;
    }
  };

  // Model operations
  const resetModel = () => {
    setSelectedPart(null);
    setDimensions({ width: 0, height: 0, depth: 0 });
    setReset(true);
    setMakeWhite(false);
    setTimeout(() => setReset(false), 0);
  };

  const makeModelWhite = () => setMakeWhite(true);
  const toggleWireframe = () => setShowWireframe((prev) => !prev);
  const toggleDimensions = () => setShowDimensions((prev) => !prev);
  const toggleGrid = () => setShowGrid((prev) => !prev);
  const toggleAxes = () => setShowAxes((prev) => !prev);

  const toggleShading = () => {
    const newShading = shading === "smooth" ? "flat" : "smooth";
    setShading(newShading);
    if (selectedPart?.material instanceof THREE.MeshStandardMaterial) {
      const mat = selectedPart.material;
      push({
        part: selectedPart,
        prev: {
          color: mat.color.getHex(),
          map: mat.map || null,
          flatShading: !!mat.flatShading,
          scale: {
            x: selectedPart.scale.x,
            y: selectedPart.scale.y,
            z: selectedPart.scale.z,
          },
        },
      });
      mat.flatShading = newShading === "flat";
      mat.needsUpdate = true;
    }
  };

  // Texture
  const applyTexture = (texture: string) => {
    if (selectedPart?.material instanceof THREE.MeshStandardMaterial) {
      const mat = selectedPart.material;
      push({
        part: selectedPart,
        prev: {
          color: mat.color.getHex(),
          map: mat.map || null,
          flatShading: !!mat.flatShading,
          scale: {
            x: selectedPart.scale.x,
            y: selectedPart.scale.y,
            z: selectedPart.scale.z,
          },
        },
      });
      const loader = new THREE.TextureLoader();
      const textureMap = loader.load(`/textures/${texture}.jpg`);
      mat.map = textureMap;
      mat.needsUpdate = true;
    }
  };

  // Dimensions
  const updateDimensions = (
    dimension: "width" | "height" | "depth",
    value: number
  ) => {
    setDimensions((prev) => ({ ...prev, [dimension]: value }));
    if (selectedPart) {
      push({
        part: selectedPart,
        prev: {
          color:
            selectedPart.material instanceof THREE.MeshStandardMaterial
              ? selectedPart.material.color.getHex()
              : undefined,
          map:
            selectedPart.material instanceof THREE.MeshStandardMaterial
              ? selectedPart.material.map || null
              : null,
          flatShading:
            selectedPart.material instanceof THREE.MeshStandardMaterial
              ? !!selectedPart.material.flatShading
              : false,
          scale: {
            x: selectedPart.scale.x,
            y: selectedPart.scale.y,
            z: selectedPart.scale.z,
          },
        },
      });
      const scale = selectedPart.scale.clone();
      if (dimension === "width") scale.x = value / 100;
      if (dimension === "height") scale.y = value / 100;
      if (dimension === "depth") scale.z = value / 100;
      selectedPart.scale.set(scale.x, scale.y, scale.z);
      setDimensionsVersion((v) => v + 1);
    }
  };

  const resetDesignChanges = () => {
    if (selectedPart?.material instanceof THREE.MeshStandardMaterial) {
      const mat = selectedPart.material;
      push({
        part: selectedPart,
        prev: {
          color: mat.color.getHex(),
          map: mat.map || null,
          flatShading: !!mat.flatShading,
          scale: {
            x: selectedPart.scale.x,
            y: selectedPart.scale.y,
            z: selectedPart.scale.z,
          },
        },
      });
      mat.map = null;
      mat.color.set(0xffffff);
      mat.flatShading = false;
      mat.needsUpdate = true;
      selectedPart.scale.set(1, 1, 1);
      setDimensions({ width: 100, height: 100, depth: 100 });
      setDimensionsVersion((v) => v + 1);
    }
  };

  // Camera perspective
  const changePerspective = (view: string) => {
    if (!orbitControlsRef.current) return;
    orbitControlsRef.current.target.set(0, 0, 0);
    const positions: Record<string, [number, number, number]> = {
      front: [0, 0, 5],
      back: [0, 0, -5],
      left: [-5, 0, 0],
      right: [5, 0, 0],
      top: [0, 5, 0.01],
      bottom: [0, -5, 0.01],
      isometric: [3, 3, 3],
    };
    const pos = positions[view] || positions.isometric;
    orbitControlsRef.current.object.position.set(...pos);
    orbitControlsRef.current.update();
  };

  // Screenshot
  const takeScreenshot = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `modelo-3d-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!canvasContainerRef.current) return;
    if (!document.fullscreenElement) {
      canvasContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="min-h-screen p-3 sm:p-6 font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 3D Viewer */}
        <div
          ref={canvasContainerRef}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 ${
            isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
          }`}
        >
          <div className="relative">
            {/* Perspective Controls */}
            <PerspectiveControls onChangePerspective={changePerspective} />

            {/* Stats Panel */}
            <StatsPanel
              scene={sceneRef.current}
              selectedPart={selectedPart}
              visible={showStatsPanel}
              onToggle={() => setShowStatsPanel(!showStatsPanel)}
            />

            {/* Canvas Container */}
            <div className="relative w-full h-[500px] sm:h-[650px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
              {/* Loading Overlay */}
              <LoadingOverlay isLoading={isLoading} hasModel={!!modelUrl} />

              <Canvas
                camera={{ position: [2, 2, 2], fov: 50, near: 0.1, far: 2000 }}
                gl={{ preserveDrawingBuffer: true }}
              >
                <Suspense fallback={null}>
                  {/* Lighting based on preset */}
                  <ambientLight intensity={lightPreset === "soft" ? 1 : 0.6} />
                  <directionalLight
                    position={
                      lightPreset === "dramatic" ? [5, 10, -5] : [10, 10, 10]
                    }
                    intensity={lightPreset === "dramatic" ? 1 : 0.5}
                    castShadow
                  />
                  {lightPreset !== "dramatic" && (
                    <directionalLight position={[-5, 5, -5]} intensity={0.3} />
                  )}

                  {/* Environment */}
                  <Environment preset={getEnvironmentPreset(lightPreset)} />

                  {/* Contact Shadows */}
                  <ContactShadows
                    position={[0, -0.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4}
                  />

                  <OrbitControls
                    ref={orbitControlsRef}
                    enableDamping={true}
                    dampingFactor={0.05}
                    minDistance={0.1}
                    maxDistance={1000}
                    rotateSpeed={0.5}
                    zoomSpeed={1}
                    panSpeed={0.8}
                    screenSpacePanning={true}
                    enableZoom={true}
                    autoRotate={autoRotate}
                    autoRotateSpeed={rotationSpeed}
                  />

                  {modelUrl && (
                    <ModelEnhanced
                      url={modelUrl}
                      onPartClick={(part: THREE.Mesh) => {
                        setSelectedPart(part);
                        setShowDimensionsPanel(true);
                        const box = new THREE.Box3().setFromObject(part);
                        const size = box.getSize(new THREE.Vector3());
                        setDimensions({
                          width: size.x * 100,
                          height: size.y * 100,
                          depth: size.z * 100,
                        });
                      }}
                      reset={reset}
                      makeWhite={makeWhite}
                      showWireframe={showWireframe}
                      showDimensions={showDimensions}
                      showGrid={showGrid}
                      showAxes={showAxes}
                      autoRotate={autoRotate}
                      rotationSpeed={rotationSpeed}
                      selectedPart={selectedPart}
                      onSceneReady={(s: THREE.Group) => (sceneRef.current = s)}
                      dimensionsVersion={dimensionsVersion}
                    />
                  )}
                </Suspense>
              </Canvas>

              {/* Dimensions Panel */}
              <DimensionsPanelEnhanced
                selectedPart={selectedPart}
                visible={showDimensionsPanel}
                onClose={() => setShowDimensionsPanel(false)}
                dimensions={dimensions}
                updateDimensions={updateDimensions}
                onUndo={() => undo()}
                canUndo={canUndo()}
                setDimensions={setDimensions}
              />

              {/* Upload Button */}
              <UploadButtonEnhanced
                onFileChange={handleFileChange}
                modelUrl={modelUrl}
                fileName={modelFileName}
              />

              {/* Zoom Controls */}
              <ZoomControlsEnhanced
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomLevel={zoomLevel}
                onFitView={fitView}
                onResetView={resetView}
              />

              {/* Quick Actions Toolbar */}
              <ToolbarQuickActions
                onScreenshot={takeScreenshot}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
                showGrid={showGrid}
                onToggleGrid={toggleGrid}
                autoRotate={autoRotate}
                onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
              />
            </div>
          </div>
        </div>

        {/* Control Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <ColorPalette
            selectedPart={selectedPart}
            onChangeColor={changeColor}
          />
          <TextureCardEnhanced
            selectedPart={selectedPart}
            applyTexture={applyTexture}
          />
          <ViewCardEnhanced
            showWireframe={showWireframe}
            shading={shading}
            showDimensions={showDimensions}
            showGrid={showGrid}
            showAxes={showAxes}
            toggleWireframe={toggleWireframe}
            toggleShading={toggleShading}
            toggleDimensions={toggleDimensions}
            toggleGrid={toggleGrid}
            toggleAxes={toggleAxes}
          />
          <ActionsCardEnhanced
            resetModel={resetModel}
            makeModelWhite={makeModelWhite}
            saveCopy={saveCopy}
            resetDesignChanges={resetDesignChanges}
            modelUrl={modelUrl}
            sceneRef={sceneRef}
            selectedPart={selectedPart}
            onUndo={() => undo()}
            canUndo={canUndo()}
          />
          <AnimationControls
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            onSpeedChange={setRotationSpeed}
          />
          <LightPresets
            currentPreset={lightPreset}
            onPresetChange={setLightPreset}
          />
        </div>
      </div>
    </div>
  );
}
