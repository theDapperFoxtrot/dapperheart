import { useState } from 'react';
import { CLASSES, CLASS_DEFAULTS, ARMOR_DB, WEAPON_DB, WEIGHT_MODS, DOMAIN_CARDS } from './data';
import { parseAbilityCost, smartToggle } from './utils';
import { S } from './styles/theme';
import { def } from './state/defaults';
import { useCharacter } from './state/useCharacter';
import { useModals } from './state/useModals';
import { computeStats } from './state/computed';

// Layout
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { Toast } from './components/layout/Toast';
import { NudgeBar } from './components/layout/NudgeBar';

// Tabs
import { SheetTab } from './components/tabs/SheetTab';
import { GuideTab } from './components/tabs/GuideTab';
import { CardsTab } from './components/tabs/CardsTab';
import { HeritageTab } from './components/tabs/HeritageTab';
import { JournalTab } from './components/tabs/JournalTab';

// Modals
import { DiceRoller } from './components/modals/DiceRoller';
import { DamageRoller } from './components/modals/DamageRoller';
import { AbilityModal } from './components/modals/AbilityModal';
import { LevelUpWizard } from './components/modals/LevelUpWizard';
import { ConfirmDialog } from './components/modals/ConfirmDialog';
import { ModPopup } from './components/modals/ModPopup';

