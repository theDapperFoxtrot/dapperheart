# Daggerheart Digital Character Sheet — User Guide

An unofficial, fan-made digital character sheet for **Daggerheart** by Darrington Press / Critical Role. Free, self-hostable, works offline as a PWA. All SRD data included under the DPCGL license.

---

## Getting Started

### Option 1: Use in Claude.ai (No Setup)
Open the `.jsx` artifact directly in a Claude conversation. Your data saves automatically between sessions using persistent storage.

### Option 2: Self-Host with Docker (Recommended)
```bash
# Download and extract the project
tar -xzf daggerheart-app.tar.gz
cd daggerheart-app

# Edit the domain in Caddyfile
sed -i 's/daggerheart.yourdomain.com/your-domain.com/' Caddyfile

# Launch (auto-HTTPS via Let's Encrypt)
docker compose up -d --build
```
Your site will be live at `https://your-domain.com` with automatic HTTPS.

### Option 3: Deploy to Netlify / Vercel
```bash
cd daggerheart-app
npm install
npm run build
npx vercel --prod   # or drag dist/ folder into Netlify
```

### Option 4: Run Locally
```bash
cd daggerheart-app
npm install
npm run dev     # development at localhost:5173
npm run build   # production build in dist/
npx serve dist  # serve the build
```

---

## Navigation

The app has five tabs in the **bottom navigation bar**, designed for easy thumb access on phones:

| Tab | Icon | Purpose |
|-----|------|---------|
| **Sheet** | 📋 | Your main character sheet — stats, trackers, equipment |
| **Guide** | 📖 | Background questions, connections, tier advancement, character description |
| **Cards** | 🃏 | Domain card loadout, vault, and available cards |
| **Heritage** | 🧬 | Ancestry and community selection with feature details |
| **Journal** | 📝 | Notes, portrait, reference images |

The **top bar** has:
- **⬆ LVL UP** — Open the level-up wizard
- **🎲** — Free roll (2d12 + optional trait)
- **⋮** — Overflow menu for Export, Import, and Reset

---

## Creating a Character

### Step 1: Choose a Class
On the **Sheet** tab, pick your class from the dropdown. This auto-fills:
- Starting HP slots and Evasion
- Suggested trait scores
- Default armor and primary weapon
- Domain access for cards

All 9 classes are available: Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior, Wizard.

### Step 2: Choose Heritage
Switch to the **Heritage** tab:

**Ancestry** — Pick a primary ancestry from the dropdown. You get **both features** of that ancestry.

**Mixed Ancestry** — Optionally pick a different secondary ancestry. For mixed heritage, you choose **one feature** from each ancestry using the radio buttons that appear.

> Features are shown below your selection so you can review them before committing.

**Community** — Select your community. Each grants a unique feature and a set of character adjectives for roleplay inspiration.

Heritage selections appear on the Sheet tab header and in the Heritage Summary section.

### Step 3: Fill in Details
Back on **Sheet**:
- **Name** and **Pronouns**
- **Subclass** — pick from your class options
- **Character Traits** — set your six ability scores (Agility, Strength, Finesse, Instinct, Presence, Knowledge)

### Step 4: Equip Gear
- **Weapons** — select from the database or enter custom weapons with trait, range, damage dice, and features
- **Armor** — select from the database or enter custom armor with minor/major thresholds, score, and weight class

> Armor weight automatically applies modifiers. Heavy armor gives −1 Evasion; Very Heavy gives −2 Evasion and −1 Agility. These modifiers are shown on your trait circles and evasion stat with **hover tooltips** explaining the source.

### Step 5: Pick Domain Cards
On the **Cards** tab, browse cards from your class domains (filtered by your level). Add cards to your **Loadout** (max 5 active) or **Vault** (inactive storage).

---

## Using the Sheet in Play

### Trackers
All trackers use **smart fill** — tap an empty slot to fill the leftmost empty one, tap a filled slot to clear the rightmost filled one. This keeps your marks clean and sequential.

- **HP** (squares) — Mark when you take damage
- **Stress** (circles) — Mark when you use abilities or take stress
- **Hope** (diamonds) — Spend on abilities, gain from rolls with Hope
- **Armor Slots** (rounded squares) — Mark to absorb damage

### Rolling Dice

**From traits:** Each trait label has a 🎲 button. Tap **AGILITY 🎲** to roll 2d12 + your Agility modifier. The roller shows:
- Normal / Advantage / Disadvantage toggle
- Spinning dice animation while rolling
- Full math breakdown with hover tooltips:
  - Hope die + Fear die
  - Base trait value
  - Armor modifier (if any, with tooltip explaining source)
  - Advantage/disadvantage die
- **Hope vs Fear** result and total
- **Critical Success** when both dice match

**From weapons:** Each weapon has 🎲 **Attack Roll** and 💥 **Damage Roll** buttons.

**Free roll:** Tap 🎲 in the top bar for an unmodified roll.

### Using Abilities

Abilities with resource costs show **TAP TO USE** in blue. Tapping opens a modal that:
1. Shows the ability text with keyword tooltips
2. Displays the resource cost and your current supply
3. Detects if a roll is required (Spellcast Roll, trait roll, etc.)
4. Offers a **Spend & Roll 🎲** button that deducts resources and opens the dice roller in one action

