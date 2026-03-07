import React from "react";
import { UploadCloud } from "lucide-react";

type Props = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modelUrl: string | null;
};

export default function UploadButton({ onFileChange, modelUrl }: Props) {
  return (
    <div className="absolute left-4 bottom-4 z-20">
      <label className="cursor-pointer">
        <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-white" />
          {modelUrl ? "Cambiar modelo" : "Cargar modelo 3D"}
        </div>
        <input
          type="file"
          accept=".glb"
          onChange={onFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
