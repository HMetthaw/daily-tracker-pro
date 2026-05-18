# Daily Tracker Pro

Simple iPhone-first daily activity tracker built with Expo React Native.

Daily Tracker Pro is being developed as a real product: a local-first daily tracker with recurring tasks, future one-time tasks, weekly recaps, and lightweight project planning. The current public demo runs as a PWA; the long-term target is a native iOS App Store release.

## What it does

- Czech UI by default, English available in Settings.
- Sunday-to-Saturday weekly blocks.
- Recurring tasks with selected weekdays and optional reminder time.
- One-time tasks for the current day.
- Local notifications for scheduled tasks and a Sunday 9:00 weekly recap.
- Local-only storage using Expo SQLite. No account, cloud sync, or analytics.
- Daily streak continues when at least 80% of scheduled tasks are completed.

## Run on iPhone with Expo Go

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Expo:

   ```bash
   npm start
   ```

3. Install **Expo Go** from the App Store.
4. Scan the QR code shown in the terminal with the iPhone camera or Expo Go.
5. Allow notifications when the app asks.

## Test

```bash
npm test
```

The tests cover week boundaries, recurring task generation, 80% streak logic, weekly recap, i18n key parity, and notification scheduling intent.

## App Store path later

The project includes `eas.json`, iOS bundle identifier placeholder, and app metadata that can be used with EAS Build. For TestFlight/App Store release you will still need an Apple Developer account and production assets such as app icon, screenshots, privacy answers, and final bundle identifier ownership.

Privacy note for release: all task data and settings are stored locally on-device in this version.

## Product project docs

- [Product brief](docs/PRODUCT.md)
- [Roadmap](docs/ROADMAP.md)
- [App Store plan](docs/APP_STORE_PLAN.md)
- [Monetization strategy](docs/MONETIZATION.md)
- [Product decisions](docs/DECISIONS.md)

## PWA demo version

The `pwa/` folder contains a standalone installable web version for quick demos without Expo Go.

Run it locally:

```bash
npm run pwa
```

Then open `http://localhost:4173`. For an iPhone on the same Wi-Fi, use the computer's local network IP instead of `localhost`.

Deploy it with GitHub Pages:

1. Push this repository to GitHub.
2. Go to the repo Settings -> Pages.
3. Set Source to GitHub Actions.
4. Push to the `main` branch.
5. Open the Pages URL on iPhone and use Share -> Add to Home Screen.

PWA notification note: this version can ask for browser notification permission and checks reminders while the web app is active. iOS web notifications are less reliable for exact alarm-style reminders than a native iOS/TestFlight build.
