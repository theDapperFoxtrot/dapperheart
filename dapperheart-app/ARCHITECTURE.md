# Daggerheart Character Sheet — Architecture Handoff

## Overview

Unofficial digital character sheet for the Daggerheart TTRPG (Darrington Press / Critical Role). Currently a **1,700-line monolithic React component** (`src/App.jsx`) that needs decomposition into a maintainable multi-file architecture.

**Stack:** React 18, Vite, inline JS styles, Google Fonts (Cinzel, Barlow, Barlow Condensed), no CSS framework, no state management library.

**SRD data** is included under the DPCGL license. All game data lives in the same file as the UI.

---

## Current Monolith Map (src/App.jsx)

```
Lines   1-2      Imports (React, useState, useEffect, useCallback, useRef)
Lines   3-361    DATA — All game constants (9 objects, ~358 lines)
Lines  337-360   Pure functions (parseAbilityCost, parseAbilityRoll)
Lines  361       TRAITS constant
Lines  363-428   HELPERS — Utility functions + small components
Lines  430-500   Standalone components (Markdown, readImageFile)
Lines  502-1533  APP COMPONENT — 1,032 lines in one function
                   502-535   State (13 useState, 6 useEffect, 3 useRef)
                   536-585   Computed values & breakdown builders
                   586-650   Action handlers (quickStart, equipArmor, equipWeapon, etc.)
                   650-670   Dice rolling logic
                   673-730   Level-up functions (startLevelUp, commitLevelUp)
                   731-802   Journal functions + return() begins
                   802-810   Top bar + nudges
                   811-885   SHEET tab (header, traits, stat row, damage/health)
                   885-920   SHEET tab (hope, experience, gold)
                   920-970   Heritage summary on sheet
                   970-1000  Loadout strip on sheet
                  1000-1095  SHEET tab (weapons, armor, inventory, class features)
                  1095-1130  GUIDE tab
                  1104-1130  CARDS tab (loadout, vault, available)
                  1131-1160  HERITAGE tab (ancestry, community, multiclass)
                  1160-1277  JOURNAL tab (portrait, notes, ref images)
                  1277-1350  Level-up modal
                  1350-1400  Dice roller modal
                  1400-1430  Damage roller modal
                  1430-1465  Ability use modal
                  1465-1500  Confirm modal
                  1500-1530  Modifier breakdown popup
                  1530-1533  Bottom nav + footer
Lines 1534-1604  CSS string (animations, tooltips, responsive breakpoints)
Lines 1605-1700  STYLES object (S = {...}) — all inline style definitions
```

---

## Proposed File Structure

