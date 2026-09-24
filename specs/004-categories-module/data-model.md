# Data Model: Categories Module

## Entities

### `Category`

Represents a classification topic (e.g., "Grammar", "Parts of Speech"). Purely text-based.

#### Fields

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID/ObjectId | Primary Key, Auto-generated | Unique identifier for the category. |
| `name` | String | Required, Unique | The display name of the category. |
| `description` | String | Optional | Detailed text describing the category. |
| `status` | Enum | Required, Default: `ACTIVE` | `ACTIVE` (visible to learners) or `HIDDEN` (admin only). |
| `sequence` | Number | Optional on input, Default: Max+1 | Used for custom sorting when fetching the list. |
| `createdAt` | Date | Auto-generated | Timestamp of creation. |
| `updatedAt` | Date | Auto-generated | Timestamp of last update. |

#### Relationships
- Deletion rule: The spec (FR-007) requires checking for linked exams. A service-level check must be implemented to prevent hard-delete if exams are linked. No database-level cascading deletes.

#### Validation Rules
- `name`: Must not be empty, max length 255.
- `status`: Must be one of `['ACTIVE', 'HIDDEN']`.
- `sequence`: Must be a non-negative integer.

#### State Transitions
- Status can toggle between `ACTIVE` and `HIDDEN` via Admin update.

## Database Specifics (NestJS Boilerplate)

- **TypeORM (PostgreSQL)**: 
  - Table: `categories`
  - `name` column has `UNIQUE` constraint.
- **Mongoose (MongoDB)**:
  - Collection: `categories`
  - `name` field has `{ unique: true }` index.
