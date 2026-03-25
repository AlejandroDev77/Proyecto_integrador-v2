import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getRedirectRoute } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { LoginResponse } from "../../types/auth";

export function useSignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [code2fa, setCode2fa] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setIsLoading(true);

    try {
      const response = await login(username, password);

      if ("requires_2fa" in response && response.requires_2fa) {
        setTempToken(response.temp_token);
        setShow2FA(true);
        setIsLoading(false);
        return; // Detenemos aquí
      }

      const { token, id_usu, id_rol } = response as LoginResponse;

      setUser(id_usu, id_rol, token);

      const route = await getRedirectRoute(id_rol);
      navigate(route);
    } catch (error: any) {
      setErrors(error.message || "Error al iniciar sesión");
      setIsLoading(false);
    }
  };

  const handleLogin2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setIsLoading(true);

    try {
      // Usamos el servicio nuevo para verificar 2FA
      const { loginWith2fa, getRedirectRoute } = await import("../../services/authService");
      const response = await loginWith2fa(tempToken, code2fa);
      
      const { token, id_usu, id_rol } = response;
      setUser(id_usu, id_rol, token);

      const route = await getRedirectRoute(id_rol);
      navigate(route);
    } catch (error: any) {
      setErrors(error.message || "Código incorrecto");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setErrors("");
    setIsLoading(true);
    
    try {
      const { loginWithGoogle, getRedirectRoute } = await import("../../services/authService");
      const response = await loginWithGoogle(credential);

      if ("requires_2fa" in response && response.requires_2fa) {
        setTempToken(response.temp_token);
        setShow2FA(true);
        setIsLoading(false);
        return; 
      }

      const { token, id_usu, id_rol } = response as LoginResponse;
      setUser(id_usu, id_rol, token);

      const route = await getRedirectRoute(id_rol);
      navigate(route);
    } catch (error: any) {
      setErrors(error.message || "Error al iniciar sesión con Google");
      setIsLoading(false);
    }
  };

  return {
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
  };
}

