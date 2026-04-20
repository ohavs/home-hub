import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore, HomeMaintenance, DailyTask, Plant, Bill } from '@/src/data/store';
import {
  Check,
  Sprout,
  Zap,
  Droplets,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  Home as HomeIcon,
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

export function HomeDashboard({ onBack, color }: { onBack: () => void; color: string }) {
  const {
    homeMaintenance,
    dailyTasks,
    plants,
    bills,
    toggleTask,
    resetHomeMaintenance,
    waterPlant,
    toggleBillPaid,
  } = useStore();

  const [taskTab, setTaskTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const filteredTasks = dailyTasks.filter((t) => t.frequency === taskTab);
  const completedCount = filteredTasks.filter((t) => t.completed).length;
  const unpaidBills = bills.filter((b) => !b.paid);
  const totalUnpaid = unpaidBills.reduce((s, b) => s + b.amount, 0);
  const thirstyPlants = plants.filter(
    (p) =>
      (Date.now() - new Date(p.lastWatered).getTime()) / 86400000 >= p.wateringDaysInterval
  );

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="ניהול הבית"
      subtitle="תחזוקה ומשימות"
      layoutIdBase="home"
      headerExtra={
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="משימות" value={`${completedCount}/${filteredTasks.length}`} icon={CheckCircle2} />
          <StatTile label="לתשלום" value={`₪${totalUnpaid}`} icon={Receipt} color="#F59E0B" />
          <StatTile label="צמחים צמאים" value={thirstyPlants.length} icon={Sprout} color={thirstyPlants.length > 0 ? '#EF4444' : '#10B981'} />
        </div>
      }
    >
      {/* Tasks */}
      <section>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              משימות
            </h2>
            <p className="text-[10px] text-white/40 mt-0.5">
              {completedCount} / {filteredTasks.length} הושלמו
            </p>
          </div>
          <Tabs
            tabs={[
              { id: 'daily', label: 'יומי', count: dailyTasks.filter(t=>t.frequency==='daily').length },
              { id: 'weekly', label: 'שבועי', count: dailyTasks.filter(t=>t.frequency==='weekly').length },
              { id: 'monthly', label: 'חודשי', count: dailyTasks.filter(t=>t.frequency==='monthly').length },
            ]}
            active={taskTab}
            onChange={setTaskTab}
          />
        </div>

        {/* Progress overview */}
        <Card className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/70">התקדמות {taskTab === 'daily' ? 'יומית' : taskTab === 'weekly' ? 'שבועית' : 'חודשית'}</span>
            <span className="text-xs font-mono-num text-[#D4AF37] font-bold">
              {filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0}%
            </span>
          </div>
          <ProgressBar
            progress={filteredTasks.length > 0 ? (completedCount / filteredTasks.length) * 100 : 0}
            height={6}
            color="#D4AF37"
          />
        </Card>

        <div className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
          ))}
        </div>
      </section>

      {/* Bills */}
      <section>
        <SectionHeader
          title="חשבונות וחיובים"
          subtitle={`${unpaidBills.length} ממתינים · ₪${totalUnpaid}`}
        />
        <div className="flex flex-col gap-2">
          {bills.map((bill) => (
            <BillRow key={bill.id} bill={bill} onToggle={() => toggleBillPaid(bill.id)} />
          ))}
        </div>
      </section>

      {/* Plants */}
      <section>
        <SectionHeader
          title="צמחי בית"
          subtitle={`${thirstyPlants.length > 0 ? `${thirstyPlants.length} צמאים` : 'הכול רווי'}`}
        />
        <div className="flex flex-col gap-2">
          {plants.map((plant) => (
            <PlantRow key={plant.id} plant={plant} onWater={() => waterPlant(plant.id)} />
          ))}
        </div>
      </section>

      {/* Home Maintenance */}
      <section>
        <SectionHeader title="תחזוקה תקופתית" subtitle="ניקוי והחלפות קבועות" />
        <div className="flex flex-col gap-3">
          {homeMaintenance.map((item) => (
            <MaintenanceRow
              key={item.id}
              item={item}
              onReset={() => resetHomeMaintenance(item.id)}
            />
          ))}
        </div>
      </section>

      {/* Energy usage placeholder */}
      <section>
        <SectionHeader title="צריכת אנרגיה" subtitle="החודש" />
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/40">חשמל</span>
                <p className="text-xl font-display font-light">248<span className="text-xs text-white/40 mr-1">kWh</span></p>
              </div>
            </div>
            <ProgressBar progress={62} height={3} color="#F59E0B" />
            <span className="text-[10px] text-white/40 block mt-2">62% מהתקציב</span>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/40">מים</span>
                <p className="text-xl font-display font-light">8.2<span className="text-xs text-white/40 mr-1">m³</span></p>
              </div>
            </div>
            <ProgressBar progress={41} height={3} color="#60A5FA" />
            <span className="text-[10px] text-white/40 block mt-2">41% מהתקציב</span>
          </Card>
        </div>
      </section>
    </DashboardFrame>
  );
}

