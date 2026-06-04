import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Box, Send, Sparkles } from "lucide-react";
import { fadeUp } from "../../utils/animations";
import { MuebleModel } from "../../models/MuebleModel";

const Hero = () => {
  return (
    <section id="hero" className="relative max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-20 grid md:grid-cols-2 gap-12 items-center overflow-visible">
      {/* Aurora Background Effect for the whole section */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none" />
      <motion.div {...fadeUp} className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3e7d7] text-[#7c5e3c] text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4"/> 
          Diseño + Fabricación a medida
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900"
        >
          Muebles que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67c52] to-[#d4b48f]">transforman</span> <br className="hidden md:block"/> tu espacio
        </motion.h1>

        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Modelamos en 3D, producimos con materiales premium y entregamos listos para usar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a 
            href="#products" 
            className="bg-[#a67c52] hover:bg-[#7c5e3c] text-white px-6 py-3 rounded-xl shadow-md font-semibold transition inline-flex items-center gap-2"
          >
            <Box className="w-5 h-5"/>
            Explorar productos
          </a>
          <a 
            href="#contact"
            className="border border-[#a67c52] text-[#7c5e3c] hover:bg-[#fdf8f3] px-6 py-3 rounded-xl shadow font-semibold transition inline-flex items-center gap-2"
          >
            <Send className="w-5 h-5"/>
            Cotizar ahora
          </a>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-6 mt-10">
          {[
            {k:"+150",l:"Proyectos"},
            {k:"7 días",l:"Lead time mínimo"},
            {k:"3 años",l:"Garantía"}
          ].map((s, idx)=> (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              key={s.l} 
              className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl font-black text-[#a67c52] drop-shadow-sm">{s.k}</div>
              <div className="text-xs font-medium text-gray-600 mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fadeUp} className="relative h-[420px] md:h-[520px] bg-gradient-to-br from-[#f8f5f0]/80 to-[#e7d9c2]/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden group">
        {/* Glow behind 3D model */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#a67c52]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <Suspense fallback={<div className="w-full h-full grid place-items-center text-gray-500">Cargando modelo…</div>}>
          <Canvas camera={{ position: [2, 2, 8], fov: 80 }} dpr={[1, 2]}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 10, 7]} intensity={1.2} />
            <MuebleModel />
            <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.2} />
          </Canvas>
        </Suspense>
      </motion.div>
    </section>
  );
};

export default Hero;
