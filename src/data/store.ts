import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────

// Coffee
export type CoffeeBag = {
  id: string;
  name: string;
  origin: string;
  roaster: string;
  weight: number;
  price: number;
  rating: number;
  imageColor: string;
  roastDate?: string;
  notes?: string;
  tasteProfile?: { acidity: number; body: number; sweetness: number; bitterness: number };
};

export type Recipe = {
  id: string;
  beanId: string;
  name: string;
  dose: number;
  yield: number;
  time: number;
  temp: number;
  grindSize: string;
  method: 'espresso' | 'filter' | 'french-press' | 'aeropress';
};

export type MaintenanceAction = {
  id: string;
  name: string;
  dueDate: string;
  progress: number;
  intervalDays: number;
};

export type BrewLog = {
  id: string;
  beanId: string;
  recipeId?: string;
  date: string;
  rating: number;
};

// Kitchen
export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'dairy' | 'produce' | 'pantry' | 'frozen' | 'other';
  expiryDate?: string;
};

export type ApplianceHealth = {
  id: string;
  name: string;
  progress: number;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category: string;
};

// Home
export type HomeMaintenance = {
  id: string;
  name: string;
  progress: number;
  room?: string;
  intervalDays?: number;
};

export type DailyTask = {
  id: string;
  name: string;
  completed: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  icon?: string;
};

export type Plant = {
  id: string;
  name: string;
  lastWatered: string;
  wateringDaysInterval: number;
  room: string;
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  category: 'utilities' | 'rent' | 'insurance' | 'subscription' | 'other';
};

// Finance
export type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
};

export type Budget = {
  category: string;
  limit: number;
};

export type SavingGoal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
};

// Wellness
export type WaterLog = { date: string; cups: number };
export type SleepLog = { date: string; hours: number };
export type Workout = { id: string; date: string; type: string; duration: number };
export type Medication = {
  id: string;
  name: string;
  time: string;
  taken: boolean;
  frequency: 'daily' | 'weekly';
};
export type MoodLog = { date: string; mood: 1 | 2 | 3 | 4 | 5; note?: string };

// ────────────────────────────────────────────────────────
// INITIAL DATA
// ────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];
const daysFromNow = (days: number) => new Date(Date.now() + 86400000 * days).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - 86400000 * days).toISOString();

const DEFAULT_BEANS: CoffeeBag[] = [
  {
    id: '1',
    name: 'אתיופיה יירגשף',
    origin: 'אתיופיה',
    roaster: 'קפה נמרוד',
    weight: 250,
    price: 65,
    rating: 5,
    imageColor: '#8a9a86',
    roastDate: daysAgo(10),
    notes: 'פרחוני, הדרים, גוף בינוני',
    tasteProfile: { acidity: 4, body: 2, sweetness: 4, bitterness: 1 },
  },
  {
    id: '2',
    name: 'תערובת הבית',
    origin: 'ברזיל/קולומביה',
    roaster: 'אספרסו בר',
    weight: 500,
    price: 110,
    rating: 4,
    imageColor: '#382a20',
    roastDate: daysAgo(5),
    notes: 'שוקולד מריר, אגוזים, גוף מלא',
    tasteProfile: { acidity: 2, body: 5, sweetness: 3, bitterness: 3 },
  },
];

const DEFAULT_RECIPES: Recipe[] = [
  { id: '1', beanId: '2', name: 'אספרסו כפול', dose: 18, yield: 36, time: 27, temp: 93, grindSize: '1.8', method: 'espresso' },
  { id: '2', beanId: '1', name: 'V60 בוקר', dose: 15, yield: 250, time: 180, temp: 94, grindSize: '4.2', method: 'filter' },
];

const DEFAULT_MAINTENANCE: MaintenanceAction[] = [
  { id: 'm1', name: 'ניקוי מכונה', dueDate: daysFromNow(2), progress: 85, intervalDays: 14 },
  { id: 'm2', name: 'פילטר פנימי', dueDate: daysFromNow(15), progress: 50, intervalDays: 60 },
  { id: 'm3', name: 'פילטר בריטה', dueDate: daysAgo(1), progress: 100, intervalDays: 30 },
  { id: 'm4', name: 'Descaling', dueDate: daysFromNow(40), progress: 30, intervalDays: 90 },
];

