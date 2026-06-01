# API Documentation

## Overview

The Karrio API is built using NestJS and follows a REST-based architecture. All protected endpoints require JWT authentication.

## Base URL

### Production

```text
https://karrio-api-o2xy.onrender.com
```

### Local Development

```text
http://localhost:3001
```

---

# Authentication

Protected routes require:

```http
Authorization: Bearer <jwt-token>
```

JWT tokens are issued during login and signup and expire after 7 days.

---

# Authentication Endpoints

## Signup

```http
POST /auth/signup
```

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "accessToken": "<jwt-token>",
  "user": {}
}
```

---

## Login

```http
POST /auth/login
```

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

# User Endpoints

## Get Current User

```http
GET /users/me
```

## Update Profile

```http
PATCH /users/me
```

---

# Application Endpoints

## Create Application

```http
POST /applications
```

## Get Applications

```http
GET /applications
```

## Get Application By ID

```http
GET /applications/:id
```

## Update Application

```http
PATCH /applications/:id
```

## Delete Application

```http
DELETE /applications/:id
```

## Upcoming Interviews

```http
GET /applications/upcoming-interviews
```

---

# Reminder Endpoints

## Create Follow-Up Reminder

```http
POST /reminders/follow-up
```

## Get User Reminders

```http
GET /reminders
```

## Get Application Reminders

```http
GET /reminders/application/:id
```

---

# Error Responses

## Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Validation Error

```json
{
  "statusCode": 400,
  "message": ["field is required"]
}
```
