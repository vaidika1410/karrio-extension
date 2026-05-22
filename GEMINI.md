# Karrio Project Context

## Overview
Karrio is a tool designed to streamline the job application tracking process by allowing users to extract job data directly from job boards via a browser extension and manage these applications through a centralized web dashboard.

## Goals
- **Efficient Data Extraction:** Automate the collection of job details (role, company, URL) from major job platforms.
- **Centralized Tracking:** Provide a structured dashboard for users to manage, organize, and track their application status (e.g., Kanban view).
- **Seamless Workflow:** Reduce manual data entry and context switching during the job search process.

## Architecture
- **Web Application (`/apps/web`):** Next.js application providing the user-facing dashboard and management interface.
- **API (`/apps/api`):** NestJS backend service managing application data, authentication, and database interactions (PostgreSQL/Prisma).
- **Extension (`/apps/extension`):** Browser extension for scraping job data and communicating with the API.

## Known Issues

### Extension Role Title Extraction
- **Issue:** The Chrome extension incorrectly extracts duplicated text for job roles on LinkedIn job pages (e.g., "Role
Role").
- **Status:** Mitigation implemented in `apps/extension/content.js` by cleaning the DOM (removing `.sr-only` and `aria-hidden="true"` elements before extraction). If the issue persists, further investigation into the specific DOM structure of the LinkedIn page is required.

## Development Conventions
- Follow existing patterns in `apps/extension` for content scripts and background communication.
- Use `safeText` in `apps/extension/content.js` for all DOM text extraction to handle hidden elements robustly.
