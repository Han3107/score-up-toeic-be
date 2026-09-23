---
name: feature-task-discovery
description: Analyze an existing frontend and backend codebase separately, discover missing or incomplete capabilities, propose frontend and backend tasks for user review, and only generate backlog-ready English descriptions when the user explicitly approves tasks.
---

# Feature & Task Discovery

## Purpose

Analyze the existing **Frontend and Backend separately** to discover:

* Missing features
* Incomplete features
* Missing user capabilities
* Missing frontend flows
* Missing backend capabilities
* FE/BE integration gaps
* Admin capabilities
* Student/user capabilities
* Other meaningful development tasks

The skill must **only propose tasks for review**.

It must **never automatically add tasks to the backlog**.

The user reviews the proposed tasks first. Only after explicit approval should the selected tasks be converted into backlog-ready English descriptions.

---

# Core Workflow

```text id="1r2k6b"
Existing Project
       │
       ├───────────────┐
       ↓               ↓
 Analyze Frontend   Analyze Backend
       │               │
       └───────┬───────┘
               ↓
        Compare FE + BE
               ↓
       Discover Candidates
               ↓
      Propose FE / BE Tasks
               ↓
       User Reviews in VI
               ↓
      User Approves Tasks
               ↓
 Generate English Descriptions
               ↓
       Add to Backlog
```

---

# 1. Analyze Frontend

Inspect the frontend codebase and identify:

* Pages
* Routes
* Components
* Forms
* User flows
* API integrations
* Mock data
* Authentication flows
* Authorization UI
* Admin interfaces
* Loading states
* Error states
* Empty states
* Search
* Filtering
* Sorting
* Pagination
* TODO/FIXME items
* Incomplete features

Classify findings as:

```text id="7od4q3"
Implemented
Partially implemented
Missing
Mocked
Unused
Unknown
```

Do not assume functionality exists without evidence.

---

# 2. Analyze Backend

Inspect the backend codebase and identify:

* Modules
* Controllers
* Services
* Repositories
* Entities/models
* APIs
* Authentication
* Authorization
* Roles
* Validation
* Database operations
* Business logic
* TODO/FIXME items
* Incomplete modules
* Missing APIs

Classify findings as:

```text id="h2f6cz"
Implemented
Partially implemented
Missing
Unused
Unknown
```

Do not assume functionality exists without evidence.

---

# 3. Compare Frontend and Backend

After analyzing both sides separately, compare them.

Look for:

### Frontend exists but backend is missing

Example:

```text id="e6n5b4"
FE:
Exam Category UI exists

BE:
Category API is missing
```

Possible task:

```text id="x0n6yr"
BE Task:
Implement the backend capability required by the existing
exam category flow.
```

---

### Backend exists but frontend is missing

Example:

```text id="k6s9n8"
BE:
Exam history API exists

FE:
No exam history page
```

Possible task:

```text id="9c3r7d"
FE Task:
Implement the frontend flow for viewing exam history.
```

---

### Both are missing

Example:

```text id="b9w1w0"
FE:
No category management UI

BE:
No category management API
```

Propose separate tasks:

```text id="d8m1b4"
FE Task:
Implement the category management interface.

BE Task:
Implement the category management API and business logic.
```

---

### Both are partially implemented

Identify what is missing on each side and propose separate tasks.

Do not merge FE and BE tasks.

---

# 4. Task Separation Rule

When a feature requires both frontend and backend work, always separate the tasks.

Example:

```text id="j7f3m2"
Feature:
Exam Category Management

FE Task:
Implement the frontend category management flow.

BE Task:
Implement the backend category management capability.
```

Do NOT output:

```text id="9q2k1a"
TASK-001 — Exam Category Management
```

as a single implementation task.

The backlog should be able to track FE and BE work independently.

---

# 5. Task Types

Use these task types when appropriate:

```text id="3x7r8v"
FE
BE
Integration
Testing
Other
```

Most normal feature work should be separated into:

```text id="m4v8q2"
FE Task
BE Task
```

Integration tasks should only be created when the integration itself represents meaningful work.

Do not create unnecessary integration tasks.

---

# 6. Task Discovery

Discover tasks from:

