# Research & Decisions: TOEIC Exam Management API

## Technical Decisions

### Dual Persistence Requirement
- **Decision**: All entities (`ToeicTest`, `QuestionGroup`, `Question`) MUST be created using the provided CLI generators (`npm run generate:resource:*`).
- **Rationale**: The project explicitly requires maintaining both relational (TypeORM/PostgreSQL) and document (Mongoose/MongoDB) persistence. Hand-writing entities is strictly prohibited.

### Question Grouping (Data Model)
- **Decision**: Introduce a `QuestionGroup` entity.
- **Rationale**: Standard TOEIC tests group multiple questions under a single reading passage or audio file (e.g., Reading Part 6 & 7). Instead of duplicating the passage text for every question or using self-referential links, a dedicated group entity properly normalizes the data.
- **Alternatives considered**: Adding a `parentId` to `Question` or duplicating the content on every `Question`. Rejected because a separate entity provides clearer semantics and cleaner DTOs.

### Deletion Policy
- **Decision**: Implement **Soft Delete** for exams.
- **Rationale**: An exam might already have been taken by students. Hard deleting it would break foreign key constraints or orphan records in the Exam History and Progress module.

### Edge Case: 0-Question Exams
- **Decision**: Return HTTP 400 Bad Request when a student attempts to start an exam with 0 questions.
- **Rationale**: An empty exam is invalid for taking. Returning 400 prevents the frontend from entering an invalid test-taking state.

### Exam Visibility Status
- **Decision**: Exams must support three statuses: `DRAFT`, `PUBLISHED`, and `HIDDEN`.
- **Rationale**: Admins need to create exams in draft mode, publish them when ready, and hide them when they are no longer actively used (without deleting them). Student APIs will only return `PUBLISHED` exams.
