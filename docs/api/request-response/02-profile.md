> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 2. Profile / Account

## 2.1 Edit profile

`POST /api/edit-profile` · Bearer · `multipart/form-data`

**Request fields**

```json
{
  "first_name": "Test",
  "last_name": "Player",
  "contact": "32324234",
  "address": "test",
  "username": "testplayer",
  "profile_image": "(optional file)"
}
```

App may also send `id`, `email`.

**Response `200`**

```json
{
  "status": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 342,
    "first_name": "Test",
    "last_name": "Player",
    "email": "jacksmith4557078@gmail.com",
    "contact": "32324234",
    "profile_image": null,
    "address": "test",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Errors:** `401`, `422`.

---

## 2.2 Change password

`POST /api/user/update-password` · Bearer

**Request**

```json
{
  "current_password": "qwerty123",
  "password": "newStrongPass456",
  "password_confirmation": "newStrongPass456"
}
```

**Response `200`**

```json
{
  "status": true,
  "message": "Password changed successfully."
}
```

---

## 2.3 Delete account

`GET /api/delete/user` · Bearer

**Request:** none

**Response `200`**

```json
{
  "status": true,
  "message": "Your account has been Deleted successfully, If want to access again please contact support."
}
```

---
