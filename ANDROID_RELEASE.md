# Android release and AdMob setup

The repository is a Capacitor Android app for the puzzle game. Native ads use `@capacitor-community/admob`; the browser build remains playable without native ad calls.

## Ad behavior

The app requests AdMob consent before initializing the SDK. A native adaptive banner appears on non-game screens and is hidden during active puzzle play so it cannot cover the board. Interstitials run only after puzzle completion when the existing frequency cap allows them. Rewarded ads are requested only when the player explicitly asks for a reward. If consent, network access, or an ad load is unavailable, the game continues normally.

Development builds use Google’s official test units when `VITE_ADMOB_TEST_MODE=true` or when using Vite development mode. The configured production Android app ID is in `android/app/src/main/res/values/strings.xml` and `capacitor.config.json`.

Before release, configure the production rewarded unit in the build environment:

```bash
export VITE_ADMOB_TEST_MODE=false
export VITE_ADMOB_REWARDED_ID="ca-app-pub-XXXXXXXXXXXXXXX/XXXXXXXXXX"
```

The existing production banner and interstitial units are in `src/utils/admob.ts`. Replace them there only if the AdMob account uses different units. Never use production units while testing on personal devices; use test mode or registered test devices.

## Prerequisites

Install Node.js, the Android SDK, Android SDK Platform 36, Android Build Tools, and a JDK compatible with the generated Gradle wrapper. Set `ANDROID_HOME` or create `android/local.properties` with a valid `sdk.dir`.

Validate the web and TypeScript portions with:

```bash
npm install
npm run lint
npm run build
```

Synchronize the web app and native plugins with:

```bash
npm run android:sync
```

## Release signing

For a Play-uploadable bundle, create or use the project’s upload keystore and create `android/keystore.properties` locally. This file is ignored by Git and must never be committed:

```properties
storeFile=/absolute/path/to/upload-keystore.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

The Android Gradle file applies this signing configuration only when the file exists. Back up the keystore and passwords securely. If it is absent, Gradle can produce a validation bundle but not a publishable signed release bundle.

## Build the AAB

With Android SDK and signing configured:

```bash
npm run android:bundle
```

The expected output is:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Verify the package ID remains `com.wordsearch.puzzle`, inspect the version code/name, and calculate a checksum before uploading:

```bash
sha256sum android/app/build/outputs/bundle/release/app-release.aab
```

## Play Console checklist

Create or select the Play Console app with package ID `com.wordsearch.puzzle`, upload the AAB to an internal testing track first, complete the Data safety form, declare the app’s ads, and configure the AdMob app ID and ad units. Configure the AdMob Privacy & messaging consent form for regions where Google requires consent. Keep test ads enabled until the internal test build has been verified.
