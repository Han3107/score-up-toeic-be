# API Contracts: Categories Module

This document defines the REST API endpoints for the Categories Module.

## Base Path
`/api/v1/categories`

---

## 1. Create Category (Admin Only)
**POST** `/api/v1/categories`

**Request Body:**
```json
{
  "name": "Grammar",
  "description": "Grammar topics",
  "status": "ACTIVE",
  "sequence": 1
}
```
*(Note: `description`, `status`, and `sequence` are optional. `status` defaults to ACTIVE, `sequence` defaults to Max+1)*

**Response (201 Created):**
```json
{
  "id": "uuid-or-objectid",
  "name": "Grammar",
  "description": "Grammar topics",
  "status": "ACTIVE",
  "sequence": 1,
  "createdAt": "2026-09-22T00:00:00.000Z",
  "updatedAt": "2026-09-22T00:00:00.000Z"
}
```

---

## 2. Get Categories List (Admin & Public)
**GET** `/api/v1/categories`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid-or-objectid",
      "name": "Grammar",
      "description": "Grammar topics",
      "status": "ACTIVE",
      "sequence": 1,
      "createdAt": "2026-09-22T00:00:00.000Z",
      "updatedAt": "2026-09-22T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```
*(Note: For Public requests, the backend implicitly filters to `status=ACTIVE` only. Admins see all.)*

---

## 3. Get Category Details (Admin Only)
**GET** `/api/v1/categories/:id`

**Response (200 OK):** returns the category object.

---

## 4. Update Category (Admin Only)
**PATCH** `/api/v1/categories/:id`

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Grammar",
  "status": "HIDDEN",
  "sequence": 2
}
```

**Response (200 OK):** returns the updated category object.

---

## 5. Delete Category (Admin Only)
**DELETE** `/api/v1/categories/:id`

**Response (200 OK / 204 No Content)**
- Fails with **400 Bad Request** or **409 Conflict** if category is linked to existing exams.

---

## 6. Sync Default Categories (Admin Only)
**POST** `/api/v1/categories/sync-defaults`

**Request Body:**
```json
{
  "categories": [
    {
      "name": "Word Form",
      "description": "Questions about word forms"
    },
    {
      "name": "Grammar",
      "description": "Grammar rules"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Sync completed successfully",
  "createdCount": 2,
  "skippedCount": 0
}
```
