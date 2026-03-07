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
        {benefitsData.map((b) => (
          <motion.div
            key={b.title}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl p-6 shadow text-center"
          >
            <b.Icon className="w-8 h-8 text-[#a67c52] mb-3" />
            <h3 className="font-semibold text-lg mb-1">{b.title}</h3>
            <p className="text-sm text-gray-600">{b.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
