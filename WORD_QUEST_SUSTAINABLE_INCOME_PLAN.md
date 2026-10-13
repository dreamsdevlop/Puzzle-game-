# Word Quest: Brain Search — Sustainable Income and Growth Plan

## The honest objective

No mobile game has a guaranteed income. The practical goal is to build a measurable system that can become profitable: retain players, monetize without damaging the experience, acquire users at a controlled cost, and reinvest only when the numbers support it.

For Word Quest, the correct order is:

```text
Stability → Measurement → Retention → Monetization → Organic growth → Paid acquisition → Reinvestment
```

Do not begin with a large advertising budget. Paid installs cannot repair weak retention. They only make weak retention more expensive.

## Current product position

Word Quest already has a useful base:

- Progressive word-search levels.
- Daily Challenge and streak persistence.
- Weekly Quest rewards.
- Onboarding.
- Themes, wallpapers, coins, stars, and hints.
- Native AdMob banner and rewarded-ad paths on Android.
- Browser and CrazyGames ad paths separated from Android AdMob.
- A branded Play Store identity and production AAB.

The most important business gap is measurement. The current app does not yet provide a reliable product dashboard for retention, puzzle completion, ad performance, and acquisition quality. Add analytics before scaling promotion.

## Phase 1: Make the product measurable

Before spending on advertising, add an analytics system such as Firebase Analytics or another privacy-compliant event platform. Record only events needed to improve the game and complete the Play data-safety disclosures accurately.

Track these events:

- `app_open`
- `onboarding_started`
- `onboarding_completed`
- `first_puzzle_started`
- `first_puzzle_completed`
- `daily_challenge_started`
- `daily_challenge_completed`
- `streak_extended`
- `weekly_quest_completed`
- `puzzle_started`
- `puzzle_completed`
- `puzzle_abandoned`
- `hint_used`
- `theme_unlocked`
- `rewarded_offer_shown`
- `rewarded_ad_started`
- `rewarded_ad_earned`
- `banner_loaded`
- `banner_failed`
- `share_clicked`

Create a weekly dashboard with:

- Daily active users (DAU).
- New users.
- Day-1, Day-7, and Day-30 retention.
- First-puzzle completion rate.
- Puzzles completed per active user.
- Average session length.
- Rewarded-ad opt-in and completion rate.
- Banner fill and impression count.
- Revenue per daily active user.
- Acquisition cost per install and per retained user.

Do not make a monetization decision from impressions alone. A banner that produces more impressions but causes more uninstall activity is not a successful optimization.

## Phase 2: Retention gates before paid promotion

Use these as internal launch gates, not guarantees or universal industry standards:

- At least 70% of new users start the first puzzle.
- At least 60% of starters complete the first puzzle.
- Day-1 retention reaches approximately 25% or better.
- Day-7 retention reaches approximately 8–10% or better.
- The average returning user completes at least two puzzles per active week.
- Crash-free sessions remain above 99%.
- No serious ad-policy, consent, or banner-overlap issue exists.

If a gate fails, fix the product before buying more traffic. The first improvements should be faster entry into the first puzzle, a stronger Daily Challenge card, clearer progress, a useful first reward, and a shareable result card.

## Phase 3: Monetize without harming retention

### Banner ads

Keep one adaptive bottom banner. It should never cover the puzzle grid, word list, or Android navigation controls. Hide it when Settings or Shop overlays are open. Review the banner’s effect on puzzle completion and session length every week.

### Rewarded ads

Rewarded ads are the best place to test higher-value monetization because the player chooses to watch. Good rewards include:

- One extra hint.
- Double coins after a completed puzzle.
- One revive after a failed puzzle.
- Weekly streak protection.
- A small optional theme-shop coin bonus.

Show the reward before the ad and grant it only after the SDK confirms the reward. Google’s guidance requires test ad units during development and a reward callback when the user earns the reward.[1]

Start with a conservative frequency policy:

- One rewarded offer per completed or failed puzzle.
- One streak-protection offer per week.
- No repeated prompt after the player declines.
- No rewarded ad required to enter or complete a puzzle.

