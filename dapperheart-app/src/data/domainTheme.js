// Domain-specific icons and accent colors for visual distinction
// Colors chosen for colorblind safety — avoids red/green ambiguity,
// uses distinct hue + lightness combinations distinguishable across
// deuteranopia, protanopia, and tritanopia.
export const DOMAIN_THEME = {
	Arcana:   { icon: "✦", color: "#b89aff", label: "Arcana" },     // lavender
	Blade:    { icon: "⚔", color: "#e07070", label: "Blade" },      // salmon
	Bone:     { icon: "☠", color: "#c4a882", label: "Bone" },       // tan
	Codex:    { icon: "📖", color: "#6bb8e0", label: "Codex" },     // sky blue
	Grace:    { icon: "❋", color: "#e8c44b", label: "Grace" },      // warm gold
	Midnight: { icon: "☾", color: "#8a80c0", label: "Midnight" },   // muted violet
	Sage:     { icon: "☘", color: "#5ec090", label: "Sage" },       // seafoam (not pure green)
	Splendor: { icon: "✧", color: "#e8a44a", label: "Splendor" },   // amber
	Valor:    { icon: "⛊", color: "#d0a060", label: "Valor" },      // bronze
};

// Card type styling — uses shape + color + label for triple-coding
export const CARD_TYPE_STYLE = {
	Spell:    { badge: "✦ SPELL",    color: "#6bb8e0", bg: "#0f1a24" },
	Ability:  { badge: "◆ ABILITY",  color: "#5ec090", bg: "#0f1a16" },
	Grimoire: { badge: "❖ GRIMOIRE", color: "#b89aff", bg: "#160f24" },
};
