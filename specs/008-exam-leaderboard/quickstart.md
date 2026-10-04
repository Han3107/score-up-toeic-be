# Quickstart Validation: Exam Leaderboard

This guide outlines how to manually validate the Exam Leaderboard feature end-to-end.

## Prerequisites
- Backend service running locally or in a dev environment.
- Authenticated user token (Bearer).
- Access to the database (MongoDB) to verify data updates.

## Validation Scenarios

### 1. View Empty Leaderboard
- **Action**: Make a `GET` request to `/api/v1/leaderboards/exams` before any user has completed an exam.
- **Expected Outcome**: Returns HTTP 200 with an empty `items` array and a `message` stating "No ranked players yet".

### 2. Update Leaderboard on Exam Completion
- **Action**: Simulate a user completing an exam (via the existing submit exam endpoint) with a score of 80.
- **Expected Outcome**:
  - The User's document in the DB is updated with `leaderboardStats` (average: 80, count: 1).
  - Make a `GET` request to the leaderboard endpoint. The user should appear at rank 1 with an average score of 80 and 1 completed exam.

### 3. Tie-breaking Logic
- **Action**: Simulate User A and User B both having an average score of 90 and exactly 5 completed exams. User A completes their 5th exam before User B.
- **Expected Outcome**: 
  - Make a `GET` request to the leaderboard endpoint.
  - User A is ranked higher (e.g., Rank 1) than User B (e.g., Rank 2) because User A achieved the score first (earlier `lastExamCompletedAt` timestamp).

### 4. Pagination
- **Action**: Create 55 simulated users with completed exams in the DB. Make a `GET` request to `/api/v1/leaderboards/exams?page=1&limit=50`.
- **Expected Outcome**: Returns the top 50 users. `meta.totalItems` should be 55, and `meta.totalPages` should be 2.
- **Action**: Make a `GET` request to `/api/v1/leaderboards/exams?page=2&limit=50`.
- **Expected Outcome**: Returns the remaining 5 users.
