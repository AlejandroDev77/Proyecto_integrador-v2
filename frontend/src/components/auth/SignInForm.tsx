import { Link } from "react-router-dom";
import { useSignIn } from "../../hooks/auth/useSignIn";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon, UserIcon, LockIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import PinInput from "../form/input/PinInput";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    rememberMe,
    setRememberMe,
    errors,
    isLoading,
    handleLogin,
    show2FA,
    setShow2FA,
    code2fa,
    setCode2fa,
    handleLogin2FA,
    handleGoogleLogin
  } = useSignIn();

  return (
    <div className="w-full animate-fade-in-up">
      <div className="mb-8">
        <div className="mb-8 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 group"
          >
            <ChevronLeftIcon className="size-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Volver a la tienda
          </Link>
        </div>
        
        <div className="pt-2">
          {/* Logo visible solo en escritorio dentro del formulario si se desea, o quitamos el mx-auto */}
          <img
            src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
            alt="Bosquejo Logo"
            className="h-20 mb-6 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
            ¡Qué bueno verte!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Ingresa tus credenciales para acceder a tu cuenta.
          </p>
        </div>
      </div>

      {show2FA ? (
        <form onSubmit={handleLogin2FA}>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Ingresa el código PIN de 6 dígitos que aparece en tu Google Authenticator.
                  </p>
                </div>
                <div>
                  <Label>
                    Código PIN <span className="text-error-500">*</span>
                  </Label>
                  <PinInput
                    value={code2fa}
                    onChange={setCode2fa}
                    isLoading={isLoading}
                  />
                </div>
                {errors && (
                  <p className="text-sm text-red-500 text-center">{errors}</p>
                )}
                <div className="pt-2">
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? "Verificando..." : "Verificar Código"}
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setShow2FA(false)} className="text-sm text-gray-400 hover:text-gray-600">
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Usuario <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Ingresa tu nombre de usuario"
                    value={username}
                    onChange={(e: any) => setUsername(e.target.value)}
                    icon={<UserIcon />}
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
                      onChange={(e: any) => setPassword(e.target.value)}
                      icon={<LockIcon />}
                    />
                    <span
                      onClick={toggleShowPassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5 hover:text-orange-500 transition-colors" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5 hover:text-orange-500 transition-colors" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                    <label htmlFor="rememberMe" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                      Recuérdame
                    </label>
                  </div>
                  
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {errors && (
                  <p className="text-sm text-red-500 text-center">{errors}</p>
                )}

                <div className="pt-2">
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? "Ingresando..." : "Ingresar"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-3 text-sm text-gray-400 dark:text-gray-500">O ingresa con</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          
          <div className="flex justify-center mb-6">
            <GoogleLogin
                text="signin_with"
                shape="pill"
                width="100%"
                size="large"
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleLogin(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
            />
          </div>

          <div className="mt-6 text-sm text-center text-gray-700 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400"
            >
              Regístrate
            </Link>
          </div>
    </div>
  );
}
