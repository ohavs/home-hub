import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Utensils, Home as HomeIcon, Wallet, Heart, Bell, Calendar, CreditCard } from 'lucide-react';
import { useStore } from '@/src/data/store';
import { Badge } from '@/src/components/ui/primitives';

interface HubProps {
  onSelect: (id: string, color: string) => void;
}

export const DASHBOARDS = [
  { id: 'coffee', name: 'מרכז הקפה', subtitle: 'תחזוקה ומלאי פולים', icon: Coffee, color: '#382a20' },
  { id: 'kitchen', name: 'מטבח חכם', subtitle: 'מלאי ומכשירי חשמל', icon: Utensils, color: '#1a332d' },
  { id: 'home', name: 'ניהול הבית', subtitle: 'תחזוקה ומשימות', icon: HomeIcon, color: '#1e2025' },
  { id: 'finance', name: 'כספים', subtitle: 'תקציב והוצאות', icon: Wallet, color: '#2a2440' },
  { id: 'subscriptions', name: 'מנויים', subtitle: 'חיובים חוזרים', icon: CreditCard, color: '#1e3040' },
  { id: 'wellness', name: 'בריאות', subtitle: 'כושר ושגרה', icon: Heart, color: '#3a2530' },
] as const;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'לילה טוב';
  if (hour < 12) return 'בוקר טוב';
  if (hour < 17) return 'צהריים טובים';
  if (hour < 21) return 'ערב טוב';
  return 'לילה טוב';
}

function formatHebrewDate() {
  const d = new Date();
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function Hub({ onSelect }: HubProps) {
  const {
    maintenance,
    beans,
    dailyTasks,
    bills,
    inventory,
    shopping,
    medications,
    subscriptions,
  } = useStore();

  // Alert counts per dashboard
  const coffeeAlerts = maintenance.filter((m) => m.progress >= 90).length;
  const kitchenAlerts =
    inventory.filter(
      (i) =>
        i.expiryDate && new Date(i.expiryDate).getTime() - Date.now() < 86400000 * 3
    ).length + shopping.filter((s) => !s.checked).length;
  const homeAlerts = dailyTasks.filter((t) => !t.completed && t.frequency === 'daily').length;
  const billsDue = bills.filter((b) => !b.paid).length;
  const wellnessAlerts = medications.filter((m) => !m.taken && m.frequency === 'daily').length;
  const upcomingSubs = subscriptions.filter(
    (s) =>
      s.active &&
      new Date(s.nextCharge).getTime() - Date.now() < 86400000 * 7 &&
      new Date(s.nextCharge).getTime() - Date.now() >= 0
  ).length;

  const alertMap: Record<string, number> = {
    coffee: coffeeAlerts,
    kitchen: kitchenAlerts,
    home: homeAlerts,
    finance: billsDue,
    subscriptions: upcomingSubs,
    wellness: wellnessAlerts,
  };

  const totalBeanWeight = beans.reduce((sum, b) => sum + b.weight, 0);
  const openTasks = dailyTasks.filter((t) => !t.completed).length;
  const criticalMaint = maintenance.filter((m) => m.progress >= 100).length;
  const monthlySubsCost = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => {
      if (s.cycle === 'yearly') return sum + s.amount / 12;
      if (s.cycle === 'weekly') return sum + s.amount * 4.33;
      return sum + s.amount;
    }, 0);

  return (
    <div className="flex flex-col w-full h-full pt-10 text-[#F5F5F5] z-10 overflow-y-auto hide-scrollbar">
      {/* Header */}
      <header className="px-6 mb-6 flex items-start justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 mb-1 block font-semibold">
            {getGreeting()}
          </span>
          <h1 className="text-4xl font-display font-light tracking-tight">Master Home</h1>
          <div className="flex items-center gap-2 mt-2 text-white/50 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatHebrewDate()}</span>
          </div>
        </div>
        <button
          className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative"
          aria-label="התראות"
        >
          <Bell className="w-5 h-5 text-[#D4AF37]" />
          {(coffeeAlerts + kitchenAlerts + homeAlerts + billsDue + wellnessAlerts + upcomingSubs) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
              {coffeeAlerts + kitchenAlerts + homeAlerts + billsDue + wellnessAlerts + upcomingSubs}
            </span>
          )}
        </button>
      </header>

      {/* Quick stats */}
      <div className="px-6 grid grid-cols-3 gap-3 mb-8">
        <StatCard label="פולים" value={`${totalBeanWeight}g`} tone="gold" />
        <StatCard label="משימות פתוחות" value={openTasks} tone={openTasks > 2 ? 'warn' : 'gold'} />
        <StatCard label="תחזוקה דחופה" value={criticalMaint} tone={criticalMaint > 0 ? 'danger' : 'muted'} />
      </div>

      {/* Dashboards carousel */}
      <div className="mb-3 px-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
          הדשבורדים שלי
        </span>
      </div>
      <div className="flex w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory px-6 gap-5 pb-6 items-center">
        {DASHBOARDS.map((dash, index) => (
          <motion.div
            key={dash.id}
            layoutId={`card-container-${dash.id}`}
            onClick={() => onSelect(dash.id, dash.color)}
            className="shrink-0 w-[260px] h-[360px] rounded-[32px] snap-center p-6 flex flex-col justify-between cursor-pointer border border-white/5 relative overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${dash.color}dd 0%, #111111 85%)`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            }}
            whileHover={{ scale: 1.02, rotateY: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', damping: 20, stiffness: 100 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            {/* Pattern */}
            <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

            <div className="flex items-start justify-between z-10 relative">
              <motion.div
                layoutId={`card-icon-${dash.id}`}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-xl"
              >
                <dash.icon className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
              </motion.div>
              {alertMap[dash.id] > 0 && (
                <Badge variant={alertMap[dash.id] > 2 ? 'danger' : 'warn'}>
                  {alertMap[dash.id]} פעולות
                </Badge>
              )}
            </div>

            <div className="z-10 relative">
              <motion.span
                layoutId={`card-sub-${dash.id}`}
                className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] opacity-90 block mb-2 font-semibold"
              >
                {dash.subtitle}
              </motion.span>
              <motion.h2
                layoutId={`card-title-${dash.id}`}
                className="text-3xl font-display font-light tracking-tight"
              >
                {dash.name}
              </motion.h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar: daily snapshot */}
      <div className="px-6 mt-2 mb-8">
        <div className="bg-[#111111] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">היום בקצרה</span>
            <span className="text-[10px] text-white/40">{new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <SnapshotRow label="משימות יומי" value={`${dailyTasks.filter(t=>t.completed && t.frequency==='daily').length}/${dailyTasks.filter(t=>t.frequency==='daily').length}`} />
            <SnapshotRow label="חשבונות לתשלום" value={billsDue.toString()} danger={billsDue > 0} />
            <SnapshotRow label="מנויים/חודש" value={`₪${Math.round(monthlySubsCost)}`} />
            <SnapshotRow label="תרופות נותרו" value={wellnessAlerts.toString()} danger={wellnessAlerts > 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: 'gold' | 'warn' | 'danger' | 'muted';
}) {
  const toneColors = {
    gold: 'text-[#D4AF37]',
    warn: 'text-amber-400',
    danger: 'text-red-400',
    muted: 'text-white/60',
  };
  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
      <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1">{label}</span>
      <span className={`text-2xl font-display font-light ${toneColors[tone]}`}>{value}</span>
    </div>
  );
}

function SnapshotRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60">{label}</span>
      <span className={`font-mono-num font-bold ${danger ? 'text-red-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}
