# Feature Specification: study-folders-modules

**Feature Branch**: `006-study-folders-modules`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "Provide APIs that allow users to create, view, update, and delete their personal study folders and vocabulary study modules."

## User Scenarios & Testing _(mandatory)_

## Clarifications

### Session 2026-09-24

- Q: Một học phần có thể nằm trong nhiều thư mục khác nhau cùng lúc không? → A: Không (1:N), nhưng cần có cơ chế sao chép (copy/clone) học phần từ thư mục này sang thư mục khác.
- Q: Các từ vựng bên trong học phần có cần lưu theo thứ tự cụ thể không? → A: Không cần giữ thứ tự tuỳ chỉnh, nhưng khi học/làm bài cần có khả năng hiển thị ngẫu nhiên (random).
- Q: Có cần thiết lập giới hạn số lượng từ vựng tối đa trong một học phần không? → A: Giới hạn tối đa 500 từ vựng mỗi học phần (Option C).

### User Story 1 - Manage Study Folders (Priority: P1)

As a user, I want to create, view, update, and delete my personal study folders so that I can organize my learning materials.

**Why this priority**: Folders are the top-level organizational unit. Users need them to group their study modules logically.

**Independent Test**: Can be fully tested by creating a folder, verifying it appears in the user's folder list, updating its name, and deleting it, all without needing to add modules to it.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user, **When** I request to create a folder with a valid name and description, **Then** the folder is created and returned with a unique ID.
2. **Given** I have existing folders, **When** I request a list of my folders, **Then** I receive a paginated list of my folders.
3. **Given** I own a folder, **When** I request to update its name, **Then** the folder is updated successfully.
4. **Given** I own a folder, **When** I request to delete it, **Then** the folder is removed from my account.

---

### User Story 2 - Manage Vocabulary Study Modules (Priority: P1)

As a user, I want to create, view, update, and delete vocabulary study modules so that I can manage lists of words and definitions to study.

**Why this priority**: Modules contain the actual learning content (vocabulary terms). They are the core value proposition of the application.

**Independent Test**: Can be fully tested by creating a standalone module with some terms, retrieving it, updating the terms, and deleting it.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user, **When** I create a module with a title, description, and a list of vocabulary terms, **Then** the module is saved and I receive its details.
2. **Given** I have existing modules, **When** I request a list of my modules, **Then** I receive a paginated list of my modules.
3. **Given** I own a module, **When** I request to update its title or its vocabulary terms, **Then** the module is updated successfully.
4. **Given** I own a module, **When** I request to delete it, **Then** the module and its terms are removed from my account.

---

### User Story 3 - Organize Modules within Folders (Priority: P2)

As a user, I want to assign vocabulary modules to specific folders so that my study materials are neatly categorized.

**Why this priority**: Linking modules and folders enhances the organization capabilities but is secondary to the basic CRUD operations of both entities.

**Independent Test**: Can be fully tested by creating a folder, creating a module, linking them, and retrieving the folder to verify the module is included.

**Acceptance Scenarios**:

1. **Given** I own a folder and a module, **When** I assign the module to the folder, **Then** the module appears inside that folder.
2. **Given** a folder contains modules, **When** I request the details of the folder, **Then** I receive the folder details along with a list of its modules.
3. **Given** a module is in a folder, **When** I remove the module from the folder, **Then** the module is no longer associated with the folder but is not deleted.

---

### Edge Cases

- What happens when a user tries to create a folder or module without a title? The API should return a 400 Bad Request validation error.
- What happens when a user tries to access, update, or delete a folder or module belonging to another user? The API should return a 403 Forbidden or 404 Not Found error.
- What happens when a folder containing modules is deleted? Both the folder and its modules are soft-deleted, allowing the user to restore them. They will be permanently (hard) deleted after 15 days.
- What happens when a user attempts to add the same module to a folder multiple times? The API should handle it gracefully, either by ignoring the duplicate or returning a standard validation error.
- What happens when a user tries to add more than 500 terms to a single module? The API should return a 400 Bad Request indicating the limit has been reached.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a set of RESTful (or GraphQL) APIs to support standard CRUD operations (Create, Read, Update, Delete) for User Folders.
- **FR-002**: System MUST provide a set of APIs to support CRUD operations for Vocabulary Modules.
- **FR-003**: System MUST allow users to add vocabulary terms (e.g., term and definition) when creating or updating a Vocabulary Module.
- **FR-004**: System MUST allow associating one or more Vocabulary Modules with a User Folder.
- **FR-010**: System MUST provide a mechanism to copy/clone an existing Vocabulary Module (including its terms) into a target folder.
- **FR-011**: System is not required to persist custom ordering of vocabulary terms; default ordering (e.g., chronological) is sufficient, but APIs or clients MUST support randomizing term order for study sessions.
- **FR-012**: System MUST enforce a maximum limit of 500 vocabulary terms per Vocabulary Module.

- **FR-005**: System MUST ensure that folders and modules are strictly private to the user who created them (no public sharing in this iteration).
- **FR-006**: System MUST validate input data (e.g., required titles, reasonable length limits for descriptions and terms).
- **FR-007**: System MUST provide pagination for list endpoints (list folders, list modules).
- **FR-008**: System MUST support soft-deleting folders and modules, and provide a way for users to restore soft-deleted items within 15 days.
- **FR-009**: System MUST permanently delete soft-deleted items after 15 days.

### Key Entities _(include if feature involves data)_

- **Folder**: Represents a user's study folder. Contains attributes like ID, Title, Description, UserID (Owner), Timestamps.
- **Vocabulary Module**: Represents a list of terms to study. Contains attributes like ID, Title, Description, UserID (Owner), FolderID (optional), Timestamps.
- **Vocabulary Term**: Represents a single item in a module. Contains attributes like ID, Term (word), Definition, ModuleID.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can create a new folder and a module via the API and receive a successful response in under 500ms.
- **SC-002**: Standard CRUD operations return the appropriate HTTP status codes (200/201 for success, 400 for bad input, 403/404 for unauthorized access).
- **SC-003**: API endpoints handle pagination correctly for up to 1,000 modules/folders per user without significant performance degradation.
- **SC-004**: Users are completely isolated; a user cannot retrieve or modify another user's folders or modules under any circumstances.

## Assumptions

- Users are already authenticated, and their user ID can be reliably determined from the authentication context (e.g., JWT token).
- Folders and Modules support soft deletion with a 15-day retention period before hard deletion.
- A Vocabulary Module can belong to at most one folder (1:N relationship).
- Folders do not support nested sub-folders in this version.
