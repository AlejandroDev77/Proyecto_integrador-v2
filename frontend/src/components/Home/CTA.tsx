import { Send, Box } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1a1410] via-[#3a2f22] to-[#1a1410] bg-[length:200%_auto] animate-gradient rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          {/* Subtle noise/pattern overlay could go here */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-extrabold mb-3">¿Listo para comenzar tu proyecto?</h3>
            <p className="text-white/80 text-lg">
              Envíanos un croquis o fotos de referencia y te devolvemos una propuesta.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a
              href="#contact"
              className="px-6 py-4 bg-[#a67c52] text-white border border-[#a67c52] rounded-xl font-bold hover:bg-[#8b6914] hover:shadow-[0_0_20px_rgba(166,124,82,0.4)] transition-all inline-flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Solicitar cotización
            </a>
            <a
              href="#products"
              className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <Box className="w-5 h-5" /> Ver catálogo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
