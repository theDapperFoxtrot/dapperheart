import { S } from '../../styles/theme';
import { SpinDie } from '../shared/SpinDie';
import { rollD } from '../../utils';

export function DiceRoller({ modal, setModal, result, setResult, rolling, setRolling, c, mods }) {
  if (!modal) return null;

  const advH = c.advHistory || [];

  const rollDice = () => {
    setRolling(true); setResult(null);
    setTimeout(() => {
      const hope = rollD(12), fear = rollD(12); let advDie = 0;
      if (modal.adv === "advantage") advDie = rollD(6);
      if (modal.adv === "disadvantage") advDie = -rollD(6);
      const tk = modal.trait ? modal.trait.toLowerCase() : "";
      const base = tk ? (c.traits[tk] || 0) : 0;
      const armorMod = tk ? (mods[tk] || 0) : 0;
      const traitMod = base + armorMod;
      const expBonus = modal.exp !== undefined && modal.exp !== "" ? (c.exps[modal.exp]?.b || 0) : 0;
      const breakdown = [];
      if (tk) {
        const advCount = advH.filter(a => a.type === "traits" && a.traits?.includes(tk)).length;
        if (advCount > 0) {
          breakdown.push({ value: base - advCount, label: tk.charAt(0).toUpperCase() + tk.slice(1) + " (base)", source: "Starting trait value" });
          advH.filter(a => a.type === "traits" && a.traits?.includes(tk)).forEach(a => {
            breakdown.push({ value: 1, label: `Lv${a.level} advancement`, source: `Tier advancement: +1 to ${tk}` });
          });
        } else {
          breakdown.push({ value: base, label: tk.charAt(0).toUpperCase() + tk.slice(1) + " (base)", source: "Your base trait value" });
        }
        if (armorMod !== 0) breakdown.push({ value: armorMod, label: "Armor (" + c.armorName + ")", source: `${c.armorWeight || "Armor"} weight: ${armorMod > 0 ? "+" : ""}${armorMod} to ${tk}` });
      }
      if (advDie !== 0) breakdown.push({ value: advDie, label: advDie > 0 ? "Advantage (d6)" : "Disadvantage (d6)", source: advDie > 0 ? "Rolled a d6 and added it" : "Rolled a d6 and subtracted it" });
      if (expBonus !== 0) {
        const expName = c.exps[modal.exp]?.n || `Exp ${modal.exp + 1}`;
        breakdown.push({ value: expBonus, label: `Experience: ${expName}`, source: `Experience bonus (+${expBonus})` });
      }
      const total = hope + fear + traitMod + advDie + expBonus; const withHope = hope >= fear;
      setResult({ hope, fear, advDie, traitMod, expBonus, total, withHope, crit: hope === fear, label: modal.label, breakdown, traitBase: base, armorMod });
      setRolling(false);
    }, 650);
  };

  return (
    <div style={S.overlay}><div style={{ ...S.modal, maxWidth: 380, textAlign: "center" }} role="dialog" aria-modal="true" aria-label="Dice roller">
      <h2 style={{ fontFamily: "'Cinzel'", fontSize: 15, margin: "0 0 8px" }}>🎲 {modal.label}</h2>
      {modal.trait && (() => { const tk = modal.trait.toLowerCase(); const base = c.traits[tk] || 0; const am = mods[tk] || 0; const eff = base + am; return (
        <div style={{ fontSize: 13, color: "#bbb", margin: "0 0 8px" }}>Trait: <strong style={{ color: "#d4a017" }}>{modal.trait.charAt(0).toUpperCase() + modal.trait.slice(1)}</strong>
          {' '}({base >= 0 ? "+" : ""}{base}{am !== 0 && <span className="kw-tip" title={`${c.armorWeight || "Armor"} armor: ${am > 0 ? "+" : ""}${am} to ${modal.trait}`} style={{ borderBottom: "1px dashed #666", cursor: "help", color: am > 0 ? "#2d6a4f" : "#e05545" }}>{' '}{am > 0 ? "+" : ""}{am}</span>}
          {' '}= <strong style={{ color: "#e0ddd5" }}>{eff >= 0 ? "+" : ""}{eff}</strong>)</div>); })()}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "12px 0" }}>
        {["none", "advantage", "disadvantage"].map(v => <label key={v} style={{ display: "flex", gap: 3, alignItems: "center", cursor: "pointer" }}>
          <input type="radio" name="adv" checked={modal.adv === v} onChange={() => setModal({ ...modal, adv: v })} style={{ accentColor: "#d4a017" }} />
          <span style={{ fontSize: 12, textTransform: "capitalize" }}>{v === "none" ? "Normal" : v}</span></label>)}
      </div>
      {c.exps?.length > 0 && <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", margin: "0 0 12px" }}>
        <span style={{ fontSize: 12, color: "#888", fontFamily: "'Barlow Condensed'", letterSpacing: ".06em" }}>EXPERIENCE</span>
        <select style={{ ...S.fs, width: "auto", minWidth: 120, fontSize: 12 }}
          value={modal.exp !== undefined ? modal.exp : ""}
          onChange={e => setModal({ ...modal, exp: e.target.value === "" ? undefined : +e.target.value })}>
          <option value="">None</option>
          {c.exps.map((exp, i) => <option key={i} value={i}>{exp.n || `Exp ${i + 1}`} (+{exp.b})</option>)}
        </select>
      </div>}
      <button onClick={rollDice} disabled={rolling} style={{ ...S.actBtn, fontSize: 14, padding: "8px 32px", background: rolling ? "#3a3a3e" : "#d4a017", color: "#0d0d0f", border: "none", letterSpacing: ".1em" }}>{rolling ? "ROLLING..." : "ROLL"}</button>

      {rolling && <div style={{ marginTop: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, color: "#d4a017", fontWeight: 700, letterSpacing: ".1em" }}>HOPE</div>
            <SpinDie sides={12} color="#d4a017" /></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, letterSpacing: ".1em" }}>FEAR</div>
            <SpinDie sides={12} color="#e05545" /></div>
        </div>
      </div>}

      {result && !rolling && <div style={{ marginTop: 16, padding: 14, border: "2px solid #3a3a3e", background: result.crit ? "#1e1e24" : "#1a1a1e", animation: "fadeIn .3s ease" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 10 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, color: "#d4a017", fontWeight: 700, letterSpacing: ".1em" }}>HOPE</div>
            <div style={{ fontFamily: "'Cinzel'", fontSize: 32, fontWeight: 900, color: result.withHope && !result.crit ? "#d4a017" : "#e0ddd5" }}>{result.hope}</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, letterSpacing: ".1em" }}>FEAR</div>
            <div style={{ fontFamily: "'Cinzel'", fontSize: 32, fontWeight: 900, color: !result.withHope && !result.crit ? "#e05545" : "#e0ddd5" }}>{result.fear}</div></div>
        </div>
        <div style={{ fontSize: 13, color: "#999", lineHeight: 2, borderTop: "1px solid #3a3a3e", paddingTop: 8, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Hope + Fear (2d12)</span><span style={{ color: "#e0ddd5" }}>{result.hope} + {result.fear} = {result.hope + result.fear}</span></div>
          {result.breakdown.map((b, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="kw-tip" title={b.source} tabIndex={0} style={{ borderBottom: "1px dashed #666", cursor: "help" }}>{b.label}</span>
            <span style={{ color: b.value > 0 ? "#2d6a4f" : b.value < 0 ? "#e05545" : "#999", fontWeight: 600 }}>{b.value > 0 ? "+" : ""}{b.value}</span>
          </div>)}
        </div>
        <div style={{ fontFamily: "'Cinzel'", fontSize: 24, fontWeight: 900, marginTop: 8, paddingTop: 8, borderTop: "1px solid #3a3a3e" }}>TOTAL: {result.total}</div>
        {modal.dc && <div style={{ fontSize: 13, marginTop: 4, fontWeight: 700, color: result.total >= modal.dc ? "#2d6a4f" : "#e05545" }}>
          vs DC {modal.dc} — {result.total >= modal.dc ? "✦ SUCCESS" : "✧ FAILURE"}
        </div>}
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6, color: result.crit ? "#d4a017" : result.withHope ? "#2d6a4f" : "#e05545" }}>
          {result.crit ? "⭐ CRITICAL SUCCESS!" : result.withHope ? "✦ With Hope" : "✧ With Fear"}</div>
      </div>}

      <button onClick={() => { setModal(null); setResult(null); }} style={{ ...S.actBtn, marginTop: 12 }}>Close</button>
    </div></div>
  );
}
