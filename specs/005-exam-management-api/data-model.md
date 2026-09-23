# Data Model: TOEIC Exam Management API

The project uses dual persistence (TypeORM and Mongoose). All entities must be created via the provided CLI generators (`npm run generate:resource:*`).

## Entities

### `ToeicTest` (Exam)
Represents a full TOEIC test package.

**Fields**:
- `id`: UUID / ObjectId (Auto-generated)
- `title`: String, Required (e.g., "TOEIC Practice Test 1")
- `description`: String, Optional
- `category`: String, Optional (e.g., "Reading", "Listening", "Full Test")
- `status`: Enum (String) `['DRAFT', 'PUBLISHED', 'HIDDEN']`, Default: `'DRAFT'`
- `createdAt`, `updatedAt`, `deletedAt`: Date (Supports Soft Delete)

**Relationships**:
- One-to-Many with `QuestionGroup`
- One-to-Many with `Question` (for standalone questions not in a group)

### `QuestionGroup`
Represents a shared stimulus for a group of questions (e.g., a reading passage or audio file).

**Fields**:
- `id`: UUID / ObjectId
- `examId`: Relational ID to `ToeicTest`, Required
- `title`: String, Optional (e.g., "Questions 153-154")
- `passageText`: String, Optional (The reading passage)
- `audioUrl`: String, Optional (URL to the audio file)
- `imageUrl`: String, Optional (URL to an image stimulus)
- `orderIndex`: Integer (Used to order groups within the exam)
- `createdAt`, `updatedAt`

**Relationships**:
- Many-to-One with `ToeicTest`
- One-to-Many with `Question`

### `Question`
Represents an individual test question.

**Fields**:
- `id`: UUID / ObjectId
- `examId`: Relational ID to `ToeicTest`, Required
- `groupId`: Relational ID to `QuestionGroup`, Optional (Null if standalone)
- `prompt`: String, Required (The question text itself)
- `options`: JSON / Array of Strings, Required (Always has options, e.g., A, B, C, D)
- `correctAnswer`: String, Required (The correct option)
- `explanation`: String, Optional (Explanation of the correct answer)
- `orderIndex`: Integer (Used to order questions within the exam or group)
- `createdAt`, `updatedAt`

**Relationships**:
- Many-to-One with `ToeicTest`
- Many-to-One with `QuestionGroup`

## Validations & Constraints

- `Question` must always have valid `options` and a `correctAnswer` that exists within the `options`.
- `ToeicTest` deletion must be a soft delete (`deletedAt = now()`) to preserve data integrity for existing exam attempts.
- Students fetching the exam list must only see `ToeicTest` records where `status = 'PUBLISHED'` and `deletedAt IS NULL`.
