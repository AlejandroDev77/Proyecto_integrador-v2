import { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export function useSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    nom_usu: "",
    email_usu: "",
    pas_usu: "",
    id_rol: 1,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await register(userData);
      setSuccessMessage("Usuario registrado correctamente.");
      setTimeout(() => navigate("/signup"), 1500); // 🔹 redirige al login después de 1.5s
    } catch (error: any) {
      setErrorMessage(error.message || "Hubo un error al registrar el usuario.");
    }
  };

  return {
    userData,
    handleChange,
    handleSubmit,
    showPassword,
    toggleShowPassword,
    errorMessage,
    successMessage,
  };
}
