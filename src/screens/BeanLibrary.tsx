import React, { useState } from 'react';
import { useAppStore, CoffeeBag } from '@/src/data/store';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Star, X, Edit2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function BeanLibrary() {
  const { beans } = useAppStore();
  const [selectedBeanId, setSelectedBeanId] = useState<string | null>(null);

  const selectedBean = beans.find(b => b.id === selectedBeanId);

  return (
    <div className="flex flex-col w-full h-full pt-4 text-[#F5F5F5]">
      <header className="flex justify-between items-end mb-8 z-10 relative">
         <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-80 mb-1">הספרייה שלך</span>
            <h1 className="text-2xl font-light tracking-tight">פולי קפה</h1>
         </div>
         <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-5 h-5" />
         </button>
      </header>

      <div className="grid grid-cols-2 gap-4 pb-10 z-10 relative">
        {beans.map((bean, index) => (
          <motion.div
             key={bean.id}
             layoutId={`bean-container-${bean.id}`}
             onClick={() => setSelectedBeanId(bean.id)}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: index * 0.1 }}
             className="bg-[#111111] rounded-[1.5rem] p-4 flex flex-col items-center text-center cursor-pointer relative overflow-hidden border border-[rgba(255,255,255,0.05)]"
          >
             <div className="absolute inset-0 opacity-10 blur-xl pointer-events-none" style={{ backgroundColor: bean.imageColor }} />
             <div className="w-6 h-0.5 bg-[#D4AF37] mb-3 opacity-50"></div>
             <motion.img 
                layoutId={`bean-img-${bean.id}`}
                src={`https://picsum.photos/seed/${bean.name}/150/200`} 
                alt={bean.name} 
                referrerPolicy="no-referrer"
                className="w-16 h-24 object-cover rounded-lg shadow-lg mix-blend-overlay mb-3 opacity-90 border border-white/5"
             />
             <motion.h3 layoutId={`bean-title-${bean.id}`} className="font-serif italic text-sm leading-tight mb-1 text-white">{bean.name}</motion.h3>
             <p className="text-[10px] text-[#F5F5F5]/50 tracking-widest">{bean.weight}g • ₪{bean.price}</p>
          </motion.div>
        ))}
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedBean && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedBeanId(null)}
          >
             <motion.div 
               layoutId={`bean-container-${selectedBean.id}`}
               className="w-full max-w-sm rounded-[2rem] p-6 relative overflow-hidden text-center flex flex-col items-center border border-[rgba(255,255,255,0.1)] bg-[#0A0A0A]"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="absolute inset-0 bg-gradient-to-b from-[#1C1612] to-transparent opacity-60 pointer-events-none" />
                <div className="absolute top-0 opacity-20 blur-3xl w-full h-1/2 pointer-events-none transition-colors" style={{ backgroundColor: selectedBean.imageColor }} />

                <button 
                  onClick={() => setSelectedBeanId(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/10 bg-[#1A1A1A] flex items-center justify-center text-white/70 hover:text-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <button className="absolute top-4 left-4 w-10 h-10 rounded-full border border-white/10 bg-[#1A1A1A] flex items-center justify-center text-white/70 hover:text-white z-10">
                  <Edit2 className="w-4 h-4" />
                </button>

                <motion.img 
                  layoutId={`bean-img-${selectedBean.id}`}
                  src={`https://picsum.photos/seed/${selectedBean.name}/300/400`} 
                  alt={selectedBean.name} 
                  referrerPolicy="no-referrer"
                  className="w-28 h-40 object-cover rounded-xl shadow-2xl mix-blend-overlay mb-6 mt-6 border border-white/10 z-10"
                />
                
                <div className="w-12 h-1 bg-[#D4AF37] mb-4 z-10"></div>
                <div className="text-[10px] text-[#D4AF37] mb-1 uppercase tracking-widest z-10">Origin</div>
                <motion.h2 layoutId={`bean-title-${selectedBean.id}`} className="text-3xl font-serif italic mb-2 z-10 text-white">{selectedBean.name}</motion.h2>
                
                <div className="flex gap-1 text-[#D4AF37] mb-6 z-10">
                   {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < selectedBean.rating ? "fill-current" : "opacity-30")} />
                   ))}
                </div>

                <div className="w-full grid grid-cols-2 gap-3 z-10">
                  <div className="bg-[#111111] rounded-2xl p-4 border border-white/5">
                     <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">משקל</p>
                     <p className="text-lg font-light text-[#F5F5F5]">{selectedBean.weight}g</p>
                  </div>
                  <div className="bg-[#111111] rounded-2xl p-4 border border-white/5">
                     <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">מחיר</p>
                     <p className="text-lg font-light text-[#F5F5F5]">₪{selectedBean.price}</p>
                  </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
