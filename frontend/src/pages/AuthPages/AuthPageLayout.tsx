import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden font-outfit sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Elementos decorativos de fondo abstractos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-orange-200/40 dark:bg-orange-600/10 rounded-full blur-[80px] -top-32 -left-32"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px] bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/40 dark:border-gray-700/50 overflow-hidden">
          <div className="p-8 sm:p-10 lg:p-12">
            {children}
          </div>
        </div>
      </div>

      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
