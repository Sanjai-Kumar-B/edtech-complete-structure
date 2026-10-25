// FILE: edtech-admin/src/components/Toast.jsx
// Reusable toast notification component — replaces all alert() calls
import { useEffect } from 'react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  };
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-top duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-lg max-w-md ${styles[type] || styles.info}`}>
        <span className="material-symbols-outlined text-[20px]">{icons[type] || icons.info}</span>
        <span className="text-sm font-bold flex-1">{message}</span>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}

// Reusable inline confirmation component — replaces all confirm() calls
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        <span className={`material-symbols-outlined text-5xl mb-4 ${danger ? 'text-red-500' : 'text-amber-500'}`}>
          {danger ? 'delete_forever' : 'warning'}
        </span>
        <h3 className="text-xl font-black text-slate-800 mb-2">{title || 'Confirm Action'}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-8 py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-8 py-3 text-white rounded-full font-bold shadow-lg transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