const DEFAULT_BREW_LOGS: BrewLog[] = [
  { id: 'bl1', beanId: '2', recipeId: '1', date: today(), rating: 4 },
  { id: 'bl2', beanId: '2', recipeId: '1', date: today(), rating: 5 },
  { id: 'bl3', beanId: '1', recipeId: '2', date: daysAgo(1).split('T')[0], rating: 5 },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'חלב שיבולת שועל', quantity: 2, unit: 'ליטר', category: 'dairy', expiryDate: daysFromNow(5) },
  { id: 'i2', name: 'ביצים', quantity: 12, unit: 'יח׳', category: 'dairy', expiryDate: daysFromNow(14) },
  { id: 'i3', name: 'קמח לבן', quantity: 1, unit: 'ק״ג', category: 'pantry' },
  { id: 'i4', name: 'עגבניות', quantity: 5, unit: 'יח׳', category: 'produce', expiryDate: daysFromNow(3) },
  { id: 'i5', name: 'גבינת פטה', quantity: 1, unit: 'חבילה', category: 'dairy', expiryDate: daysFromNow(1) },
];

const DEFAULT_APPLIANCE: ApplianceHealth[] = [
  { id: 'a1', name: 'מלח למדיח', progress: 90 },
  { id: 'a2', name: 'נוזל הברקה', progress: 40 },
  { id: 'a3', name: 'פילטר מים למקרר', progress: 15 },
  { id: 'a4', name: 'פחם מנדף', progress: 70 },
];

const DEFAULT_SHOPPING: ShoppingItem[] = [
  { id: 's1', name: 'לחם מלא', quantity: '1', checked: false, category: 'מאפה' },
  { id: 's2', name: 'בננות', quantity: '6', checked: false, category: 'פירות' },
  { id: 's3', name: 'שמן זית', quantity: '1', checked: true, category: 'מזווה' },
  { id: 's4', name: 'יוגורט יווני', quantity: '2', checked: false, category: 'חלבי' },
];

const DEFAULT_HOME_MAINTENANCE: HomeMaintenance[] = [
  { id: 'h1', name: 'ניקוי פילטר מזגן', progress: 75, room: 'סלון', intervalDays: 90 },
  { id: 'h2', name: 'שקית שואב אבק', progress: 95, room: 'כללי', intervalDays: 60 },
  { id: 'h3', name: 'סוללות במנעול חכם', progress: 30, room: 'כניסה', intervalDays: 180 },
  { id: 'h4', name: 'ניקוי פילטר ייבוש', progress: 60, room: 'שירות', intervalDays: 30 },
];

const DEFAULT_DAILY_TASKS: DailyTask[] = [
  { id: 't1', name: 'להפעיל מכונת כביסה', completed: false, frequency: 'daily' },
  { id: 't2', name: 'לרוקן פח אשפה', completed: true, frequency: 'daily' },
  { id: 't3', name: 'להשקות עציצים', completed: false, frequency: 'daily' },
  { id: 't4', name: 'לשטוף כלים', completed: true, frequency: 'daily' },
  { id: 't5', name: 'לשטוף רצפה', completed: false, frequency: 'weekly' },
  { id: 't6', name: 'להחליף מצעים', completed: false, frequency: 'weekly' },
  { id: 't7', name: 'לקרצף שירותים', completed: false, frequency: 'weekly' },
  { id: 't8', name: 'לשטוף חלונות', completed: false, frequency: 'monthly' },
  { id: 't9', name: 'לבדוק גלאי עשן', completed: false, frequency: 'monthly' },
];

const DEFAULT_PLANTS: Plant[] = [
  { id: 'p1', name: 'מונסטרה', lastWatered: daysAgo(2), wateringDaysInterval: 5, room: 'סלון' },
  { id: 'p2', name: 'סנסיבריה', lastWatered: daysAgo(10), wateringDaysInterval: 14, room: 'חדר שינה' },
  { id: 'p3', name: 'בזיליקום', lastWatered: daysAgo(1), wateringDaysInterval: 2, room: 'מטבח' },
];

const DEFAULT_BILLS: Bill[] = [
  { id: 'b1', name: 'חשמל', amount: 380, dueDate: daysFromNow(7), paid: false, category: 'utilities' },
  { id: 'b2', name: 'מים', amount: 210, dueDate: daysFromNow(12), paid: false, category: 'utilities' },
  { id: 'b3', name: 'Netflix', amount: 55, dueDate: daysFromNow(3), paid: false, category: 'subscription' },
  { id: 'b4', name: 'Spotify', amount: 20, dueDate: daysAgo(1), paid: true, category: 'subscription' },
];

