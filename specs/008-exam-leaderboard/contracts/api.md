# Interface Contracts: Exam Leaderboard API

## Endpoint: Get Leaderboard
Retrieves the paginated leaderboard of users based on average exam scores.

- **URL**: `GET /api/v1/leaderboards/exams`
- **Auth Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `page` (optional, number): Page number, default 1.
  - `limit` (optional, number): Users per page, default 50.

### Success Response
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "data": {
      "items": [
        {
          "rank": 1,
          "userId": "60d5ecb8b392d7...1",
          "displayName": "Alex T.",
          "averageScore": 95.5,
          "totalCompletedExams": 10
        },
        {
          "rank": 2,
          "userId": "60d5ecb8b392d7...2",
          "displayName": "Sam R.",
          "averageScore": 95.5,
          "totalCompletedExams": 8
        }
      ],
      "meta": {
        "currentPage": 1,
        "itemsPerPage": 50,
        "totalItems": 1500,
        "totalPages": 30
      }
    }
  }
  ```

### Empty State Response (No ranked users)
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "data": {
      "items": [],
      "meta": {
        "currentPage": 1,
        "itemsPerPage": 50,
        "totalItems": 0,
        "totalPages": 0
      },
      "message": "No ranked players yet"
    }
  }
  ```
