import { motion } from "framer-motion";
import { ShieldCheck, Ruler, Leaf, Hammer } from "lucide-react";
import { SectionTitle } from "../layout/SectionTitle";
//import { fadeUp } from "../../utils/animations";

const benefitsData = [
  { Icon: ShieldCheck, title: "Garantía real", text: "Cobertura de 3 años en estructura." },
  { Icon: Ruler, title: "A medida", text: "Optimizamos cada centímetro de tu espacio." },
  { Icon: Leaf, title: "Acabados eco", text: "Barnices de baja toxicidad y alto desempeño." },
  { Icon: Hammer, title: "Hecho en Bolivia", text: "Producción local con estándares pro." },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-20">
      <SectionTitle
        title="Beneficios que importan"
        subtitle="Unimos estética, resistencia y precisión para que tu inversión dure."
      />
      <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefitsData.map((b, idx) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center relative overflow-hidden"
          >
            {/* Background Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#a67c52]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-16 h-16 mx-auto bg-[#fdf8f3] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm group-hover:shadow-md">
              <b.Icon className="w-8 h-8 text-[#a67c52]" />
            </div>
            
            <h3 className="font-bold text-xl mb-2 text-gray-800 relative z-10">{b.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed relative z-10">{b.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