const DEFAULT_EXPENSES: Expense[] = [
  { id: 'e1', category: 'מזון', amount: 420, date: daysAgo(1).split('T')[0] },
  { id: 'e2', category: 'מזון', amount: 180, date: daysAgo(3).split('T')[0] },
  { id: 'e3', category: 'תחבורה', amount: 200, date: daysAgo(2).split('T')[0] },
  { id: 'e4', category: 'בילויים', amount: 320, date: daysAgo(4).split('T')[0] },
  { id: 'e5', category: 'קניות', amount: 650, date: daysAgo(6).split('T')[0] },
];

const DEFAULT_BUDGETS: Budget[] = [
  { category: 'מזון', limit: 2500 },
  { category: 'תחבורה', limit: 800 },
  { category: 'בילויים', limit: 1200 },
  { category: 'קניות', limit: 1500 },
];

const DEFAULT_SAVING_GOALS: SavingGoal[] = [
  { id: 'sg1', name: 'חופשה ביוון', target: 12000, current: 4200 },
  { id: 'sg2', name: 'מחשב חדש', target: 8000, current: 6500 },
];

const DEFAULT_WATER_LOGS: WaterLog[] = [
  { date: today(), cups: 4 },
  { date: daysAgo(1).split('T')[0], cups: 6 },
  { date: daysAgo(2).split('T')[0], cups: 5 },
];

const DEFAULT_SLEEP_LOGS: SleepLog[] = [
  { date: daysAgo(1).split('T')[0], hours: 7.5 },
  { date: daysAgo(2).split('T')[0], hours: 6.8 },
  { date: daysAgo(3).split('T')[0], hours: 8.1 },
  { date: daysAgo(4).split('T')[0], hours: 7.0 },
];

const DEFAULT_WORKOUTS: Workout[] = [
  { id: 'w1', date: daysAgo(0).split('T')[0], type: 'ריצה', duration: 35 },
  { id: 'w2', date: daysAgo(2).split('T')[0], type: 'כוח', duration: 50 },
  { id: 'w3', date: daysAgo(4).split('T')[0], type: 'יוגה', duration: 40 },
];

const DEFAULT_MEDS: Medication[] = [
  { id: 'med1', name: 'מולטי ויטמין', time: '08:00', taken: true, frequency: 'daily' },
  { id: 'med2', name: 'אומגה 3', time: '13:00', taken: false, frequency: 'daily' },
  { id: 'med3', name: 'ויטמין D', time: '20:00', taken: false, frequency: 'weekly' },
];

const DEFAULT_MOOD_LOGS: MoodLog[] = [
  { date: today(), mood: 4 },
  { date: daysAgo(1).split('T')[0], mood: 3 },
  { date: daysAgo(2).split('T')[0], mood: 5 },
];

