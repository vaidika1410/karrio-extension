I need you to implement an Extension Installation / Onboarding flow for my project called Karrio.

IMPORTANT CONSTRAINTS:

- Do NOT change existing architecture.
- Do NOT refactor existing landing page unless absolutely necessary.
- Do NOT redesign the application.
- Reuse existing styling and design language.
- Use existing shadcn components already present in the project.
- Keep implementation minimal and production-ready.

PROJECT CONTEXT

Karrio is a full-stack job application tracker.

Tech stack:
- Next.js App Router
- NestJS backend
- PostgreSQL (Neon)
- Chrome Extension

Deployment:
- Frontend: https://karrio-extension-web.vercel.app
- Backend: https://karrio-api-o2xy.onrender.com

The Chrome Extension already works.

The extension:
- Extracts LinkedIn job information
- Saves jobs to Karrio
- Uses authentication from the Karrio web app
- Communicates with the production backend

Current audience:
- Recruiters
- Hiring managers
- Interviewers
- Portfolio visitors

This is NOT a public product launch.

The goal is simply to make it easy for visitors to discover and install the extension.

DECISIONS ALREADY MADE

We are NOT publishing to the Chrome Web Store yet.

We are using:

Hosted ZIP Download
↓
Extract ZIP
↓
chrome://extensions
↓
Enable Developer Mode
↓
Load Unpacked
↓
Select Extension Folder

The extension ZIP will be hosted through GitHub Releases.

DO NOT suggest Chrome Store integration.

DO NOT suggest changing the distribution model.

LANDING PAGE

Current landing page component:

src/components/landing/landing-page.tsx

The landing page already has:
- custom background
- animations
- particles
- gradients
- feature cards
- CTA section

The new extension experience MUST visually match the existing landing page.

DO NOT create a plain documentation page.

FEATURE TO IMPLEMENT

Create:

src/app/extension/page.tsx

Requirements:

1. Public page
   - No authentication required

2. Reuse the same visual style as landing page:
   - Same header style
   - Same background treatment
   - Same typography
   - Same spacing
   - Same card styles
   - Same CTA style

3. Hero Section

Headline:

"Karrio Chrome Extension"

Subheadline:

"Save LinkedIn jobs directly into Karrio with one click."

Primary CTA:
Download Extension

Secondary CTA:
View Installation Guide

The Download button should use a placeholder constant:

const EXTENSION_DOWNLOAD_URL = "REPLACE_WITH_GITHUB_RELEASE_URL";

4. How It Works Section

Three cards:

- Find a LinkedIn Job
- Save with Karrio
- Track in Dashboard

5. Installation Section

Show the following steps:

1. Download the extension ZIP
2. Extract the ZIP
3. Open chrome://extensions
4. Enable Developer Mode
5. Click Load Unpacked
6. Select the extracted Karrio extension folder

6. FAQ Section

Question:
"Why isn't it on the Chrome Web Store?"

Answer:
"Karrio Extension is currently in beta and available through manual installation."

7. Landing Page Update

Add a new CTA button on the existing landing page:

Text:
"Get Extension"

Route:
/extension

Place it alongside existing CTA buttons.

DELIVERABLES

Provide:

1. Complete src/app/extension/page.tsx
2. Exact modifications required in landing-page.tsx
3. Any reusable component extraction only if genuinely necessary
4. Final code only, no high-level planning
5. Follow existing code style and patterns already used in the project
