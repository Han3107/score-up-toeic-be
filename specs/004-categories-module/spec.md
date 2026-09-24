# Feature Specification: Categories Module

**Feature Branch**: `004-categories-module`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "Build a CategoriesModule that allows learners to view a list of categories (Parts of Speech, Grammar, Passive Voice, Word Endings, etc.); enables administrators to perform CRUD operations on categories; and provides a `sync-defaults` endpoint to synchronize six standard categories from the frontend to MongoDB."

## Clarifications

### Session 2026-09-22

- Q: Khi Admin xóa danh mục, hệ thống nên xóa vĩnh viễn (Hard Delete) hay xóa mềm (Soft Delete)? → A: Xóa vĩnh viễn (Hard delete).
- Q: API lấy danh sách danh mục dành cho Admin và Public (chưa đăng nhập) có cần hỗ trợ phân trang (pagination) không? → A: Cần phân trang (để tối ưu cho danh sách dài).
- Q: Nếu Admin tạo một danh mục mới mà KHÔNG nhập số thứ tự (Sequence), hệ thống nên xử lý thế nào? → A: Tự động lấy giá trị sequence lớn nhất hiện tại cộng thêm 1 (Max + 1, đẩy xuống cuối danh sách).
- Q: Danh mục có cần một trường để lưu trữ hình ảnh hoặc icon hiển thị trên frontend không? → A: Chỉ hoàn toàn là văn bản (Text only).
- Q: Do categories need a status (e.g., Active/Hidden) so administrators can hide them from learners while preparing content, or are all created categories immediately visible? → A: Option A (Active/Hidden status. Hidden categories are only visible to admins.)
- Q: Do categories need a custom display order defined by administrators, or should they simply be sorted alphabetically/chronologically? → A: Option A (Custom sort order via an 'order' or 'sequence' field.)
- Q: Should the `sync-defaults` endpoint be restricted to Administrators only, or is it an open endpoint that the frontend can call during app initialization? → A: Option A (Restricted to Administrators only.)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrator manages categories (Priority: P1)

As an Administrator, I want to create, read, update, and delete exam/course categories so that I can organize the learning materials effectively.

**Why this priority**: Categories form the foundational structure for the content in the system. Administrators need to be able to manage this structure before learners can usefully browse it.

**Independent Test**: Can be tested by logging in as an administrator and successfully creating a new category, viewing it in a list, updating its name, and subsequently deleting it.

**Acceptance Scenarios**:

1. **Given** the Admin is on the category management interface, **When** they submit a new category name (e.g., "Grammar") and an optional display sequence (if omitted, defaults to max sequence + 1), **Then** the category is created and appears in the system.
2. **Given** an existing category, **When** the Admin updates its details (including status or sequence), **Then** the changes are saved and reflected immediately.
3. **Given** an existing category, **When** the Admin deletes it, **Then** the category is permanently removed from the system (hard delete) if no exams are linked.

---

### User Story 2 - Public User views available categories (Priority: P1)

As a Public User (without logging in), I want to view a list of all available categories so that I can see which topics are available to study (e.g., Parts of Speech, Passive Voice, Word Endings).

**Why this priority**: It is essential for the core journey. Users need to see what topics are available to begin studying, even before logging in.

**Independent Test**: Can be tested without logging in, navigating to the categories endpoint, and verifying that the returned list matches the categories present in the system, sorted by the custom sequence.

**Acceptance Scenarios**:

1. **Given** there are existing active categories in the system, **When** a Public User requests to view the categories, **Then** they receive a complete list of all available active categories, sorted by their designated sequence order.
2. **Given** there are no active categories in the system, **When** a Public User requests to view the categories, **Then** they see an empty list or a message indicating no categories are available.
3. **Given** there is a mix of active and hidden categories, **When** a Public User requests to view the categories, **Then** only the active categories are returned.

---

### User Story 3 - System synchronizes default categories (Priority: P2)

As a System Administrator, I want an endpoint (`sync-defaults`) that can automatically synchronize six standard categories to the database, so that the initial setup process is fast and consistent.

**Why this priority**: It reduces manual setup time and ensures consistency across environments, but is secondary to the core CRUD and viewing capabilities.

**Independent Test**: Can be tested by triggering the `sync-defaults` endpoint and verifying that exactly the 6 standard categories are created in the database.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** the `sync-defaults` endpoint is triggered with the six standard categories, **Then** all six categories are created.
2. **Given** the database already contains some of the standard categories, **When** the `sync-defaults` endpoint is triggered, **Then** the system ensures all six exist (skipping the ones that already exist without creating duplicates).

### Edge Cases

- **Sync conflict on existing data**: When `sync-defaults` encounters a category name that already exists, it intentionally skips updating that record.
- **Deletion with dependencies**: If an Administrator attempts to delete a category that contains active content, the system rejects the deletion and provides an appropriate error message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an interface for Administrators to create, read (with pagination support), update, and delete (CRUD) categories, including toggling their status between Active and Hidden, and setting a custom display sequence.
- **FR-002**: The system MUST provide an interface for Public Users (unauthenticated) to retrieve a paginated list of all Active categories. Hidden categories MUST NOT be returned to Public Users. The list MUST be ordered based on the custom display sequence.
- **FR-003**: The system MUST restrict category creation, updating, and deletion to Administrators only.
- **FR-004**: The system MUST provide a `sync-defaults` endpoint, restricted to Administrators only.
- **FR-005**: The `sync-defaults` endpoint MUST accept a list of standard categories (from the frontend) and ensure they exist in the database (defaulting to Active status and appending to the sequence).
- **FR-006**: The system MUST avoid creating duplicate categories if a category with the same name already exists during synchronization or manual creation.
- **FR-007**: The system MUST prevent the deletion of a category if it currently contains any linked exams, returning an appropriate error message to the Admin. This MUST be implemented via an abstracted interface (e.g., a dependency provider) to avoid tight coupling if the Exams module is separate.

### Key Entities 

- **Category**: Represents a classification topic (e.g., "Grammar", "Parts of Speech"). Purely text-based, no images/icons.
  - Attributes: Name (String, Unique), Description (String, Optional), Status (Enum: Active/Hidden, Default: Active), Sequence (Number, for custom sorting).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can successfully complete any category CRUD operation (create, read, update, delete) in under 2 seconds of system response time.
- **SC-002**: Public Users can retrieve the list of categories successfully 100% of the time, with a response time of under 1 second.
- **SC-003**: The `sync-defaults` endpoint successfully provisions the six standard categories in an empty database on the first try.
- **SC-004**: Repeated calls to the `sync-defaults` endpoint result in zero duplicated categories.
- **SC-005**: Unauthorized users (public/learners) are successfully blocked from performing administrative CRUD operations on categories 100% of the time.

## Assumptions

- **Role Management**: The system already has a mechanism to distinguish between "Administrator" and "Learner" roles.
- **Category Data**: The primary identifier for uniqueness is the category name.
- **Deletion Impact**: Deleting a category that has associated content (e.g., questions or courses) is either handled via cascade delete or prevented by foreign key constraints (assumed to be a safe generic error for v1).
- **Frontend Sync Data**: The frontend provides the exact names and payloads for the six standard categories when calling the `sync-defaults` endpoint.