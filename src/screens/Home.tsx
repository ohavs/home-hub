import React from 'react';
import { motion } from 'motion/react';
import { useAppStore, HomeMaintenance, DailyTask } from '@/src/data/store';
import { ChevronLeft, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function HomeDashboard({ onBack, color }: { onBack: () => void, color: string }) {
  const { homeMaintenance, setHomeMaintenance, dailyTasks, setDailyTasks } = useAppStore();

  const toggleTask = (id: string) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
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
        layoutId="card-container-home"
        className="w-full pt-16 pb-8 px-6 relative shrink-0 rounded-b-[40px] border-b border-white/5"
        style={{ background: `linear-gradient(145deg, ${color}dd 0%, #111111 100%)` }}
      >
         <button onClick={onBack} className="absolute top-6 left-6 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 z-20">
           <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
         </button>
         <div className="flex flex-col z-10 relative mt-4">
            <motion.span layoutId="card-sub-home" className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 drop-shadow-md">תחזוקה ומשימות</motion.span>
            <motion.h1 layoutId="card-title-home" className="text-4xl font-light tracking-tight drop-shadow-md">ניהול הבית</motion.h1>
         </div>
      </motion.header>

      <div className="flex-1 px-6 py-6 pb-24 space-y-10 uppercase">
        
        {/* Daily Tasks */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37]">בדיקה יומית</h2>
            <span className="text-[10px] text-white/50">{dailyTasks.filter(t=>t.completed).length} / {dailyTasks.length} הושלמו</span>
          </div>
          <div className="flex flex-col gap-3">
            {dailyTasks.map(task => (
              <label key={task.id} className="flex items-center gap-4 bg-[#111111] p-4 rounded-2xl border border-white/5 cursor-pointer relative overflow-hidden group">
                 <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full border border-white/20 shrink-0">
                    <motion.div 
                      initial={false}
                      animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
                      className="absolute inset-0 bg-[#D4AF37] rounded-full flex items-center justify-center"
                    >
                       <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                    </motion.div>
                 </div>
                 <span className={cn("text-sm transition-all duration-300 relative z-10", task.completed ? "text-white/40 line-through" : "text-white")}>
                   {task.name}
                 </span>
                 {/* Hidden input to make it accessible */}
                 <input type="checkbox" className="hidden" checked={task.completed} onChange={() => toggleTask(task.id)} />
              </label>
            ))}
          </div>
        </section>

        {/* Home Maintenance */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4">תחזוקה תקופתית</h2>
          <div className="flex flex-col gap-4">
             {homeMaintenance.map(item => (
                <div key={item.id} className="bg-[#111111] p-4 rounded-2xl border border-white/5">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs font-mono font-bold text-[#D4AF37]">{item.progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        className={cn("h-full rounded-full", item.progress < 30 ? "bg-red-500" : "bg-[#D4AF37]")}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                   </div>
                </div>
             ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