```
src/
├── main.jsx                    # Entry point (keep as-is)
├── App.jsx                     # Shell: tab routing, top bar, bottom nav, modals
│
├── data/
│   ├── classes.js              # CLASSES, CLASS_DEFAULTS
│   ├── equipment.js            # ARMOR_DB, WEAPON_DB, WEIGHT_MODS
│   ├── keywords.js             # KEYWORDS glossary
│   ├── heritage.js             # ANCESTRIES, COMMUNITIES
│   ├── domainCards.js          # DOMAIN_CARDS (9 domains, ~220 lines)
│   ├── advancement.js          # TIER_ADV, TRAITS
│   └── index.js                # Re-exports everything
│
├── state/
│   ├── defaults.js             # def() function, SK constant
│   ├── useCharacter.js         # Custom hook: character state, u(), flash(), persistence
│   ├── useModals.js            # Custom hook: all modal states (dice, damage, ability, confirm, levelUp)
│   └── computed.js             # Pure functions: effEvasion, effTraits, breakdowns, isVulnerable
│
├── components/
│   ├── layout/
│   │   ├── TopBar.jsx          # DAGGERHEART title, LVL UP, dice, overflow menu
│   │   ├── BottomNav.jsx       # 5-tab navigation
│   │   ├── Toast.jsx           # Flash message
│   │   └── NudgeBar.jsx        # Setup todo nudges
│   │
│   ├── shared/
│   │   ├── KW.jsx              # Keyword tooltip component
│   │   ├── Markdown.jsx        # Markdown renderer with image support
│   │   ├── ModBadge.jsx        # Clickable modifier badge (+1, -2, etc.)
│   │   ├── ModPopup.jsx        # Floating breakdown card
│   │   ├── Tracker.jsx         # Reusable smart-fill tracker (HP, Stress, Hope, Armor)
│   │   ├── Counter.jsx         # +/- counter (Proficiency, Inspiration)
│   │   └── SpinDie.jsx         # Dice animation component
│   │
│   ├── tabs/
│   │   ├── SheetTab.jsx        # Main character sheet
│   │   │   ├── SheetHeader.jsx # Name, class, subclass, ancestry, community, level
│   │   │   ├── TraitBar.jsx    # 6 trait circles with roll buttons + mod badges
│   │   │   ├── StatRow.jsx     # Evasion, Armor Slots, Proficiency, Inspiration
│   │   │   ├── DamageHealth.jsx# Thresholds, HP, Stress, Hope trackers
│   │   │   ├── Experience.jsx  # Experience list
│   │   │   ├── GoldTracker.jsx # Handfuls, Bags, Chest
│   │   │   ├── HeritageSummary.jsx # Ancestry/community features on sheet
│   │   │   ├── LoadoutStrip.jsx    # Active domain cards
│   │   │   ├── WeaponSection.jsx   # Primary/secondary weapons
│   │   │   ├── ArmorSection.jsx    # Active armor
│   │   │   ├── Inventory.jsx       # Inventory list
│   │   │   └── ClassFeatures.jsx   # Class features + notes
│   │   │
│   │   ├── JournalTab.jsx     # Portrait, notes, reference images
│   │   ├── GuideTab.jsx       # Background, connections, tier checklist, description
│   │   ├── CardsTab.jsx       # Loadout, vault, available cards
│   │   └── HeritageTab.jsx    # Ancestry picker, community picker, multiclass
│   │
│   └── modals/
│       ├── DiceRoller.jsx      # Hope/Fear roller with animation + breakdown
│       ├── DamageRoller.jsx    # Damage dice roller
│       ├── AbilityModal.jsx    # Spend resources + optional roll
│       ├── LevelUpWizard.jsx   # Full level-up flow with inline controls
│       └── ConfirmDialog.jsx   # Generic confirmation
│
├── utils/
│   ├── dice.js                 # rollD(), parseDmgDice(), rollDamage()
│   ├── parsers.js              # parseAbilityCost(), parseAbilityRoll()
│   ├── smartToggle.js          # Tracker fill logic
│   └── readImage.js            # readImageFile() for paste/upload
│
└── styles/
    ├── global.css              # CSS string → actual CSS file
    └── theme.js                # S object + color/font constants
```

---

## Decomposition Guide

### Step 1: Extract Data (no logic changes)

These are pure constants. Move each to its own file, add `export`.

| Source lines | Target file | Exports |
|---|---|---|
| 4-14 | `data/classes.js` | `CLASSES`, plus `CLASS_DEFAULTS` from lines 322-333 |
| 15-29 | `data/equipment.js` | `ARMOR_DB`, `WEAPON_DB`, `WEIGHT_MODS` |
| 46-70 | `data/keywords.js` | `KEYWORDS` |
| 71-101 | `data/heritage.js` | `ANCESTRIES`, `COMMUNITIES` |
| 102-321 | `data/domainCards.js` | `DOMAIN_CARDS` |
| 334-336, 361 | `data/advancement.js` | `TIER_ADV`, `TRAITS` |

Create `data/index.js` that re-exports everything:
```js
export { CLASSES, CLASS_DEFAULTS } from './classes';
export { ARMOR_DB, WEAPON_DB, WEIGHT_MODS } from './equipment';
// ... etc
```