export default function App() {
  const { c, setC, u, toast, flash } = useCharacter();
  const modals = useModals();
  const [tab, setTab] = useState("sheet");
  const [highlight, setHighlight] = useState(null);

  // Derived data
  const cls = CLASSES[c.className];
  const mcls = CLASSES[c.multiclass];
  const { mods, effEvasion, effTraits, hopeCount, stressCount, isVulnerable, tier, compMinor, compMajor, compSevere } = computeStats(c);
  const myDomains = [...(cls ? cls.domains : []), ...(mcls ? mcls.domains : [])].filter((v, i, a) => a.indexOf(v) === i);
  const myCards = myDomains.flatMap(d => (DOMAIN_CARDS[d] || []).filter(cd => cd.lv <= c.level).map(cd => ({ ...cd, domain: d })));
  const acquiredNames = new Set([...c.loadout.map(x => x.name), ...c.vault.map(x => x.name)]);
  const advH = c.advHistory || [];

  // Quick start — auto-fills class defaults
  const quickStart = (name) => {
    const cl = CLASSES[name]; const defs = CLASS_DEFAULTS[name]; if (!cl || !defs) return;
    const armor = ARMOR_DB.find(a => a.name === defs.armor); const wpn = WEAPON_DB.find(w => w.name === defs.wpn);
    setC(p => {
      const n = { ...p, className: name, subclass: "", baseEvasion: cl.ev, hpSlots: cl.hp,
        hpM: Array(cl.hp).fill(false), stressSlots: 6, stressM: Array(6).fill(false), hopeM: [true, true, false, false, false],
        traits: defs.traits, loadout: [], vault: [] };
      if (armor) { n.armorId = armor.name; n.armorName = armor.name; n.armorMinor = armor.minor; n.armorMajor = armor.major; n.armorScore = armor.score; n.armorWeight = armor.weight; n.armorFeat = armor.feat; n.armorMods = armor.mods || {}; n.armorTotal = armor.score; n.armorM = Array(armor.score).fill(false); }
      if (wpn) { n.wpn = { ...p.wpn, pri: { id: wpn.name, name: wpn.name, tr: wpn.tr, range: wpn.range, dmg: wpn.dmg, dmgType: wpn.type === "phy" ? "Physical" : "Magic", hand: wpn.hand, feat: wpn.feat } }; }
      return n;
    });
    flash(`${name} ready! Customize your character.`);
  };

  const selectClass = name => {
    const cl = CLASSES[name]; if (!cl) return;
    if (c.className && c.className !== name) { modals.askConfirm(`Switch from ${c.className} to ${name}? This will reset your stats, equipment, and cards.`, () => quickStart(name)); }
    else quickStart(name);
  };

  const equipArmor = a => {
    const doEquip = () => {
      if (!a) { u("armorId", ""); u("armorName", ""); u("armorMinor", 0); u("armorMajor", 0); u("armorScore", 0); u("armorWeight", "Light"); u("armorFeat", ""); u("armorMods", {}); u("armorTotal", 0); u("armorM", []); return; }
      u("armorId", a.name); u("armorName", a.name); u("armorMinor", a.minor); u("armorMajor", a.major); u("armorScore", a.score); u("armorWeight", a.weight); u("armorFeat", a.feat); u("armorMods", a.mods || {}); u("armorTotal", a.score); u("armorM", Array(a.score).fill(false));
    };
    if (c.armorName && a && c.armorName !== a.name) { modals.askConfirm(`Replace ${c.armorName} with ${a.name}?${a.mods?.evasion ? ` (${a.mods.evasion} Evasion)` : ""} This clears armor slots.`, doEquip); }
    else doEquip();
  };

  const setArmorWeight = w => { u("armorWeight", w); u("armorMods", WEIGHT_MODS[w] || {}); };

  const equipWeapon = (slot, w) => {
    if (!w) { u("wpn", { ...c.wpn, [slot]: { id: "", name: "", tr: "", range: "", dmg: "", dmgType: "Physical", hand: 1, feat: "" } }); return; }
    u("wpn", { ...c.wpn, [slot]: { id: w.name, name: w.name, tr: w.tr, range: w.range, dmg: w.dmg, dmgType: w.type === "phy" ? "Physical" : "Magic", hand: w.hand, feat: w.feat } });
  };

  // Ability use
  const useAbility = (name, desc) => { const cost = parseAbilityCost(desc); modals.setAbilityModal({ name, desc, cost }); };
  const commitAbility = () => {
    if (!modals.abilityModal?.cost) { modals.setAbilityModal(null); return; }
    const { resource, amount } = modals.abilityModal.cost;
    if (resource === "hope") {
      if (hopeCount < amount) { flash(`Not enough Hope! Need ${amount}, have ${hopeCount}.`); return; }
      let remaining = amount; const newHope = [...(c.hopeM || [])];
      for (let i = newHope.length - 1; i >= 0 && remaining > 0; i--) if (newHope[i]) { newHope[i] = false; remaining--; }
      u("hopeM", newHope); flash(`Spent ${amount} Hope on ${modals.abilityModal.name}.`);
    } else if (resource === "stress") {
      if (stressCount >= c.stressSlots) { flash("All Stress slots full! Must mark HP instead."); return; }
      let remaining = amount; const newStress = [...(c.stressM || [])]; while (newStress.length < c.stressSlots) newStress.push(false);
      for (let i = 0; i < newStress.length && remaining > 0; i++) if (!newStress[i]) { newStress[i] = true; remaining--; }
      u("stressM", newStress); flash(`Marked ${amount} Stress for ${modals.abilityModal.name}.`);
    }
    modals.setAbilityModal(null);
  };

  // Card management
  const addToLoadout = card => { if (c.loadout.length >= 5) return flash("Loadout full!"); if (acquiredNames.has(card.name)) return flash("Already acquired."); u("loadout", [...c.loadout, card]); };
  const moveToVault = card => { u("loadout", c.loadout.filter(x => x.name !== card.name)); u("vault", [...c.vault, card]); };
  const moveToLoadout = card => { if (c.loadout.length >= 5) return flash("Loadout full."); u("vault", c.vault.filter(x => x.name !== card.name)); u("loadout", [...c.loadout, card]); };
  const removeCard = card => { modals.askConfirm(`Remove ${card.name} from your collection?`, () => { u("loadout", c.loadout.filter(x => x.name !== card.name)); u("vault", c.vault.filter(x => x.name !== card.name)); }); };

  // Dice + damage
  const openDice = (label, trait, difficulty) => { modals.setDiceResult(null); modals.setDiceRolling(false); modals.setDiceModal({ label, trait: trait || "", adv: "none", dc: difficulty || null }); };
  const openDmg = (label, dice, hasPowerful) => modals.setDmgModal({ label, dice, prof: c.proficiency, hasPowerful: !!hasPowerful });

  // Level up
  const startLevelUp = () => { if (c.level >= 10) return flash("Max level!"); modals.setLvlUp({ nl: c.level + 1, opts: [], details: {}, card: null, mc: "" }); };
  const setLvlDetail = (key, val) => modals.setLvlUp(p => ({ ...p, details: { ...p.details, [key]: val } }));

  const commitLevelUp = () => {
    if (!modals.lvlUp) return;
    const nt = modals.lvlUp.nl <= 4 ? 2 : modals.lvlUp.nl <= 7 ? 3 : 4;
    setC(p => {
      const n = { ...p, level: modals.lvlUp.nl }; const to = { ...p.tierOpts }; to[nt] = [...(to[nt] || []), ...modals.lvlUp.opts]; n.tierOpts = to;
      const hist = [...(p.advHistory || [])];
      for (const optIdx of modals.lvlUp.opts) {
        const d = modals.lvlUp.details[optIdx] || {};
        switch (optIdx) {
          case 0: { const t1 = d.trait1, t2 = d.trait2;
            if (t1) n.traits = { ...n.traits, [t1]: (n.traits[t1] || 0) + 1 };
            if (t2) n.traits = { ...n.traits, [t2]: (n.traits[t2] || 0) + 1 };
            hist.push({ level: modals.lvlUp.nl, type: "traits", traits: [t1, t2].filter(Boolean) }); break; }
          case 1: n.hpSlots = (n.hpSlots || 6) + 1; n.hpM = [...(n.hpM || []), false]; hist.push({ level: modals.lvlUp.nl, type: "hp" }); break;
          case 2: n.stressSlots = (n.stressSlots || 6) + 1; n.stressM = [...(n.stressM || []), false]; hist.push({ level: modals.lvlUp.nl, type: "stress" }); break;
          case 3: { const e1 = d.exp1, e2 = d.exp2; const exps = [...(n.exps || [])];
            if (e1 !== undefined && exps[e1]) exps[e1] = { ...exps[e1], b: exps[e1].b + 1 };
            if (e2 !== undefined && exps[e2]) exps[e2] = { ...exps[e2], b: exps[e2].b + 1 };
            n.exps = exps; hist.push({ level: modals.lvlUp.nl, type: "experiences", exps: [e1, e2].filter(x => x !== undefined) }); break; }
          case 4: hist.push({ level: modals.lvlUp.nl, type: "card" }); break;
          case 5: n.baseEvasion = (n.baseEvasion || 10) + 1; hist.push({ level: modals.lvlUp.nl, type: "evasion" }); break;
          case 6: hist.push({ level: modals.lvlUp.nl, type: "subclass" }); break;
          case 7: n.proficiency = (n.proficiency || 0) + 1; hist.push({ level: modals.lvlUp.nl, type: "proficiency" }); break;
          case 8: if (modals.lvlUp.mc) n.multiclass = modals.lvlUp.mc; hist.push({ level: modals.lvlUp.nl, type: "multiclass", cls: modals.lvlUp.mc }); break;
        }
      }
      n.advHistory = hist;
      n.exps = [...(n.exps || []), { n: "", b: 2 }];
      if (modals.lvlUp.card) { if (p.loadout.length < 5) n.loadout = [...p.loadout, modals.lvlUp.card]; else n.vault = [...p.vault, modals.lvlUp.card]; }
      if (modals.lvlUp.mc && !n.multiclass) n.multiclass = modals.lvlUp.mc;
      return n;
    });
    modals.setLvlUp(null); flash(`Level ${modals.lvlUp.nl}!`);
  };

  // Import/export
  const exportJSON = () => { const b = new Blob([JSON.stringify(c, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${c.name || "char"}-daggerheart.json`; a.click(); flash("Exported!"); };
  const importFile = e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { setC({ ...def(), ...JSON.parse(ev.target.result) }); flash("Imported!"); } catch { flash("Invalid JSON"); } }; r.readAsText(f); };

  const openModPopup = (e, label, lines) => {
    const r = e.currentTarget.getBoundingClientRect();
    modals.setModPopup({ label, lines, x: r.left + r.width / 2, y: r.bottom + 6 });
  };

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <a href="#main-content" className="skip-link">Skip to character sheet</a>
      <Toast message={toast} />

      <TopBar setC={setC} flash={flash} startLevelUp={startLevelUp} openDice={openDice}
        menuOpen={modals.menuOpen} setMenuOpen={modals.setMenuOpen} askConfirm={modals.askConfirm}
        exportJSON={exportJSON} importFile={importFile} />

      <NudgeBar c={c} cls={cls} myCards={myCards} setTab={setTab} setHighlight={setHighlight} />

      {tab === "sheet" && <SheetTab c={c} u={u} setC={setC} cls={cls} mods={mods}
        effEvasion={effEvasion} effTraits={effTraits} hopeCount={hopeCount} stressCount={stressCount}
        isVulnerable={isVulnerable} compMinor={compMinor} compMajor={compMajor} compSevere={compSevere}
        myDomains={myDomains} highlight={highlight} advH={advH} acquiredNames={acquiredNames}
        openDice={openDice} openDmg={openDmg} openModPopup={openModPopup} useAbility={useAbility}
        equipArmor={equipArmor} equipWeapon={equipWeapon} selectClass={selectClass}
        setArmorWeight={setArmorWeight} flash={flash} askConfirm={modals.askConfirm} />}

      {tab === "guide" && <GuideTab c={c} u={u} cls={cls} />}

      {tab === "cards" && <CardsTab c={c} cls={cls} myDomains={myDomains} myCards={myCards}
        acquiredNames={acquiredNames} highlight={highlight}
        addToLoadout={addToLoadout} moveToVault={moveToVault} moveToLoadout={moveToLoadout} removeCard={removeCard} />}

      {tab === "heritage" && <HeritageTab c={c} u={u} cls={cls} tier={tier} highlight={highlight} />}

      {tab === "journal" && <JournalTab c={c} u={u} flash={flash} askConfirm={modals.askConfirm} />}

      <LevelUpWizard lvlUp={modals.lvlUp} setLvlUp={modals.setLvlUp} c={c} cls={cls}
        myDomains={myDomains} acquiredNames={acquiredNames}
        commitLevelUp={commitLevelUp} setLvlDetail={setLvlDetail} />

      <DiceRoller modal={modals.diceModal} setModal={modals.setDiceModal}
        result={modals.diceResult} setResult={modals.setDiceResult}
        rolling={modals.diceRolling} setRolling={modals.setDiceRolling}
        c={c} mods={mods} />

      <DamageRoller modal={modals.dmgModal} setModal={modals.setDmgModal}
        result={modals.dmgResult} setResult={modals.setDmgResult}
        compMinor={compMinor} compMajor={compMajor} compSevere={compSevere} />

      <AbilityModal modal={modals.abilityModal} setModal={modals.setAbilityModal}
        hopeCount={hopeCount} stressCount={stressCount} c={c}
        commitAbility={commitAbility} openDice={openDice} />

      <ConfirmDialog modal={modals.confirmModal} setModal={modals.setConfirmModal} />
      <ModPopup popup={modals.modPopup} setPopup={modals.setModPopup} />

      <BottomNav tab={tab} setTab={setTab} />
      <div style={S.attr}>Daggerheart © Darrington Press 2025. Unofficial fan tool.</div>
    </div>
  );
}
