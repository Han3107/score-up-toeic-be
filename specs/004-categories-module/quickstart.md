# Validation Quickstart: Categories Module

This guide provides runnable validation scenarios to prove the Categories Module works as specified. It assumes the server is running locally (e.g., `http://localhost:3000`).

## Prerequisites
- Node.js & NestJS application running.
- A valid Admin JWT token (`$ADMIN_TOKEN`).

```bash
export API_URL="http://localhost:3000/api/v1"
export ADMIN_TOKEN="your_admin_jwt"
```

## Scenario 1: Sync Defaults (Admin)
Verify that standard categories are created and duplicates are skipped.

```bash
# 1. First sync - Should create categories
curl -X POST "$API_URL/categories/sync-defaults" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categories": [
      { "name": "Grammar" },
      { "name": "Vocabulary" }
    ]
  }'
# Expected Output: { "message": "Sync completed successfully", "createdCount": 2, "skippedCount": 0 }

# 2. Second sync - Should skip duplicates
curl -X POST "$API_URL/categories/sync-defaults" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categories": [
      { "name": "Grammar" },
      { "name": "Reading" }
    ]
  }'
# Expected Output: { "message": "Sync completed successfully", "createdCount": 1, "skippedCount": 1 }
```

## Scenario 2: Admin CRUD & Sequence
Verify that Admin can create without sequence (defaults to max+1), update status, and delete.

```bash
# 1. Create a category
curl -X POST "$API_URL/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Listening Test",
    "status": "HIDDEN"
  }'
# Note the ID from the response. It should have a sequence > existing ones.
export CAT_ID="<id_from_response>"

# 2. Delete the category (Hard Delete)
curl -X DELETE "$API_URL/categories/$CAT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
# Expected Output: 200 OK or 204 No Content (Verify it is fully removed from DB, not just soft deleted)
```

## Scenario 3: Public Viewing
Verify that public users only see `ACTIVE` categories and pagination works.

```bash
# Get categories without authentication
curl -X GET "$API_URL/categories?page=1&limit=5"
# Expected: Only ACTIVE categories are returned (the "Listening Test" created as HIDDEN should not appear).
# Response should include meta data (total, page, limit, totalPages).
```

## Scenario 4: Unauthorized Access Protection
Verify public users cannot call Admin endpoints.

```bash
# Attempt to create category without authentication
curl -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacked Category"}'
# Expected: 401 Unauthorized or 403 Forbidden
```
