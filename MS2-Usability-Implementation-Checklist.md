# MS2 Subscriber Usability — Implementation Checklist

Source: **MS2 Initial Subscriber Usability Review 081126**  
Status: Priority A scorecard + Managed Services home/description done — awaiting your review  

Legend: `[ ]` pending · `[x]` done · `[~]` partial · `[-]` deferred · **Backend** = not app-only (see backend doc)

Backend list: `MS2-Backend-Server-Change-Request.md`  
Offline scope note: `MS2-PM-Shane-Scope-Notes.md`

---

## Backend (not app implementation)

Tracked for backend / content. Do not treat as mobile coding tasks until backend is ready (then wire UI only).

- [ ] **Backend** Video playback — fix buffering / smooth play on weak networks
- [ ] **Backend** Field Mode saved videos — real offline download *(out of current milestone — Shane)*
- [ ] **Backend** Managed Services Analytics — request flow + attach scorecard + consume sessions
- [ ] **Backend** On-line Coaching — upcoming session after book + decrement session count
- [ ] **Backend** Practice drills Classic (9) vs Pro (13) gating
- [ ] **Backend** Additional Videos portal-style sub-categories
- [ ] **Backend** Instructional Videos thumbnails + content groups (incl. Tournament Prep Pro)
- [ ] **Backend** Notifications — how bell items are created / sent
- [ ] **Backend** About Us — sync team content with website
- [ ] **Backend** Community create post — reliable create or clear API error

---

## App — Priority A

### A2. Field Mode — Digital Scorecard
- [x] Squad size order: **1 → 6** (not 6 → 1) — confirmed `createRoundDropData`; fixed default size label/value
- [x] Differentiate Hit vs Miss colors more (green hit / red miss)
- [x] Station subtotal denominator = full station target count (e.g. `1/8` not `1/2`)
- [x] Progress label: **“Station 3 of 16”** (not `3/16`)
- [x] Rename live score label to **“Current Score”**
- [x] Remove **Percent Accuracy** (Field + Library scorecard summaries)
- [x] Show target types next to each station (e.g. TP · Crosser / Rabbit)
- [x] Reword submit copy to shooter language  
  *“Save this round (it will be available for Analytics and other uses)?”*

### A3. Managed Services — app UI (after Backend APIs)
- [x] Surface Managed Services on Full Library home (Portal grid)
- [x] Add short 1–3 sentence description of what Managed Services is
- [ ] Wire confirm / request Analytics UI when backend endpoints exist
- [ ] Wire attach / send latest scorecard when backend supports it

---

## App — Priority B

### B1. Auth / Profile / Modes
- [ ] Add brief onboarding / orientation (1-page overview)
- [ ] Fix mode highlight inconsistency (header vs orange mode button)
- [ ] Make keyboard lock delay user-configurable (e.g. 20s / 60s)
- [ ] Address or document display sleep / conserve-mode behavior
- [ ] Remove **Community** from Profile; place with other services
- [ ] Clarify / rename “Switch to On the Course vs Field Mode” on Profile
- [ ] Remove reply-time promise from Help & Support (no SLA yet)
- [ ] About Us screen — update when backend/content synced (or hardcode if PM agrees)

### B2. Training Library structure (app)
- [ ] Field Mode: remove **Monthly Webcasts** (Full Library only)
- [ ] Field Mode: move **Video Tutorials** to Full Library only
- [ ] Rename **Training Videos → Instructional Videos**
- [ ] Instructional Videos 2nd screen: thumbnails UI (needs backend thumbnails)
- [ ] Structure Instructional Videos groups in UI (needs backend type/group data)
- [ ] Additional Videos sub-category UI (needs backend categories)
- [ ] Verify drills gating in UI once Classic/Pro backend is correct
- [ ] Optional: thumbnails for Practice Drills
- [ ] Show Documents on Core Training / Portal screens (not only menu)
- [ ] Decide & implement Miss content home (Miss Categories / Additional Documents)

### B3. On-line Coaching (app)
- [ ] Use naming **“On-line Coaching”** (match portal)
- [ ] Simplify Core Training vs Portal split / navigation
- [ ] Book Session: focus on booking; show “buy more” only when sessions low (&lt;3)
- [ ] Refresh Upcoming / counter after book (needs backend sync)
- [ ] Reduce Book Session init delay where app-controlled

### B4. Private Community (app)
- [ ] Portal section order (prefer alphabetical / intentional)
- [ ] Show clear error if create-post fails (needs backend fix / errors)

### B5. Virtual Tournament (app)
- [ ] Portal item order (alphabetic / intentional)
- [ ] Clarify or remove Field Mode option on Leaderboard
- [ ] Reconsider footer VT tab; explore customizable footer

---

## App — Priority C

- [ ] Keyword / target-presentation search filter for videos (maybe later)
- [ ] Customizable bottom footer for popular features
- [ ] Final placement for Miss Diagnostic / Profile / Performance Packs / Miss Videos

---

## Suggested app batches (when approved)

| Batch | Scope | Notes |
|-------|--------|--------|
| **1** | A2 Scorecard UX | App-only |
| **2** | B2 Field Mode library filtering + renames | App-only filters/labels |
| **3** | B1 Profile / modes / help | App-only |
| **4** | B3 + A3 Coaching & Managed Services UI | After backend where marked |
| **5** | B4 + B5 Community & VT | App + backend create-post |
| **—** | Video performance / offline | **Backend** (+ Shane on offline) |

---

## Notes
- Do **not** start until explicit **yes**.
- **Backend** items live in detail in `MS2-Backend-Server-Change-Request.md`.
