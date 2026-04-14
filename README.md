# mzansiBuilds
 
A platform that helps developers build publicly and keep up with what other developers are building.
 
## Overview
 
`mzansiBuilds` is a full-stack web application built with React, Vite, Express, and Supabase. It enables authenticated users to create projects, add milestones, request collaboration, and post comments while using Supabase for authentication and database storage.
 
 
## Features
 
- User authentication with Supabase
- Project creation, updating, and public listing
- Commenting on projects
- Collaboration requests for project contributors
- Milestone management
- Client-side UI built with React and Vite
- Backend API built with Express
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, React Icons |
| Backend | Express, Node.js |
| Database/Auth | Supabase |
| Dev Tooling | ESLint, Nodemon, concurrently, dotenv |
 
---
 
## Folder Structure
 
```
root(mzansiBuilds)/
├── src/
│   ├── client/                  # React frontend application
    |    └── src/
│   |       ├── assets/          # Generic graphics
│   |       ├── components/      # UI components used by multiple pages
│   |       ├── context/         # UI context and provider files
│   |       ├── lib/             # supabase config file
│   |       ├── pages/           # UI page files
│   |       └── services/        # Frontend API for requests
│   └── server/
│       └── src/
│           ├── controller/      # Controller layer for API requests
│           ├── service/         # Business logic layer
│           ├── repository/      # Data access layer using Supabase
│           ├── route/           # Route definitions for API endpoints
│           ├── config/          # Supabase client configuration
│           └── middleware/      # Authentication middleware
```
 
---
 
## Database Schema
 
| Table | Columns |
|---|---|
| `users` | `userId`, `email`, `bio`, `createdAt` |
| `projects` | `projectId`, `userId`, `title`, `description`, `techStack`, `status`, `visibility`, `stage`, `support`, `createdAt` |
| `milestones` | `milestoneId`, `projectId`, `title`, `description`, `createdAt` |
| `comments` | `commentId`, `projectId`, `userId`, `body`, `createdAt` |
| `collaborations` | `collaborationId`, `projectId`, `requestingUserId`, `message`, `createdAt` |
 
---
 
## Setup and Run
 
### Prerequisites
 
- Node.js 18+ or compatible version
- npm
 
### Quick Start
 
The `.env` files are included in the repository with the Supabase credentials for the assessment project. No environment setup is needed.
 
From the repository root, run:
 
```bash
npm run start
```
 
This will install all dependencies for the root, frontend, and backend, then start both servers concurrently.
 
The app will be available at:
- **Client:** http://localhost:5173
- **Server:** http://localhost:3000
 
### Manual Setup
 
Alternatively, navigate to `src/client` and `src/server` in separate terminals and run:
 
```bash
npm install
npm run dev
```
 
### Run Without Reinstalling
 
If dependencies are already installed, from the root run:
 
```bash
npm run dev
```
 
---
 
## Environment Variables
 
The `.env` files are committed to this repository for assessment purposes. They are pre-configured and require no changes.
 
#### `src/server/.env`
 
```env
SUPABASE_URL=<included in repo>
SUPABASE_SERVICE_ROLE_KEY=<included in repo>
SUPABASE_ANON_KEY=<included in repo>
PORT=3000
```
 
#### `src/client/.env`
 
```env
VITE_SUPABASE_URL=<included in repo>
VITE_SUPABASE_ANON_KEY=<included in repo>
```
 
---
 
## API Endpoints
 
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users` | Register or update a user |
| `POST` | `/projects/add` | Create a new project |
| `GET` | `/projects` | Get all public projects |
| `GET` | `/projects/:id` | Get a project by ID |
| `GET` | `/projects/user/:id` | Get all projects by a user |
| `PUT` | `/projects/update/:id` | Update a project |
| `DELETE` | `/projects/delete/:id` | Delete a project |
| `POST` | `/comments` | Post a comment on a project |
| `POST` | `/collaborations` | Send a collaboration request |
| `POST` | `/milestones` | Add a milestone to a project |
 
---
 
## Assessment Notes

- The branches represent development history and the submission can be found in the `derivco-skills-quest` branch
- The Supabase project was created exclusively for this assessment.
- Auth middleware protects most endpoints using Supabase JWT verification.
- The architecture follows a controller → service → repository pattern for separation of concerns.
- In a production environment, `.env` files would not be committed and the service role key would be restricted to server-side use only as this is a security risk.
 
---
 
## License
 
This project is licensed under the ISC License.
 