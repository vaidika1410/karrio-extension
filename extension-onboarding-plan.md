# Karrio Extension Onboarding Plan

## Decision

Karrio is an **extension-first product**.

The extension should be heavily promoted but **not mandatory** to use the platform.

---

## Target Audience

Current audience:

* Recruiters
* Hiring Managers
* Interviewers
* Portfolio Visitors

Not focused on public user acquisition yet.

---

## Distribution Strategy

Chosen approach:

### Option 2 - Hosted Extension ZIP

Flow:

Build Extension
↓
Create ZIP from `chrome-mv3-prod`
↓
Host ZIP publicly
↓
User downloads ZIP
↓
Extracts ZIP
↓
Load Unpacked
↓
Extension Installed

Reason:

* Cleaner than downloading the entire repository
* No Chrome Web Store required yet
* Easy to migrate later

---

## Planned UX

### Landing Page

CTA:

* Get Chrome Extension (Beta)
* Get Started

---

### Extension Page (`/extension`)

Contains:

* Extension overview
* Installation steps
* Download ZIP button
* Screenshots/GIF

Installation steps:

1. Download ZIP
2. Open `chrome://extensions`
3. Enable Developer Mode
4. Click Load Unpacked
5. Select extracted folder

---

### Dashboard

If extension is not connected:

Show onboarding banner:

"Install the Karrio Extension to save LinkedIn jobs in one click."

CTA:

* Installation Guide

---

## Future Improvements

1. Extension detection
2. Better onboarding
3. Chrome Web Store publication

---

## Current Priority Order

1. Create `/extension` page
2. Create extension ZIP distribution workflow
3. Add dashboard install banner
4. Add screenshots/GIF demo
5. Add extension detection
