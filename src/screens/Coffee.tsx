import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, CoffeeBag, MaintenanceAction } from '@/src/data/store';
import { CheckCircle2, Coffee as CoffeeIcon, Calendar, Flame, Trash2 } from 'lucide-react';
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
  const [editMode, setEditMode] = useState(false);

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="מרכז הקפה"
      subtitle="תחזוקה ומלאי פולים"
      layoutIdBase="coffee"
      editMode={editMode}
      onToggleEdit={() => setEditMode((v) => !v)}
    >
      {/* Maintenance */}
      <section>
        <SectionHeader title="מצב המכונה" />
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x -mx-6 px-6">
          {maintenance.map((item) => (
            <MaintenanceRing key={item.id} item={item} onReset={resetMaintenance} editMode={editMode} />
          ))}
        </div>
      </section>

      {/* Beans */}
      <section>
        <SectionHeader title="מלאי פולים" subtitle={`${beans.length} זנים`} />
        <div className="grid gap-3">
          {beans.map((bean) => (
            <BeanRow key={bean.id} bean={bean} editMode={editMode} />
          ))}
        </div>
      </section>
    </DashboardFrame>
  );
}

const UNIT_LABELS: Record<MaintenanceAction['intervalUnit'], string> = {
  days: 'ימים',
  weeks: 'שבועות',
  months: 'חודשים',
};

