import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { X, UploadCloud, Image as ImageIcon, Trash2, Box, Wand2, Check } from "lucide-react";
import { r2Service } from "../../../../services/r2Service";
import { generacionIAService } from "../../../../services/generacionIAService";
import { getMuebles } from "../../../../services/muebleService";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSuccess: () => void;
}

export default function Generar3DModal({ showModal, setShowModal, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nomMueble, setNomMueble] = useState("");
  const [selectedMuebleId, setSelectedMuebleId] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [muebles, setMuebles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal) {
      fetchMuebles();
    }
  }, [showModal]);

  const fetchMuebles = async () => {
    try {
      const data = await getMuebles(1, 100);
      setMuebles(data.data || []);
    } catch (error) {
      console.error("Error fetching muebles:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setNomMueble("");
    setSelectedMuebleId(null);
    setFiles([]);
    setPreviews([]);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if ((!nomMueble && !selectedMuebleId) || files.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // 1. Subir imágenes a R2
      const uploadPromises = files.map(file => r2Service.uploadFile(file, "ia-temp"));
      const imageUrls = await Promise.all(uploadPromises);

      // 2. Crear registro en Backend
      const finalNomMueble = selectedMuebleId 
        ? muebles.find(m => m.id_mue === selectedMuebleId)?.nom_mue 
        : nomMueble;

      await generacionIAService.create({
        nom_mue: finalNomMueble || "Mueble sin nombre",
        imgs_ref: imageUrls,
        estado: "procesando",
        id_mue: selectedMuebleId || undefined
      });

      Swal.fire({
        icon: "success",
        title: "¡Generación iniciada!",
        text: "El proceso puede tardar unos minutos.",
        showConfirmButton: false,
        timer: 2000,
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error in generation process:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al iniciar la generación.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Wand2 className="w-6 h-6" />
            Generar Modelo 3D con IA
          </h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Paso 1: Nombre/Mueble */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ¿Para qué mueble es esta generación?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Seleccionar existente:</p>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  value={selectedMuebleId || ""}
                  onChange={(e) => {
                    setSelectedMuebleId(Number(e.target.value) || null);
                    if (e.target.value) setNomMueble("");
                  }}
                >
                  <option value="">-- Seleccionar --</option>
                  {muebles.map(m => (
                    <option key={m.id_mue} value={m.id_mue}>{m.nom_mue}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">O escribe un nombre nuevo:</p>
                <input 
                  type="text"
                  placeholder="Ej: Silla de Oficina"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  value={nomMueble}
                  onChange={(e) => {
                    setNomMueble(e.target.value);
                    if (e.target.value) setSelectedMuebleId(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Paso 2: Imágenes */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Imágenes de referencia (mínimo 1, preferible varias vistas)
            </label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
            >
              <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium">Haz clic para subir fotos</p>
              <p className="text-xs text-gray-500 mt-1">Soporta JPG, PNG (Máx 5MB c/u)</p>
              <input 
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between bg-gray-50 dark:bg-gray-800/50">
          <button 
            onClick={handleClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button 
            disabled={isSubmitting || files.length === 0 || (!nomMueble && !selectedMuebleId)}
            onClick={handleSubmit}
            className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:shadow-none flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Box size={20} />
                Iniciar Generación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
