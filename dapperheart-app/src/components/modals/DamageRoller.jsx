import { S } from '../../styles/theme';
import { rollDamage } from '../../utils';

export function DamageRoller({ modal, setModal, result, setResult, compMinor, compMajor, compSevere }) {
  if (!modal) return null;

  const rollDmg = () => {
    const r = rollDamage(modal.dice, modal.prof);
    if (!r) { setResult({ error: true }); return; }
    if (!modal.hasPowerful) r.powerfulBonus = 0;
    r.total = r.rolls.reduce((a, b) => a + b, 0) + r.flat + r.proficiency + (modal.hasPowerful ? r.powerfulBonus : 0);
    setResult(r);
  };

  return (
    <div style={S.overlay}><div style={{ ...S.modal, maxWidth: 380, textAlign: "center" }} role="dialog" aria-modal="true" aria-label="Damage roller">
      <h2 style={{ fontFamily: "'Cinzel'", fontSize: 15, margin: "0 0 6px", color: "#e05545" }}>💥 {modal.label} Damage</h2>
      <div style={{ fontSize: 13, color: "#bbb", margin: "0 0 8px" }}>
        <span style={{ fontWeight: 700 }}>{modal.dice}</span> + {modal.prof} proficiency
        {modal.hasPowerful && <span style={{ color: "#d4a017", marginLeft: 6 }}>✦ Powerful</span>}
      </div>

      <button onClick={rollDmg} style={{ ...S.actBtn, fontSize: 14, padding: "10px 32px", background: "#e05545", color: "#0d0d0f", border: "none", letterSpacing: ".1em", fontWeight: 700 }}>ROLL DAMAGE</button>

      {result && !result.error && <div style={{ marginTop: 16, padding: 14, border: "2px solid #3a3a3e", background: "#1a1a1e" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          {result.rolls.map((r, i) => <div key={i} style={{
            width: 42, height: 42, borderRadius: 6, border: "2px solid #e05545", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cinzel'", fontWeight: 900, fontSize: 20,
            background: r === result.sides ? "#e05545" : "#1a1a1e", color: r === result.sides ? "#0d0d0f" : "#e0ddd5"
          }}>{r}</div>)}
        </div>
        <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>
          <div>Dice: {result.rolls.join(" + ")} = {result.rolls.reduce((a, b) => a + b, 0)}</div>
          {result.flat > 0 && <div>Flat bonus: +{result.flat}</div>}
          <div>Proficiency: +{result.proficiency}</div>
          {result.powerfulBonus > 0 && <div style={{ color: "#d4a017" }}>Powerful reroll: +{result.powerfulBonus} (max rolled!)</div>}
        </div>
        <div style={{ fontFamily: "'Cinzel'", fontSize: 24, fontWeight: 900, marginTop: 8, color: "#e05545" }}>{result.total} DAMAGE</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
          {result.total >= compSevere ? "→ SEVERE (mark 3 HP)" : result.total >= compMajor ? "→ MAJOR (mark 2 HP)" : result.total >= compMinor ? "→ MINOR (mark 1 HP)" : "→ Below threshold (no HP marked)"}
        </div>
      </div>}
      {result?.error && <div style={{ marginTop: 12, color: "#e05545", fontSize: 13 }}>Could not parse dice formula. Use format like "d8+2" or "2d6+3".</div>}

      <button onClick={() => { setModal(null); setResult(null); }} style={{ ...S.actBtn, marginTop: 12 }}>Close</button>
    </div></div>
  );
}