function MaintenanceRing({
  item,
  onReset,
  editMode,
}: {
  item: MaintenanceAction;
  onReset: (id: string) => void;
  editMode: boolean;
}) {
  const { updateMaintenance, deleteMaintenance } = useStore();
  const [isResetting, setIsResetting] = useState(false);
  const isCritical = item.progress >= 100;

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      onReset(item.id);
      setIsResetting(false);
    }, 600);
  };

  if (editMode) {
    return (
      <div className="bg-[#111111] p-4 rounded-[2rem] border border-[#D4AF37]/30 w-[200px] flex flex-col gap-3 shrink-0 snap-center">
        <input
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F5F5] w-full text-right"
          value={item.name}
          onChange={(e) => updateMaintenance(item.id, { name: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 shrink-0">כל</span>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
            <button
              className="w-5 h-5 flex items-center justify-center text-white/60 hover:text-white"
              onClick={() => updateMaintenance(item.id, { intervalValue: Math.max(1, item.intervalValue - 1) })}
            >−</button>
            <span className="text-sm font-mono-num text-white w-5 text-center">{item.intervalValue}</span>
            <button
              className="w-5 h-5 flex items-center justify-center text-white/60 hover:text-white"
              onClick={() => updateMaintenance(item.id, { intervalValue: item.intervalValue + 1 })}
            >+</button>
          </div>
        </div>
        <div className="flex gap-1">
          {(['days', 'weeks', 'months'] as const).map((u) => (
            <button
              key={u}
              onClick={() => updateMaintenance(item.id, { intervalUnit: u })}
              className={cn(
                'flex-1 py-1 rounded-full text-[9px] font-semibold transition-colors',
                item.intervalUnit === u
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-white/5 text-white/40'
              )}
            >
              {UNIT_LABELS[u]}
            </button>
          ))}
        </div>
        <button
          onClick={() => deleteMaintenance(item.id)}
          className="flex items-center justify-center gap-1 text-[9px] text-red-400/70 hover:text-red-400 transition-colors pt-1 border-t border-white/5"
        >
          <Trash2 className="w-3 h-3" /> מחק
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] p-4 rounded-[2rem] border border-white/5 min-w-[130px] flex flex-col items-center shrink-0 snap-center">
      <div className="relative mb-2">
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
      <span className="text-[8px] text-white/30 mt-0.5">
        כל {item.intervalValue} {UNIT_LABELS[item.intervalUnit]}
      </span>
      {isCritical && (
        <span className="text-[8px] text-red-400 uppercase tracking-widest mt-1">דחוף</span>
      )}
      <button
        onClick={handleReset}
        disabled={isResetting}
        className="mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/50 active:scale-95 transition-all hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/20"
      >
        {isResetting ? '✓' : 'ניקיתי'}
      </button>
    </div>
  );
}

function BeanRow({ bean, editMode }: { bean: CoffeeBag; editMode: boolean }) {
  const { updateBean, deleteBean } = useStore();
  const [open, setOpen] = useState(false);
  const roastAge = bean.roastDate
    ? Math.floor((Date.now() - new Date(bean.roastDate).getTime()) / 86400000)
    : null;
  const isFresh = roastAge !== null && roastAge <= 21 && roastAge >= 5;

  if (editMode) {
    const tp = bean.tasteProfile ?? { acidity: 0, body: 0, sweetness: 0, bitterness: 0 };
    const setTaste = (key: keyof typeof tp, v: number) =>
      updateBean(bean.id, { tasteProfile: { ...tp, [key]: v } });

    return (
      <Card className="p-4 border-[#D4AF37]/30 space-y-3">
        {/* Name */}
        <input
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F5F5F5] w-full text-right"
          value={bean.name}
          onChange={(e) => updateBean(bean.id, { name: e.target.value })}
        />

        {/* Weight + Price */}
        <div className="grid grid-cols-2 gap-2">
          <BeanStepper
            label="g"
            value={bean.weight}
            step={10}
            min={0}
            onChange={(v) => updateBean(bean.id, { weight: v })}
          />
          <BeanStepper
            label="₪"
            value={bean.price}
            step={5}
            min={0}
            onChange={(v) => updateBean(bean.id, { price: v })}
          />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 shrink-0">דירוג</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => updateBean(bean.id, { rating: i + 1 })}
                className={cn('text-lg transition-opacity', i < bean.rating ? 'text-[#D4AF37]' : 'text-white/20')}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Origin + Roaster */}
        <div className="grid grid-cols-2 gap-2">
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#F5F5F5] text-right"
            placeholder="מקור"
            value={bean.origin}
            onChange={(e) => updateBean(bean.id, { origin: e.target.value })}
          />
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#F5F5F5] text-right"
            placeholder="קלייה"
            value={bean.roaster}
            onChange={(e) => updateBean(bean.id, { roaster: e.target.value })}
          />
        </div>

        {/* Notes */}
        <textarea
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F5F5] w-full text-right resize-none leading-relaxed"
          rows={2}
          placeholder="הערות..."
          value={bean.notes ?? ''}
          onChange={(e) => updateBean(bean.id, { notes: e.target.value })}
        />

        {/* Taste profile */}
        <div className="space-y-2 pt-1">
          <span className="text-[9px] uppercase tracking-widest text-white/30">פרופיל טעמים</span>
          <TasteBar label="חומציות" value={tp.acidity} onChange={(v) => setTaste('acidity', v)} />
          <TasteBar label="גוף" value={tp.body} onChange={(v) => setTaste('body', v)} />
          <TasteBar label="מתיקות" value={tp.sweetness} onChange={(v) => setTaste('sweetness', v)} />
          <TasteBar label="מרירות" value={tp.bitterness} onChange={(v) => setTaste('bitterness', v)} />
        </div>

        {/* Delete */}
        <button
          onClick={() => deleteBean(bean.id)}
          className="flex items-center justify-center gap-1 text-[9px] text-red-400/70 hover:text-red-400 transition-colors pt-2 border-t border-white/5 w-full"
        >
          <Trash2 className="w-3 h-3" /> מחק פול
        </button>
      </Card>
    );
  }

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

function BeanStepper({
  label,
  value,
  step,
  min,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 justify-between">
      <button
        className="w-5 h-5 flex items-center justify-center text-white/50 hover:text-white"
        onClick={() => onChange(Math.max(min, value - step))}
      >−</button>
      <span className="text-xs font-mono-num text-white">
        {value}<span className="text-white/40 ml-0.5">{label}</span>
      </span>
      <button
        className="w-5 h-5 flex items-center justify-center text-white/50 hover:text-white"
        onClick={() => onChange(value + step)}
      >+</button>
    </div>
  );
}

function TasteBar({ label, value, onChange }: { label: string; value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-white/50 w-16 shrink-0">{label}</span>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-colors',
              i < value ? 'bg-[#D4AF37]' : 'bg-white/10',
              onChange && 'cursor-pointer hover:bg-[#D4AF37]/50'
            )}
          />
        ))}
      </div>
    </div>
  );
}
