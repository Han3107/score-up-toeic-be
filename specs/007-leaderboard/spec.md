# Leaderboard Feature Specification

## 1. Overview
The Leaderboard feature allows users to view the ranking of participants across the entire system. Rankings are based primarily on the user's average exam score, and secondarily on their total number of completed exams. To support this, the system will also introduce a mechanism to track exam results upon submission.

## 2. Goals & Success Criteria
- **Goal:** Provide a fast, accurate global leaderboard ranking users by average score and total completed exams.
- **Success Criteria:**
  - Users can view the paginated leaderboard.
  - The API responds quickly even with a large number of users and exam results.
  - Submitting an exam automatically updates the user's leaderboard statistics in real-time.

## 3. Architecture & Data Model (Pre-calculated Stats Approach)
We use a pre-calculated stats approach to ensure the leaderboard query is highly performant.

### 3.1. `ExamResult` Collection
Stores the history of all submitted exams.
- `_id`: ObjectId
- `userId`: ObjectId (Ref to User)
- `examId`: ObjectId (Ref to ToeicTest)
- `score`: Number
- `createdAt`: Date
- `updatedAt`: Date

### 3.2. `UserLeaderboard` Collection
Stores pre-calculated stats for the leaderboard. Separating this from the `User` collection keeps the core user object lightweight and optimizes leaderboard sorting.
- `_id`: ObjectId
- `userId`: ObjectId (Ref to User, Unique, Indexed)
- `averageScore`: Number (Indexed: -1)
- `totalCompletedExams`: Number (Indexed: -1)
- `createdAt`: Date
- `updatedAt`: Date

*Compound Index:* `{ averageScore: -1, totalCompletedExams: -1 }` for optimal sorting.

## 4. API Endpoints

### 4.1. Submit Exam Result
- **Method:** `POST /v1/exam-results`
- **Auth:** Required (JWT)
- **Request Body:**
  ```json
  {
    "examId": "string",
    "score": "number"
  }
  ```
- **Response:** `201 Created` with the newly created `ExamResult` object.
- **Logic:**
  1. Validate `examId`.
  2. Insert record into `ExamResult`.
  3. Fetch the current `UserLeaderboard` record for the user (or default to 0 if not exists).
  4. Calculate new stats:
     - `newTotalCompletedExams = oldTotalCompletedExams + 1`
     - `newAverageScore = ((oldAverageScore * oldTotalCompletedExams) + newScore) / newTotalCompletedExams`
  5. Upsert the new stats into `UserLeaderboard`.

### 4.2. Get Leaderboard
- **Method:** `GET /v1/leaderboards`
- **Auth:** Optional / Required (depending on system policy, typically JWT/Anonymous allowed)
- **Query Params:**
  - `page`: number (default: 1)
  - `limit`: number (default: 10, max: 50)
- **Response:** `200 OK` with paginated `UserLeaderboard` entries (populated with user name/avatar if needed).
- **Logic:**
  1. Query `UserLeaderboard` collection.
  2. Sort by `averageScore` DESC, then `totalCompletedExams` DESC.
  3. Apply pagination (`skip`, `limit`).
  4. Populate user details (e.g., `firstName`, `lastName`) for display.

## 5. Security & Constraints
- Only authenticated users can submit exam results.
- `score` must be a valid number (e.g., between 0 and 990 for TOEIC, or 0-100 depending on the grading scale).
- Transactions (if using a Replica Set in MongoDB) could be considered to ensure `ExamResult` insertion and `UserLeaderboard` update occur atomically, but basic atomic upserts are sufficient for most loads.

## 6. Open Questions
- What is the maximum possible score for validation? (Assume standard TOEIC max 990 or generic number, will validate as `isNumber()` and `min(0)`).
