import React from 'react';
import { useAppStore } from '@/src/data/store';
import { motion } from 'motion/react';
import { Coffee, Settings, Droplets } from 'lucide-react';

export function Dashboard() {
  const { beans, maintenance, recipes } = useAppStore();
  
  const activeBean = beans[0];
  const nextMaintenance = [...maintenance].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  const lastRecipe = recipes[0];

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-4 text-[#F5F5F5]">
      <header className="flex justify-between items-center z-10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-80 mb-1">בוקר טוב</span>
          <h1 className="text-2xl font-light tracking-tight">מרכז הקפה</h1>
        </div>
        <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 bg-[#1A1A1A] flex items-center justify-center overflow-hidden relative">
          <img src="https://picsum.photos/seed/coffee-user/100/100" alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#4A3728] to-[#D4AF37]/40 opacity-50 mix-blend-color pointer-events-none"></div>
        </div>
      </header>

      {/* Hero Carousel Area */}
      <motion.div 
        className="relative w-full mt-2 h-56 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute w-44 h-56 bg-gradient-to-br from-[#2D1F16] to-[#0F0F0F] rounded-xl transform rotate-3 border border-white/5 shadow-2xl"></div>
        <div className="absolute w-44 h-56 bg-[#1A1816] rounded-xl transform -rotate-2 border border-white/10 shadow-2xl flex flex-col p-4 overflow-hidden content-between">
           {activeBean?.imageColor && <div className="absolute inset-0 opacity-10 blur-xl pointer-events-none" style={{ backgroundColor: activeBean.imageColor }} />}
           
           <div>
              <div className="w-12 h-1 bg-[#D4AF37] mb-4 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
              <div className="text-[10px] text-[#D4AF37] mb-1 uppercase tracking-widest leading-tight w-full truncate">ORIGIN: {activeBean?.name}</div>
              <div className="text-xl font-serif italic mb-auto text-white z-10 drop-shadow-md">Premium</div>
           </div>

           <div className="mt-auto flex justify-between items-end z-10">
               <span className="text-xs opacity-60 font-mono tracking-widest">{activeBean?.weight}g</span>
               <div className="flex space-x-1 text-[#D4AF37] text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span className="opacity-30">★</span>
               </div>
           </div>
        </div>
      </motion.div>

      {/* Mini Dashboard Metrics */}
      <section className="mt-6">
        <h2 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-4">סקירה כללית</h2>
        <div className="grid grid-cols-2 gap-3">
          <motion.div className="bg-[#111111] p-4 rounded-3xl border border-white/5 flex flex-col justify-between overflow-hidden relative" whileTap={{ scale: 0.96 }}>
            <span className="text-[9px] text-[#D4AF37] uppercase tracking-widest mb-2 z-10">תחזוקה קרובה</span>
            <p className="text-sm font-light text-[#F5F5F5] leading-tight mb-2 z-10">{nextMaintenance?.name}</p>
            <p className="text-[10px] opacity-60 italic font-serif mt-auto z-10">מחר</p>
          </motion.div>

          <motion.div className="bg-[#111111] p-4 rounded-3xl border border-white/5 flex flex-col justify-between overflow-hidden relative" whileTap={{ scale: 0.96 }}>
            <span className="text-[9px] text-[#D4AF37] uppercase tracking-widest mb-2 z-10">מתכון אחרון</span>
            <p className="text-sm font-light text-[#F5F5F5] leading-tight mb-2 z-10">{lastRecipe?.name}</p>
            <p className="text-[10px] opacity-60 italic font-serif mt-auto z-10" dir="ltr">{lastRecipe?.dose}g in / {lastRecipe?.yield}g out</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
