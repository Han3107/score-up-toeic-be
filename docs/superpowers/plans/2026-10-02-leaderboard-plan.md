# Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pre-calculated global leaderboard that tracks user exam results and ranks them by average score and total completed exams.

**Architecture:** Create `ExamResult` and `UserLeaderboard` schemas in Mongoose. A new `ExamResults` module will handle submissions and atomically upsert the `UserLeaderboard` stats. A new `Leaderboards` module will serve the paginated, sorted leaderboard.

**Tech Stack:** NestJS, Mongoose, TypeScript

**Spec:** docs/superpowers/specs/2026-10-02-leaderboard-design.md

## Global Constraints

- NestJS Version 11 conventions (using `@nestjs/mongoose`, `@nestjs/common`, etc.).
- REST API versioning (`version: '1'`).
- Auth via `@UseGuards(AuthGuard('jwt'))`.
- Pagination should use the existing `infinityPagination` utility and `InfinityPaginationResponseDto`.
- Use existing `RoleEnum` if checking admin privileges, though these endpoints are generally for all users.

## Review Focus

- Invalid `score` input (e.g., negative or non-numeric) is accepted. (Expected: 400 Bad Request, must validate `isNumber` and `min(0)`). -> Handled in Task 1 test.
- `examId` does not reference an existing TOEIC test. (Expected: 404 Not Found or 400 Bad Request on submission). -> Handled in Task 1 test.
- Race conditions when a user submits multiple exams simultaneously (Expected: `UserLeaderboard` accurately reflects total and average). -> Mongoose atomic `$inc` and `$set` or handled sequentially. (Task 1).
- Pagination params are out of bounds (e.g. limit 1000). (Expected: bounded limit, existing `infinityPagination` logic applies max). -> Handled in Task 2 test.
- Leaderboard includes users with 0 exams. (Expected: `UserLeaderboard` should only be created when an exam is submitted, so >0 exams). -> Verified in Task 2.

---

### Task 1: Exam Results Module & Leaderboard Upsert

**Files:**
- Create: `src/exam-results/domain/exam-result.ts`
- Create: `src/exam-results/infrastructure/persistence/document/entities/exam-result.schema.ts`
- Create: `src/leaderboards/domain/user-leaderboard.ts`
- Create: `src/leaderboards/infrastructure/persistence/document/entities/user-leaderboard.schema.ts`
- Create: `src/exam-results/dto/create-exam-result.dto.ts`
- Create: `src/exam-results/exam-results.service.ts`
- Create: `src/exam-results/exam-results.controller.ts`
- Create: `src/exam-results/exam-results.module.ts`
- Create: `test/exam-results/exam-results.e2e-spec.ts`

**Interfaces:**
- Consumes: `AuthGuard` from passport, `ToeicTestsService` to validate `examId`.
- Produces: `POST /v1/exam-results` endpoint.

- [ ] **Step 1: Write the failing e2e test for exam submission**
```typescript
it('POST /v1/exam-results should create result and update leaderboard stats', async () => {
    // Assert 201 Created and response structure
    // Assert 400 on invalid score
})
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test:e2e -- test/exam-results/exam-results.e2e-spec.ts`
Expected: FAIL with 404 Not Found (endpoint does not exist)

- [ ] **Step 3: Define Domain and Schema for `ExamResult` and `UserLeaderboard`**
`ExamResult` schema needs `userId` (ObjectId), `examId` (ObjectId), `score` (Number).
`UserLeaderboard` schema needs `userId` (ObjectId, unique), `averageScore` (Number), `totalCompletedExams` (Number). Add compound index on `averageScore: -1` and `totalCompletedExams: -1`.

- [ ] **Step 4: Implement `CreateExamResultDto`**
Include `@IsMongoId() examId`, `@IsNumber() @Min(0) score`.

- [ ] **Step 5: Implement `ExamResultsService.create`**
```typescript
async create(userId: string, createDto: CreateExamResultDto) {
   // Validate examId exists via toeicTestsService
   // Insert ExamResult
   // Fetch current UserLeaderboard for user
   // Calculate new stats (newTotal = old + 1, newAverage = ((oldAvg * oldTotal) + newScore) / newTotal)
   // Upsert UserLeaderboard with new stats
}
```

- [ ] **Step 6: Implement `ExamResultsController.create`**
Define `POST /v1/exam-results`. Extract `userId` from `req.user.id`. Call service.

- [ ] **Step 7: Register `ExamResultsModule` in `AppModule`**

- [ ] **Step 8: Run test to verify it passes**
Run: `npm run test:e2e -- test/exam-results/exam-results.e2e-spec.ts`
Expected: PASS

- [ ] **Step 9: Commit**
```bash
git add .
git commit -m "feat(exam-results): add submit exam result and update stats"
```

### Task 2: Leaderboards Module

**Files:**
- Create: `src/leaderboards/leaderboards.service.ts`
- Create: `src/leaderboards/leaderboards.controller.ts`
- Create: `src/leaderboards/leaderboards.module.ts`
- Modify: `src/app.module.ts` (Import LeaderboardsModule)
- Create: `test/leaderboards/leaderboards.e2e-spec.ts`

**Interfaces:**
- Consumes: `UserLeaderboard` schema, `infinityPagination` utility.
- Produces: `GET /v1/leaderboards` endpoint.

- [ ] **Step 1: Write the failing e2e test for leaderboard retrieval**
```typescript
it('GET /v1/leaderboards should return paginated leaderboard sorted by stats', async () => {
    // Assert 200 OK and structure matches InfinityPaginationResponseDto
})
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test:e2e -- test/leaderboards/leaderboards.e2e-spec.ts`
Expected: FAIL with 404 Not Found

- [ ] **Step 3: Implement `LeaderboardsService.findAll`**
Query `UserLeaderboardModel`. Sort by `{ averageScore: -1, totalCompletedExams: -1 }`. Apply `skip` and `limit`. Populate `userId` (select `firstName`, `lastName`, `photo`). Return paginated result.

- [ ] **Step 4: Implement `LeaderboardsController.findAll`**
Define `GET /v1/leaderboards`. Accept `page` and `limit` queries. Format output using `infinityPagination()`.

- [ ] **Step 5: Register `LeaderboardsModule` in `AppModule`**

- [ ] **Step 6: Run test to verify it passes**
Run: `npm run test:e2e -- test/leaderboards/leaderboards.e2e-spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**
```bash
git add .
git commit -m "feat(leaderboards): add get leaderboard endpoint"
```
