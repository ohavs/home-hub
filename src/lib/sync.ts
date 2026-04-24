import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { create } from 'zustand';
import { getDb, isFirebaseConfigured } from './firebase';
import { useStore } from '@/src/data/store';

const USER_ID = 'primary';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

type SyncState = {
  status: SyncStatus;
  lastSyncedAt: number | null;
  error: string | null;
  setStatus: (s: SyncStatus) => void;
  setError: (e: string | null) => void;
  markSuccess: () => void;
};

export const useSyncStatus = create<SyncState>((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  error: null,
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  markSuccess: () => set({ status: 'success', lastSyncedAt: Date.now(), error: null }),
}));

function getSerializableState(): Record<string, unknown> {
  const state = useStore.getState() as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(state)) {
    if (typeof state[key] !== 'function') out[key] = state[key];
  }
  return out;
}

function requireDb() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase לא מוגדר — הוסף VITE_FIREBASE_* ל-.env');
  }
  const db = getDb();
  if (!db) throw new Error('Firestore לא זמין');
  return db;
}

export async function syncUp(): Promise<void> {
  const { setStatus, setError, markSuccess } = useSyncStatus.getState();
  setStatus('syncing');
  setError(null);
  try {
    const db = requireDb();
    const payload = { ...getSerializableState(), updatedAt: serverTimestamp() };
    await setDoc(doc(db, 'users', USER_ID), payload, { merge: true });
    markSuccess();
  } catch (e) {
    setStatus('error');
    setError(e instanceof Error ? e.message : String(e));
    throw e;
  }
}

export async function syncDown(): Promise<void> {
  const { setStatus, setError, markSuccess } = useSyncStatus.getState();
  setStatus('syncing');
  setError(null);
  try {
    const db = requireDb();
    const snap = await getDoc(doc(db, 'users', USER_ID));
    if (!snap.exists()) {
      setStatus('idle');
      setError('אין נתונים שמורים בענן');
      return;
    }
    const data = snap.data();
    const { updatedAt: _u, ...rest } = data;
    useStore.setState(rest as never);
    markSuccess();
  } catch (e) {
    setStatus('error');
    setError(e instanceof Error ? e.message : String(e));
    throw e;
  }
}
