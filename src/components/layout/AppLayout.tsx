import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Settings, Coffee, FileText } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bgColor?: string;
}

const TABS = [
  { id: 'dashboard', icon: Home, label: 'ראשי' },
  { id: 'maintenance', icon: Settings, label: 'תחזוקה' },
  { id: 'beans', icon: Coffee, label: 'פולים' },
  { id: 'recipes', icon: FileText, label: 'מתכונים' },
];

export function AppLayout({ children, activeTab, setActiveTab, bgColor = '#0A0A0A' }: AppLayoutProps) {
  return (
    <motion.div 
      className="relative flex flex-col w-full h-full text-[#F5F5F5] overflow-hidden bg-[#0A0A0A]"
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#1C1612] to-transparent opacity-60 pointer-events-none" />

      {/* Content Area */}
      <main className="flex-1 w-full overflow-y-auto hide-scrollbar pb-24 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full max-w-md mx-auto p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full bg-[#0A0A0A] border-t border-white/5 pointer-events-none">
        <nav className="flex items-center justify-between w-full max-w-sm mx-auto h-20 px-6 pointer-events-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 transition-colors duration-300",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-xl bg-white/5 border border-white/5"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <tab.icon className={cn("w-5 h-5 mb-1 relative z-10", isActive ? "text-[#D4AF37]" : "text-[#D4AF37]/40")} strokeWidth={isActive ? 2 : 1.5} />
                <span className={cn("text-[9px] font-medium tracking-widest relative z-10 uppercase", isActive ? "text-[#D4AF37]" : "text-[#D4AF37]/40")}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
