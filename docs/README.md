# MzansiBuilds — Diagram Reference

> This document is a companion to the [Architecture Decision Record](./ADR-build-decisions-mzansibuilds.md). The ADR covers *why* each technology was chosen and the trade-offs involved. This document covers *how* the chosen stack is structured and how data moves through it, using the system's UML and architecture diagrams as the guide.

> Note all referenced diagrams can in found in the docs folder.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Class & Layer Structure](#class--layer-structure)
- [Authentication Flow](#authentication-flow)
- [Project Creation Flow](#project-creation-flow)
- [Comment Flow](#comment-flow)
- [Collaboration Flow](#collaboration-flow)
- [Full Sequence Diagram](#full-sequence-diagram)

---

## System Architecture

System Architecture Diagram
>docs/uml/system-architecture-diagram.png

The system is split across three layers — browser, server, and data — with two distinct communication channels operating in parallel.

### Browser (Client Environment)

Three components run simultaneously in the client:

- **React UI** — renders views and drives state from API responses and real-time events
- **Auth Context (Supabase Auth)** — holds the user's active session and JWT. The token is attached to every outbound HTTP request as an `Authorization` header
- **Realtime Listener (WebSocket)** — maintains a persistent WebSocket connection directly to Supabase's Realtime service. This is the mechanism behind the live feed (FR03): when a `projects` or `comments` row changes in PostgreSQL, Supabase pushes the event over this channel to all subscribed clients — **Express is not involved**

### Server Layer

- **Express API** — handles all intentional CRUD operations from the client over HTTP REST. It forwards the `Authorization` header to Supabase on every protected request rather than verifying it locally. Business logic (ownership assertions, state transitions) lives in the Express service layer.

### Data Layer — Supabase

- **PostgreSQL** — the primary store for all application data, queried by Express
- **Auth Service** — Supabase's built-in JWT issuer and verifier; also the enforcement point for Row Level Security
- **Realtime** — listens to PostgreSQL WAL (write-ahead log) change events and broadcasts them over WebSocket to subscribed clients

The two channels — HTTP through Express, and WebSocket direct to Supabase — serve different purposes and never overlap. Writes always go through Express; read events for the live feed bypass it entirely.

---

## Database Design

[Entity-Relation Diagram]
>(docs/uml/Entity-Relation-diagram.png)

The relational model maps directly to the five core features of the platform. All primary keys are UUIDs.

### Entities

**User** — the root entity. Owns projects, authors comments and milestones, and initiates collaboration requests. Fields: `user_id`, `username`, `bio`, `email`.

**Project** — belongs to one user. The central object on the platform. Fields: `user_id`, `title`, `description`, `stage`, `visibility`, `tech_stack`, `status`, `created_at`. The `stage` and `status` fields are enum-constrained (see class diagram).

**Milestone** — a progress checkpoint on a project. Linked to both a `project_id` and a `user_id` (the creator). Fields: `title`, `description`, `created_at`. A project can have zero or many milestones.

**Comment** — linked to a `user_id` and a `project_id`. Stores the comment `body` and `created_at`. A project can have zero or many comments. The `comments` table is one of the two Supabase Realtime subscriptions.

**Collaboration** — represents a request from one user to join another user's project. Stores `requesting_user_id`, `project_id`, `title`, `message`, `status`, and `created_at`. Status transitions (PENDING → ACCEPT or DECLINE) are managed by the project owner.

### Cardinality at a glance

- `User` → `Project`: 1 to 0..*
- `User` → `Milestone`: 1 to 0..*
- `User` → `Comment`: 1 to 0..*
- `User` → `Collaboration` (as requester): 1 to 0..*
- `Project` → `Milestone`: 1 to 0..*
- `Project` → `Comment`: 1 to 0..*
- `Project` → `Collaboration`: 1 to 0..*

---

## Class & Layer Structure

Class Diagram
>(docs/uml/class-diagram.png)

The Express backend is organised into three explicit layers — Model, Repository, Service, controller — with auth handled externally by Supabase.

### Model Layer

Pure data classes. Each model mirrors its corresponding database table and exposes only typed fields plus getters/setters. No business logic lives here.

`User` · `Project` · `Milestone` · `Comment` · `Collaboration`

### Repository Layer

One repository per model. Repositories are the only layer permitted to interact with Supabase's database client — they abstract all SQL/query-builder calls behind method signatures.

Each repository provides standard CRUD plus domain-specific finders:

- `UserRepository` — `findById`, `findByEmail`, `save`, `update`, `delete`
- `ProjectRepository` — `findById`, `findByUserId`, `findPublic`, `save`, `update`, `delete`
- `MilestoneRepository` — `findById`, `findByProjectId`, `save`, `update`, `delete`
- `CommentRepository` — `findById`, `findByProjectId`, `getComments`, `update`, `editComment`, `delete`
- `CollaborationRepository` — `findById`, `findByProjectId`, `findByUserId`, `save`, `updateStatus`, `cancelCollaboration`, `delete`

### Service Layer

Services contain all business logic. They coordinate between repositories, enforce ownership rules, and assert preconditions before any database operation is permitted.

- `UserService` — `createUser`, `updateUser`, `assertExists`
- `ProjectService` — full project lifecycle: `createProject`, `getProject`, `getUserProjects`, `getPublicProjects`, `updateProject`, `publishProject`, `archiveProject`, `assertOwner`
- `MilestoneService` — `createMilestone`, `getMilestones`, `updateMilestone`, `deleteMilestone`, `assertProjectOwner`
- `CommentService` — `addComment`, `getComments`, `editComment`, `deleteComment`, `assertAuthor`
- `CollaborationService` — `requestCollaboration`, `getProject/UserCollaborations`, `acceptCollaboration`, `rejectCollaboration`, `cancelCollaboration`, `assertPending`, `assertProjectOwner`

The `assert*` methods are guard functions — they throw before a repository call if the precondition fails, keeping the database layer clean of policy enforcement.

### Controller Layer

Controllers handle all interactions between backend and frontend and hold implements all routes as well as all endpoints

- `UserController` — handles all user requests 
- `ProjectService` — handles full project lifecycle requests  
- `MilestoneService` — handles all milestone requests
- `CommentService` — handles all comment requests
- `CollaborationService` — handles all collaboration requests

### Auth (Supabase-managed)

- `SupabaseAuth` — external. Owns `signUp`, `signIn`, `signOut`, `getUser`, `verifyJWT`, `resetPassword`
- `AuthMiddleware` — Express middleware. Extracts the token via `extractToken(header)`, passes it to `SupabaseAuth` for verification, and calls `handleUnauthorized(res)` on failure. It does not decode or inspect the token payload itself.

### Enumeration Types

| Enum | Values |
|---|---|
| `ProjectStatusEnumeration` | ACTIVE, COMPLETE, ON_HOLD |
| `VisibilityEnumeration` | PUBLIC, PRIVATE |
| `StageEnumeration` | PLANNING, IN_PROGRESS, COMPLETE |
| `CollaborationStatusEnumeration` | ACCEPT, DECLINE |

---

## Authentication Flow

Authentication Flow Use Case Diagram
>(docs/uml/Authentication-usecase-diagram.jpg)

The diagram models two distinct sub-flows within a single boundary.

### First-Time Registration (left boundary)

1. New User submits the registration form → client sends `POST /auth/register`
2. Express calls `signUp(email, password)` on Supabase Auth
3. Supabase registers the user and immediately fires a **database trigger** that inserts a row into `public.users` — this keeps the auth identity and the application user record in sync atomically
4. Supabase issues a JWT → Express returns it to the client → client stores it in Auth Context

### Subsequent Login (right boundary)

1. User sends `POST /auth/login` → Express calls `signIn(email, password)` on Supabase
2. Supabase verifies credentials:
   - **Invalid** → `«extend» [invalid credentials]` path → Express returns `401 Unauthorized`
   - **Valid** → `«extend» [valid credentials]` path → Supabase issues JWT → JWT returned to client → `«includes»` client stores JWT

The note in the diagram bottom-left summarises the responsibility split: JWT issuance, verification, and enforcement is entirely Supabase's domain. Express forwards the `Authorization` header; it never parses it.

---

## Project Creation Flow

Project Creation Flow Use Case Diagram
>docs/uml/Project-Creation-usecase-diagram.jpg)

This flow establishes the pattern repeated across all protected write operations in the system (comments, milestones, and collaborations all follow the same shape).

1. Authenticated User sends `POST /projects` with JWT in the `Authorization` header
2. **Forward JWT to Supabase (Express Pass-through)** `«include»` → **Verify JWT (Supabase Auth)** — Express does not touch the token, it is forwarded as-is
3. On valid JWT → **Handle Service Layer Project Logic (Express)** `«include»` — ownership and data validation run here
4. Service layer calls **Enforce RLS Policy (Supabase PostgreSQL)**:
   - `«extend» [policy rejected]` → **Reject Request** → **Send Response to Client** → React UI is not updated
   - `«include» [policy cleared]` → **Insert Project Data into PostgreSQL** → **Return Result to Express** → **Send Response to Client** → **Update React UI (Project Visible)**

The two actors on the left — Authenticated User and Express Server — represent the two parties initiating actions. Supabase Auth & PostgreSQL on the right is the single external system boundary.

---

## Comment Flow

Comment Flow Use Case Diagram
>docs/uml/Comment-usecase-diagram.jpg)

The comment flow follows the same JWT-pass-through and RLS pattern as project creation, with one addition: because Supabase Realtime subscribes to the `comments` table, a successful insert triggers a WebSocket push to all other connected clients — their feeds update without any polling or page refresh.

1. Client User sends `POST /comments` + JWT
2. Express pass-through → Supabase Auth verifies JWT → `«include» [valid JWT]`
3. **Handle Service Layer Comment Logic** → `«include»` → **Enforce RLS Policy (Supabase PostgreSQL)**:
   - `«extend» [policy rejected]` → **Reject Request** → **Send Response to Client**
   - `«include» [policy cleared]` → **Insert Comment into PostgreSQL** → **Return Result to Express (Supabase)** → `«include»` → **Send Response to Client** → `«include»` → **Update React UI**

The diagram notes that this flow models a successful comment submission. If the JWT is invalid, Express notifies the client of the failure and prompts re-login — that error path is captured globally in the sequence diagram (flow 7).

---

## Collaboration Flow

Collaboration Flow Use Case Diagram
>docs/uml/Collaboration-usecase_diagram.jpg

The collaboration flow introduces three actors — **Collaborator**, **Project Owner**, and **Express Server** — and models two user-initiated paths that converge on the same service layer.

### Sending a Request (Collaborator)

1. Collaborator sends collaboration request with JWT → **Forward JWT to Supabase (Express Pass-through)** `«include»` → **Verify JWT (Supabase Auth)**
2. **Handle Service Layer Collaboration Logic (Express)** → `«include»` → **Enforce RLS Policy**:
   - `«include» [policy cleared]` → **Insert Collaboration Data into PostgreSQL** (status: PENDING) → **Return Result to Express** → `«include»` → **Send Response to Client** → `«include»` → **Update React UI (Collaboration outcome reflected)**

### Responding to a Request (Project Owner)

1. Project Owner sends response → same JWT verification path applies
2. **Responds to collaboration request** → `«extend» [request accepted]` or `«extend» [request rejected]` → routes into **Handle Service Layer Collaboration Logic**
3. The service layer's `assertProjectOwner` guard runs before the RLS check — only the project owner can change collaboration status
4. On RLS clear: status updated in PostgreSQL → result returned → UI updated for both parties

The diagram notes confirm the same cross-cutting rules: Supabase Auth verifies JWTs natively; Express forwards the token and does not verify it; RLS is enforced by Supabase PostgreSQL policies.

---

## Full Sequence Diagram

Sequence Diagram
>docs/uml/sequence-diagram.jpg

The sequence diagram is the single source of truth for end-to-end message flow across all five participants: **React UI**, **Client**, **Express API**, **Supabase Auth**, and **PostgreSQL**.

The individual use case diagrams above model *what* happens within each feature boundary. This diagram models *when* and *between whom* each message is exchanged, including the exact HTTP verbs, payload descriptions, and response codes.

### Flows

| # | Flow | Entry point | Terminal state |
|---|---|---|---|
| 1 | First-time Registration | User information input | JWT stored by client |
| 2 | Login — Unsuccessful | User credential input | Login unsuccessful prompt |
| 2 | Login — Successful | User credential input | JWT stored, login successful |
| 3 | Project Creation | User project input | React UI updated (project visible) |
| 4 | Add a Comment | User comment input | UI updated, comment visible |
| 5a | Request Collaboration | User collaboration request | UI updated (status: PENDING) |
| 5b | Respond to Collaboration | User collaboration response | UI updated (status: ACCEPT/DECLINE) |
| 6 | Create Milestone | User milestone data | UI updated, milestone data returned |
| 7 | Expired / Invalid JWT | Any protected request | Client prompted to re-login |
| 8 | RLS Failed | Database read/modification | "Something went wrong" |

### Reading the diagram

- Flows 7 and 8 are deliberately placed at the bottom as global failure cases rather than being repeated inline within each happy-path flow above them
- The colour-coded lifeline headers distinguish client-side participants (React UI, Client) from server-side (Express API) and Supabase-managed (Supabase Auth, PostgreSQL)
- The key notes panel (bottom right of the diagram) consolidates the cross-cutting rules that apply to every flow: JWT verification ownership, pass-through behaviour, RLS enforcement scope, and the Realtime WebSocket channel being direct-to-Supabase

---

*For rationale behind technology choices, rejected alternatives, SRS traceability, and future scaling considerations — see the ADR-build-decision-mzansibuilds.md*