### Step 2: Extract Utilities (no logic changes)

Pure functions with zero React dependencies:

| Source | Target | Functions |
|---|---|---|
| 337-360 | `utils/parsers.js` | `parseAbilityCost(text)`, `parseAbilityRoll(text)` |
| 377-384 | `utils/smartToggle.js` | `smartToggle(arr, total, clickedFilled)` |
| 401, 411-427 | `utils/dice.js` | `rollD(sides)`, `parseDmgDice(str)`, `rollDamage(str, prof)` |
| 484-500 | `utils/readImage.js` | `readImageFile(file, maxW)` |

### Step 3: Extract Styles

**CSS string** (lines 1534-1604) → `styles/global.css`
- Remove the `const CSS=\`...\`` wrapper
- Remove the `<style>` injection from App — use Vite's CSS import instead
- The CSS contains: reset, focus styles, animations, tooltips, responsive breakpoints

**Style object** (lines 1605-1700) → `styles/theme.js`
```js
// Extract color tokens
export const colors = {
  bg: '#0d0d0f', surface: '#111114', surfaceAlt: '#1a1a1e',
  text: '#e0ddd5', textMuted: '#bbb', textDim: '#888',
  gold: '#d4a017', red: '#e05545', green: '#2d6a4f', blue: '#50a0ff',
  border: '#3a3a3e', borderDim: '#2a2a2e'
};

export const fonts = {
  heading: "'Cinzel', serif",
  body: "'Barlow', sans-serif",
  label: "'Barlow Condensed', sans-serif"
};

export const S = { /* all existing style objects */ };
```

**Future:** Migrate to SCSS partials or Tailwind. For now, keep the S object to avoid breaking everything.

### Step 4: Extract Small Components

These have zero or minimal dependencies:

| Source | Target | Props |
|---|---|---|
| 385-399 | `shared/KW.jsx` | `{ text }` — needs `KEYWORDS` import |
| 404-408 | `shared/SpinDie.jsx` | `{ sides, color }` — needs `rollD` |
| 430-482 | `shared/Markdown.jsx` | `{ text, images }` — standalone |

### Step 5: Custom Hooks

**`useCharacter.js`** — Extract from App lines 502-535:
```js
export function useCharacter() {
  const [c, setC] = useState(def);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  // Persistence effects (load + save)
  // flash(), u(), askConfirm()

  return { c, setC, u, loaded, toast, flash };
}
```

**`useModals.js`** — Extract all modal states:
```js
export function useModals() {
  const [diceModal, setDiceModal] = useState(null);
  const [diceResult, setDiceResult] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [dmgModal, setDmgModal] = useState(null);
  const [dmgResult, setDmgResult] = useState(null);
  const [abilityModal, setAbilityModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [lvlUp, setLvlUp] = useState(null);
  const [modPopup, setModPopup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape handler effect
  // Outside-click effect

  return { /* all getters/setters */ };
}
```

**`computed.js`** — Pure functions (no hooks, no state):
```js
export function computeStats(c, CLASSES, TRAITS) {
  const cls = CLASSES[c.className];
  const mods = c.armorMods || {};
  const effEvasion = (c.baseEvasion || 10) + (mods.evasion || 0);
  const effTraits = {};
  TRAITS.forEach(t => { effTraits[t.k] = (c.traits[t.k] || 0) + (mods[t.k] || 0) });
  const hopeCount = (c.hopeM || []).filter(Boolean).length;
  const stressCount = (c.stressM || []).filter(Boolean).length;
  const isVulnerable = stressCount >= (c.stressSlots || 6);
  const tier = c.level <= 1 ? 1 : c.level <= 4 ? 2 : c.level <= 7 ? 3 : 4;
  const myDomains = [...(cls?.domains || []), ...(CLASSES[c.multiclass]?.domains || [])]
    .filter((v, i, a) => a.indexOf(v) === i);
  return { cls, mods, effEvasion, effTraits, hopeCount, stressCount, isVulnerable, tier, myDomains };
}

export function getTraitBreakdown(tk, c) { /* ... */ }
export function getEvasionBreakdown(c, cls) { /* ... */ }
export function getProfBreakdown(c) { /* ... */ }
```

