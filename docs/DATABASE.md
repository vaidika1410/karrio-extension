# Database Documentation

## Database Technology

* PostgreSQL
* Prisma ORM

---

# Entity Relationship Diagram

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

# User

| Field     | Type     |
| --------- | -------- |
| id        | String   |
| name      | String   |
| email     | String   |
| password  | String   |
| createdAt | DateTime |

Relationships:

* One-to-Many Applications
* One-to-Many Reminders

---

# Application

| Field         | Type     |
| ------------- | -------- |
| id            | String   |
| company       | String   |
| role          | String   |
| status        | Enum     |
| notes         | Text     |
| interviewDate | DateTime |
| interviewType | String   |
| jobUrl        | String   |
| description   | Text     |
| platform      | String   |
| userId        | String   |

---

# ApplicationActivity

| Field         | Type     |
| ------------- | -------- |
| id            | String   |
| applicationId | String   |
| type          | String   |
| message       | String   |
| createdAt     | DateTime |

---

# Reminder

| Field         | Type     |
| ------------- | -------- |
| id            | String   |
| title         | String   |
| message       | String   |
| remindAt      | DateTime |
| sent          | Boolean  |
| type          | Enum     |
| applicationId | String   |
| userId        | String   |

---

# Enums

## ApplicationStatus

* SAVED
* APPLIED
* UNDER_REVIEW
* ONLINE_ASSESSMENT
* INTERVIEW
* HR_ROUND
* REJECTED
* OFFER
* ACCEPTED

## ReminderType

* INTERVIEW
* FOLLOW_UP
* DEADLINE
* NETWORKING

---

# Data Ownership

All application and reminder records belong to a specific authenticated user and must be queried using the current user's identifier.
