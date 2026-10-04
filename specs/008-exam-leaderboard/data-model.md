# Data Model: Exam Leaderboard

## Entities

### User (Existing / Extended)
- **Fields**:
  - `_id`: ObjectId
  - `displayName` (or `nickname` / `name` depending on existing schema): String
  - `leaderboardStats`: Object (New field to store denormalized stats for fast sorting)
    - `averageScore`: Number (Default: 0)
    - `totalCompletedExams`: Number (Default: 0)
    - `lastExamCompletedAt`: Date (Used for tie-breaking)

### Exam Result (Existing)
- **Fields**:
  - `_id`: ObjectId
  - `userId`: ObjectId (Ref to User)
  - `status`: String (e.g., 'completed', 'in-progress')
  - `score`: Number
  - `completedAt`: Date

## State Transitions
- **When Exam is Completed**:
  - Create/Update `Exam Result` with `status = 'completed'`, `score`, and `completedAt = now()`.
  - Trigger update to the `User`'s `leaderboardStats` (transactionally if possible, or via an async event):
    - `totalCompletedExams` += 1
    - `averageScore` = recalculate based on all completed exams (or using running average formula)
    - `lastExamCompletedAt` = `now()`

## Validation Rules
- Leaderboard queries must ONLY consider users where `leaderboardStats.totalCompletedExams > 0`.
- Users with no completed exams are implicitly excluded by the above rule.
- Pagination limit max 50 per page.
