# Karrio Architecture Documentation

## Overview

Karrio is a full-stack SaaS job application tracking platform designed to help users organize applications, track interview progress, manage follow-ups, and save jobs directly from LinkedIn using a Chrome Extension.

The platform is built as a TypeScript monorepo and consists of three primary applications:

* **Web Application** – User-facing dashboard and application management system.
* **REST API** – Backend services, authentication, reminders, and business logic.
* **Chrome Extension** – LinkedIn job capture and synchronization.

---

# Architecture Overview

```text
Next.js Web App
    |
    | Axios + JWT
    v
NestJS REST API
    |
    | Prisma ORM
    v
PostgreSQL
```

### Extension Flow

```text
LinkedIn Job Page
        |
        v
Chrome Extension
        |
        | JWT Authentication
        v
NestJS REST API
        |
        v
PostgreSQL
```

### Reminder Processing

```text
Nest Schedule Cron
        |
        | Every Minute
        v
Find Due Reminders
        |
        v
Mark Reminder As Sent
```

---

# Monorepo Structure

```text
karrio/
│
├── apps/
│   ├── web/
│   ├── api/
│   └── extension/
│
├── packages/
│   ├── eslint-config/
│   └── typescript-config/
│
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

# Technology Stack

## Core Tooling

| Technology      | Purpose                |
| --------------- | ---------------------- |
| TypeScript      | Type safety            |
| pnpm Workspaces | Package management     |
| Turborepo       | Monorepo orchestration |
| ESLint          | Code quality           |
| Prettier        | Code formatting        |
| Husky           | Git hooks              |
| lint-staged     | Pre-commit validation  |

---

# Frontend Architecture

## Technology Stack

| Layer            | Technology      |
| ---------------- | --------------- |
| Framework        | Next.js 16      |
| UI Library       | React 19        |
| Language         | TypeScript      |
| Styling          | Tailwind CSS v4 |
| Components       | shadcn/ui       |
| Accessibility    | Radix UI        |
| Icons            | Lucide React    |
| API State        | TanStack Query  |
| HTTP Client      | Axios           |
| Forms            | React Hook Form |
| Notifications    | Sonner          |
| Theme Management | next-themes     |
| Date Utilities   | date-fns        |
| Drag & Drop      | dnd-kit         |

---

## Application Structure

```text
src/
│
├── app/
│   ├── login/
│   ├── signup/
│   └── (dashboard)/
│
├── components/
├── hooks/
├── providers/
├── services/
└── lib/
```

---

## Authentication Flow

```text
User Login
     |
     v
API Authentication
     |
     v
JWT Token
     |
     v
Stored in localStorage
     |
     v
Axios Interceptor
     |
     v
Authorization Header
```

```http
Authorization: Bearer <token>
```

Protected routes are guarded through a custom `ProtectedRoute` component and authenticated API requests automatically include the JWT token through Axios interceptors.

---

# Backend Architecture

## Technology Stack

| Layer                  | Technology        |
| ---------------------- | ----------------- |
| Framework              | NestJS 11         |
| ORM                    | Prisma            |
| Database               | PostgreSQL        |
| Authentication         | JWT               |
| Password Hashing       | bcrypt            |
| Validation             | class-validator   |
| DTO Transformation     | class-transformer |
| Environment Validation | Zod               |
| Scheduling             | Nest Schedule     |
| Testing                | Jest              |
| E2E Testing            | Supertest         |

---

## Module Structure

```text
AppModule
│
├── AuthModule
├── UsersModule
├── ApplicationsModule
├── RemindersModule
└── PrismaModule
```

---

## API Design

Karrio follows a REST-based architecture.

### Authentication

```http
POST /auth/signup
POST /auth/login
```

### User Management

```http
GET    /users/me
PATCH  /users/me
```

### Applications

```http
POST   /applications
GET    /applications
GET    /applications/upcoming-interviews
GET    /applications/:id
PATCH  /applications/:id
DELETE /applications/:id
```

### Reminders

```http
POST /reminders/follow-up
GET  /reminders
GET  /reminders/application/:id
```

---

# Database Design

## User

```text
User
├── id
├── name
├── email
├── password
└── createdAt
```

Relationships:

* One-to-Many Applications
* One-to-Many Reminders

---

## Application

```text
Application
├── id
├── company
├── role
├── status
├── notes
├── interviewDate
├── interviewType
├── jobUrl
├── description
├── platform
├── createdAt
├── updatedAt
└── userId
```

Relationships:

* Belongs to User
* Has Many Activities
* Has Many Reminders

---

## Application Activity

Application activities provide an audit trail for application changes.

```text
ApplicationActivity
├── id
├── applicationId
├── type
├── message
└── createdAt
```

Current activity types include:

* CREATED
* STATUS_CHANGED
* NOTES_UPDATED

---

## Reminder

```text
Reminder
├── id
├── title
├── message
├── remindAt
├── sent
├── type
├── createdAt
├── applicationId
└── userId
```

Supported reminder categories:

* INTERVIEW
* FOLLOW_UP
* DEADLINE
* NETWORKING

---

## Entity Relationships

```text
User
 │
 ├── Applications
 │       │
 │       ├── ApplicationActivities
 │       └── Reminders
 │
 └── Reminders
