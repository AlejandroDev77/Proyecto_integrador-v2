import { Link } from "react-router-dom";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function ResetPasswordForm() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    toggleShowPassword,
    message,
    error,
    isLoading,
    handleSubmit,
    token
  } = useResetPassword();

  // Validar si la URL no trajo un Token
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto pt-20">
        <h1 className="mb-4 text-2xl font-bold text-red-500">Enlace Inválido</h1>
        <p className="text-gray-500 text-center mb-6">Parece que no tienes un token válido en la URL o tu enlace ha caducado.</p>
        <Link to="/forgot-password">
          <Button className="bg-orange-500 hover:bg-orange-600 border-none">Volver a intentar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-6" />
          Volver a iniciar sesión
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-7">
          <h1 className="mb-5 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
            Crea una nueva contraseña
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Tu contraseña debe ser diferente a las anteriores y tener al menos 8 caracteres.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Nueva Contraseña */}
              <div>
                <Label>
                  Nueva Contraseña <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={toggleShowPassword}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <Label>
                  Confirmar Contraseña <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {message && <p className="text-sm text-green-500 text-center">{message}</p>}

              <div className="pt-2">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 border-none" size="sm" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Restablecer Contraseña"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
