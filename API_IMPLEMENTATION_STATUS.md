# ClayMaster API — Module Implementation Status

Sources: `20260716130831_0-ClayMaster_API_Documentation_v2.docx`, `api-forum-online-coaching Apis.docx`  
App base: `https://claymaster.net/api/` (`src/api/endpoints.js`)  
Request/response samples (module-wise): [`API_REQUEST_RESPONSE.md`](./API_REQUEST_RESPONSE.md) → `docs/api/request-response/`

## Status legend

| Status | Meaning |
|--------|---------|
| ✅ Live | Wired in app; calls backend |
| 🟡 Stubbed | Service exists; `AUTH_APIS_DISABLED` / endpoint commented |
| ❌ Not implemented | No service; UI uses dummy/local data |
| ⚠️ Gap | App uses it but missing from docs, or docs incomplete |

---

## Global HTTP status codes

Applies across Laravel/Sanctum unless an endpoint notes otherwise.

| Code | Meaning | Typical body |
|------|---------|--------------|
| **200** | OK (GET / update / delete) | Varies |
| **201** | Created (register, create round, forum, review) | New resource |
| **400** | Bad request (ownership, wrong password, duplicate report) | `{ "message": "..." }` or `{ "status": false, "message": "..." }` |
| **401** | Missing / invalid / expired Bearer | `{ "message": "Unauthenticated." }` *(some profile routes use a custom message — see Auth/Profile)* |
| **403** | Forbidden (no active subscription / not owner) | Message varies |
| **404** | Route or model not found | `{ "message": "Not Found" }` or model query message |
| **405** | Wrong HTTP method | Supported methods listed |
| **422** | Validation failed | `{ "message": "The given data was invalid.", "errors": { "field": ["..."] } }` |
| **500** | Uncaught server error | `{ "message": "Server Error" }` *(if `APP_DEBUG=true`, full stack may leak)* |

**Common headers**

```http
Authorization: Bearer {{token}}
Accept: application/json
Content-Type: application/json
```

Multipart: `edit-profile`, forum reply attachment → `multipart/form-data`.

---

## Summary

| Module | Status |
|--------|--------|
| Auth | ✅ Live |
| Profile / Account | ✅ Live |
| Subscription / Packages / Stripe | ✅ Live |
| Rounds & Stations | ✅ Mostly live |
| Notifications | ❌ Not implemented |
| Academy / Library | ❌ Not implemented |
| Tournament | ❌ Not implemented |
| Reviews | ❌ Not implemented |
| Shop / Cart / Orders | ❌ Not implemented |
| Forum / Community | ❌ Not implemented |
| Online Coaching / Sessions | ❌ Not implemented |

---

## 1. Auth

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `POST` | `/api/login` | Public | ✅ Live |
| `POST` | `/api/register` | Public | ✅ Live |
| `POST` | `/api/verify/otp` | Public | ✅ Live |
| `POST` | `/api/resend/otp` | Public | ✅ Live · ⚠️ Thin doc samples |
| `POST` | `/api/forgot/password` | Public | ✅ Live · ⚠️ Thin doc samples |
| `POST` | `/api/resend/forgot/password/otp` | Public | ✅ Live · ⚠️ Thin doc samples |
| `POST` | `/api/verify/otp/password` | Public | ✅ Live · ⚠️ Thin doc samples |
| `GET` | `/api/logout` | Bearer | ✅ Live · ⚠️ Thin doc samples |
| `GET` | `/api/profile` | Bearer | ✅ Live |

### Errors

| Endpoint | Code | Notes |
|----------|------|--------|
| Login | `422` / `401` | ⏳ Validation not confirmed — likely email+password required; wrong credentials shape TBD |
| Register | `201` success | OTP flow after register |
| Verify OTP | — | No saved Postman response example |
| Profile | `401` | `{ "status": false, "message": "You must be logged in to delete your account." }` |

### Dev notes

- Profile/updatePassword/deleteUser may reuse a **“delete your account”** 401 message (backend copy-paste).
- App sends `device_token` on login when FCM is available.
- After login/register token is stored, app calls `GET /api/profile` to hydrate full user (incl. `email_verified_at`).
- Splash restores session via `GET /api/profile` when a token exists; falls back to credential re-login.
- `AUTH_APIS_DISABLED` in `src/constants/index.js` is **false** (live auth).

