# Authentication API Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Authentication API to follow RESTful conventions by separating namespaces and moving profile management to the Users resource.

**Architecture:** Create separate controllers (`PasswordRecoveryController`, `EmailVerificationController`) inside the `AuthModule` to handle specific workflows. Move current user endpoints from `AuthController` to `UsersController`. Rename endpoints and DTOs to match RESTful patterns.

**Tech Stack:** NestJS 11, class-validator, Jest (e2e tests)

**Spec:** docs/superpowers/specs/2026-10-04-auth-api-refactoring-design.md

## Global Constraints

- Follow consistent RESTful naming conventions and appropriate HTTP methods.
- Preserve existing business logic, validation rules, and authentication behavior.
- Do not introduce unnecessary top-level resources such as `/sessions`, `/password-recoveries`, or `/email-verifications`.
- Do not use `/me` as a top-level resource.

## Review Focus

- **Protected routes:** Ensure endpoints that require authentication still have the `@UseGuards(AuthGuard('jwt'))` applied correctly after being moved.
- **Validation:** Ensure renamed DTOs are correctly imported and applied to the endpoints.
- **E2E Tests:** Ensure all existing e2e test cases are updated to point to the new paths and continue passing.

---

### Task 1: Current User APIs (UsersController)

**Files:**
- Modify: `src/auth/auth.controller.ts`
- Modify: `src/users/users.controller.ts`
- Move/Rename: `src/auth/dto/auth-update.dto.ts` -> `src/users/dto/update-me.dto.ts`
- Modify: `test/user/auth.e2e-spec.ts`

**Interfaces:**
- Consumes: Existing `AuthService` logic for `me`, `update`, `softDelete`.
- Produces: `GET /api/v1/users/me`, `PATCH /api/v1/users/me`, `DELETE /api/v1/users/me`

- [ ] **Step 1: Move and rename the DTO**
Move `src/auth/dto/auth-update.dto.ts` to `src/users/dto/update-me.dto.ts`. Rename class `AuthUpdateDto` to `UpdateMeDto`.

- [ ] **Step 2: Move endpoints to UsersController**
Remove `me`, `update`, and `delete` endpoints from `AuthController`.
Add them to `UsersController` mapped as `@Get('me')`, `@Patch('me')`, and `@Delete('me')`.
Ensure they are protected by `AuthGuard('jwt')` and `RolesGuard` if necessary, or just rely on the controller-level guards if appropriate. Note that `UsersController` might require specific auth guards. Since `UsersController` is already protected by `@UseGuards(AuthGuard('jwt'))`, you can safely add the methods. 
*Important:* The original `auth.controller.ts` used `AuthService` for these methods (`authService.me`, `authService.update`, `authService.softDelete`). In `UsersController`, inject `AuthService` if needed, OR move the logic to `UsersService` (but preserving business logic means just calling the same `AuthService` methods is safer). However, `UsersModule` might not import `AuthModule` (could cause circular dependency). Since `AuthService` calls `UsersService` for these anyway, try calling `UsersService` directly if possible, or inject `AuthService` by importing `AuthModule` (use `forwardRef` if needed). Let's stick to calling `AuthService` methods to preserve exact logic. Add `forwardRef(() => AuthModule)` to `UsersModule` imports.

- [ ] **Step 3: Update e2e tests**
In `test/user/auth.e2e-spec.ts`, find the test block for "Auth -> /api/v1/auth/me (GET)" and update the URL to `/api/v1/users/me`.
Update the PATCH and DELETE tests similarly.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test:e2e -- test/user/auth.e2e-spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Commit changes with message `refactor(user): move profile endpoints to UsersController`.

### Task 2: Password Recovery APIs

**Files:**
- Create: `src/auth/password-recovery.controller.ts`
- Modify: `src/auth/auth.controller.ts`
- Modify: `src/auth/auth.module.ts`
- Move/Rename: `src/auth/dto/auth-forgot-password.dto.ts` -> `src/auth/dto/password-recovery.dto.ts`
- Move/Rename: `src/auth/dto/auth-reset-password.dto.ts` -> `src/auth/dto/password-recovery-confirm.dto.ts`
- Modify: `test/user/auth.e2e-spec.ts`

**Interfaces:**
- Produces: `POST /api/v1/auth/password-recovery`, `POST /api/v1/auth/password-recovery/confirm`

- [ ] **Step 1: Move and rename DTOs**
Rename `AuthForgotPasswordDto` to `PasswordRecoveryDto` in `password-recovery.dto.ts`.
Rename `AuthResetPasswordDto` to `PasswordRecoveryConfirmDto` in `password-recovery-confirm.dto.ts`.

