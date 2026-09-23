# Quickstart: Validation Guide for Exam Management API

This guide provides runnable validation scenarios to prove the TOEIC Exam Management API works end-to-end. 

## Prerequisites
- Server running locally (e.g., `npm run start:dev`)
- A valid Admin JWT Token (exported as `ADMIN_TOKEN`)
- A valid Student JWT Token (exported as `STUDENT_TOKEN`)
- Base API URL exported (e.g., `export API_URL=http://localhost:3000/api/v1/exams`)

## Scenario 1: Admin Creates and Publishes an Exam

### 1. Create the Exam
```bash
curl -X POST $API_URL \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Quickstart TOEIC Test",
    "description": "Validation test",
    "category": "Full Test"
  }'
```
**Expected Outcome**: Returns 201 Created with the new exam object (`status: "DRAFT"`). Note the `id` and export it as `EXAM_ID`.

### 2. Add a Question Group
```bash
curl -X POST $API_URL/$EXAM_ID/groups \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reading Part 6",
    "passageText": "Welcome to our company...",
    "orderIndex": 1
  }'
```
**Expected Outcome**: Returns 201 Created. Note the `id` as `GROUP_ID`.

### 3. Add a Question to the Group
```bash
curl -X POST $API_URL/$EXAM_ID/questions \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "'$GROUP_ID'",
    "prompt": "What is the main purpose of the passage?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "orderIndex": 1
  }'
```
**Expected Outcome**: Returns 201 Created.

### 4. Publish the Exam
```bash
curl -X PATCH $API_URL/$EXAM_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "PUBLISHED"}'
```
**Expected Outcome**: Returns 200 OK.

## Scenario 2: Student Retrieves Exam

### 1. View Exam List (Public)
```bash
curl -X GET $API_URL
```
**Expected Outcome**: Returns 200 OK. The JSON payload includes `Quickstart TOEIC Test`.

### 2. Get Full Exam Details
```bash
curl -X GET $API_URL/$EXAM_ID/full \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```
**Expected Outcome**: Returns 200 OK. Payload includes the exam metadata, the `Reading Part 6` group, and its child question.

## Scenario 3: Edge Cases

### 1. Empty Exam Restriction
Create a new exam (leaves it with 0 questions) and publish it.
Try to fetch full details as a student:
```bash
curl -X GET $API_URL/$NEW_EMPTY_EXAM_ID/full \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```
**Expected Outcome**: Returns 400 Bad Request.

### 2. Soft Delete
Delete the exam as an admin:
```bash
curl -X DELETE $API_URL/$EXAM_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**Expected Outcome**: Returns 204 No Content. 
Subsequent student requests to GET the list should no longer show this exam.