---

## 2. Profile / Account

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `POST` | `/api/edit-profile` | Bearer · multipart | ✅ Live |
| `POST` | `/api/user/update-password` | Bearer | ✅ Live |
| `GET` | `/api/delete/user` | Bearer | ✅ Live |

### Validation (422) — Edit profile ✅ CONFIRMED

| Field | Rules |
|-------|--------|
| `first_name` | required, string, max:25 |
| `last_name` | required, string, max:25 |
| `contact` | nullable (no type/format check) |
| `address` | nullable, string, max:25 |
| `profile_image` | nullable, image, mimes:jpeg,png,jpg,gif, max:2048 (2MB) |
| `username` | ⚠️ **no validation** — any value or omission accepted |

422 shape: `{ "status": false, "message": "<first error only>", "errors": { "first_name": ["..."] } }`

### Validation (422) — Change password ✅ CONFIRMED

| Field | Rules |
|-------|--------|
| `current_password` | required |
| `password` | required, string, min:8, `different:current_password`, confirmed |

Custom messages: min → stronger password (8+); confirmed → does not match; different → must differ from current.

### Errors

| Endpoint | Code | Body / notes |
|----------|------|----------------|
| Edit / password / delete | `401` | Same “delete your account” message bug |
| Edit profile | `422` | Missing names, address > 25, bad/oversized image |
| Change password | `422` | Missing fields, weak password, confirmation mismatch |
| Change password | `400` | Wrong current password: `{ "status": false, "message": "Incorrect current password." }` — ⚠️ **400 not 422** |
| Delete account | `401` only | No body validation |

### Dev notes

- Send field **`address`** (not `address_1`); response may map from DB `address_1`.
- Delete is a **GET that mutates**: sets `is_active = 0` (soft), revokes all Sanctum tokens — row not hard-deleted.
- Separate backend route `DELETE /account/delete` may also exist — confirm which the app should use (current app uses `GET /api/delete/user`).

---

## 3. Subscription / Packages / Stripe

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/packages` | Bearer | ✅ Live |
| `GET` | `/api/discounts` | Public | ✅ Live |
| `POST` | `/api/stripe/setup-intent` | Bearer | ✅ Live |
| `POST` | `/api/stripe/subscribe` | Bearer | ✅ Live |
| `GET` | `/api/subscription-enabled` | — | ✅ Live · ⚠️ Not in shared docs |

### Errors

| Endpoint | Code | Notes |
|----------|------|--------|
| Packages | `401` | `{ "message": "Unauthenticated." }` |
| Packages | `500` | DB failure — no try/catch in controller |
| Discounts | `500` | `getConfig()` crash |
| Subscribe | `422` | ⏳ Rules not confirmed (source not shared) |

### Dev notes

- Packages returns a **raw array** — not `{ status, data }`.
- Package `description` has bracketed numbers like `(1)` stripped via regex before send.
- Discounts: null config entries are **skipped** (can return empty `data[]` with `status: true`); no auth required.
- Setup-intent returns bare `{ client_secret }` (no status wrapper).
- Subscribe success uses `{ success: true, ... }` (not always `status`).

---

## 4. Rounds & Stations

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/rounds` | Bearer | ✅ Live |
| `GET` | `/api/rounds/{id}` | Bearer | ✅ Live |
| `POST` | `/api/rounds` | Bearer | ✅ Live |
| `POST` | `/api/rounds/{id}/complete` | Bearer | ❌ Not implemented |
| `POST` | `/api/rounds/{id}/save` | Bearer | ❌ Not implemented |
| `POST` | `/api/rounds/{id}/send-to-claymaster` | Bearer | ✅ Live |
| `GET` | `/api/courses` | Bearer | ✅ Live |
| `GET` | `/api/classes` | Bearer | ✅ Live · ⚠️ Not in shared docs |
| `GET` | `/api/trap-presentations` | Bearer | ✅ Live |
| `POST` | `/api/rounds/{round_id}/stations` | Bearer | ✅ Live |
| `GET` | `/api/rounds/{round_id}/stations` | Bearer | ❌ Not implemented |