### Interstitial ads

Do not add frequent interstitials just to increase impressions. Google Play does not allow unexpected full-screen ads at the beginning of gameplay or content segments. Opt-in rewarded ads and non-disruptive banners are treated differently from unexpected interstitials.[2]

If an interstitial is tested later, place it only after a natural completion or results moment, make it closeable, cap frequency, and compare retention against a no-interstitial control group.

### Mediation

Do not add mediation on day one. First establish clean direct AdMob delivery, consent, diagnostics, and stable traffic. Then test mediation when there are enough impressions to compare fill rate, matched requests, eCPM, and revenue. AdMob states that mediation can use multiple sources, but adapters must initialize before ads are loaded and privacy settings must include applicable mediation partners.[3]

## Revenue math that prevents over-spending

Use actual dashboard values rather than online income promises.

```text
Daily banner revenue
= served banner impressions × banner eCPM ÷ 1,000

Daily rewarded revenue
= rewarded impressions × rewarded eCPM ÷ 1,000

Monthly gross ad revenue
= (daily banner revenue + daily rewarded revenue) × active days

Net growth result
= monthly gross revenue − paid acquisition spend − operating costs
```

Illustrative example only:

```text
1,000 DAU
× 2 served monetized impressions per user per day
× $2 eCPM
÷ 1,000
= about $4 per day
= about $120 for a 30-day month
```

This is not a forecast. Actual eCPM, fill, geography, consent rate, ad format, seasonality, and rewarded completion can make the result materially higher or lower. The example demonstrates why retention and scale matter more than adding aggressive ad placements.

A paid campaign is economically sensible only when the expected value of a new user is higher than the cost of acquiring that user:

```text
Expected user value
= expected retained days × average daily ad revenue per active user
```

Use a safety margin. Do not spend $1 to acquire a user whose measured expected value is $1.05. Start scaling only when the measured value is comfortably above acquisition cost.

## Budget-friendly promotion ladder

### Stage A: $0–$30 per month

Use organic promotion while measurement is being installed.

- Publish three short gameplay videos each week.
- Create one daily puzzle challenge post.
- Share a spoiler-free result card.
- Post in relevant puzzle communities without spam.
- Add a Play Store link to every approved channel profile.
- Use the CrazyGames web version as an additional discovery channel.
- Ask early players for honest reviews after they complete several puzzles, never in exchange for a manipulated rating.

### Stage B: $30–$100 for creative testing

Spend this only after the retention gates are close to passing.

Create three real-gameplay creatives:

1. **Challenge:** “Can you find all five words before time runs out?”
2. **Relaxation:** “Take a short break with a focused word puzzle.”
3. **Progression:** “Start easy, build your streak, and unlock new themes.”

Test one creative and one audience/country group at a time. Do not judge success by cheap installs. Measure first-puzzle completion, Day-1 retention, Day-7 retention, and cost per retained user.

### Stage C: $100–$300 controlled acquisition test

Use a short, capped test rather than an open-ended campaign. Use one primary conversion goal at a time, such as first puzzle completion or a meaningful returning-user action. Google’s App campaign guidance recommends proper bid-budget alignment, correct conversion tracking, relevant deep links, strong creative assets, and avoiding major changes while the campaign is learning.[4]

Pause a campaign when:

- The creative produces installs but few first-puzzle completions.
- Day-1 retention is materially lower than organic traffic.
- The cost per retained user is higher than the measured user value.
- Ad frequency or campaign targeting attracts users who do not match the game.

Do not borrow money for user acquisition. Do not use a credit card balance as the business model.

## Organic content engine

Build a repeatable content system so every successful puzzle can generate multiple pieces of content:

- One 10-second “find the word” video.
- One timed challenge.
- One answer reveal.
- One Daily Challenge post.
- One completion-result card.
- One weekly streak recap.

Use real gameplay recordings. Show the puzzle within the first two seconds. Keep the logo short and place the Play Store call to action at the end and in the caption.

A useful weekly schedule is:

