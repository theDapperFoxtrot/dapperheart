import { useState, useEffect, useCallback } from 'react';
import { SK, def } from './defaults';

export function useCharacter() {
  const [c, setC] = useState(def);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage?.get(SK);
        if (r?.value) setC(p => ({ ...p, ...JSON.parse(r.value) }));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // Save to storage (debounced)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try { await window.storage?.set(SK, JSON.stringify(c)); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [c, loaded]);

  const flash = m => { setToast(m); setTimeout(() => setToast(null), 2500); };
  const u = useCallback((k, v) => setC(p => ({ ...p, [k]: typeof v === "function" ? v(p[k]) : v })), []);

  return { c, setC, u, loaded, toast, flash };
}
