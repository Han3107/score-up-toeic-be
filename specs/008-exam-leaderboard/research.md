# Phase 0: Research

## Leaderboard Ranking in MongoDB
**Decision**: Store pre-calculated metrics (`averageScore`, `totalCompletedExams`, `lastExamCompletedAt`) on the `User` document (or a dedicated `LeaderboardStats` collection) that are updated incrementally every time an exam is completed.
**Rationale**: Incrementally updating the stats upon exam completion allows the leaderboard read query to be a simple `.find({ 'stats.totalCompletedExams': { $gt: 0 } }).sort({ 'stats.averageScore': -1, 'stats.totalCompletedExams': -1, 'stats.lastExamCompletedAt': 1 }).limit(50).skip(...)`. This read pattern is extremely fast and scalable, fully satisfying the < 2s load time (SC-002) for thousands of users. It also satisfies the real-time update requirement (SC-003) because the stats are updated immediately on submission.
**Alternatives considered**: On-the-fly MongoDB `$group` aggregation pipeline for every leaderboard request. While accurate without denormalization, it would require scanning all exam results repeatedly on every read, which could degrade performance and violate the 2s response time constraint as the number of exams grows to hundreds of thousands.
