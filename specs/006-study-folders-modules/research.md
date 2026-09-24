# Research & Technical Decisions

## Technical Context Resolution

All aspects of the technical context have been resolved based on the existing `CLAUDE.md` and repository setup:
- **Language & Framework**: TypeScript / NestJS.
- **Persistence**: Both TypeORM (PostgreSQL) and Mongoose (MongoDB) support required simultaneously via project generators.
- **Generators**: `npm run generate:resource:*` must be used to scaffold modules, entities, schemas, DTOs, and migrations.

## Key Decisions

### 1. Soft Delete Implementation
- **Decision**: Utilize standard `deletedAt` timestamp pattern in both TypeORM and Mongoose.
- **Rationale**: Meets the FR-008 requirement for restoring items within 15 days. A cron job (or scheduled task) can handle the 15-day hard deletion cleanup (FR-009). TypeORM supports `@DeleteDateColumn()` natively.
- **Alternatives**: Status enums (`status = 'DELETED'`), but timestamp gives exact time of deletion for the 15-day calculation.

### 2. Copy/Clone Mechanism (FR-010)
- **Decision**: Implement a custom service method `cloneModule` that performs a deep copy of the `VocabularyModule` and all its `VocabularyTerm`s, generating new IDs and assigning them to the target `FolderID` and the requesting user.
- **Rationale**: Simple and keeps logic encapsulated in the backend without requiring the client to fetch and re-submit all terms.
- **Alternatives**: Client-side duplication (rejected due to network overhead and trust boundary).

### 3. Maximum Term Limit Enforcement (FR-012)
- **Decision**: Enforce at the application layer within the service logic and validation pipes (e.g., when adding terms or cloning).
- **Rationale**: Database constraints are too rigid for count-based limits. Application logic is flexible and can return standard 400 Bad Request responses.

### 4. Randomization (FR-011)
- **Decision**: Add a query parameter `?random=true` to the `GET /modules/:id/terms` endpoint. If true, the backend will shuffle the terms before returning, OR rely on the client to shuffle.
- **Rationale**: Shuffling in the backend for a max of 500 items is O(N) and extremely fast. Returning randomly sorted results directly is very convenient for client study apps.
