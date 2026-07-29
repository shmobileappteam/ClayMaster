> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 1. Auth

## 1.1 Login

`POST /api/login` · Public

**Request**

```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```

App may also send `device_token` (FCM).

**Response `200`**

```json
{
  "status": true,
  "message": "Login successful",
  "user": {
    "id": 348,
    "first_name": "test",
    "last_name": "test",
    "email": "zallusezixu-7285@yopmail.com",
    "role": 1,
    "discount_type": "student",
    "stripe_customer_id": "cus_UsRCt85S4Gm2vx",
    "stripe_subscription_id": "sub_1Tsh4wEE9zClGUlAXq5vItZc",
    "package_id": "8",
    "subscription_status": "active",
    "remaining_sessions": 0,
    "remaining_service_sessions": 0,
    "package_expires_at": "2026-08-13 00:00:00",
    "is_active": 1
  },
  "token": "1634|ndgS3F93btTE2XzRr2PLK9NQACebhPCiVCh0gllI291ee8da"
}
```

**Errors:** `401` / `422` (validation not fully confirmed in docs).

---

## 1.2 Register

`POST /api/register` · Public

**Request**

```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "jacksmith4557078@gmail.com",
  "password": "qwerty123",
  "password_confirmation": "qwerty123",
  "discount_type": "student"
}
```

**Response `201`**

```json
{
  "status": true,
  "message": "Registration successful. Please verify your email using OTP.",
  "user": {
    "id": 347,
    "first_name": "Test",
    "last_name": "User",
    "email": "jacksmith4553437078@gmail.com",
    "discount_type": "student",
    "is_verified": null
  },
  "token": "1632|LN4xoC9Wfqj2TZ6jcoPiqWc7Au4O5yrc8a4ZNR572b33e0fc"
}
```

---

## 1.3 Verify OTP

`POST /api/verify/otp` · Public

**Request**

```json
{
  "email": "jacksmith4557078@gmail.com",
  "otp": "454700"
}
```

**Response:** No saved Postman example in docs.

---

## 1.4 Get profile

`GET /api/profile` · Bearer

**Request:** none

**Response `200`**

```json
{
  "status": true,
  "message": "Profile fetched successfully.",
  "user": {
    "id": 348,
    "first_name": "test",
    "last_name": "test",
    "email": "zallusezixu-7285@yopmail.com",
    "username": null,
    "contact": null,
    "secondary_contact": null,
    "address_1": null,
    "address_2": null,
    "city": null,
    "state": null,
    "country": null,
    "zip": null,
    "role": 1,
    "discount_type": "student",
    "profile_image": null,
    "stripe_customer_id": "cus_UsRCt85S4Gm2vx",
    "stripe_subscription_id": "sub_1TshrDEE9zClGUlA6D2UDWZE",
    "package_id": "5",
    "is_founding_member": 0,
    "founding_package_id": null,
    "founding_type": null,
    "founding_joined_at": null,
    "founding_badge_image": null,
    "subscription_status": "active",
    "default_payment_method_id": null,
    "remaining_sessions": 1,
    "remaining_service_sessions": 1,
    "admin_purchased": 0,
    "package_expires_at": "2026-08-13 00:00:00",
    "is_active": 1,
    "email_verified_at": null,
    "otp": "662292",
    "otp_resend_at": "2026-07-13T11:00:24.000000Z",
    "otp_expires_at": "2026-07-13T11:10:24.000000Z",
    "is_verified": null,
    "is_deleted": 0,
    "created_at": "2026-07-13T09:36:44.000000Z",
    "updated_at": "2026-07-13T11:17:10.000000Z"
  }
}
```

**Errors `401`:** `{ "status": false, "message": "You must be logged in to delete your account." }`  
(Docs note: copy-paste bug — wrong message reused on profile.)

---

## 1.5–1.9 Other auth paths (app stubs; limited / no doc samples)

| Method | Endpoint | Notes |
|--------|----------|--------|
| `POST` | `/api/resend/otp` | Body typically `{ "email" }` |
| `POST` | `/api/forgot/password` | Confirm with backend |
| `POST` | `/api/resend/forgot/password/otp` | Confirm with backend |
| `POST` | `/api/verify/otp/password` | Reset password |
| `GET` | `/api/logout` | Bearer |

---
