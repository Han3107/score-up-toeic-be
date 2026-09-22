# Research: Categories Module

## 1. Multi-Database Pagination (TypeORM & Mongoose)
- **Decision**: Use a standard pagination DTO (e.g., `page`, `limit`) and apply it in the service layer using `skip` and `take` for TypeORM, and `skip()` / `limit()` for Mongoose.
- **Rationale**: The spec requires pagination for fetching lists (Admin & Learner). A standard response format like `{ data: [...], meta: { total, page, limit } }` will be used.
- **Alternatives considered**: Cursor-based pagination (unnecessary for standard admin categories).

## 2. Sequence Generation
- **Decision**: When creating a new category without a sequence, the service will query the database for the max sequence value: `SELECT MAX(sequence) FROM categories` (TypeORM) or `db.categories.find().sort({sequence: -1}).limit(1)` (Mongoose). If no records exist, default to 1. 
- **Rationale**: Clarification states sequence should default to Max + 1. Since it's an admin operation, simple aggregate/sort queries are sufficient.

## 3. Unique Name Constraint & Sync-Defaults Idempotency
- **Decision**: 
  - Add `@Unique(['name'])` in TypeORM and `@Prop({ unique: true })` in Mongoose.
  - For `sync-defaults`, fetch existing categories by name first. Filter out those that already exist, and only insert the missing ones.
- **Rationale**: Spec explicitly states to skip existing categories without duplicating and preserve Admin edits.

## 4. Hard Delete implementation
- **Decision**: Use standard DELETE commands (`repository.delete(id)` / `model.deleteOne()`), completely removing records from the database. Prior to deletion, the system must check for linked exams (ExamsModule dependency) and abort if dependencies exist.
- **Rationale**: Clarification specifies hard deletion rather than soft deletion (`deletedAt`).
