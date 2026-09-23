# Feature Specification: TOEIC Exam Management API

**Feature Branch**: `005-exam-management-api`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: Provide APIs that allow admins to create, view, update, and delete exam tests and their questions. Allow students to fetch the list of available exams and full test details to take the test.

## Clarifications

### Session 2026-09-23

- Q: Do exams need a visibility status? → A: Yes, exams must support statuses: Draft, Published, Hidden.
- Q: Do questions require support for multimedia assets and grouping by reading passages? → A: Yes, support full TOEIC formats including audio, images, and reading passages.
- Q: What should happen if an admin attempts to delete an exam that students have already taken? → A: Use soft delete (e.g., deleted_at timestamp) to preserve student history records.
- Q: How should related questions (sharing a reading passage or audio) be grouped in the data model? → A: Introduce a separate QuestionGroup entity to hold shared content and link to child questions.
- Q: How should the system handle a student requesting to start an exam with 0 questions? → A: Block the request and return an error (e.g., 400 Bad Request) to prevent starting an invalid exam.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Admin manages TOEIC exams (Priority: P1)

Administrators need to create new TOEIC exams, update their metadata, and delete exams that are no longer needed.

**Why this priority**: Without exams, the system has no core content for students to practice. It is the most foundational feature.

**Independent Test**: Can be fully tested by an Admin creating a new test, updating its title, viewing it in the list of tests, and deleting it.

**Acceptance Scenarios**:

1. **Given** an admin is authenticated, **When** they submit valid exam metadata (title, description), **Then** a new exam is created and returned with an ID.
2. **Given** an existing exam, **When** an admin requests to delete it, **Then** the exam and all its associated questions are removed from the system.
3. **Given** an existing exam, **When** an admin updates its details, **Then** the changes are saved and reflected in subsequent retrievals.

---

### User Story 2 - Admin manages questions within an exam (Priority: P1)

Administrators need to add individual questions to an existing exam, update question content (options, correct answer, explanation), and remove questions.

**Why this priority**: An exam without questions is useless. Managing the question bank within an exam is essential for content creation.

**Independent Test**: Can be fully tested by selecting an existing exam, adding a question to it, updating the question's correct answer, and deleting the question.

**Acceptance Scenarios**:

1. **Given** an existing exam, **When** an admin adds a new question with valid options and a correct answer, **Then** the question is appended to the exam.
2. **Given** an existing question, **When** an admin updates the explanation text, **Then** the updated explanation is saved.
3. **Given** an existing question, **When** an admin removes it, **Then** the question is no longer associated with the exam.

---

### User Story 3 - Student browses and selects an exam (Priority: P2)

Students (even unauthenticated visitors) need to view a list of available exams so they can choose which one to practice.

**Why this priority**: Students must be able to discover content to engage with the platform.

**Independent Test**: Can be fully tested by requesting the exam list without logging in and receiving a paginated list of available tests.

**Acceptance Scenarios**:

1. **Given** exams exist in the system, **When** a user (not logged in) views the exam list, **Then** they see a list of exams with basic metadata (title, description).
2. **Given** many exams exist, **When** a student requests the second page of exams, **Then** they receive the correct subset of exams.

---

### User Story 4 - Student retrieves full exam details to take the test (Priority: P2)

Once a student selects an exam, they need to retrieve all the questions associated with that exam to begin the test-taking process.

**Why this priority**: This is the core delivery mechanism for the learning experience.

**Independent Test**: Can be fully tested by a student selecting a specific exam and receiving the complete payload of questions.

**Acceptance Scenarios**:

1. **Given** an available exam with questions, **When** a student selects it to start, **Then** the system returns the exam metadata along with the full list of questions.

---

### Edge Cases

- If an admin attempts to delete an exam that students have already taken, the system MUST perform a soft delete to preserve historical student data while hiding the exam from active lists.
- If a student requests an exam that does not exist or has been deleted, the system MUST return a 404 Not Found error.
- If a student requests an exam that contains 0 questions, the system MUST return a 400 Bad Request error to prevent starting an empty test.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow administrators to create, read, update, and delete TOEIC exams.
- **FR-002**: System MUST allow administrators to add (including bulk-add array payloads), read, update, and remove questions for a specific TOEIC exam.
- **FR-003**: System MUST support exam visibility statuses (Draft, Published, Hidden) and ensure students can only view Published exams.
- **FR-004**: System MUST allow students to retrieve a paginated list of available exams.
- **FR-005**: System MUST allow students to fetch the full details of a specific exam, including all its questions.
- **FR-006**: System MUST support full TOEIC question formats, including audio files, images, and reading passages that group multiple child questions.
- **FR-007**: System MUST validate that a question always has options and a designated correct answer before saving.

### Key Entities

- **Exam (ToeicTest)**: Represents a full TOEIC test containing metadata (title, description, category, status).
- **QuestionGroup**: Represents a group of related questions sharing common stimuli (e.g., reading passages, audio files, instructions).
- **Question**: Represents an individual test question containing the prompt, options, correct answer, and explanation. Linked to a QuestionGroup or directly to the Exam.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can successfully create a full exam and bulk-add questions without system timeouts.
- **SC-002**: Students can retrieve the paginated list of exams in under 1 second.
- **SC-003**: Students can retrieve a full exam payload (e.g., 200 questions) in under 2 seconds.
- **SC-004**: Endpoint error rates remain below 1% during standard operational loads.

## Assumptions

- Existing authentication and role-based authorization (Admin vs Student) mechanisms are already implemented in the `UsersModule` and `AuthModule` and can be reused.
- Progress tracking and exam result submission will be handled by a separate module (Exam History and Progress API) and are out of scope for this feature.
- File uploads for media (if needed) will be handled by an existing file upload service, and the exam API will only store the URLs.
