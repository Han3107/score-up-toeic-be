# Implementation Plan: study-folders-modules

**Branch**: `006-study-folders-modules` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-study-folders-modules/spec.md`

## Summary

Implement backend APIs allowing users to manage their personal study folders and vocabulary modules with capabilities like random ordering, soft-delete restoration, and module cloning. Uses the project's TypeORM/Mongoose boilerplate generators.

## Technical Context

**Language/Version**: TypeScript, Node.js (NestJS)

**Primary Dependencies**: NestJS, TypeORM, Mongoose

**Storage**: PostgreSQL (TypeORM) and MongoDB (Mongoose)

**Testing**: Jest (Unit and E2E)

**Target Platform**: Node.js backend server

**Project Type**: web-service (API)

**Performance Goals**: <500ms response time per endpoint

**Constraints**: Max 500 terms per module, 1000 folders/modules per user max

**Scale/Scope**: Private personal collections, standard volume

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No violations detected. Standard practices for the project (REST API, Dual-database repository pattern, clean code) are maintained.

## Project Structure

### Documentation (this feature)

```text
specs/006-study-folders-modules/
├── plan.md              # This file
├── research.md          # Technical decisions and context resolution
├── data-model.md        # Entities definition
├── quickstart.md        # E2E test scripts/curls
├── contracts/
│   └── api.md           # API definitions
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
└── modules/
    ├── folders/             # Generated study folder module
    │   ├── entities/
    │   ├── schemas/
    │   ├── dto/
    │   ├── folders.controller.ts
    │   └── folders.service.ts
    ├── vocabulary-modules/  # Generated vocabulary module (includes term management)
    │   ├── entities/
    │   ├── schemas/
    │   ├── dto/
    │   ├── vocabulary-modules.controller.ts
    │   └── vocabulary-modules.service.ts
    └── ...
```

**Structure Decision**: A standard multi-module NestJS setup. The resource generators will be used to scaffold `folders` and `vocabulary-modules`. The `vocabulary-terms` will likely be nested inside `vocabulary-modules` logic or generated as a sub-resource depending on the generator's capability, but encapsulated mainly inside the module's service boundaries.

## Complexity Tracking

N/A - Standard CRUD flow. No violations.
