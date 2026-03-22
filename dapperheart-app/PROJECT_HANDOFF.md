# Daggerheart Character Sheet — Project Handoff (v18)

## Current State
- **File:** `daggerheart-app/src/App.jsx` (1665 lines)
- **Storage key:** `dh-v7`
- **Stack:** React + Vite, mobile-first, PWA-ready

## Navigation
Bottom nav: Sheet → Journal → Guide → Cards → Heritage
Top bar: DAGGERHEART title, ⬆ LVL UP, 🎲 free roll, ⋮ overflow (Export/Import/Reset)

## Key Features
- All 9 classes, 18 ancestries, 9 communities with SRD data
- Smart-fill trackers (HP/Stress/Hope/Armor)
- Clickable mod badges → floating breakdown popup (X close, outside-click, Escape)
- VULNERABLE badge when stress is full
- Click-to-roll traits with dice animation + math breakdown
- Ability modal: Spend & Roll chains resource deduction → dice roller
- Level-up wizard with inline controls per advancement type
- Journal: markdown notes with image paste (stored by short ID), reference images
- Portrait in journal tab (180px display, click for full-size)

## State Shape (SK="dh-v7")
traits, baseEvasion, proficiency, hpSlots/M, stressSlots/M, hopeSlots/M, armorTotal/M,
goldH/B/C, exps[], wpn{pri,sec}, armorId/Name/Minor/Major/Score/Weight/Feat/Mods,
inv[], notes, bgA[], conA[], tierOpts{2,3,4}, loadout[], vault[],
charDesc{}, inspiration, portrait, refImages[], journal[], noteImages{}, advHistory[]

## Pending
1. Surface advHistory in trait mod breakdowns (data saved, not displayed yet)
2. Subclass features (54 total from SRD)
3. More weapons/armor from SRD
4. Consumables & items
5. Ranger companion / Druid beastform
