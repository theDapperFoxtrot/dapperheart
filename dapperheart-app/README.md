# Daggerheart Character Sheet

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

## Local Development

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Use `npm run dev -- --host` to access from your phone on the same network.

---

## Deployment Options

All options serve the same static files from `npm run build`. Pick whichever fits your server.

### Option 1: Docker + Caddy (Recommended — zero config HTTPS)

The easiest path. Caddy auto-provisions Let's Encrypt certificates.

Prerequisites: Docker and Docker Compose installed, domain DNS pointing to your server.

```bash
# 1. Edit Caddyfile — replace domain
sed -i 's/daggerheart.yourdomain.com/your-actual-domain.com/' Caddyfile

# 2. Deploy
docker compose up -d --build
```

That's it. Caddy handles HTTPS automatically. Your site is live at https://your-actual-domain.com.

To update after code changes:
```bash
docker compose up -d --build
```

### Option 2: Docker without Compose

```bash
# Build
docker build -t daggerheart .

# Run (edit Caddyfile first)
docker run -d \
  --name daggerheart \
  -p 80:80 -p 443:443 \
  -v caddy_data:/data \
  --restart unless-stopped \
  daggerheart
```

### Option 3: Nginx + Certbot (Linux VPS)

For servers already running Nginx.

```bash
# 1. Build the app
npm install && npm run build

# 2. Copy files to server
sudo mkdir -p /var/www/daggerheart
sudo cp -r dist/* /var/www/daggerheart/

# 3. Install Nginx config
sudo cp nginx.conf /etc/nginx/sites-available/daggerheart
sudo ln -sf /etc/nginx/sites-available/daggerheart /etc/nginx/sites-enabled/
# Edit the domain in the config:
sudo nano /etc/nginx/sites-available/daggerheart

# 4. Get HTTPS certificate
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-actual-domain.com

# 5. Reload
sudo nginx -t && sudo systemctl reload nginx
```

Auto-renewal is set up by Certbot automatically.

### Option 4: Caddy standalone (no Docker)

```bash
# 1. Install Caddy (Debian/Ubuntu)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy -y

# 2. Build and deploy
npm install && npm run build
sudo mkdir -p /srv/daggerheart
sudo cp -r dist/* /srv/daggerheart/

# 3. Configure (edit domain in Caddyfile, change root to /srv/daggerheart)
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile

# 4. Start
sudo systemctl restart caddy
```

### Option 5: Free Hosting (Netlify / Vercel / GitHub Pages)

No server needed. Free HTTPS included.

Netlify:
```bash
npm install && npm run build
npx netlify-cli deploy --prod --dir=dist
```
Or connect your Git repo at https://app.netlify.com for auto-deploy on push.

Vercel:
```bash
npx vercel --prod
```

GitHub Pages:
```bash
# In vite.config.js, set base to your repo name:
# base: '/daggerheart-sheet/'
npm run build
npx gh-pages -d dist
```

### Option 6: Simple file server (quick & dirty)

For testing or LAN-only use. No HTTPS.

```bash
npm install && npm run build
npx serve dist -l 3000
```

Access at http://your-server-ip:3000.

---

## Updating

For all self-hosted options:

1. Pull or copy new source files
2. `npm install && npm run build`
3. Copy `dist/` to the serve directory, or `docker compose up -d --build` for Docker

---

## Mobile Install

With HTTPS enabled, users can add to their home screen:

- iOS Safari: Share > Add to Home Screen
- Android Chrome: Menu > Add to Home Screen

The app runs fullscreen with the dark theme matching the device status bar.

---

## Data & Privacy

All character data stays in the user's browser (localStorage). No data is sent to any server. JSON export/import lets users transfer data between devices manually.

---

## Attribution

This product includes materials from the Daggerheart System Reference Document 1.0, (c) Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL) License. More information at https://www.daggerheart.com.

This is an unofficial fan project, not affiliated with or endorsed by Critical Role or Darrington Press.
