const Footer = () => (
  <footer className="bg-[#3a2f22] text-white py-10">
    <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-semibold mb-3">Bosquejo</h3>
        <p className="text-sm text-gray-300">Muebles personalizados en madera e hierro forjado.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Enlaces</h4>
        <ul className="space-y-2 text-gray-300">
          <li><a href="#products">Productos</a></li>
          <li><a href="#benefits">Beneficios</a></li>
          <li><a href="#process">Proceso</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Políticas</h4>
        <ul className="space-y-2 text-gray-300">
          <li><a href="#">Términos y condiciones</a></li>
          <li><a href="#">Garantías</a></li>
          <li><a href="#">Privacidad</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Contacto</h4>
        <p className="text-gray-300 text-sm">bosquejo1@outlook.com</p>
        <p className="text-gray-300 text-sm">📞 +591 777-00000</p>
        <p className="text-gray-300 text-sm">📍 La Paz, Bolivia</p>
      </div>
    </div>
    <div className="text-center mt-8 text-sm text-gray-400">© 2025 Bosquejo - Muebles a tu medida</div>
  </footer>
);

export default Footer;
