> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 7. Tournament

## 7.1 Submit entry

`POST /api/tournament/submit` · Bearer

**Request**

```json
{
  "nsca_class": "AA",
  "competitor_name": "John Smith",
  "event_score": 85,
  "adj_factor": 5,
  "tournament_name": "Palmetto Cup, Hermitage Sporting Grounds, SC",
  "tournament_date": "2026-07-10"
}
```

**Response `200`**

```json
{
  "status": true,
  "message": "Tournament entry submitted successfully!",
  "data": {
    "id": 24,
    "nsca_class": "AA",
    "competitor_name": "John Smith",
    "event_score": 85,
    "adj_factor": 5,
    "total_adj_score": 90,
    "tournament_name": "Palmetto Cup, Hermitage Sporting Grounds, SC",
    "tournament_date": "2026-07-10T04:00:00.000000Z",
    "month": 7,
    "year": 2026
  }
}
```

---

## 7.2 Leaderboard

`GET /api/tournament/leaderboard?year=&month=&mine=0|1` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Leaderboard fetched successfully.",
  "data": {
    "year": 2026,
    "month": 7,
    "month_title": "July 2026",
    "mine": false,
    "standings": [
      {
        "award": "HOA",
        "icon": "trophy",
        "competitor_name": "test",
        "nsca_class": "M",
        "total_adj_score": 154
      }
    ],
    "entries": [
      {
        "rank": 1,
        "nsca_class": "M",
        "competitor_name": "test",
        "event_score": 65,
        "adj_factor": 89,
        "total_adj_score": 154,
        "tournament_name": "test",
        "tournament_date": "07/15/2026"
      }
    ]
  }
}
```

---
