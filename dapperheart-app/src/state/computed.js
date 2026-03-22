import { TRAITS } from '../data';

// Compute effective stats from character state + armor mods
export function computeStats(c) {
  const mods = c.armorMods || {};
  const effEvasion = (c.baseEvasion || 10) + (mods.evasion || 0);
  const effTraits = {};
  TRAITS.forEach(t => { effTraits[t.k] = (c.traits[t.k] || 0) + (mods[t.k] || 0); });
  const hopeCount = (c.hopeM || []).filter(Boolean).length;
  const stressCount = (c.stressM || []).filter(Boolean).length;
  const isVulnerable = stressCount >= (c.stressSlots || 6);
  const tier = c.level <= 1 ? 1 : c.level <= 4 ? 2 : c.level <= 7 ? 3 : 4;

  // Auto-computed damage thresholds = armor base + level
  const compMinor = (c.armorMinor || 0) + c.level;
  const compMajor = (c.armorMajor || 0) + c.level;
  const compSevere = compMajor * 2;

  return { mods, effEvasion, effTraits, hopeCount, stressCount, isVulnerable, tier, compMinor, compMajor, compSevere };
}

// Build modifier breakdown for trait tooltips
export function getTraitBreakdown(tk, c) {
  const mods = c.armorMods || {};
  const advH = c.advHistory || [];
  const lines = [];
  advH.filter(a => a.type === "traits" && a.traits?.includes(tk)).forEach(a => {
    lines.push({ source: `Level ${a.level} advancement`, value: 1, color: "#2d6a4f" });
  });
  const am = mods[tk] || 0;
  if (am !== 0) lines.push({ source: `${c.armorName || "Armor"} (${c.armorWeight || "weight"})`, value: am });
  return lines;
}

export function getTraitTotalMod(tk, c) {
  const advH = c.advHistory || [];
  const mods = c.armorMods || {};
  const advCount = advH.filter(a => a.type === "traits" && a.traits?.includes(tk)).length;
  return (mods[tk] || 0) + advCount;
}

export function getEvasionBreakdown(c, cls) {
  const mods = c.armorMods || {};
  const advH = c.advHistory || [];
  const lines = [{ source: "Class base", value: cls ? cls.ev : 10 }];
  advH.filter(a => a.type === "evasion").forEach(a => {
    lines.push({ source: `Level ${a.level} advancement`, value: 1, color: "#2d6a4f" });
  });
  const am = mods.evasion || 0;
  if (am !== 0) lines.push({ source: `${c.armorName || "Armor"} (${c.armorWeight || "weight"})`, value: am });
  return lines;
}

export function getProfBreakdown(c) {
  const advH = c.advHistory || [];
  const lines = [];
  advH.filter(a => a.type === "proficiency").forEach(a => {
    lines.push({ source: `Level ${a.level} advancement`, value: 1, color: "#2d6a4f" });
  });
  return lines;
}
