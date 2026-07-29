> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 3. Subscription / Packages / Stripe

## 3.1 Packages listing

`GET /api/packages` · Bearer

**Request:** none

**Response `200` — raw array (not `{ status, data }`)

```json
[
  {
    "id": 2,
    "title": "Classic",
    "price": "25",
    "duration": "month",
    "description": "...",
    "front_description": "...",
    "stripe_product_id": "prod_...",
    "stripe_price_id": "price_...",
    "session_purchase_price": 85,
    "is_popular": null
  }
]
```

**Errors:** `401`, `500`.

---

## 3.2 Discounts

`GET /api/discounts` · Public

**Request:** none

**Response `200`**

```json
{
  "status": true,
  "data": [
    {
      "discount_name": "Military",
      "discount_value": "military",
      "value": 10
    },
    {
      "discount_name": "Student",
      "discount_value": "student",
      "value": 10
    }
  ]
}
```

---

## 3.3 Stripe setup intent

`POST /api/stripe/setup-intent` · Bearer

**Request:** none (empty body)

**Response `200`**

```json
{
  "client_secret": "seti_1Tsh3HEE9zClGUlAUT4FrSYR_secret_UsRxw1NZwqLiVSPNCwrRrP75JevWgB3"
}
```

---

## 3.4 Stripe subscribe

`POST /api/stripe/subscribe` · Bearer

**Request**

```json
{
  "payment_method": "pm_1Tsh3kEE9zClGUlAozH667ur",
  "package_id": 8
}
```

**Response `200`**

```json
{
  "success": true,
  "type": "paid",
  "subscription_id": "sub_1Tsh4wEE9zClGUlAXq5vItZc",
  "subscription_status": "active",
  "package_id": 8,
  "package_expires_at": "2026-08-13 00:00:00",
  "discount_type": "student",
  "discount_percent": 10,
  "coupon_percent": 0,
  "remaining_sessions": 0,
  "remaining_service_sessions": 0
}
```

**Errors:** `422` (rules not fully confirmed in docs).

---

## 3.5 Subscription enabled

`GET /api/subscription-enabled` · Used by app; not in shared docs.

Confirm live response with backend (app expects subscription flag / optional Stripe public key).

---
