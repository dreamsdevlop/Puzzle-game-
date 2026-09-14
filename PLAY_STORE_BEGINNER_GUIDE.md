# Word Quest: Brain Search — Beginner Google Play Guide

## 1. Create the Play Console app

Open [Google Play Console](https://play.google.com/console) and choose **Create app**.

Use these values:

| Field | Value |
|---|---|
| App name | Word Quest: Brain Search |
| Default language | English (United States), or your primary audience language |
| App or game | Game |
| Free or paid | Free |
| Contains ads | Yes |
| Package name | `com.wordsearch.puzzle` |
| Category | Games → Puzzle |
| Tags | Word, Puzzle, Brain training, Casual |

The package name is fixed inside the Android project. Do not create the Play app with a different package name.

## 2. Store listing text

**Short description**

> Find hidden words, sharpen your focus, and complete daily brain challenges.

**Full description**

> Word Quest: Brain Search is a relaxing word-search puzzle game designed to challenge your focus, observation, and pattern-recognition skills.
>
> Find hidden words across progressive levels, improve your speed, earn stars and coins, complete daily challenges, build your streak, and unlock visual themes. Start with accessible puzzles and progress toward more demanding boards with longer words and more search directions.
>
> Features:
>
> - Progressive word-search levels from easy to challenging.
> - Daily brain challenges and streak progress.
> - Stars, coins, themes, and wallpapers to unlock.
> - Optional rewarded ads for extra in-game rewards.
> - Light and dark themes.
> - Relaxed play with no forced puzzle interruption.
>
> Word Quest: Brain Search is free to play and contains advertising. An internet connection may be required for advertisements and consent choices.

## 3. Required store assets

Prepare these assets before starting the release:

- App icon: 512 × 512 PNG, using the existing Word Quest game logo.
- Feature graphic: 1024 × 500 PNG or JPG.
- At least two phone screenshots showing the home screen, a puzzle, and the results screen.
- Optional tablet screenshots if tablet support is enabled.
- Avoid misleading claims such as guaranteed brain improvement or guaranteed rewards.

## 4. App content and policy forms

Complete the following Play Console sections accurately:

1. **App access:** explain that the game is playable without an account; provide any access instructions if Play asks.
2. **Ads:** select that the app contains ads.
3. **Content rating:** complete the questionnaire honestly. The final rating is determined by Google’s questionnaire.
4. **Target audience:** select the intended age group honestly. Do not target children unless the entire ad and data setup follows Google Families policies.
5. **Data safety:** declare data collected or shared by the advertising SDK and the app’s local storage according to the current AdMob and Google Play forms.
6. **Privacy policy:** provide a public HTTPS privacy-policy URL that explains advertising, consent, device identifiers, diagnostics, and local game progress.
7. **Government or financial declarations:** complete only if Play Console presents them for this app.

## 5. Upload the signed AAB

Use the file named `app-release.aab` from the release build. Start with **Testing → Internal testing**, not Production.

The bundle is signed with a new upload keystore created for this first publication. Keep both the keystore file and the password in two separate secure backups. Never commit either one to GitHub and never send them in a public chat.

If Google Play App Signing is offered, accept it. Google will protect the app-signing key while the project’s upload key is used for future uploads.

## 6. First testing release

After uploading the AAB:

1. Add your own Gmail address as an internal tester.
2. Create the internal testing release.
3. Open the tester opt-in link on a physical Android device.
4. Install the Play-distributed build, not only a locally installed APK.
5. Test the home screen, puzzle completion, rewarded action, settings, shop, dark mode, and app resume.
6. Check that the native banner does not cover the puzzle grid.
7. Check Android logs for `[AdMob] Banner loaded` or `[AdMob] Banner failed to load`.
8. Use AdMob test devices or test ads during technical testing. Never repeatedly click production ads.

## 7. AdMob readiness

In AdMob, link the app to the exact public Play listing with package ID `com.wordsearch.puzzle`. Confirm that the app is `Ready`, the banner and rewarded units are active, consent messaging is configured, and the Policy Center has no unresolved issue.

Host the following line at the root of the developer website listed in the Play listing:

```text
google.com, pub-8857493053340063, DIRECT, f08c47fec0942fa0
```

The public URL must be:

```text
https://YOUR-DEVELOPER-DOMAIN/app-ads.txt
```

The file inside the APK is not a replacement for the public website file. Allow time for AdMob to crawl and verify it.

## 8. Release to production

Move from Internal testing to Closed testing if Google Play requests additional testing, then create the Production release after all policy forms, listing assets, privacy policy, and testing checks are complete.

For every later update, increment the Android `versionCode` and keep the same package name and upload keystore.

## 9. Final pre-launch checklist

- [ ] App name is Word Quest: Brain Search.
- [ ] Package is `com.wordsearch.puzzle`.
- [ ] Signed AAB uploaded successfully.
- [ ] Google Play App Signing configured.
- [ ] Internal tester installed the Play version.
- [ ] Ads declaration completed.
- [ ] Data safety completed.
- [ ] Content rating completed.
- [ ] Target audience completed.
- [ ] Privacy policy URL works over HTTPS.
- [ ] Developer website is public.
- [ ] `/app-ads.txt` returns HTTP 200 with the correct publisher line.
- [ ] AdMob app is linked to the Play listing.
- [ ] No unresolved Policy Center issue exists.
- [ ] Store screenshots and feature graphic are uploaded.
- [ ] Keystore and passwords are securely backed up.
