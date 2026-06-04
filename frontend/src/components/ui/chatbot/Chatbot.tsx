import React from "react";
import { useChatbot } from "../../../hooks/chatbot/useChatbot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chatbot: React.FC = () => {
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

  if (!shouldShow) return null;

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
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Ventana del Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] sm:w-[350px] h-[450px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 origin-bottom-right transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-5 py-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-90">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3 className="m-0 text-lg font-semibold tracking-wide">Asistente</h3>
            </div>
            <button 
              onClick={toggleChat} 
              className="bg-transparent border-none text-white text-2xl cursor-pointer leading-none p-0 opacity-80 hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-stone-50 scrollbar-thin scrollbar-thumb-amber-700/20 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex max-w-[85%] ${msg.sender === "user" ? "self-end" : "self-start"}`}
              >
                <div 
                  className={`px-3.5 py-2.5 rounded-[18px] text-[0.95rem] leading-relaxed break-words shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-amber-700 text-white rounded-br-sm" 
                      : "bg-white text-stone-700 border border-stone-200 rounded-bl-sm"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ node, ...props }) => (
                        <img {...props} className="max-w-full rounded-md mt-2 bg-white" style={{ maxHeight: '200px', objectFit: 'contain' }} alt={props.alt || "Gráfica generada por IA"} />
                      ),
                      p: ({ node, ...props }) => <p {...props} className="m-0 mb-2 last:mb-0 leading-relaxed" />,
                      ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 m-0 mb-2" />,
                      ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 m-0 mb-2" />,
                      li: ({ node, ...props }) => <li {...props} className="mb-1" />,
                      strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto"><table {...props} className="w-full text-left border-collapse my-2 text-[0.85rem] bg-white/50 rounded-sm" /></div>,
                      th: ({ node, ...props }) => <th {...props} className="border-b border-stone-300 py-1.5 px-2 font-semibold" />,
                      td: ({ node, ...props }) => <td {...props} className="border-b border-stone-200 py-1 px-2" />,
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
                 <div className="px-4 py-3 rounded-[18px] bg-white border border-stone-200 rounded-bl-sm shadow-sm flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce"></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-stone-200 flex gap-2 shrink-0 z-10">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe un mensaje..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-stone-200 rounded-full outline-none text-[0.95rem] transition-colors focus:border-amber-700 focus:ring-1 focus:ring-amber-700 disabled:bg-stone-50"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="bg-amber-700 text-white border-none rounded-full px-4 font-medium cursor-pointer transition-colors hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-0.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante para abrir/cerrar el chat */}
      <button 
        className={`w-[55px] h-[55px] rounded-full bg-gradient-to-r from-amber-700 to-amber-900 text-white border-none shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-105 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`} 
        onClick={toggleChat}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  );
};

export default Chatbot;
