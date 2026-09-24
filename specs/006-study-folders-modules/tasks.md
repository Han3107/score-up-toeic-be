---
description: "Task list for feature implementation"
---

# Tasks: study-folders-modules

**Input**: Design documents from `/specs/006-study-folders-modules/`

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md, quickstart.md, research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify database connections for PostgreSQL and MongoDB in boilerplate configuration.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Ensure project generator tools are available and configured (e.g., `npm run generate:resource:relational` and document equivalents) for creating resources.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Manage Study Folders (Priority: P1) 🎯 MVP

**Goal**: Users can create, view, update, and delete their personal study folders so that they can organize learning materials.

**Independent Test**: Can be fully tested by creating a folder, verifying it appears in the user's folder list, updating its name, and deleting it, all without needing to add modules to it.

### Implementation for User Story 1

- [x] T003 [P] [US1] Run boilerplate generator to create the `folders` resource (producing standard controller, service, dto, entity, schema files) in `src/modules/folders`.
- [x] T004 [US1] Update `StudyFolder` entities and schemas to include fields: `title` (Required, max length 255), `description` (Optional), `userId` (Required, Indexed for tenant isolation), and `deletedAt` (Timestamp, Nullable, used for soft deletes) in `src/modules/folders/entities/folder.entity.ts` and `src/modules/folders/schemas/folder.schema.ts`.
- [x] T005 [US1] Implement DTO validations for Create and Update Folder (validating required titles and lengths: max 255 for title, max 1000 for description) in `src/modules/folders/dto/create-folder.dto.ts` and `update-folder.dto.ts`.
- [x] T006 [US1] Implement standard CRUD operations in `src/modules/folders/folders.service.ts` ensuring operations are isolated by `userId`.
- [x] T007 [US1] Implement pagination (page, limit) for `GET /api/v1/folders` in `src/modules/folders/folders.controller.ts` and service.
- [x] T008 [US1] Implement soft delete logic for `DELETE /api/v1/folders/:id` (including cascading soft-delete to its modules) and add restoration endpoint `POST /api/v1/folders/:id/restore` in `src/modules/folders/folders.controller.ts` and service.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Vocabulary Study Modules (Priority: P1)

**Goal**: Users can create, view, update, and delete vocabulary study modules so that they can manage lists of words and definitions.

**Independent Test**: Can be fully tested by creating a standalone module with some terms, retrieving it, updating the terms, and deleting it.

### Implementation for User Story 2

- [x] T009 [P] [US2] Run boilerplate generator to create the `vocabulary-modules` resource in `src/modules/vocabulary-modules`.
- [x] T010 [US2] Update `VocabularyModule` entities/schemas to include fields: `title` (Required, max length 255), `description` (Optional), `userId` (Required), `folderId` (UUID/ObjectId, Optional), `terms` (Array of VocabularyTerm objects), and `deletedAt` (Timestamp, Nullable) in `src/modules/vocabulary-modules/entities/vocabulary-module.entity.ts` and schema equivalents.
- [x] T011 [US2] Implement DTO validations for creating/updating modules in `src/modules/vocabulary-modules/dto/create-vocabulary-module.dto.ts` (validating title max 255, description max 1000, term max 255). **Constraint**: "System MUST enforce a maximum limit of 500 vocabulary terms per Vocabulary Module."
- [x] T012 [US2] Implement basic CRUD operations, ensuring tenant isolation (`userId`), in `src/modules/vocabulary-modules/vocabulary-modules.service.ts`.
- [x] T013 [US2] Implement pagination for `GET /api/v1/modules` in `src/modules/vocabulary-modules/vocabulary-modules.controller.ts` and service.
- [x] T014 [US2] Implement random ordering for `GET /api/v1/modules/:id?random=true` in `src/modules/vocabulary-modules/vocabulary-modules.service.ts`.
- [x] T015 [US2] Implement soft delete logic and restoration endpoint `POST /api/v1/modules/:id/restore` in `src/modules/vocabulary-modules/vocabulary-modules.controller.ts` and service.
- [x] T016 [US2] Implement clone mechanism `POST /api/v1/modules/:id/clone` (accepting and validating a target `folderId`, and performing deep copy of the module and its terms) in `src/modules/vocabulary-modules/vocabulary-modules.service.ts`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Organize Modules within Folders (Priority: P2)

**Goal**: Users can assign vocabulary modules to specific folders so that study materials are categorized.

**Independent Test**: Can be fully tested by creating a folder, creating a module, linking them, and retrieving the folder to verify the module is included.

### Implementation for User Story 3

