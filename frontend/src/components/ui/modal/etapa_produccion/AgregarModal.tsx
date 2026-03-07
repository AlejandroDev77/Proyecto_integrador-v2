import { useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import { Layers, X, Save, Clock, ListOrdered, FileText } from "lucide-react";

interface EtapaProduccion {
  id_eta: number;
  nom_eta: string;
  desc_eta: string;
  duracion_estimada: number;
  orden_secuencia: number;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setEtapasProducciones: React.Dispatch<
    React.SetStateAction<EtapaProduccion[]>
  >;
}

export default function ModalAgregarEtapaProduccion({
  showModal,
  setShowModal,
  setEtapasProducciones,
}: Props) {
  const [form, setForm] = useState({
    nom_eta: "",
    desc_eta: "",
    duracion_estimada: "",
    orden_secuencia: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nom_eta) {
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
      const res = await fetch("http://localhost:8000/api/etapa-produccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
        },
        body: JSON.stringify({
          ...form,
          duracion_estimada: Number(form.duracion_estimada) || 0,
          orden_secuencia: Number(form.orden_secuencia) || 0,
        }),
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

      setEtapasProducciones((prev) => [
        ...prev,
        responseData?.data ?? responseData,
      ]);
      Swal.fire({
        icon: "success",
        title: "¡Etapa creada!",
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
      nom_eta: "",
      desc_eta: "",
      duracion_estimada: "",
      orden_secuencia: "",
    });
    setValidationErrors(null);
    setGeneralError(null);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Layers className="w-6 h-6" />
            Nueva Etapa
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
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
                <Layers className="w-4 h-4 text-cyan-500" />
                Nombre *
              </label>
              <input
                type="text"
                name="nom_eta"
                value={form.nom_eta}
                onChange={handleChange}
                placeholder="Ej: Corte de Madera"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                Duración (horas)
              </label>
              <input
                type="number"
                name="duracion_estimada"
                value={form.duracion_estimada}
                onChange={handleChange}
                placeholder="Ej: 2"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ListOrdered className="w-4 h-4 text-cyan-500" />
                Orden
              </label>
              <input
                type="number"
                name="orden_secuencia"
                value={form.orden_secuencia}
                onChange={handleChange}
                placeholder="Ej: 1"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-cyan-500" />
                Descripción
              </label>
              <textarea
                name="desc_eta"
                value={form.desc_eta}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
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
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-cyan-600/30"
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
