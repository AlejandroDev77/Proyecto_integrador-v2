import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  Package,
  X,
  Save,
  Ruler,
  DollarSign,
  Boxes,
  CheckCircle,
  Image,
  Check,
  UploadCloud,
} from "lucide-react";

interface Material {
  id_mat: number;
  nom_mat: string;
  desc_mat: string;
  stock_mat: number;
  stock_min: number;
  est_mat: boolean;
  unidad_medida: string;
  costo_mat: number;
  img_mat: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setMateriales: React.Dispatch<React.SetStateAction<Material[]>>;
}

export default function ModalAgregarMaterial({
  showModal,
  setShowModal,
  setMateriales,
}: Props) {
  const [form, setForm] = useState({
    nom_mat: "",
    desc_mat: "",
    stock_mat: "",
    stock_min: "",
    unidad_medida: "",
    costo_mat: "",
    est_mat: "1",
  });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview de imagen
  useEffect(() => {
    if (imgFile) {
      const url = URL.createObjectURL(imgFile);
      setImgPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImgPreview(null);
    }
  }, [imgFile]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nom_mat) {
      setGeneralError("El nombre es requerido.");
      return;
    }
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    let idUsuarioLocal = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p: any = jwtDecode(token);
        idUsuarioLocal = p.id_usu || null;
      }
    } catch {
      idUsuarioLocal = null;
    }

    try {
      const formData = new FormData();
      formData.append("nom_mat", form.nom_mat);
      formData.append("desc_mat", form.desc_mat);
      formData.append("stock_mat", String(Number(form.stock_mat) || 0));
      formData.append("stock_min", String(Number(form.stock_min) || 0));
      formData.append("unidad_medida", form.unidad_medida);
      formData.append("costo_mat", String(Number(form.costo_mat) || 0));
      formData.append("est_mat", form.est_mat === "1" ? "1" : "0");
      if (imgFile) {
        formData.append("img_mat", imgFile);
      }

      const res = await fetch("http://localhost:8080/api/materiales", {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
        },
        body: formData,
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = { message: `Error del servidor (${res.status})` };
      }

      if (!res.ok) {
        const { fieldErrors, generalError: genError } =
          parseApiErrors(responseData);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setIsSubmitting(false);
        return;
      }

      setMateriales((prev) => [...prev, responseData]);
      Swal.fire({
        icon: "success",
        title: "¡Material creado!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose();
    } catch (err) {
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({
      nom_mat: "",
      desc_mat: "",
      stock_mat: "",
      stock_min: "",
      unidad_medida: "",
      costo_mat: "",
      est_mat: "1",
    });
    setImgFile(null);
    setValidationErrors(null);
    setGeneralError(null);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6" />
            Nuevo Material
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {(validationErrors || generalError) && (
            <ValidationErrors
              errors={validationErrors}
              generalError={generalError}
              onDismiss={() => {
                setValidationErrors(null);
                setGeneralError(null);
              }}
              className="mb-4"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Package className="w-4 h-4 text-amber-500" />
                Nombre *
              </label>
              <input
                type="text"
                name="nom_mat"
                value={form.nom_mat}
                onChange={handleChange}
                placeholder="Ej: Madera de Pino"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="desc_mat"
                value={form.desc_mat}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Boxes className="w-4 h-4 text-amber-500" />
                Stock
              </label>
              <input
                type="number"
                name="stock_mat"
                value={form.stock_mat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Boxes className="w-4 h-4 text-amber-500" />
                Stock Mínimo
              </label>
              <input
                type="number"
                name="stock_min"
                value={form.stock_min}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Ruler className="w-4 h-4 text-amber-500" />
                Unidad Medida
              </label>
              <input
                type="text"
                name="unidad_medida"
                value={form.unidad_medida}
                onChange={handleChange}
                placeholder="Ej: metros, kg"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                Costo (Bs.)
              </label>
              <input
                type="number"
                step="0.01"
                name="costo_mat"
                value={form.costo_mat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                Estado
              </label>
              <select
                name="est_mat"
                value={form.est_mat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>

            {/* Imagen con diseño drop-zone */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Image className="w-4 h-4 text-amber-500" />
                Imagen del Material
              </label>
              <div
                onClick={() => imgInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  imgFile
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                }`}
              >
                {imgPreview ? (
                  <div className="relative">
                    <img
                      src={imgPreview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgFile(null);
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      {imgFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <UploadCloud className="w-12 h-12 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Haz clic para subir imagen
                    </p>
                    <p className="text-xs text-gray-400">
                      JPG, PNG, GIF (máx. 5MB)
                    </p>
                  </div>
                )}
                <input
                  ref={imgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && setImgFile(e.target.files[0])
                  }
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/30"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
