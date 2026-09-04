import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { FideleView } from './components/FideleView';
import { ConducteurView } from './components/ConducteurView';
import { motion } from 'motion/react';

function WelcomeFidele() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#F5F5F7]">
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#006865]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden relative z-10"
      >
        <div className="p-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex flex-col items-center"
          >
            {/* Nom de l'église (Texte) */}
            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <span className="text-lg font-bold text-[#D4AF37] tracking-widest uppercase mb-2">Assemblée Metanoia</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#006865] leading-tight tracking-tight">Église Vases d'Honneur</span>
            </div>

            <div className="inline-block bg-[#006865]/10 text-[#006865] font-bold px-5 py-2 rounded-full text-sm uppercase tracking-widest mb-4">
              Département MRES
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#006865] mb-2">Cure d'Âme</h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center text-gray-600 mb-10 text-[16px] font-medium leading-relaxed"
          >
            Bienvenue sur la plateforme numérique dédiée à votre accompagnement spirituel et votre délivrance.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate('/fidele')}
            className="w-full group relative flex items-center justify-center p-4 bg-[#006865] text-white rounded-full hover:bg-[#005552] transition-colors shadow-lg shadow-[#006865]/20"
          >
            <span className="text-lg font-bold tracking-wide">Commencer ma fiche</span>
            <ChevronRight className="w-5 h-5 ml-2 opacity-80 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
        
        <div className="bg-gray-50/80 p-5 text-center border-t border-gray-100 flex flex-col items-center gap-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            © {new Date().getFullYear()} Vases d'Honneur. Tous droits réservés.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeFidele />} />
        <Route path="/fidele" element={<FideleView onBack={() => window.location.href = '/'} />} />
        <Route path="/admin" element={<ConducteurView onBack={() => window.location.href = '/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
