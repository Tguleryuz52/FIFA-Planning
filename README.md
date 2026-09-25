<div align="center">

# FIFA Planning — Level Up Your Real Life

**Self-improvement, gamified: you are the player card.**
Turn habits into quests and watch your skill stats grow, FIFA Ultimate Team style.

<img src="https://img.shields.io/badge/React_Native_0.81-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
<img src="https://img.shields.io/badge/Expo_54-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
<img src="https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind" />

</div>

## ✨ Features

- **Player card profile**: a glowing FIFA-style card with circular stat rings and progress bars for every skill.
- **Quests**: add, inspect and complete daily quests; swipe gestures to act fast, with haptic tab feedback.
- **Weekly calendar + quest stats**: see what you shipped this week at a glance.
- **Skills tab**: every skill with its own level and progress.
- **Cloud sync**: local-first with AsyncStorage, synced to Cloud Firestore.
- **Polish**: Reanimated + Gesture Handler interactions, Lottie animations, linear-gradient glow cards.

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| App | Expo 54 · React Native 0.81 · Expo Router (file-based tabs) · TypeScript |
| UI | NativeWind · React Native Paper · Reanimated · Gesture Handler · Lottie |
| Data | Firebase / Cloud Firestore sync · AsyncStorage |
| Device | Expo Haptics · Expo Image · Linear Gradient |

## 📁 Structure

```
app/(tabs)/        index · quests · skills · profile · explore
components/fifa/   PlayerHeader, GlowCard, StatCard, CircularStat, ProgressBar
components/quests/ AddQuestModal, QuestDetailModal, SwipeableQuestItem, WeeklyCalendar, QuestStatsSection
lib/               firebase.ts, firestore-sync.ts
```

## 🚀 Getting Started

```bash
npm install
npx expo start      # then press i (iOS), a (Android) or w (web)
```

Point `lib/firebase.ts` at your own Firebase project to enable sync.

---

<div align="center"><sub>Built by <a href="https://github.com/Tguleryuz52">Talha Güleryüz</a> · fan project, not affiliated with EA SPORTS FC</sub></div>
