# Implementation Plan: TOEIC Exam Management API

**Branch**: `005-exam-management-api` | **Date**: 2026-09-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-exam-management-api/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Implement a full suite of APIs for TOEIC Exam Management. This enables Admins to create, update, and soft-delete exams along with their questions (which can be standalone or grouped by stimuli like reading passages). Students can retrieve paginated lists of available exams and fetch the complete exam payload (questions and groups) to take tests. Dual persistence (PostgreSQL and MongoDB) is maintained via project entity generators.

## Technical Context

**Language/Version**: TypeScript / Node.js

**Primary Dependencies**: NestJS, TypeORM, Mongoose

**Storage**: PostgreSQL (Relational) and MongoDB (Document)

**Testing**: Jest

**Target Platform**: Node.js / Docker

**Project Type**: REST API Web Service

**Performance Goals**: <1s for exam list retrieval, <2s for full exam payload retrieval

**Constraints**: Entities MUST be generated using `npm run generate:resource:*` to maintain dual persistence sync.

**Scale/Scope**: Standard TOEIC exam sizes (e.g., up to 200 questions per exam).

## Constitution Check

*GATE: Passed*

- **Library-First / Generators**: Adhered to (CLI generators mandated for entities).
- **Test-First**: Will follow standard unit/e2e testing practices in NestJS.
- **REST API Principles**: Standard HTTP verbs and status codes used (e.g., 201 for POST, 204 for DELETE, 400 for empty exams).

## Project Structure

### Documentation (this feature)

```text
specs/005-exam-management-api/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── contracts/           
└── tasks.md             
```

### Source Code (repository root)

```text
src/
├── modules/
│   ├── exams/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── schemas/
│   │   ├── exams.controller.ts
│   │   ├── exams.service.ts
│   │   └── exams.module.ts
│   ├── question-groups/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── schemas/
│   │   ├── question-groups.controller.ts
│   │   ├── question-groups.service.ts
│   │   └── question-groups.module.ts
│   └── questions/
│       ├── dto/
│       ├── entities/
│       ├── schemas/
│       ├── questions.controller.ts
│       ├── questions.service.ts
│       └── questions.module.ts
tests/
└── e2e/
    └── exams.e2e-spec.ts
```

**Structure Decision**: The project uses standard NestJS modular architecture. We will generate three main modules using the dual-persistence generator: `exams`, `question-groups`, and `questions`. This keeps the domains separated while allowing relationship binding.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
