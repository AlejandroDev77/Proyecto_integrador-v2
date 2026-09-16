import { useState, useRef, useEffect } from "react";


export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShouldShow(Boolean(sessionStorage.getItem("auth_identity")));
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
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const response = await fetch("/api/chat/message", {
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
