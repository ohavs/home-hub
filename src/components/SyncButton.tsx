import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, CloudUpload, CloudDownload, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { isFirebaseConfigured } from '@/src/lib/firebase';
import { syncUp, syncDown, useSyncStatus } from '@/src/lib/sync';

function formatRelative(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'עכשיו';
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דק׳`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שע׳`;
  return `לפני ${Math.floor(diff / 86400)} ימים`;
}

export function SyncButton() {
  const [open, setOpen] = useState(false);
  const { status, lastSyncedAt, error } = useSyncStatus();
  const configured = isFirebaseConfigured();
  const busy = status === 'syncing';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative"
        aria-label="סנכרון ענן"
      >
        {status === 'syncing' ? (
          <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
        ) : status === 'error' ? (
          <Cloud className="w-5 h-5 text-red-400" />
        ) : (
          <Cloud className="w-5 h-5 text-[#D4AF37]" />
        )}
        {status === 'success' && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#050505] flex items-center justify-center">
            <Check className="w-2 h-2 text-black" strokeWidth={3} />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-md bg-[#0a0a0a] border-t border-white/10 rounded-t-[32px] p-6 pb-10"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">סנכרון</span>
                  <h3 className="text-2xl font-display font-light mt-1">ענן הבית</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                  aria-label="סגור"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {!configured && (
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    Firebase לא מוגדר. הוסף <code className="font-mono-num text-[10px]">VITE_FIREBASE_*</code> ל-<code className="font-mono-num text-[10px]">.env</code> כדי להפעיל סנכרון.
                  </p>
                </div>
              )}

              {lastSyncedAt && (
                <p className="text-[10px] text-white/40 mb-4 text-center">
                  סונכרן {formatRelative(lastSyncedAt)}
                </p>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-200/90 leading-relaxed">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <SyncAction
                  label="העלה לענן"
                  sub="local → cloud"
                  icon={CloudUpload}
                  onClick={syncUp}
                  disabled={!configured || busy}
                />
                <SyncAction
                  label="הורד מהענן"
                  sub="cloud → local"
                  icon={CloudDownload}
                  onClick={syncDown}
                  disabled={!configured || busy}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SyncAction({
  label,
  sub,
  icon: Icon,
  onClick,
  disabled,
}: {
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => Promise<void>;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => void onClick().catch(() => {})}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all',
        'disabled:opacity-40 disabled:active:scale-100',
        !disabled && 'hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30'
      )}
    >
      <Icon className="w-6 h-6 text-[#D4AF37]" />
      <span className="text-xs font-semibold text-[#F5F5F5]">{label}</span>
      <span className="text-[9px] text-white/40 font-mono-num">{sub}</span>
    </button>
  );
}
