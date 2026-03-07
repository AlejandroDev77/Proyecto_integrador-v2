import { Link } from "react-router-dom";
import { useSignIn } from "../../hooks/auth/useSignIn";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    errors,
    isLoading,
    handleLogin,
  } = useSignIn();

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-6" />
          Regresar
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-7">
          <div className="flex justify-center mb-5">
            <img
              src="../../../public/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
              alt="Descripción de la imagen"
              className="h-50 w-300 rounded-full"
            />
          </div>
          <h1 className="mb-5 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
            Iniciar sesión
          </h1>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>
                  Usuario <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Ingresa tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  Contraseña <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
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

              {errors && (
                <p className="text-sm text-red-500 text-center">{errors}</p>
              )}

              <div>
                <Button className="w-full" size="sm" disabled={isLoading}>
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/signup"
              className="text-orange-500 hover:text-orange-600 dark:text-orange-400"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