- [ ] **Step 2: Create PasswordRecoveryController**
Create `PasswordRecoveryController` with `@Controller({ path: 'auth/password-recovery', version: '1' })`.
Inject `AuthService`.
Move the `forgotPassword` and `resetPassword` methods from `AuthController` to this new controller.
Map them as `@Post()` and `@Post('confirm')`.

- [ ] **Step 3: Register Controller in AuthModule**
Add `PasswordRecoveryController` to the `controllers` array in `auth.module.ts`.

- [ ] **Step 4: Update e2e tests**
In `test/user/auth.e2e-spec.ts`, update paths `/api/v1/auth/forgot/password` to `/api/v1/auth/password-recovery` and `/api/v1/auth/reset/password` to `/api/v1/auth/password-recovery/confirm`.

- [ ] **Step 5: Run test to verify it passes**
Run: `npm run test:e2e -- test/user/auth.e2e-spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**
Commit changes with message `refactor(auth): extract password recovery endpoints`.

### Task 3: Email Verification APIs

**Files:**
- Create: `src/auth/email-verification.controller.ts`
- Modify: `src/auth/auth.controller.ts`
- Modify: `src/auth/auth.module.ts`
- Move/Rename: `src/auth/dto/auth-confirm-email.dto.ts` -> `src/auth/dto/email-verification-confirm.dto.ts`
- Modify: `test/user/auth.e2e-spec.ts`

**Interfaces:**
- Produces: `POST /api/v1/auth/email-verification`, `POST /api/v1/auth/email-verification/resend`

- [ ] **Step 1: Move and rename DTO**
Rename `AuthConfirmEmailDto` to `EmailVerificationConfirmDto` in `email-verification-confirm.dto.ts`.

- [ ] **Step 2: Create EmailVerificationController**
Create `EmailVerificationController` with `@Controller({ path: 'auth/email-verification', version: '1' })`.
Inject `AuthService`.
Move the `confirmEmail` and `confirmNewEmail` (resend) methods from `AuthController` to this controller.
Map them as `@Post()` and `@Post('resend')`. Note that `confirmNewEmail` takes `AuthRegisterLoginDto`, renamed later, or create a specific DTO. It uses the `AuthConfirmEmailDto` or similar. We will keep its existing DTO type for now, just update the route.

- [ ] **Step 3: Register Controller in AuthModule**
Add `EmailVerificationController` to `controllers` array in `auth.module.ts`.

- [ ] **Step 4: Update e2e tests**
In `test/user/auth.e2e-spec.ts`, update paths `/api/v1/auth/email/confirm` to `/api/v1/auth/email-verification` and `/api/v1/auth/email/confirm/new` to `/api/v1/auth/email-verification/resend`.

- [ ] **Step 5: Run test to verify it passes**
Run: `npm run test:e2e -- test/user/auth.e2e-spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**
Commit changes with message `refactor(auth): extract email verification endpoints`.

### Task 4: Core Authentication APIs

**Files:**
- Modify: `src/auth/auth.controller.ts`
- Move/Rename: `src/auth/dto/auth-email-login.dto.ts` -> `src/auth/dto/auth-login.dto.ts`
- Move/Rename: `src/auth/dto/auth-register-login.dto.ts` -> `src/auth/dto/auth-register.dto.ts`
- Modify: `test/user/auth.e2e-spec.ts`
- Modify: `test/admin/auth.e2e-spec.ts`

**Interfaces:**
- Produces: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`

- [ ] **Step 1: Rename DTOs**
Rename `AuthEmailLoginDto` to `AuthLoginDto` in `auth-login.dto.ts`.
Rename `AuthRegisterLoginDto` to `AuthRegisterDto` in `auth-register.dto.ts`.

- [ ] **Step 2: Rename endpoints in AuthController**
Change `@Post('email/login')` to `@Post('login')`.
Change `@Post('email/register')` to `@Post('register')`.
Ensure `@Post('refresh')` and `@Post('logout')` remain as is.

- [ ] **Step 3: Update e2e tests**
In `test/user/auth.e2e-spec.ts` and `test/admin/auth.e2e-spec.ts`, update `/api/v1/auth/email/login` to `/api/v1/auth/login` and `/api/v1/auth/email/register` to `/api/v1/auth/register`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test:e2e -- test/user/auth.e2e-spec.ts`
Run: `npm run test:e2e -- test/admin/auth.e2e-spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Commit changes with message `refactor(auth): rename core authentication endpoints`.