### Validation (422) — Stations ✅ CONFIRMED (`StationUpsertRequest`)

Per array item (`*`):

| Field | Rules |
|-------|--------|
| `station_id` | nullable, integer, exists:stations,id |
| `station_number` | required, integer, between:1–99 |
| `pair_type` | required, `in:true_pair,report_pair,single` |
| `traps` | required, array, **size:2** |
| `traps.*.trap_id` | required, integer, `in:1,2` |
| `traps.*.presentation` | nullable |
| `shots` | nullable, array, max:10 |
| `shots.*.sequence` | required, integer, between:1–10 |
| `shots.*.result` | required, `in:dead,lost,empty` |

**Extra only if `round.european_rotation === true`:**

1. Submitted station count must equal `round.total_stations` → `errors.stations`
2. Count of shots with result `dead`/`lost` must be exactly **100**  
   - `> 100` → `errors.shots: ["Start new scorecard"]`  
   - `< 100` → `errors.shots: ["Round must have exactly 100 shots. Currently: X"]`  
   Non-European rounds skip both checks.

Create round `422`: ⏳ not confirmed (controller source not shared).

### Errors

| Case | Code | Body |
|------|------|------|
| Round owned by another user (stations) | `400` | `{ "message": "Not allowed to access this round." }` |
| Stations field validation | `422` | Standard `{ message, errors }` (keys like `0.pair_type`) |
| European station/shot rules | `422` | Same FormRequest shape |
| No / expired token | `401` | `{ "message": "Unauthenticated." }` |
| Send-to-ClayMaster | — | No saved Postman response |

### Dev notes

- Docs label some round helpers “not used in mobile” — **app already uses** courses, traps, round detail, send-to-claymaster.
- Create-round field-mode note (backend): station start / pair-of-target (TP/RP) still evolving — watch payload drift.
- List rounds / courses / traps often return **raw arrays**.

---

## 5. Notifications

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/notifications` | Bearer | ❌ Not implemented |
| `GET` | `/api/notifications/counts` | Bearer | ❌ Not implemented |
| `POST` | `/api/notifications/{id}/read` | Bearer | ❌ Not implemented |
| `POST` | `/api/notifications/read-all` | Bearer | ❌ Not implemented |
| `DELETE` | `/api/notifications/{id}` | Bearer | ❌ Not implemented |

### Query (list)

`unread_only` (0/1, default 0) · `page` (default 1) · `per_page` (default 20, max 50)

### Errors

| Endpoint | Code | Notes |
|----------|------|--------|
| All | `401` | Unauthenticated |
| Counts | — | No try/catch; DB fail → `500` |
| Mark read | `404` | Wrong / other user’s id → model not found message |
| Mark all read | `200` always | `{ status: true }` even if 0 unread |
| Delete | `200` + `status: false` | ⚠️ **Does not 404** on bad id — client must check `status` |
| Delete | `401` | Unauthenticated |

### Dev notes

- Types include `AdminBroadcastNotification`, `RoundActionNotification` (`admin_uploaded`, etc.).
- Replace app dummy `constants/notifications.js` when wiring → prefer new `notificationService.js`.

---

## 6. Academy / Library

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/tutorial-videos/` | Bearer | ❌ Not implemented |
| `GET` | `/api/tutorial-videos/{id}` | Bearer | ❌ Not implemented |
| `GET` | `/api/workbooks` | Bearer | ❌ Not implemented |
| `GET` | `/api/workbooks/{id}` | Bearer | ❌ Not implemented |
| `GET` | `/api/instructional-videos` | Bearer | ❌ Not implemented |
| `GET` | `/api/instructional-videos/{id}` | Bearer | ❌ Not implemented |
| `GET` | `/api/additional-videos` | Bearer | ❌ Not implemented |
| `GET` | `/api/additional-videos/{id}` | Bearer | ❌ Not implemented |
| `GET` | `/api/additional-videos/categories` | Bearer | ❌ Not implemented |
| `GET` | `/api/practice-drills` | Bearer | ❌ Not implemented |
| `GET` | `/api/practice-drills/{id}` | Bearer | ❌ Not implemented |
| `GET` | `/api/monthly-webcasts` | Bearer | ❌ Not implemented |
| `GET` | `/api/monthly-webcasts/{id}` | Bearer | ❌ Not implemented |
| `GET` | `/api/manual-deliveries` | Bearer | ❌ Not implemented |
| `GET` | `/api/manual-deliveries/{id}` | Bearer | ❌ Not implemented |

