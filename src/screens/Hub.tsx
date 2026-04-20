import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Utensils, Home as HomeIcon } from 'lucide-react';

interface HubProps {
  onSelect: (id: string, color: string) => void;
}

const DASHBOARDS = [
  { id: 'coffee', name: 'מרכז הקפה', subtitle: 'תחזוקה ומלאי פולים', icon: Coffee, color: '#382a20' },
  { id: 'kitchen', name: 'מטבח חכם', subtitle: 'מלאי ומכשירי חשמל', icon: Utensils, color: '#1a332d' },
  { id: 'home', name: 'ניהול הבית', subtitle: 'תחזוקה ומשימות', icon: HomeIcon, color: '#1e2025' },
];

export function Hub({ onSelect }: HubProps) {
  return (
    <div className="flex flex-col w-full h-full pt-8 text-[#F5F5F5] z-10">
      <header className="mb-12 text-center">
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-80 mb-2 block">ברוך שובך</span>
        <h1 className="text-4xl font-serif italic tracking-tight">Master Home</h1>
      </header>

      <div className="flex w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory px-6 gap-6 pb-12 items-center flex-1">
        {DASHBOARDS.map((dash, index) => (
          <motion.div
            key={dash.id}
            layoutId={`card-container-${dash.id}`}
            onClick={() => onSelect(dash.id, dash.color)}
            className="shrink-0 w-[280px] h-[400px] rounded-[32px] snap-center p-6 flex flex-col justify-between cursor-pointer border border-white/5 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(145deg, ${dash.color}dd 0%, #111111 80%)`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            }}
            whileHover={{ scale: 1.02, rotateY: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.15, type: 'spring', damping: 20, stiffness: 100 }}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <motion.div layoutId={`card-icon-${dash.id}`} className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md z-10 shadow-xl">
              <dash.icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
            </motion.div>

            <div className="z-10">
               <motion.span layoutId={`card-sub-${dash.id}`} className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-90 block mb-2">{dash.subtitle}</motion.span>
               <motion.h2 layoutId={`card-title-${dash.id}`} className="text-3xl font-light tracking-tight">{dash.name}</motion.h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
