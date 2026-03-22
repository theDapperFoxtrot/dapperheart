# Dapperheart

An unofficial digital character sheet for [Daggerheart](https://www.daggerheart.com), the tabletop RPG by Darrington Press.

## Features

- All 9 classes with starting stats, subclasses, and domain access
- Click-to-toggle trackers (HP, Stress, Hope, Armor) with smart left-to-right fill
- Equipment database with auto-applied modifiers and keyword tooltips
- Domain card loadout/vault system filtered to your class and level
- Mixed ancestry support (pick one feature from each of two ancestries)
- Multiclassing at Tier 3+ with combined domain access
- Guided level-up wizard with domain card selection
- Hope/Fear dice roller with advantage/disadvantage
- Inspiration counter
- Setup nudges with animated highlight on incomplete choices
- JSON export/import for backup and sharing
- Dark mode UI, fully mobile responsive
- Data saves automatically to localStorage

---

## Quick Start

Requires [Node.js](https://nodejs.org) 18+ and [Git](https://git-scm.com).

```bash
git clone https://github.com/YOUR_USERNAME/dapperheart.git
cd dapperheart/dapperheart-app
npm install
npm run dev
```

Open http://localhost:5173. Use `npm run dev -- --host` to access from your phone on the same network.

---

## Production Build

```bash
npm run build        # Outputs to dist/
npx serve dist       # Preview production build locally
```

---

## Deployment

All options serve the same static files from `dist/`. Pick whichever fits your setup.

### Docker + Caddy (zero-config HTTPS)

Prerequisites: Docker, Docker Compose, domain DNS pointing to your server.

```bash
# Edit Caddyfile — replace the domain
sed -i 's/daggerheart.yourdomain.com/your-actual-domain.com/' Caddyfile

# Deploy
docker compose up -d --build
```

Caddy handles HTTPS automatically. To update: `docker compose up -d --build`.

### Free Hosting (Netlify / Vercel / GitHub Pages)

No server needed. Free HTTPS included.

**Netlify:**
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```
Or connect your Git repo at https://app.netlify.com for auto-deploy on push.

**Vercel:**
```bash
npx vercel --prod
```

**GitHub Pages:**
```bash
# In vite.config.js, set base: '/dapperheart/'
npm run build
npx gh-pages -d dist
```

### Simple File Server (LAN / testing)

```bash
npm run build
npx serve dist -l 3000
```

Access at http://your-server-ip:3000.

---

## Mobile Install

With HTTPS enabled, add to your home screen for a native-like experience:

- **iOS Safari:** Share > Add to Home Screen
- **Android Chrome:** Menu > Add to Home Screen

---

## Data & Privacy

All character data stays in the user's browser (localStorage). No data is sent to any server. JSON export/import lets users transfer data between devices manually.

---

## Attribution

This product includes materials from the Daggerheart System Reference Document 1.0, (c) Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL) License. More information at https://www.daggerheart.com.

This is an unofficial fan project, not affiliated with or endorsed by Critical Role or Darrington Press.