### Errors (typical for this group)

| Code | Notes |
|------|--------|
| `401` | Unauthenticated |
| `500` | DB failure |
| Bad `page`/`per_page` | **No error** — silently cast; request still succeeds |

### Dev notes

- Package gating via `can_access` / null `video_url` or `file_url` — handle locked content in UI.
- ⚠️ Monthly webcasts **list** URL was mis-pasted in docs as `practice-drills/33`; use `/api/monthly-webcasts`.
- Envelope usually `{ status, message, data }`; manuals list nests `data.documents[]`.

---

## 7. Tournament

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `POST` | `/api/tournament/submit` | Bearer | ❌ Not implemented |
| `GET` | `/api/tournament/leaderboard` | Bearer | ❌ Not implemented |

### Query (leaderboard)

`year`, `month`, `mine=0|1`

### Errors

| Code | Notes |
|------|--------|
| `401` | Unauthenticated |
| `500` | DB failure (list-style endpoints) |

### Dev notes

- Submit entries appear on leaderboard (`total_adj_score = event_score + adj_factor`).

---

## 8. Reviews

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/reviews` | Bearer | ❌ Not implemented |
| `POST` | `/api/reviews` | Bearer | ❌ Not implemented |

### Errors (submit)

| Code | Body / notes |
|------|----------------|
| `201` | Success |
| `403` | `{ "status": false, "message": "You don't have any active subscription, Please Subscribe first." }` |
| `422` | e.g. `{ "errors": { "rating": ["The rating field is required."] } }` |
| `401` | Unauthenticated |

### Dev notes

- Requires active subscription to submit.
- List supports `page`, `per_page`.

---

## 9. Shop / Cart / Orders

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/shop/products` | Bearer | ❌ Not implemented |
| `GET` | `/api/shop/products/{id}` | Bearer | ❌ Not implemented |
| `POST` | `/api/cart/add` | Bearer | ❌ Not implemented |
| `GET` | `/api/cart` | Bearer | ❌ Not implemented |
| `POST` | `/api/cart/update` | Bearer | ❌ Not implemented |
| `DELETE` | `/api/cart/{variant_id}` | Bearer | ❌ Not implemented |
| `POST` | `/api/checkout/place-order` | Bearer | ❌ Not implemented |
| `GET` | `/api/orders` | Bearer | ❌ Not implemented |
| `GET` | `/api/orders/{id}` | Bearer | ❌ Not implemented |

### Errors

| Code | Notes |
|------|--------|
| `401` | Unauthenticated |
| `500` | Possible on product list DB fail |
| Checkout / cart validation | Confirm `422` shapes live (limited in docs) |

### Dev notes

- Cart prices often in **cents** (`2500` = $25); cart summary / orders may use dollar numbers/strings — normalize in UI.
- Checkout success uses `status: "success"` (**string**), not boolean.
- Docs cart delete URL has typo `//api` — use `/api/cart/{variant_id}`.
- Replace `shopProducts.js` + migrate Redux `cartSlice` to server cart when wiring.

---

