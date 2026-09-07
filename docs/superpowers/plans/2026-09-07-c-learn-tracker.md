# C-Learn Team Training Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated team training web application (`web/`) for the 3-person team (`GUY`, `FAN`, `HAN`) to enforce daily practice discipline, track progress across 2 YouTube playlists (CEDT Computer Programming & Data Structures), monitor GitHub code pushes across `FAN/`, `GUY/`, `HAN/`, and send Discord Webhook reports leading to the Day 27 C++ competition.

**Architecture:** A React 18 SPA built with Vite and Tailwind CSS. Client-side integration with GitHub REST API for public repo contents/commits, Firebase Realtime Database for live peer sync (with LocalStorage fallback), and Discord Webhook generator for daily reports. Configured with relative base path for GitHub Pages zero-cost deployment.

**Tech Stack:** React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti, GitHub REST API, Firebase Realtime DB.

## Global Constraints
- Location: Web app must be self-contained in `web/` within the repository `c:\Users\Asus\OneDrive\Desktop\C-Learn\`.
- Target Competition Date: September 27.
- Team Members: `GUY`, `FAN`, `HAN`.
- Curriculums:
  - CEDT Computer Programming (30 videos, `PLW3DcQsnGanN_7ye_Yfd_t6yQIAcWVu71`)
  - CEDT Data Structure & Algorithm (`PLW3DcQsnGanMXbpGjdCDbcj9kUgfc59PN`)
- Repo: `SOGUY144/C-Learn`

---

### Task 1: Scaffold Vite + React + Tailwind CSS project in `web/`

**Files:**
- Create: `web/package.json`
- Create: `web/vite.config.js`
- Create: `web/tailwind.config.js`
- Create: `web/postcss.config.js`
- Create: `web/index.html`
- Create: `web/src/index.css`
- Create: `web/src/main.jsx`
- Create: `web/src/App.jsx`

**Interfaces:**
- Produces: Runnable React app with Tailwind CSS styling and Lucide React icons.

- [ ] **Step 1: Create package.json and config files**
- [ ] **Step 2: Install dependencies (`npm install` inside `web/`)**
- [ ] **Step 3: Run Vite build to verify scaffolding compiles cleanly**
- [ ] **Step 4: Commit scaffolding**

```bash
git add web/
git commit -m "chore: scaffold Vite React Tailwind project in web/"
```

---

### Task 2: Core Data Models, Curriculum & Roadmap Dataset

**Files:**
- Create: `web/src/data/curriculum.js`
- Create: `web/src/data/curriculum.test.js`

**Interfaces:**
- Produces:
  - `DAYS_ROADMAP`: Array of 20 day objects with `day`, `title`, `phase`, `description`, `videos: [{id, title, duration, url, playlist}]`, `challenge: {filename, title, description}`
  - `ALL_PLAYLIST_VIDEOS`: Comprehensive list of videos from both playlists.
  - `INITIAL_MEMBERS`: `{ GUY: MemberState, FAN: MemberState, HAN: MemberState }`

- [ ] **Step 1: Write test verifying curriculum data integrity (20 days, non-empty videos, members)**
- [ ] **Step 2: Run test using node to verify failure**
- [ ] **Step 3: Implement `curriculum.js` with all 20 days, CEDT playlist videos, and exercise targets**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

```bash
git add web/src/data/
git commit -m "feat: add 20-day training curriculum and playlist metadata"
```

---

### Task 3: State Management & Storage Engine (LocalStorage + Firebase Sync)

**Files:**
- Create: `web/src/services/storage.js`
- Create: `web/src/services/storage.test.js`

**Interfaces:**
- Produces:
  - `loadState(): TeamState`
  - `saveState(state: TeamState): void`
  - `toggleVideo(member: string, videoId: string): TeamState`
  - `toggleDayQuest(member: string, dayNum: number): TeamState`
  - `calculateStreak(memberState: MemberState): number`
  - `initFirebaseSync(config, onUpdate): () => void`

- [ ] **Step 1: Write test verifying streak calculation and toggle mechanics**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `storage.js` with streak calculator and Firebase/LocalStorage hybrid engine**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

```bash
git add web/src/services/storage.js web/src/services/storage.test.js
git commit -m "feat: add storage service with streak calculation and sync engine"
```

---

### Task 4: GitHub API Service & Code Inspector

**Files:**
- Create: `web/src/services/github.js`
- Create: `web/src/services/github.test.js`

**Interfaces:**
- Produces:
  - `fetchMemberFiles(member: string): Promise<Array<{name, path, size, download_url}>>`
  - `fetchRecentCommits(member: string): Promise<Array<{sha, message, date, author}>>`
  - `fetchFileContent(downloadUrl: string): Promise<string>`

- [ ] **Step 1: Write test for GitHub API response parser and fallback simulation**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `github.js` with caching and GitHub REST API integration**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

```bash
git add web/src/services/github.js web/src/services/github.test.js
git commit -m "feat: add GitHub API integration for member folders and commits"
```

---

### Task 5: Discord Webhook Service

**Files:**
- Create: `web/src/services/discord.js`
- Create: `web/src/services/discord.test.js`

**Interfaces:**
- Produces:
  - `buildDiscordReportEmbed(state, gitData): object`
  - `sendDiscordWebhook(webhookUrl, payload): Promise<boolean>`

- [ ] **Step 1: Write test verifying Discord embed structure, formatting, and accountability badges**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `discord.js`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

```bash
git add web/src/services/discord.js web/src/services/discord.test.js
git commit -m "feat: add Discord webhook reporting service"
```

---

### Task 6: Header, Countdown Clock & Team Battle Board UI

**Files:**
- Create: `web/src/components/Header.jsx`
- Create: `web/src/components/CountdownTimer.jsx`
- Create: `web/src/components/TeamBattleBoard.jsx`

**Interfaces:**
- Consumes: `TeamState`, `gitData`, `storage.js`
- Produces: Interactive top banner with countdown timer to Day 27, and 3-column Battle Board for GUY, FAN, and HAN with streak flames and status badges.

- [ ] **Step 1: Implement `CountdownTimer.jsx` with ticking countdown to September 27**
- [ ] **Step 2: Implement `Header.jsx` with team title, target date, and global progress meter**
- [ ] **Step 3: Implement `TeamBattleBoard.jsx` showing member cards, streaks, today's status badges, and latest Git push badge**
- [ ] **Step 4: Integrate into `App.jsx` and verify rendering with `npm run build`**
- [ ] **Step 5: Commit**

```bash
git add web/src/components/ web/src/App.jsx
git commit -m "feat: add Header, CountdownTimer, and TeamBattleBoard components"
```

---

### Task 7: Daily Roadmap & Quest Tracker UI

**Files:**
- Create: `web/src/components/DailyRoadmap.jsx`

**Interfaces:**
- Consumes: `DAYS_ROADMAP`, `TeamState`, `onToggleVideo`, `onToggleQuest`
- Produces: 20-Day switcher tabs, daily objectives, video checklists with YouTube quick links, and 3-member check-in grid.

- [ ] **Step 1: Implement `DailyRoadmap.jsx` with day navigation tabs (Day 1 to Day 20)**
- [ ] **Step 2: Add video checklist items with YouTube buttons and multi-member checkboxes**
- [ ] **Step 3: Add daily coding challenge card showing target file (e.g. `01-io.cpp`)**
- [ ] **Step 4: Integrate confetti trigger when all members complete a day's quest**
- [ ] **Step 5: Commit**

```bash
git add web/src/components/DailyRoadmap.jsx web/src/App.jsx
git commit -m "feat: add 20-day DailyRoadmap and interactive quest tracker"
```

---

### Task 8: Full Video Catalog & Code Inspector Modal

**Files:**
- Create: `web/src/components/VideoCatalog.jsx`
- Create: `web/src/components/CodeModal.jsx`

**Interfaces:**
- Consumes: `ALL_PLAYLIST_VIDEOS`, `TeamState`, `github.js`
- Produces:
  - Searchable full-catalog browser for both CEDT playlists.
  - In-app C++ code viewer modal for files committed in `FAN/`, `GUY/`, `HAN/`.

- [ ] **Step 1: Implement `VideoCatalog.jsx` with search filter and watched toggles**
- [ ] **Step 2: Implement `CodeModal.jsx` with syntax highlighting and copy button**
- [ ] **Step 3: Hook up code click handler from Battle Board / file badges to open modal**
- [ ] **Step 4: Verify build succeeds**
- [ ] **Step 5: Commit**

```bash
git add web/src/components/VideoCatalog.jsx web/src/components/CodeModal.jsx web/src/App.jsx
git commit -m "feat: add VideoCatalog browser and CodeModal inspector"
```

---

### Task 9: Settings Modal, GitHub Pages Config & End-to-End Build Verification

**Files:**
- Create: `web/src/components/SettingsModal.jsx`
- Modify: `web/vite.config.js` (ensure relative base path for GitHub Pages)
- Create: `.github/workflows/deploy.yml` (GitHub Pages auto-deploy workflow)
- Modify: `README.md` (add C-Learn Tracker instructions and links)

- [ ] **Step 1: Implement `SettingsModal.jsx` for Discord Webhook and Firebase configuration**
- [ ] **Step 2: Add Discord "Send Today's Report Now" button in UI**
- [ ] **Step 3: Configure GitHub Pages deployment workflow in `.github/workflows/deploy.yml`**
- [ ] **Step 4: Run full production build (`npm run build` in `web/`) and verify zero errors**
- [ ] **Step 5: Commit and update README**

```bash
git add .
git commit -m "feat: complete C-Learn training tracker with settings and deployment setup"
```
