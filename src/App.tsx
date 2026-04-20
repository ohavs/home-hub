import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hub } from './screens/Hub';
import { CoffeeDashboard } from './screens/Coffee';
import { KitchenDashboard } from './screens/Kitchen';
import { HomeDashboard } from './screens/Home';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<string>('hub');
  const [activeColor, setActiveColor] = useState<string>('#0A0A0A');

  const handleSelect = (id: string, color: string) => {
    setActiveColor(color);
    setActiveScreen(id);
  };

  const handleBack = () => {
    setActiveScreen('hub');
    setActiveColor('#0A0A0A');
  };

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden flex flex-col">
       {/* Global Blurry dynamic background */}
       <motion.div 
         className="absolute top-0 w-full h-[60%] opacity-40 blur-[80px] pointer-events-none transition-colors duration-1000 z-0"
         animate={{ backgroundColor: activeColor }}
       />

       {/* Render active screen */}
       <AnimatePresence mode="wait">
          {activeScreen === 'hub' && (
            <motion.div key="hub" className="absolute inset-0 z-10" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
               <Hub onSelect={handleSelect} />
            </motion.div>
          )}
          {activeScreen === 'coffee' && <CoffeeDashboard key="coffee" onBack={handleBack} color={activeColor} />}
          {activeScreen === 'kitchen' && <KitchenDashboard key="kitchen" onBack={handleBack} color={activeColor} />}
          {activeScreen === 'home' && <HomeDashboard key="home" onBack={handleBack} color={activeColor} />}
       </AnimatePresence>
    </div>
  );
}
