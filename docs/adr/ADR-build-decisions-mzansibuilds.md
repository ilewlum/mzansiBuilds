# ADR Build decisions Selection for MzansiBuilds

| Field      | Value                                         |
|------------|-----------------------------------------------|
| Date       | 2025-01-15                                    |
| Status     | Accepted                                      |
| Deciders   | Mulweli Mulaudzi                              |

---

## Context

MzansiBuilds is a developer social platform built as a solo assessment submission for the
Derivco Code Skills Challenge. The platform enables developers to build publicly, share
progress, and connect with collaborators.

Key constraints driving this decision:

- Solo developer, 9-day delivery window 
- Must support a real-time live feed, new projects appear without page refresh
- Must support developer account management with secure auth (SRS FR01)
- Must support project creation with stage and support required (SRS FR02)
- Must support milestone progress updates per project (SRS FR04)
- Must support a public Celebration Wall for completed projects (SRS FR05)
- Green, white, and black design theme specified in SRS
- free-tier hosting

---

## Decision Drivers

- **Development speed**: solo dev, 6-day window.
- **Real-time capability**: live feed is a core SRS requirement (FR03), not optional.
- **Auth out-of-the-box**: building JWT auth from scratch consumes 1–2 dev days.
- **Row-level security**: data must be isolated per user without custom middleware sprawl.
- **Single language ecosystem**: reduces context switching for a solo developer under time pressure.
- **Relational data model**: projects relate to users, milestones, comments, and collaborations, SQL is the natural fit.
- **Code reviewability**: clean, idiomatic, well-structured code for the assessment panel.
---

## Considered Options
### Frontend
- **[CHOSEN]** React + Vite
- Next.js

### Backend / BaaS
- **[CHOSEN]** Node.js + Express + Supabase
- Firebase (Firestore + Auth + Realtime Database)

### Database
- **[CHOSEN]** PostgreSQL via Supabase
- Firebase Firestore

### Real-Time Strategy
- **[CHOSEN]** Supabase Realtime (PostgreSQL change subscriptions)
- Socket.io with a custom Express WebSocket server

### Styling
- **[CHOSEN]** Tailwind CSS
- CSS Modules
---

## Decision Outcome

**Chosen stack:**

> React + Vite (frontend) — Node.js + Express (REST API layer) — Supabase (PostgreSQL +
> Auth) — Tailwind CSS (styling)

### Positive Consequences

- **Supabase Realtime** solves FR03 (live feed) via PostgreSQL change subscriptions —
  no custom WebSocket infrastructure required, saving approximately one full development day
- **Supabase Auth** handles FR01 (account management) with JWT tokens out of the box —
  register, login, session persistence, and password reset without building an auth system
- **Row Level Security (RLS)** on Supabase enforces per-user data access at the database
  layer — a single RLS policy replaces dozens of ownership checks across API endpoints
- **PostgreSQL relational model** naturally handles the project-milestones-comments-
  collaborations data structure with foreign keys, joins, and indexes — no document
  denormalisation needed
- **Single JS/TS ecosystem** across React client and Express server reduces cognitive
  overhead for a solo developer operating under a deadline, improving overall dev time.
- Entire stack deployable on free tiers (Supabase) 
- React ecosystem provides mature testing tooling (Vitest, React Testing Library) needed
  for the test phase on Day 5

  ### Negative Consequences

- **Supabase vendor lock-in**: migrating away from Supabase at a later stage would
  require rewriting auth logic, real-time subscriptions, and RLS policies — the cost of
  switching is non-trivial
- **Free-tier connection limits**: Supabase free tier supports approximately 50 concurrent
  database connections — unsuitable for production scale without a paid plan upgrade
- **Extra network hop**: React → Express API → Supabase adds latency
  compared to a fullstack framework like Next.js with server-side rendering; acceptable
  at this scale but a consideration for a production deployment
- **Express API is stateless**: Supabase Realtime subscriptions must be managed on the
  client, not the server — the API layer cannot broadcast events, limiting future
  server-initiated push capabilities
- **Railway cold starts**: the Express API on Railway's free tier may have cold start
  delays after periods of inactivity — mitigated by a warm-up ping on demo day

---

## Pros and Cons of the Options

### Next.js (rejected)

