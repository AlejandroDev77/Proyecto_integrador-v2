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
      <div className="max-w-4xl mx-auto px-6">
        <ol className="relative border-s border-[#e8dcc7]">
          {steps.map((step, idx) => (
            <motion.li
              key={step.t}
              className="mb-10 ms-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute w-3 h-3 rounded-full bg-[#a67c52] -start-1.5 mt-2"/>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 + 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold">{idx + 1}. {step.t}</h4>
                <p className="text-gray-600 text-sm mt-1">{step.d}</p>
              </motion.div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process;
