> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 11. Online Coaching / Sessions

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

**Response**

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

## 11.4 Purchase session

`POST /api/sessions/purchase` · Bearer

**Request — single**

```json
{
  "bundle_type": "single",
  "payment_method_id": "pm_1Tvaw8EE9zClGUlAmdaifeCv"
}
```

**Request — bundle**

```json
{
  "bundle_type": "bundle",
  "payment_method_id": "pm_1TvbIAEE9zClGUlApftK3OU5"
}
```

**Response**

```json
{
  "success": true,
  "message": "1 session(s) have been purchased!",
  "data": {
    "sessions_added": 1,
    "remaining_sessions": 11,
    "amount_charged": 75
  }
}
```

Doc lists `201 / 403 / 422` for several of these; confirm actual GET status codes against live API when wiring.

---

*Pair with `API_IMPLEMENTATION_STATUS.md` for wiring status. Update samples if backend responses change.*
