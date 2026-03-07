import { useState } from "react";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";
    import { sendContacto } from "../../services/Landing";
import { SectionTitle } from "../layout/SectionTitle";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      telefono: formData.get("telefono") || null,
      mensaje: formData.get("mensaje"),
    };

    try {
      setLoading(true);
      await sendContacto(data);
      toast.success('¡Mensaje enviado correctamente! 🎉 Te contactaremos pronto.');
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error('Hubo un problema al enviar el mensaje. 😕');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <SectionTitle
        title="Hablemos de tu proyecto"
        subtitle="Déjanos tus datos y te contactamos en menos de 24h hábiles."
      />
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        <form
          className="bg-white rounded-2xl shadow p-6 grid gap-4"
          onSubmit={handleSubmit}
        >
          <input
            name="nombre"
            required
            minLength={3}
            maxLength={100}
            placeholder="Nombre"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a67c52] outline-none"
          />
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="Correo electrónico"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a67c52] outline-none"
          />
          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono (opcional)"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a67c52] outline-none"
          />
          <textarea
            name="mensaje"
            required
            minLength={20}
            maxLength={1000}
            placeholder="Cuéntanos tu idea, medidas aproximadas y presupuesto"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-[#a67c52] outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#a67c52] hover:bg-[#7c5e3c] text-white px-6 py-3 rounded-lg shadow-md font-semibold transition inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" /> {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        <div className="bg-[#f8f5f0] rounded-2xl p-6">
          <h4 className="font-semibold mb-4">Contacto directo</h4>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-[#7c5e3c]" /> +591 69769286</li>
            <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-[#7c5e3c]" /> bosquejo1@outlook.com</li>
            <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#7c5e3c]" /> La Paz, Bolivia</li>
          </ul>

          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-xl p-4 text-center shadow">
              <div className="font-bold">L–V</div>
              <div className="text-gray-500">09:00–18:00</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow">
              <div className="font-bold">Sáb</div>
              <div className="text-gray-500">09:00–13:00</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow">
              <div className="font-bold">Dom</div>
              <div className="text-gray-500">Cerrado</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