* Missing user capabilities
* Incomplete user flows
* Missing APIs
* Missing UI
* Existing UI using mock data
* Existing APIs without UI
* Authentication gaps
* Authorization gaps
* CRUD requirements
* Search/filter/sort requirements
* Data synchronization
* Admin workflows
* Student workflows
* Existing TODO/FIXME items

Focus on meaningful development work.

Do not turn every small code-level improvement into a task.

---

# 7. Do Not Add to Backlog Automatically

This is a critical rule.

After analysis, the skill must **STOP at task proposals**.

It must NOT:

* Create backlog items
* Modify `Backlog.md`
* Modify backlog files
* Assign task IDs from the backlog
* Mark tasks as approved
* Assume user approval

The user must explicitly approve the proposed tasks.

---

# 8. Review Output Must Be Vietnamese

The discovery/review phase must be written in **Vietnamese**.

The purpose is to allow the user to understand and review the proposed work before anything enters the backlog.

Example:

```text id="r6f4p1"
# Các task đề xuất

## Feature: Quản lý danh mục đề thi

### FE

**FE-01 — Trang danh sách danh mục**

Mô tả:
Cho phép học viên xem danh sách các danh mục đề thi.

**FE-02 — Giao diện quản lý danh mục**

Mô tả:
Cho phép Admin tạo, xem, cập nhật và xóa danh mục đề thi.

### BE

**BE-01 — API quản lý danh mục**

Mô tả:
Cung cấp các API để lấy danh sách và thực hiện CRUD danh mục
đề thi cho Admin.

**BE-02 — Đồng bộ danh mục mặc định**

Mô tả:
Cung cấp chức năng đồng bộ 6 danh mục chuẩn từ Frontend vào
MongoDB mà không tạo dữ liệu trùng lặp.

### Integration

**INT-01 — Kết nối frontend với category API**

Mô tả:
Kết nối các chức năng danh mục trên Frontend với API tương ứng
trên Backend.
```

This is only a **proposal**.

Do not add these tasks to the backlog yet.

---

# 9. Review Status

Each proposed task may have:

```text id="f9v2s4"
[ ] Chưa duyệt
[✓] Đã duyệt
[✗] Không cần
[?] Cần làm rõ
```

However, do not change the status unless the user explicitly gives the decision.

---

# 10. User Approval

The user may respond with:

```text id="5t4r7w"
Duyệt FE-01, FE-02, BE-01
```

or:

```text id="0m5b2k"
Thêm FE-01 và BE-01 vào backlog
```

or:

```text id="j3q8c6"
Chỉ làm BE-01 trước
```

Only then should the skill prepare the approved tasks for the backlog.

---

# 11. Backlog Conversion

After explicit approval, convert the selected task into a concise **English** backlog description.

The description must follow a Spec Kit-compatible requirement style.

Describe:

```text id="q8x3k1"
Who can do something
+
What they can do
+
What the system needs to provide
```

Example:

Vietnamese proposal:

```text id="t4x7n2"
BE-01 — API quản lý danh mục

Cung cấp các API để Admin có thể tạo, xem, cập nhật và xóa
danh mục đề thi.
```

Backlog description:

```text id="e3k9p7"
Allow admins to create, view, update, and delete exam categories
through the backend.
```

---

# 12. English Backlog Format

When the user explicitly asks to add approved tasks to the backlog, use:

```text id="n5w2r8"
TASK-XXX — <Task Name>

Description:
<Simple English requirement-style description>
```

Example:

```text id="p7m4c1"
TASK-012 — Exam Category Management API

Description:
Provide APIs that allow admins to create, view, update, and delete
exam categories.
```

Do not add unnecessary implementation details.

---

# 13. Description Rules

Backlog descriptions must:

* Be entirely in English
* Be concise
* Describe behavior/capability
* Identify the relevant actor when applicable
* Describe what the system should provide
* Be understandable without reading the implementation
* Be suitable as an input to `/specify`

Prefer:

```text id="w4n8k2"
Allow students to view available exam categories.
```

Prefer:

```text id="k7m3p9"
Allow admins to create, view, update, and delete exam categories.
```

Prefer:

```text id="z6c1r5"
Provide an endpoint to synchronize the six default exam categories
from the frontend into MongoDB.
```

Avoid:

```text id="a2d8f4"
Create CategoryController.
```

