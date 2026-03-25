import { useState } from "react";
import { forgotPassword } from "../../services/authService";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message || "Las instrucciones han sido enviadas a tu correo.");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al enviar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    message,
    error,
    isLoading,
    handleSubmit,
  };
}
