import { S } from '../../styles/theme';
import { TIER_ADV, TRAITS, CLASSES } from '../../data';

export function GuideTab({ c, u, setC, cls }) {

  // Toggle a tier advancement checkbox with functional stat changes
  const toggleOpt = (t, i, wasChecked) => {
    setC(p => {
      const n = { ...p };
      const to = { ...p.tierOpts }; const cur = [...(to[t] || [])];
      const td = { ...p.tierDetails }; td[t] = { ...(td[t] || {}) };

      if (wasChecked) {
        // UNCHECK — revert stat changes
        to[t] = cur.filter(x => x !== i);
        const d = td[t][i] || {};
        switch (i) {
          case 0:
            if (d.trait1) n.traits = { ...n.traits, [d.trait1]: (n.traits[d.trait1] || 0) - 1 };
            if (d.trait2) n.traits = { ...n.traits, [d.trait2]: (n.traits[d.trait2] || 0) - 1 };
            break;
          case 1: n.hpSlots = Math.max(1, (n.hpSlots || 6) - 1); n.hpM = (n.hpM || []).slice(0, -1); break;
          case 2: n.stressSlots = Math.max(1, (n.stressSlots || 6) - 1); n.stressM = (n.stressM || []).slice(0, -1); break;
          case 3: {
            const exps = [...(n.exps || [])];
            if (d.exp1 !== undefined && exps[d.exp1]) exps[d.exp1] = { ...exps[d.exp1], b: exps[d.exp1].b - 1 };
            if (d.exp2 !== undefined && exps[d.exp2]) exps[d.exp2] = { ...exps[d.exp2], b: exps[d.exp2].b - 1 };
            n.exps = exps; break;
          }
          case 5: n.baseEvasion = Math.max(0, (n.baseEvasion || 10) - 1); break;
          case 7: n.proficiency = Math.max(0, (n.proficiency || 0) - 1); break;
          case 8: if (d.mc) n.multiclass = ""; break;
        }
        delete td[t][i];
      } else {
        // CHECK — apply simple stat changes (complex ones wait for dropdown selection)
        to[t] = [...cur, i];
        td[t][i] = {};
        switch (i) {
          case 1: n.hpSlots = (n.hpSlots || 6) + 1; n.hpM = [...(n.hpM || []), false]; break;
          case 2: n.stressSlots = (n.stressSlots || 6) + 1; n.stressM = [...(n.stressM || []), false]; break;
          case 5: n.baseEvasion = (n.baseEvasion || 10) + 1; break;
          case 7: n.proficiency = (n.proficiency || 0) + 1; break;
        }
      }
      n.tierOpts = to; n.tierDetails = td;
      return n;
    });
  };

  // Update detail selection for a tier option (traits, experiences, multiclass)
  const setDetail = (t, i, key, val) => {
    setC(p => {
      const n = { ...p };
      const td = { ...p.tierDetails }; td[t] = { ...(td[t] || {}) };
      const old = td[t][i] || {};
      const next = { ...old, [key]: val };

      // Revert old value, apply new value
      if (i === 0) {
        // Trait change
        if (old[key]) n.traits = { ...n.traits, [old[key]]: (n.traits[old[key]] || 0) - 1 };
        if (val) n.traits = { ...n.traits, [val]: (n.traits[val] || 0) + 1 };
      }
      if (i === 3) {
        // Experience change
        const exps = [...(n.exps || [])];
        const oldIdx = old[key];
        if (oldIdx !== undefined && exps[oldIdx]) exps[oldIdx] = { ...exps[oldIdx], b: exps[oldIdx].b - 1 };
        if (val !== undefined && val !== "" && exps[+val]) exps[+val] = { ...exps[+val], b: exps[+val].b + 1 };
        n.exps = exps;
        next[key] = val === "" ? undefined : +val;
      }
      if (i === 8 && key === "mc") {
        if (old.mc) n.multiclass = "";
        if (val) n.multiclass = val;
      }

      td[t][i] = next;
      n.tierDetails = td;
      return n;
    });
  };

  // Collect all traits already boosted across all tiers (for filtering available options)
  const boostedTraits = new Set();
  [2, 3, 4].forEach(t => {
    const d = c.tierDetails?.[t] || {};
    Object.values(d).forEach(det => {
      if (det.trait1) boostedTraits.add(det.trait1);
      if (det.trait2) boostedTraits.add(det.trait2);
    });
  });

  return (
    <div>
      {cls && <div style={S.sec}><h3 style={S.secH}>{c.className.toUpperCase()} INFO</h3><p style={S.feat}>Suggested: {cls.traits}</p></div>}
      {cls && <div style={S.sec}><h3 style={S.secH}>BACKGROUND</h3>{cls.bgQ.map((q, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontSize: 11, color: "#888", fontStyle: "italic", margin: "0 0 2px" }}>{q}</p><textarea style={S.notes} rows={2} value={c.bgA?.[i] || ""} onChange={e => { const a = [...(c.bgA || ["", "", ""])]; a[i] = e.target.value; u("bgA", a); }} /></div>)}</div>}
      {cls && <div style={S.sec}><h3 style={S.secH}>CONNECTIONS</h3>{cls.connQ.map((q, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontSize: 11, color: "#888", fontStyle: "italic", margin: "0 0 2px" }}>{q}</p><textarea style={S.notes} rows={2} value={c.conA?.[i] || ""} onChange={e => { const a = [...(c.conA || ["", "", ""])]; a[i] = e.target.value; u("conA", a); }} /></div>)}</div>}

      {[2, 3, 4].map(t => {
        const opts = TIER_ADV[t].opts;
        return (
          <div key={t} style={S.sec}>
            <h3 style={S.secH}>TIER {t}: {TIER_ADV[t].r}</h3>
            <p style={S.feat}>{TIER_ADV[t].up}</p>
            {opts.map((opt, i) => {
              const ch = (c.tierOpts?.[t] || []).includes(i);
              const d = c.tierDetails?.[t]?.[i] || {};
              // For trait dropdowns, filter out traits already boosted in OTHER tier/option combos
              const availableTraits = TRAITS.filter(tr => {
                if (tr.k === d.trait1 || tr.k === d.trait2) return true;
                return !boostedTraits.has(tr.k);
              });

              return (
                <div key={i} style={{
                  marginBottom: ch ? 12 : 3,
                  borderLeft: ch ? "3px solid #d4a017" : "3px solid transparent",
                  background: ch ? "#1a1a1e" : "transparent",
                  padding: ch ? "8px 8px 8px 10px" : "2px 0 2px 4px",
                  borderRadius: ch ? 4 : 0
                }}>
                  <label style={{ display: "flex", gap: 5, cursor: "pointer" }}>
                    <input type="checkbox" checked={ch}
                      onChange={() => toggleOpt(t, i, ch)}
                      style={{ marginTop: 2, accentColor: "#d4a017" }} />
                    <span style={{ fontSize: 11, fontWeight: ch ? 700 : 400 }}>{opt}</span>
                  </label>

                  {/* Option 0: +1 to two unmarked traits */}
                  {ch && i === 0 && <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <label style={{ flex: 1, minWidth: 100 }}><span style={S.fl}>TRAIT 1</span>
                      <select style={S.fs} value={d.trait1 || ""} onChange={e => setDetail(t, 0, "trait1", e.target.value || "")}>
                        <option value="">— pick —</option>
                        {availableTraits.filter(tr => tr.k !== d.trait2).map(tr =>
                          <option key={tr.k} value={tr.k}>{tr.l} (currently {c.traits[tr.k] >= 0 ? "+" : ""}{c.traits[tr.k] || 0})</option>)}
                      </select></label>
                    <label style={{ flex: 1, minWidth: 100 }}><span style={S.fl}>TRAIT 2</span>
                      <select style={S.fs} value={d.trait2 || ""} onChange={e => setDetail(t, 0, "trait2", e.target.value || "")}>
                        <option value="">— pick —</option>
                        {availableTraits.filter(tr => tr.k !== d.trait1).map(tr =>
                          <option key={tr.k} value={tr.k}>{tr.l} (currently {c.traits[tr.k] >= 0 ? "+" : ""}{c.traits[tr.k] || 0})</option>)}
                      </select></label>
                    {d.trait1 && d.trait2 && <p style={{ fontSize: 12, color: "#2d6a4f", width: "100%", margin: 0 }}>
                      ✓ {d.trait1.charAt(0).toUpperCase() + d.trait1.slice(1)} → {c.traits[d.trait1] >= 0 ? "+" : ""}{c.traits[d.trait1] || 0},
                      {" "}{d.trait2.charAt(0).toUpperCase() + d.trait2.slice(1)} → {c.traits[d.trait2] >= 0 ? "+" : ""}{c.traits[d.trait2] || 0}</p>}
                  </div>}

                  {/* Option 1: +1 HP slot */}
                  {ch && i === 1 && <p style={{ fontSize: 12, color: "#2d6a4f", margin: "4px 0 0" }}>✓ HP slots: {c.hpSlots}</p>}

                  {/* Option 2: +1 Stress slot */}
                  {ch && i === 2 && <p style={{ fontSize: 12, color: "#2d6a4f", margin: "4px 0 0" }}>✓ Stress slots: {c.stressSlots}</p>}

                  {/* Option 3: +1 to two Experiences */}
                  {ch && i === 3 && <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <label style={{ flex: 1, minWidth: 100 }}><span style={S.fl}>EXPERIENCE 1</span>
                      <select style={S.fs} value={d.exp1 !== undefined ? d.exp1 : ""} onChange={e => setDetail(t, 3, "exp1", e.target.value)}>
                        <option value="">— pick —</option>
                        {c.exps.map((exp, ei) => <option key={ei} value={ei} disabled={ei === d.exp2}>{exp.n || `Exp ${ei + 1}`} (+{exp.b})</option>)}
                      </select></label>
                    <label style={{ flex: 1, minWidth: 100 }}><span style={S.fl}>EXPERIENCE 2</span>
                      <select style={S.fs} value={d.exp2 !== undefined ? d.exp2 : ""} onChange={e => setDetail(t, 3, "exp2", e.target.value)}>
                        <option value="">— pick —</option>
                        {c.exps.map((exp, ei) => <option key={ei} value={ei} disabled={ei === d.exp1}>{exp.n || `Exp ${ei + 1}`} (+{exp.b})</option>)}
                      </select></label>
                    {d.exp1 !== undefined && d.exp2 !== undefined && <p style={{ fontSize: 12, color: "#2d6a4f", width: "100%", margin: 0 }}>
                      ✓ {c.exps[d.exp1]?.n || `Exp ${d.exp1 + 1}`} +{c.exps[d.exp1]?.b},
                      {" "}{c.exps[d.exp2]?.n || `Exp ${d.exp2 + 1}`} +{c.exps[d.exp2]?.b}</p>}
                  </div>}

                  {/* Option 4: Extra domain card */}
                  {ch && i === 4 && <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0", fontStyle: "italic" }}>Select from your domain cards in the Cards tab</p>}

                  {/* Option 5: +1 Evasion */}
                  {ch && i === 5 && <p style={{ fontSize: 12, color: "#2d6a4f", margin: "4px 0 0" }}>✓ Evasion: {c.baseEvasion}</p>}

                  {/* Option 6: Upgraded subclass card */}
                  {ch && i === 6 && <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0", fontStyle: "italic" }}>Take your next subclass feature card</p>}

                  {/* Option 7: +1 Proficiency */}
                  {ch && i === 7 && <p style={{ fontSize: 12, color: "#2d6a4f", margin: "4px 0 0" }}>✓ Proficiency: +{c.proficiency}</p>}

                  {/* Option 8: Multiclass */}
                  {ch && i === 8 && !c.multiclass && <div style={{ marginTop: 6 }}>
                    <select style={S.fs} value={d.mc || ""} onChange={e => setDetail(t, 8, "mc", e.target.value)}>
                      <option value="">— pick class —</option>
                      {Object.keys(CLASSES).filter(cn => cn !== c.className).map(cn =>
                        <option key={cn} value={cn}>{cn} ({CLASSES[cn].domains.join(" & ")})</option>)}
                    </select>
                    {d.mc && <p style={{ fontSize: 12, color: "#2d6a4f", margin: "4px 0 0" }}>✓ New domains: {CLASSES[d.mc]?.domains.join(" & ")}</p>}
                  </div>}
                  {ch && i === 8 && c.multiclass && !d.mc && <p style={{ fontSize: 12, color: "#2d6a4f", margin: "4px 0 0" }}>✓ Multiclass: {c.multiclass}</p>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
