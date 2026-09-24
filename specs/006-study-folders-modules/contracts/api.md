# API Contracts

Base Path: `/api/v1`

All endpoints require authentication (Bearer Token). `userId` is extracted from the JWT token.

## Folders

### Create Folder
- **POST** `/folders`
- **Request Body**: `{ "title": "string", "description": "string?" }`
- **Response** `201 Created`: Folder Object

### List Folders
- **GET** `/folders`
- **Query Params**: `page` (default 1), `limit` (default 20)
- **Response** `200 OK`: Paginated list of Folders (excludes soft-deleted)

### Get Folder
- **GET** `/folders/:id`
- **Response** `200 OK`: Folder Object

### Update Folder
- **PATCH** `/folders/:id`
- **Request Body**: `{ "title": "string?", "description": "string?" }`
- **Response** `200 OK`: Updated Folder Object

### Delete Folder (Soft)
- **DELETE** `/folders/:id`
- **Response** `204 No Content`
- *Note: Soft-deletes the folder and cascades soft-delete to its modules.*

## Modules

### Create Module
- **POST** `/modules`
- **Request Body**: `{ "title": "string", "description": "string?", "folderId": "uuid?", "terms": [{ "term": "string", "definition": "string" }] }`
- **Response** `201 Created`: Module Object with Terms

### List Modules
- **GET** `/modules`
- **Query Params**: `page`, `limit`, `folderId?`
- **Response** `200 OK`: Paginated list of Modules

### Get Module
- **GET** `/modules/:id`
- **Query Params**: `random=true|false`
- **Response** `200 OK`: Module Object with its Terms (randomized if requested)

### Update Module
- **PATCH** `/modules/:id`
- **Request Body**: `{ "title": "string?", "description": "string?", "folderId": "uuid?", "terms": [...] }`
- **Response** `200 OK`: Updated Module Object
- *Note: Updating terms replaces the existing list or synchronizes it. Max 500 terms.*

### Clone Module
- **POST** `/modules/:id/clone`
- **Request Body**: `{ "targetFolderId": "uuid?" }`
- **Response** `201 Created`: New Module Object

### Delete Module (Soft)
- **DELETE** `/modules/:id`
- **Response** `204 No Content`

## Trash / Restoration (Bonus/Implicit FR-008)

### List Deleted Items
- **GET** `/trash` (or specific `/folders/trash`, `/modules/trash`)
- **Response** `200 OK`: List of soft-deleted items pending hard deletion.

### Restore Item
- **POST** `/folders/:id/restore` or `/modules/:id/restore`
- **Response** `200 OK`
