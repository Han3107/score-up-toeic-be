# REST API Contracts: Exam Management

Base Path: `/api/v1/exams` (Assuming standard prefix, adjust based on project conventions)

## Admin Endpoints (Requires Admin Role)

### 1. Create Exam
- **Endpoint**: `POST /`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "title": "TOEIC Practice 1",
    "description": "Full TOEIC practice test",
    "category": "Full Test"
  }
  ```
- **Response** (201 Created):
  Returns the created `ToeicTest` object (status defaults to `DRAFT`).

### 2. Update Exam Metadata
- **Endpoint**: `PATCH /:id`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "status": "PUBLISHED"
  }
  ```
- **Response** (200 OK)

### 3. Delete Exam (Soft Delete)
- **Endpoint**: `DELETE /:id`
- **Auth**: Admin
- **Response** (204 No Content)

### 4. Add Question Group
- **Endpoint**: `POST /:id/groups`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "title": "Questions 153-154",
    "passageText": "This is the reading passage...",
    "audioUrl": null,
    "orderIndex": 1
  }
  ```
- **Response** (201 Created): Returns `QuestionGroup`

### 5. Add Question to Exam (or Group)
- **Endpoint**: `POST /:id/questions`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "groupId": "uuid-if-part-of-group", 
    "prompt": "What is the main topic?",
    "options": ["A. Topic 1", "B. Topic 2", "C. Topic 3", "D. Topic 4"],
    "correctAnswer": "A. Topic 1",
    "explanation": "Because it says so in the first line.",
    "orderIndex": 1
  }
  ```
- **Response** (201 Created): Returns `Question`

### 6. Update/Delete Question
- **Endpoint**: `PATCH /:id/questions/:questionId`
- **Endpoint**: `DELETE /:id/questions/:questionId`
- **Auth**: Admin

## Student Endpoints (Requires Student/User Role)

### 7. List Available Exams (Paginated)
- **Endpoint**: `GET /`
- **Auth**: Public (No Auth Required)
- **Query Params**: `page=1`, `limit=10`
- **Response** (200 OK):
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "TOEIC Practice 1",
        "description": "Full TOEIC practice test",
        "category": "Full Test",
        "status": "PUBLISHED"
      }
    ],
    "meta": { "total": 1, "page": 1, "limit": 10 }
  }
  ```
  *(Only returns exams with `status === 'PUBLISHED'` and `deletedAt IS NULL`)*

### 8. Get Full Exam Details (Start Test)
- **Endpoint**: `GET /:id/full`
- **Auth**: Authenticated User
- **Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "title": "TOEIC Practice 1",
    "groups": [
      {
        "id": "group-uuid",
        "passageText": "...",
        "questions": [
           {
             "id": "question-uuid",
             "prompt": "...",
             "options": ["A", "B", "C", "D"]
           }
        ]
      }
    ],
    "standaloneQuestions": [
       {
         "id": "q2-uuid",
         "prompt": "...",
         "options": ["A", "B", "C", "D"]
       }
    ]
  }
  ```
- **Error Responses**:
  - `404 Not Found`: If exam doesn't exist, is deleted, or is not PUBLISHED.
  - `400 Bad Request`: If the exam exists but contains 0 questions.
