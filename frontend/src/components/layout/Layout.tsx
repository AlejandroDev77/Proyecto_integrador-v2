import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-[#fcfbf8] min-h-screen font-sans text-[#3a2f22]">
      <Toaster 
        position="top-center" 
        toastOptions={{
          success: {
            duration: 5000,
            style: {
              background: '#8b4513',
              color: '#fff',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#8b4513',
            },
          },
          error: {
            style: {
              background: '#991b1b',
              color: '#fff',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            },
          },
        }}
      />

      {/* Background decor */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#f1e7d6] blur-3xl opacity-70" />
        <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-[#efe3cf] blur-3xl opacity-70" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-multiply" />
      </div>

      {children}
    </div>
  );
};

export default Layout;