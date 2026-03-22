import { S } from '../../styles/theme';

export function NudgeBar({ c, cls, myCards, setTab, setHighlight }) {
  const todos = [];
  if (!c.className) todos.push({ t: "Choose a class", tab: "sheet", sec: "header" });
  else if (!c.subclass) todos.push({ t: "Choose a subclass", tab: "sheet", sec: "header" });
  if (!c.ancestry1) todos.push({ t: "Choose an ancestry", tab: "heritage", sec: "ancestry" });
  if (!c.community) todos.push({ t: "Choose a community", tab: "heritage", sec: "community" });
  if (!c.name) todos.push({ t: "Name your character", tab: "sheet", sec: "header" });
  if (cls) {
    const expected = Math.min(c.level + 1, myCards.length);
    const have = c.loadout.length + c.vault.length;
    if (have < expected) todos.push({ t: `Pick ${expected - have} more domain card${expected - have > 1 ? "s" : ""}`, tab: "cards", sec: "available-cards" });
  }
  if (!c.armorName && cls) todos.push({ t: "Equip armor", tab: "sheet", sec: "armor" });
  if (!c.wpn.pri.name && cls) todos.push({ t: "Equip a weapon", tab: "sheet", sec: "weapons" });

  if (todos.length === 0) return null;

  const goTo = (td) => {
    setTab(td.tab);
    setHighlight(td.sec);
    setTimeout(() => {
      const el = document.getElementById(`sec-${td.sec}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    setTimeout(() => setHighlight(null), 2200);
  };

  return (
    <div style={S.nudgeBar}>
      <span style={S.nudgeIcon}>⚠</span>
      <div className="dh-nudge-items" style={S.nudgeItems}>
        {todos.map((td, i) => <button key={i} onClick={() => goTo(td)} style={S.nudgeItem}>{td.t}</button>)}
      </div>
    </div>
  );
}
