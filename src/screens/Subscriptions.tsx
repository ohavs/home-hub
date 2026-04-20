import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Subscription, SubscriptionCategory } from '@/src/data/store';
import {
  Tv,
  Music,
  Cloud,
  Newspaper,
  Dumbbell,
  Package,
  AlertTriangle,
  RotateCw,
  Power,
  Zap,
  Calendar,
  TrendingDown,
  ChevronDown,
  Star,
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

const CATEGORY_ICON: Record<SubscriptionCategory, any> = {
  entertainment: Tv,
  music: Music,
  cloud: Cloud,
  news: Newspaper,
  fitness: Dumbbell,
  software: Zap,
  other: Package,
};

const CATEGORY_LABEL: Record<SubscriptionCategory, string> = {
  entertainment: 'בידור',
  music: 'מוזיקה',
  cloud: 'ענן',
  news: 'חדשות',
  fitness: 'כושר',
  software: 'תוכנה',
  other: 'שונות',
};

function monthlyCost(sub: Subscription): number {
  if (!sub.active) return 0;
  if (sub.cycle === 'yearly') return sub.amount / 12;
  if (sub.cycle === 'weekly') return sub.amount * 4.33;
  return sub.amount;
}

export function SubscriptionsDashboard({ onBack, color }: { onBack: () => void; color: string }) {
  const { subscriptions, toggleSubscription, toggleAutoRenew, renewSubscription } = useStore();
  const [filter, setFilter] = useState<'active' | 'all' | 'unused'>('active');

  const active = subscriptions.filter((s) => s.active);
  const unused = subscriptions.filter((s) => s.active && (s.usageRating ?? 3) <= 2);
  const filtered =
    filter === 'active'
      ? active
      : filter === 'unused'
      ? unused
      : subscriptions;

  const totalMonthly = active.reduce((s, sub) => s + monthlyCost(sub), 0);
  const totalYearly = totalMonthly * 12;
  const wasteMonthly = unused.reduce((s, sub) => s + monthlyCost(sub), 0);

  const upcomingWeek = active.filter((s) => {
    const days = (new Date(s.nextCharge).getTime() - Date.now()) / 86400000;
    return days <= 7 && days >= 0;
  });
  const upcomingCost = upcomingWeek.reduce((s, sub) => s + sub.amount, 0);

  // Group by category for breakdown
  const byCategory = active.reduce<Record<string, number>>((acc, sub) => {
    acc[sub.category] = (acc[sub.category] ?? 0) + monthlyCost(sub);
    return acc;
  }, {});

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="מנויים"
      subtitle="חיובים חוזרים"
      layoutIdBase="subscriptions"
      headerExtra={
        <div className="grid grid-cols-3 gap-2">
          <StatTile
            label="לחודש"
            value={`₪${Math.round(totalMonthly)}`}
            icon={TrendingDown}
            color="#EF4444"
          />
          <StatTile
            label="לשנה"
            value={`₪${Math.round(totalYearly).toLocaleString()}`}
            icon={Calendar}
          />
          <StatTile
            label="פעילים"
            value={`${active.length}/${subscriptions.length}`}
            icon={Power}
            color="#10B981"
          />
        </div>
      }
    >
      {/* Upcoming renewals alert */}
      {upcomingWeek.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="text-amber-300 font-semibold mb-1">
                {upcomingWeek.length} חיובים בשבוע הקרוב
              </p>
              <p className="text-white/60">
                סה״כ{' '}
                <span className="text-amber-300 font-mono-num font-bold">
                  ₪{upcomingCost.toFixed(0)}
                </span>{' '}
                · הקרוב ביותר:{' '}
                <span className="text-white">
                  {upcomingWeek.sort(
                    (a, b) =>
                      new Date(a.nextCharge).getTime() - new Date(b.nextCharge).getTime()
                  )[0].name}
                </span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Waste alert */}
      {unused.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="text-red-300 font-semibold mb-1">
                פוטנציאל חיסכון: ₪{(wasteMonthly * 12).toFixed(0)}/שנה
              </p>
              <p className="text-white/60">
                {unused.length} מנויים עם שימוש נמוך — שווה לבחון ביטול
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Category breakdown */}
      <section>
        <SectionHeader title="חלוקה לפי קטגוריה" subtitle="עלות חודשית" />
        <Card>
          <div className="space-y-3">
            {Object.entries(byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, cost]) => {
                const Icon = CATEGORY_ICON[cat as SubscriptionCategory] ?? Package;
                const pct = (cost / totalMonthly) * 100;
                const count = active.filter((s) => s.category === cat).length;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-xs">
                          {CATEGORY_LABEL[cat as SubscriptionCategory]}
                        </span>
                        <span className="text-[10px] text-white/40">· {count}</span>
                      </div>
                      <span className="text-[11px] font-mono-num text-white/70">
                        ₪{cost.toFixed(0)}/חודש
                      </span>
                    </div>
                    <ProgressBar progress={pct} height={3} color="#D4AF37" />
                  </div>
                );
              })}
          </div>
        </Card>
      </section>

      {/* Subscriptions list */}
      <section>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              רשימת המנויים
            </h2>
            <p className="text-[10px] text-white/40 mt-0.5">{filtered.length} פריטים</p>
          </div>
          <Tabs
            tabs={[
              { id: 'active', label: 'פעילים', count: active.length },
              { id: 'unused', label: 'לא בשימוש', count: unused.length },
              { id: 'all', label: 'הכול', count: subscriptions.length },
            ]}
            active={filter}
            onChange={setFilter}
          />
        </div>
        <div className="flex flex-col gap-3">
          {filtered
            .sort(
              (a, b) =>
                new Date(a.nextCharge).getTime() - new Date(b.nextCharge).getTime()
            )
            .map((sub) => (
              <SubRow
                key={sub.id}
                sub={sub}
                onToggle={() => toggleSubscription(sub.id)}
                onToggleAutoRenew={() => toggleAutoRenew(sub.id)}
                onRenew={() => renewSubscription(sub.id)}
              />
            ))}
        </div>
      </section>
    </DashboardFrame>
  );
}

