import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore, InventoryItem, ApplianceHealth } from '@/src/data/store';
import { ChevronLeft, Plus, Minus, CheckCircle2 } from 'lucide-react';

export function KitchenDashboard({ onBack, color }: { onBack: () => void, color: string }) {
  const { inventory, applianceHealth, setInventory, setApplianceHealth } = useAppStore();

  const handleUpdateQuantity = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleResetAppliance = (id: string) => {
    setApplianceHealth(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, progress: 100 }; // E.g., full salt/filter
      }
      return a;
    }));
  };

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col bg-[#050505] overflow-y-auto hide-scrollbar z-50 text-[#F5F5F5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 200) {
          onBack();
        }
      }}
    >
      <motion.header 
        layoutId="card-container-kitchen"
        className="w-full pt-16 pb-8 px-6 relative shrink-0 rounded-b-[40px] border-b border-white/5"
        style={{ background: `linear-gradient(145deg, ${color}dd 0%, #111111 100%)` }}
      >
         <button onClick={onBack} className="absolute top-6 left-6 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 z-20">
           <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
         </button>
         <div className="flex flex-col z-10 relative mt-4">
            <motion.span layoutId="card-sub-kitchen" className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 drop-shadow-md">מלאי ומכשירי חשמל</motion.span>
            <motion.h1 layoutId="card-title-kitchen" className="text-4xl font-light tracking-tight drop-shadow-md">מטבח חכם</motion.h1>
         </div>
      </motion.header>

      <div className="flex-1 px-6 py-6 pb-24 space-y-10 uppercase">
        {/* Inventory Tracking */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37]">מלאי בסיסי</h2>
            <button className="text-[10px] text-white/50 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3"/> הוסף מוצר</button>
          </div>
          <div className="flex flex-col gap-3">
             {inventory.map(item => (
                <div key={item.id} className="bg-[#111111] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                   <span className="font-medium text-sm">{item.name}</span>
                   <div className="flex items-center gap-4 bg-[#1A1A1A] p-1 rounded-full border border-white/5">
                      <button onClick={() => handleUpdateQuantity(item.id, -1)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"><Minus className="w-4 h-4"/></button>
                      <AnimatePresence mode="popLayout">
                        <motion.span 
                          key={item.quantity}
                          initial={{ opacity: 0, scale: 0.5, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5, y: 10 }}
                          className="w-12 text-center font-mono font-bold text-lg leading-none"
                        >
                          {item.quantity}
                        </motion.span>
                      </AnimatePresence>
                      <button onClick={() => handleUpdateQuantity(item.id, 1)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"><Plus className="w-4 h-4"/></button>
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* Appliance Health */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4">בריאות מכשירים</h2>
          <div className="grid grid-cols-2 gap-3">
            {applianceHealth.map(item => (
               <div key={item.id} className="bg-[#111111] rounded-3xl p-4 border border-white/5 flex flex-col justify-between aspect-square relative overflow-hidden">
                  <span className="text-[10px] uppercase tracking-widest text-white/50 z-10">{item.name}</span>
                  <div className="flex flex-col z-10 mt-auto">
                    <span className="text-2xl font-light">{item.progress}%</span>
                    <button 
                      onClick={() => handleResetAppliance(item.id)}
                      className="mt-2 text-[10px] text-[#D4AF37] text-left underline underline-offset-2 opacity-80 hover:opacity-100"
                    >
                      מילוי/החלפה
                    </button>
                  </div>
                  {/* Progress Background Fill */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-[#D4AF37]/10 z-0"
                    initial={{ height: 0 }}
                    animate={{ height: `${item.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
               </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
