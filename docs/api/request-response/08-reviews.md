> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 8. Reviews

## 8.1 List reviews

`GET /api/reviews?page=1&per_page=20` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Reviews fetched successfully.",
  "data": [
    {
      "id": 21,
      "user_id": 150,
      "title": "test",
      "review": "test",
      "name": "test",
      "email": "jacksmithjs4557078@gmail.com",
      "issue": "test",
      "difference_after": "test",
      "performance_change": "test",
      "rating": 3,
      "is_approved": 1,
      "is_genuine": 1,
      "created_at": "2026-07-15T09:59:23.000000Z",
      "updated_at": "2026-07-15T10:13:59.000000Z"
    }
  ]
}
```

---

## 8.2 Submit review

`POST /api/reviews` · Bearer

**Request**

```json
{
  "title": "Great improvement in my scores",
  "review": "I started using ClayMaster's Detailed Analytics Tool...",
  "name": "John Smith",
  "email": "jacksmith4557078@gmail.com",
  "issue": "Missing quartering and trap-teal targets consistently",
  "difference_after": "Now breaking 85%+ of quartering targets...",
  "performance_change": "Event score improved from 65 to 85 over three tournaments",
  "rating": 5
}
```

**Response `201`**

```json
{
  "status": true,
  "message": "Thank you for your review!",
  "data": {
    "id": 22,
    "user_id": 348,
    "title": "Great improvement in my scores",
    "review": "...",
    "name": "John Smith",
    "email": "jacksmith4557078@gmail.com",
    "issue": "...",
    "difference_after": "...",
    "performance_change": "...",
    "rating": 5,
    "is_genuine": 1,
    "created_at": "2026-07-15T10:28:54.000000Z",
    "updated_at": "2026-07-15T10:28:54.000000Z"
  }
}
```

---