## 10. Forum / Community

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/forum-categories` | Bearer | ❌ Not implemented |
| `GET` | `/api/forums` | Bearer | ❌ Not implemented |
| `GET` | `/api/forums/{slug}` | Bearer | ❌ Not implemented |
| `POST` | `/api/forums` | Bearer | ❌ Not implemented |
| `POST` | `/api/forums/{id}/update` | Bearer | ❌ Not implemented |
| `DELETE` | `/api/forums/{id}` | Bearer | ❌ Not implemented |
| `POST` | `/api/forums/{slug}/replies` | Bearer · multipart | ❌ Not implemented |
| `POST` | `/api/forum-replies/{id}/helpful` | Bearer | ❌ Not implemented |
| `DELETE` | `/api/forum-replies/{id}` | Bearer | ❌ Not implemented |
| `POST` | `/api/forum-replies/{id}/best-answer` | Bearer | ❌ Not implemented |
| `POST` | `/api/forums/{id}/report` | Bearer | ❌ Not implemented |
| `POST` | `/api/forum-replies/{id}/report` | Bearer | ❌ Not implemented |
| `POST` | `/api/forums/{id}/poll/vote` | Bearer | ❌ Not implemented |
| `GET` | `/api/forums/{id}/poll` | Bearer | ❌ Not implemented |

### Errors

| Code | Cause |
|------|--------|
| `400` | Same user already reported topic/reply |
| `401` | Missing / expired token |
| `403` | No active subscription (list/create) or insufficient ownership/role |
| `404` | Forum / reply / poll missing |
| `422` | Missing fields, invalid IDs, file type/size, &lt; 2 poll options |
| `500` | Persistence / filesystem error |

List/create topic: need `package_id` + `subscription_status = active` or **403**.  
Replies / reactions / reports / polls: auth only (subscription check not applied the same way — per forum doc observations).

### Dev notes

- All forum routes behind `auth:sanctum` + `force.json`.
- Attachments: **2 MB**; `jpg, jpeg, png, pdf, doc, docx`.
- Update is **`POST /forums/{id}/update`** (not PUT), even if comments mention `_method=PUT`.
- Delete topic: **owner-only** (admin bypass not implemented for delete).
- Optional `X-Device-Id` on detail for unique view tracking.
- List query: `sort`, `alpha`, `category`, `per_page` (1–50), `page`.
- DB validation may reference `forum_category,id` (singular table) — confirm schema if create fails oddly.
- Postman order: Login → Categories → Create → Detail → Reply → helpful/report/poll → Delete last.

---

## 11. Online Coaching / Sessions

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| `GET` | `/api/coaches` | Bearer | ❌ Not implemented |
| `GET` | `/api/sessions` | Bearer | ❌ Not implemented |
| `GET` | `/api/sessions/purchase-info` | Bearer | ❌ Not implemented |
| `POST` | `/api/sessions/purchase` | Bearer | ❌ Not implemented |

### Errors

Doc lists expected HTTP as `201 / 403 / 422` for several of these (including GETs) — treat as noisy; confirm live:

| Likely | Notes |
|--------|--------|
| `401` | Unauthenticated |
| `403` | Package / booking limit |
| `422` | Purchase validation (`bundle_type`, `payment_method_id`) |
| Success purchase | `{ success: true, message, data: { sessions_added, remaining_sessions, amount_charged } }` |

### Dev notes

- Coaches return Calendly `booking_url`s — open in browser/WebView.
- Sessions include Zoom `join_url` (nullable) + usage `summary`.
- Purchase: `bundle_type` = `single` | `bundle` + Stripe `payment_method_id`.
- Replace local `bookingData.js` when wiring → `coachingService.js`.

---

## App wiring conventions

| Layer | Location |
|--------|----------|
| Paths | `src/api/endpoints.js` |
| Axios + Bearer | `src/api/api.js` |
| Services | `src/api/*Service.js` |
| Hooks | `useCustomQuery` / `useCustomMutation` |
| 422 → form fields | `formatBackendErrors` |

Always check **body `status` / `success`** where HTTP is always 200 (notification delete, mark-all-read).

---

## Doc / app mismatches

| Item | Detail |
|------|--------|
| Base URL | App: `claymaster.net` · Forum Postman sample: `claymaster.net/beta` |
| Password/OTP/logout | In app stubs; thin or missing in v2 doc |
| `GET /profile` | Documented; not wired |
| Courses / traps / send / round detail | Docs say “not used in mobile”; app uses them |
| Monthly webcast list | Doc URL typo |
| Cart delete | Doc `//api` typo |
| Packages / rounds lists | Raw arrays — don’t assume `{ status, data }` |
| Profile 401 message | Wrong copy (“delete your account”) |
| Change password wrong current | `400` not `422` |

---

*Update status columns as endpoints are wired. Full request/response JSON lives in `docs/api/request-response/` (index: `API_REQUEST_RESPONSE.md`).*
