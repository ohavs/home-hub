import React, { useState } from 'react';
import { useAppStore, Recipe } from '@/src/data/store';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronDown, Thermometer, Clock, Scale, Droplets } from 'lucide-react';

export function RecipeVault() {
  const { recipes, beans } = useAppStore();

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-4">
      <header>
         <h1 className="text-2xl font-light tracking-tight mb-1">מתכונים סודיים</h1>
         <p className="text-[#F5F5F5]/60 text-xs">כאן נמצאים כל סודות החליטה שלך.</p>
      </header>

      <section className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37]">מתכוני קפה</h2>
          <span className="text-[10px] text-[#F5F5F5]/40">הכל</span>
        </div>
        <div className="space-y-3">
          {recipes.map((recipe, index) => {
            const bean = beans.find(b => b.id === recipe.beanId);
            return (
              <RecipeCard key={recipe.id} recipe={recipe} beanName={bean?.name || 'קפה לא ידוע'} index={index} />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RecipeCard({ recipe, beanName, index }: { recipe: Recipe, beanName: string, index: number, key?: React.Key }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full text-right p-4 flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#F5F5F5]">{recipe.name}</span>
          <span className="text-[10px] text-[#F5F5F5]/50 italic font-serif" dir="ltr">
             {recipe.dose}g In / {recipe.yield}g Out • {recipe.time}s • {beanName}
          </span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#D4AF37]">
           <span className="text-lg leading-none transform rotate-180 -translate-y-[2px]">←</span>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
               <RecipeStat icon={<Scale />} label="כניסה (g)" value={recipe.dose} />
               <RecipeStat icon={<Droplets />} label="יציאה (g)" value={recipe.yield} />
               <RecipeStat icon={<Clock />} label="זמן (s)" value={recipe.time} />
               <RecipeStat icon={<Thermometer />} label="טמפ' (°C)" value={recipe.temp} />
            </div>
            
            <div className="mt-4 p-3 rounded-2xl bg-[#1A1A1A] flex justify-between items-center border border-white/5">
               <span className="text-xs text-[#F5F5F5]/50">גודל טחינה</span>
               <span className="font-medium text-lg font-mono tracking-tight text-[#D4AF37]">{recipe.grindSize}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RecipeStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-[#1A1A1A] border border-white/5">
       <div className="text-[#D4AF37] [&>svg]:w-3.5 [&>svg]:h-3.5">
         {icon}
       </div>
       <div className="text-center">
         <div className="text-[9px] text-[#F5F5F5]/40 mb-0.5">{label}</div>
         <div className="font-medium text-sm">{value}</div>
       </div>
    </div>
  );
}
