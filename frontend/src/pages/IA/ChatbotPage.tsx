import React from "react";
import { useChatbot } from "../../hooks/chatbot/useChatbot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatbotPage: React.FC = () => {
  const {
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
  } = useChatbot();

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
    <div className="h-[calc(100vh-80px)] w-full bg-gray-50/50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="flex flex-col w-full h-full max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-sans antialiased">
        {/* Header (Minimalist & Clean) */}
        <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-600/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="m-0 text-xl font-bold text-gray-800 tracking-tight">Asistente IA Integral</h2>
            <span className="text-[0.8rem] text-gray-500 font-medium mt-0.5">Potenciado por Qwen 2.5 • Siempre disponible</span>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-gradient-to-b from-gray-50/50 to-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
            <div className="w-24 h-24 mb-5 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 className="text-gray-800 font-bold text-3xl mb-3 tracking-tight">¡Hola de nuevo!</h3>
            <p className="text-gray-500 text-lg max-w-lg leading-relaxed">Soy el asistente inteligente de la empresa. Estoy aquí para analizar datos, consultar inventarios, generar gráficas y ayudarte a tomar mejores decisiones.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex max-w-[85%] ${msg.sender === "user" ? "self-end" : "self-start"} group`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3 mt-1.5 shrink-0 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
            )}
            <div 
              className={`px-6 py-4 text-[1.05rem] leading-relaxed break-words shadow-sm ${
                msg.sender === "user" 
                  ? "bg-indigo-600 text-white rounded-3xl rounded-tr-sm shadow-indigo-600/20" 
                  : "bg-white text-gray-700 border border-gray-100 rounded-3xl rounded-tl-sm shadow-gray-200/40"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <img {...props} className="max-w-full rounded-2xl mt-4 shadow-md border border-gray-100 hover:scale-[1.01] transition-transform duration-300" style={{ maxHeight: '400px', objectFit: 'contain' }} alt={props.alt || "Gráfica"} />
                  ),
                  p: ({ node, ...props }) => <p {...props} className="m-0 mb-3 last:mb-0" />,
                  ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 m-0 mb-3 space-y-2" />,
                  ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 m-0 mb-3 space-y-2" />,
                  li: ({ node, ...props }) => <li {...props} className="mb-1" />,
                  strong: ({ node, ...props }) => <strong {...props} className={`font-semibold ${msg.sender === 'user' ? 'text-indigo-100' : 'text-gray-900'}`} />,
                  table: ({ node, ...props }) => <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4 mb-3 shadow-sm"><table {...props} className="w-full text-left border-collapse text-[0.95rem] bg-white" /></div>,
                  th: ({ node, ...props }) => <th {...props} className="border-b border-gray-200 bg-gray-50 py-3 px-4 font-semibold text-gray-700 uppercase tracking-wider text-[0.8rem]" />,
                  td: ({ node, ...props }) => <td {...props} className="border-b border-gray-100 py-3 px-4 text-gray-600" />,
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
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3 mt-1.5 shrink-0 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="px-6 py-5 rounded-3xl bg-white border border-gray-100 rounded-tl-sm shadow-sm flex items-center gap-2 h-12">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100 flex gap-4 shrink-0 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe aquí tu consulta o pide un reporte de ventas..."
          disabled={isLoading}
          className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-[1.05rem] text-gray-700 placeholder:text-gray-400 transition-all duration-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50"
        />
        <button 
          onClick={handleSendMessage} 
          disabled={isLoading || !inputValue.trim()}
          className="w-14 h-14 rounded-2xl bg-indigo-600 text-white border-none flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 ml-1">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
    </div>
  );
};

export default ChatbotPage;
