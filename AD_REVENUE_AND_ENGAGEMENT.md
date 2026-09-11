# AdMob diagnosis and puzzle-game growth plan

## Executive conclusion

The native implementation is configured correctly for the supplied production AdMob app and units. The current Android app uses the supplied primary banner unit, the supplied banner fallback unit, and the supplied rewarded unit. It requests consent before initializing the Mobile Ads SDK, hides the banner during active puzzle play, and does not expose ad IDs or a public test toggle in the game interface.

If real ads still do not appear in the signed APK, the most likely cause is AdMob account or app readiness rather than the APK. Google states that a new app must be published, listed in a supported store, correctly linked to that store in AdMob, and approved through app readiness before it can fully serve ads. During review, ad serving may be limited for two to three days or longer. The AdMob account must also be verified, including payment details where required.[1]

A debug-signed APK installed directly on a device is useful for technical validation, but it is not equivalent to a publicly listed Play Store release for AdMob readiness. Do not repeatedly click live ads during testing. Use Google test ads or a registered test device while debugging to avoid invalid traffic, then validate production fill through an internal or closed Play testing track after the app is linked in AdMob.

## Why ads may not show

| Possible cause | How to verify | Correct action |
|---|---|---|
| App is not publicly available in a supported store | AdMob **All apps** page shows the app as getting ready, unlinked, or not ready | Publish the package `com.wordsearch.puzzle` to a supported Play testing or production track as appropriate, then link the exact store listing in AdMob |
| AdMob app readiness review is incomplete | Check the app readiness and ad-serving status in AdMob | Resolve policy or verification notices and wait for review; Google reports that review commonly takes two to three days but may take longer |
| AdMob account is not verified | Check account verification and payment details | Complete the requested account verification steps |
| Package ID does not match the linked store app | Compare the Play package name with `com.wordsearch.puzzle` | Keep the same application ID in Capacitor, Gradle, AdMob, and Play Console |
| Consent prevents ad requests | Check whether the consent form completed and whether `canRequestAds` became true | Configure Google UMP Privacy & Messaging for the app and test from a clean install in a consent-required region |
| Unit is new, inactive, or has no fill | Check the ad unit status and request/error metrics in AdMob | Confirm the unit is active and allow time for fill; use a test unit only for development diagnostics |
| Network or device restrictions | Test on a real network without VPN, private DNS, or ad blocking | Retry on a normal connection and inspect Android logcat for Mobile Ads errors |
| APK was built from stale assets | Search the generated web assets for the intended unit IDs | Re-run `npm run build`, `npx cap sync android`, then rebuild the APK/AAB |
| Banner is positioned under an overlay or system inset | Inspect the device screen and logcat | Verify the banner is visible on the home/results screens; the current code hides it during the game screen by design |

## Current implementation status

The latest code uses `ca-app-pub-8857493053340063/5636350884` as the primary banner and `ca-app-pub-8857493053340063/5307560708` as a fallback. It uses `ca-app-pub-8857493053340063/3042053114` for rewarded ads. Interstitial ads are intentionally disabled until a dedicated interstitial unit is supplied; the rewarded unit should not be reused as an interstitial unit.

The app’s Android application ID is `ca-app-pub-8857493053340063~9438377409`, and the package ID is `com.wordsearch.puzzle`. The game logo is now used for Android launcher assets. The settings screen no longer exposes the AdMob IDs, test-mode switch, or simulated ad preview.

## Highest-impact engagement improvements

### 1. Build a daily return loop

Make the existing Daily Challenge the primary retention feature. Add a visible seven-day streak track, a weekly completion chest, and a streak-repair option that can be earned through play or granted after a rewarded ad. Keep the challenge deterministic and short so it feels achievable in under three minutes.

### 2. Add missions with clear progress

Introduce three daily missions such as completing one puzzle, finding a bonus word, and finishing under a target time. Display progress on the home screen and grant coins or cosmetic fragments. Missions produce repeatable goals without changing the core word-search rules.

### 3. Improve the first-session funnel

Guide a new player through one fast tutorial puzzle, grant an immediate cosmetic reward, and show the next unlock target. Avoid presenting monetization before the player completes the first puzzle. Measure tutorial completion, first puzzle completion, second-session return, and rewarded-ad opt-in separately.

### 4. Add social proof without requiring a social network

Create a shareable results card containing time, stars, streak, and a non-spoiler challenge seed. Add a “challenge a friend” link that opens the same daily puzzle. This supports organic distribution while preserving privacy.

### 5. Add lightweight difficulty personalization

Use completion time, mistakes, hint use, and abandonment to select the next recommended level. Preserve user choice, but make the home screen’s primary button lead to a level with a high probability of completion.

### 6. Make cosmetics a long-term goal

Expand the existing theme shop into sets with collection bonuses. Reward normal play generously enough that the shop feels attainable. Use rewarded ads only for optional bonus coins or a limited-time double-reward choice, never as the only path to progress.

## Rewarded-ad placements that are likely to be accepted by players

| Placement | Reward | Frequency guard |
|---|---|---|
| Before starting a daily challenge | One extra hint or a temporary time buffer | One offer per challenge |
| After a failed or abandoned puzzle | One revive with a partial score reset | One revive per puzzle |
| After a completed puzzle | Double the earned coins | One offer per completed puzzle, with an opt-out |
| Daily streak screen | Streak protection | One protection offer per week |
| Theme shop | Small optional coin bundle | Daily cap and clear value |

Rewarded ads should be explicitly opt-in, should state the reward before display, and should grant the reward only after the SDK confirms the reward callback. The user should never need to click the advertisement itself to receive the game reward.

## Revenue improvements beyond adding more ads

**Use mediation after baseline stability.** Once direct AdMob delivery is confirmed, add mediation partners only if the account has enough traffic to justify the operational complexity. Compare estimated earnings, matched requests, show rate, and effective cost per thousand impressions rather than impressions alone.

**Use remote configuration for frequency caps.** Move ad frequency limits and reward amounts into a controlled configuration so they can be tuned without changing puzzle logic. Keep conservative defaults and increase exposure only when retention is stable.

**Track the full funnel.** Record puzzle start, puzzle completion, reward offer shown, reward accepted, reward earned, ad load failure, ad show failure, and next-day return. Revenue optimization is not successful if it increases ad impressions while reducing completion or retention.

**Keep banners out of active solving.** The current choice to hide banners during puzzle interaction is good for usability. A small number of well-timed rewarded ads usually has better long-term value than covering the board with a persistent banner.

## Recommended release sequence

1. In AdMob, confirm the app ID is linked to the exact Play listing for `com.wordsearch.puzzle`.
2. Confirm both banner units and the rewarded unit are active and belong to the same AdMob app.
3. Complete the app readiness, account verification, privacy, and data-safety steps.
4. Upload the AAB to an internal or closed Play testing track.
5. Test with a registered test device and inspect Android logcat for the exact Mobile Ads error code.
6. Wait for the app readiness status to become approved and check the AdMob ad-serving status.
7. Use production units only after technical test-ad validation is complete.
8. Launch with banner plus opt-in rewarded ads, then add missions, streak protection, and double-reward offers in measured experiments.

## References

[1]: https://support.google.com/admob/answer/10564477?hl=en-GB "About app readiness — Google AdMob Help"
[2]: https://developers.google.com/admob/android/test-ads "Enable test ads — Google AdMob Android Developers"
[3]: https://developers.google.com/admob/android/app-ads "App ads — Google AdMob Android Developers"