### Step 6: Extract Tab Components

Each tab is a self-contained section of JSX. The pattern for extraction:

```jsx
// tabs/SheetTab.jsx
export function SheetTab({ c, u, cls, mods, effEvasion, effTraits, ... }) {
  return (
    <main id="main-content" role="main" aria-label="Character sheet">
      <SheetHeader ... />
      <TraitBar ... />
      <StatRow ... />
      {/* etc */}
    </main>
  );
}
```

**Prop threading** is the main challenge. Each tab needs access to:
- `c` (character state) and `u` (updater)
- `cls` (current class object)
- Computed values (`mods`, `effEvasion`, `effTraits`, etc.)
- Action callbacks (`openDice`, `useAbility`, `flash`, etc.)

**Options for avoiding prop drilling:**
1. **React Context** — Create `CharacterContext` that provides `c`, `u`, computed values
2. **Zustand** — Lightweight store, good for this scale
3. **Keep prop threading** — Simple, explicit, easy to trace

**Recommendation:** Start with React Context for character state + computed values. Keep modal callbacks as props since they're used selectively.

### Step 7: Extract Modals

Each modal is already isolated in the JSX. Extract as:

```jsx
// modals/DiceRoller.jsx
export function DiceRoller({ modal, result, rolling, onRoll, onClose, effTraits, c }) {
  if (!modal) return null;
  return <div style={S.overlay}>...</div>;
}
```

---

## State Architecture

### Character State Shape
```js
{
  // Identity
  name: string, pronouns: string,
  className: string, subclass: string, multiclass: string,
  level: number, // 1-10

  // Heritage
  ancestry1: string, ancestry2: string,
  ancestryFeat1: "first"|"second", ancestryFeat2: "first"|"second",
  community: string,

  // Traits (base values — mods computed from armor)
  traits: { agility, strength, finesse, instinct, presence, knowledge },

  // Derived stats (stored, not computed)
  baseEvasion: number, // computed = baseEvasion + armorMods.evasion
  proficiency: number,

  // Trackers (arrays of booleans, true = marked)
  hpSlots: number, hpM: boolean[],
  stressSlots: number, stressM: boolean[],
  hopeSlots: number, hopeM: boolean[],
  armorTotal: number, armorM: boolean[],

  // Equipment
  wpn: {
    pri: { id, name, tr, range, dmg, dmgType, hand, feat },
    sec: { id, name, tr, range, dmg, dmgType, hand, feat }
  },
  armorId, armorName, armorMinor, armorMajor, armorScore, armorWeight, armorFeat,
  armorMods: { evasion?: number, agility?: number },

  // Progression
  exps: [{ n: string, b: number }],        // name + bonus
  tierOpts: { 2: number[], 3: number[], 4: number[] }, // indices of chosen advancement options
  advHistory: [{ level, type, traits?, exps?, cls? }], // detailed advancement log

  // Domain cards
  loadout: Card[], // max 5 active
  vault: Card[],   // inactive storage

  // Economy
  goldH: number, goldB: number, goldC: boolean,
  inspiration: number,

  // Inventory & notes
  inv: string[],
  notes: string, // legacy single textarea (kept for compat)

  // Guide tab
  bgA: string[3],     // background answers
  conA: string[3],     // connection answers
  charDesc: { clothes, eyes, body, skin, attitude },

  // Journal
  portrait: string,    // base64 JPEG
  journal: [{ id, title, body, ts }],
  noteImages: { [id]: base64string },   // pasted images stored by short ID
  refImages: [{ id, data, label }],     // reference image gallery
}
```

