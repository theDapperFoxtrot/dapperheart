import { useRef } from 'react';
import { S } from '../../styles/theme';
import { def } from '../../state/defaults';

export function TopBar({ setC, flash, startLevelUp, openDice, menuOpen, setMenuOpen, askConfirm, exportJSON, importFile }) {
  const fr = useRef(null);

  return (
    <header className="dh-topbar" style={S.topbar}>
      <div style={{ fontFamily: "'Cinzel'", fontWeight: 900, fontSize: 14, letterSpacing: ".15em", color: "#d4a017" }}>DAPPERHEART</div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button onClick={startLevelUp} style={S.topBtn} aria-label="Level up">⬆ LVL UP</button>
        <button onClick={() => openDice("Free Roll", "")} style={S.topBtn} aria-label="Free roll">🎲</button>
        <div className="dh-overflow-wrap" style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={S.topBtn} aria-label="More options" aria-expanded={menuOpen}>⋮</button>
          {menuOpen && <div style={S.overflowMenu}>
            <button style={S.menuItem} onClick={() => { exportJSON(); setMenuOpen(false); }}>⬇ Export JSON</button>
            <button style={S.menuItem} onClick={() => { fr.current?.click(); setMenuOpen(false); }}>⬆ Import JSON</button>
            <button style={{ ...S.menuItem, color: "#e05545" }} onClick={() => { setMenuOpen(false); askConfirm("Reset all character data? This cannot be undone.", () => { setC(def()); flash("Reset!"); }); }}>↺ Reset All</button>
          </div>}
        </div>
        <input ref={fr} type="file" accept=".json" onChange={e => { importFile(e); setMenuOpen(false); }} style={{ display: "none" }} />
      </div>
    </header>
  );
}