Avoid:

```text id="b5q9w1"
Create CategoryService and CategoryRepository.
```

Avoid:

```text id="c3k7m6"
Create React Query hooks for categories.
```

---

# 14. Spec Kit Compatibility

The final English backlog description should be simple enough to become the starting point for:

```text id="r8v4n2"
/specify
```

Example:

```text id="q1m6s9"
/specify

Allow students to view available exam categories.
Allow admins to create, view, update, and delete exam categories.
Provide an endpoint to synchronize the six default exam categories
from the frontend into MongoDB.
```

Spec Kit is responsible for expanding this into a full specification.

This skill should not attempt to produce the complete specification.

---

# 15. Task Granularity

Tasks should represent meaningful units of work.

Good:

```text id="f4k8m2"
FE-01 — Exam Category List

BE-01 — Exam Category API
```

Bad:

```text id="n8q2v5"
FE-01 — Create button

FE-02 — Create modal

FE-03 — Create form

BE-01 — Create controller

BE-02 — Create service

BE-03 — Create repository
```

The latter are implementation subtasks and should normally be handled later by Spec Kit `/tasks`.

---

# 16. Dependencies

During analysis, identify dependencies when relevant.

Example:

```text id="y5r1k7"
FE-01 depends on:
- BE-01 Category API

BE-01 depends on:
- Existing authentication
- Admin authorization
```

Dependencies are shown during review.

Do not automatically reorder or prioritize tasks.

---

# 17. Final Discovery Output

When the user asks to analyze the project and find what can be built next, output:

```text id="m2x8q4"
# Phân tích dự án

## Frontend

<Relevant findings>

## Backend

<Relevant findings>

## Khoảng trống giữa FE và BE

<Relevant findings>

# Các task đề xuất

## FE

### FE-01 — <Task>
Mô tả:
...

### FE-02 — <Task>
Mô tả:
...

## BE

### BE-01 — <Task>
Mô tả:
...

### BE-02 — <Task>
Mô tả:
...

## Integration

### INT-01 — <Task>
Mô tả:
...

# Cần review

Các task trên chỉ là đề xuất.
Chưa có task nào được thêm vào backlog.
```

Everything in this stage is Vietnamese.

---

# 18. After User Approval

Only after explicit approval:

```text id="z4m7c2"
Approved Tasks
      ↓
Generate English descriptions
      ↓
Create / update backlog items
```

Example:

```text id="p6n3x8"
User:
"Duyệt FE-01 và BE-01, thêm vào backlog."

Assistant:

FE-01
→ English backlog description

BE-01
→ English backlog description
```

Do not convert unapproved tasks.

---

# 19. Important Rules

Always follow these rules:

1. Analyze FE and BE separately.
2. Compare FE and BE after separate analysis.
3. Separate proposed tasks into FE and BE.
4. Create Integration tasks only when necessary.
5. Do not merge FE and BE implementation tasks.
6. Show proposed tasks in Vietnamese.
7. Do not add anything to the backlog during discovery.
8. Wait for explicit user approval.
9. Only approved tasks are converted to backlog items.
10. Backlog descriptions must be entirely in English.
11. Keep backlog descriptions short and requirement-oriented.
12. Describe user/system behavior rather than implementation details.
13. Do not invent functionality.
14. Do not create unnecessary technical subtasks.
15. Do not perform `/specify`, `/plan`, `/tasks`, or `/implement` automatically.
16. The user controls which proposed tasks become backlog items.

---

# 20. Final Quality Check

Before presenting discovery results:

```text id="c8w4n6"
[ ] FE was analyzed separately.
[ ] BE was analyzed separately.
[ ] FE/BE gaps were compared.
[ ] Proposed tasks are separated into FE/BE.
[ ] Integration tasks are only included when necessary.
[ ] Review output is entirely in Vietnamese.
[ ] No task was added to the backlog.
[ ] No unapproved task received a backlog ID.
[ ] Tasks represent meaningful capabilities.
[ ] Implementation details are not unnecessarily exposed.
```

The core principle is:

```text id="r1x7m5"
Analyze
  ↓
Propose
  ↓
User Reviews
  ↓
User Approves
  ↓
Convert to English
  ↓
Add to Backlog
  ↓
/specify
```