import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore, Expense, Budget, SavingGoal } from '@/src/data/store';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ShoppingBag,
  Car,
  Utensils,
  Gamepad2,
  Target,
  Plus,
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

const CATEGORY_ICON: Record<string, any> = {
  'מזון': Utensils,
  'תחבורה': Car,
  'בילויים': Gamepad2,
  'קניות': ShoppingBag,
};

const CATEGORY_COLOR: Record<string, string> = {
  'מזון': '#F59E0B',
  'תחבורה': '#60A5FA',
  'בילויים': '#A78BFA',
  'קניות': '#EF4444',
};

export function FinanceDashboard({ onBack, color }: { onBack: () => void; color: string }) {
  const { expenses, budgets, savingGoals, addToSaving } = useStore();
  const [tab, setTab] = useState<'overview' | 'budgets' | 'savings'>('overview');

  const monthlyTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const budgetUsed = (monthlyTotal / totalBudget) * 100;
  const totalSaved = savingGoals.reduce((s, g) => s + g.current, 0);
  const totalGoal = savingGoals.reduce((s, g) => s + g.target, 0);

  return (
    <DashboardFrame
      onBack={onBack}
      color={color}
      title="כספים"
      subtitle="תקציב והוצאות"
      layoutIdBase="finance"
      headerExtra={
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="החודש" value={`₪${monthlyTotal}`} icon={TrendingDown} color="#EF4444" />
          <StatTile label="תקציב" value={`${Math.round(budgetUsed)}%`} icon={Target} color="#D4AF37" />
          <StatTile label="נחסך" value={`₪${totalSaved}`} icon={PiggyBank} color="#10B981" />
        </div>
      }
    >
      <Tabs
        tabs={[
          { id: 'overview', label: 'סקירה' },
          { id: 'budgets', label: 'תקציבים', count: budgets.length },
          { id: 'savings', label: 'חיסכון', count: savingGoals.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <>
          <section>
            <SectionHeader title="סך הוצאות" subtitle="לחודש הנוכחי" />
            <Card className="p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-display font-light">₪{monthlyTotal}</span>
                <span className="text-sm text-white/40">/ ₪{totalBudget}</span>
              </div>
              <ProgressBar
                progress={budgetUsed}
                height={8}
                color={budgetUsed > 90 ? '#EF4444' : budgetUsed > 70 ? '#F59E0B' : '#D4AF37'}
              />
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-white/60">
                  {budgetUsed > 100 ? 'חריגה' : `נותרו ₪${totalBudget - monthlyTotal}`}
                </span>
                <span
                  className={cn(
                    'font-mono-num font-bold',
                    budgetUsed > 90 ? 'text-red-400' : 'text-emerald-400'
                  )}
                >
                  {Math.round(budgetUsed)}%
                </span>
              </div>
            </Card>
          </section>

          <section>
            <SectionHeader title="הוצאות אחרונות" subtitle={`${expenses.length} תנועות`} />
            <div className="flex flex-col gap-2">
              {expenses.slice().reverse().slice(0, 6).map((exp) => (
                <ExpenseRow key={exp.id} expense={exp} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="חלוקה לפי קטגוריה" />
            <Card>
              <div className="space-y-3">
                {budgets.map((b) => {
                  const catTotal = expenses
                    .filter((e) => e.category === b.category)
                    .reduce((s, e) => s + e.amount, 0);
                  const pct = (catTotal / b.limit) * 100;
                  const Icon = CATEGORY_ICON[b.category] ?? ShoppingBag;
                  return (
                    <div key={b.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{ color: CATEGORY_COLOR[b.category] }}
                          />
                          <span className="text-xs">{b.category}</span>
                        </div>
                        <span className="text-[11px] font-mono-num text-white/60">
                          ₪{catTotal} / ₪{b.limit}
                        </span>
                      </div>
                      <ProgressBar
                        progress={pct}
                        height={3}
                        color={pct > 90 ? '#EF4444' : CATEGORY_COLOR[b.category] ?? '#D4AF37'}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        </>
      )}

      {tab === 'budgets' && (
        <section>
          <SectionHeader
            title="תקציבים לפי קטגוריה"
            subtitle="החודש"
            action={{ label: 'הוסף', onClick: () => {} }}
          />
          <div className="grid grid-cols-2 gap-3">
            {budgets.map((b) => {
              const catTotal = expenses
                .filter((e) => e.category === b.category)
                .reduce((s, e) => s + e.amount, 0);
              const pct = (catTotal / b.limit) * 100;
              const over = pct > 100;
              const Icon = CATEGORY_ICON[b.category] ?? ShoppingBag;
              const color = CATEGORY_COLOR[b.category] ?? '#D4AF37';
              return (
                <Card key={b.category}>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: color + '20' }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    {over && <Badge variant="danger">חריגה</Badge>}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">
                    {b.category}
                  </span>
                  <p className="text-xl font-display font-light mt-1 mb-2">₪{catTotal}</p>
                  <ProgressBar
                    progress={pct}
                    height={3}
                    color={over ? '#EF4444' : color}
                  />
                  <span className="text-[10px] text-white/40 mt-2 block">
                    {over ? `₪${catTotal - b.limit} חריגה` : `₪${b.limit - catTotal} נותרו`}
                  </span>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'savings' && (
        <section>
          <SectionHeader
            title="יעדי חיסכון"
            subtitle={`₪${totalSaved} מתוך ₪${totalGoal}`}
            action={{ label: 'הוסף', onClick: () => {} }}
          />
          <div className="flex flex-col gap-3">
            {savingGoals.map((goal) => (
              <SavingRow key={goal.id} goal={goal} onAdd={(amt) => addToSaving(goal.id, amt)} />
            ))}
          </div>
        </section>
      )}
    </DashboardFrame>
  );
}

function ExpenseRow({ expense }: { expense: Expense }) {
  const Icon = CATEGORY_ICON[expense.category] ?? ShoppingBag;
  const color = CATEGORY_COLOR[expense.category] ?? '#D4AF37';
  const date = new Date(expense.date);

  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium">{expense.category}</span>
          <p className="text-[10px] text-white/40">
            {date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
      <span className="font-display text-lg shrink-0">₪{expense.amount}</span>
    </Card>
  );
}

function SavingRow({
  goal,
  onAdd,
}: {
  goal: SavingGoal;
  onAdd: (amount: number) => void;
}) {
  const pct = (goal.current / goal.target) * 100;
  const almostThere = pct >= 80;

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              almostThere ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/5'
            )}
          >
            <PiggyBank
              className={cn('w-4 h-4', almostThere ? 'text-emerald-400' : 'text-[#D4AF37]')}
            />
          </div>
          <div>
            <h4 className="font-medium text-sm">{goal.name}</h4>
            <p className="text-[10px] text-white/40">
              ₪{goal.current} מתוך ₪{goal.target}
            </p>
          </div>
        </div>
        <button
          onClick={() => onAdd(100)}
          className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center active:scale-90 transition-transform"
          aria-label="הוסף"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <ProgressBar
        progress={pct}
        height={6}
        color={almostThere ? '#10B981' : '#D4AF37'}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] text-white/40">{Math.round(pct)}% הושלם</span>
        <span className="text-[10px] text-white/40 font-mono-num">
          נותרו ₪{Math.max(0, goal.target - goal.current)}
        </span>
      </div>
    </Card>
  );
}
