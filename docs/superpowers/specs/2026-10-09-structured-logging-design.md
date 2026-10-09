# Structured Logging System Design

## 1. Overview
The current backend relies on the default NestJS `Logger` which outputs unstructured plain text and lacks request correlation. This makes tracking down errors and monitoring application flow difficult in production. This design specifies the integration of `nestjs-pino` to replace the default logger, providing JSON-formatted logs in production, pretty-printed logs in development, UUID-based request tracing, a global exception filter, and standardized error logging in all services.

## 2. Goals & Acceptance Criteria
- Replace NestJS `Logger` with `nestjs-pino` (`bufferLogs: true`).
- JSON output in production, pretty-print in development.
- Configurable log levels via `APP_LOG_LEVEL`.
- Auto-generate UUID v4 request IDs, include in all logs, and attach to `X-Request-Id` response header.
- Auto-log HTTP requests/responses (replacing `LoggerMiddleware`) with method, URL, status code, response time, content-length, user-agent, IP, and request ID.
- Update silent catch blocks in `auth.service.ts`, `exam-results.service.ts`, and `auth-facebook.service.ts` to log context.
- Replace stray `console.error` in `auth-facebook.service.ts` with `nestjs-pino`.
- Create a `GlobalExceptionFilter` to log unhandled exceptions with full stack trace and request context.
- Redact sensitive data (passwords, tokens, authorization headers).
- Add unit tests for filter, request ID, and redaction.

## 3. Architecture & Approach

### 3.1. Configuration
- **Environment Variables**: Add `APP_LOG_LEVEL` to the app configuration (`app.config.ts`).
- **Dependencies**: Install `nestjs-pino`, `pino-http`, `pino-pretty`, and `uuid`.
- **AppModule Integration**: 
  - Import `LoggerModule.forRootAsync` in `AppModule`.
  - Use `pino-http` configuration to define serializers, custom request IDs, and environment-based log formatting.

### 3.2. Request Correlation & HTTP Logging
- **Request ID generation**: Inside `pino-http` config, use `genReqId` to return a `uuidv4()` and attach it to the `req` object.
- **Header Injection**: Use `customProps` or `customSuccessMessage`/middleware to attach `X-Request-Id` to the `res` object.
- **HTTP Auto-logging**: `nestjs-pino` automatically tracks response time (ms), status code, IP, and user-agent. The existing `LoggerMiddleware` will be deleted.

### 3.3. Redaction
- Configure Pino's `redact` array to mask sensitive fields:
  - `req.headers.authorization`
  - `req.headers.cookie`
  - `body.password`, `body.oldPassword`
  - `body.token`, `body.refreshToken`

### 3.4. Global Exception Filter
- **Location**: `src/utils/global-exception.filter.ts`.
- **Functionality**: Implements `ExceptionFilter`. Catches all `Error` and `HttpException`.
- **Logging**: Uses `@nestjs/common` `Logger` (backed by Pino) to log `error.stack`, `req.id`, `req.method`, and `req.url`.

### 3.5. Service Refactoring
- Search for empty `catch (err) {}` or `console.error` blocks in:
  - `src/auth/auth.service.ts`
  - `src/exam-results/exam-results.service.ts`
  - `src/auth-facebook/auth-facebook.service.ts`
- Inject NestJS `Logger` into these services and use `this.logger.error()` to record the caught exceptions.

## 4. Testing Strategy
- **Unit Tests**:
  - Test `GlobalExceptionFilter` to ensure it calls the logger and returns the expected JSON response.
  - Test logger configuration to verify request ID generation (mocking HTTP request).
  - Test redaction rules (ensuring passwords/tokens are masked in the output).

## 5. Security & Privacy
- Ensures no passwords, tokens, or PII leak into log aggregation systems through strict `redact` paths.

## 6. Migration / Deployment Notes
- Need to ensure `NODE_ENV` is correctly set in production for JSON logs.
- Need to install `pino-pretty` as a dev dependency so local development continues to have readable logs.