If an ability includes a DC (difficulty class), the roller shows pass/fail against it.

### Keyword Tooltips

Game terms like **Powerful**, **Restrained**, **Frightened**, **Concealed**, etc. appear with a dashed gold underline. Hover (desktop) or tap-and-hold (mobile) to see the definition.

### Gold Tracking

Gold uses Daggerheart's denomination system:
- **Handfuls** — small coins (tap to fill/unfill)
- **Bags** — 10 handfuls each
- **Chest** — a fortune

### Proficiency & Inspiration

Both are **counter widgets** with +/− buttons, matching the evasion stat box style.

---

## Guide Tab

The Guide tab is for **character-building** and **advancement**:

- **Class Info** — Suggested trait distribution and starting items
- **Background Questions** — Three prompts from your class to flesh out backstory. Write your answers in the text areas.
- **Connections** — Three prompts about your relationships with other party members
- **Tier Advancement** (Tiers 2–4) — Checkbox lists of advancement options. Check off the ones you've taken as you level up.
- **Character Description** — Clothes, eyes, body, skin color, and attitude fields using Daggerheart's evocative prompt system

---

## Leveling Up

Tap **⬆ LVL UP** in the top bar to open the level-up wizard:

1. **Choose 2 advancement options** from your current tier's list. Options you've already taken in previous levels show as checked and disabled.
2. **Pick a domain card** at or below your new level
3. **Multiclass** (Tier 3+) — If you select the Multiclass option, choose a second class to gain access to their domains
4. **Confirm** — Your level increases, choices are recorded, and any selected card goes into your loadout (or vault if loadout is full)

---

## Journal Tab

### Character Portrait
Upload a character image, reference art, or photo. The portrait displays at full size (180×180) alongside a character summary. Click to view at original resolution in a new tab.

### Journal Notes
Create, edit, and organize notes with full **markdown** support:

**Formatting:**
```
# Big Heading
## Section Heading
### Subsection

**bold text** and *italic text*
`inline code`

- bullet list
- another item

1. numbered list
2. second item

[link text](https://url.com)

---  (horizontal rule)
```

**Images in notes:**
- **Paste from clipboard** — Copy an image and Ctrl+V / Cmd+V directly into the editor. It appears as a short `![image](img:abc123)` tag instead of a wall of data.
- **Upload button** — Tap 📷 Image in the editor toolbar to pick a file
- **Preview** — Toggle to 👁 Preview mode to see rendered markdown with images
- Click any rendered image to **open full-size in a new tab**

> Images are stored separately by ID and referenced with short `img:` tags, keeping your note text clean and editable.

**Use cases:**
- Session recaps
- NPC relationship maps
- Quest logs and objectives
- Backstory chapters
- Rules reference notes
- Pasted maps with annotations

### Reference Images
Below the journal, upload maps, NPC portraits, item sketches, or anything you want during play. Each image gets an editable label. Click any thumbnail to **view full-size in a new tab**. The "🔍 Full size" badge shows it's interactive.

---

## Data Management

### Auto-Save
Your character saves automatically to browser storage after every change (400ms debounce). No save button needed.

### Export / Import
From the **⋮** overflow menu:
- **⬇ Export JSON** — Downloads your complete character as a `.json` file. Includes all data, portrait, journal images, and reference images.
- **⬆ Import JSON** — Load a previously exported character file.

> Export regularly as a backup. Browser storage can be cleared by the browser.

### Reset
**↺ Reset All** clears everything and starts fresh. Requires confirmation.

### PWA / Offline
When self-hosted, the app installs as a Progressive Web App with offline support. Add to your home screen on mobile for an app-like experience.

---

## Accessibility

- **Keyboard navigation** — All interactive elements are focusable with visible focus indicators (blue outline)
- **Screen readers** — ARIA labels on all trackers, inputs, and modals. Skip-nav link for keyboard users.
- **Reduced motion** — Animations disabled automatically when `prefers-reduced-motion` is set
- **Color contrast** — Minimum 5.3:1 ratio on all text. Color is never the only indicator.
- **Touch targets** — Minimum 32px on all interactive elements, 36px+ on trackers and nav buttons
- **Escape key** — Closes any open modal

---

## Mobile Tips

- **Bottom nav** — Thumb-reachable tab switching. Active tab highlights gold.
- **Single-column layout** — On screens under 640px, everything stacks vertically
- **Trait circles** — Expand to 52px on mobile for easier input
- **Stat row** — Stacks fully on phone, 2×2 on tablet
- **iOS safe area** — Bottom nav respects the notch/home indicator

---

## Technical Details

- **Stack:** React 18 + Vite
- **Styling:** Inline JS styles + CSS-in-JS (no external CSS framework)
- **Fonts:** Cinzel (headings), Barlow + Barlow Condensed (body) via Google Fonts
- **Storage:** `window.storage` API (Claude.ai) or `localStorage` (self-hosted)
- **Data:** 189 domain cards across 9 domains, all 18 ancestries, 9 communities, full equipment databases
- **License:** App code is free to use. SRD content included under the Daggerheart Publisher's Community Game License (DPCGL) © Darrington Press / Critical Role.

---

*This product includes materials from the Daggerheart System Reference Document 1.0, © Critical Role, LLC. under the terms of the DPCGL.*
