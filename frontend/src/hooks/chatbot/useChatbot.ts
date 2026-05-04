import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  id_rol: number;
  id_usu: number;
  nom_usu: string;
  email_usu: string;
}


export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Decodificar el token para ver si es el rol 1 o 2
    const token = localStorage.getItem("token");
    if (!token) {
      setShouldShow(false); // Ocultar para visitantes
      return;
    }
    
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      if (decoded.id_rol === 1 || decoded.id_rol === 2) {
        setShouldShow(true);
      } else {
        setShouldShow(false);
      }
    } catch (e) {
      setShouldShow(false);
    }
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token"); // Ajusta esto según cómo guardes tu JWT
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:8080/api/chat/message", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: newUserMessage.text }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.reply || data.output || data.text || "Lo siento, no pude procesar tu solicitud.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Hubo un error de conexión con el servidor. Inténtalo más tarde.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return {
    isOpen,
    shouldShow,
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    toggleChat,
    setInputValue,
    handleSendMessage,
    handleKeyPress
  };
};
