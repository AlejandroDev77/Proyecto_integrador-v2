import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 font-outfit overflow-hidden">
      {/* Lado izquierdo: Imagen premium (visible en pantallas grandes) */}
      <div className="hidden lg:relative lg:block lg:w-1/2 xl:w-3/5">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/auth/auth-side.png"
          alt="Premium Interior Design"
        />
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gray-900/10" />
        
        {/* Frase inspiradora sobre la imagen */}
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white animate-fade-in-up">
          <div className="inline-block p-1 px-3 mb-4 text-xs font-semibold tracking-wider uppercase bg-orange-500 rounded-full">
            Inspiración Pura
          </div>
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
            Imagina, Diseña y Construye con Bosquejo.
          </h2>
          <p className="text-lg text-gray-100 drop-shadow-md max-w-md">
            Convierte tus ideas en espacios reales con nuestra plataforma de diseño y mobiliario de alta calidad.
          </p>
        </div>
      </div>

      {/* Lado derecho: Formulario */}
      <div className="flex flex-col flex-1 px-4 py-8 sm:px-6 lg:px-12 xl:px-24 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
           <div className="lg:hidden">
              <img
                src="/images/logo/BOSQUEJO_PROT_2-removebg-preview.png"
                alt="Bosquejo Logo"
                className="h-10 object-contain"
              />
           </div>
           <div className="ml-auto">
             <ThemeTogglerTwo />
           </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {children}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Bosquejo. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
