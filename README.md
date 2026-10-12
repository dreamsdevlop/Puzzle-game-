# Word Quest: Brain Search

A branded word-search puzzle game built with React, Vite, TypeScript, and Capacitor for Android.

## Production identity

- **App name:** Word Quest: Brain Search
- **Android package:** `com.wordquest.puzzle`
- **Current Android version code:** `7`
- **AdMob app ID:** configured in the Android resources and AdMob utility
- **Repository:** https://github.com/dreamsdevlop/Puzzle-game-

## Repository structure

```text
src/
  components/       Reusable game screens, ads, onboarding, shop, and settings UI
  data/             Curated levels, categories, daily challenges, and themes
  utils/            Storage, audio, AdMob, CrazyGames, and game helpers
  App.tsx           Application state and screen navigation
android/
  app/              Capacitor Android wrapper, native activities, resources, and signing config
public/             Web/PWA assets and app-ads.txt
scripts/            Icon, splash, and Play Store asset generators
*.md               Release, privacy, monetization, and Play Store documentation
```

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

`npm run lint` runs the TypeScript compiler with `--noEmit`.

## Android release

The release build requires the Android SDK, JDK 21, and a private local `android/keystore.properties` file. The keystore and properties file are intentionally ignored by Git.

```bash
npm run android:bundle
```

The generated unsigned-name output is normally:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

For Play Console, upload the latest signed AAB and confirm that its package is `com.wordquest.puzzle` and its version code is higher than the previously published release.

## Advertising boundaries

- Android uses native AdMob through Capacitor.
- The Android app displays one bottom banner during normal play and hides it while Settings or Shop overlays are open.
- Rewarded ads are opt-in and grant rewards only after the SDK reward callback.
- Browser-only ad slots are not rendered inside the Android WebView.
- CrazyGames hosting uses its own SDK path and does not render the separate browser ad network.

## Security and publishing

Never commit or share:

- `android/word-quest-upload.jks`
- `android/keystore.properties`
- `android/local.properties`
- API keys, passwords, or private credentials

The Play Store privacy-policy URL, developer website, and contact details must be replaced with the developer’s real public information before submission. The repository contains the policy content and the required `public/app-ads.txt` line, but hosting those files publicly is an external deployment step.

## Documentation

- [Android release guide](ANDROID_RELEASE.md)
- [Beginner Play Store guide](PLAY_STORE_BEGINNER_GUIDE.md)
- [Privacy policy](PRIVACY_POLICY.md)
- [Play Store listing assets](PLAY_STORE_LISTING_ASSETS.md)
- [AdMob and engagement guide](AD_REVENUE_AND_ENGAGEMENT.md)
- [Retention and growth guide](WORD_QUEST_A_TO_Z_RETENTION_GUIDE_HI.md)
