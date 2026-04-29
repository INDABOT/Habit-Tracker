# Habit Tracker PWA - Stage 3

## Project Overview
This is a mobile-first Progressive Web Application (PWA) built for the Frontend Wizards Stage 3 task. It is a strictly deterministic habit tracker that allows users to create an account, log in, manage daily habits, track streaks, and use the application offline. 

## Setup & Run Instructions
1. Clone the repository: `git clone [YOUR_REPO_URL]`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open `http://localhost:3000` in your browser.

## Test Instructions
The application is fully covered by automated tests per the Technical Requirements Document.
* **Unit Tests:** `npm run test:unit` (Generates coverage report)
* **Integration Tests:** `npm run test:integration`
* **End-to-End Tests:** `npm run test:e2e` (Requires Playwright browsers: `npx playwright install`)
* **Run All:** `npm run test`

## Local Persistence Structure
The application relies entirely on `localStorage` to simulate a deterministic database environment.
* `habit-tracker-users`: Stores an array of registered user objects (id, email, password, createdAt).
* `habit-tracker-session`: Stores the active user session (userId, email) or `null` if logged out.
* `habit-tracker-habits`: Stores all habits across all users. The UI filters this list to ensure users only see habits matching their specific `userId`.

## PWA Implementation
The app functions as a basic installable PWA capable of offline rendering.
* **Manifest:** A `manifest.json` file is served from the `public` directory defining the app shell, standalone display mode, and necessary 192px/512px icons.
* **Service Worker:** A vanilla Javascript service worker (`sw.js`) caches the core routes (`/`, `/login`, `/signup`, `/dashboard`) on install. It intercepts fetch requests to serve the cached app shell when offline, preventing hard browser crashes.

## Trade-offs & Limitations
* **Local Auth:** Passwords are saved in plain text in `localStorage` strictly to satisfy the deterministic local-testing requirements of this stage. 
* **JSDOM Crypto:** The integration test environment requires a global stub for `crypto.randomUUID()` as the virtual JSDOM environment does not natively support it like modern browsers do.

## Test Mapping
Here is how the automated test suite verifies the required behaviors:

**Unit Tests (`tests/unit/`)**
* `slug.test.ts`: Verifies string normalization and formatting for habit test IDs.
* `validators.test.ts`: Ensures habit names meet the 60-character limit and are not empty.
* `streaks.test.ts`: Validates the mathematical logic for calculating consecutive calendar days backwards from today.
* `habits.test.ts`: Verifies the immutable toggling of completion dates within a habit object.

**Integration Tests (`tests/integration/`)**
* `auth-flow.test.tsx`: Simulates user input to verify signups, logins, duplicate email rejections, and `localStorage` session creation.
* `habit-form.test.tsx`: Validates DOM interactions for creating, editing (preserving immutable fields), deleting (with explicit confirmation), and instantly updating UI streaks.

**End-to-End Tests (`tests/e2e/app.spec.ts`)**
* Uses a headless Chromium browser to navigate the Next.js routes, verify splash screen timing, protect the `/dashboard` route, validate state persistence across page reloads, and confirm the offline service worker successfully serves the cached app shell without an internet connection.