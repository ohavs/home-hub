import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Plus, LucideIcon } from 'lucide-react';

// ─────────────────────────────────────────
// Card
// ─────────────────────────────────────────
export function Card({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#111111] rounded-2xl p-4 border border-white/5 relative overflow-hidden',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// SectionHeader
// ─────────────────────────────────────────
export function SectionHeader({
  title,
  action,
  subtitle,
}: {
  title: string;
  action?: { label: string; onClick: () => void; icon?: LucideIcon };
  subtitle?: string;
}) {
  const ActionIcon = action?.icon ?? Plus;
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">{title}</h2>
        {subtitle && <p className="text-[10px] text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[10px] text-white/60 hover:text-white flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/5"
        >
          <ActionIcon className="w-3 h-3" /> {action.label}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ProgressRing
// ─────────────────────────────────────────
export function ProgressRing({
  progress,
  size = 56,
  stroke = 4,
  color = '#D4AF37',
  bg = '#1A1A1A',
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  bg?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bg} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────
// Progress Bar (linear)
// ─────────────────────────────────────────
export function ProgressBar({
  progress,
  color,
  height = 6,
  critical,
}: {
  progress: number;
  color?: string;
  height?: number;
  critical?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, progress));
  const barColor = color ?? (critical || clamped < 30 ? '#EF4444' : '#D4AF37');
  return (
    <div
      className="w-full bg-black/50 rounded-full overflow-hidden border border-white/5"
      style={{ height }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: barColor }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────
// Stat Tile
// ─────────────────────────────────────────
export function StatTile({
  label,
  value,
  icon: Icon,
  trend,
  color = '#D4AF37',
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#111111] rounded-2xl p-3 border border-white/5 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] uppercase tracking-widest text-white/40 truncate">{label}</span>
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-light text-white leading-none">{value}</span>
      </div>
      {trend && <span className="text-[9px] text-white/40 mt-1 block">{trend}</span>}
    </div>
  );
}

// ─────────────────────────────────────────
// Badge
// ─────────────────────────────────────────
export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'success' | 'warn' | 'info';
  className?: string;
}) {
  const variants = {
    default: 'bg-white/10 text-white/70 border-white/10',
    danger: 'bg-red-500/15 text-red-300 border-red-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warn: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    info: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-widest font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────
// Dashboard Page Frame
// ─────────────────────────────────────────
export function DashboardFrame({
  onBack,
  color,
  title,
  subtitle,
  layoutIdBase,
  children,
  headerExtra,
}: {
  onBack: () => void;
  color: string;
  title: string;
  subtitle: string;
  layoutIdBase: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex flex-col bg-[#050505] overflow-y-auto hide-scrollbar z-50 text-[#F5F5F5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 200) onBack();
      }}
    >
      <motion.header
        layoutId={`card-container-${layoutIdBase}`}
        className="w-full pt-16 pb-8 px-6 relative shrink-0 rounded-b-[40px] border-b border-white/5"
        style={{ background: `linear-gradient(145deg, ${color}dd 0%, #111111 100%)` }}
      >
        <button
          onClick={onBack}
          className="absolute top-6 right-6 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 z-20 active:scale-90 transition-transform"
          aria-label="חזרה"
        >
          <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="flex flex-col z-10 relative mt-4">
          <motion.span
            layoutId={`card-sub-${layoutIdBase}`}
            className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-2 drop-shadow-md font-semibold"
          >
            {subtitle}
          </motion.span>
          <motion.h1
            layoutId={`card-title-${layoutIdBase}`}
            className="text-4xl font-display font-light tracking-tight drop-shadow-md"
          >
            {title}
          </motion.h1>
          {headerExtra && <div className="mt-4">{headerExtra}</div>}
        </div>
      </motion.header>

      <div className="flex-1 px-6 py-6 pb-24 space-y-8">{children}</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// Tab switcher
// ─────────────────────────────────────────
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: NoInfer<T>; label: string; count?: number }[];
  active: T;
  onChange: (id: NoInfer<T>) => void;
}) {
  return (
    <div className="flex gap-2 p-1 bg-[#111111] rounded-full border border-white/5 w-fit">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'relative px-4 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
            active === t.id ? 'text-black' : 'text-white/60 hover:text-white'
          )}
        >
          {active === t.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-[#D4AF37] rounded-full"
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  'text-[9px] px-1.5 py-0.5 rounded-full',
                  active === t.id ? 'bg-black/20' : 'bg-white/10'
                )}
              >
                {t.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
