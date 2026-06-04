import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { SectionTitle } from "../layout/SectionTitle";
import { Link } from "react-router-dom";
import type { ProductViewModel } from "../../services/products/types";

interface ProductsProps {
  products: ProductViewModel[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scrollNext = () => {
    if (scrollRef.current) {
      const child = scrollRef.current.firstElementChild as HTMLElement;
      if (!child) return;
      const scrollAmount = child.clientWidth + 24; // width + gap-6 (24px)
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      const child = scrollRef.current.firstElementChild as HTMLElement;
      if (!child) return;
      const scrollAmount = child.clientWidth + 24;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (products.length === 0 || isHovered) return;
    
    const interval = setInterval(() => {
      scrollNext();
    }, 4000); // Rota cada 4 segundos

    return () => clearInterval(interval);
  }, [products, isHovered]);

  return (
    <section
      id="products"
      className="bg-gradient-to-b from-[#faf8f5] to-white py-24"
    >
      <SectionTitle
        title="Productos Destacados"
        subtitle="Descubre nuestra selección exclusiva de muebles artesanales de alta calidad."
      />
      <div className="max-w-[1250px] mx-auto px-6 relative">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Cargando productos...</p>
          </div>
        ) : (
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Botón Izquierda */}
            <button 
              onClick={scrollPrev}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-100 text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Contenedor del Carrusel */}
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-10 pt-4 px-2" 
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
              
              {products.map((prod, index) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  // snap-start asegura que se alinee perfectamente al borde izquierdo sin cortarse
                  className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[380px] group bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-50"
                >
                  <div className="relative h-[250px] overflow-hidden bg-gray-100">
                    <img
                      src={prod.img}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-bold text-[#a67c52] tracking-wider uppercase mb-2 block">
                      {prod.category}
                    </span>
                    <h3 className="font-extrabold text-2xl text-gray-900 mb-3 line-clamp-1">
                      {prod.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {prod.desc ||
                        "Mueble artesanal con acabados premium. Su diseño ha sido cuidadosamente elaborado para brindarte el mejor confort y estilo en tu hogar."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Botón Derecha */}
            <button 
              onClick={scrollNext}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-100 text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3a2f22] to-[#5c4a36] text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-semibold text-lg group"
          >
            Ver catálogo completo
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