### State Update Pattern
The `u` helper provides a shorthand for updating a single top-level key:
```js
const u = useCallback((k, v) =>
  setC(p => ({ ...p, [k]: typeof v === "function" ? v(p[k]) : v })), []);

// Usage:
u("name", "Buddy");              // set value
u("hpM", smartToggle(c.hpM, c.hpSlots, filled)); // set from computation
```

For nested updates (traits, weapons), use `setC` directly:
```js
setC(p => ({ ...p, traits: { ...p.traits, [key]: value } }));
```

### Storage
- **Key:** `"dh-v7"` — bump this on breaking schema changes
- **Claude.ai:** `window.storage.get/set` (async, provided by platform)
- **Self-hosted:** `localStorage` polyfill in `main.jsx`
- **Debounce:** 400ms after each state change
- **Export:** Full JSON including base64 images

---

## Key Behavioral Details

### Smart Toggle (Tracker Fill)
All trackers (HP, Stress, Hope, Armor) use the same fill logic:
- Click empty slot → fill leftmost empty
- Click filled slot → clear rightmost filled
- This keeps marks sequential and clean

### Armor Modifier System
`WEIGHT_MODS` maps armor weight to stat penalties:
```js
{ Light: {}, Medium: {}, Heavy: { evasion: -1 }, "Very Heavy": { evasion: -2, agility: -1 } }
```
When armor is equipped, `c.armorMods` is set to the weight's mod object. These are added to base evasion and traits at render time.

### Advancement History
`advHistory` is an append-only log:
```js
[
  { level: 2, type: "traits", traits: ["instinct", "presence"] },
  { level: 3, type: "hp" },
  { level: 3, type: "evasion" },
  { level: 4, type: "proficiency" },
]
```
Used by `getTraitBreakdown()`, `getEvasionBreakdown()`, `getProfBreakdown()` to populate modifier popup cards, and by the dice roller to split base vs advancement bonuses.

### Ability Cost Chain
1. `parseAbilityCost(text)` extracts `{ resource: "hope"|"stress", amount: number }` from ability descriptions
2. `parseAbilityRoll(text)` detects if a roll is required (Spellcast, trait roll, attack)
3. Modal shows cost + roll info
4. "Spend & Roll" button: deducts resources via `commitAbility()`, then opens dice roller via `openDice()`

### Keyword Tooltips
`KW` component scans text for keywords matching `KEYWORDS` glossary, wraps matches in `<span class="kw-tip" title="definition">`. CSS handles the tooltip popup on hover/focus.

### Markdown Renderer
Custom lightweight renderer supporting: `# ## ###`, `**bold**`, `*italic*`, `` `code` ``, `- lists`, `1. ordered`, `[links](url)`, `![images](src)`, `---`.

Images use `img:` prefix for IDs stored in `noteImages` map:
- Paste/upload stores base64 in `c.noteImages[id]`
- Note body contains `![image](img:abc123)` — short and editable
- Renderer resolves `img:` prefix via the `images` prop

---

## CSS Architecture

Currently a single string injected via `<style>` tag. Contains:

1. **Reset** — box-sizing, number input spinners hidden
2. **Focus management** — `:focus-visible` blue outline on all interactives
3. **Accessibility** — `.sr-only`, `.skip-link`, `prefers-reduced-motion`
4. **Animations** — `fadeIn`, `hlPulse`, `diceFlicker`
5. **Keyword tooltips** — `.kw-tip` hover/focus popup via `::after` + `attr(title)`
6. **Responsive breakpoints:**
   - `≤640px` — single column, 3x2 trait grid, stacked stat row
   - `641-900px` — 2x2 stat row wrapping
   - `≥641px` — bottom nav capped at 820px centered

The `S` object contains ~95 inline style definitions. These should eventually migrate to CSS modules or Tailwind classes, but work fine as-is for the refactor.

---

## Migration Checklist

