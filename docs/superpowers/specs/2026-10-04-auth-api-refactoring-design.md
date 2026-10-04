# Authentication API Refactoring Spec

## Overview
This document specifies the refactoring of the Authentication and User APIs to adhere strictly to RESTful resource-oriented naming conventions. The primary goals are to improve endpoint consistency and clearly separate responsibilities between authentication, email verification, password recovery, and user account management, without altering the underlying business logic.

## Design Decisions

1. **Authentication Namespace:** Core auth, email verification, and password recovery workflows will remain under the `/auth` namespace.
2. **Resource-Oriented Naming:** Action verbs (e.g., `forgot/password`, `email/confirm/new`) will be replaced with standard resource structures (e.g., `/password-recovery`, `/email-verification/resend`).
3. **User Profile Migration:** All endpoints managing the currently authenticated user's profile and account settings will be relocated from `/auth/me` to the `/users/me` namespace to logically group them with user management.

## API Endpoint Mapping

### 1. Authentication APIs
Namespace: `/api/v1/auth`
Responsible for core session lifecycle (registration, login, logout, token refresh).

| Current Endpoint | New Endpoint | Description |
|------------------|--------------|-------------|
| `POST /api/v1/auth/email/register` | `POST /api/v1/auth/register` | Register a new user |
| `POST /api/v1/auth/email/login` | `POST /api/v1/auth/login` | Log in with email/password |
| `POST /api/v1/auth/refresh` | `POST /api/v1/auth/refresh` | Refresh access token |
| `POST /api/v1/auth/logout` | `POST /api/v1/auth/logout` | Log out user |

### 2. Email Verification APIs
Namespace: `/api/v1/auth/email-verification`
Responsible for confirming a user's email address.

| Current Endpoint | New Endpoint | Description |
|------------------|--------------|-------------|
| `POST /api/v1/auth/email/confirm` | `POST /api/v1/auth/email-verification` | Confirm email using a hash/token |
| `POST /api/v1/auth/email/confirm/new` | `POST /api/v1/auth/email-verification/resend` | Request a new verification email |

### 3. Password Recovery APIs
Namespace: `/api/v1/auth/password-recovery`
Responsible for the forgot-password and reset-password workflows.

| Current Endpoint | New Endpoint | Description |
|------------------|--------------|-------------|
| `POST /api/v1/auth/forgot/password` | `POST /api/v1/auth/password-recovery` | Initiate password recovery (send email) |
| `POST /api/v1/auth/reset/password` | `POST /api/v1/auth/password-recovery/confirm` | Complete password recovery (set new password) |

### 4. Current User APIs
Namespace: `/api/v1/users/me`
Responsible for retrieving and modifying the authenticated user's profile and account.

| Current Endpoint | New Endpoint | Description |
|------------------|--------------|-------------|
| `GET /api/v1/auth/me` | `GET /api/v1/users/me` | Get current user profile |
| `PATCH /api/v1/auth/me` | `PATCH /api/v1/users/me` | Update current user profile |
| `DELETE /api/v1/auth/me` | `DELETE /api/v1/users/me` | Delete current user account |
| *New/Moved* | `PATCH /api/v1/users/me/password` | Update current user password (if applicable in profile) |

## Implementation Strategy

### Controller & Module Organization
- **`AuthController`**: Handles `/auth/register`, `/auth/login`, `/auth/refresh`, and `/auth/logout`.
- **`EmailVerificationController`**: Handles `/auth/email-verification` and `/auth/email-verification/resend`. 
- **`PasswordRecoveryController`**: Handles `/auth/password-recovery` and `/auth/password-recovery/confirm`.
- **`UsersController`**: Absorbs the `/users/me` endpoints.

### DTO Refactoring
DTO classes will be renamed to align with their new resource endpoints to maintain codebase consistency (e.g., `AuthForgotPasswordDto` becomes `PasswordRecoveryDto` or `ForgotPasswordRecoveryDto`, `AuthResetPasswordDto` becomes `ConfirmPasswordRecoveryDto`).

### Validation & Backward Compatibility
- Existing validation rules (`class-validator`) and business logic inside the respective services will be preserved entirely.
- Swagger documentation decorators (e.g., `@ApiTags`, `@ApiOperation`) will be updated to reflect the new groupings and clear descriptions.
- E2E tests (`test/user/auth.e2e-spec.ts` etc.) will be updated to hit the new URLs.

## Out of Scope
- Modifying the underlying database schemas.
- Changing the JWT generation, validation, or refresh token mechanisms.
- Altering the email templates or sending logic.
