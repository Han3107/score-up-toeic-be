# Implementation Tasks: Categories Module

**Feature Branch**: `004-categories-module`
**Feature Spec**: [spec.md](../spec.md)
**Implementation Plan**: [plan.md](plan.md)

## Phase 1: Setup & Initialization
*Goal: Scaffold the basic module structure.*

- [x] T001 Scaffold `CategoriesModule`, `CategoriesController`, and `CategoriesService` in `src/modules/categories/` (using project's generate CLI or NestJS CLI).

## Phase 2: Foundational (Entities & Schemas)
*Goal: Define dual-database models (TypeORM & Mongoose) ensuring all data constraints are met.*

- [x] T002 [P] Create TypeORM Entity `CategoryEntity` in `src/modules/categories/entities/category.entity.ts`. Constraints: `id` (UUID), `name` (String, Required, max length 255, `@Unique(['name'])`), `description` (String, Optional), `status` (Enum `['ACTIVE', 'HIDDEN']`, Default: `ACTIVE`), `sequence` (Number, non-negative integer). (Skipped - Document DB only for now)
- [x] T003 [P] Create Mongoose Schema `Category` in `src/modules/categories/schemas/category.schema.ts`. Constraints: `_id` (ObjectId), `name` (String, Required, max length 255, `@Prop({ unique: true })`), `description` (String, Optional), `status` (Enum `['ACTIVE', 'HIDDEN']`, Default: `ACTIVE`), `sequence` (Number, non-negative integer).
- [x] T004 Create `CreateCategoryDto` and `UpdateCategoryDto` in `src/modules/categories/dto/` reflecting the data model constraints (using `class-validator`).

## Phase 3: [US1] Administrator manages categories
*Goal: Admin can create, read, update, and hard-delete categories.*
*Independent Test: Log in as admin, create category (sequence auto-generates if omitted), update status, delete (hard delete).*

- [x] T005 [P] [US1] Implement `CategoriesService.create` in `src/modules/categories/categories.service.ts` for both DBs. If `sequence` is omitted, must query DB for `Max+1`. Must catch unique constraint errors on `name` and throw a `409 Conflict` exception to satisfy FR-006.
- [x] T006 [P] [US1] Implement `CategoriesService.findOne`, `update`, and `remove` in `src/modules/categories/categories.service.ts`. `remove` MUST be a hard delete and must check for `ExamsModule` dependencies before deletion (abort with 409 Conflict if linked). This dependency check MUST be decoupled via a service provider token/interface (`IExamsDependencyProvider`) to avoid tight coupling.
- [x] T007 [US1] Implement Admin endpoints (`POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`) in `src/modules/categories/categories.controller.ts` conforming to `contracts/category-api.md`.

## Phase 4: [US2] Public User views available categories
*Goal: Provide a paginated, sequence-sorted list of ACTIVE categories.*
*Independent Test: GET `/` (unauthenticated) returns only ACTIVE categories with `{ data, meta }` pagination format.*

- [x] T008 [US2] Implement `CategoriesService.findAll` in `src/modules/categories/categories.service.ts`. Must support standard pagination (`page`, `limit`), sort by `sequence` ASC. Allow filtering by `status` (Public requests strictly force `status: ACTIVE`).
- [x] T009 [US2] Implement `GET /` endpoint in `src/modules/categories/categories.controller.ts` returning `{ data, meta: { total, page, limit, totalPages } }`. Ensure this endpoint is public (e.g., using `@Public()` or without authentication guards).

## Phase 5: [US3] System synchronizes default categories
*Goal: Fast, idempotent provisioning of standard categories.*
*Independent Test: Call `/sync-defaults` twice. First creates all. Second skips all.*

- [x] T010 [P] [US3] Create `SyncCategoriesDto` in `src/modules/categories/dto/sync-categories.dto.ts` accepting an array of objects: `{ name, description }`.
- [x] T011 [US3] Implement `CategoriesService.syncDefaults` in `src/modules/categories/categories.service.ts`. Logic: Fetch existing categories by provided names. Filter out those that exist. Insert only the missing ones (defaulting `status: ACTIVE` and appending `sequence`).
- [x] T012 [US3] Implement `POST /sync-defaults` endpoint in `src/modules/categories/categories.controller.ts`.

## Phase 6: Polish & Cross-Cutting
*Goal: Secure endpoints and validate end-to-end.*

- [x] T013 [P] Secure Admin endpoints (`POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`, `POST /sync-defaults`) with `@Roles('admin')` guard (or project equivalent) in `src/modules/categories/categories.controller.ts`. Ensure authentication integration is clearly mocked or imported for isolated testing.
- [x] T014 Write e2e tests in `test/categories.e2e-spec.ts` validating the 4 Scenarios documented in `quickstart.md`. Note: Mock the Auth/Role guards appropriately for these tests.
- [x] T015 Set up basic performance benchmark script (e.g., using k6 or Artillery in `test/load/categories-perf.yml`) to validate response times meet SC-001 (<2s for CRUD) and SC-002 (<1s for list).

---

## Dependencies & Execution Order
- Phase 1 must complete first.
- Phase 2 (Entities) blocks all Service and Controller implementation.
- `T002` (TypeORM) and `T003` (Mongoose) can be executed in parallel.
- Phases 3, 4, and 5 can be implemented sequentially, but their underlying service methods (`T005`, `T006`, `T008`, `T011`) can be developed in parallel once Phase 2 is complete.
- Phase 6 (Security & E2E) relies on endpoints existing.

## Implementation Strategy (MVP)
The recommended MVP scope is to complete **Phase 1, Phase 2, and Phase 3 (US1)**. This provides the foundational data structure and allows administrators to populate the system. Public views and sync-defaults can be delivered in a fast follow-up PR.

## Phase 7: Convergence

- [x] T016 Complete E2E test coverage for all quickstart scenarios per `tasks.md:T014` (`partial`). `test/categories.e2e-spec.ts` is missing coverage for Admin CRUD (Scenario 2), Public viewing (Scenario 3), and Unauthorized access protection (Scenario 4).
- [x] T017 Align validation artifacts with public access spec per `spec.md:US2` (`contradicts`). Remove the `LEARNER_TOKEN` requirement from Scenario 3/4 in `quickstart.md` and from `test/load/categories-perf.yml`, ensuring they test genuinely unauthenticated public access.