// ────────────────────────────────────────────────────────
// STORE
// ────────────────────────────────────────────────────────
type Store = {
  // Coffee
  beans: CoffeeBag[];
  recipes: Recipe[];
  maintenance: MaintenanceAction[];
  brewLogs: BrewLog[];
  boilerWater: number;
  addBrewLog: (log: Omit<BrewLog, 'id'>) => void;
  resetMaintenance: (id: string) => void;
  refillBoiler: () => void;
  consumeWater: (amount: number) => void;
  updateBeanWeight: (id: string, delta: number) => void;

  // Kitchen
  inventory: InventoryItem[];
  applianceHealth: ApplianceHealth[];
  shopping: ShoppingItem[];
  updateInventoryQty: (id: string, delta: number) => void;
  resetAppliance: (id: string) => void;
  toggleShopping: (id: string) => void;
  clearCheckedShopping: () => void;

  // Home
  homeMaintenance: HomeMaintenance[];
  dailyTasks: DailyTask[];
  plants: Plant[];
  bills: Bill[];
  toggleTask: (id: string) => void;
  resetHomeMaintenance: (id: string) => void;
  waterPlant: (id: string) => void;
  toggleBillPaid: (id: string) => void;

  // Finance
  expenses: Expense[];
  budgets: Budget[];
  savingGoals: SavingGoal[];
  addToSaving: (id: string, amount: number) => void;

  // Wellness
  waterLogs: WaterLog[];
  sleepLogs: SleepLog[];
  workouts: Workout[];
  medications: Medication[];
  moodLogs: MoodLog[];
  addWater: (cups: number) => void;
  toggleMedication: (id: string) => void;
  setMood: (mood: 1 | 2 | 3 | 4 | 5) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Coffee defaults
      beans: DEFAULT_BEANS,
      recipes: DEFAULT_RECIPES,
      maintenance: DEFAULT_MAINTENANCE,
      brewLogs: DEFAULT_BREW_LOGS,
      boilerWater: 65,

      addBrewLog: (log) =>
        set((s) => ({ brewLogs: [...s.brewLogs, { ...log, id: `bl${Date.now()}` }] })),

      resetMaintenance: (id) =>
        set((s) => ({
          maintenance: s.maintenance.map((m) =>
            m.id === id ? { ...m, progress: 0, dueDate: daysFromNow(m.intervalDays) } : m
          ),
        })),

      refillBoiler: () => set({ boilerWater: 100 }),

      consumeWater: (amount) =>
        set((s) => ({ boilerWater: Math.max(0, s.boilerWater - amount) })),

      updateBeanWeight: (id, delta) =>
        set((s) => ({
          beans: s.beans.map((b) =>
            b.id === id ? { ...b, weight: Math.max(0, b.weight + delta) } : b
          ),
        })),

      // Kitchen defaults
      inventory: DEFAULT_INVENTORY,
      applianceHealth: DEFAULT_APPLIANCE,
      shopping: DEFAULT_SHOPPING,

      updateInventoryQty: (id, delta) =>
        set((s) => ({
          inventory: s.inventory.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
          ),
        })),

      resetAppliance: (id) =>
        set((s) => ({
          applianceHealth: s.applianceHealth.map((a) =>
            a.id === id ? { ...a, progress: 100 } : a
          ),
        })),

      toggleShopping: (id) =>
        set((s) => ({
          shopping: s.shopping.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)),
        })),

      clearCheckedShopping: () =>
        set((s) => ({ shopping: s.shopping.filter((x) => !x.checked) })),

      // Home defaults
      homeMaintenance: DEFAULT_HOME_MAINTENANCE,
      dailyTasks: DEFAULT_DAILY_TASKS,
      plants: DEFAULT_PLANTS,
      bills: DEFAULT_BILLS,

      toggleTask: (id) =>
        set((s) => ({
          dailyTasks: s.dailyTasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      resetHomeMaintenance: (id) =>
        set((s) => ({
          homeMaintenance: s.homeMaintenance.map((h) =>
            h.id === id ? { ...h, progress: 100 } : h
          ),
        })),

      waterPlant: (id) =>
        set((s) => ({
          plants: s.plants.map((p) =>
            p.id === id ? { ...p, lastWatered: new Date().toISOString() } : p
          ),
        })),

      toggleBillPaid: (id) =>
        set((s) => ({
          bills: s.bills.map((b) => (b.id === id ? { ...b, paid: !b.paid } : b)),
        })),

      // Finance defaults
      expenses: DEFAULT_EXPENSES,
      budgets: DEFAULT_BUDGETS,
      savingGoals: DEFAULT_SAVING_GOALS,

      addToSaving: (id, amount) =>
        set((s) => ({
          savingGoals: s.savingGoals.map((g) =>
            g.id === id ? { ...g, current: g.current + amount } : g
          ),
        })),

      // Wellness defaults
      waterLogs: DEFAULT_WATER_LOGS,
      sleepLogs: DEFAULT_SLEEP_LOGS,
      workouts: DEFAULT_WORKOUTS,
      medications: DEFAULT_MEDS,
      moodLogs: DEFAULT_MOOD_LOGS,

      addWater: (cups) =>
        set((s) => {
          const d = today();
          const existing = s.waterLogs.find((w) => w.date === d);
          if (existing) {
            return {
              waterLogs: s.waterLogs.map((w) =>
                w.date === d ? { ...w, cups: Math.max(0, w.cups + cups) } : w
              ),
            };
          }
          return { waterLogs: [...s.waterLogs, { date: d, cups: Math.max(0, cups) }] };
        }),

      toggleMedication: (id) =>
        set((s) => ({
          medications: s.medications.map((m) =>
            m.id === id ? { ...m, taken: !m.taken } : m
          ),
        })),

      setMood: (mood) =>
        set((s) => {
          const d = today();
          const existing = s.moodLogs.find((m) => m.date === d);
          if (existing) {
            return {
              moodLogs: s.moodLogs.map((m) => (m.date === d ? { ...m, mood } : m)),
            };
          }
          return { moodLogs: [...s.moodLogs, { date: d, mood }] };
        }),
    }),
    { name: 'home-hub-store' }
  )
);