```

---

# Application Lifecycle

Applications move through a predefined workflow.

```text
SAVED
  |
  v
APPLIED
  |
  v
UNDER_REVIEW
  |
  v
ONLINE_ASSESSMENT
  |
  v
INTERVIEW
  |
  v
HR_ROUND
  |
  +------> REJECTED
  |
  +------> OFFER
  |
  +------> ACCEPTED
```

---

# Kanban System

The Kanban board visualizes applications by status.

Columns:

* Saved
* Applied
* Under Review
* Online Assessment
* Interview
* HR Round
* Offer
* Rejected
* Accepted

Workflow:

```text
Drag Application
        |
        v
dnd-kit Event
        |
        v
PATCH Application Status
        |
        v
Create Activity Log
        |
        v
Update UI
```

---

# Reminder System

The reminder subsystem manages interview and follow-up tracking.

## Automatic Interview Reminders

When an interview date is assigned:

1. Interview is saved.
2. Reminder is automatically created.
3. Reminder is scheduled one hour before the interview.

## Manual Follow-Up Reminders

Users can manually create follow-up reminders directly from an application.

## Reminder Processing

A scheduled cron job runs every minute:

```text
Cron Trigger
      |
      v
Find Due Reminders
      |
      v
Process Reminder
      |
      v
Mark Sent = true
```

Current implementation performs internal processing and logging. External delivery channels such as email, push notifications, and browser notifications are planned for future releases.

---

# Chrome Extension Architecture

## Technology Stack

* Chrome Manifest V3
* Plasmo
* Chrome Extension APIs

### APIs Used

* chrome.tabs
* chrome.storage.local
* chrome.scripting
* chrome.runtime.onMessage

---

## Extension Workflow

```text
LinkedIn Job Listing
        |
        v
Content Script
        |
        v
Extract Job Information
        |
        v
Popup Interface
        |
        v
Authenticated API Request
        |
        v
Save Application
```

Extracted information includes:

* Company Name
* Job Title
* Job URL

The extension synchronizes directly with the user's Karrio account.

---

# Security Architecture

## Password Security

Passwords are hashed using bcrypt before storage.

## Authentication

JWT-based authentication with:

* 7-day expiration
* Protected API routes
* Passport JWT strategy
* Custom CurrentUser decorator

## Validation

Request validation is performed through:

* DTO validation
* class-validator
* class-transformer

## Environment Protection

Environment variables are validated using Zod during application startup.

## Data Isolation

All application and reminder queries are scoped to the authenticated user to ensure tenant-level data separation.

---

# Infrastructure

## Local Development

Docker Compose provisions:

```text
PostgreSQL 16
Redis 7
```

Current usage:

| Service    | Status                     |
| ---------- | -------------------------- |
| PostgreSQL | Active                     |
| Redis      | Provisioned for future use |

---

## Production Deployment

| Service         | Platform           |
| --------------- | ------------------ |
| Web Application | Vercel             |
| REST API        | Render             |
| Database        | Managed PostgreSQL |

---

# Testing & Quality Assurance

Karrio includes automated quality and testing workflows.

### Testing

* Jest
* Supertest
* Unit Testing
* End-to-End Testing

### Code Quality

* ESLint
* Prettier
* Husky
* lint-staged

### Database Management

* Prisma Migrations
* Prisma Client Generation

### Build System

* Turborepo Build Pipelines
* Type Checking
* Linting
* Package Caching

---

# Design Patterns

Karrio currently follows several proven architectural patterns:

### Service Layer Pattern

```text
Controller
    |
    v
Service
    |
    v
Database
```

### Dependency Injection

Provided by NestJS.

### Modular Architecture

Feature-based module separation.

### Audit Log Pattern

ApplicationActivity acts as a historical event store for application changes.

### Background Job Pattern

Nest Schedule cron jobs process asynchronous reminder tasks.

---

# Future Enhancements

Planned improvements include:

* Email notifications
* Browser notifications
* Push notifications
* Redis caching
* Queue-based job processing
* AI-powered job insights
* Resume matching
* Advanced analytics
* Multi-tenant SaaS features
* Team collaboration

---

# Summary

Karrio is a TypeScript-first job application tracking platform built using Next.js, NestJS, Prisma, and PostgreSQL. The system combines a modern dashboard experience, automated reminders, activity tracking, Kanban workflows, and a Chrome Extension for LinkedIn job capture. Its modular monorepo architecture provides a scalable foundation for future SaaS growth while maintaining a clean and maintainable developer experience.
