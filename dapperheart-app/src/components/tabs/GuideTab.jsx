import { S } from '../../styles/theme';
import { TIER_ADV } from '../../data';

export function GuideTab({ c, u, cls }) {
  return (
    <div>
      {cls && <div style={S.sec}><h3 style={S.secH}>{c.className.toUpperCase()} INFO</h3><p style={S.feat}>Suggested: {cls.traits}</p></div>}
      {cls && <div style={S.sec}><h3 style={S.secH}>BACKGROUND</h3>{cls.bgQ.map((q, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontSize: 11, color: "#888", fontStyle: "italic", margin: "0 0 2px" }}>{q}</p><textarea style={S.notes} rows={2} value={c.bgA?.[i] || ""} onChange={e => { const a = [...(c.bgA || ["", "", ""])]; a[i] = e.target.value; u("bgA", a); }} /></div>)}</div>}
      {cls && <div style={S.sec}><h3 style={S.secH}>CONNECTIONS</h3>{cls.connQ.map((q, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontSize: 11, color: "#888", fontStyle: "italic", margin: "0 0 2px" }}>{q}</p><textarea style={S.notes} rows={2} value={c.conA?.[i] || ""} onChange={e => { const a = [...(c.conA || ["", "", ""])]; a[i] = e.target.value; u("conA", a); }} /></div>)}</div>}
      {[2, 3, 4].map(t => <div key={t} style={S.sec}><h3 style={S.secH}>TIER {t}: {TIER_ADV[t].r}</h3><p style={S.feat}>{TIER_ADV[t].up}</p>
        {TIER_ADV[t].opts.map((opt, i) => { const ch = (c.tierOpts?.[t] || []).includes(i); return (<label key={i} style={{ display: "flex", gap: 5, marginBottom: 3, cursor: "pointer" }}><input type="checkbox" checked={ch} onChange={() => { const cur = c.tierOpts?.[t] || []; u("tierOpts", { ...c.tierOpts, [t]: ch ? cur.filter(x => x !== i) : [...cur, i] }); }} style={{ marginTop: 2, accentColor: "#d4a017" }} /><span style={{ fontSize: 11 }}>{opt}</span></label>); })}</div>)}
    </div>
  );
}
