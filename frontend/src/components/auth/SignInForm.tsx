import { Link } from "react-router-dom";
import { useSignIn } from "../../hooks/auth/useSignIn";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon, UserIcon, LockIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import PinInput from "../form/input/PinInput";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../ui/button/Button";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full">
      <div className="mb-4">
        <div className="mb-4 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-[#a67c52] dark:text-gray-400 dark:hover:text-[#d4b48f] group bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700"
          >
            <ChevronLeftIcon className="size-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Volver
          </Link>
        </div>
        
        <div className="pt-0 text-center">
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-1">
            ¡Qué bueno verte!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">
            Ingresa tus credenciales para acceder a tu cuenta.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {show2FA ? (
          <motion.form 
            key="2fa-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleLogin2FA}
          >
            <div className="space-y-4">
              <div className="text-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800/30">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Ingresa el PIN de 6 dígitos de tu Google Authenticator.
                </p>
              </div>
              <div className="group relative">
                <Label>PIN <span className="text-red-500">*</span></Label>
                <div className="transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(166,124,82,0.3)] rounded-lg">
                  <PinInput value={code2fa} onChange={setCode2fa} isLoading={isLoading} />
                </div>
              </div>
              {errors && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500 font-semibold text-center">{errors}</motion.p>
              )}
              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full relative overflow-hidden bg-gradient-to-r from-[#3a2f22] to-[#5c4a36] text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold group disabled:opacity-70 disabled:cursor-not-allowed">
                  <span className="relative z-10">{isLoading ? "Verificando..." : "Verificar"}</span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </div>
              <div className="text-center mt-2">
                <button type="button" onClick={() => setShow2FA(false)} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.form 
            key="login-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleLogin}
          >
            <div className="space-y-4">
              <div className="group">
                <Label>Usuario <span className="text-red-500">*</span></Label>
                <div className="transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(166,124,82,0.2)] rounded-lg">
                  <Input placeholder="Ingresa tu usuario" value={username} onChange={(e: any) => setUsername(e.target.value)} icon={<UserIcon />} />
                </div>
              </div>

              <div className="group">
                <Label>Contraseña <span className="text-red-500">*</span></Label>
                <div className="relative transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(166,124,82,0.2)] rounded-lg">
                  <Input type={showPassword ? "text" : "password"} placeholder="Ingresa tu contraseña" value={password} onChange={(e: any) => setPassword(e.target.value)} icon={<LockIcon />} />
                  <span onClick={toggleShowPassword} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 p-1">
                    {showPassword ? <EyeIcon className="fill-gray-400 size-5 hover:fill-[#a67c52] transition-colors" /> : <EyeCloseIcon className="fill-gray-400 size-5 hover:fill-[#a67c52] transition-colors" />}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-[#a67c52] border-gray-300 rounded focus:ring-[#a67c52] dark:bg-gray-800 dark:border-gray-600 transition-colors" />
                  <label htmlFor="rememberMe" className="text-xs font-medium text-gray-600 dark:text-gray-300 select-none cursor-pointer">Recuérdame</label>
                </div>
                <Link to="/forgot-password" className="text-xs font-bold text-[#a67c52] hover:text-[#8b6842] dark:text-[#d4b48f] transition-colors">¿Olvidaste tu contraseña?</Link>
              </div>

              {errors && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500 font-semibold text-center bg-red-50 py-1.5 rounded-lg">{errors}</motion.p>
              )}

              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full relative overflow-hidden bg-gradient-to-r from-[#3a2f22] to-[#5c4a36] text-white px-6 py-2.5 rounded-xl shadow-[0_8px_20px_rgba(166,124,82,0.3)] hover:shadow-[0_8px_25px_rgba(166,124,82,0.5)] hover:-translate-y-0.5 transition-all duration-300 font-bold text-base group disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                  <span className="relative z-10">{isLoading ? "Ingresando..." : "Ingresar"}</span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex items-center my-5">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-transparent">O ingresa con</span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>
      
      <div className="flex justify-center mb-4 drop-shadow-sm hover:drop-shadow-md transition-shadow">
        <GoogleLogin text="signin_with" shape="pill" size="medium" onSuccess={(res) => res.credential && handleGoogleLogin(res.credential)} onError={() => console.log('Login Failed')} />
      </div>

      <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
        ¿No tienes una cuenta? <Link to="/signup" className="font-bold text-[#a67c52] hover:text-[#8b6842] dark:text-[#d4b48f] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#a67c52] hover:after:w-full after:transition-all">Regístrate ahora</Link>
      </div>
    </div>
  );
}
