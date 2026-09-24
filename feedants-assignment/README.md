# Feedants Competition Details — Full Stack Assignment

A production-oriented implementation of the Feedants Competition Details screen from the supplied technical assignment.

## Scope

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **State/data:** REST API, server-driven competition data, registration state, countdown/lifecycle state
- **Concurrency:** Atomic MongoDB registration update + unique participant index
- **Validation:** Joi on API payloads, Mongoose validation, state/date/spot business rules
- **Developer experience:** seed script, Docker Compose for MongoDB, environment examples, health endpoint

The supplied assignment explicitly requires a functional full-stack feature rather than a static UI, with dynamic competition information, participation state, dates/lifecycle, remaining spots, time-dependent information, user actions, data consistency, API/database/validation/business-rule decisions, and scalability considerations. fileciteturn0file0L9-L39

## Features implemented

1. Competition details are loaded from MongoDB through the Express API.
2. Registered/unregistered state is fetched per demo user.
3. Registration is atomic and cannot oversubscribe the competition.
4. Duplicate registration is prevented by a compound unique index.
5. Competition lifecycle is calculated from registration/submission/result dates.
6. Countdown updates every second on mobile.
7. Registration button changes based on lifecycle, registration state and capacity.
8. Submission state is supported with a submission URL and submission endpoint.
9. Previous winners, judge, rewards and competition tabs are server data.
10. Registration/submission errors are surfaced in the mobile UI.
11. MongoDB indexes support the high-read competition and participant lookups.
12. Seed data recreates the supplied “Feedants Classical Dance” example.
13. README includes assumptions, major technical decisions, trade-offs and production follow-ups as requested by the assignment. fileciteturn0file0L66-L77

## Architecture

```text
React Native / Expo
        |
        | HTTPS REST
        v
Node.js + Express
  |     |      |
  |     |      +--> validation / error handling
  |     +---------> competition service
  +---------------> registration service
        |
        v
     MongoDB
  Competition
  Participant
  Submission
```

### Why this design?

The assignment intentionally leaves the API and schema open and asks the candidate to make scalable real-world technical decisions. fileciteturn0file0L44-L48

- **Separate Participant and Submission collections:** avoids putting an unbounded participant array inside a Competition document.
- **Atomic capacity update:** registration uses `findOneAndUpdate` with `registeredCount < maxParticipants`, preventing two simultaneous requests from both consuming the final seat.
- **Unique participant index:** `(competitionId, userId)` prevents duplicate registrations even if the client retries.
- **Server-calculated lifecycle:** clients do not decide whether registration is open.
- **Mongoose indexes:** support the main access paths.
- **Idempotent registration response:** repeated registration returns the already-registered state rather than creating a second participant.

## API

### `GET /api/v1/competitions/:competitionId?userId=demo-user-001`
Returns competition details, lifecycle, remaining spots, registration state and submission state.

### `POST /api/v1/competitions/:competitionId/register`
Header: `x-user-id: demo-user-001`

Registers the current user. The operation is capacity-safe and duplicate-safe.

### `POST /api/v1/competitions/:competitionId/submission`
Header: `x-user-id: demo-user-001`
Body:

```json
{ "submissionUrl": "https://example.com/my-dance-video" }
```

### `GET /api/v1/health`
Returns service/database health.

## Running locally

### 1. Start MongoDB

```bash
docker compose up -d mongo
```

### 2. Start backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

Backend defaults to `http://localhost:5000`.

### 3. Start mobile app

```bash
cd mobile
cp .env.example .env
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` according to the device/emulator you are using:

- Android emulator: `http://10.0.2.2:5000/api/v1`
- iOS simulator: `http://localhost:5000/api/v1`
- Physical phone: `http://YOUR_COMPUTER_LAN_IP:5000/api/v1`

## Demo user

The app uses `demo-user-001` as the default demo identity. This is intentionally a lightweight assignment authentication boundary; a production deployment should replace it with JWT/session authentication.

## Design fidelity

