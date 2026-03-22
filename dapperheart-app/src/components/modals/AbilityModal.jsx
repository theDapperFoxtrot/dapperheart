import { S } from '../../styles/theme';
import { KW } from '../shared/KW';
import { parseAbilityRoll } from '../../utils';

export function AbilityModal({ modal, setModal, hopeCount, stressCount, c, commitAbility, openDice }) {
  if (!modal) return null;
  const roll = parseAbilityRoll(modal.desc);

  return (
    <div style={S.overlay}><div style={{ ...S.modal, maxWidth: 400, textAlign: "center" }} role="dialog" aria-modal="true" aria-label="Use ability">
      <h2 style={{ fontFamily: "'Cinzel'", fontSize: 14, margin: "0 0 8px", color: "#d4a017" }}>{modal.name}</h2>
      <p style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, margin: "0 0 12px", textAlign: "left" }}><KW text={modal.desc} /></p>
      {modal.cost ? <div style={{ border: "1px solid #3a3a3e", padding: 10, marginBottom: 12, background: "#1a1a1e" }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>COST: {modal.cost.amount} {modal.cost.resource.toUpperCase()}</div>
        <div style={{ fontSize: 13, color: "#999" }}>
          {modal.cost.resource === "hope" ? `You have ${hopeCount}/${c.hopeSlots} Hope` : `Stress: ${stressCount}/${c.stressSlots} filled`}
        </div>
        {modal.cost.resource === "hope" && hopeCount < modal.cost.amount && <div style={{ color: "#e05545", fontSize: 13, fontWeight: 700, marginTop: 4 }}>Not enough Hope!</div>}
      </div> : <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>No resource cost — use freely.</div>}
      {roll && <div style={{ border: "1px solid #3a3a3e", padding: 8, marginBottom: 12, background: "#1a1a1e", fontSize: 12, color: "#bbb" }}>
        <span style={{ fontWeight: 700, color: "#50a0ff" }}>🎲 Requires: {roll.type}</span>
        {roll.difficulty && <span style={{ color: "#d4a017", marginLeft: 6 }}>(DC {roll.difficulty})</span>}
      </div>}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        <button style={S.actBtn} onClick={() => setModal(null)}>Cancel</button>
        {!modal.cost && !roll && <button style={{ ...S.actBtn, background: "#3a3a3e", color: "#e0ddd5", border: "none" }} onClick={() => setModal(null)}>OK</button>}
        {modal.cost && !roll && <button style={{ ...S.actBtn, background: "#d4a017", color: "#0d0d0f", border: "none" }}
          disabled={modal.cost.resource === "hope" && hopeCount < modal.cost.amount}
          onClick={commitAbility}>Spend & Use</button>}
        {!modal.cost && roll && <button style={{ ...S.actBtn, background: "#50a0ff", color: "#0d0d0f", border: "none" }}
          onClick={() => { setModal(null); openDice(modal.name, roll.trait, roll.difficulty); }}>🎲 Roll</button>}
        {modal.cost && roll && <button style={{ ...S.actBtn, background: "#50a0ff", color: "#0d0d0f", border: "none" }}
          disabled={modal.cost.resource === "hope" && hopeCount < modal.cost.amount}
          onClick={() => { commitAbility(); openDice(modal.name, roll.trait, roll.difficulty); }}>Spend & Roll 🎲</button>}
      </div>
    </div></div>
  );
}
