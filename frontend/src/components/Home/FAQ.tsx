import { ChevronDown } from "lucide-react";
import { SectionTitle } from "../layout/SectionTitle";

const faqs = [
  { q: "¿Puedo solicitar un diseño 100% a medida?", a: "Sí. Partimos de tus medidas, referencias y un presupuesto objetivo." },
  { q: "¿Cuál es el tiempo de entrega?", a: "De 7 a 25 días según complejidad y disponibilidad." },
  { q: "¿Trabajan con hierro forjado?", a: "Sí, integramos madera + hierro para estructuras robustas y estéticas." },
  { q: "¿Incluye instalación?", a: "Sí, en la ciudad. Para otras zonas, coordinamos logística." },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-[#f8f5f0]">
      <SectionTitle
        title="Preguntas frecuentes"
        subtitle="Si tienes otra duda, escríbenos por WhatsApp o correo."
      />
      <div className="max-w-3xl mx-auto px-6 space-y-4">
        {faqs.map((item, i) => (
          <details key={i} className="group bg-white rounded-xl p-5 shadow">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <span className="font-medium">{item.q}</span>
              <ChevronDown className="w-5 h-5 transition group-open:rotate-180" />
            </summary>
            <p className="text-gray-600 mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