- [ ] Create `data/` modules, update imports in App.jsx
- [ ] Create `utils/` modules, update imports
- [ ] Extract `styles/global.css` from CSS string, import in main.jsx
- [ ] Extract `styles/theme.js` (S object + color constants)
- [ ] Extract `KW`, `SpinDie`, `Markdown` components
- [ ] Create `useCharacter` hook
- [ ] Create `useModals` hook
- [ ] Extract `computed.js` pure functions
- [ ] Create `CharacterContext` provider
- [ ] Extract each tab component (Sheet, Journal, Guide, Cards, Heritage)
- [ ] Extract sheet sub-components (TraitBar, StatRow, DamageHealth, etc.)
- [ ] Extract modal components (DiceRoller, DamageRoller, AbilityModal, LevelUpWizard, ConfirmDialog)
- [ ] Extract layout components (TopBar, BottomNav, Toast, NudgeBar)
- [ ] Extract `ModBadge` + `ModPopup` shared components
- [ ] Extract `Tracker` + `Counter` shared components
- [ ] Verify all keyboard/focus/aria behavior preserved
- [ ] Verify responsive breakpoints still work
- [ ] Verify localStorage persistence still works
- [ ] Verify JSON export/import round-trips correctly
- [ ] Run through USER_GUIDE.md as acceptance test

---

## Known Issues / Tech Debt

1. **No tests.** Priority: unit tests for `utils/`, integration test for level-up flow.
2. **advHistory not surfaced on trait badges** — Data is saved and breakdown functions exist, but the trait circle display doesn't yet show advancement-sourced mods in the badge total. The `getTraitTotalMod()` function only includes armor mods + advancement count, but `base` values in `c.traits` already include advancement (since `commitLevelUp` mutates `c.traits` directly). This means the advancement lines in the breakdown popup may double-count. **Fix:** Either (a) stop mutating `c.traits` in commitLevelUp and derive the +1 from advHistory at render time, or (b) remove the advancement lines from `getTraitBreakdown` since they're baked into base. Option (a) is cleaner long-term.
3. **Image storage is base64** in character state — large images bloat localStorage and JSON exports. Future: consider IndexedDB or separate image storage.
4. **No undo.** Consider adding undo for resource spending.
5. **Subclass features missing** — 54 features across 18 subclasses need to be scraped from SRD.
6. **The style object `S` is referenced globally** — after decomposition, either pass as prop, import from theme.js, or use CSS modules.

---

## SRD Data Sources

All data comes from the official Daggerheart SRD under DPCGL license:

| Data | URL | Status |
|------|-----|--------|
| Classes | `daggerheartsrd.com/classes/{name}/` | ✅ 9 classes done |
| Subclasses | `daggerheartsrd.com/subclasses/{slug}/` | ❌ 54 features needed |
| Primary weapons | `daggerheartsrd.com/primary-weapons/` | ✅ 12 done, more available |
| Secondary weapons | `daggerheartsrd.com/secondary-weapons/` | ❌ Not yet |
| Armor | `daggerheartsrd.com/armor/` | ✅ 7 done, more available |
| Ancestries | `daggerheartsrd.com/ancestries/` | ✅ 18 done |
| Communities | `daggerheartsrd.com/communities/` | ✅ 9 done |
| Domain cards | `daggerheartsrd.com/domain-cards-{name}/` | ✅ 9 domains done |
| Consumables | `daggerheartsrd.com/consumables/` | ❌ Not yet |
| Items | `daggerheartsrd.com/items/` | ❌ Not yet |

---

## Build & Deploy

```bash
npm install          # Install deps
npm run dev          # Dev server at localhost:5173
npm run build        # Production build → dist/
npx serve dist       # Serve production build

# Docker (auto-HTTPS via Caddy)
docker compose up -d --build
```

---

## Legal

Content from the Daggerheart SRD is included under the Daggerheart Publisher's Community Game License (DPCGL). Attribution: "Daggerheart © Darrington Press 2025. Unofficial fan tool."
