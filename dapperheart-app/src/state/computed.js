import { TRAITS } from '../data';

// Compute effective stats from character state + armor mods + active effects
export function computeStats(c) {
	const mods = c.armorMods || {};
	const effects = c.activeEffects || [];
	const beastEvasion = c.beastform?.evasion || 0;

	// Sum evasion bonuses from active effects
	const effectEvasion = effects.reduce((sum, e) => sum + (e.mods?.evasion || 0), 0);
	const effEvasion = (c.baseEvasion || 10) + (mods.evasion || 0) + beastEvasion + effectEvasion;

	const effTraits = {};
	TRAITS.forEach(t => {
		const beastTrait = c.beastform?.traits?.[t.k] || 0;
		const effectTrait = effects.reduce((sum, e) => sum + (e.mods?.[t.k] || 0), 0);
		effTraits[t.k] = (c.traits[t.k] || 0) + (mods[t.k] || 0) + beastTrait + effectTrait;
	});
	const hopeCount = (c.hopeM || []).filter(Boolean).length;
	const stressCount = (c.stressM || []).filter(Boolean).length;
	const isVulnerable = stressCount >= (c.stressSlots || 6);
	const tier = c.level <= 1 ? 1 : c.level <= 4 ? 2 : c.level <= 7 ? 3 : 4;

	// Auto-computed damage thresholds = armor base + level + effect bonuses
	const effectThreshold = effects.reduce((sum, e) => sum + (e.mods?.threshold || 0), 0);
	const compMinor = (c.armorMinor || 0) + c.level + effectThreshold;
	const compMajor = (c.armorMajor || 0) + c.level + effectThreshold;
	const compSevere = compMajor * 2;

	// Attack roll bonus from effects (e.g., Warrior No Mercy)
	const effectAttackBonus = effects.reduce((sum, e) => sum + (e.mods?.attack || 0), 0);

	return { mods, effEvasion, effTraits, hopeCount, stressCount, isVulnerable, tier, compMinor, compMajor, compSevere, effectAttackBonus };
}

// Build modifier breakdown for trait tooltips
export function getTraitBreakdown(tk, c) {
	const mods = c.armorMods || {};
	const advH = c.advHistory || [];
	const effects = c.activeEffects || [];
	const lines = [];
	advH.filter(a => a.type === "traits" && a.traits?.includes(tk)).forEach(a => {
		lines.push({ source: `Level ${a.level} advancement`, value: 1, color: "#5ec090" });
	});
	const am = mods[tk] || 0;
	if (am !== 0) lines.push({ source: `${c.armorName || "Armor"} (${c.armorWeight || "weight"})`, value: am });
	const bm = c.beastform?.traits?.[tk] || 0;
	if (bm !== 0) lines.push({ source: `${c.beastform.name} Beastform`, value: bm, color: "#6bb8e0" });
	effects.forEach(e => {
		const ev = e.mods?.[tk] || 0;
		if (ev !== 0) lines.push({ source: e.name, value: ev, color: "#d4a017" });
	});
	return lines;
}

export function getTraitTotalMod(tk, c) {
	const advH = c.advHistory || [];
	const mods = c.armorMods || {};
	const effects = c.activeEffects || [];
	const advCount = advH.filter(a => a.type === "traits" && a.traits?.includes(tk)).length;
	const bm = c.beastform?.traits?.[tk] || 0;
	const em = effects.reduce((sum, e) => sum + (e.mods?.[tk] || 0), 0);
	return (mods[tk] || 0) + bm + advCount + em;
}

export function getEvasionBreakdown(c, cls) {
	const mods = c.armorMods || {};
	const advH = c.advHistory || [];
	const effects = c.activeEffects || [];
	const lines = [{ source: "Class base", value: cls ? cls.ev : 10 }];
	advH.filter(a => a.type === "evasion").forEach(a => {
		lines.push({ source: `Level ${a.level} advancement`, value: 1, color: "#5ec090" });
	});
	const am = mods.evasion || 0;
	if (am !== 0) lines.push({ source: `${c.armorName || "Armor"} (${c.armorWeight || "weight"})`, value: am });
	const be = c.beastform?.evasion || 0;
	if (be !== 0) lines.push({ source: `${c.beastform.name} Beastform`, value: be, color: "#6bb8e0" });
	effects.forEach(e => {
		const ev = e.mods?.evasion || 0;
		if (ev !== 0) lines.push({ source: e.name, value: ev, color: "#d4a017" });
	});
	return lines;
}

export function getProfBreakdown(c) {
	const advH = c.advHistory || [];
	const lines = [];
	advH.filter(a => a.type === "proficiency").forEach(a => {
		lines.push({ source: `Level ${a.level} advancement`, value: 1, color: "#5ec090" });
	});
	return lines;
}
