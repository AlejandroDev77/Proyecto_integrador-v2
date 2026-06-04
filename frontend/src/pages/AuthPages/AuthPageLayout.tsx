import React, { Suspense } from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AuthModel } from "../../models/AuthModel";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#faf8f5] dark:bg-gray-950 font-outfit overflow-hidden relative">
      {/* Background Blobs for the entire screen */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#a67c52]/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#d4b48f]/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />

      {/* Logo absolute on the top left */}
      <div className="absolute top-6 left-6 lg:top-8 lg:left-12 z-50">
        <a href="/">
          <img
            src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
            alt="Bosquejo Logo"
            className="h-12 lg:h-16 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </a>
      </div>

      {/* Lado izquierdo: Modelo 3D Interactivo */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center bg-gradient-to-br from-[#f8f5f0]/40 to-[#e7d9c2]/40 backdrop-blur-3xl border-r border-white/50 z-10 overflow-hidden">
        
        <Suspense fallback={<div className="text-[#a67c52] font-semibold animate-pulse">Cargando experiencia 3D...</div>}>
          <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [2, 2, 8], fov: 70 }} dpr={[1, 2]}>
              <ambientLight intensity={1} />
              <directionalLight position={[5, 10, 7]} intensity={1.5} />
              <AuthModel />
              <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.5} />
            </Canvas>
          </div>
        </Suspense>
        
        {/* Frase inspiradora */}
        <div className="absolute bottom-8 left-12 right-12 z-10 text-[#3a2f22] pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 mb-3 text-xs font-bold tracking-widest uppercase bg-[#a67c52] text-white rounded-full shadow-lg shadow-[#a67c52]/30">
              Inspiración Pura
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-3 leading-tight">
              Imagina, Diseña y <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67c52] to-[#8b6842]">Construye con Bosquejo.</span>
            </h2>
            <p className="text-base text-gray-600 font-medium max-w-md backdrop-blur-sm bg-white/30 p-3 rounded-2xl border border-white/40 shadow-sm">
              Interactúa con nuestros modelos 3D y convierte tus ideas en espacios reales de alta calidad.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lado derecho: Formulario con Glassmorphism */}
      <div 
        className="flex flex-col flex-1 px-4 py-4 sm:px-6 lg:px-12 xl:px-24 overflow-y-auto relative z-20"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
        
        <div className="flex items-center justify-end mb-2">
           <div className="ml-auto">
             <ThemeTogglerTwo />
           </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
        >
          {/* Glass Card Container */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </motion.div>

        <div className="mt-4 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 pb-2">
          © {new Date().getFullYear()} Bosquejo. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
