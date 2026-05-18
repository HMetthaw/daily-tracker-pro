# Chat Context And Handoff

This file captures the working context from the original Codex chat so the project can continue from the clean local project folder.

## Project Location

- Clean local project: `C:\Users\Matěj Holeš\Documents\Codex\daily-tracker-pro`
- GitHub repo: https://github.com/HMetthaw/daily-tracker-pro
- PWA demo: https://hmetthaw.github.io/daily-tracker-pro/

## Product Direction

Daily Tracker Pro started as a personal iPhone daily activity tracker and is now being shaped into a real product.

The current strategy:

- Use the PWA for feedback and demos now.
- Later pay for Apple Developer Program and ship a native iOS app through TestFlight/App Store.
- Keep the core daily tracker simple and likely free.
- Explore monetization around professional planning features such as templates, exports, reports, and project limits.

## Current Implemented Features

PWA:

- Installable PWA via GitHub Pages.
- Czech and English UI.
- Light/dark mode.
- Recurring tasks that repeat indefinitely.
- One-time tasks with future date selection.
- Week view from Sunday to Saturday.
- Quick add button per day in the Week view.
- Today view with checklist and progress.
- Weekly recap that only evaluates elapsed days; on Sunday it reviews the previous completed week.
- Recap chart with day-by-day completion bars.
- Project planning tab.
- Projects with name, address/place, start date, and end date.
- Project steps assigned to concrete days with planned time from-to.
- Project steps appear in Today and Week as actionable checklist items.

Native Expo app:

- Exists as a future iPhone/App Store foundation.
- Uses Expo/React Native structure.
- Local storage and notification service are scaffolded.

## Important Product Decisions

- Recurring tasks are permanent until deleted/deactivated.
- One-time tasks belong to a specific date.
- Projects can cross month boundaries.
- The calendar remains month-based for usability, but projects are date-range based.
- Project steps are concrete day-level items, not complex dependencies.
- PWA notifications are demo/best-effort; reliable reminders require the later native iOS build.
- Paid features should come after retention and workflow value are validated.

## Near-Term Ideas

Useful next improvements:

- Better project editing, not just creation.
- Warning when a project step is outside the project date range.
- Export/import local PWA data.
- Project archive/completed state.
- Better PWA cache/version update notice.
- Construction-oriented project templates.
- Cleaner Czech copy and more realistic onboarding examples.

## Feedback Principle

The user asked that future ideas receive honest constructive feedback:

- Say whether the idea is strong or risky.
- Explain why.
- Suggest a simpler first version when useful.
- Avoid adding complexity just because it is possible.

## Development Workflow

Use the clean project folder for future work:

```bash
cd "C:\Users\Matěj Holeš\Documents\Codex\daily-tracker-pro"
```

Common commands:

```bash
npm test
npm run pwa
git status
git add .
git commit -m "Message"
git push
```

GitHub Pages deploys automatically from the `main` branch through `.github/workflows/pages.yml`.

## Notes

The original chat folder remains available, but the clean project folder should be treated as the main working copy going forward.
