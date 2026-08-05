> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 12. Managed Service Session Purchase

Source: `Managed Service Session Purchase.docx`

Classic / Pro subscribers purchase **additional managed-service sessions** via Stripe **PaymentIntent + PaymentSheet**, then the app verifies the PaymentIntent with the backend.

This is **not** the same flow as Online Coaching (`/api/sessions/*`), which uses SetupIntent → `payment_method` → `sessions/purchase`.

**Never** send raw card data or the Stripe secret key to the Laravel API.  
**Never** use the deprecated `POST /api/managed-services/purchase` with `payment_method_id`.

---

## Auth

All endpoints require Sanctum bearer token.

```http
Authorization: Bearer {{token}}
Accept: application/json
Content-Type: application/json
```

---

## 12.1 Purchase info

`GET /api/managed-services/purchase-info` · Bearer

**Request:** none

**Response `200`**

```json
{
  "status": true,
  "message": "Purchase information fetched successfully.",
  "data": {
    "package_name": "Pro Plan Session",
    "price_per_session": 75,
    "currency": "usd",
    "min_quantity": 1,
    "max_quantity": 10,
    "remaining_sessions": 5
  }
}
```

| Field | Description |
|-------|-------------|
| `package_name` | Session package label for the user |
| `price_per_session` | Price of one managed-service session |
| `currency` | Stripe currency (e.g. `usd`) |
| `min_quantity` / `max_quantity` | Allowed quantity range for the selector |
| `remaining_sessions` | Current managed-service session balance |

**Mobile:** quantity selector between `min_quantity` and `max_quantity`.  
**Total** = `price_per_session × quantity` (e.g. $75 × 3 = $225).

---

## 12.2 Create PaymentIntent

`POST /api/managed-services/payment-intent` · Bearer

**Request**

```json
{
  "quantity": 3
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `quantity` | integer | yes | Between 1 and 10 |

Do **not** send `payment_method_id` or card details here.

**Response `200`**

```json
{
  "status": true,
  "message": "Payment intent created successfully.",
  "data": {
    "payment_intent_id": "pi_xxxxxxxxx",
    "client_secret": "pi_xxxxxxxxx_secret_xxxxxxxxx",
    "publishable_key": "pk_test_xxxxxxxxx",
    "quantity": 3,
    "price_per_session": 75,
    "total_price": 225,
    "amount_cents": 22500,
    "currency": "usd"
  }
}
```

| Field | Description |
|-------|-------------|
| `payment_intent_id` | Stripe PaymentIntent id (`pi_...`) — keep for verify |
| `client_secret` | For Stripe PaymentSheet / confirm |
| `publishable_key` | Initialize Stripe SDK if needed |
| `total_price` | Amount in major units |
| `amount_cents` | Amount in smallest currency unit |

---

## 12.3 Stripe PaymentSheet (client only)

After a successful PaymentIntent response:

1. Init Stripe with `data.publishable_key` (if not already using app-wide key).
2. Present PaymentSheet with:
   - `client_secret` = `data.client_secret`
   - Merchant display name: **ClayMaster**
3. User enters card (and billing if required) **inside** the sheet.
4. Confirm via Stripe mobile SDK only — not Stripe REST, not Laravel.

**Test cards (Stripe test mode)**

| Use | Number | Notes |
|-----|--------|--------|
| Success | `4242 4242 4242 4242` | Any future expiry, CVC `123`, ZIP `12345` |
| 3DS | `4000 0025 0000 3155` | SDK handles authentication UI |

**SDK outcomes**

| Result | App action |
|--------|------------|
| Success | Call `POST /api/managed-services/payment/verify` |
| Cancelled | Do **not** verify; show “Payment was cancelled.” |
| Failed | Do **not** verify; show Stripe error; allow retry |

---

## 12.4 Verify payment and add sessions

`POST /api/managed-services/payment/verify` · Bearer

Call **only** after the Stripe SDK reports success. Backend re-checks PaymentIntent with Stripe (`managed_service_sessions`, amount, user, not already credited).

**Request**

```json
{
  "payment_intent_id": "pi_xxxxxxxxx"
}
```

**Response `200` — first verify**

```json
{
  "status": true,
  "message": "3 session(s) purchased successfully!",
  "data": {
    "payment_intent_id": "pi_xxxxxxxxx",
    "sessions_added": 3,
    "purchased_sessions": 3,
    "remaining_sessions": 5,
    "amount_charged": 225,
    "currency": "usd",
    "already_processed": false
  }
}
```

**Response `200` — duplicate verify (idempotent)**

```json
{
  "status": true,
  "message": "Payment was already verified and sessions were already added.",
  "data": {
    "payment_intent_id": "pi_xxxxxxxxx",
    "sessions_added": 0,
    "purchased_sessions": 3,
    "remaining_sessions": 5,
    "amount_charged": 225,
    "currency": "usd",
    "already_processed": true
  }
}
```

Treat `already_processed: true` as success (sessions already credited).

**Mobile after success:** show success message, update remaining balance, close payment UI, refresh managed-service summary.

Suggested copy:  
`Payment successful! 3 managed-service sessions have been added to your account.`

---

## 12.5 Errors

### Payment not completed — `422`

```json
{
  "status": false,
  "code": "payment_not_completed",
  "message": "Payment has not been completed.",
  "data": {
    "payment_status": "requires_payment_method"
  }
}
```

Do not show purchase success. Possible `payment_status`: `requires_payment_method`, `requires_action`, `processing`, `succeeded`.

### No active subscription — `403`

```json
{
  "status": false,
  "code": "no_subscription",
  "message": "You don't have an active subscription. Please subscribe first."
}
```

Redirect to subscription screen.

### Invalid package — `403`

```json
{
  "status": false,
  "code": "invalid_package",
  "message": "You must have a Classic or Pro Plan to purchase extra sessions."
}
```

### Validation — `422`

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "quantity": ["The quantity must be between 1 and 10."]
  }
}
```