- Monday: easy challenge.
- Tuesday: speed challenge.
- Wednesday: difficult word placement.
- Thursday: theme or wallpaper showcase.
- Friday: weekly quest progress.
- Saturday: community challenge.
- Sunday: next-week streak reminder.

Measure which topics produce profile visits, Play Store visits, installs, first-puzzle completion, and returning users. Continue the formats that create retained players, not merely views.

## Create future games without wasting the first game’s audience

Do not immediately build many unrelated games. First establish a small “Word Quest” brand system:

- Shared visual identity.
- Shared privacy and analytics process.
- Shared cross-promotion screen.
- Shared result-card and challenge mechanics.
- Shared content templates.
- A small reusable game framework.

Only begin the second game after Word Quest has either demonstrated repeatable retention or produced a clear audience insight. The second game should reuse the strongest proven loop, not copy the entire product blindly. Possible adjacent concepts include a number-search game, a picture-word game, a daily spelling challenge, or a timed category puzzle.

Cross-promote only after the new game is useful. Do not interrupt Word Quest players with aggressive promotions. A small optional “More puzzles from Word Quest” card after a completed session is safer than an unexpected full-screen promotion.

## 90-day execution plan

### Days 1–14: Measurement and reliability

- Add analytics events and privacy disclosures.
- Test the production Play build on several real Android devices.
- Confirm consent, banner loading, rewarded callbacks, and progress saving.
- Verify no banner overlaps the puzzle board.
- Publish the privacy policy and app-ads.txt at the correct public URLs.

### Days 15–30: First-session and retention

- Measure the first-puzzle funnel.
- Improve any step where users abandon.
- Strengthen the seven-day Daily Challenge presentation.
- Add shareable, spoiler-free results.
- Add three weekly missions if analytics shows players need clearer goals.
- Publish three to five short gameplay videos per week.

### Days 31–60: Monetization tuning

- Compare banner-visible and banner-limited cohorts if technically possible.
- Test one rewarded placement at a time.
- Review revenue per active user and Day-7 retention together.
- Consider mediation only after direct AdMob delivery is stable.
- Stop any ad placement that increases complaints, abandonment, or uninstall signals.

### Days 61–90: Controlled acquisition

- Test three creatives with a capped budget.
- Start with one country group that matches your expected audience and available budget.
- Use one campaign conversion goal.
- Pause campaigns that fail the retained-user economics test.
- Reinvest only a defined share of verified net revenue.

## Reinvestment rule

Use this rule until the business has stable data:

```text
50% reserved for taxes, fees, and safety buffer
30% reinvested into the best-performing content or acquisition test
20% retained as owner profit or future-game capital
```

If monthly revenue is still small, keep the reinvestment amount small. Do not increase the budget because one day had unusually high revenue. Use a rolling four-week average.

## Non-negotiable safety rules

- Never click your own live ads.
- Use test ads and test devices during development.
- Do not buy fake installs, reviews, ratings, or engagement.
- Do not use misleading ad creatives or false “brain improvement” claims.
- Do not use gambling, adult, deceptive, or inappropriate ad placements.
- Keep ads appropriate for the declared audience and content rating.
- Do not force a user to click an ad to use the game.
- Keep privacy policy, consent, Data safety, and ad disclosures synchronized.

Google Play treats ads and associated offers as part of the app, and disruptive or deceptive ads can violate policy.[2]

## The decision rule

Every month, ask four questions:

1. Are more users returning than last month?
2. Is revenue per active user increasing without harming retention?
3. Can a new user recover the cost of acquisition over a reasonable period?
4. Is the content system producing retained installs rather than empty views?

If the answer to any of these is no, improve that system before adding budget.

## References

[1]: https://developers.google.com/admob/android/rewarded "Google AdMob rewarded ads for Android"
[2]: https://support.google.com/googleplay/android-developer/answer/9857753?hl=en "Google Play Ads policy"
[3]: https://developers.google.com/admob/android/mediation "Google AdMob mediation for Android"
[4]: https://support.google.com/google-ads/answer/14104492?hl=en "Google Ads best practices for App campaigns"
