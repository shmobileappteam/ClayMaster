# ClayMaster API — Request & Response (Module-wise)

Companion to [`API_IMPLEMENTATION_STATUS.md`](./API_IMPLEMENTATION_STATUS.md) (status, error codes, validation, dev notes).

Sources: `20260716130831_0-ClayMaster_API_Documentation_v2.docx`, `api-forum-online-coaching Apis.docx`

**Base URL:** `{{base_url}}/api/` (app: `https://claymaster.net/api/` · forum doc sample may use `/beta`)

**Auth header (when required):**

```http
Authorization: Bearer {{token}}
Accept: application/json
Content-Type: application/json
```

## Global HTTP status codes

| Code | Meaning | Typical body |
|------|---------|--------------|
| **200** | Success | Varies |
| **201** | Created | New resource |
| **400** | Bad request | e.g. already reported |
| **401** | Unauthenticated | `{ "message": "Unauthenticated." }` |
| **403** | Forbidden | No subscription / not owner |
| **404** | Not found | Route or model missing |
| **405** | Method not allowed | Wrong verb |
| **422** | Validation failed | `{ "message": "...", "errors": { "field": ["..."] } }` |
| **500** | Server error | `{ "message": "Server Error" }` |

---

## Modules

| # | Module | File |
|---|--------|------|
| 1 | Auth | [01-auth.md](./docs/api/request-response/01-auth.md) |
| 2 | Profile / Account | [02-profile.md](./docs/api/request-response/02-profile.md) |
| 3 | Subscription / Packages / Stripe | [03-subscription.md](./docs/api/request-response/03-subscription.md) |
| 4 | Rounds & Stations | [04-rounds-stations.md](./docs/api/request-response/04-rounds-stations.md) |
| 5 | Notifications | [05-notifications.md](./docs/api/request-response/05-notifications.md) |
| 6 | Academy / Library | [06-academy-library.md](./docs/api/request-response/06-academy-library.md) |
| 7 | Tournament | [07-tournament.md](./docs/api/request-response/07-tournament.md) |
| 8 | Reviews | [08-reviews.md](./docs/api/request-response/08-reviews.md) |
| 9 | Shop / Cart / Orders | [09-shop-cart-orders.md](./docs/api/request-response/09-shop-cart-orders.md) |
| 10 | Forum / Community | [10-forum-community.md](./docs/api/request-response/10-forum-community.md) |
| 11 | Online Coaching / Sessions | [11-online-coaching.md](./docs/api/request-response/11-online-coaching.md) |

Open a module file for that domain’s endpoints with **Request** and **Response** samples.
