import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, CoffeeBag, MaintenanceAction } from '@/src/data/store';
import { CheckCircle2, Coffee as CoffeeIcon, Calendar, Flame } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  Card,
  SectionHeader,
  ProgressRing,
  Badge,
  DashboardFrame,
} from '@/src/components/ui/primitives';

export function CoffeeDashboard({ onBack, color }: { onBack: () => void; color: string }) {
  const { beans, maintenance, resetMaintenance } = useStore();

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="מרכז הקפה"
      subtitle="תחזוקה ומלאי פולים"
      layoutIdBase="coffee"
    >
      {/* Maintenance */}
      <section>
        <SectionHeader title="מצב המכונה" />
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x -mx-6 px-6">
          {maintenance.map((item) => (
            <MaintenanceRing key={item.id} item={item} onReset={resetMaintenance} />
          ))}
        </div>
      </section>

      {/* Beans */}
      <section>
        <SectionHeader title="מלאי פולים" subtitle={`${beans.length} זנים`} />
        <div className="grid gap-3">
          {beans.map((bean) => (
            <BeanRow key={bean.id} bean={bean} />
          ))}
        </div>
      </section>
    </DashboardFrame>
  );
}

function MaintenanceRing({
  item,
  onReset,
}: {
  item: MaintenanceAction;
  onReset: (id: string) => void;
}) {
  const [isResetting, setIsResetting] = useState(false);
  const isCritical = item.progress >= 100;

  return (
    <div className="bg-[#111111] p-4 rounded-[2rem] border border-white/5 min-w-[130px] flex flex-col items-center shrink-0 snap-center">
      <div
        className="relative mb-2 cursor-pointer active:scale-95 transition-transform"
        onClick={() => {
          setIsResetting(true);
          setTimeout(() => {
            onReset(item.id);
            setIsResetting(false);
          }, 600);
        }}
      >
        <ProgressRing
          progress={item.progress}
          size={62}
          color={isCritical ? '#EF4444' : '#D4AF37'}
        >
          <span className="text-[11px] font-bold font-mono-num">
            {isResetting ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              `${item.progress}%`
            )}
          </span>
        </ProgressRing>
      </div>
      <span className="text-[10px] text-[#F5F5F5] text-center opacity-80 mt-1 whitespace-nowrap">
        {item.name}
      </span>
      {isCritical && (
        <span className="text-[8px] text-red-400 uppercase tracking-widest mt-1">דחוף</span>
      )}
    </div>
  );
}

function BeanRow({ bean }: { bean: CoffeeBag }) {
  const [open, setOpen] = useState(false);
  const roastAge = bean.roastDate
    ? Math.floor((Date.now() - new Date(bean.roastDate).getTime()) / 86400000)
    : null;
  const isFresh = roastAge !== null && roastAge <= 21 && roastAge >= 5;

  return (
    <Card className="p-0 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-right flex items-center gap-4 p-4">
        <div
          className="w-14 h-16 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/5 relative flex items-center justify-center"
          style={{ backgroundColor: bean.imageColor + '30' }}
        >
          <CoffeeIcon className="w-6 h-6 text-[#D4AF37]/70" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-sm text-[#F5F5F5] truncate">{bean.name}</h4>
          <div className="flex items-center gap-2 my-1">
            <div className="flex gap-0.5 text-[#D4AF37]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={cn('text-[10px]', i < bean.rating ? 'opacity-100' : 'opacity-30')}>
                  ★
                </span>
              ))}
            </div>
            {isFresh && <Badge variant="success">טרי</Badge>}
            {roastAge !== null && roastAge > 30 && <Badge variant="warn">ישן</Badge>}
          </div>
          <p className="text-[10px] opacity-50 font-mono-num">
            {bean.weight}g · ₪{bean.price} · {bean.origin}
          </p>
        </div>
      </button>
      <AnimatePresence>
        {open && bean.tasteProfile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 space-y-3">
              {bean.notes && (
                <p className="text-xs text-white/70 leading-relaxed">{bean.notes}</p>
              )}
              <div className="space-y-2">
                <TasteBar label="חומציות" value={bean.tasteProfile.acidity} />
                <TasteBar label="גוף" value={bean.tasteProfile.body} />
                <TasteBar label="מתיקות" value={bean.tasteProfile.sweetness} />
                <TasteBar label="מרירות" value={bean.tasteProfile.bitterness} />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-white/50 pt-2 border-t border-white/5">
                {roastAge !== null && (
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {roastAge} ימים מקלייה
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {bean.roaster}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function TasteBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-white/50 w-16 shrink-0">{label}</span>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-1.5 rounded-full',
              i < value ? 'bg-[#D4AF37]' : 'bg-white/10'
            )}
          />
        ))}
      </div>
    </div>
  );
}