function SubRow({
  sub,
  onToggle,
  onToggleAutoRenew,
  onRenew,
}: {
  sub: Subscription;
  onToggle: () => void;
  onToggleAutoRenew: () => void;
  onRenew: () => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = CATEGORY_ICON[sub.category] ?? Package;
  const daysToCharge = Math.ceil(
    (new Date(sub.nextCharge).getTime() - Date.now()) / 86400000
  );
  const urgent = daysToCharge <= 3 && daysToCharge >= 0;
  const overdue = daysToCharge < 0;
  const unused = (sub.usageRating ?? 3) <= 2;
  const mCost = monthlyCost(sub);

  return (
    <Card
      className={cn(
        'p-0 overflow-hidden',
        !sub.active && 'opacity-50',
        urgent && 'border-amber-500/30',
        overdue && 'border-red-500/30'
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-right flex items-center gap-3 p-4"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: sub.color + '20',
            borderColor: sub.color + '40',
          }}
        >
          <Icon className="w-5 h-5" style={{ color: sub.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{sub.name}</span>
            {!sub.active && <Badge>מושהה</Badge>}
            {unused && sub.active && <Badge variant="warn">שימוש נמוך</Badge>}
            {!sub.autoRenew && sub.active && <Badge variant="info">לא מתחדש</Badge>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-white/40">
              {CATEGORY_LABEL[sub.category]}
            </span>
            <span className="text-[10px] text-white/30">·</span>
            {overdue ? (
              <span className="text-[10px] text-red-400">
                חיוב באיחור {Math.abs(daysToCharge)} ימים
              </span>
            ) : urgent ? (
              <span className="text-[10px] text-amber-400">
                חיוב בעוד {daysToCharge} ימים
              </span>
            ) : (
              <span className="text-[10px] text-white/40">
                חיוב בעוד {daysToCharge} ימים
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="font-display text-lg leading-none">
            ₪{sub.amount.toFixed(sub.amount % 1 === 0 ? 0 : 2)}
          </span>
          <span className="text-[10px] text-white/40 mt-0.5">
            {sub.cycle === 'monthly' ? '/חודש' : sub.cycle === 'yearly' ? '/שנה' : '/שבוע'}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/40 transition-transform shrink-0 mr-1',
            open && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 space-y-4">
              {/* Usage rating */}
              {sub.usageRating !== undefined && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                    איך אני משתמש
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < (sub.usageRating ?? 0)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-white/15'
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {sub.notes && (
                <p className="text-xs text-white/70 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  {sub.notes}
                </p>
              )}

              {/* Cost breakdown */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-widest text-white/40 block">
                    עלות חודשית
                  </span>
                  <span className="font-mono-num text-sm font-bold text-[#D4AF37]">
                    ₪{mCost.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-widest text-white/40 block">
                    עלות שנתית
                  </span>
                  <span className="font-mono-num text-sm font-bold">
                    ₪{(mCost * 12).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onRenew}
                  className="flex-1 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <RotateCw className="w-3 h-3" /> סמן כחודש
                </button>
                <button
                  onClick={onToggleAutoRenew}
                  className={cn(
                    'flex-1 h-9 rounded-full border text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform',
                    sub.autoRenew
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-white/70'
                  )}
                >
                  <RotateCw className="w-3 h-3" />
                  {sub.autoRenew ? 'מתחדש אוטו׳' : 'ללא חידוש'}
                </button>
                <button
                  onClick={onToggle}
                  className={cn(
                    'flex-1 h-9 rounded-full border text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform',
                    sub.active
                      ? 'bg-red-500/15 border-red-500/30 text-red-300'
                      : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  )}
                >
                  <Power className="w-3 h-3" />
                  {sub.active ? 'השהה' : 'הפעל'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