### Server / Stripe failure — `500`

```json
{
  "status": false,
  "message": "Unable to create payment intent."
}
```

Suggested UI: `We could not process your payment. Please try again.`

---

## 12.6 Mobile sequence

1. `GET /api/managed-services/purchase-info`
2. Show price + quantity selector (`min`–`max`)
3. User selects quantity → Purchase
4. `POST /api/managed-services/payment-intent` `{ quantity }`
5. Present Stripe PaymentSheet with `client_secret`
6. Stripe SDK confirms payment
7. On success → `POST /api/managed-services/payment/verify` `{ payment_intent_id }`
8. Update `remaining_sessions` + success UI

---

## 12.7 API summary

| Step | Method | Endpoint | Purpose |
|------|--------|----------|---------|
| 1 | `GET` | `/api/managed-services/purchase-info` | Price, limits, balance |
| 2 | `POST` | `/api/managed-services/payment-intent` | Create PaymentIntent |
| 3 | Stripe SDK | PaymentSheet | Collect card + confirm |
| 4 | `POST` | `/api/managed-services/payment/verify` | Verify + credit sessions |

---

## 12.8 Deprecated — do not use

```http
POST /api/managed-services/purchase
```

```json
{
  "quantity": 3,
  "payment_method_id": "pm_card_visa"
}
```

Replaced by: **PaymentIntent → PaymentSheet → Verify**.

---

## 12.9 Vs Online Coaching purchase

| | Managed Service (this module) | Online Coaching (`11-online-coaching`) |
|--|-------------------------------|----------------------------------------|
| Intent | **PaymentIntent** | **SetupIntent** |
| Create | `managed-services/payment-intent` + `quantity` | `sessions/setup-intent` |
| Collect card | Stripe **PaymentSheet** | CardField / `confirmSetupIntent` |
| Complete | `managed-services/payment/verify` + `payment_intent_id` | `sessions/purchase` + `payment_method` + `bundle_type` |
| Quantity | 1–10 sessions per purchase | `single` or `bundle` |

---

## 12.10 Postman-only Stripe confirm (not for the app)

For API testing in Postman only:

`POST https://api.stripe.com/v1/payment_intents/{PAYMENT_INTENT_ID}/confirm`  
with Stripe **secret** key + `payment_method=pm_card_visa`.

**Must not** be implemented in the mobile app.

---

*Pair with `API_IMPLEMENTATION_STATUS.md` for wiring status.*
