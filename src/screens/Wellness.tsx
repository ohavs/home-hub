import React from 'react';
import { motion } from 'motion/react';
import { useStore, Medication } from '@/src/data/store';
import {
  Heart,
  Droplets,
  Moon,
  Activity,
  Pill,
  Smile,
  Frown,
  Meh,
  Plus,
  Minus,
  Dumbbell,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  Card,
  SectionHeader,
  ProgressBar,
  ProgressRing,
  StatTile,
  Badge,
  DashboardFrame,
} from '@/src/components/ui/primitives';

const WATER_GOAL = 8;
const SLEEP_GOAL = 8;

export function WellnessDashboard({ onBack, color }: { onBack: () => void; color: string }) {
  const {
    waterLogs,
    sleepLogs,
    workouts,
    medications,
    moodLogs,
    addWater,
    toggleMedication,
    setMood,
  } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterLogs.find((w) => w.date === today)?.cups ?? 0;
  const lastSleep = sleepLogs[sleepLogs.length - 1]?.hours ?? 0;
  const todayMood = moodLogs.find((m) => m.date === today)?.mood;

  const weeklyWorkouts = workouts.filter((w) => {
    const diff = (Date.now() - new Date(w.date).getTime()) / 86400000;
    return diff < 7;
  });
  const weeklyWorkoutMinutes = weeklyWorkouts.reduce((s, w) => s + w.duration, 0);

  const medsTaken = medications.filter((m) => m.taken).length;
  const avgSleep =
    sleepLogs.length > 0
      ? sleepLogs.reduce((s, l) => s + l.hours, 0) / sleepLogs.length
      : 0;

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="בריאות"
      subtitle="כושר ושגרה"
      layoutIdBase="wellness"
      headerExtra={
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="מים היום" value={`${todayWater}/${WATER_GOAL}`} icon={Droplets} color="#60A5FA" />
          <StatTile label="שינה אחרונה" value={`${lastSleep}h`} icon={Moon} color="#A78BFA" />
          <StatTile label="אימונים השבוע" value={weeklyWorkouts.length} icon={Dumbbell} color="#10B981" />
        </div>
      }
    >
      {/* Water */}
      <section>
        <SectionHeader title="צריכת מים" subtitle={`יעד יומי: ${WATER_GOAL} כוסות`} />
        <Card className="p-5">
          <div className="flex items-center gap-5">
            <ProgressRing
              progress={(todayWater / WATER_GOAL) * 100}
              size={80}
              color="#60A5FA"
            >
              <div className="text-center">
                <div className="text-xl font-display font-bold">{todayWater}</div>
                <div className="text-[8px] text-white/40 uppercase tracking-widest">כוסות</div>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {Array.from({ length: WATER_GOAL }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => addWater(i < todayWater ? -1 : 1)}
                    className={cn(
                      'w-7 h-9 rounded-lg border transition-all active:scale-90',
                      i < todayWater
                        ? 'bg-blue-500/30 border-blue-400'
                        : 'bg-white/5 border-white/10'
                    )}
                    aria-label={`כוס ${i + 1}`}
                  >
                    <Droplets
                      className={cn(
                        'w-3 h-3 mx-auto',
                        i < todayWater ? 'text-blue-300' : 'text-white/30'
                      )}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addWater(-1)}
                  className="flex-1 h-9 rounded-full bg-white/5 border border-white/10 text-white/60 flex items-center justify-center gap-1 active:scale-95 text-xs"
                >
                  <Minus className="w-3 h-3" /> כוס
                </button>
                <button
                  onClick={() => addWater(1)}
                  className="flex-1 h-9 rounded-full bg-[#60A5FA] text-black flex items-center justify-center gap-1 active:scale-95 text-xs font-bold"
                >
                  <Plus className="w-3 h-3" /> כוס
                </button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Mood */}
      <section>
        <SectionHeader title="מצב רוח היום" />
        <Card>
          <div className="flex items-center justify-between gap-2">
            {[1, 2, 3, 4, 5].map((score) => {
              const Icon = score <= 2 ? Frown : score === 3 ? Meh : Smile;
              const active = todayMood === score;
              const color =
                score <= 2
                  ? '#EF4444'
                  : score === 3
                  ? '#F59E0B'
                  : score === 4
                  ? '#10B981'
                  : '#D4AF37';
              return (
                <button
                  key={score}
                  onClick={() => setMood(score as 1 | 2 | 3 | 4 | 5)}
                  className={cn(
                    'flex-1 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95',
                    active ? 'bg-white/10' : 'border-white/5 bg-white/[0.02]'
                  )}
                  style={{
                    borderColor: active ? color : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: active ? color : 'rgba(255,255,255,0.3)' }}
                  />
                  <span
                    className="text-[9px] font-bold"
                    style={{ color: active ? color : 'rgba(255,255,255,0.4)' }}
                  >
                    {score}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Sleep */}
      <section>
        <SectionHeader
          title="שינה"
          subtitle={`ממוצע שבוע: ${avgSleep.toFixed(1)}h · יעד ${SLEEP_GOAL}h`}
        />
        <Card>
          <div className="flex items-end justify-between gap-1.5 h-24">
            {sleepLogs.slice(-7).map((log, i) => {
              const pct = Math.min(100, (log.hours / 10) * 100);
              const good = log.hours >= SLEEP_GOAL;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex-1 bg-white/5 rounded-t-lg relative overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className={cn(
                        'absolute bottom-0 left-0 right-0 rounded-t-lg',
                        good ? 'bg-purple-500' : 'bg-purple-500/40'
                      )}
                    />
                  </div>
                  <span className="text-[9px] font-mono-num text-white/60">{log.hours}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Medications */}
      <section>
        <SectionHeader
          title="תרופות ותוספים"
          subtitle={`${medsTaken}/${medications.length} נלקחו היום`}
        />
        <div className="flex flex-col gap-2">
          {medications.map((med) => (
            <MedRow key={med.id} med={med} onToggle={() => toggleMedication(med.id)} />
          ))}
        </div>
      </section>

      {/* Workouts */}
      <section>
        <SectionHeader
          title="פעילות גופנית"
          subtitle={`${weeklyWorkoutMinutes} דקות השבוע`}
          action={{ label: 'חדש', onClick: () => {} }}
        />
        <div className="flex flex-col gap-2">
          {workouts.slice().reverse().slice(0, 5).map((w) => (
            <Card key={w.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-sm">{w.type}</span>
                <p className="text-[10px] text-white/40">
                  {new Date(w.date).toLocaleDateString('he-IL', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <Badge variant="success">{w.duration} דק׳</Badge>
            </Card>
          ))}
        </div>
      </section>
    </DashboardFrame>
  );
}

function MedRow({ med, onToggle }: { med: Medication; onToggle: () => void }) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl border text-right transition-all active:scale-[0.98]',
        med.taken ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#111111] border-white/5'
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          med.taken
            ? 'bg-emerald-500/20 border border-emerald-500/30'
            : 'bg-white/5 border border-white/10'
        )}
      >
        <Pill className={cn('w-4 h-4', med.taken ? 'text-emerald-400' : 'text-white/60')} />
      </div>
      <div className="flex-1 text-right">
        <span className={cn('font-medium text-sm', med.taken && 'text-white/70')}>
          {med.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-white/40">{med.time}</span>
          <Badge>{med.frequency === 'daily' ? 'יומי' : 'שבועי'}</Badge>
        </div>
      </div>
      <div
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
          med.taken ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
        )}
      >
        {med.taken && (
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </motion.button>
  );
}
