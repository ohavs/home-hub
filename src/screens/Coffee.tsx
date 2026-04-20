import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore, CoffeeBag, Recipe, MaintenanceAction } from '@/src/data/store';
import { ChevronLeft, Plus, Settings2, CheckCircle2, RotateCcw, Droplets, Clock, Scale, Thermometer } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function CoffeeDashboard({ onBack, color }: { onBack: () => void, color: string }) {
  const { beans, maintenance, recipes, setMaintenance } = useAppStore();
  
  const handleReset = (id: string) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, progress: 0, dueDate: new Date(Date.now() + 86400000 * 30).toISOString() };
      }
      return m;
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
        layoutId="card-container-coffee"
        className="w-full pt-16 pb-8 px-6 relative shrink-0 rounded-b-[40px] border-b border-white/5"
        style={{ background: `linear-gradient(145deg, ${color}dd 0%, #111111 100%)` }}
      >
         <button onClick={onBack} className="absolute top-6 left-6 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 z-20">
           <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
         </button>
         <div className="flex flex-col z-10 relative mt-4">
            <motion.span layoutId="card-sub-coffee" className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 drop-shadow-md">תחזוקה ומלאי פולים</motion.span>
            <motion.h1 layoutId="card-title-coffee" className="text-4xl font-light tracking-tight drop-shadow-md">מרכז הקפה</motion.h1>
         </div>
      </motion.header>

      <div className="flex-1 px-6 py-6 pb-24 space-y-10 uppercase">
        {/* Maintenance */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37]">מצב המכונה</h2>
            <button className="text-[10px] text-white/50 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3"/> חדש</button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 snap-x">
            {maintenance.map(item => (
              <MaintenanceRing key={item.id} item={item} onReset={handleReset} />
            ))}
          </div>
        </section>

        {/* Beans */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37]">מלאי פולים נוכחי</h2>
            <button className="text-[10px] text-white/50 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3"/> הוסף</button>
          </div>
          <div className="grid gap-3">
             {beans.map(bean => (
               <BeanRow key={bean.id} bean={bean} />
             ))}
          </div>
        </section>

        {/* Recipes */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37]">ספר מתכונים</h2>
            <button className="text-[10px] text-white/50 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3"/> הוסף</button>
          </div>
          <div className="grid gap-4">
            {recipes.map(recipe => (
               <RecipeRow key={recipe.id} recipe={recipe} beanName={beans.find(b=>b.id===recipe.beanId)?.name || 'Unknown'} />
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}

function MaintenanceRing({ item, onReset }: { item: MaintenanceAction, onReset: (id: string) => void }) {
  const [isResetting, setIsResetting] = useState(false);
  const radius = 24; const circumference = 2 * Math.PI * radius;
  const offset = circumference - (item.progress / 100) * circumference;
  const isCritical = item.progress >= 100;
  
  return (
    <div className="bg-[#111111] p-4 rounded-[2rem] border border-white/5 min-w-[120px] flex flex-col items-center shrink-0 snap-center">
      <div className="relative mb-2 cursor-pointer" onClick={() => { setIsResetting(true); setTimeout(()=> { onReset(item.id); setIsResetting(false); }, 600); }}>
        <svg className="w-14 h-14 transform -rotate-90">
          <circle cx="28" cy="28" r={radius} fill="none" stroke="#1A1A1A" strokeWidth="4" />
          <motion.circle cx="28" cy="28" r={radius} fill="none" stroke={isCritical ? '#EF4444' : '#D4AF37'} strokeWidth="4" strokeDasharray={circumference} animate={{ strokeDashoffset: offset }} transition={{ duration: 1 }} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
           {isResetting ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : `${item.progress}%`}
        </span>
      </div>
      <span className="text-[9px] text-[#F5F5F5] uppercase opacity-80 mt-1 whitespace-nowrap">{item.name}</span>
    </div>
  );
}

function BeanRow({ bean }: { bean: CoffeeBag }) {
  return (
    <div className="bg-[#111111] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
       <div className="w-12 h-16 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/5 relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundColor: bean.imageColor }} />
          <img src={`https://picsum.photos/seed/${bean.name}/150/200`} className="w-full h-full object-cover mix-blend-overlay" alt={bean.name} referrerPolicy="no-referrer" />
       </div>
       <div className="flex-1 min-w-0">
         <h4 className="font-serif text-sm truncate text-[#F5F5F5]">{bean.name}</h4>
         <div className="flex gap-1 text-[#D4AF37] my-1">
             {Array.from({length: 5}).map((_, i) => <span key={i} className={cn("text-[8px]", i < bean.rating ? "opacity-100" : "opacity-30")}>★</span>)}
         </div>
         <p className="text-[9px] opacity-50 tracking-widest">{bean.weight}g left • ₪{bean.price}</p>
       </div>
    </div>
  );
}

function RecipeRow({ recipe, beanName }: { recipe: Recipe, beanName: string }) {
  return (
    <div className="bg-[#111111] rounded-2xl p-4 border border-white/5">
       <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium text-sm text-[#F5F5F5]">{recipe.name}</h4>
            <p className="text-[9px] text-[#D4AF37] opacity-80 mt-0.5">{beanName}</p>
          </div>
          <span className="text-xl font-mono text-white tracking-tighter">{recipe.grindSize}</span>
       </div>
       <div className="grid grid-cols-4 gap-2 border-t border-white/5 pt-3">
          <div className="flex flex-col items-center"><Scale className="w-3 h-3 text-[#D4AF37] mb-1"/><span className="text-[10px] font-bold">{recipe.dose}g</span></div>
          <div className="flex flex-col items-center"><Droplets className="w-3 h-3 text-[#D4AF37] mb-1"/><span className="text-[10px] font-bold">{recipe.yield}g</span></div>
          <div className="flex flex-col items-center"><Clock className="w-3 h-3 text-[#D4AF37] mb-1"/><span className="text-[10px] font-bold">{recipe.time}s</span></div>
          <div className="flex flex-col items-center"><Thermometer className="w-3 h-3 text-[#D4AF37] mb-1"/><span className="text-[10px] font-bold">{recipe.temp}°</span></div>
       </div>
    </div>
  );
}
