import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import PinInput from "../form/input/PinInput";
import Button from "../ui/button/Button";

type Props = {
  forceLight?: boolean;
};

export default function SecurityCard({ forceLight = false }: Props) {
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ qr_code_url: string; secret?: string } | null>(null);
  const [pinCode, setPinCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await axiosClient.get("/api/2fa/status");
      setIs2faEnabled(res.data.is_2fa_enabled);
    } catch (error) {
      console.error("Error al obtener estado 2FA", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleOpenSetup = async () => {
    setActionLoading(true);
    setErrorMsg("");
    setPinCode("");
    try {
      const res = await axiosClient.post("/api/2fa/generate");
      setQrCodeData(res.data);
      setShowModal(true);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Error al generar código QR");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (pinCode.length < 6) {
        setErrorMsg("El código PIN debe tener 6 dígitos.");
        return;
    }
    setActionLoading(true);
    setErrorMsg("");
    try {
      await axiosClient.post("/api/2fa/verify-and-enable", { code: pinCode });
      setIs2faEnabled(true);
      setShowModal(false);
      setSuccessMsg("¡Autenticación de 2 Factores habilitada correctamente!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Código incorrecto. Intenta de nuevo.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!window.confirm("¿Seguro que deseas desactivar la capa extra de seguridad (2FA)?")) return;
    
    setActionLoading(true);
    try {
      await axiosClient.post("/api/2fa/disable");
      setIs2faEnabled(false);
      setSuccessMsg("La seguridad de 2 Factores ha sido deshabilitada.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Error al deshabilitar 2FA");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={`p-5 border border-gray-200 rounded-2xl lg:p-6 mb-6 ${forceLight ? "bg-white text-gray-800" : "dark:border-gray-800"}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h4 className={`text-lg font-semibold ${forceLight ? "text-gray-800" : "text-gray-800 dark:text-white/90"} mb-2`}>
            Seguridad Avanzada (2FA)
          </h4>
          <p className="text-sm text-gray-500 max-w-lg">
            Añade una capa extra de seguridad a tu cuenta pidiendo no solo tu contraseña,
            sino también un código PIN dinámico generado en tu celular.
          </p>
          {successMsg && <p className="text-green-500 text-sm mt-2">{successMsg}</p>}
          {errorMsg && !showModal && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
        </div>
        
        <div className="flex-shrink-0">
          {loading ? (
             <span className="text-gray-400 text-sm">Cargando...</span>
          ) : is2faEnabled ? (
            <Button onClick={handleDisable} size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" disabled={actionLoading}>
              {actionLoading ? "Desactivando..." : "Desactivar 2FA"}
            </Button>
          ) : (
            <Button onClick={handleOpenSetup} size="sm" className="bg-orange-500 hover:bg-orange-600 border-none text-white" disabled={actionLoading}>
              {actionLoading ? "Generando QR..." : "Habilitar 2FA"}
            </Button>
          )}
        </div>
      </div>

      {showModal && qrCodeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 text-center">Configurar 2FA</h3>
             <p className="text-sm text-gray-500 mb-4 text-center">
               1. Descarga <b>Google Authenticator</b> o <b>Authy</b>.<br/>
               2. Escanea este código QR con la aplicación.
             </p>

             <div className="flex justify-center mb-4">
               <img src={qrCodeData.qr_code_url} alt="QR Code" className="w-48 h-48 border rounded-lg shadow-sm" />
             </div>
             
             <p className="text-center text-xs text-gray-400 mb-4 break-all">
                Si no puedes escanear el QR, ingresa este código manualmente:<br/>
                <span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 mt-1 inline-block rounded text-gray-800 dark:text-gray-200">
                  {qrCodeData.secret}
                </span>
             </p>

             <div className="space-y-4">
               <div>
                 <PinInput
                   value={pinCode}
                   onChange={setPinCode}
                   isLoading={actionLoading}
                 />
                 {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
               </div>
               
               <div className="flex gap-3">
                 <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                   Cancelar
                 </Button>
                 <Button onClick={handleVerifyAndEnable} disabled={actionLoading} className="flex-1 bg-orange-500 hover:bg-orange-600 border-none text-white">
                   {actionLoading ? "Verificando..." : "Confirmar"}
                 </Button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
