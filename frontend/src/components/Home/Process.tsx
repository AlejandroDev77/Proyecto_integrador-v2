import { motion } from "framer-motion";
import { SectionTitle } from "../layout/SectionTitle";

const steps = [
  { t: "Brief & Medidas", d: "Conversamos sobre necesidades, estilos y tomamos medidas exactas." },
  { t: "Modelado 3D", d: "Te mostramos renders y ajustamos hasta que quede perfecto." },
  { t: "Fabricación", d: "Producción con control de calidad en cada pieza." },
  { t: "Entrega & Instalación", d: "Programamos instalación limpia y garantizada." },
];

const Process = () => {
  return (
    <section id="process" className="py-20">
      <SectionTitle
        title="Así trabajamos"
        subtitle="Transparencia en cada etapa, desde la idea hasta la instalación."
      />
      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Animated Background Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#a67c52]/30 to-transparent -translate-x-1/2 rounded-full hidden md:block" />
        
        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Center Node */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-4 border-[#fdf8f3] rounded-full items-center justify-center shadow-xl z-10">
                <div className="w-3 h-3 bg-[#a67c52] rounded-full shadow-[0_0_10px_#a67c52]" />
              </div>
              
              {/* Content Card */}
              <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                  <div className={`text-[#a67c52] font-black text-5xl mb-2 opacity-20 group-hover:opacity-40 transition-opacity ${idx % 2 === 0 ? "" : "md:text-right"}`}>
                    0{idx + 1}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{step.t}</h4>
                  <p className="text-gray-600 leading-relaxed">{step.d}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
