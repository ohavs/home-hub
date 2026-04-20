import { useState } from 'react';

// --- COFFEE TYPES ---
export type CoffeeBag = { id: string; name: string; weight: number; price: number; rating: number; imageColor: string; };
export type Recipe = { id: string; beanId: string; name: string; dose: number; yield: number; time: number; temp: number; grindSize: string; };
export type MaintenanceAction = { id: string; name: string; dueDate: string; progress: number; };

// --- KITCHEN TYPES ---
export type InventoryItem = { id: string; name: string; quantity: number; unit: string; };
export type ApplianceHealth = { id: string; name: string; progress: number; };

// --- HOME TYPES ---
export type HomeMaintenance = { id: string; name: string; progress: number; };
export type DailyTask = { id: string; name: string; completed: boolean; };

// --- DUMMY DATA ---
export const DUMMY_BEANS: CoffeeBag[] = [
  { id: '1', name: 'אתיופיה יירגשף', weight: 250, price: 65, rating: 5, imageColor: '#8a9a86' },
  { id: '2', name: 'תערובת הבית (אספרסו)', weight: 500, price: 110, rating: 4, imageColor: '#382a20' },
];

export const DUMMY_RECIPES: Recipe[] = [
  { id: '1', beanId: '2', name: 'אספרסו כפול', dose: 18, yield: 36, time: 27, temp: 93, grindSize: '1.8' },
];

export const DUMMY_MAINTENANCE: MaintenanceAction[] = [
  { id: 'm1', name: 'ניקוי מכונה', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), progress: 85 },
  { id: 'm2', name: 'פילטר פנימי', dueDate: new Date(Date.now() + 86400000 * 15).toISOString(), progress: 50 },
  { id: 'm3', name: 'פילטר בריטה', dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), progress: 100 },
];

export const DUMMY_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'חלב שיבולת שועל', quantity: 2, unit: 'ליטר' },
  { id: 'i2', name: 'ביצים', quantity: 12, unit: 'יח׳' },
  { id: 'i3', name: 'קמח לבן', quantity: 1, unit: 'ק״ג' },
];

export const DUMMY_APPLIANCE: ApplianceHealth[] = [
  { id: 'a1', name: 'מלח למדיח', progress: 90 },
  { id: 'a2', name: 'נוזל הברקה', progress: 40 },
  { id: 'a3', name: 'פילטר מים למקרר', progress: 15 },
];

export const DUMMY_HOME_MAINTENANCE: HomeMaintenance[] = [
  { id: 'h1', name: 'ניקוי פילטר מזגן', progress: 75 },
  { id: 'h2', name: 'שקית שואב אבק', progress: 95 },
  { id: 'h3', name: 'סוללות במנעול חכם', progress: 30 },
];

export const DUMMY_DAILY_TASKS: DailyTask[] = [
  { id: 't1', name: 'להפעיל מכונת כביסה', completed: false },
  { id: 't2', name: 'לרוקן פח אשפה', completed: true },
  { id: 't3', name: 'להשקות עציצים', completed: false },
];

export function useAppStore() {
  const [beans, setBeans] = useState<CoffeeBag[]>(DUMMY_BEANS);
  const [recipes, setRecipes] = useState<Recipe[]>(DUMMY_RECIPES);
  const [maintenance, setMaintenance] = useState<MaintenanceAction[]>(DUMMY_MAINTENANCE);
  
  const [inventory, setInventory] = useState<InventoryItem[]>(DUMMY_INVENTORY);
  const [applianceHealth, setApplianceHealth] = useState<ApplianceHealth[]>(DUMMY_APPLIANCE);

  const [homeMaintenance, setHomeMaintenance] = useState<HomeMaintenance[]>(DUMMY_HOME_MAINTENANCE);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(DUMMY_DAILY_TASKS);

  return { 
    beans, setBeans, 
    recipes, setRecipes, 
    maintenance, setMaintenance,
    inventory, setInventory,
    applianceHealth, setApplianceHealth,
    homeMaintenance, setHomeMaintenance,
    dailyTasks, setDailyTasks
  };
}
