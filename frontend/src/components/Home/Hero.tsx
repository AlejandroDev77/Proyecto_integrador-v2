import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Box, Send, Sparkles } from "lucide-react";
import { fadeUp } from "../../utils/animations";
import { MuebleModel } from "../../models/MuebleModel";

const Hero = () => {
  return (
    <section id="hero" className="relative max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <motion.div {...fadeUp} className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3e7d7] text-[#7c5e3c] text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4"/> 
          Diseño + Fabricación a medida
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Muebles que transforman <br className="hidden md:block"/> tu espacio
        </h1>

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
          ].map((s)=> (
            <div key={s.l} className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow text-center">
              <div className="text-2xl font-extrabold">{s.k}</div>
              <div className="text-xs text-gray-500">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fadeUp} className="h-[420px] md:h-[520px] bg-gradient-to-br from-[#f8f5f0] to-[#e7d9c2] rounded-3xl shadow-xl overflow-hidden">
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
