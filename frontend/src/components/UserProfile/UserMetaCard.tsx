// modal/form imports removed — component displays info only
import { useCliente } from "../../hooks/useUserAddress";

type Props = {
  forceLight?: boolean;
};

export default function UserMetaCard({ forceLight = false }: Props) {
  const { usuario, cliente, loading, error, missingCliente } = useCliente();
  // edit modal removed; no save handler
  return (
    <div>
      <div className={`p-5 border border-gray-200 rounded-2xl lg:p-6 ${forceLight ? 'bg-white text-gray-800' : 'dark:border-gray-800'}`}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              {/**
               * Mostrar la imagen del cliente si existe (`cliente.img_cli`).
               * Si `img_cli` es una URL completa la usamos tal cual; si es sólo un nombre de archivo
               * asumimos que está disponible en el backend en `http://localhost:8000/storage/{img}`.
               * En caso de no existir, mostramos la imagen por defecto en `public/images/user/owner.jpg`.
               */}
                <img
                  src={cliente?.img_cli || '../../../public/images/logo/SinPerfil.png'}
                  alt={cliente?.nom_cli ?? 'user'}
                  className="w-full h-full object-cover"
                />
            </div>
            <div className="order-3 xl:order-2">
        {loading ? (
                  <div className="flex items-center justify-center mb-2" role="status" aria-live="polite">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-600 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <h4 className={`${forceLight ? 'text-lg font-semibold text-center text-gray-800 xl:text-left' : 'text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left'}`}>Cargando información del usuario...</h4>
                  </div>
                ) : error ? (
                  <h4 className="mb-2 text-lg font-semibold text-center text-red-600 xl:text-left">{error}</h4>
                ) : cliente ? (
                <>
                  <h4 className={`${forceLight ? 'mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left' : 'mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left'}`}>
                    {cliente.nom_cli} {cliente.ap_pat_cli} {cliente.ap_mat_cli}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:text-left">
                    <p className={`${forceLight ? 'text-sm text-gray-500' : 'text-sm text-gray-500 dark:text-gray-400'}`}>
                      @{usuario?.nom_usu ?? "usuario"}
                    </p>
                  </div>
                </>
                ) : missingCliente ? (
                  <h4 className={`${forceLight ? 'mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left' : 'mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left'}`}>Debes llenar tus datos para comprar un producto.</h4>
                ) : (
                  <h4 className={`${forceLight ? 'mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left' : 'mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left'}`}>Sin datos de usuario</h4>
                )}
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end"></div>
          </div>
        </div>
      </div>
      {/* Modal eliminado — botón Edit permanece visualmente pero sin abrir nada */}
    </div>
  );
}
