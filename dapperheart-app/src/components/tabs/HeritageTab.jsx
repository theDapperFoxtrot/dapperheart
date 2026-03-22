import { S } from '../../styles/theme';
import { CLASSES, ANCESTRIES, COMMUNITIES } from '../../data';
import { KW } from '../shared/KW';

export function HeritageTab({ c, u, cls, tier, highlight }) {
  return (
    <div>
      <div id="sec-ancestry" style={{ ...S.sec, ...(highlight === "ancestry" ? S.hl : {}) }}><h3 style={S.secH}>ANCESTRY (Mixed OK)</h3>
        <div style={S.row}>
          <label style={S.fg}><span style={S.fl}>PRIMARY</span><select style={S.fs} value={c.ancestry1} onChange={e => { u("ancestry1", e.target.value); u("ancestryFeat1", "first"); }}><option value="">—</option>{ANCESTRIES.map(a => <option key={a.name}>{a.name}</option>)}</select></label>
          <label style={S.fg}><span style={S.fl}>SECOND (blank = pure)</span><select style={S.fs} value={c.ancestry2} onChange={e => { u("ancestry2", e.target.value); u("ancestryFeat2", "second"); }}><option value="">Same</option>{ANCESTRIES.map(a => <option key={a.name}>{a.name}</option>)}</select></label>
        </div>
        {c.ancestry1 && c.ancestry2 && c.ancestry1 !== c.ancestry2 && <div style={{ background: "#1a1a1e", padding: 8, marginTop: 8, border: "1px solid #ddd" }}>
          <p style={{ ...S.fl, marginBottom: 4 }}>CHOOSE FEATURES</p>
          {[{ k: "ancestryFeat1", n: c.ancestry1 }, { k: "ancestryFeat2", n: c.ancestry2 }].map(({ k, n }) => { const anc = ANCESTRIES.find(a => a.name === n); return anc && <div key={k} style={{ marginBottom: 4 }}><strong style={{ fontSize: 11 }}>{n}:</strong>
            {anc.features.map((f, fi) => <label key={fi} style={{ display: "flex", gap: 4, marginTop: 2, cursor: "pointer" }}><input type="radio" name={k} checked={c[k] === (fi === 0 ? "first" : "second")} onChange={() => u(k, fi === 0 ? "first" : "second")} style={{ accentColor: "#d4a017" }} /><span style={{ fontSize: 13 }}>{f}</span></label>)}</div>; })}
        </div>}
        {c.ancestry1 && (!c.ancestry2 || c.ancestry2 === c.ancestry1) && (() => { const anc = ANCESTRIES.find(a => a.name === c.ancestry1); return anc && <div style={{ background: "#1a1a1e", padding: 10, marginTop: 8, border: "1px solid #3a3a3e" }}>
          <p style={{ ...S.fl, marginBottom: 6 }}>YOUR FEATURES (both active)</p>
          {anc.features.map((f, i) => <p key={i} style={{ ...S.feat, fontSize: 13, marginBottom: 4 }}><KW text={f} /></p>)}
        </div>; })()}
      </div>
      <div id="sec-community" style={{ ...S.sec, ...(highlight === "community" ? S.hl : {}) }}><h3 style={S.secH}>COMMUNITIES</h3>
        <div className="dh-card-grid" style={S.cardGrid}>{COMMUNITIES.map(cm => <div key={cm.name} style={{ ...S.card, ...(c.community === cm.name ? { borderColor: "#d4a017", borderWidth: 2 } : {}) }}>
          <div style={{ ...S.cardName, ...(c.community === cm.name ? { color: "#d4a017" } : {}) }}>{cm.name}{c.community === cm.name ? " ✓" : ""}</div>
          <div style={{ ...S.cardDesc, fontWeight: 600 }}>{cm.feature}</div>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 3 }}>{cm.adj.map(a => <span key={a} style={S.adjTag}>{a}</span>)}</div>
          <button style={{ ...S.cardBtn, marginTop: 4 }} onClick={() => u("community", c.community === cm.name ? "" : cm.name)}>{c.community === cm.name ? "Clear" : "Select"}</button>
        </div>)}</div></div>
      {(tier >= 3 || c.multiclass) && <div style={S.sec}><h3 style={S.secH}>MULTICLASS</h3>
        <select style={S.fs} value={c.multiclass} onChange={e => u("multiclass", e.target.value)}><option value="">None</option>{Object.keys(CLASSES).filter(cn => cn !== c.className).map(cn => <option key={cn}>{cn}</option>)}</select>
        {c.multiclass && <p style={S.feat}>New domains: {CLASSES[c.multiclass].domains.join(" & ")}</p>}</div>}
    </div>
  );
}
