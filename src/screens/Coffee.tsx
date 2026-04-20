import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, CoffeeBag, Recipe, MaintenanceAction } from '@/src/data/store';
import {
  Plus,
  CheckCircle2,
  Droplets,
  Clock,
  Scale,
  Thermometer,
  Play,
  Pause,
  RotateCcw,
  Coffee as CoffeeIcon,
  Star,
  Calendar,
  Flame,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  Card,
  SectionHeader,
  ProgressRing,
  StatTile,
  Badge,
  DashboardFrame,
  Tabs,
} from '@/src/components/ui/primitives';

export function CoffeeDashboard({ onBack, color }: { onBack: () => void; color: string }) {
  const {
    beans,
    maintenance,
    recipes,
    brewLogs,
    boilerWater,
    resetMaintenance,
    refillBoiler,
    addBrewLog,
  } = useStore();

  const [recipeTab, setRecipeTab] = useState<'espresso' | 'filter'>('espresso');
  const brewsToday = brewLogs.filter((b) => b.date === new Date().toISOString().split('T')[0]).length;
  const totalBeanWeight = beans.reduce((sum, b) => sum + b.weight, 0);
  const avgRating = brewLogs.length
    ? (brewLogs.reduce((s, b) => s + b.rating, 0) / brewLogs.length).toFixed(1)
    : '—';
  const filteredRecipes = recipes.filter((r) =>
    recipeTab === 'espresso' ? r.method === 'espresso' : r.method !== 'espresso'
  );

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="מרכז הקפה"
      subtitle="תחזוקה ומלאי פולים"
      layoutIdBase="coffee"
      headerExtra={
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="שוטים היום" value={brewsToday} icon={CoffeeIcon} />
          <StatTile label="מלאי" value={`${totalBeanWeight}g`} icon={Scale} />
          <StatTile label="דירוג ממוצע" value={avgRating} icon={Star} />
        </div>
      }
    >
      {/* Boiler Water */}
      <section>
        <SectionHeader
          title="מיכל מים"
          action={boilerWater < 100 ? { label: 'מילוי', onClick: refillBoiler } : undefined}
        />
        <Card className="flex items-center gap-4 p-5">
          <ProgressRing
            progress={boilerWater}
            size={64}
            color={boilerWater < 30 ? '#EF4444' : '#60A5FA'}
          >
            <Droplets className="w-5 h-5 text-blue-400" />
          </ProgressRing>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-light">{boilerWater}%</span>
              <span className="text-xs text-white/40">מלא</span>
            </div>
            <span className="text-[10px] text-white/50 block mt-1">
              {boilerWater < 30 ? 'יש למלא בקרוב' : 'מספיק לכמה מחזורים'}
            </span>
          </div>
        </Card>
      </section>

      {/* Maintenance */}
      <section>
        <SectionHeader title="מצב המכונה" action={{ label: 'חדש', onClick: () => {} }} />
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x -mx-6 px-6">
          {maintenance.map((item) => (
            <MaintenanceRing key={item.id} item={item} onReset={resetMaintenance} />
          ))}
        </div>
      </section>

      {/* Brew Timer */}
      <section>
        <SectionHeader title="טיימר חליטה" />
        <BrewTimer
          onFinish={(seconds) => {
            addBrewLog({
              beanId: beans[0]?.id ?? '1',
              recipeId: recipes[0]?.id,
              date: new Date().toISOString().split('T')[0],
              rating: 4,
            });
            return seconds;
          }}
        />
      </section>

      {/* Beans */}
      <section>
        <SectionHeader
          title="מלאי פולים"
          subtitle={`${beans.length} זנים · ${totalBeanWeight}g`}
          action={{ label: 'הוסף', onClick: () => {} }}
        />
        <div className="grid gap-3">
          {beans.map((bean) => (
            <BeanRow key={bean.id} bean={bean} />
          ))}
        </div>
      </section>

      {/* Recipes */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            ספר מתכונים
          </h2>
          <Tabs
            tabs={[
              { id: 'espresso', label: 'אספרסו', count: recipes.filter(r=>r.method==='espresso').length },
              { id: 'filter', label: 'פילטר', count: recipes.filter(r=>r.method!=='espresso').length },
            ]}
            active={recipeTab}
            onChange={setRecipeTab}
          />
        </div>
        <div className="grid gap-4">
          {filteredRecipes.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-sm text-white/40">אין מתכונים לקטגוריה זו</p>
            </Card>
          ) : (
            filteredRecipes.map((recipe) => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                beanName={beans.find((b) => b.id === recipe.beanId)?.name || 'לא ידוע'}
              />
            ))
          )}
        </div>
      </section>

      {/* Activity History */}
      <section>
        <SectionHeader title="פעילות אחרונה" subtitle={`${brewLogs.length} שוטים סה״כ`} />
        <Card>
          <div className="space-y-3">
            {brewLogs.slice(-4).reverse().map((log) => {
              const bean = beans.find((b) => b.id === log.beanId);
              const date = new Date(log.date);
              return (
                <div key={log.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                      <CoffeeIcon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-sm">{bean?.name || 'לא ידוע'}</p>
                      <p className="text-[10px] text-white/40">
                        {date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3 h-3',
                          i < log.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/20'
                        )}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
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

function BrewTimer({ onFinish }: { onFinish: (seconds: number) => void }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setSeconds((s) => s + 0.1), 100);
    } else if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const display = seconds.toFixed(1);
  const inWindow = seconds >= 25 && seconds <= 32;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-white/40">זמן חליטה</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={cn(
                'text-5xl font-mono-num font-bold',
                inWindow ? 'text-emerald-400' : seconds > 32 ? 'text-red-400' : 'text-white'
              )}
            >
              {display}
            </span>
            <span className="text-sm text-white/40">שניות</span>
          </div>
          {inWindow && <Badge variant="success" className="mt-2">חלון אידאלי</Badge>}
          {seconds > 32 && <Badge variant="danger" className="mt-2">מעבר לטווח</Badge>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRunning(!running)}
            className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center active:scale-90 transition-transform"
            aria-label={running ? 'עצור' : 'התחל'}
          >
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => {
              if (seconds > 0) onFinish(seconds);
              setSeconds(0);
              setRunning(false);
            }}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 active:scale-90 transition-transform"
            aria-label="איפוס"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
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

function RecipeRow({ recipe, beanName }: { recipe: Recipe; beanName: string }) {
  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-sm text-[#F5F5F5]">{recipe.name}</h4>
          <p className="text-[10px] text-[#D4AF37] opacity-80 mt-0.5">{beanName}</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-mono-num text-white tracking-tighter">{recipe.grindSize}</span>
          <p className="text-[8px] uppercase tracking-widest text-white/40">גרגר</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 border-t border-white/5 pt-3">
        <RecipeStat icon={Scale} value={`${recipe.dose}g`} label="דוזה" />
        <RecipeStat icon={Droplets} value={`${recipe.yield}g`} label="תפוקה" />
        <RecipeStat icon={Clock} value={`${recipe.time}s`} label="זמן" />
        <RecipeStat icon={Thermometer} value={`${recipe.temp}°`} label="חום" />
      </div>
    </Card>
  );
}

function RecipeStat({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="w-3.5 h-3.5 text-[#D4AF37] mb-1" />
      <span className="text-[11px] font-bold font-mono-num">{value}</span>
      <span className="text-[8px] text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}