The mobile screen follows the supplied reference structure: top navigation/language control, competition hero card, judge card, countdown strip, important dates, previous winners, tabbed information, rewards, disclaimer, prize-payment/refund information, referral block, user feedback row, ad placeholder, upload-submission CTA and bottom navigation. The reference image is on page 3 of the assignment PDF. fileciteturn0file0L79-L83

## Important assumptions

- The provided screen does not define a real authentication system, so a demo user header is used.
- “Entry fee” is displayed but payment processing is outside the assignment's explicitly listed requirements; registration is therefore implemented as a backend state transition without charging money.
- Submission upload is represented by a validated HTTPS URL because the assignment does not define storage or media-upload requirements.
- Winner media can be represented by image URLs. Production should move these assets to object storage/CDN.
- The sample dates in the reference are historical relative to the current environment, so the seed script creates the competition using dates configurable in the seed file. For a fresh demo, set future dates before running the seed if needed.

## Major technical decisions

- React Native + Expo for fast cross-platform execution.
- Express controllers/services separation to keep HTTP concerns away from business rules.
- Mongoose schema validation plus Joi request validation.
- Atomic MongoDB conditional increment for capacity consistency.
- Unique compound participant index for duplicate protection.
- Lean/read-oriented MongoDB queries for competition details.

## Trade-offs

- Demo authentication is intentionally simple instead of adding an unrelated auth subsystem.
- URL submission avoids large-file infrastructure, virus scanning and object-storage setup.
- No payment provider is integrated because payment processing is not defined by the supplied brief.
- The app prioritizes the supplied single-screen flow instead of implementing the entire Feedants product navigation.

## Production improvements

If this became a production module, I would add:

- JWT/OAuth authentication and authorization.
- Razorpay/Stripe payment order + webhook verification if entry-fee collection is required.
- S3/Cloudinary-style media upload with signed URLs and asynchronous processing.
- Redis caching for hot competition details.
- Rate limiting, request tracing and structured logging.
- Background jobs for lifecycle transitions, notifications and result publication.
- Cursor pagination for winner/feedback lists.
- Automated integration/load tests for registration contention.
- CI/CD with lint, tests, build and security scanning.
- Observability with metrics for registration failures, latency and DB contention.

## Evaluation checklist mapping

The assignment evaluates design accuracy, React Native quality, reusable components, dynamic states, backend architecture/API, MongoDB modelling, business logic, validation/edge cases, concurrency/data consistency, scalability, code quality and technical decisions. fileciteturn0file0L49-L65

| Requirement | Implementation |
|---|---|
| Design accuracy | Reusable RN cards/sections closely mirror reference |
| Dynamic data | MongoDB -> Express -> RN |
| User state | Participant lookup + UI state |
| Availability | `registeredCount`, `maxParticipants`, remaining spots |
| Dates/lifecycle | Server lifecycle calculation |
| Time-dependent UI | 1-second countdown |
| Backend logic | Service layer + state validation |
| APIs | REST endpoints documented above |
| DB structure | Competition, Participant, Submission |
| Validation | Joi + Mongoose + business rules |
| Edge cases | Full capacity, closed registration, duplicate registration, invalid dates, invalid URL, missing user |
| Concurrency | Conditional atomic capacity update + unique index |
| Scalability | Indexes, bounded documents, stateless API design |
| Maintainability | Controllers/services/models/components separation |
| Submission | GitHub + run instructions + env config + demo recording checklist |

## Screen recording checklist

Record a 2–4 minute walkthrough showing:

1. App loading competition data from the backend.
2. Countdown changing with time.
3. Remaining spots and registration state.
4. Register action.
5. Reopening/refreshing and showing persisted registration state.
6. Submission URL validation and successful submission.
7. API/terminal logs or MongoDB data demonstrating persistence.
8. Explain the atomic capacity update and unique index in 20–30 seconds.

The assignment explicitly asks for a short screen recording demonstrating the working implementation. fileciteturn0file0L66-L77
