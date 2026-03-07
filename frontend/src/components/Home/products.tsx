import { motion } from "framer-motion";
import { ChevronRight, Eye, ShoppingCart, Heart, Star } from "lucide-react";
import { SectionTitle } from "../layout/SectionTitle";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  img: string;
  category: string;
  price: string;
  desc?: string;
}

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <section
      id="products"
      className="bg-gradient-to-b from-[#faf8f5] to-white py-24"
    >
      <SectionTitle
        title="Productos Destacados"
        subtitle="Descubre nuestra selección exclusiva de muebles artesanales de alta calidad."
      />
      <div className="max-w-7xl mx-auto px-6">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#f3e7d7] rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-[#a67c52]" />
            </div>
            <p className="text-gray-500 text-lg">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod, index) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={prod.img}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-[#7c5e3c] shadow-md">
                      {prod.category}
                    </span>
                  </div>

                  {/* Floating Actions - appear on hover */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <button className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-[#a67c52] hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-[#a67c52] hover:text-white transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick View Button */}
                  <Link
                    to="/products"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm text-[#7c5e3c] px-6 py-2.5 rounded-full font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-[#a67c52] hover:text-white flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Vista rápida
                  </Link>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(24)</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl text-[#3a2f22] mb-2 line-clamp-1">
                    {prod.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {prod.desc ||
                      "Mueble artesanal de alta calidad con acabados premium y diseño moderno."}
                  </p>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-[#a67c52]">
                        {prod.price}
                      </span>
                    </div>
                    <Link
                      to="/products"
                      className="flex items-center gap-2 bg-gradient-to-r from-[#a67c52] to-[#8b6842] hover:from-[#8b6842] hover:to-[#7c5e3c] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Ver más
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
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
