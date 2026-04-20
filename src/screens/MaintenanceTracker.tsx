import React, { useState } from 'react';
import { useAppStore, MaintenanceAction } from '@/src/data/store';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function MaintenanceTracker() {
  const { maintenance, setMaintenance } = useAppStore();

  const handleReset = (id: string) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, progress: 0, dueDate: new Date(Date.now() + 86400000 * 30).toISOString() }; // Add 30 days
      }
      return m;
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-4">
      <header>
         <h1 className="text-2xl font-light tracking-tight mb-1">מעקב תחזוקה</h1>
         <p className="text-[#F5F5F5]/60 text-xs">המכונה שלך צריכה אהבה כדי לייצר קפה מושלם.</p>
      </header>

      <section className="mt-4">
        <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4">מצב הנוכחי</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {maintenance.map((item, index) => (
            <MaintenanceCircleCard key={item.id} item={item} onReset={handleReset} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MaintenanceCircleCard({ item, onReset, index }: { item: MaintenanceAction, onReset: (id: string) => void, index: number, key?: React.Key }) {
  const [isResetting, setIsResetting] = useState(false);
  const isWarning = item.progress >= 80;
  const isCritical = item.progress >= 100;
  
  // Circle Math
  const radius = 24;
  const circumference = 2 * Math.PI * radius; // ~150.79
  const strokeDashoffset = circumference - (item.progress / 100) * circumference;

  const handleResetClick = () => {
    setIsResetting(true);
    setTimeout(() => {
      onReset(item.id);
      setIsResetting(false);
    }, 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#111111] p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="relative flex items-center justify-center mb-2" onClick={handleResetClick}>
        <svg className="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r={radius} fill="transparent" stroke="#1A1A1A" strokeWidth="4" />
          <motion.circle 
            cx="32" 
            cy="32" 
            r={radius} 
            fill="transparent" 
            stroke={isCritical ? "#EF4444" : isWarning ? "#F59E0B" : "#D4AF37"} 
            strokeWidth="4" 
            strokeDasharray={circumference} 
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round" 
          />
        </svg>
        <AnimatePresence mode="wait">
          {isResetting ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </motion.div>
          ) : (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute text-[11px] font-bold mt-[-2px]">
              {item.progress}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      <span className="text-[10px] opacity-80 text-center leading-tight">{item.name}</span>
      <span className="text-[9px] mt-1 text-[#D4AF37] opacity-60">
        {new Date(item.dueDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
      </span>
    </motion.div>
  );
}
