import React, { useState, useCallback } from "react";
import { UploadCloud, FileBox, CheckCircle, AlertCircle } from "lucide-react";

type Props = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modelUrl: string | null;
  fileName?: string;
};

export default function UploadButtonEnhanced({
  onFileChange,
  modelUrl,
  fileName,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.name.endsWith(".glb") || file.name.endsWith(".gltf")) {
          // Create a synthetic event
          const syntheticEvent = {
            target: {
              files: files,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onFileChange(syntheticEvent);
          setUploadStatus("success");
          setTimeout(() => setUploadStatus("idle"), 2000);
        } else {
          setUploadStatus("error");
          setTimeout(() => setUploadStatus("idle"), 3000);
        }
      }
    },
    [onFileChange]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatus("loading");
    onFileChange(e);
    setTimeout(() => setUploadStatus("success"), 500);
    setTimeout(() => setUploadStatus("idle"), 2500);
  };

  return (
    <div
      className={`absolute left-4 bottom-4 z-20 transition-all duration-300 ${
        isDragging ? "scale-105" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="cursor-pointer block">
        <div
          className={`relative px-5 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center gap-3 ${
            isDragging
              ? "bg-blue-600 text-white ring-4 ring-blue-300 dark:ring-blue-700"
              : uploadStatus === "success"
              ? "bg-green-500 text-white"
              : uploadStatus === "error"
              ? "bg-red-500 text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl"
          }`}
        >
          {uploadStatus === "success" ? (
            <CheckCircle className="w-5 h-5 animate-bounce" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="w-5 h-5" />
          ) : modelUrl ? (
            <FileBox className="w-5 h-5" />
          ) : (
            <UploadCloud className="w-5 h-5" />
          )}

          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {uploadStatus === "success"
                ? "¡Cargado!"
                : uploadStatus === "error"
                ? "Formato no válido"
                : isDragging
                ? "Suelta aquí"
                : modelUrl
                ? "Cambiar modelo"
                : "Cargar modelo 3D"}
            </span>
            {modelUrl && fileName && uploadStatus === "idle" && (
              <span className="text-xs opacity-80 truncate max-w-[150px]">
                {fileName}
              </span>
            )}
          </div>

          {/* Drag indicator */}
          {isDragging && (
            <div className="absolute inset-0 rounded-xl border-2 border-dashed border-white/50 animate-pulse" />
          )}
        </div>

        <input
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </label>

      {/* Supported formats hint */}
      {!modelUrl && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
          Arrastra o haz clic • GLB, GLTF
        </p>
      )}
    </div>
  );
}
