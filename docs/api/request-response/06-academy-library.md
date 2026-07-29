> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 6. Academy / Library

Common envelope: `{ "status": true, "message": "...", "data": ... }`  
Auth: Bearer. Errors typically `401` / `500`.

## 6.1 Tutorial videos list

`GET /api/tutorial-videos/`

**Response `200`**

```json
{
  "status": true,
  "message": "Tutorial videos fetched successfully.",
  "data": [
    {
      "id": 2,
      "title": "Self Assessment",
      "package_id": 2,
      "can_access": true,
      "size_kb": 123002.49,
      "video_url": "https://claymaster.net/beta/storage/videos/...."
    },
    {
      "id": 4,
      "title": "Pattern Analysis",
      "package_id": 3,
      "can_access": false,
      "size_kb": 51773.32,
      "video_url": null
    }
  ]
}
```

## 6.2 Tutorial video detail

`GET /api/tutorial-videos/{id}`

**Response `200`:** `{ "status": true, "message": "Video fetched successfully.", "data": { ...same fields as list item... } }`

---

## 6.3 Workbooks list

`GET /api/workbooks`

**Response `200`**

```json
{
  "status": true,
  "message": "Workbooks fetched successfully.",
  "data": [
    {
      "id": 7,
      "title": "Detail Analytics Tool - Classic",
      "description": "<html>...",
      "package_id": 2,
      "file_type": "xlsm",
      "can_access": true,
      "size_kb": 2359.68,
      "file_url": "https://claymaster.net/beta/storage/documents/workbook/...."
    }
  ]
}
```

## 6.4 Workbook detail

`GET /api/workbooks/{id}` — same item shape under `data`.

---

## 6.5 Instructional videos list

`GET /api/instructional-videos`

**Response `200`**

```json
{
  "status": true,
  "message": "Instructional videos fetched successfully.",
  "data": [
    {
      "id": 2,
      "title": "Chandelle",
      "description": "...",
      "thumbnail": null,
      "order_by": 1,
      "size_kb": 357383.59,
      "video_url": "https://.../instructional-videos/....mp4",
      "trailer": {
        "id": 2,
        "title": "CLAYMASTER VISION (DETAILED ENHANCED VIEW)",
        "video_url": null
      }
    }
  ]
}
```

## 6.6 Instructional video detail

`GET /api/instructional-videos/{id}` — single object in `data`.

---

## 6.7 Additional videos

`GET /api/additional-videos`

**Response `200`:** nested categories → subcategories → `videos[]` with `id`, `title`, `thumbnail`, `illustration`, `sort_order`, `size_kb`, `video_url`.

## 6.8 Additional video detail

`GET /api/additional-videos/{id}`

## 6.9 Additional video categories

`GET /api/additional-videos/categories`

**Response `200`**

```json
{
  "status": true,
  "message": "Categories fetched successfully.",
  "data": [
    {
      "category_name": "Special Techniques",
      "category_slug": "special-techniques",
      "video_count": 3,
      "subcategories": [
        { "subcategory_name": null, "video_count": 3 }
      ]
    }
  ]
}
```

---

## 6.10 Practice drills list

`GET /api/practice-drills`

**Response `200`**

```json
{
  "status": true,
  "message": "Practice drills fetched successfully.",
  "data": [
    {
      "id": 33,
      "title": "2nd Target BP-HP-VPP Practice Drill",
      "description": "<p>...",
      "file_type": "pdf",
      "size_kb": 216.43,
      "file_url": "https://.../practice_drills/....pdf"
    }
  ]
}
```

## 6.11 Practice drill detail

`GET /api/practice-drills/{id}` — single object in `data`.

---

## 6.12 Monthly webcasts list

`GET /api/monthly-webcasts`  
(Docs listing URL was mis-pasted as `practice-drills/33`; use this path.)

**Response `200`**

```json
{
  "status": true,
  "message": "Monthly webcasts fetched successfully.",
  "data": [
    {
      "id": 1,
      "title": "ClayMaster Truly Unique - All Inclusive Sporting Clays Improvement Program",
      "description": null,
      "package_id": 2,
      "size_kb": 27138.26,
      "video_url": "https://.../monthly_web_cast....mp4"
    }
  ]
}
```

## 6.13 Monthly webcast detail

`GET /api/monthly-webcasts/{id}`

---

## 6.14 Manual deliveries list

`GET /api/manual-deliveries`

**Response `200`**

```json
{
  "status": true,
  "message": "Manual delivery files fetched successfully.",
  "data": {
    "documents": [
      {
        "id": 11,
        "title": "Sporting Clay Fundamentals",
        "description": "...",
        "file_type": "pdf",
        "kind": "document",
        "size_kb": 439.47,
        "file_url": "https://..."
      }
    ]
  }
}
```

## 6.15 Manual delivery detail

`GET /api/manual-deliveries/{id}`

**Response `200`:** `{ "status": true, "message": "File fetched successfully.", "data": { ...document... } }`

---