- **Good**: built-in SSR, file-based routing, tight Vercel  integration, excellent for SEO, but deployment is not a priority.
- **Bad**: SSR adds architectural complexity not needed for a primarily client-side SPA;
  API routes in Next.js are less flexible than a dedicated Express server for complex
  middleware chains; the opinionated structure slows iteration speed within a 6-day window

### Firebase (rejected)

- **Good**: real-time built-in (Realtime Database / Firestore), auth built-in, generous
  free tier, battle-tested at scale
- **Bad**: Firestore is a NoSQL document store — joining users, projects, milestones,
  comments, and collaborations requires either data denormalisation (maintenance burden)
  or multiple round-trip queries (performance cost); no standard REST API; Firebase
  ecosystem is Google-proprietary with a steeper lock-in than Supabase

### Socket.io with Custom Express Server (rejected)

- **Good**: full control over real-time event types, rooms, and broadcast logic
- **Bad**: requires a stateful server — incompatible with serverless deployment targets;
  significant extra development time to build, secure, test, and deploy when Supabase
  Realtime already solves the live feed requirement without custom infrastructure

### MongoDB Atlas (rejected)

- **Good**: flexible schema, free tier (M0), familiar to many JavaScript developers,
  good performance for document reads
- **Bad**: the relational data model (users → projects → milestones → comments) maps
  poorly to MongoDB documents; references and lookups in MongoDB are more complex and
  less performant than SQL joins for this use case; no native real-time subscriptions
---

## SRS Traceability

| Requirement | Description                        | Architectural Solution                          |
|-------------|------------------------------------|-------------------------------------------------|
| FR01        | Developer account management       | Supabase Auth — JWT, register, login, sessions  |
| FR02        | Project entry with stage + support | PostgreSQL `projects` table + Express REST API  |
| FR03        | Live feed + comments + raise hand  | Supabase Realtime on `projects` + `comments`    |
| FR04        | Milestone progress updates         | `milestones` table — PATCH endpoint per project |
| FR05        | Celebration Wall on completion     | `celebration_wall` table — public GET /wall     |

---

## Security Considerations

Architectural decisions made with security as a first-class concern:

- **Row Level Security (RLS)** enabled on all tables — users cannot read or write data
  they do not own, enforced at the database layer regardless of API behaviour
- **JWT verification middleware** on all protected Express routes — Supabase-issued tokens
  validated on every request
  frontend domain; wildcard `*` is not used in any environment
- **Environment variables** for all secrets — `.env` never committed; `.env.example`
  committed to document required variables
- **Helmet.js** middleware on Express — sets secure HTTP response headers
- **express-rate-limit** on auth endpoints — prevents brute-force login attacks
- **Input validation** via Zod on all POST/PATCH request bodies — both client-side
  and server-side.

---

## Future Considerations

If MzansiBuilds were to scale beyond a demo or MVP stage, the following architectural
changes would be warranted:

- **Auth**: move to a dedicated auth service (Auth0 or AWS Cognito) to support SSO,
  MFA, organisation-level tenancy, and enterprise identity providers
- **Real-time**: replace Supabase Realtime with Redis Pub/Sub backed by a dedicated
  WebSocket service (e.g. Soketi or a custom Socket.io cluster) for horizontal scalability
  beyond what a single Supabase project supports
- **Database**: add read replicas for the feed query as user count grows; consider a
  CQRS pattern separating feed reads from transactional project writes
- **Frontend**: migrate to Next.js for server-side rendering of developer profiles and
  the Celebration Wall — public pages should be crawlable for SEO
- **API layer**: move from Express to a typed framework (Fastify + TypeScript) with
  OpenAPI documentation auto-generated from route schemas
- **Deployment**: containerise with Docker and orchestrate with Kubernetes (or use AWS
  ECS) for consistent staging/production parity and horizontal scaling
- **Monitoring**: add structured logging (Pino), distributed tracing (OpenTelemetry), and
  an error tracking service (Sentry) — none of which are justified for a demo build but
  are non-negotiable at production scale

---

## Links and References

### Documentation Consulted

- Supabase Realtime: https://supabase.com/docs/guides/realtime
- Supabase Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Supabase Auth: https://supabase.com/docs/guides/auth
- React Router v6: https://reactrouter.com/en/main
- Express Helmet: https://helmetjs.github.io
---