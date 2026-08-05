> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 11. Online Coaching / Sessions

Source: `ClayMaster_Mobile_Payments_API_Guide-for-online coaching-checkout.docx`

> **Not Managed Service.** Extra managed-service sessions use PaymentIntent + PaymentSheet + verify — see [12-managed-services.md](./12-managed-services.md). This module uses SetupIntent → `payment_method` → `sessions/purchase`.

## 11.1 Coaches

`GET /api/coaches` · Bearer

**Request:** none

**Response**

```json
{
  "status": true,
  "data": [
    {
      "key": "kevin",
      "name": "Kevin",
      "booking_url": "https://calendly.com/kdemichiel-claymaster/30min?primary_color=ff5d00&text_color=000000"
    },
    {
      "key": "bill",
      "name": "Bill",
      "booking_url": "https://calendly.com/blmcguire09/new-meeting-1?primary_color=ff5d00&text_color=000000"
    }
  ]
}
```

---

## 11.2 Sessions

`GET /api/sessions` · Bearer

**Response**

```json
{
  "status": true,
  "message": "Sessions fetched successfully.",
  "data": {
    "package_id": "6",
    "months_active": 0,
    "has_reached_limit": false,
    "can_book_session": true,
    "appointments": [
      {
        "coach": "Bill",
        "name": "jack smith",
        "email": "jacksmithjs4557078@gmail.com",
        "datetime": "2026-04-29T00:00:00+00:00",
        "join_url": "https://us05web.zoom.us/j/..."
      }
    ],
    "summary": {
      "total_sessions": 10,
      "used_sessions": 5,
      "remaining_sessions": 5,
      "outstanding_sessions": 5,
      "percentage_used": 50
    }
  }
}
```

---

## 11.3 Purchase info

`GET /api/sessions/purchase-info` · Bearer

**Response `200`**

```json
{
  "status": true,
  "data": {
    "package_name": "Pro Plan Session",
    "single_price": 75,
    "bundle_price": 700,
    "bundle_qty": 10,
    "bundle_savings": 50
  }
}
```

---

## 11.4 Session SetupIntent

`POST /api/sessions/setup-intent` · Bearer

**Request body:** none (pricing / bundle are not sent here)

**Response `201`**

```json
{
  "status": true,
  "message": "Session payment setup intent created successfully.",
  "data": {
    "setup_intent_id": "seti_xxxxx",
    "client_secret": "seti_xxxxx_secret_xxxxx",
    "customer_id": "cus_xxxxx"
  }
}
```

Pass `data.client_secret` to Stripe `confirmSetupIntent`. Never send the seti secret as `payment_method`. Read `setupIntent.paymentMethodId` (`pm_...`).

---

## 11.5 Purchase session

`POST /api/sessions/purchase` · Bearer

**Request — single**

```json
{
  "payment_method": "pm_xxxxx",
  "bundle_type": "single"
}
```

**Request — bundle**

```json
{
  "payment_method": "pm_xxxxx",
  "bundle_type": "bundle"
}
```

**Successful response `201`**

```json
{
  "status": true,
  "message": "1 session(s) purchased successfully.",
  "data": {
    "payment_intent_id": "pi_xxxxx",
    "payment_status": "succeeded",
    "bundle_type": "single",
    "sessions_added": 1,
    "remaining_sessions": 23,
    "amount_charged": 75,
    "amount_cents": 7500,
    "currency": "USD"
  }
}
```

Treat **`data.payment_status: "succeeded"`** as final success.

**Additional authentication (3D Secure)**

```json
{
  "status": false,
  "requires_action": true,
  "message": "Additional authentication is required.",
  "data": {
    "payment_intent_id": "pi_xxxxx",
    "payment_intent_client_secret": "pi_xxxxx_secret_xxxxx",
    "payment_status": "requires_action"
  }
}
```

Pass `payment_intent_client_secret` to Stripe `handleNextAction`.

---

*Pair with `API_IMPLEMENTATION_STATUS.md` for wiring status.*
