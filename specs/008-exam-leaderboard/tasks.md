# Implementation Tasks: Exam Leaderboard

**Feature**: Exam Leaderboard
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create `leaderboards` module files (`leaderboards.module.ts`, `leaderboards.controller.ts`, `leaderboards.service.ts`) in `src/modules/leaderboards/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Update `User` Mongoose schema in `src/modules/users/schemas/user.schema.ts` to include `leaderboardStats` object containing `averageScore` (Number, default 0), `totalCompletedExams` (Number, default 0), and `lastExamCompletedAt` (Date)
- [X] T011 [P] Create a compound database index on `leaderboardStats.averageScore` (-1), `leaderboardStats.totalCompletedExams` (-1), and `leaderboardStats.lastExamCompletedAt` (1) in `src/modules/users/schemas/user.schema.ts` to guarantee <2s read performance (SC-002)
- [X] T003 Import `UsersModule` into `LeaderboardsModule` in `src/modules/leaderboards/leaderboards.module.ts` to allow querying users

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Leaderboard Ranking (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to view the leaderboard so that I can see how my exam performance compares to other participants.

**Independent Test**: Can be fully tested by making a `GET` request to `/api/v1/leaderboards/exams` and verifying that users are listed with their rank, name, average score, and total completed exams.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T004 [P] [US1] Create integration test for `GET /api/v1/leaderboards/exams` in `test/integration/leaderboards.e2e-spec.ts`

### Implementation for User Story 1

- [X] T005 [P] [US1] Implement `getExamLeaderboard` method in `src/modules/leaderboards/services/leaderboards.service.ts` using Mongoose `.find({ 'leaderboardStats.totalCompletedExams': { $gt: 0 } })` and `.sort({ 'leaderboardStats.averageScore': -1, 'leaderboardStats.totalCompletedExams': -1, 'leaderboardStats.lastExamCompletedAt': 1 })`
- [X] T006 [US1] Implement `GET /api/v1/leaderboards/exams` endpoint in `src/modules/leaderboards/controllers/leaderboards.controller.ts` with pagination (page, limit) and mapping results to the contract format (including rank calculation and empty state message)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (using mocked or manually seeded DB data)

---

## Phase 4: User Story 2 - Real-time Ranking Updates (Priority: P2)

**Goal**: As a participant, I want my rank to update as soon as I complete a new exam.

**Independent Test**: Can be independently tested by completing a new exam and verifying the DB is updated, and the leaderboard reflects the new score and rank.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T007 [P] [US2] Add unit tests for `ExamsService` stats recalculation logic in `src/modules/exams/services/exams.service.spec.ts`

### Implementation for User Story 2

- [X] T008 [US2] Update exam completion logic in `src/modules/exams/services/exams.service.ts` to recalculate and save `averageScore`, increment `totalCompletedExams`, and update `lastExamCompletedAt` on the `User` document when an exam's status becomes 'completed'

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. The entire leaderboard flow is now end-to-end complete.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T009 Code cleanup, ensure proper Swagger/OpenAPI decorators on the controller in `src/modules/leaderboards/controllers/leaderboards.controller.ts`
- [X] T010 Run quickstart.md validation manually to ensure all acceptance criteria are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates implicitly by populating the data that US1 consumes

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Services before endpoints
- Story complete before moving to next priority

### Parallel Opportunities

- Tests (T004, T007) can be written in parallel with Foundational phase or Service implementation (T005)

---

## Parallel Example: User Story 1

```bash
# Developer A writes the integration test
Task: "T004 [P] [US1] Create integration test for GET /api/v1/leaderboards/exams"

# Developer B works on the service logic concurrently
Task: "T005 [P] [US1] Implement getExamLeaderboard method in leaderboards.service.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Seed database manually and test User Story 1 independently to ensure the endpoint returns correct data.

### Incremental Delivery

1. Complete Setup + Foundational
2. Implement User Story 1 (Read path) - MVP
3. Implement User Story 2 (Write path) - Automates the data population
4. Final validation using `quickstart.md`

## Phase 6: Convergence

- [X] T012 Create `ExamsModule` in `src/exams/exams.module.ts` to export `ExamsService`, and import it into `AppModule` per T008 (missing)
- [X] T013 Add `@UseGuards(AuthGuard('jwt'))` to `LeaderboardsController` in `src/leaderboards/controllers/leaderboards.controller.ts` per contracts/api.md (partial)
