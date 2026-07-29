> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 10. Forum / Community

**Prerequisites:** Bearer token. Listing + create topic require active subscription (`package_id` + `subscription_status = active`) → else **403**.  
Attachments: max 2 MB; `jpg, jpeg, png, pdf, doc, docx`.

## 10.1 List categories

`GET /api/forum-categories` · Bearer

**Request:** none

**Response `200`**

```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "General Discussion",
      "is_active": true,
      "created_at": "2025-08-21T03:03:13.000000Z",
      "updated_at": "2025-08-21T03:03:13.000000Z",
      "deleted_at": null
    }
  ]
}
```

---

## 10.2 List forums

`GET /api/forums?sort=recent&per_page=10&page=1` · Bearer

**Query:** `sort=recent|oldest|most_viewed|most_replied`, `alpha=az|za`, `category`, `per_page` (1–50), `page`

**HTTP:** `200` / `403`

**Response `200`**

```json
{
  "status": true,
  "message": "Forums fetched successfully.",
  "data": [
    {
      "id": 97,
      "title": "How do you maintain focus during competition?",
      "description": "Please share practical routines...",
      "content": "Please share practical routines...",
      "slug": "how-do-you-maintain-focus-during-competition",
      "user_id": 348,
      "category_id": 1,
      "status": "published",
      "views_count": 2,
      "replies_count": 1,
      "tags": ["focus", "competition"],
      "attachment": null,
      "user": { "id": 348, "first_name": "test", "last_name": "test", "...": "..." },
      "category": { "id": 1, "name": "General Discussion", "is_active": true }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 61,
    "has_more": true
  }
}
```

---

## 10.3 Forum detail

`GET /api/forums/{slug}?sort=newest&per_page=10&page=1` · Bearer

**Query sort:** `newest` | `oldest` | `helpful`  
**Optional header:** `X-Device-Id` (unique view tracking)

**HTTP:** `200` / `404`

**Response `200`:** `{ status, message, data: { forum, total_replies_count, replies[], best_answer, poll } }`

---

## 10.4 Create topic

`POST /api/forums` · Bearer

**HTTP:** `201` / `403` / `422`

**Request**

```json
{
  "title": "How do you maintain focus during competition1?",
  "category_id": 1,
  "description": "Please share practical routines that help you maintain focus.",
  "tags": ["focus", "competition"],
  "enable_poll": 1,
  "poll_question": "Which routine helps you most?",
  "poll_options": ["Breathing exercise", "Visualisation", "Practice routine"]
}
```

Poll requires ≥ 2 options when enabled.

**Response `201`**

```json
{
  "status": true,
  "message": "Forum topic created successfully!",
  "data": {
    "id": 99,
    "title": "...",
    "slug": "...",
    "tags": ["focus", "competition"],
    "poll": {
      "id": 15,
      "forum_id": 99,
      "question": "Which routine helps you most?",
      "options": [
        { "id": 225, "option_text": "Breathing exercise", "sort_order": 1 }
      ]
    }
  }
}
```

---

## 10.5 Update topic

`POST /api/forums/{id}/update` · Bearer (not PUT)

**HTTP:** `200` / `404` / `422`

**Request:** same shape as create.

**Response `200`:** `{ "status": true, "message": "Forum topic updated successfully!", "data": { ... } }`

---

## 10.6 Delete topic

`DELETE /api/forums/{id}` · Bearer · owner only

**Response `200`**

```json
{
  "status": true,
  "message": "Forum topic deleted successfully!"
}
```

---

## 10.7 Post reply

`POST /api/forums/{slug}/replies` · Bearer · `multipart/form-data`

| Field | Required |
|-------|----------|
| `content` | yes |
| `parent_id` | no (nested reply) |
| `attachment` | no (≤ 2 MB) |

**HTTP:** `201` / `404` / `422`

**Response `201`**

```json
{
  "status": true,
  "message": "Reply posted successfully!",
  "data": {
    "id": 179,
    "forum_id": 100,
    "user_id": 348,
    "parent_id": null,
    "content": "A short breathing routine before each station helps me maintain focus.",
    "attachment": null,
    "user": { "...": "..." }
  }
}
```

---

## 10.8 Toggle helpful

`POST /api/forum-replies/{id}/helpful` · Bearer · no body

**Response `200`**

```json
{
  "status": true,
  "helpful_count": 1,
  "is_helpful": true
}
```

---

## 10.9 Delete reply

`DELETE /api/forum-replies/{id}` · Bearer · owner only

**Response `200`**

```json
{
  "status": true,
  "message": "Reply deleted successfully!"
}
```

---

## 10.10 Mark best answer

`POST /api/forum-replies/{id}/best-answer` · Bearer · forum owner or admin · no body

**Response `200`**

```json
{
  "status": true,
  "message": "Reply marked as best answer!"
}
```

---

## 10.11 Report topic

`POST /api/forums/{id}/report` · Bearer

**Request**

```json
{
  "reason": "This post contains inappropriate or misleading content."
}
```

**HTTP:** `200` / `400` (already reported) / `404`

**Response `200`**

```json
{
  "status": true,
  "message": "Post reported successfully!",
  "reports_count": 1
}
```

---

## 10.12 Report reply

`POST /api/forum-replies/{id}/report` · Bearer

**Request**

```json
{
  "reason": "This reply contains inappropriate content."
}
```

**Response `200`**

```json
{
  "status": true,
  "message": "Reply reported successfully!",
  "reports_count": 1
}
```

---

## 10.13 Poll vote

`POST /api/forums/{id}/poll/vote` · Bearer

**Request**

```json
{
  "option_id": 12
}
```

**Response `200`**

```json
{
  "status": true,
  "poll": {
    "id": 7,
    "question": "Which routine helps you most?",
    "total_votes": 1,
    "user_voted_option_id": 12,
    "options": []
  }
}
```

---

## 10.14 Poll results

`GET /api/forums/{id}/poll` · Bearer

**Response `200`**

```json
{
  "status": true,
  "poll": {
    "id": 7,
    "total_votes": 1,
    "options": [
      {
        "id": 12,
        "votes_count": 1,
        "percentage": 100,
        "is_selected": true
      }
    ]
  }
}
```

---

## Forum error matrix

| Code | Cause |
|------|--------|
| 400 | Duplicate report |
| 401 | Missing / expired token |
| 403 | No active subscription / ownership |
| 404 | Forum / reply / poll missing |
| 422 | Validation / file / poll options |
| 500 | Server / filesystem error |

Example 422:

```json
{
  "message": "The title field is required.",
  "errors": {
    "title": ["The title field is required."]
  }
}
```

---
