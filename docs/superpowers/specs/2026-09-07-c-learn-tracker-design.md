# Design Spec: C-Learn Team Training Tracker (Road to Day 27)

## Overview
**C-Learn Tracker** is a team-oriented web dashboard built for a 3-person competitive programming team (`GUY`, `FAN`, `HAN`) preparing for a C++ programming contest on the 27th. The goal is to enforce daily training discipline, track video lesson completion from two key Chulalongkorn CEDT playlists (Computer Programming & Data Structures), monitor GitHub code submissions across individual folders (`FAN/`, `GUY/`, `HAN/`), and provide real-time peer accountability with daily streaks and Discord webhook reports.

---

## 1. Target Audience & Core Roles
- **GUY (Project Lead / User):** Captain of the team; can customize daily roadmaps, configure webhooks, and track all members.
- **FAN & HAN (Teammates):** Team members who open the site on desktop or mobile, check off daily video tasks, push C++ solutions into their respective folders (`FAN/`, `HAN/`), and maintain daily streaks.

---

## 2. Curriculum & Daily Roadmap (20-Day Plan to Day 27)
The curriculum is grounded in two YouTube playlists:
1. **CEDT: Computer Programming (30 Videos)** - `PLW3DcQsnGanN_7ye_Yfd_t6yQIAcWVu71` (Ajarn Nattee Niparnan)
2. **CEDT: Data Structure and Algorithm (132 Videos)** - `PLW3DcQsnGanMXbpGjdCDbcj9kUgfc59PN` (Ajarn Nattee Niparnan)

### Phase 1: C++ Foundations Drill (Days 1–8)
- **Day 1–2:** C++ Syntax, Variables, Data Types, Fast I/O (`cin`, `cout`, `\n`), Basic Math & I/O Problems. Target: write `01-io.cpp`.
- **Day 3–4:** Conditionals (`if-else`, ternary, `switch`) & Loops (`for`, `while`, nested loops, patterns). Target: write `02-loops.cpp`.
- **Day 5–6:** 1D & 2D Arrays, Strings, Vector basics, Functions, Scope, Pass-by-value vs. Pass-by-reference. Target: write `03-functions-arrays.cpp`.
- **Day 7–8:** Pointers, References, Dynamic Memory (`new`/`delete`), Structs & Classes basics. Target: write `04-pointers-structs.cpp`.

### Phase 2: C++ STL & Core Data Structures (Days 9–15)
- **Day 9–10:** STL Vector, Pair, Tuple, Iterators, `std::sort`, Custom Comparators. Target: write `05-stl-sort.cpp`.
- **Day 11–12:** Stack (`std::stack`), Queue (`std::queue`), Deque (`std::deque`), Priority Queue (`std::priority_queue`). Target: write `06-stacks-queues.cpp`.
- **Day 13–14:** Hash Tables & Trees: `std::set`, `std::map`, `std::unordered_set`, `std::unordered_map`. Target: write `07-sets-maps.cpp`.
- **Day 15:** Binary Search (`std::lower_bound`, `std::upper_bound`), Two Pointers technique. Target: write `08-binary-search.cpp`.

### Phase 3: Algorithms & Competition Simulations (Days 16–20)
- **Day 16–17:** Recursion, Divide & Conquer, Basic Greedy Strategy. Target: write `09-recursion-greedy.cpp`.
- **Day 18–19:** Graph Representations (Adjacency List), BFS & DFS traversals. Target: write `10-graphs.cpp`.
- **Day 20 (Eve of Contest):** Mock Contest / Speed Run drill & final review.

---

## 3. Architecture & Tech Stack
- **Frontend Framework:** React 18 + Vite (fast build, small bundle).
- **Styling:** Tailwind CSS (Modern Dark Mode / Cyberpunk Hacker aesthetic).
- **Icons:** Lucide React (`Flame`, `Trophy`, `CheckCircle2`, `Clock`, `Github`, `Send`, `Calendar`, etc.).
- **Live Sync & Storage:**
  - **Firebase Realtime Database (Free tier):** Stores live checklist progress, streak counts, last active timestamp, and webhook settings.
  - **LocalStorage Fallback:** Full zero-config functionality out of the box even before Firebase is connected.
- **GitHub Live API:**
  - Connects to public repo `SOGUY144/C-Learn`.
  - Queries GitHub REST API:
    - `/repos/SOGUY144/C-Learn/contents/{MEMBER}` to count and list C++ code files.
    - `/repos/SOGUY144/C-Learn/commits?path={MEMBER}` to display latest push timestamp and commit message.
  - Integrated syntax-highlighted C++ code viewer modal.
- **Discord Webhook Engine:**
  - Formats rich Discord Embeds containing team summary, streaks, today's submission statuses, and motivational peer accountability alerts.
  - Triggerable with one click or auto-prompted upon daily quest completion.

---

## 4. UI Components Specification
1. **Header & Countdown Banner:**
   - App title, target date display (September 27), and live ticking countdown clock (Days, Hours, Minutes, Seconds).
   - Global Team Readiness gauge (% of completed syllabus).
2. **Team Battle Board (Hero Section):**
   - 3 Member Cards (`GUY`, `FAN`, `HAN`).
   - Active Streak badge (`🔥 X Days`), Today's Status Badge (`✅ Done`, `⏳ In Progress`, `⚠️ Missing`).
   - Latest Git commit info & link to inspect pushed code.
3. **Daily Roadmap & Quest View:**
   - Horizontal date picker or tabs (Day 1 through Day 20).
   - Detailed task list:
     - 🎯 Daily objective.
     - 📺 Assigned YouTube video links with direct watch button and status checkboxes for all 3 members.
     - 💻 Target C++ file challenge.
     - 👥 Multi-member check-in grid (real-time sync).
4. **All Videos Directory (Full Curriculum Checklist):**
   - Tab to browse all 30 videos from Programming playlist and essential videos from Data Structures playlist.
   - Filter by watched/unwatched and by member.
5. **Code Inspector Modal:**
   - Allows team members to click on any member's committed `.cpp` files to view the source code directly in the dashboard.
6. **Settings & Webhook Modal:**
   - Inputs for Firebase Config (optional for multi-device live sync) and Discord Webhook URL.
   - Button to trigger test Discord notification.

---

## 5. Deployment Plan
- Root folder keeps existing C++ workspace: `FAN/`, `GUY/`, `HAN/`.
- Web application lives in `web/`.
- Vite configured with `base: './'` for seamless deployment to **GitHub Pages** (`https://soguy144.github.io/C-Learn/`) or Vercel.
