# Vedhas Kharche — System Architect OS

A mind-blowing, high-performance interactive portfolio website for a Senior Backend & Data Engineer, designed as a futuristic Developer Operating System with 3 instant toggle modes.

![System Architect OS](https://img.shields.io/badge/System_Architect_OS-v3.14.159-00F0FF?style=for-the-badge&logo=cpu)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![Static Export](https://img.shields.io/badge/Deploy-GitHub_Pages-181717?style=for-the-badge&logo=github)

## ✨ Three Modes

1. **Architecture Mode** — Interactive 2.5D node graph mapping real production architectures from Vedhas's career. Hover any node for tech-stack tooltips, click to open the side-drawer technical deep dive.
2. **Terminal / CLI Mode** — Fully functional client-side UNIX shell with `help`, `cat resume`, `skills --expert`, `projects`, `sudo hire`, `matrix`, `neofetch`, and 13 more commands. Tab autocomplete, ↑/↓ history, Ctrl+L clear, matrix rain overlay.
3. **Executive Mode** — High-density recruiter UI with quantified impact strip, career timeline, project cards, competency radar, skill matrix, and instant contact actions.

## 🚀 Deploy to GitHub Pages

This project is **100% Static Site Generation (SSG)** — no server runtime required.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: ship System Architect OS portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to **Settings → Pages** on your repo.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. The included workflow at `.github/workflows/deploy.yml` will automatically:
   - Install Bun + dependencies
   - Detect whether the repo is a project page (e.g. `user.github.io/repo-name`)
   - Set `NEXT_PUBLIC_BASE_PATH=/<repo-name>` for subpath serving
   - Run `bun run next build` (with `output: "export"`)
   - Upload `./out` as a Pages artifact
   - Deploy via `actions/deploy-pages@v4`

### 3. Wait ~1 minute

Push to `main` and the site goes live at:
- User page: `https://<user>.github.io/`
- Project page: `https://<user>.github.io/<repo>/`

## 🛠 Local Development

```bash
bun install
bun run dev          # dev server on :3000
bun run build:static # produces ./out for GitHub Pages
```

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript 5)
- **Styling**: Tailwind CSS 4 + custom cyberpunk design system
- **State**: Zustand 5 (with persist middleware for user prefs)
- **Animation**: Framer Motion 12
- **UI**: shadcn/ui (New York) + Lucide icons
- **Fonts**: Inter (body) · JetBrains Mono (code/terminal) · Space Grotesk (display)
- **Audio**: Web Audio API (cyberpunk SFX, no external assets)

## 🎨 Design System

| Token              | Value       | Usage                            |
| ------------------ | ----------- | -------------------------------- |
| Deep Obsidian      | `#0A0D12`   | Background                       |
| Cyber Cyan         | `#00F0FF`   | Primary accent, neon glows       |
| Emerald            | `#10B981`   | Success, data engineering        |
| Hyper Purple       | `#8B5CF6`   | Secondary accent, AI/ML         |
| Amber              | `#F59E0B`   | Warnings, awards                 |
| Crimson            | `#EF4444`   | Errors, destructive              |

## 📁 Project Structure

```
.
├── .github/workflows/deploy.yml       # GitHub Pages deployment
├── next.config.ts                     # output: "export", basePath, images.unoptimized
├── public/
│   ├── .nojekyll                     # Prevents GitHub Pages from blocking _next/
│   └── Vedhas_Kharche_Resume.pdf
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Fonts + metadata
│   │   ├── page.tsx                  # Main page (mode switcher)
│   │   └── globals.css               # Cyberpunk design system
│   ├── components/os/
│   │   ├── BootSequence.tsx          # Initial boot animation
│   │   ├── OSHeader.tsx               # Top nav + mode toggles
│   │   ├── HeroSection.tsx           # Particle canvas + metric ticker
│   │   ├── HeroCanvas.tsx            # Cursor-reactive particle field
│   │   ├── ArchitectureMode.tsx      # 2.5D node graph + deep dives
│   │   ├── TerminalMode.tsx          # CLI shell with 20+ commands
│   │   ├── ExecutiveMode.tsx         # Recruiter-optimized UI
│   │   └── ContactFooter.tsx         # Contact channels + signature
│   ├── data/
│   │   └── resume.ts                 # All resume content (typed)
│   └── store/
│       └── useOSStore.ts             # Zustand store + Web Audio engine
└── scripts/
    └── build-static.sh              # Static export wrapper
```

## 🎯 Static Export Constraints (Verified)

This project strictly follows GitHub Pages SSG rules:

- ✅ `output: "export"` in `next.config.ts`
- ✅ `images.unoptimized: true` (no Node.js image optimizer)
- ✅ `trailingSlash: true` (so `/path/` → `/path/index.html`)
- ✅ `basePath` + `assetPrefix` auto-configured from `NEXT_PUBLIC_BASE_PATH`
- ✅ **Zero** API routes (`/api/*`) — deleted to enable static export
- ✅ **Zero** server actions / dynamic server headers
- ✅ `public/.nojekyll` so GitHub Pages serves `/_next/` static assets
- ✅ 100% client-side state via Zustand (audio, terminal, mode, history)
- ✅ Browser-supported static assets only (`.pdf`, `.svg`, `.woff2`)

## 🧪 Verified Terminal Commands

```bash
help                  # list all commands
cat resume            # full resume summary (with ASCII art)
skills                # technical skills grouped by category
skills --expert       # deep dive with mastery bars + project linkage
projects              # list all 7 flagship projects
projects --scale=large  # filter
project abbott-ai     # deep dive into a specific project
system-status         # live uptime + service health
whoami                # identity
contact               # contact channels (clickable)
experience            # git-commit styled career timeline
awards                # achievements & recognition
neofetch              # system info banner with ASCII logo
matrix                # toggle Matrix rain overlay
theme cyan|emerald|purple  # switch accent color
sudo hire             # recruitment protocol (initiates contact)
clear                 # clear screen (or Ctrl+L)
history               # show command history
exit                  # back to architecture mode
```

Keyboard: `Tab` autocomplete · `↑/↓` history · `Ctrl+L` clear · `Ctrl+C` cancel

---

© 2024 Vedhas Kharche — Built with Next.js 16 + Zustand + Tailwind CSS 4
