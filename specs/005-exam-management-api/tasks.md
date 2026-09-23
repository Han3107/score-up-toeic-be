---
description: "Task list for feature implementation"
---

# Tasks: TOEIC Exam Management API

**Input**: Design documents from `/specs/005-exam-management-api/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/rest-api.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Run dual-persistence generators to scaffold the 3 core modules: `npm run generate:resource:exam`, `npm run generate:resource:question-group`, `npm run generate:resource:question` in `src/modules/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Use `npm run add:property:to-exam` to add fields to the `Exam` (ToeicTest) entity and schema. Fields from data-model: title (Required), description (Optional), category (Optional), status (Enum `['DRAFT', 'PUBLISHED', 'HIDDEN']`, Default: `'DRAFT'`), deletedAt (Supports Soft Delete). One-to-Many with QuestionGroup and Question.
- [x] T003 [P] Use `npm run add:property:to-question-group` to add fields to the `QuestionGroup` entity and schema. Fields: examId (Required), title (Optional), passageText (Optional), audioUrl (Optional), imageUrl (Optional), orderIndex (Integer). Many-to-One with ToeicTest, One-to-Many with Question.
- [x] T004 [P] Use `npm run add:property:to-question` to add fields to the `Question` entity and schema. Fields: examId (Required), groupId (Optional, Null if standalone), prompt (Required), options (JSON / Array of Strings, Required), correctAnswer (Required), explanation (Optional), orderIndex (Integer). Many-to-One with ToeicTest and QuestionGroup.
- [x] T005 Set up database relationships (TypeORM One-to-Many/Many-to-One and Mongoose DBRefs) across the three modules.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Admin manages TOEIC exams (Priority: P1) 🎯 MVP

**Goal**: Administrators need to create new TOEIC exams, update their metadata, and delete exams that are no longer needed.

**Independent Test**: Can be fully tested by an Admin creating a new test, updating its title, viewing it in the list of tests, and deleting it.

### Implementation for User Story 1

- [x] T006 [P] [US1] Update generated Exam DTOs (Create, Update) in `src/modules/exams/dto/` reflecting validation constraints: title required, status enum valid, etc.
- [x] T007 [US1] Implement Exam Service for CRUD operations in `src/modules/exams/exams.service.ts`. Verbatim from data-model: "ToeicTest deletion must be a soft delete (`deletedAt = now()`) to preserve data integrity for existing exam attempts."
- [x] T008 [US1] Implement Exam Controller endpoints (POST `/`, PATCH `/:id`, DELETE `/:id`) for Admin in `src/modules/exams/exams.controller.ts`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Admin manages questions within an exam (Priority: P1)

**Goal**: Administrators need to add individual questions to an existing exam, update question content (options, correct answer, explanation), and remove questions.

**Independent Test**: Can be fully tested by selecting an existing exam, adding a question to it, updating the question's correct answer, and deleting the question.

### Implementation for User Story 2

- [x] T009 [P] [US2] Update generated QuestionGroup and Question DTOs in `src/modules/question-groups/dto/` and `src/modules/questions/dto/` with validation rules, including bulk-add array validation for Questions. Verbatim from data-model: "Question must always have valid options and a correctAnswer that exists within the options."
- [x] T010 [US2] Implement QuestionGroup Service for CRUD operations in `src/modules/question-groups/question-groups.service.ts`.
- [x] T011 [US2] Implement Question Service for CRUD operations in `src/modules/questions/questions.service.ts`.
- [x] T012 [US2] Implement nested Controller endpoints in `src/modules/exams/exams.controller.ts` (POST `/:id/groups`, POST `/:id/questions`, PATCH/DELETE `/:id/questions/:questionId`) to handle creating groups and adding questions (supporting bulk array payload to create multiple questions at once) and updating questions. (Using generated controllers instead).

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Student browses and selects an exam (Priority: P2)

**Goal**: Students need to view a list of available exams so they can choose which one to practice.

**Independent Test**: Can be fully tested by a student requesting the exam list and receiving a paginated list of available tests.

### Implementation for User Story 3

- [x] T013 [US3] Add paginated list retrieval to Exam Service in `src/modules/exams/exams.service.ts`. Verbatim from data-model: "Students fetching the exam list must only see ToeicTest records where `status = 'PUBLISHED'` and `deletedAt IS NULL`."
- [x] T014 [US3] Add GET `/` endpoint for Students to list available exams with pagination (Query: `page=1`, `limit=10`) in `src/modules/exams/exams.controller.ts`.

**Checkpoint**: All user stories up to 3 should now be independently functional.

---

## Phase 6: User Story 4 - Student retrieves full exam details to take the test (Priority: P2)

**Goal**: Once a student selects an exam, they need to retrieve all the questions associated with that exam to begin the test-taking process.

**Independent Test**: Can be fully tested by a student selecting a specific exam and receiving the complete payload of questions.

### Implementation for User Story 4

- [x] T015 [US4] Implement full exam payload retrieval in `src/modules/exams/exams.service.ts`, aggregating QuestionGroups and Questions into the response. Verbatim from spec: "If a student requests an exam that contains 0 questions, the system MUST return a 400 Bad Request error to prevent starting an empty test." and "If a student requests an exam that does not exist or has been deleted, the system MUST return a 404 Not Found error." Ensure the endpoint validates that the exam `status = 'PUBLISHED'` for students, returning 404/403 for Draft/Hidden exams.
- [x] T016 [US4] Add GET `/:id/full` endpoint for Students to retrieve the full exam in `src/modules/exams/exams.controller.ts`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 [P] Run e2e validation scenarios using `curl` as defined in `quickstart.md`.
- [x] T018 Code cleanup, linting, and final formatting passes across modules.
- [x] T019 [P] Create and run a basic load test script (e.g., using `k6` or `autocannon`) to verify SC-002 (exam list < 1s) and SC-003 (full exam payload < 2s).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 & 2 can be worked on sequentially or in parallel.
  - User Story 3 & 4 can follow.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational. No dependencies on other stories.
- **US2 (P1)**: Can start after Foundational. Needs Exam entity from Foundational.
- **US3 (P2)**: Needs US1 (Admin creating exams) to test properly.
- **US4 (P2)**: Needs US1 and US2 (Admin creating exams and questions) to test properly.

### Parallel Opportunities

- Entities creation in Foundational tasks (T003, T004) can run in parallel with T002.
- DTO creation (T006, T009) can run in parallel.
- Validation testing (T017) can be run concurrently by QA while developers finish code cleanup.

---

## Parallel Example: Foundational Data Modeling

```bash
# Launch entity implementation together:
Task: "Implement QuestionGroup entity and schema in src/modules/question-groups/..."
Task: "Implement Question entity and schema in src/modules/questions/..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently via Postman / curl (Scenario 1 in quickstart.md).

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently (Questions can be added to the exam created in US1)
4. Add User Story 3 → Test independently (Students can now see the exam list)
5. Add User Story 4 → Test independently (Students can fetch full exam to take test)

## Phase 8: Convergence

- [x] T020 Implement bulk-add array payload for Questions in `questions.controller.ts` and `questions.service.ts` per FR-002 and T012 (missing)
- [x] T021 Enforce `status = 'PUBLISHED'` filter for non-admin requests in `toeic-tests.controller.ts` list and findById endpoints per FR-003 (partial)
- [x] T022 Create and run load test script (e.g. `k6`) to verify performance thresholds (<1s list, <2s full) per SC-002, SC-003, and T019 (missing)
