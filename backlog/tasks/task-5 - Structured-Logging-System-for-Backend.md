---
id: TASK-5
title: Structured Logging System for Backend
status: To Do
assignee: []
created_date: '2026-10-09 01:55'
labels: []
dependencies: []
references:
  - 'https://github.com/iamolegga/nestjs-pino'
  - 'https://docs.nestjs.com/techniques/logger'
documentation:
  - src/utils/logger.middleware.ts
  - src/main.ts
  - src/app.module.ts
  - src/auth/config/auth.config.ts
type: enhancement
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The backend currently relies entirely on the NestJS built-in `Logger` from `@nestjs/common`, which outputs unstructured plain text to stdout. There is no log level configuration per environment, no structured (JSON) output for production log aggregation, no request correlation (request ID tracing), and no centralized error logging strategy. The existing `LoggerMiddleware` (`src/utils/logger.middleware.ts`) logs HTTP requests but lacks response time tracking and request IDs. There is also one stray `console.error` call in `auth-facebook.service.ts`. Multiple service files have silent `catch` blocks (e.g., `auth.service.ts` with 5 empty catch blocks, `exam-results.service.ts`) that swallow errors without any logging. This makes debugging production issues, tracing request flows, and monitoring application health extremely difficult. The goal is to integrate a structured logging library (e.g., `nestjs-pino` with `pino`) to replace the built-in Logger across the application, providing JSON-formatted logs in production, human-readable logs in development, request correlation via auto-generated request IDs, and consistent error logging in all catch blocks and exception filters.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A structured logging library (e.g., `nestjs-pino` or `winston`) is integrated and replaces the default NestJS Logger as the application-wide logger via `bufferLogs: true` and `app.useLogger()`
- [ ] #2 Log output format is JSON in production and human-readable (pretty-print) in development, controlled by environment configuration
- [ ] #3 Log levels are configurable per environment via `app.config.ts` (e.g., `debug` for development, `info` for staging, `warn` for production)
- [ ] #4 Every HTTP request is automatically assigned a unique request ID (UUID) that is included in all log entries for that request and returned in the response header `X-Request-Id`
- [ ] #5 The `LoggerMiddleware` is upgraded or replaced to log: method, URL, status code, response time (ms), content-length, user-agent, IP, and request ID
- [ ] #6 All existing silent/empty `catch` blocks in service files (`auth.service.ts`, `exam-results.service.ts`, `auth-facebook.service.ts`) are updated to log errors with appropriate context using the structured logger
- [ ] #7 The stray `console.error` in `auth-facebook.service.ts` is replaced with a proper logger call
- [ ] #8 A global exception filter is implemented that logs unhandled exceptions with full stack trace, request context, and request ID before returning the error response
- [ ] #9 Sensitive data (passwords, tokens, authorization headers) is redacted from log output via serializer configuration
- [ ] #10 Unit tests cover the logger configuration, the global exception filter, and the request ID propagation
<!-- AC:END -->
