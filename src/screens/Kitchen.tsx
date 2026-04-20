import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, InventoryItem, ApplianceHealth, ShoppingItem } from '@/src/data/store';
import {
  Plus,
  Minus,
  ShoppingCart,
  AlertTriangle,
  Trash2,
  Snowflake,
  Apple,
  Package,
  Milk,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  Card,
  SectionHeader,
  ProgressBar,
  StatTile,
  Badge,
  DashboardFrame,
  Tabs,
} from '@/src/components/ui/primitives';

const CAT_ICON = {
  dairy: Milk,
  produce: Apple,
  frozen: Snowflake,
  pantry: Package,
  other: Package,
} as const;

const CAT_LABEL: Record<string, string> = {
  dairy: 'חלבי',
  produce: 'ירקות/פירות',
  frozen: 'קפוא',
  pantry: 'מזווה',
  other: 'שונות',
};

export function KitchenDashboard({ onBack, color }: { onBack: () => void; color: string }) {
  const {
    inventory,
    applianceHealth,
    shopping,
    updateInventoryQty,
    resetAppliance,
    toggleShopping,
    clearCheckedShopping,
  } = useStore();

  const [tab, setTab] = useState<'inventory' | 'shopping' | 'appliances'>('inventory');

  const expiringSoon = inventory.filter(
    (i) => i.expiryDate && new Date(i.expiryDate).getTime() - Date.now() < 86400000 * 3
  );
  const lowStock = inventory.filter((i) => i.quantity <= 1);
  const uncheckedShopping = shopping.filter((s) => !s.checked);

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="מטבח חכם"
      subtitle="מלאי ומכשירי חשמל"
      layoutIdBase="kitchen"
      headerExtra={
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="פריטים" value={inventory.length} icon={Package} />
          <StatTile label="קרובים לתפוגה" value={expiringSoon.length} icon={AlertTriangle} color="#F59E0B" />
          <StatTile label="רשימת קניות" value={uncheckedShopping.length} icon={ShoppingCart} />
        </div>
      }
    >
      <Tabs
        tabs={[
          { id: 'inventory', label: 'מלאי', count: inventory.length },
          { id: 'shopping', label: 'קניות', count: uncheckedShopping.length },
          { id: 'appliances', label: 'מכשירים', count: applianceHealth.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Alerts strip */}
      {(expiringSoon.length > 0 || lowStock.length > 0) && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              {expiringSoon.length > 0 && (
                <p>
                  <span className="text-amber-300 font-semibold">{expiringSoon.length} פריטים</span>{' '}
                  <span className="text-white/70">קרובים לתפוגה</span>
                </p>
              )}
              {lowStock.length > 0 && (
                <p>
                  <span className="text-amber-300 font-semibold">{lowStock.length} פריטים</span>{' '}
                  <span className="text-white/70">עם מלאי נמוך</span>
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {tab === 'inventory' && (
        <section>
          <SectionHeader
            title="מלאי מטבח"
            subtitle={`${inventory.length} פריטים במעקב`}
            action={{ label: 'הוסף', onClick: () => {} }}
          />
          <div className="flex flex-col gap-3">
            {inventory.map((item) => (
              <InventoryRow
                key={item.id}
                item={item}
                onUpdate={(delta) => updateInventoryQty(item.id, delta)}
              />
            ))}
          </div>
        </section>
      )}

      {tab === 'shopping' && (
        <section>
          <SectionHeader
            title="רשימת קניות"
            subtitle={`${uncheckedShopping.length} לקנות · ${shopping.length - uncheckedShopping.length} סומנו`}
            action={
              shopping.length !== uncheckedShopping.length
                ? { label: 'נקה', onClick: clearCheckedShopping, icon: Trash2 }
                : { label: 'הוסף', onClick: () => {} }
            }
          />
          <div className="flex flex-col gap-2">
            {shopping.length === 0 ? (
              <Card className="text-center py-8">
                <ShoppingCart className="w-6 h-6 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">הרשימה ריקה</p>
              </Card>
            ) : (
              shopping.map((item) => (
                <ShoppingRow key={item.id} item={item} onToggle={() => toggleShopping(item.id)} />
              ))
            )}
          </div>
        </section>
      )}

      {tab === 'appliances' && (
        <section>
          <SectionHeader title="בריאות מכשירים" subtitle="מעקב חומרים מתכלים" />
          <div className="grid grid-cols-2 gap-3">
            {applianceHealth.map((item) => (
              <ApplianceCard key={item.id} item={item} onReset={() => resetAppliance(item.id)} />
            ))}
          </div>
        </section>
      )}
    </DashboardFrame>
  );
}

function InventoryRow({
  item,
  onUpdate,
}: {
  item: InventoryItem;
  onUpdate: (delta: number) => void;
}) {
  const Icon = CAT_ICON[item.category];
  const daysToExpiry = item.expiryDate
    ? Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / 86400000)
    : null;
  const urgent = daysToExpiry !== null && daysToExpiry <= 3;

  return (
    <Card className={cn('flex items-center justify-between gap-3', urgent && 'border-amber-500/30')}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{item.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/40">
            <span>{CAT_LABEL[item.category]}</span>
            {daysToExpiry !== null && (
              <Badge variant={urgent ? 'warn' : 'default'}>
                {daysToExpiry < 0 ? 'פג' : `${daysToExpiry} ימים`}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-full border border-white/5 shrink-0">
        <button
          onClick={() => onUpdate(-1)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#D4AF37]/60 hover:text-[#D4AF37] hover:bg-white/5 transition-colors active:scale-90"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={item.quantity}
            initial={{ opacity: 0, scale: 0.5, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 6 }}
            className="w-10 text-center font-mono-num font-bold text-sm leading-none"
          >
            {item.quantity}
            <span className="text-[9px] text-white/40 block">{item.unit}</span>
          </motion.span>
        </AnimatePresence>
        <button
          onClick={() => onUpdate(1)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#D4AF37]/60 hover:text-[#D4AF37] hover:bg-white/5 transition-colors active:scale-90"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}

function ShoppingRow({ item, onToggle }: { item: ShoppingItem; onToggle: () => void }) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl border text-right transition-all',
        item.checked
          ? 'bg-[#0A0A0A] border-white/5 opacity-60'
          : 'bg-[#111111] border-white/5 hover:border-[#D4AF37]/30'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
          item.checked ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/30'
        )}
      >
        {item.checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 text-right">
        <span
          className={cn(
            'text-sm font-medium',
            item.checked ? 'line-through text-white/40' : 'text-white'
          )}
        >
          {item.name}
        </span>
        <span className="text-[10px] text-white/40 block">{item.category}</span>
      </div>
      <span className="text-xs font-mono-num text-[#D4AF37]">×{item.quantity}</span>
    </motion.button>
  );
}

function ApplianceCard({ item, onReset }: { item: ApplianceHealth; onReset: () => void }) {
  const critical = item.progress < 30;
  return (
    <div className="bg-[#111111] rounded-3xl p-4 border border-white/5 flex flex-col justify-between aspect-square relative overflow-hidden">
      <div className="z-10 flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold leading-tight">
          {item.name}
        </span>
        {critical && <Badge variant="danger">נמוך</Badge>}
      </div>
      <div className="flex flex-col z-10 mt-auto gap-2">
        <span className="text-3xl font-display font-light">{item.progress}%</span>
        <ProgressBar progress={item.progress} critical={critical} height={4} />
        <button
          onClick={onReset}
          className="mt-1 text-[10px] text-[#D4AF37] text-right underline underline-offset-2 opacity-80 hover:opacity-100 active:scale-95 transition-transform"
        >
          מילוי/החלפה
        </button>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-[#D4AF37]/5 z-0"
        initial={{ height: 0 }}
        animate={{ height: `${item.progress}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}
