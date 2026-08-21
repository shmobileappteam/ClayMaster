# ClayMaster MS2 — Backend Change Request

**To:** Backend team  
**From:** Mobile team  
**Source:** Client usability review — *MS2 Initial Subscriber Usability Review 081126*  

The client reported the issues below. From our side, these look like they need **backend / server / CMS / content** changes. The app can only show or play what the API returns — we cannot fully fix these in the app alone.

Please review and confirm what you can change, and roughly when.

---

## Please fix

### 1. Video playback (client blocker)
Client says videos buffer and stall (example: Chandelle), including on weak / rural internet.  
**Ask:** Improve hosting / streaming so HD videos play smoothly (e.g. CDN + adaptive stream). The app only plays the `video_url` you return.

### 2. Field Mode saved videos (offline)
Client wants “Save for Field Mode” to work **offline on the course**.  
**Today:** App only saves the link — still needs internet to play.  
**Ask:** Provide a real downloadable video file (not only a stream link).  
**Note for PM:** Offline was not in the current milestone — confirm scope with Shane before building.

### 3. Managed Services — Analytics
Client wants to **request analytics** and attach their scorecard — not only buy sessions.  
**Ask:** API support for request analytics + attach scorecard + correctly use/consume sessions.

### 4. On-line Coaching after booking
Client books a session, but Upcoming may not update and remaining count may not drop.  
**Ask:** After booking (e.g. Calendly), sync into our API so Upcoming shows the session and remaining sessions decrease.

### 5. Practice drills — Classic vs Pro
Client expects Classic = 9 drills, Pro = 13, with correct access.  
**Ask:** Enforce plan gating in the API (`can_access` / package rules) so the app can lock/unlock correctly.

### 6. Additional Videos — categories
Client wants portal-style categories / sub-categories to find content.  
**Ask:** Return category + subcategory (or same structure as the website portal) on Additional Videos.

### 7. Instructional Videos — thumbnails & groups
Client expects thumbnails and clear groups (Target Presentations, ClayMaster Vision, Tournament Prep Pro).  
**Ask:** Provide thumbnail URLs and group/category fields in the API/CMS.

### 8. Notifications (bell)
Client is unclear how notification bell items are created / sent.  
**Ask:** Confirm and support how notifications are created for the in-app bell (and push only if that is in scope).

### 9. About Us
Client says About Us is out of date vs the website (include Bill McGuire, etc.).  
**Ask:** Keep team/About content in sync with the website (CMS/API preferred so app and site stay aligned).

### 10. Private Community — create post
Client says creating a post fails / hangs with no clear error.  
**Ask:** Make create-post work for valid users, or always return a clear error message the app can show.

---
