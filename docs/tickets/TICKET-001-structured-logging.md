# TICKET-001: Structured Logging System

## Description

Implement a structured logging system for the backend to replace the current NestJS built-in `Logger` which only outputs unstructured plain text to stdout.

The current system has several gaps: the `LoggerMiddleware` logs HTTP requests but lacks request ID and response time tracking, there is one stray `console.error` in `auth-facebook.service.ts`, multiple catch blocks in `auth.service.ts` silently swallow errors without logging, and there is no global exception filter to catch unhandled exceptions. This makes debugging production issues and tracing request flows extremely difficult.

The goal is to integrate `nestjs-pino` as the application-wide logger, providing JSON-formatted logs in production, human-readable logs in development, automatic request ID correlation across all log entries, and consistent error logging throughout the application.

## Functional Requirements

- Integrate `nestjs-pino` as the application-wide logger, replacing the NestJS built-in `Logger` via `bufferLogs: true` and `app.useLogger()`.
- Output JSON format in production and pretty-print in development, controlled by `NODE_ENV`.
- Configure log levels per environment via `APP_LOG_LEVEL` env variable (e.g., `debug` for development, `info` for staging, `warn` for production).
- Automatically assign a unique request ID (UUID v4) to every HTTP request, include it in all log entries, and return it in the `X-Request-Id` response header.
- Replace the existing `LoggerMiddleware` with `nestjs-pino` auto HTTP logging which includes method, URL, status code, response time (ms), content-length, user-agent, IP, and request ID.
- Update all silent/empty catch blocks in `auth.service.ts` (lines 248, 293, 376, 385, 404), `exam-results.service.ts`, and `auth-facebook.service.ts` to log errors with appropriate context.
- Replace the stray `console.error` in `auth-facebook.service.ts` with a proper logger call.
- Implement a global exception filter that logs unhandled exceptions with full stack trace, request context, and request ID.
- Redact sensitive data (passwords, tokens, authorization headers) from log output via pino redact configuration.

## Acceptance Criteria

- The application uses `nestjs-pino` as the default logger across all modules.
- Log output is JSON in production and human-readable in development.
- Log levels are configurable per environment via `APP_LOG_LEVEL` environment variable.
- Every HTTP request/response is logged with a unique request ID, and the ID is returned in the `X-Request-Id` response header.
- All previously silent catch blocks log errors with context before throwing/handling exceptions.
- No `console.log` or `console.error` calls remain in the codebase.
- Unhandled exceptions are caught by the global exception filter and logged with stack trace and request context.
- Sensitive data (passwords, tokens, authorization headers) is redacted from all log output.
- Unit tests cover the global exception filter, request ID generation, and sensitive data redaction.
