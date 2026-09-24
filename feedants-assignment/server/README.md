# Feedants API

See the root README for architecture, business rules and setup.

Key routes:
- GET /api/v1/health
- GET /api/v1/competitions/:competitionId?userId=demo-user-001
- POST /api/v1/competitions/:competitionId/register with `x-user-id`
- POST /api/v1/competitions/:competitionId/submission with `x-user-id`
