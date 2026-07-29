> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 5. Notifications

## 5.1 List notifications

`GET /api/notifications?unread_only=0&page=1&per_page=20` · Bearer

**Query:** `unread_only` (0/1), `page`, `per_page` (max 50)

**Response `200`**

```json
{
  "items": [
    {
      "id": "9414d2d0-11e3-421a-b5b6-b482f04c9da9",
      "type": "AdminBroadcastNotification",
      "data": {
        "admin_notification_id": 1,
        "title": "test test",
        "message": "test test",
        "target_type": "classic_monthly",
        "target_label": "Classic Monthly",
        "sent_to_user_id": 44
      },
      "data_normalized": {
        "category": null,
        "action": null,
        "round_id": null,
        "course_name": null,
        "actor": { "id": null, "name": null },
        "stats": null,
        "download_url": null
      },
      "read_at": null,
      "created_at": "2026-04-02T03:02:54-04:00"
    }
  ]
}
```

Also includes types like `RoundActionNotification`.

---

## 5.2 Notification counts

`GET /api/notifications/counts` · Bearer

**Response `200`**

```json
{
  "unread": 3,
  "total": 4
}
```

---

## 5.3 Mark read

`POST /api/notifications/{id}/read` · Bearer

**Response `200`:** `{ "status": true }`  
**404:** `{ "message": "No query results for model [...]." }`

---

## 5.4 Mark all read

`POST /api/notifications/read-all` · Bearer

**Response `200`:** `{ "status": true }` (even if 0 unread)

---

## 5.5 Delete notification

`DELETE /api/notifications/{id}` · Bearer

**Response `200`:** `{ "status": true }` on success, `{ "status": false }` if id invalid (still HTTP 200 — check `status` field).

---
