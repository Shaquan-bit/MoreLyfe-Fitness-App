# MoreLyfe Fitness App

A React Native fitness tracking app built with Expo SDK 54.

---

## Tech Stack

| Technology | Version |
|---|---|
| Expo SDK | 54.0.0 |
| React Native | 0.79.2 |
| React | 18.3.2 |
| React Navigation | v7 |
| AsyncStorage | 2.1.2 |

---

## Features

- **Exercise Library** — Browse and search exercises by muscle group
- **Meal Plans** — Create and manage nutrition plans
- **Log Workout** — Record sets, reps, and weights
- **Progress Tracking** — View workout history and trends
- **User Auth** — Register and login with local storage

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (or Android/iOS simulator)

### Install & Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go to run on your device.

---

## SDK 54 Upgrade Notes

This project was upgraded from Expo SDK 49 to SDK 54. Key changes:

- **New Architecture enabled** (`newArchEnabled: true` in app.json) — React Native's new renderer (Fabric) and JavaScript engine (Hermes) are the default.
- **React Navigation v7** — Updated from v6. API is largely backward compatible; `@react-navigation/native`, `@react-navigation/native-stack`, and `@react-navigation/bottom-tabs` all updated to `^7.x`.
- **AsyncStorage v2** — Updated from `1.18.2` to `2.1.2`. API surface is the same; only internal implementation changed.
- **react-native-safe-area-context 5.x** — Updated from `4.6.3`. Compatible with New Architecture.
- **react-native-screens 4.x** — Updated from `3.22.0`. Required for React Navigation v7 on RN 0.79.
- **@expo/vector-icons v14** — Updated from v13. Same icon API.
- **expo-status-bar 2.x** — Updated from `1.6.0`.

---

## Project Structure

```
MoreLyfeFitness/
├── App.js                    # Root component & navigation setup
├── app.json                  # Expo config (SDK version, icons, etc.)
├── package.json              # Dependencies
├── babel.config.js           # Babel config
├── components/
│   └── SharedComponents.js   # Reusable UI components
├── navigation/
│   └── TabNavigator.js       # Bottom tab bar setup
├── screens/
│   ├── WelcomeScreen.js
│   ├── RegisterScreen.js
│   ├── LoginScreen.js
│   ├── ExercisesScreen.js
│   ├── MealPlansScreen.js
│   ├── LogWorkoutScreen.js
│   └── ProgressScreen.js
├── storage/
│   ├── Storage.js            # AsyncStorage helpers
│   └── Theme.js              # Colors & design tokens
└── backend/                  # PHP backend (optional server-side)
    ├── db.php
    ├── login.php
    ├── register.php
    ├── exercises.php
    └── meals.php
```

---

## Backend (Optional)

The `backend/` folder contains PHP scripts for a server-based auth flow. The app works fully offline using AsyncStorage by default.

