# Data Model: Study Folders and Modules

Entities will be generated using the project's custom generators to support both TypeORM and Mongoose.

## 1. Study Folder

Represents the top-level organization unit.

**Fields**:
- `id` (UUID / ObjectId) - Primary Key
- `title` (String) - Required, max length 255
- `description` (String) - Optional
- `userId` (String/UUID) - Required. Owner of the folder. (Indexed for tenant isolation)
- `createdAt` (Timestamp) - Auto-generated
- `updatedAt` (Timestamp) - Auto-generated
- `deletedAt` (Timestamp) - Nullable, used for soft deletes.

**Relationships**:
- One-to-Many with `VocabularyModule` (A folder has many modules).

## 2. Vocabulary Module

Represents a collection of vocabulary terms.

**Fields**:
- `id` (UUID / ObjectId) - Primary Key
- `title` (String) - Required, max length 255
- `description` (String) - Optional
- `userId` (String/UUID) - Required. Owner of the module.
- `folderId` (UUID / ObjectId) - Optional. Reference to `StudyFolder`. (Indexed)
- `createdAt` (Timestamp) - Auto-generated
- `updatedAt` (Timestamp) - Auto-generated
- `deletedAt` (Timestamp) - Nullable, used for soft deletes.

**Relationships**:
- Belongs to `StudyFolder` (optional, 1:N).
- One-to-Many with `VocabularyTerm` (A module has up to 500 terms).

## 3. Vocabulary Term

Represents an individual flashcard / term within a module.

**Fields**:
- `id` (UUID / ObjectId) - Primary Key
- `moduleId` (UUID / ObjectId) - Required. Reference to `VocabularyModule`. (Indexed)
- `term` (String) - Required, the word/phrase to study.
- `definition` (String) - Required, the meaning/translation.
- `createdAt` (Timestamp) - Auto-generated
- `updatedAt` (Timestamp) - Auto-generated

**Relationships**:
- Belongs to `VocabularyModule`.

## Constraints & Indexes
- Validation: `VocabularyModule` cannot exceed 500 `VocabularyTerm`s.
- Indexing: `userId` on `StudyFolder` and `VocabularyModule` for fast isolated queries.
- Indexing: `moduleId` on `VocabularyTerm` for fast retrieval of terms.
- Soft Deletion: Handled via `deletedAt` IS NULL scopes/filters.
