> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 4. Rounds & Stations

## 4.1 List rounds

`GET /api/rounds` · Bearer

**Response `200` — raw array**

```json
[
  {
    "id": 198,
    "course_name": "Red234324 Course",
    "ncsca_class": "AA",
    "squad_sequence": 2,
    "european_rotation": true,
    "starting_station": 5,
    "total_stations": 10,
    "save_status": false,
    "complete_status": false,
    "sent_status": false,
    "admin_uploaded_url": null,
    "admin_uploaded_at": null,
    "status": "saved",
    "download_url": null,
    "updated_at": "2025-12-11T10:23:35-05:00",
    "created_at": "2025-12-11T10:23:35-05:00",
    "station_sequence": [5, 6, 7, 8, 9, 10, 1, 2, 3, 4]
  }
]
```

---

## 4.2 Round detail

`GET /api/rounds/{id}` · Bearer

**Response `200`**

```json
{
  "id": 198,
  "course_name": "Red234324 Course",
  "ncsca_class": "AA",
  "squad_sequence": 2,
  "european_rotation": true,
  "starting_station": 5,
  "total_stations": 10,
  "station_sequence": [5, 6, 7, 8, 9, 10, 1, 2, 3, 4],
  "save_status": true,
  "complete_status": true,
  "sent_status": false,
  "status": "completed",
  "admin_uploaded_url": null,
  "admin_uploaded_at": null,
  "download_url": "https://claymaster.net/beta/storage/rounds/44/198/ClayMaster_Round_198_20260713043753.xlsx",
  "stats": { "dead": 0, "lost": 0, "total": 0 },
  "stations": []
}
```

---

## 4.3 Create round

`POST /api/rounds` · Bearer

**Request**

```json
{
  "course_name": "Red Course",
  "squad_sequence": 1,
  "people_in_squad": 1,
  "starting_station": 2,
  "total_stations": 10
}
```

App also sends `ncsca_class`, `european_rotation`.

**Response `201`**

```json
{
  "status": true,
  "message": "Round created",
  "round": {
    "id": 286,
    "european_rotation": false,
    "starting_station": null,
    "total_stations": null,
    "station_sequence": null
  }
}
```

---

## 4.4 Complete round

`POST /api/rounds/{id}/complete` · Bearer

**Request:** none (typical)

**Response `200`**

```json
{
  "status": true,
  "message": "Round marked completed."
}
```

---

## 4.5 Save round

`POST /api/rounds/{id}/save` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Round saved."
}
```

---

## 4.6 Send to ClayMaster

`POST /api/rounds/{id}/send-to-claymaster` · Bearer

**Response:** No saved Postman example.

---

## 4.7 Courses

`GET /api/courses` · Bearer

**Response `200`**

```json
["Saltwaters Black", "Windwood"]
```

---

## 4.8 Classes

`GET /api/classes` · Used by app; not in shared docs.

---

## 4.9 Trap presentations

`GET /api/trap-presentations` · Bearer

**Response `200`**

```json
[
  { "label": "Chandelle", "slug": "chandelle", "abbr": "Cha" },
  { "label": "Crosser", "slug": "crosser", "abbr": "Cro" },
  { "label": "Incomer", "slug": "incomer", "abbr": "Inc" },
  { "label": "Quartering", "slug": "quartering", "abbr": "Qua" }
]
```

---

## 4.10 Post stations (bulk upsert)

`POST /api/rounds/{round_id}/stations` · Bearer

**Request**

```json
[
  {
    "station_number": 1,
    "pair_type": "true_pair",
    "traps": [
      { "trap_id": 1, "presentation": "quartering" },
      { "trap_id": 2, "presentation": "crosser" }
    ],
    "shots": [
      { "sequence": 1, "result": "dead" },
      { "sequence": 2, "result": "dead" },
      { "sequence": 3, "result": "lost" },
      { "sequence": 4, "result": "empty" },
      { "sequence": 5, "result": "empty" }
    ]
  }
]
```

`pair_type`: e.g. `true_pair`, `report_pair`  
`result`: `dead` | `lost` | `empty`

---

## 4.11 Get stations

`GET /api/rounds/{round_id}/stations` · Bearer

**Response `200`**

```json
[
  {
    "station_id": 1197,
    "station_number": 1,
    "dead": 2,
    "lost": 1,
    "total_shots": 5,
    "pair_type": "true_pair",
    "shots": [
      { "sequence": 1, "result": "dead" },
      { "sequence": 2, "result": "dead" },
      { "sequence": 3, "result": "lost" },
      { "sequence": 4, "result": "empty" },
      { "sequence": 5, "result": "empty" }
    ],
    "traps": [
      { "trap_id": 1, "selected_presentation": "quartering" },
      { "trap_id": 2, "selected_presentation": "crosser" }
    ]
  }
]
```

---