- [x] T017 [US3] Update folder retrieval logic to optionally include or fetch nested modules when retrieving a folder in `src/modules/folders/folders.service.ts`.
- [x] T018 [US3] Implement validation to ensure `folderId` exists and belongs to the user when creating or updating a module to belong to a folder in `src/modules/vocabulary-modules/vocabulary-modules.service.ts`.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T019 Implement background Cron Job (e.g., using `@nestjs/schedule`) to permanently hard-delete folders and modules that have been soft-deleted for more than 15 days (FR-009).
- [x] T020 Run `quickstart.md` validation scripts against the running application to confirm end-to-end functionality.
- [x] T021 Implement a basic load/performance test script (e.g., using Artillery or k6) to validate that API response times are under 500ms (SC-001).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** & **Foundational (Phase 2)**: BLOCKS all user stories.
- **User Stories (Phase 3+)**: US1 and US2 can proceed in parallel since they involve separate base resources. US3 depends on both US1 and US2 being completed.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Within Each User Story

- Run generator tasks first.
- Update Entities/Schemas.
- Implement DTO validations.
- Implement Service logic.
- Connect via Controller.

### Parallel Opportunities

- T003 (US1 Generator) and T009 (US2 Generator) can be run concurrently.
- Once generated, US1 and US2 service/controller implementations can be built simultaneously by different engineers.

---

## Parallel Example: User Stories 1 & 2

```bash
# Launch generators in parallel:
Task: "Run boilerplate generator to create the `folders` resource"
Task: "Run boilerplate generator to create the `vocabulary-modules` resource"

# Implement isolated entities in parallel:
Task: "Update StudyFolder entities and schemas"
Task: "Update VocabularyModule entities/schemas"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundation.
2. Complete Phase 3: User Story 1 (Manage Folders).
3. **STOP and VALIDATE**: Test Folders API independently.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 (Folders) → Test independently.
3. Add User Story 2 (Modules) → Test independently.
4. Add User Story 3 (Organization) → Test integration between Folders and Modules.
5. Polish and Run Quickstart Validations.

## Phase 7: Convergence

- [x] T022 Update `StudyFolder` entities and schemas to add fields (title, description, userId, deletedAt) per US1/FR-001 (missing)
- [x] T023 Implement `StudyFolder` DTO validations (titles, lengths) per US1/FR-006 (missing)
- [x] T024 Enforce `userId` tenant isolation for `Folder` CRUD operations per US1/FR-005 (missing)
- [x] T025 Implement `Folder` soft delete logic, cascade, and restore endpoint per US1/FR-008 (missing)
- [x] T026 Update `VocabularyModule` entities and schemas to add fields (title, description, userId, folderId, terms, deletedAt) per US2/FR-003 (missing)
- [x] T027 Implement `VocabularyModule` DTO validations (titles, terms max 500) per US2/FR-006/FR-012 (missing)
- [x] T028 Enforce `userId` tenant isolation for `VocabularyModule` CRUD operations per US2/FR-005 (missing)
- [x] T029 Implement random ordering for modules retrieval per US2/FR-011 (missing)
- [x] T030 Implement `VocabularyModule` soft delete logic and restore endpoint per US2/FR-008 (missing)
- [x] T031 Implement `VocabularyModule` clone mechanism with target folder validation per US2/FR-010 (missing)
- [x] T032 Include nested modules in folder retrieval per US3/FR-004 (missing)
- [x] T033 Add `folderId` ownership validation on module create/update per US3/FR-004 (missing)
- [x] T034 Implement background Cron Job for permanent hard-delete after 15 days per FR-009 (missing)
- [x] T035 Create basic load/performance test script to validate API <500ms per SC-001 (missing)
- [x] T036 Run quickstart.md validation scripts per Cross-Cutting Concerns (missing)

## Phase 8: Convergence

- [x] T037 Implement cascading soft-delete logic for modules when a folder is deleted per FR-008/T025 (partial)
- [x] T038 Enforce `userId` tenant isolation for `VocabularyModule` CRUD operations per FR-005/T028 (missing)
- [x] T039 Implement `VocabularyModule` soft delete logic and restore endpoint per FR-008/T030 (missing)
- [x] T040 Implement `VocabularyModule` clone mechanism with target folder validation per FR-010/T031 (missing)
- [x] T041 Implement random ordering for modules retrieval per FR-011/T029 (missing)
- [x] T042 Include nested modules in folder retrieval per FR-004/T032 (missing)
- [x] T043 Add `folderId` ownership validation on module create/update per FR-004/T033 (missing)
- [x] T044 Implement background Cron Job for permanent hard-delete after 15 days per FR-009/T034 (missing)
- [x] T045 Create basic load/performance test script to validate API <500ms per SC-001/T035 (missing)
- [x] T046 Run quickstart.md validation scripts to confirm end-to-end functionality per T036 (missing)
