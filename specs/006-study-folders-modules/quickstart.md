# Quickstart Validation Guide

Follow these steps to validate the Folders & Modules API end-to-end.

## Prerequisites
- Application running (`npm run start:dev`)
- A valid Bearer Token for an authenticated user (Set `$TOKEN`)
- Database up and running (PostgreSQL or MongoDB)

## 1. Create a Folder
```bash
curl -X POST http://localhost:3000/api/v1/folders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "TOEIC Vocab", "description": "My preparation"}'
```
*Expected: 201 Created with the Folder object. Note the `id` as `$FOLDER_ID`.*

## 2. Create a Module inside the Folder
```bash
curl -X POST http://localhost:3000/api/v1/modules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Day 1",
    "folderId": "'$FOLDER_ID'",
    "terms": [
      {"term": "Accommodate", "definition": "To provide with something desired or needed"},
      {"term": "Apprehend", "definition": "To anticipate especially with anxiety, dread, or fear"}
    ]
  }'
```
*Expected: 201 Created with Module and terms. Note the `id` as `$MODULE_ID`.*

## 3. Retrieve Module with Random Ordering
```bash
curl -X GET "http://localhost:3000/api/v1/modules/$MODULE_ID?random=true" \
  -H "Authorization: Bearer $TOKEN"
```
*Expected: 200 OK. The `terms` array should be returned.*

## 4. Test Cloning a Module
```bash
curl -X POST "http://localhost:3000/api/v1/modules/$MODULE_ID/clone" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```
*Expected: 201 Created. A brand new Module object containing the identical terms, but a new ID.*

## 5. Test Soft Delete & Restore
```bash
# Soft delete
curl -X DELETE "http://localhost:3000/api/v1/folders/$FOLDER_ID" \
  -H "Authorization: Bearer $TOKEN"

# Attempt to fetch (should fail)
curl -X GET "http://localhost:3000/api/v1/folders/$FOLDER_ID" \
  -H "Authorization: Bearer $TOKEN"
# Expected: 404 Not Found

# Restore
curl -X POST "http://localhost:3000/api/v1/folders/$FOLDER_ID/restore" \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK
```