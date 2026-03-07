import { Send, Box } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#a67c52] to-[#7c5e3c] rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold">¿Listo para comenzar tu proyecto?</h3>
            <p className="text-white/90">
              Envíanos un croquis o fotos de referencia y te devolvemos una propuesta.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="#contact"
              className="px-5 py-3 bg-white text-[#7c5e3c] rounded-xl font-semibold hover:bg-white/90 transition inline-flex items-center gap-2"
            >
              <Send className="w-5 h-5" /> Solicitar cotización
            </a>
            <a
              href="#products"
              className="px-5 py-3 border border-white/70 rounded-xl font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
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
