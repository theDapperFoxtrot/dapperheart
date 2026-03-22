import { S } from '../../styles/theme';
import { CLASSES, ARMOR_DB, WEAPON_DB, WEIGHT_MODS, RANGE_OPTIONS, TRAIT_OPTIONS, DMG_TYPE_OPTIONS, TRAITS, ANCESTRIES, COMMUNITIES } from '../../data';
import { KW } from '../shared/KW';
import { smartToggle, parseAbilityCost } from '../../utils';
import { getTraitBreakdown, getTraitTotalMod, getEvasionBreakdown, getProfBreakdown } from '../../state/computed';

export function SheetTab({ c, u, setC, cls, mods, effEvasion, effTraits, hopeCount, stressCount, isVulnerable,
  compMinor, compMajor, compSevere, myDomains, highlight, advH,
  openDice, openDmg, openModPopup, useAbility, equipArmor, equipWeapon, selectClass, setArmorWeight, flash, askConfirm, acquiredNames }) {
  return (
    <main id="main-content" role="main" aria-label="Character sheet">
      {/* HEADER */}
      <div id="sec-header" className="dh-header" style={{ ...S.sheetHead, ...(highlight === "header" ? S.hl : {}) }}>
        <div style={S.classBlock}><div style={S.classTag}>{c.className || "CLASS"}{c.multiclass ? ` / ${c.multiclass}` : ""}</div>
          {myDomains.length > 0 && <div style={S.domLine}>{myDomains.join(" & ")}</div>}</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={S.row}>
            <label style={S.fg}><span style={S.fl}>NAME</span><input style={S.fi} value={c.name} onChange={e => u("name", e.target.value)} /></label>
            <label style={S.fg}><span style={S.fl}>PRONOUNS</span><input style={S.fi} value={c.pronouns} onChange={e => u("pronouns", e.target.value)} /></label>
          </div>
          <div style={S.row}>
            <label style={S.fg}><span style={S.fl}>CLASS</span><select style={S.fs} value={c.className} onChange={e => selectClass(e.target.value)}><option value="">—</option>{Object.keys(CLASSES).map(cn => <option key={cn}>{cn}</option>)}</select></label>
            <label style={S.fg}><span style={S.fl}>SUBCLASS</span><select style={S.fs} value={c.subclass} onChange={e => u("subclass", e.target.value)} disabled={!cls}><option value="">—</option>{cls?.subs.map(s => <option key={s}>{s}</option>)}</select></label>
          </div>
          <div style={S.row}>
            <div style={S.fg}><span style={S.fl}>ANCESTRY</span><div style={{ fontSize: 13, color: c.ancestry1 ? "#e0ddd5" : "#666" }}>{c.ancestry1 ? (c.ancestry2 && c.ancestry2 !== c.ancestry1 ? `${c.ancestry1} / ${c.ancestry2}` : c.ancestry1) : "— set in Heritage tab"}</div></div>
            <div style={S.fg}><span style={S.fl}>COMMUNITY</span><div style={{ fontSize: 13, color: c.community ? "#e0ddd5" : "#666" }}>{c.community || "— set in Heritage tab"}</div></div>
          </div>
        </div>
        <div style={S.levelBlock}><span style={S.fl}>LEVEL</span><input type="number" min={1} max={10} value={c.level} onChange={e => u("level", Math.max(1, Math.min(10, +e.target.value)))} style={S.levelNum} /></div>
      </div>

      {/* TRAITS */}
      <h3 style={{ ...S.secH, marginTop: 8, marginBottom: 4 }}>CHARACTER TRAITS</h3>
      <div className="dh-traits" style={S.traitsBar}>{TRAITS.map(t => { const base = c.traits[t.k] || 0; const mod = mods[t.k] || 0; const bd = getTraitBreakdown(t.k, c); const totalMod = getTraitTotalMod(t.k, c); const hasMods = bd.length > 0; return (
        <label key={t.k} style={S.traitCell}>
          <div style={{ ...S.traitCircle, ...(mod ? { borderColor: mod > 0 ? "#2d6a4f" : "#e05545" } : {}) }}>
            <input type="number" value={base} onChange={e => setC(p => ({ ...p, traits: { ...p.traits, [t.k]: +e.target.value } }))} style={{ ...S.traitInput, ...(mod ? { color: mod > 0 ? "#2d6a4f" : "#e05545" } : {}) }} aria-label={t.l} />
          </div>
          <button onClick={() => openDice(`${t.l} Roll`, t.k)} style={{ background: "none", border: "none", padding: "2px 0", cursor: "pointer", fontFamily: "'Barlow Condensed'", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: "#e0ddd5" }} title={`Roll 2d12 + ${t.l} (${(base + mod) >= 0 ? "+" : ""}${base + mod})`}>{t.l} 🎲</button>
          <span style={S.traitSub}>{t.s}</span>
          {hasMods && <button className="dh-mod-badge" onClick={e => openModPopup(e, t.l, bd)}
            style={{ fontSize: 11, fontWeight: 700, color: totalMod > 0 ? "#2d6a4f" : totalMod < 0 ? "#e05545" : "#999", background: "#1a1a1e", border: "1px solid " + (totalMod > 0 ? "#2d6a4f" : totalMod < 0 ? "#e05545" : "#555"), borderRadius: 3, padding: "1px 6px", cursor: "pointer", marginTop: 2 }}>
            {totalMod > 0 ? "+" : ""}{totalMod} mods</button>}
        </label>); })}</div>

      {/* EVASION + ARMOR SLOTS ROW */}
      <div className="dh-stat-row" style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "stretch", flexWrap: "wrap" }}>
        <div style={{ ...S.bigStat, justifyContent: "center" }}>
          <span style={{ ...S.bigStatNum, color: mods.evasion ? "#d4a017" : "#e0ddd5", cursor: "default" }}>{effEvasion}</span>
          <div style={S.bigStatLabel}>EVASION</div>
          {(mods.evasion || advH.some(a => a.type === "evasion")) && <button className="dh-mod-badge" onClick={e => openModPopup(e, "Evasion", getEvasionBreakdown(c, cls))}
            style={{ fontSize: 11, fontWeight: 700, color: "#999", background: "#1a1a1e", border: "1px solid #555", borderRadius: 3, padding: "1px 6px", cursor: "pointer", marginTop: 2 }}>
            breakdown</button>}
        </div>
        {/* ARMOR SLOTS inline */}
        <div style={{ ...S.sec, flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: 8, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={S.trkLabel}>ARMOR SLOTS</span>
            <span style={S.trkCount}>{(c.armorM || []).filter(Boolean).length}/{c.armorTotal}</span>
          </div>
          <div style={S.trkSlots}>{Array.from({ length: c.armorTotal || 0 }).map((_, i) => { const filled = !!c.armorM?.[i]; return (
            <button key={i} onClick={() => u("armorM", smartToggle(c.armorM, c.armorTotal, filled))}
              style={{ ...S.armorS, ...(filled ? S.armorSOn : {}) }}>{filled ? "✕" : ""}</button>); })}</div>
          {c.armorName && <div style={{ fontSize: 12, color: "#888", fontFamily: "'Barlow'" }}>{c.armorName} — <KW text={c.armorFeat} /></div>}
        </div>
        <div style={{ ...S.bigStat, flex: 1, minWidth: 90, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => u("proficiency", Math.max(0, (c.proficiency || 0) - 1))} style={S.adjBtn}>−</button>
            <span style={{ fontFamily: "'Cinzel'", fontWeight: 900, fontSize: 32, minWidth: 30, textAlign: "center" }}>{c.proficiency || 0}</span>
            <button onClick={() => u("proficiency", (c.proficiency || 0) + 1)} style={S.adjBtn}>+</button>
          </div>
          <div style={S.bigStatLabel}>PROFICIENCY</div>
          {advH.some(a => a.type === "proficiency") && <button className="dh-mod-badge" onClick={e => openModPopup(e, "Proficiency", getProfBreakdown(c))}
            style={{ fontSize: 11, fontWeight: 700, color: "#2d6a4f", background: "#1a1a1e", border: "1px solid #2d6a4f", borderRadius: 3, padding: "1px 6px", cursor: "pointer", marginTop: 2 }}>
            +{advH.filter(a => a.type === "proficiency").length} adv</button>}
        </div>
        {/* INSPIRATION */}
        <div style={{ ...S.bigStat, flex: 1, minWidth: 90, borderColor: "#d4a017", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => u("inspiration", Math.max(0, (c.inspiration || 0) - 1))} style={S.adjBtn}>−</button>
            <span style={{ fontFamily: "'Cinzel'", fontWeight: 900, fontSize: 32, minWidth: 30, textAlign: "center" }}>{c.inspiration || 0}</span>
            <button onClick={() => u("inspiration", (c.inspiration || 0) + 1)} style={S.adjBtn}>+</button>
          </div>
          <div style={{ ...S.bigStatLabel, color: "#d4a017" }}>INSPIRATION</div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dh-main-grid" style={S.mainGrid}>
        {/* LEFT: DAMAGE & HEALTH */}
        <div style={S.leftCol}>
          <div style={S.sec}>
            <h3 style={S.secH}>DAMAGE & HEALTH</h3>
            <p style={{ fontSize: 11, color: "#888", margin: "0 0 6px" }}>Thresholds = armor base + level ({c.level})</p>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[["MINOR", compMinor, c.armorMinor, "1 HP"], ["MAJOR", compMajor, c.armorMajor, "2 HP"], ["SEVERE", compSevere, c.armorMajor * 2, "3 HP"]].map(([l, val, base, s]) =>
                <div key={l} style={S.thresh}><span style={S.threshL}>{l}</span><span style={S.threshS}>Mark {s}</span>
                  <div style={{ fontFamily: "'Cinzel'", fontWeight: 700, fontSize: 18, color: "#e0ddd5", marginTop: 2 }}>{val}</div>
                  <span style={{ fontSize: 11, color: "#888" }}>{base} + {c.level}</span>
                </div>)}
            </div>
            {/* HP */}
            <div style={S.trkRow}><span style={S.trkLabel}>HP</span>
              <div style={S.trkSlots}>{Array.from({ length: c.hpSlots }).map((_, i) => { const filled = !!c.hpM?.[i]; return (
                <button key={i} onClick={() => u("hpM", smartToggle(c.hpM, c.hpSlots, filled))}
                  style={{ ...S.hpBox, ...(filled ? S.hpOn : {}) }}>{filled ? "✕" : ""}</button>); })}</div>
              <span style={S.trkCount}>{(c.hpM || []).filter(Boolean).length}/{c.hpSlots}</span>
              {advH.some(a => a.type === "hp") && <span className="kw-tip" title={`+${advH.filter(a => a.type === "hp").length} slot(s) from advancement`} tabIndex={0}
                style={{ fontSize: 10, color: "#2d6a4f", fontWeight: 700, cursor: "help", borderBottom: "1px dashed #2d6a4f" }}>+{advH.filter(a => a.type === "hp").length} adv</span>}</div>
            {/* STRESS */}
            <div style={S.trkRow}><span style={S.trkLabel}>STRESS</span>
              <div style={S.trkSlots}>{Array.from({ length: c.stressSlots }).map((_, i) => { const filled = !!c.stressM?.[i]; return (
                <button key={i} onClick={() => u("stressM", smartToggle(c.stressM, c.stressSlots, filled))}
                  style={{ ...S.stressO, ...(filled ? S.stressOn : {}),
                    ...(isVulnerable ? { borderColor: "#e05545" } : {}) }}>{filled ? "●" : ""}</button>); })}</div>
              <span style={S.trkCount}>{stressCount}/{c.stressSlots}</span>
              {advH.some(a => a.type === "stress") && !isVulnerable && <span className="kw-tip" title={`+${advH.filter(a => a.type === "stress").length} slot(s) from advancement`} tabIndex={0}
                style={{ fontSize: 10, color: "#2d6a4f", fontWeight: 700, cursor: "help", borderBottom: "1px dashed #2d6a4f" }}>+{advH.filter(a => a.type === "stress").length} adv</span>}
              {isVulnerable && <span className="kw-tip" title="VULNERABLE: When all Stress slots are filled, you are Vulnerable. You cannot spend Stress and take +1 additional damage from all sources. Clear a Stress slot to remove this condition." tabIndex={0}
                style={{ fontSize: 11, fontWeight: 700, color: "#0d0d0f", background: "#e05545", padding: "2px 8px", borderRadius: 3, marginLeft: 4, cursor: "help", animation: "fadeIn .3s" }}>VULNERABLE</span>}
            </div>
          </div>
          {/* HOPE */}
          <div style={S.sec}>
            <h3 style={S.secH}>HOPE</h3>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {Array.from({ length: c.hopeSlots }).map((_, i) => { const filled = !!c.hopeM?.[i]; return (
                <button key={i} onClick={() => u("hopeM", smartToggle(c.hopeM, c.hopeSlots, filled))}
                  style={{ ...S.hopeD, ...(filled ? S.hopeDOn : {}) }} />); })}
              <span style={{ ...S.trkCount, marginLeft: 6, color: "#d4a017" }}>{(c.hopeM || []).filter(Boolean).length}/{c.hopeSlots}</span>
            </div>
            {cls && <div style={{ cursor: "pointer" }} onClick={() => useAbility(c.className + " Hope Feature", cls.hope)}><p style={{ ...S.feat, borderLeftColor: "#50a0ff" }}><KW text={cls.hope} /><span style={{ fontSize: 12, color: "#50a0ff", marginLeft: 6 }}>TAP TO USE</span></p></div>}
          </div>
          {/* EXPERIENCE */}
          <div style={S.sec}>
            <h3 style={S.secH}>EXPERIENCE</h3>
            {c.exps.map((exp, i) => <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 3 }}>
              <input style={{ ...S.fi, flex: 1, fontSize: 11 }} value={exp.n} placeholder={`Exp ${i + 1}`}
                onChange={e => { const x = [...c.exps]; x[i] = { ...x[i], n: e.target.value }; u("exps", x); }} />
              <span style={{ fontFamily: "'Cinzel'", fontWeight: 700, fontSize: 13 }}>+{exp.b}</span></div>)}
          </div>
          {/* GOLD */}
          <div style={S.sec}>
            <h3 style={S.secH}>GOLD</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div><span style={S.fl}>HANDFULS</span><div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                {Array.from({ length: 9 }).map((_, i) => <button key={i} onClick={() => u("goldH", c.goldH === i + 1 ? i : i + 1)} style={{ ...S.coin, ...(i < c.goldH ? S.coinOn : {}) }} />)}</div></div>
              <div><span style={S.fl}>BAGS</span><div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                {Array.from({ length: 9 }).map((_, i) => <button key={i} onClick={() => u("goldB", c.goldB === i + 1 ? i : i + 1)} style={{ ...S.bag, ...(i < c.goldB ? S.bagOn : {}) }} />)}</div></div>
              <div><span style={S.fl}>CHEST</span><div style={{ marginTop: 2 }}><button onClick={() => u("goldC", !c.goldC)} style={{ ...S.chest, ...(c.goldC ? S.chestOn : {}) }} /></div></div>
            </div>
          </div>
        </div>

        {/* RIGHT: WEAPONS + ARMOR + INV */}
        <div style={S.rightCol}>
          <div id="sec-weapons" style={{ ...S.sec, ...(highlight === "weapons" ? S.hl : {}) }}>
            <h3 style={S.secH}>ACTIVE WEAPONS</h3>
            {["pri", "sec"].map(slot => { const w = c.wpn[slot]; const hasPowerful = (w.feat || "").toLowerCase().includes("powerful"); return (
            <div key={slot} style={{ borderTop: slot === "sec" ? "1px solid #444" : "none", paddingTop: slot === "sec" ? 8 : 0, marginTop: slot === "sec" ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ ...S.fl, fontSize: 13 }}>{slot === "pri" ? "PRIMARY" : "SECONDARY"}</span>
                <select style={{ ...S.fs, fontSize: 12, width: "auto" }} value={w.id || ""} onChange={e => { const db = WEAPON_DB.find(x => x.name === e.target.value); equipWeapon(slot, db || null); }} aria-label={`Select ${slot} weapon`}>
                  <option value="">Custom / Select</option>{WEAPON_DB.map(x => <option key={x.name} value={x.name}>{x.name}</option>)}
                </select>
              </div>
              <input style={{ ...S.fi, fontWeight: 600, marginBottom: 4 }} value={w.name} onChange={e => u("wpn", { ...c.wpn, [slot]: { ...w, name: e.target.value } })} placeholder="Weapon name" aria-label={`${slot} weapon name`} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 4 }}>
                <label style={S.fg}><span style={S.fl}>TRAIT</span>
                  <select style={S.fs} value={w.tr} onChange={e => u("wpn", { ...c.wpn, [slot]: { ...w, tr: e.target.value } })} aria-label={`${slot} attack trait`}>
                    <option value="">—</option>{TRAIT_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select></label>
                <label style={S.fg}><span style={S.fl}>RANGE</span>
                  <select style={S.fs} value={w.range} onChange={e => u("wpn", { ...c.wpn, [slot]: { ...w, range: e.target.value } })} aria-label={`${slot} range`}>
                    <option value="">—</option>{RANGE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                  </select></label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 4 }}>
                <label style={S.fg}><span style={S.fl}>DAMAGE DICE</span>
                  <input style={S.fi} value={w.dmg} onChange={e => u("wpn", { ...c.wpn, [slot]: { ...w, dmg: e.target.value } })} placeholder="d8+2" aria-label={`${slot} damage dice`} /></label>
                <label style={S.fg}><span style={S.fl}>TYPE</span>
                  <select style={S.fs} value={w.dmgType || "Physical"} onChange={e => u("wpn", { ...c.wpn, [slot]: { ...w, dmgType: e.target.value } })} aria-label={`${slot} damage type`}>
                    {DMG_TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select></label>
                <label style={S.fg}><span style={S.fl}>HANDS</span>
                  <select style={S.fs} value={w.hand || 1} onChange={e => u("wpn", { ...c.wpn, [slot]: { ...w, hand: +e.target.value } })} aria-label={`${slot} hands`}>
                    <option value={1}>One-hand</option><option value={2}>Two-hand</option>
                  </select></label>
              </div>
              <label style={S.fg}><span style={S.fl}>FEATURE</span>
                <input style={S.fi} value={w.feat} onChange={e => u("wpn", { ...c.wpn, [slot]: { ...w, feat: e.target.value } })} placeholder="e.g. Powerful, Versatile" aria-label={`${slot} feature`} /></label>
              {w.feat && <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}><KW text={w.feat} /></div>}
              {w.name && <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <button style={{ ...S.cardBtn, color: "#50a0ff", borderColor: "#50a0ff" }} onClick={() => openDice(`${w.name} Attack`, w.tr)}>🎲 Attack Roll</button>
                {w.dmg && <button style={{ ...S.cardBtn, color: "#e05545", borderColor: "#e05545" }} onClick={() => openDmg(w.name, w.dmg, hasPowerful)}>💥 Damage Roll</button>}
              </div>}
            </div>); })}
          </div>

          <div id="sec-armor" style={{ ...S.sec, ...(highlight === "armor" ? S.hl : {}) }}>
            <h3 style={S.secH}>ACTIVE ARMOR</h3>
            <select style={{ ...S.fs, marginBottom: 6 }} value={c.armorId || ""} onChange={e => { const a = ARMOR_DB.find(x => x.name === e.target.value); equipArmor(a || null); }} aria-label="Select armor">
              <option value="">Custom / Select</option>{ARMOR_DB.map(a => <option key={a.name} value={a.name}>{a.name} (Score {a.score}, {a.weight})</option>)}
            </select>
            <input style={{ ...S.fi, fontWeight: 600, marginBottom: 4 }} value={c.armorName} onChange={e => u("armorName", e.target.value)} placeholder="Armor name" aria-label="Armor name" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginBottom: 4 }}>
              <label style={S.fg}><span style={S.fl}>MINOR BASE</span>
                <input type="number" style={S.fi} value={c.armorMinor || 0} onChange={e => u("armorMinor", +e.target.value)} aria-label="Minor threshold base" /></label>
              <label style={S.fg}><span style={S.fl}>MAJOR BASE</span>
                <input type="number" style={S.fi} value={c.armorMajor || 0} onChange={e => u("armorMajor", +e.target.value)} aria-label="Major threshold base" /></label>
              <label style={S.fg}><span style={S.fl}>SCORE</span>
                <input type="number" style={S.fi} value={c.armorScore} onChange={e => { const n = Math.max(0, +e.target.value); u("armorScore", n); u("armorTotal", n); u("armorM", Array(n).fill(false)); }} aria-label="Armor score" /></label>
              <label style={S.fg}><span style={S.fl}>WEIGHT</span>
                <select style={S.fs} value={c.armorWeight || "Light"} onChange={e => setArmorWeight(e.target.value)} aria-label="Armor weight">
                  {Object.keys(WEIGHT_MODS).map(w => <option key={w}>{w}</option>)}
                </select></label>
            </div>
            <label style={S.fg}><span style={S.fl}>FEATURE</span>
              <input style={S.fi} value={c.armorFeat || ""} onChange={e => u("armorFeat", e.target.value)} placeholder="e.g. Noisy, Deflecting" aria-label="Armor feature" /></label>
            {c.armorFeat && <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}><KW text={c.armorFeat} /></div>}
            {c.armorMods && Object.keys(c.armorMods).length > 0 && <div style={{ fontSize: 11, color: "#d4a017", marginTop: 4 }}>
              Modifiers: {Object.entries(c.armorMods).map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`).join(", ")}
            </div>}
          </div>

          <div style={S.sec}>
            <h3 style={S.secH}>INVENTORY</h3>
            {c.inv.map((item, i) => <div key={i} style={{ display: "flex", gap: 3, marginBottom: 2 }}>
              <input style={{ ...S.fi, flex: 1, fontSize: 11 }} value={item} onChange={e => { const inv = [...c.inv]; inv[i] = e.target.value; u("inv", inv); }} />
              <button style={S.rmBtn} onClick={() => u("inv", c.inv.filter((_, j) => j !== i))}>✕</button></div>)}
            <button style={S.addBtn} onClick={() => u("inv", [...c.inv, ""])}>+ Item</button>
          </div>

          {cls && <div style={S.sec}><h3 style={S.secH}>CLASS FEATURES</h3>
            {cls.features.map((f, i) => { const cost = parseAbilityCost(f); return (
              <div key={i} style={{ cursor: cost ? "pointer" : "default" }} onClick={() => cost && useAbility("Class Feature", f)}>
                <p style={{ ...S.feat, ...(cost ? { borderLeftColor: "#50a0ff" } : {}) }}><KW text={f} />{cost && <span style={{ fontSize: 12, color: "#50a0ff", marginLeft: 6 }}>TAP TO USE</span>}</p>
              </div>); })}
            <textarea style={S.notes} value={c.notes} rows={2} onChange={e => u("notes", e.target.value)} placeholder="Notes..." /></div>}
        </div>
      </div>

      {/* HERITAGE SUMMARY on sheet */}
      {(c.ancestry1 || c.community) && <div style={{ ...S.sec, marginTop: 10 }}>
        <h3 style={S.secH}>HERITAGE</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {c.ancestry1 && (() => { const anc1 = ANCESTRIES.find(a => a.name === c.ancestry1); const anc2 = c.ancestry2 && c.ancestry2 !== c.ancestry1 ? ANCESTRIES.find(a => a.name === c.ancestry2) : null;
            const isMixed = !!anc2;
            return (<div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Cinzel'", marginBottom: 4 }}>{c.ancestry1}{isMixed ? ` / ${c.ancestry2}` : ""}</div>
              {!isMixed && anc1 && anc1.features.map((f, i) => { const cost = parseAbilityCost(f); return (
                <div key={i} style={{ cursor: cost ? "pointer" : "default", marginBottom: 3 }} onClick={() => cost && useAbility(`${c.ancestry1} Feature`, f)}>
                  <p style={{ ...S.feat, fontSize: 12, ...(cost ? { borderLeftColor: "#50a0ff" } : {}) }}><KW text={f} />{cost && <span style={{ fontSize: 11, color: "#50a0ff", marginLeft: 4 }}>TAP</span>}</p>
                </div>); })}
              {isMixed && anc1 && (() => { const feat1 = c.ancestryFeat1 === "first" ? anc1.features[0] : anc1.features[1];
                const feat2 = anc2 && (c.ancestryFeat2 === "first" ? anc2.features[0] : anc2.features[1]);
                return (<>{[{ n: c.ancestry1, f: feat1 }, { n: c.ancestry2, f: feat2 }].filter(x => x.f).map((x, i) => { const cost = parseAbilityCost(x.f); return (
                  <div key={i} style={{ cursor: cost ? "pointer" : "default", marginBottom: 3 }} onClick={() => cost && useAbility(`${x.n} Feature`, x.f)}>
                    <p style={{ ...S.feat, fontSize: 12, ...(cost ? { borderLeftColor: "#50a0ff" } : {}) }}><strong style={{ fontSize: 11 }}>{x.n}:</strong> <KW text={x.f} />{cost && <span style={{ fontSize: 11, color: "#50a0ff", marginLeft: 4 }}>TAP</span>}</p>
                  </div>); })}</>); })()}
            </div>); })()}
          {c.community && (() => { const cm = COMMUNITIES.find(x => x.name === c.community); return cm && (<div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Cinzel'", marginBottom: 4 }}>{cm.name}</div>
            {(() => { const cost = parseAbilityCost(cm.feature); return (
              <div style={{ cursor: cost ? "pointer" : "default" }} onClick={() => cost && useAbility(`${cm.name} Feature`, cm.feature)}>
                <p style={{ ...S.feat, fontSize: 12, ...(cost ? { borderLeftColor: "#50a0ff" } : {}) }}><KW text={cm.feature} />{cost && <span style={{ fontSize: 11, color: "#50a0ff", marginLeft: 4 }}>TAP</span>}</p>
              </div>); })()}
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>{cm.adj.map(a => <span key={a} style={{ ...S.adjTag, fontSize: 11 }}>{a}</span>)}</div>
          </div>); })()}
        </div>
      </div>}

      {/* LOADOUT STRIP on sheet */}
      {c.loadout.length > 0 && <div style={{ ...S.sec, marginTop: 10 }}>
        <h3 style={S.secH}>LOADOUT ({c.loadout.length}/5)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 6 }}>
          {c.loadout.map(card => { const cost = parseAbilityCost(card.desc); return (
            <div key={card.name} style={{ ...S.card, borderColor: "#d4a017", padding: 8, cursor: cost ? "pointer" : "default" }}
              onClick={() => cost && useAbility(card.name, card.desc)}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", fontFamily: "'Barlow Condensed'" }}>
                <span>Lv{card.lv} {card.domain}</span><span>⚡{card.rc}</span></div>
              <div style={{ fontFamily: "'Cinzel'", fontWeight: 700, fontSize: 11 }}>{card.name}</div>
              <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5, marginTop: 2 }}><KW text={card.desc} /></div>
              <div style={{ display: "flex", gap: 3, marginTop: 4, alignItems: "center" }}>
                {cost && <span style={{ fontSize: 12, color: "#50a0ff", fontWeight: 600 }}>TAP TO USE</span>}
                {card.type === "Spell" && <button style={{ ...S.cardBtn, marginLeft: "auto", fontSize: 12 }} onClick={e => { e.stopPropagation(); openDice(`${card.name} Spellcast`, ""); }}>🎲</button>}
              </div>
            </div>); })}
        </div>
      </div>}
    </main>
  );
}
