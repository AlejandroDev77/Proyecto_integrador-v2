import React, { useState } from "react";
import { useLocation } from "react-router";
import { useChatbot } from "../../../hooks/chatbot/useChatbot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chatbot: React.FC = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const location = useLocation();
  const {
    isOpen,
    shouldShow,
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    toggleChat,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
  } = useChatbot();

  React.useEffect(() => {
    const handleOpenChatbot = () => {
      setIsButtonVisible(true);
      // Si ya está abierto, no hacemos nada (toggleChat lo cerraría)
      if (!isOpen) {
        toggleChat();
      }
    };
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, [isOpen, toggleChat]);

  if (!shouldShow || location.pathname === "/chatbot") return null;

  // Función para codificar URLs problemáticas (como QuickChart) antes de renderizar
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    let processedText = text.replace(/!\[([^\]]*)\]\(<([^>]+)>\)|!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt1, url1, alt2, url2) => {
      const alt = alt1 || alt2 || "Imagen";
      let url = url1 || url2;
      
      // Si es de quickchart, nos aseguramos de codificar los caracteres raros
      if (url.includes("quickchart.io")) {
        // Reemplazar llaves y comillas simples que rompen el parser de markdown
        url = url.replace(/{/g, "%7B")
                 .replace(/}/g, "%7D")
                 .replace(/'/g, "%27")
                 .replace(/"/g, "%22")
                 .replace(/ /g, "%20")
                 .replace(/\[/g, "%5B")
                 .replace(/\]/g, "%5D");
      }
      return `![${alt}](${url})`;
    });

    // Inyectar token en los enlaces de descarga de reportes
    const token = localStorage.getItem('token') || '';
    if (token) {
      // Reemplaza el marcador TU_TOKEN si la IA lo dejó
      processedText = processedText.replace(/token=TU_TOKEN/g, `token=${token}`);
      // Y si la IA no puso token, lo agregamos a la fuerza
      processedText = processedText.replace(/(\/api\/reportes\/dashboard\/pdf\?[^)]+)\)/g, (match, url) => {
        if (!url.includes('token=')) {
          return `${url}&token=${token})`;
        }
        return match;
      });
    }

    return processedText;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased">
      {/* Ventana del Chat */}
      <div 
        className={`absolute bottom-20 right-0 w-[360px] sm:w-[400px] h-[600px] max-h-[calc(100vh-100px)] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden origin-bottom-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-12 pointer-events-none"
        }`}
      >
        {/* Header (Minimalist & Clean) */}
        <div className="bg-white/80 backdrop-blur-md px-6 py-5 flex justify-between items-center border-b border-gray-100 z-10 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-600/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h3 className="m-0 text-[1.1rem] font-bold text-gray-800 tracking-tight">Asistente IA</h3>
              <span className="text-[0.75rem] text-gray-500 font-medium">Siempre en línea</span>
            </div>
          </div>
          <button 
            onClick={toggleChat} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 border-none text-gray-400 hover:text-gray-700 cursor-pointer transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 bg-gradient-to-b from-gray-50/50 to-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h4 className="text-gray-800 font-bold text-lg mb-1.5 tracking-tight">¡Hola!</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Soy la IA de la tienda. Pregúntame sobre ventas, reportes o inventario.</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex max-w-[85%] ${msg.sender === "user" ? "self-end" : "self-start"} group`}
            >
              {msg.sender === "bot" && (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
              )}
              <div 
                className={`px-4 py-3 text-[0.95rem] leading-relaxed break-words shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-600/20" 
                    : "bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-sm shadow-gray-200/40"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img {...props} className="max-w-full rounded-xl mt-3 shadow-md border border-gray-100" style={{ maxHeight: '220px', objectFit: 'contain' }} alt={props.alt || "Gráfica"} />
                    ),
                    p: ({ node, ...props }) => <p {...props} className="m-0 mb-2 last:mb-0" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 m-0 mb-2 space-y-1" />,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 m-0 mb-2 space-y-1" />,
                    li: ({ node, ...props }) => <li {...props} className="mb-1" />,
                    strong: ({ node, ...props }) => <strong {...props} className={`font-semibold ${msg.sender === 'user' ? 'text-indigo-100' : 'text-gray-900'}`} />,
                    table: ({ node, ...props }) => <div className="overflow-x-auto rounded-xl border border-gray-200 mt-3 mb-2 shadow-sm"><table {...props} className="w-full text-left border-collapse text-[0.85rem] bg-white" /></div>,
                    th: ({ node, ...props }) => <th {...props} className="border-b border-gray-200 bg-gray-50 py-2.5 px-3 font-semibold text-gray-700 uppercase tracking-wider text-[0.75rem]" />,
                    td: ({ node, ...props }) => <td {...props} className="border-b border-gray-100 py-2.5 px-3 text-gray-600" />,
                    a: ({ node, ...props }) => <a {...props} className={`${msg.sender === 'user' ? 'text-indigo-200' : 'text-indigo-600'} hover:underline font-medium`} target="_blank" rel="noopener noreferrer" />,
                  }}
                >
                  {formatMarkdown(msg.text)}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex max-w-[85%] self-start">
               <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 rounded-tl-sm shadow-sm flex items-center gap-1.5 h-10">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0 z-10 rounded-b-3xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-[0.95rem] text-gray-700 placeholder:text-gray-400 transition-all duration-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
            className="w-12 h-12 rounded-2xl bg-indigo-600 text-white border-none flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-0.5 relative left-[1px]">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* Botón flotante y su contenedor */}
      <div className={`fixed bottom-6 right-6 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isButtonVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0 pointer-events-none'}`}>
        <button 
          className={`w-16 h-16 rounded-full bg-indigo-600 text-white border-none shadow-[0_8px_30px_rgba(79,70,229,0.4)] cursor-pointer flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 ${
            isOpen ? "scale-50 opacity-0 pointer-events-none rotate-90" : "scale-100 opacity-100 rotate-0"
          }`} 
          onClick={toggleChat}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 drop-shadow-md">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"></circle>
            <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"></circle>
          </svg>
          {/* Indicador de notificación */}
          {!isOpen && messages.length === 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        {/* X sutil para ocultar el botón por completo */}
        {!isOpen && (
          <button
            onClick={() => setIsButtonVisible(false)}
            className="absolute -top-1 -right-1 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-400 hover:text-gray-800 hover:bg-white flex items-center justify-center border border-gray-100 transition-all duration-200 z-10 hover:scale-110"
            title="Ocultar asistente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      {/* Flechita para volver a mostrar el botón */}
      <button
        onClick={() => setIsButtonVisible(true)}
        className={`fixed bottom-10 right-0 w-8 h-16 bg-white/95 backdrop-blur-md border border-r-0 border-gray-200 shadow-[-5px_0_25px_rgba(0,0,0,0.08)] text-indigo-600 rounded-l-2xl flex items-center justify-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:w-10 hover:bg-indigo-50 z-[9998] group ${
          !isButtonVisible ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        title="Mostrar asistente"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 -ml-1 transition-transform group-hover:-translate-x-1">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Chatbot;