function TaskRow({ task, onToggle }: { task: DailyTask; onToggle: () => void }) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      className={cn(
        'flex items-center gap-4 p-3.5 rounded-2xl border text-right transition-all active:scale-[0.98]',
        task.completed
          ? 'bg-[#0A0A0A] border-white/5 opacity-60'
          : 'bg-[#111111] border-white/5'
      )}
    >
      <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full border border-white/20 shrink-0">
        <motion.div
          initial={false}
          animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
          className="absolute inset-0 bg-[#D4AF37] rounded-full flex items-center justify-center"
        >
          <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
        </motion.div>
      </div>
      <span
        className={cn(
          'text-sm transition-all relative z-10 flex-1 text-right',
          task.completed ? 'text-white/40 line-through' : 'text-white'
        )}
      >
        {task.name}
      </span>
    </motion.button>
  );
}

function BillRow({ bill, onToggle }: { bill: Bill; onToggle: () => void }) {
  const daysToDue = Math.ceil((new Date(bill.dueDate).getTime() - Date.now()) / 86400000);
  const overdue = !bill.paid && daysToDue < 0;
  const urgent = !bill.paid && daysToDue <= 3 && daysToDue >= 0;

  return (
    <Card
      onClick={onToggle}
      className={cn(
        'flex items-center justify-between gap-3',
        bill.paid && 'opacity-50',
        overdue && 'border-red-500/30 bg-red-500/5'
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            bill.paid
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : overdue
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-white/5 border border-white/5'
          )}
        >
          {bill.paid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : overdue ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <Receipt className="w-4 h-4 text-[#D4AF37]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className={cn('font-medium text-sm', bill.paid && 'line-through')}>
            {bill.name}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            {bill.paid ? (
              <Badge variant="success">שולם</Badge>
            ) : overdue ? (
              <Badge variant="danger">באיחור {Math.abs(daysToDue)} ימים</Badge>
            ) : urgent ? (
              <Badge variant="warn">עוד {daysToDue} ימים</Badge>
            ) : (
              <span className="text-[10px] text-white/40">עוד {daysToDue} ימים</span>
            )}
          </div>
        </div>
      </div>
      <span className="text-lg font-display font-bold text-[#D4AF37] shrink-0">
        ₪{bill.amount}
      </span>
    </Card>
  );
}

function PlantRow({ plant, onWater }: { plant: Plant; onWater: () => void }) {
  const daysSinceWater = Math.floor((Date.now() - new Date(plant.lastWatered).getTime()) / 86400000);
  const thirsty = daysSinceWater >= plant.wateringDaysInterval;
  const progress = Math.min(100, (daysSinceWater / plant.wateringDaysInterval) * 100);

  return (
    <Card className={cn('flex items-center gap-3', thirsty && 'border-amber-500/30')}>
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          thirsty ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/20'
        )}
      >
        <Sprout className={cn('w-4 h-4', thirsty ? 'text-amber-400' : 'text-emerald-400')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm">{plant.name}</span>
          <span className="text-[10px] text-white/40">{plant.room}</span>
        </div>
        <ProgressBar progress={progress} height={3} color={thirsty ? '#F59E0B' : '#10B981'} />
        <span className="text-[10px] text-white/40 mt-1 block">
          {thirsty ? `${daysSinceWater - plant.wateringDaysInterval} ימים באיחור` : `עוד ${plant.wateringDaysInterval - daysSinceWater} ימים`}
        </span>
      </div>
      <button
        onClick={onWater}
        className={cn(
          'shrink-0 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform',
          thirsty
            ? 'bg-[#D4AF37] text-black'
            : 'bg-white/5 border border-white/10 text-[#D4AF37]'
        )}
        aria-label="השקה"
      >
        <Droplets className="w-4 h-4" />
      </button>
    </Card>
  );
}

function MaintenanceRow({
  item,
  onReset,
}: {
  item: HomeMaintenance;
  onReset: () => void;
}) {
  const critical = item.progress < 30;
  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{item.name}</span>
          {item.room && <Badge>{item.room}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-num font-bold text-[#D4AF37]">{item.progress}%</span>
          {item.progress < 50 && (
            <button
              onClick={onReset}
              className="text-[10px] text-[#D4AF37] underline underline-offset-2 opacity-80 hover:opacity-100"
            >
              החלף
            </button>
          )}
        </div>
      </div>
      <ProgressBar progress={item.progress} critical={critical} height={4} />
    </Card>
  );
}
