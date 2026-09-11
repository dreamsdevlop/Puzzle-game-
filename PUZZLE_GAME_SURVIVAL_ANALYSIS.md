# Puzzle Game Survival Analysis

**Project:** Mobile word-search puzzle game at `/home/ubuntu/Puzzle-game-`  
**Author:** Manus AI  
**Analysis date:** September 11, 2026  
**Decision horizon:** First 90 days after technical stabilization

## Executive verdict

> **Verdict: conditional no-go for a broad commercial launch; go for a tightly controlled validation release after four release-blocking defects are fixed.**

The product is a functioning, content-complete prototype rather than a commercially defensible game. It compiles, offers 15 category packs, two play modes, a daily challenge, 50 curated levels, procedural continuation, hints, bonus words, streaks, cosmetic progression, and native advertising. Deterministic tests found every target word on generated boards across all categories, all 50 curated levels, and 366 sampled daily dates. These are meaningful execution strengths.

The current value proposition is nevertheless **too generic to buy users profitably with confidence**. The mobile puzzle market is large, but its economics are increasingly concentrated in evergreen leaders and visually legible hybrid-casual mechanics. Match-3 alone produced approximately $2.7 billion in net in-app purchase revenue in the first half of 2025, yet its downloads fell 17% year over year, and Royal Match plus Candy Crush captured more than half of that subgenre's revenue.[3] In the word segment, the current product enters against daily editorial habits such as Wordle and Connections and enormous free-to-play libraries such as Wordscapes and Word Cookies. A broad word-search library with themes, coins, and ads is competent, but it does not create a distinct reason to install, return, share, or pay.

Commercial release is also blocked by four implementation defects. Completion rewards can be farmed through replay. Rewarded-ad success is inferred from a resolved show call rather than a confirmed reward callback. A native banner is shown during active solving. An app kept open across midnight can retain the previous daily challenge until reloaded. The first three defects directly threaten economy integrity, user trust, and monetization measurement. They must be fixed before any revenue or retention experiment can be interpreted.

The rational survival strategy is therefore not “add more ads” or “add more levels.” It is to use the existing build as a **measured validation platform**, repair the economy and ad contract, sharpen the game around one memorable wedge, and test whether retained play can exceed category baselines before scaling acquisition. The preferred strategic direction is a short daily word or logic ritual with a distinctive content grammar, spoiler-safe sharing, and an archive or themed packs. If the team is willing to create a new product, **Casebook: Contradiction** is the strongest idea because it offers clear differentiation, reusable two-dimensional content, and a credible premium pack model without 3D production or real-time infrastructure.

### Decision summary

| Decision | Position | Reason |
|---|---|---|
| Release to internal or closed testing | **Go after P0 repairs** | The build and content generator are stable enough to measure real behavior once reward and ad defects are removed. |
| Release globally with paid user acquisition | **No-go** | The product has neither proven retention nor a differentiated acquisition hook, while category acquisition costs are rising. |
| Add more generic word-search levels | **Defer** | Fifty curated levels plus procedural continuation are enough for validation. More undifferentiated content will not solve positioning. |
| Keep AdMob | **Yes, under an explicit ethical contract** | Optional rewarded ads can monetize non-payers, but banners must leave the solve screen and rewards must be cryptographically or transactionally idempotent at the application level. |
| Add interstitial ads | **No during the 90-day validation period** | Interstitials would confound retention and trust before the core loop is proven. |
| Invest in a distinctive daily layer | **Yes** | Daily scarcity, streaks, statistics, sharing, and an archive are proven habit structures in leading word products.[9] [10] |
| Scale when targets are met | **Only with cohort contribution evidence** | Installs are not product-market fit. Scale requires retained cohorts whose forecast lifetime value exceeds acquisition and variable service cost. |

## 1. Market context: large demand, narrow paths to survival

### 1.1 Scale estimates must be reconciled, not averaged

Public estimates use different genre taxonomies, geographic coverage, store panels, and definitions of gross consumer spend versus net in-app purchase revenue. They should therefore be treated as a directional range rather than combined into a false point estimate.

| Period and source | Reported scale | Correct interpretation |
|---|---:|---|
| 2024, Adjust citing market intelligence | 9.7 billion puzzle and match-3 downloads; in-app purchase revenue up 14% year over year; 14.9% of mobile-gaming IAP revenue | The category has global reach and remained commercially resilient.[2] |
| 2024 broader mobile market, Sensor Tower | $81 billion in mobile-game spend, up 4% year over year | Puzzle was one of the genres contributing to market growth.[1] |
| H1 2025, AppMagic | $4.6 billion Puzzle net IAP revenue, up 13% year over year | A consistent half-year view suitable for subgenre comparison.[3] |
| Full-year 2025, AppMagic | $8.7 billion casual-puzzle net IAP revenue and 7.3 billion downloads | A narrower taxonomy and net-revenue view.[4] |
| Full-year 2025, Naavik citing Sensor Tower | More than $10 billion IAP revenue and 9.7 billion downloads | A broader directional estimate that should not be directly compared with the AppMagic total.[5] |

The important strategic conclusion survives the measurement disagreement: **puzzle is not a shrinking niche**. However, category size does not imply an easy entry path. The top five casual publishers accounted for 62% of casual revenue in the cited industry view.[8] A new game must create a discoverable wedge and durable cohort economics rather than rely on category demand alone.

### 1.2 Growth has moved away from undifferentiated incumbency battles

The first half of 2025 reveals a bifurcated market. Match-3 remained the largest puzzle subgenre at approximately $2.7 billion, up 7%, while downloads fell 17%. Merge reached approximately $850 million, up 62%, with downloads down 3%. Match-2 Blast generated approximately $282 million, up 4.6%, while downloads fell 47%.[3] Revenue can therefore grow even as new-user volume contracts, but that pattern usually reflects improving monetization among established cohorts rather than a friendly environment for unknown launches.

The clearest recent growth came from **Merge-2 with complex meta systems and newer Sort, Screw, and Block formats**. Naavik reported that about 60% of 2025 puzzle revenue growth came from Match-Merge-2 and the remaining 40% from Sort, Screw, and Block. Sort reached roughly one billion downloads and $280 million in revenue, up 176.4% year over year. Screw exceeded $206 million. Block reached about $183 million, although much of that performance was concentrated in Color Block Jam.[5] These figures indicate market appetite for immediately legible, tactile interactions. They do not mean that copying a successful title is safe. Concentration within each new format shows that execution and marketability still follow winner-take-most dynamics.

### 1.3 Player demand is real, but survival decays quickly

Puzzle players can engage deeply in a session while failing to form a long-term habit. Adjust reported an average puzzle session length of 24.48 minutes in 2024, but benchmark retention was only 20% on day 1, 7% on day 7, and 2% on day 30. In the same data, cost per install rose from $0.38 to $0.45 and cost per thousand impressions rose from $3.36 to $3.75.[2] Mistplay's platform-specific 2025 data placed day-30 retention higher at 4.14% on Android and 6.7% on iOS and found that 84% of surveyed puzzle players primarily sought relaxation.[6] The two datasets are not contradictory because they cover different populations and methodologies. Together, they show that **relaxation attracts sessions, but novelty alone rarely preserves cohorts**.

This distinction matters for the current product. A banner covering or distracting from a word grid attacks the category's dominant emotional promise. A reward that is granted without confirmed completion attacks trust. Excessive currencies or events would create cognitive clutter without necessarily improving the solve. Commercial survival depends on protecting the calm core while adding reasons to return outside the moment-to-moment board.

### 1.4 Strategic implications for this project

The project should not position itself as a smaller Wordscapes or a generic alternative to every word game. It cannot win through content count, ad budget, or brand recognition. It can survive through one of two paths:

1. **Focused niche utility:** an honest, polished word-search product for a defined audience, acquired mostly through organic search, community partnerships, and low-cost regional tests. This path may create a modest durable business but has a low ceiling unless the audience is highly specific.
2. **Distinctive ritual product:** a daily word or logic mechanic that can be explained in one sentence, completed in a few minutes, discussed without spoilers, and expanded through an archive or themed packs. This path has higher product risk but a better chance of organic distribution and subscription-like value.

The present build sits between these paths. It is too feature-rich to be a minimal daily ritual and too undifferentiated to be a defensible free-to-play library. The next 90 days should force a choice.

## 2. Competitor and substitute analysis

The relevant competitive set includes both direct word products and broader puzzle businesses that set acquisition and retention expectations.

| Product | Core loop and business model | Durable advantage | Threat to this project | Actionable lesson |
|---|---|---|---|---|
| **Wordle** | Guess one curated five-letter word in six attempts. One free daily puzzle supports statistics, streaks, sharing, and subscriber-oriented archive access. | Extreme rule clarity, scarcity, editorial trust, and spoiler-safe virality. | It owns the mental model for a minimal daily word ritual. | Explain the game in one sentence. Make the result shareable without exposing the answer. Use the archive as premium depth rather than flooding the home screen.[9] |
| **Connections** | Group 16 words into four curated semantic categories with deliberate overlaps and limited mistakes. Daily play is free; archives support subscription value. | Social discussion and human-authored ambiguity create memorable near-misses. | It demonstrates how editorial quality can outperform raw level volume. | Build an appeal and correction process. In word games, fairness is part of the product, not merely quality assurance.[10] |
| **Spelling Bee** | Form as many words as possible from seven letters. Daily editorial content, ranks, and open-ended discovery extend the session. | Depth from a tiny rule set and visible progress toward mastery. | It provides a richer vocabulary session without a complex meta-game. | Let progress emerge from the puzzle itself before adding currencies or decorative systems.[11] |
| **Wordscapes** | Connect letters to complete crossword-like boards. Free-to-play with ads, in-app purchases, thousands of levels, scenery, and offline play. The cited store snapshot showed 100 million-plus downloads. | Distribution, content scale, familiarity, and broad localization. | The current project cannot win a level-count or paid-acquisition contest. | Compete on audience specificity, daily ritual, or an original rule, not on “more relaxing word levels.”[12] |
| **Word Cookies!** | Swipe letters to form words across 30,000-plus advertised levels, daily challenges, hints, rewards, competition, and seasonal events. Free-to-play with ads and purchases. | Huge content library and a mature retention stack. | It already offers the conventional combination of word swipe, boosters, daily tasks, and events. | Adding the same features produces parity, not differentiation. Preserve uninterrupted solving and make monetization optional.[13] [14] |
| **Ruzzle** | Find words on a 16-letter grid in two minutes, then compete asynchronously with friends or random opponents. | The timed word grid becomes a social rematch engine. | It offers repeat sessions that a solo word search lacks. | If social is added, make it a direct extension of solving, such as a shared daily seed or asynchronous challenge, rather than a generic leaderboard.[15] |
| **Royal Match and Candy Crush** | Highly polished match-3 cores with deep progression, live operations, and large-scale acquisition. Together they generated more than half of H1 2025 match-3 revenue. | Brand, content operations, optimization infrastructure, and enormous creative budgets. | They compete for the same casual attention and ad inventory even though the mechanic differs. | Do not imitate incumbent meta depth. Use a smaller, ownable loop and prove cohort value before buying reach.[3] [7] |
| **Sort, Screw, and Block leaders** | Tactile, visually demonstrable hybrid-casual mechanics with rewarded aids and light meta systems. | The core interaction reads in the first seconds of a video advertisement. | These products raise the marketability standard for all casual puzzles. | A word game's creative must show its unique decision immediately. Text-heavy setup is an acquisition liability.[5] |

The direct word competitors expose a consistent architecture. Leading products combine **one primary mechanic**, a predictable cadence, visible personal progress, and a monetization model that does not interrupt comprehension. Mobile free-to-play leaders add content scale and events, while editorial leaders add trust and discussion. The current project has cadence and progression, but its primary mechanic is familiar and its content lacks an editorial or social reason to become culturally specific.

## 3. Product diagnosis

### 3.1 What is already credible

The application is not an empty concept. It includes 15 topic packs, Classic and two-minute Time modes, 50 curated levels across six stages, procedural levels above level 50, daily deterministic challenges, persistent streaks, three starting hints, bonus-word scoring, a coin-funded theme shop, banners, and rewarded placements. The production build and TypeScript checks passed in the supplied audit. One generated board per category and curated level, plus 366 daily dates, placed every intended target word.

These strengths reduce technical and content-generation risk. The team has a usable React and Capacitor base, an Android package, a deterministic challenge system, persistent progression, and enough launch content for a soft test. The project can therefore move directly to instrumentation and behavioral validation after critical repairs. It does not need another long feature-development phase.

### 3.2 Release-blocking defects

| Priority | Defect | Why it invalidates the business | Required repair and acceptance test |
|---|---|---|---|
| **P0** | Level rewards and category rewards are granted on every replay. | Unlimited coin farming destroys shop scarcity, payer intent, economy telemetry, and any experiment involving rewarded coins. | Persist a first-clear transaction. Award the base reward once, then only a positive star delta or a deliberately capped replay reward. Replaying 100 times must not duplicate a first-clear transaction. |
| **P0** | `showRewarded()` treats a resolved SDK show call as reward proof. | A close, callback race, or SDK edge case may pay an unearned reward. This creates policy, revenue, and trust discrepancies. | Grant only after the plugin's confirmed rewarded event or returned reward item. Attach a unique request ID and make the grant idempotent. Test load failure, show failure, early close, confirmed reward, duplicate callback, and app resume. |
| **P0** | `<BannerAd visible />` is rendered on every screen, including active solving. | It conflicts with the relaxation promise, risks obstruction, and makes retention tests measure the defect rather than the game. | Derive visibility from screen state. Hide during the game, consent surfaces, and full-screen overlays. Verify adaptive-banner insets on representative Android sizes. |
| **P1** | The daily date and challenge are memoized for the open session. | A user crossing local midnight sees stale content until reload, which can corrupt streak expectations. | Recompute on visibility change, minute/date boundary, timezone change, and cold start. Test daylight-saving and manual-clock cases. |
| **P1** | Daily reward copy and replay result amounts can differ from the amount granted. | Inconsistent numbers weaken trust and make customer support difficult. | Generate all reward copy from the final committed transaction. A replay must display zero or the explicit replay amount. |
| **P1** | Economy, streak, and purchases are stored entirely in local storage. | Device-clock or storage editing can manipulate balances and dates. | Keep local persistence for noncompetitive offline play. Add signed or server-authoritative transactions only if leaderboards, transferable value, or high-value purchases are introduced. |
| **P1** | Rewarded offers have insufficient placement-level caps. | Repeated refills or coin offers can create abuse and train play around ads rather than puzzles. | Cap by placement and time window: one hint refill per puzzle, one post-win multiplier per completion, and one shop coin offer per day. |
| **P2** | The browser build has no clear fallback when native AdMob is unavailable. | Testers may interpret the hint-refill path as broken. | Hide the ad offer or show an explicit unavailable state on web. Never simulate a successful reward in production analytics. |

The implementation audit also found a documentation mismatch: `AD_REVENUE_AND_ENGAGEMENT.md` says the banner is hidden during active play, while the current application source renders it unconditionally. Source behavior should be the release truth. Documentation must be updated after the repair.

### 3.3 Strategic weaknesses

The larger survival risk is not a bug. It is **absence of a defensible promise**. The product currently describes what it contains—categories, modes, levels, themes, coins—rather than why a player should choose it. “Find familiar words in themed grids” is understood immediately, but it is also easy to reproduce and difficult to advertise without appearing interchangeable.

The current theme catalog uses broad topics such as Animals, Food, Sports, Countries, Colors, Fruits, Space, Nature, Technology, and Jobs. This breadth lowers comprehension but does not create identity. A more defensible content strategy would own one audience or emotional context. Examples include language learners, families solving together, local culture packs, visually accessible senior play, or a mystery framework in which found words become evidence. The narrower choice must be validated rather than inferred.

The game also has several retention systems before proving a retention reason. Streaks, coins, themes, level maps, timers, rewarded hints, and procedural levels can amplify a satisfying loop, but they cannot create one. The first-session question is not whether the user understands the shop. It is whether the first puzzle creates a specific “one more” motive that is stronger than opening an incumbent.

### 3.4 Survival scorecard

The following scores are managerial judgments on a five-point scale, not market measurements. A score of 3 means adequate for controlled testing. A score of 4 is the minimum desirable state for paid scaling in that dimension.

| Dimension | Current score | 90-day target | Diagnosis |
|---|---:|---:|---|
| Technical stability | 3.5 | 4.5 | Compilation and generation are healthy, but native ad callbacks and midnight behavior need device testing. |
| Core-loop legibility | 4.0 | 4.5 | Word search is immediately understood. |
| Differentiation | 1.5 | 3.5 | Generic categories and progression do not create an ownable wedge. |
| Content scalability | 4.0 | 4.5 | Procedural continuation is an asset, provided quality and repetition are measured. |
| Day-1 habit potential | 2.5 | 4.0 | Daily challenges and streaks exist, but the daily experience is not yet the product's center of gravity. |
| Day-30 depth | 2.0 | 3.5 | Cosmetics and level count provide volume, not necessarily meaning or social commitment. |
| Organic distribution | 1.0 | 3.0 | There is no proven spoiler-safe result card, referral loop, or audience community. |
| Monetization integrity | 1.5 | 4.0 | Reward farming, unverified rewarded callbacks, and banner placement invalidate revenue tests. |
| Acquisition marketability | 2.0 | 3.5 | The familiar grid is readable but lacks a distinctive three-second creative moment. |
| Operational burden | 4.0 | 4.0 | The mostly local, deterministic architecture is manageable for a small team. |

### 3.5 Product decision

The existing product should be treated as **a validation asset, not a finished commercial proposition**. After the P0 repairs, the team should test two sharply different store propositions using the same base:

* A calm daily word-search ritual for a defined audience, with one short challenge, a forgiving streak, statistics, and spoiler-safe sharing.
* A mystery or evidence variant in which the words found resolve a micro-case, creating narrative meaning without rebuilding the grid engine.

Only one should advance after 30 to 45 days of cohort data. If neither reaches the retention and fairness gates in this report, the rational choice is to stop adding meta systems and redirect the codebase toward the highest-ranked new concept.

## 4. Unit economics logic

### 4.1 The economic model

A puzzle game survives when the **incremental lifetime contribution per acquired user** is positive and the cash payback period fits the studio's runway. Revenue totals and session length do not establish this. The required model is cohort-based:

\[
\text{Net LTV}_{T} = \sum_{d=0}^{T} S_d \times (A_d + I_d) - V_T
\]

where:

* \(S_d\) is the probability that an installed user is active on day \(d\);
* \(A_d\) is net advertising revenue per active user on day \(d\);
* \(I_d\) is net in-app purchase revenue per active user on day \(d\); and
* \(V_T\) is variable service, support, payment, content, and live-operations cost attributable to the user through day \(T\).

The acquisition decision is:

\[
\text{Contribution}_{T} = \text{Net LTV}_{T} - \text{Incremental CPI}
\]

Paid acquisition should scale only when conservative forecast contribution is positive and the forecast survives uncertainty in retention, ad fill, attribution, and payer concentration. The cited 2024 puzzle cost per install was $0.45, up from $0.38.[2] This is a market reference, not a guaranteed bid for this game or region.

### 4.2 Retention is the dominant economic lever

At the category benchmark, 80% of installers do not return on day 1, 93% are absent on day 7, and 98% are absent on day 30.[2] A long average session among survivors cannot compensate automatically for that decay. The team should model **active days per install**, not only minutes per session. Retention improvements increase ad opportunities, payer conversion windows, archive value, and the probability of an organic share simultaneously. Increasing ad density raises only one term and may reduce the others.

For a deep cohort view, use a proper survival estimator rather than a single day-7 percentage. Define churn operationally as no qualifying puzzle activity for 14 consecutive days. Right-censor users who have not yet had enough observation time. Estimate the survival function with Kaplan–Meier logic:

\[
\hat{S}(t)=\prod_{t_i \leq t}\left(1-\frac{d_i}{n_i}\right)
\]

where \(d_i\) is the number of churn events at time \(t_i\) and \(n_i\) is the number of users still at risk immediately beforehand. Plot survival and daily hazard by acquisition channel, country, operating system, creative, onboarding variant, first-session outcome, first ad exposure, and first hint use. A variant that raises day-1 retention but produces a sharp hazard after the first reward is not a durable win.

### 4.3 Advertising sensitivity

Advertising revenue per install can be approximated as:

\[
\text{Ad LTV} = \sum_p \frac{\text{Impressions per install}_p \times \text{Net eCPM}_p}{1000}
\]

where \(p\) is a placement such as rewarded video or banner. The table below is a pure sensitivity calculation. The effective cost per thousand impressions values are assumptions, not forecasts.

| Assumed net eCPM | Impressions per acquired install required to recover a $0.45 CPI from ads alone |
|---:|---:|
| $1 | 450 |
| $5 | 90 |
| $10 | 45 |
| $15 | 30 |
| $20 | 22.5 |

This arithmetic explains why banner-first monetization is dangerous for a low-retention game. At low banner yields, the game needs an implausibly high number of lifetime impressions per install, which encourages intrusive exposure and worsens survival. Optional rewarded ads can produce higher value per impression, but only when users encounter a genuine need and opt in. The correct objective is **rewarded revenue per retained solver**, constrained by completion, sentiment, and next-day return—not maximum ad views.

### 4.4 Hybrid monetization sensitivity

A simplified hybrid model is:

\[
\text{LTV} = \left(\text{Payer conversion} \times \text{Gross ARPPU} \times \text{Developer net factor}\right) + \text{Ad LTV}
\]

For illustration, if 2% of installers pay, gross average revenue per payer is $5, and the developer retains 85% after applicable store fees and adjustments, IAP contributes $0.085 per install. Recovering a $0.45 CPI would still require $0.365 of advertising and other contribution before variable costs. At a hypothetical $10 net eCPM, that remaining gap equals 36.5 lifetime ad impressions per install. This is not a forecast; it shows why modest payer conversion does not rescue weak retention.

The project should monetize through four transparent layers:

1. **One-time ad removal**, which converts users who value calm rather than forcing them into a subscription.
2. **Premium themed packs or an archive**, which sell content with a clear permanent benefit.
3. **Cosmetics**, which give long-term users voluntary expression without affecting puzzle fairness.
4. **Optional rewarded assistance**, which exchanges attention for a precisely disclosed hint, undo, or capped bonus.

Subscriptions should be introduced only if the team can support a reliable editorial cadence and a growing archive. A recurring fee for procedural word grids without ongoing editorial value is unlikely to sustain trust.

### 4.5 Scale and kill gates

The benchmarks below are management gates for this product. They are intentionally above the cited broad-puzzle averages of 20% day 1 and 7% day 7.[2] They are not universal industry standards.

| Gate | Minimum to continue closed testing | Minimum to test paid acquisition | Scale condition |
|---|---:|---:|---|
| Tutorial completion | 75% | 85% | Stable across major device classes and channels |
| First-puzzle completion | 65% | 75% | No meaningful fairness or input complaints |
| Day-1 retained solvers | 25% | 30% | Confidence interval remains above 25% by priority channel |
| Day-7 retained solvers | 8% | 10% | No single reward or notification explains most returns |
| Day-30 retained solvers | 3% | 5% | Survival curve and contribution forecast support payback |
| Daily challenge completion among entrants | 60% | 70% | Difficulty segments remain fair |
| Organic share or challenge action among completers | 3% | 8% | Referred users activate at an acceptable rate |
| Rewarded-ad opt-in among eligible offers | Observe | 15%–35% without pressure | Incremental revenue is positive without retention harm |
| Reward transaction discrepancy | 0.1% maximum during test | Effectively zero | Duplicate or unconfirmed grants are blocked |
| Forecast D180 LTV/CPI | Not used | At least 1.0 in a limited test | At least 1.3 on a conservative forecast before material scaling |

A missed gate is information, not a reason to add unrelated features. If day 1 is weak, fix onboarding, first-win time, or the core hook. If day 1 is healthy and day 7 collapses, fix cadence, difficulty, or social meaning. If retention is healthy but contribution is weak, improve premium value and rewarded relevance before increasing ad load.

## 5. Analytics plan: KPIs, events, and survival measurement

### 5.1 Measurement principles

Analytics should describe the player's contract with the game. Every economic event must connect to a gameplay state and a committed transaction. Event names should use lowercase `snake_case`, carry an immutable anonymous installation identifier, and include `event_id`, `event_timestamp_utc`, `app_version`, `platform`, `country`, `acquisition_channel`, and active experiment assignments where lawful and available. Do not log raw entered text, personal messages, advertising identifiers without consent, or unnecessary personal data.

The primary product metric should be **weekly retained solvers (WRS)**: unique users who complete at least two qualifying puzzles on at least two distinct days in a rolling seven-day window. This metric rewards genuine repeat solving and is harder to inflate with ad impressions, app opens, or passive sessions. The primary economic metric should be **day-90 forecast contribution per install**, updated from observed retention, ad paid events, purchase receipts, refunds, and variable costs.

### 5.2 KPI scorecard

| Layer | KPI | Definition | Decision use |
|---|---|---|---|
| Acquisition | Store conversion rate | Installs divided by store listing visitors, segmented by creative and region | Tests whether the proposition is legible before CPI optimization. |
| Acquisition | Incremental CPI | Incremental installs caused by spend divided by spend, using geo or budget holdouts where feasible | Prevents organic installs from being credited to ads. |
| Activation | Tutorial completion rate | `tutorial_completed` divided by `tutorial_started` | Detects comprehension and input failure. |
| Activation | First-puzzle completion rate | New installers completing a valid puzzle within the first session | Measures delivery of the core promise. |
| Activation | Time to first win | Median seconds from first game start to first valid completion | Separates fast understanding from prolonged session length. |
| Engagement | Puzzles per active day | Valid completions divided by daily active solvers | Tracks voluntary depth without rewarding idle time. |
| Engagement | Daily challenge participation | Users starting the daily puzzle divided by eligible daily active users | Measures whether cadence is central rather than decorative. |
| Quality | Puzzle fairness rate | Share of rated puzzles marked fair, plus report and correction rates | Protects trust in dictionaries, generation, and difficulty. |
| Retention | D1, D7, and D30 retained solvers | Installer completed a qualifying puzzle on the exact or bounded return day, with the definition fixed in the dashboard | Enables comparable cohort decisions. |
| Retention | Survival function and churn hazard | Kaplan–Meier survival under a 14-day inactivity churn rule and the conditional churn rate by tenure | Locates when and for whom the game loses relevance. |
| Resurrection | 28-day resurrected solver rate | Previously churned users who return and complete a puzzle | Separates reactivation from retained use. |
| Organic growth | Share activation rate | Valid recipients who open a shared challenge and start a puzzle divided by delivered share links | Measures whether sharing acquires real players. |
| Ads | Eligible rewarded opt-in | Accepted rewarded offers divided by eligible offers shown | Measures voluntary demand for the exchange. |
| Ads | Confirmed reward rate | Confirmed SDK reward callbacks divided by rewarded ads started | Detects SDK and placement failure. |
| Ads | Reward grant integrity | Unique committed reward grants divided by confirmed callbacks; duplicates and grants without callbacks tracked separately | Prevents economy leakage. |
| Ads | Ad retention delta | Next-day return among randomized eligible users shown an offer versus a holdout, not merely acceptors versus decliners | Measures causal harm or benefit. |
| IAP | Payer conversion | Unique verified purchasers divided by eligible installers | Measures premium value. |
| IAP | Net ARPPU and refund rate | Net recognized revenue per payer and refunded transactions divided by purchases | Detects pricing or trust problems. |
| Economy | Source-to-sink ratio | Coins granted divided by coins spent by cohort and tenure | Detects replay farming and currency inflation. |
| Economics | Forecast LTV/CPI and payback day | Conservative cohort LTV divided by incremental CPI; earliest day cumulative contribution becomes nonnegative | Governs acquisition scale. |

### 5.3 Canonical event dictionary

| Event name | Required properties | Purpose |
|---|---|---|
| `app_first_open` | `install_id`, `app_version`, `platform`, `locale` | Cohort origin. |
| `session_started` | `session_id`, `days_since_install`, `entry_source` | Session and resurrection analysis. |
| `consent_form_shown` | `consent_region`, `form_version` | Consent funnel without recording the sensitive answer in general gameplay tables. |
| `consent_status_updated` | `analytics_allowed`, `ads_allowed`, `personalized_ads_allowed`, `form_version` | Enforces lawful downstream collection. |
| `tutorial_started` | `tutorial_version` | Activation denominator. |
| `tutorial_step_completed` | `step_id`, `elapsed_ms`, `error_count` | Locates comprehension failure. |
| `tutorial_completed` | `elapsed_ms`, `hints_used` | Activation numerator. |
| `puzzle_impression` | `puzzle_id`, `puzzle_type`, `difficulty`, `source` | Separates exposure from start. |
| `puzzle_started` | `puzzle_id`, `mode`, `difficulty`, `is_daily`, `generator_version` | Core funnel and content quality. |
| `word_found` | `puzzle_id`, `word_length`, `is_target`, `elapsed_ms` | Difficulty and pacing; do not log the actual word unless needed for audited content QA. |
| `hint_offer_shown` | `puzzle_id`, `placement`, `hints_remaining`, `offer_version` | Offer eligibility and experimentation. |
| `hint_used` | `puzzle_id`, `hint_type`, `source`, `elapsed_ms` | Difficulty and utility analysis. |
| `puzzle_abandoned` | `puzzle_id`, `elapsed_ms`, `progress_pct`, `last_action`, `reason_if_explicit` | Churn precursor analysis. |
| `puzzle_completed` | `puzzle_id`, `elapsed_ms`, `score`, `stars`, `hints_used`, `bonus_words_count`, `attempt_number` | Core success event. |
| `puzzle_rated` | `puzzle_id`, `fairness_rating`, `difficulty_rating` | Trust and generation quality. |
| `puzzle_reported` | `puzzle_id`, `reason_code`, `generator_version` | Editorial correction queue. |
| `daily_challenge_opened` | `daily_key`, `streak_before` | Daily funnel. |
| `daily_challenge_completed` | `daily_key`, `streak_after`, `reward_transaction_id` | Habit and reward integrity. |
| `streak_changed` | `old_streak`, `new_streak`, `change_reason`, `daily_key` | Detects rollover and clock defects. |
| `results_share_started` | `puzzle_id`, `share_surface` | Share intent. |
| `share_link_opened` | `share_id`, `referrer_install_id_hash` | Referral attribution without exposing identity. |
| `referred_puzzle_started` | `share_id`, `puzzle_id` | Viral activation. |
| `economy_transaction_committed` | `transaction_id`, `currency`, `amount`, `source_or_sink`, `reason`, `balance_after` | Authoritative economy ledger. |
| `shop_viewed` | `entry_source`, `balance` | Shop funnel. |
| `item_purchase_started` | `item_id`, `price_currency`, `price_amount` | Purchase intent. |
| `item_purchase_completed` | `item_id`, `store_transaction_id_hash`, `net_revenue`, `currency` | Verified revenue. |
| `item_purchase_failed` | `item_id`, `failure_code`, `stage` | Checkout diagnosis. |
| `ad_offer_shown` | `placement`, `reward_type`, `reward_amount`, `frequency_count` | Ethical offer exposure. |
| `ad_offer_accepted` | `placement`, `request_id` | Voluntary opt-in. |
| `ad_load_result` | `placement`, `request_id`, `success`, `error_code`, `latency_ms` | Fill and technical reliability. |
| `rewarded_ad_started` | `placement`, `request_id`, `ad_unit_alias` | Ad funnel. Never log the raw production unit ID. |
| `rewarded_ad_closed` | `placement`, `request_id`, `reward_confirmed` | Early-close and completion behavior. |
| `reward_callback_received` | `placement`, `request_id`, `reward_type`, `reward_amount` | Sole application trigger for reward eligibility. |
| `reward_grant_committed` | `placement`, `request_id`, `transaction_id`, `idempotency_result` | Proves exactly-once payout. |
| `ad_impression_paid` | `placement`, `format`, `value_micros`, `currency`, `precision` | Cohort-level ad revenue. |

### 5.4 Experiment design

Every material change should have a stated hypothesis, primary metric, guardrails, minimum observation window, and predeclared stop condition. Retention experiments must assign at install or user level and preserve assignment across sessions. Monetization tests must include nonrevenue guardrails: puzzle completion, daily return, complaint rate, store rating trend, and uninstallation where measurable.

Do not compare rewarded-ad acceptors with decliners and call the difference causal. Acceptors have different needs and engagement. Randomize whether an otherwise eligible user sees an offer, or randomize conservative offer timing, then compare intent-to-treat outcomes. Use geo or budget holdouts for acquisition incrementality because last-click attribution can overstate paid impact in organic puzzle categories.

## 6. Ethical AdMob strategy

### 6.1 Player contract

The ethical standard is simple: **an advertisement must never be disguised as gameplay, interrupt an active solve, misrepresent the game, or grant less than the value promised**. Apple's review guidelines require ads to be identifiable, appropriate, and non-manipulative, and require in-app purchase for digital unlocks and content on its platform.[16] Historical enforcement against misleading puzzle advertisements also demonstrates that creative-to-gameplay mismatch creates regulatory and reputational exposure.[17]

The app should make four commitments visible in its design:

1. Solving is uninterrupted.
2. Rewarded ads are optional and state the exact reward before acceptance.
3. Closing or declining an ad never removes an already earned reward.
4. Purchases and ad removal have durable, plainly described value.

### 6.2 Placement policy

| Placement | Policy for the first 90 days | Frequency cap | Guardrail |
|---|---|---:|---|
| Active puzzle screen | **No banner, interstitial, or pop-up offer** | Zero | Board geometry and touch input must remain stable. |
| Home, level map, and category screens | Adaptive banner permitted only after consent and readiness | One persistent banner per eligible screen session | Remove if it materially reduces navigation or next-day return. |
| Results screen | Optional “double earned coins” rewarded offer | Once per completed puzzle; no offer on a duplicate daily reward | Grant only on confirmed callback with an idempotent request ID. |
| Hint depletion | Optional two-hint rewarded refill | Once per puzzle | A free exit and later retry must remain available. |
| Failed timed puzzle | Optional revive if the mode supports a meaningful recovery | Once per puzzle | Never create an artificial failure immediately before the offer. |
| Theme shop | Small optional coin reward | Once per local day, reconciled against a server/signed date if value becomes material | Do not make viewing ads the dominant source of shop currency. |
| Daily streak | No paid or ad-based repair at launch | Zero initially | Add only after streak fairness and rollover are proven. |
| Interstitial | Disabled | Zero | Reconsider only after retention is stable and through a randomized holdout. |

### 6.3 Technical controls

Consent must be gathered through the platform-appropriate flow before requesting personalized advertising where required. The settings screen must expose privacy choices and a path to change consent. Data collection should be minimized, disclosures must match actual software development kits, and child-directed treatment must be configured if the audience or store classification requires it.

Development and quality assurance must use Google's test units or registered test devices. Repeated interaction with live production ads during testing risks invalid traffic. Google also notes that app readiness, supported-store listing, account verification, and linking can affect serving; a technically correct build does not guarantee fill.[18] [19]

Reward handling requires a transaction boundary:

1. Create a random `request_id` when the user accepts the offer.
2. Record the placement, promised reward, balance, and eligibility.
3. Prepare and show the ad.
4. Wait for the SDK's confirmed reward event or verified reward item.
5. Commit one economy transaction keyed by `request_id`.
6. Ignore duplicate callbacks but record the idempotency outcome.
7. Present the updated balance from the committed ledger.

Remote configuration may control placement enablement, caps, and reward amounts, but it must have conservative local defaults. A configuration failure must disable an offer rather than remove progress or show repeated ads. Mediation should be deferred until direct AdMob delivery, paid-impression reporting, and cohort effects are stable.

### 6.4 Creative ethics

Every acquisition creative must show an interaction that exists in the released build. A mystery wrapper may dramatize context, but the tap, swipe, word selection, failure state, and reward must remain representative. Mistplay reported that 37% of puzzle players in its study churn quickly when gameplay does not match advertising.[6] Misleading creative can lower apparent CPI while degrading activation, retention, reviews, and platform standing. The correct creative metric is therefore not click-through rate alone. It is **retained solver contribution by creative**.

## 7. Ninety-day survival plan

The plan assumes a small team and uses the current codebase. Work is sequenced to prevent new features from hiding defects or contaminating measurement.

### Days 0–14: restore integrity

**Objective:** make every completion, reward, date, and ad event trustworthy.

| Workstream | Deliverable | Exit evidence |
|---|---|---|
| Economy | First-clear reward ledger with unique transaction IDs and new-star delta rewards | Automated replay test shows no duplicated base rewards across 100 repeats. |
| Rewarded ads | Confirmed reward callback, request IDs, exactly-once grant, error states | Device tests cover load failure, early close, success, duplicate callback, background/resume, and no-fill. |
| Banner | Screen-derived visibility and adaptive inset handling | No banner on active puzzle or overlay across representative Android devices. |
| Daily state | Visibility/date-boundary refresh and correct reward copy | Tests pass across midnight, timezone changes, daylight-saving boundaries, and duplicate completion. |
| Analytics foundation | Canonical event schema, consent gating, environment separation, economy reconciliation dashboard | Test sessions reconcile starts, completions, rewards, balances, and paid impressions. |
| Release operations | Test-ad configuration, internal Play track, crash reporting, privacy and data-safety audit | Internal testers receive a signed build without production-ad interaction. |

No new progression system should be built in this phase. The only acceptable feature work is necessary to expose truthful state or recover gracefully from failure.

### Days 15–30: sharpen the promise

**Objective:** produce two testable propositions without doubling the codebase.

The first proposition should make the current daily challenge the home screen's primary action. It should include a sub-three-minute target, clear streak state, personal statistics, and a spoiler-safe share card. The second should wrap the same grid mechanic in a micro-mystery or evidence frame. Found words should resolve a specific case rather than merely complete a list.

Create three honest store creatives per proposition. Each creative must demonstrate the actual interaction in its first three seconds. Run low-cost listing or community concept tests before buying installs. Measure comprehension, expected enjoyment, install intent, and the language players use to describe the game. Reject any proposition that testers cannot distinguish from a generic word search without seeing the title.

### Days 31–45: closed alpha and content trust

**Objective:** validate first-session comprehension and puzzle fairness with 300–500 consented testers if feasible.

Ship 30 daily or mystery exemplars across three difficulty bands. Add in-product fairness rating and report flows. Version the dictionary and generator. Create a correction process that can disable a bad puzzle, explain the issue, and preserve a user's streak. Test accessible typography, non-color-only feedback, screen sizes, offline return, and low-connectivity behavior.

Continue only if at least 75% complete the tutorial, 65% complete a first puzzle, and at least 70% of puzzle raters describe the logic and word set as fair. These are product gates, not external benchmarks.

### Days 46–60: limited regional soft launch

**Objective:** observe real retention without committing to global acquisition.

Launch in a small set of English-capable or fully localized regions. LATAM and MENA showed strong puzzle growth in the cited 2024 data, but localization and dictionary quality must determine market choice rather than growth statistics alone.[2] Separate organic, community, and paid cohorts. Use budget or geo holdouts where possible. Do not optimize campaigns against installs until post-install event quality is confirmed.

Run only two product experiments at a time: onboarding or first-puzzle difficulty, then daily cadence or sharing. Keep ad policy fixed so retention can be interpreted. The minimum continuation signal is 25% day-1 and 8% day-7 retained solvers with no severe fairness or reward-integrity issue.

### Days 61–75: prove habit before revenue pressure

**Objective:** lift repeat solving and validate optional value exchanges.

Introduce one weekly goal and one forgiving streak mechanic. Do not add teams, leagues, battle passes, or multiple currencies. Test the spoiler-safe share card and same-seed friend challenge. Measure recipient activation, not shares alone.

After retention stabilizes, test one rewarded placement against a holdout. The first candidate should be a post-completion coin multiplier or one hint refill per puzzle. Measure next-day return, puzzle completion, economy inflation, complaints, and paid-impression value. Add a one-time ad-removal purchase only after banner behavior is stable.

### Days 76–90: decide, do not drift

**Objective:** choose scale, pivot, niche launch, or stop.

| Outcome | Evidence | Decision |
|---|---|---|
| **Scale cautiously** | D1 at least 30%, D7 at least 10%, D30 trending toward at least 5%, organic action at least 8% of completers, and conservative forecast LTV/CPI at least 1.3 | Increase acquisition in controlled steps. Keep regional and creative holdouts. |
| **Continue product iteration** | D1 25%–30% and D7 8%–10%, with a clearly diagnosed drop-off and strong fairness | Run one additional six-week cycle focused on the diagnosed hazard. |
| **Niche organic launch** | Retention is acceptable among a specific audience, but paid contribution is weak | Serve that niche with community distribution, premium packs, and low operational cost. |
| **Pivot to a ranked new concept** | First-session interest is present but day-7 remains below 8%, or users cannot distinguish the product | Preserve the platform, analytics, ad, and generator components; replace the core proposition. |
| **Stop** | Weak activation, repeated fairness problems, and no identifiable high-retention segment after two controlled propositions | End feature expansion and protect remaining runway. |

The team should write the day-90 decision memo before seeing results. Precommitment prevents sunk-cost reasoning from turning a failed test into indefinite live operations.

## 8. Five ranked new-game ideas

The ranking considers differentiation, first-three-second marketability, content scalability, retention potential, monetization fit, and small-team execution. Scores are directional judgments from 1 to 5. Higher execution score means easier for a small team.

| Rank | Concept | Differentiation | Marketability | Content leverage | Retention potential | Small-team execution | Total / 25 |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | **Casebook: Contradiction** | 5 | 4 | 5 | 4 | 5 | **23** |
| 2 | **Tidy Orbit** | 4 | 5 | 4 | 4 | 3 | **20** |
| 3 | **Relay Room** | 5 | 4 | 4 | 5 | 2 | **20** |
| 4 | **Thread the Wild** | 4 | 4 | 5 | 4 | 3 | **20** |
| 5 | **Iconic: Rulebook** | 4 | 4 | 5 | 3 | 4 | **20** |

The tie among ranks 2–5 is broken by strategic fit and downside. Tidy Orbit has the clearest video hook. Relay Room has the greatest viral upside but the highest service and cold-start risk. Thread the Wild has strong procedural potential but a less urgent commercial loop. Iconic: Rulebook is efficient and global in principle, but icon ambiguity may limit trust and long-term depth.

### Rank 1 — Casebook: Contradiction

**Wedge.** Players inspect six short clues and identify the one factual contradiction that breaks a micro-mystery. A case takes about two minutes and ends with a concise explanation. The product combines the daily discussion quality of an editorial word puzzle with the replayable structure of a logic game.

**Why it can survive.** The concept is distinctive without expensive three-dimensional assets or real-time infrastructure. Authored clue graphs can be permuted across names, objects, times, and settings, allowing a small rules engine to produce variations while human writers preserve narrative quality. Cases can become premium themed packs, and spoiler-safe sharing can ask friends which evidence they trusted without exposing the answer.

**Minimum viable product.** Build 30 validated cases across a train, gallery, and hotel. Include one free daily case, an archive, fairness feedback, a deterministic validator, and a share card. Do not add energy, crafting, or currencies.

**Monetization.** Offer a one-time ad-free unlock, premium casebooks, cosmetic notebook and stamp sets, and one optional rewarded hint. Avoid randomized paid clues and paid solutions.

**Kill gates.** At least 65% of new players must solve the first case without moderator help. At least 70% of testers must rate the logic fair rather than guessy. Target D1 of 30%, D7 of 10%, and a compare/share action from at least 8% of finishers.

**Primary risk.** One ambiguous clue can damage trust more than a minor interface defect. Localization also changes logical meaning. The content pipeline must include versioned templates, human editorial review, locale-specific QA, and rapid correction.

### Rank 2 — Tidy Orbit

**Wedge.** Players sort tactile objects into bins, but rotating the tray changes gravity, so each movement reshapes the next decision. The result preserves the visual clarity of Sort and Block games while adding a strategic spatial rule.

**Why it can survive.** The action is legible in short video creative, which aligns with the recent growth of Sort, Screw, and Block formats.[5] A solver can reject impossible or trivial boards. Object sets and room themes offer inexpensive cosmetic refreshes.

**Minimum viable product.** Produce 50 hand-authored levels, 100 solver-validated candidates, three object themes, mastery medals, and a daily shared seed. Prototype the interaction in two dimensions before committing to complex physics or 3D art.

**Monetization.** Use one optional rewarded undo, ad removal, object skins, and room themes. Never interrupt a solve with an interstitial.

**Kill gates.** At least 70% should complete the first five levels. Target D1 of 27%, D7 of 9%, voluntary medal replay from 50% of players, and rewarded undo selection from 20% of eligible users without higher abandonment.

**Primary risk.** The market is crowded and easy to imitate. Gravity must be visible as a genuine strategic rule, not a decorative twist.

### Rank 3 — Relay Room

**Wedge.** Two players see different halves of a room and cooperate asynchronously. One interprets a clue; the other manipulates controls. Sharing is the game mechanic rather than a marketing layer.

**Why it can survive.** Partner streaks and rematches can create stronger social retention than generic leaderboards. Share codes avoid simultaneous matchmaking, and solo practice can reduce dependency on an available friend.

**Minimum viable product.** Build 12 paired rooms across circuits, pattern decoding, spatial rotation, and logic grids. Add invite links, asynchronous state, a solo fallback, notification controls, and privacy-conscious abuse reporting.

**Monetization.** Offer premium cooperative campaigns, room themes, partner emotes, profile frames, and an optional rewarded clue. Do not place an ad between one partner's message and the other's action.

**Kill gates.** At least 35% of invite recipients must activate a shared room. At least 60% of activated pairs must finish two rooms in the first session. Target day-7 pair retention of 15% and a median time under 60 seconds from invite open to meaningful action.

**Primary risk.** Cold start and state reliability can make an otherwise good puzzle appear broken. This concept should not proceed unless the team can support a small backend and reliable deep links.

### Rank 4 — Thread the Wild

**Wedge.** Players draw one continuous route through constrained nodes to deliver light and water to a living diorama. The emotional payoff is growth of a calm biome rather than a conventional score panel.

**Why it can survive.** Graph puzzles support a formal generator with solution and uniqueness checks. Biomes provide strong visual variation without rewriting rules. A garden meta can convert abstract mastery into a persistent collection.

**Minimum viable product.** Create 20 curated levels and 100 generated candidates across color gates, bridges, and obstacle rules. Include one interactive garden, a daily route, and ghost-path comparison.

**Monetization.** Sell premium biome chapters, decorative garden objects, and ad removal. Offer one optional rewarded reveal per puzzle.

**Kill gates.** At least 85% of generated candidates must pass solver and uniqueness checks, and at least 60% must be judged interesting by humans. Target D1 of 28%, D7 of 10%, and garden entry by 40% of first-session players.

**Primary risk.** Procedural validity is not the same as interest. The garden can also become busywork. Advancement must reveal meaningful rule combinations, not merely require currency accumulation.

### Rank 5 — Iconic: Rulebook

**Wedge.** Players infer hidden rules from rows of icons using count, symmetry, rotation, adjacency, and transformation. A worked example replaces text-heavy tutorial content, supporting international discovery.

**Why it can survive.** A formal rule grammar can generate and validate a large library at low localization cost. A personal rulebook and mastery tiers provide collection and progression without heavy narrative production.

**Minimum viable product.** Build 100 puzzles across eight rule families, an ambiguity checker, a color-blind-safe palette, and both text and worked-example onboarding variants. Test in at least three culturally distinct regions.

**Monetization.** Sell premium rule-family packs, cosmetic rulebook covers, frames, and ad removal. Offer one optional rewarded reveal.

**Kill gates.** At least 80% of testers should identify the intended rule in the first five puzzles without translation. At least 90% of generated puzzles must have one validated intended solution. Target D1 of 27%, D7 of 9%, and voluntary harder-variation attempts from 50% of players.

**Primary risk.** Icons are not culturally universal. Multiple plausible rules, color dependence, or unclear symbols can make a technically correct puzzle feel arbitrary.

## 9. Final recommendation

The rational objective is not to maximize the number of features shipped. It is to maximize the probability that the studio reaches a truthful go/no-go decision before runway is consumed.

For the current project, the next move is a **closed technical and product validation**, not a global launch. Fix economy replay farming, reward verification, banner placement, and daily rollover. Install the event and ledger model. Recenter the experience on one daily promise. Test the existing calm word-search proposition against a mystery-framed variant. Keep monetization stable and restrained while retention is measured.

If the stronger proposition reaches at least 30% day-1, 10% day-7, and a credible path toward 5% day-30 retention, the team can test paid acquisition against a conservative lifetime-value model. If not, preserve the infrastructure and pivot. Among the proposed alternatives, **Casebook: Contradiction** offers the best balance of distinctiveness, content leverage, shareability, and small-team feasibility. Tidy Orbit is the best performance-marketing alternative, while Relay Room is the highest-upside social bet for a team willing to accept backend risk.

The market is large enough to reward a small entrant, but only if the product earns a specific habit. **Survival will come from a clear mechanic, fair content, retained cohorts, and a trustworthy value exchange—not from category size, raw session length, or additional ad inventory.**

## References

[1]: https://sensortower.com/state-of-mobile-2025 "State of Mobile 2025 — Sensor Tower"
[2]: https://www.adjust.com/blog/puzzle-games-trends-strategies/ "Puzzle games: UA and monetization trends and strategies — Adjust"
[3]: https://appmagic.rocks/research/casual-report-h1-2025 "Casual Games Report H1 2025 — AppMagic"
[4]: https://appmagic.rocks/blog/puzzles-in-2026 "Casual Puzzles in 2026 — AppMagic"
[5]: https://naavik.co/digest/how-niche-subgenres-are-reshaping-the-mobile-puzzle-market/ "How Niche Subgenres Are Reshaping the Mobile Puzzle Market — Naavik"
[6]: https://business.mistplay.com/resources/puzzle-game-trends "Fitting the Pieces: Decoding Trends and Behaviors of Modern Puzzle Gamers — Mistplay"
[7]: https://www.businessofapps.com/data/top-grossing-games/ "Top Grossing Games 2025 — Business of Apps"
[8]: https://unity.com/blog/2025-mobile-gaming-trends-industry-perspectives "2025 Mobile Gaming Trends: Industry Perspectives — Unity"
[9]: https://help.nytimes.com/360011158491-New-York-Times-Games/24611727334932-Wordle "Wordle — The New York Times Games Help"
[10]: https://help.nytimes.com/360011158491-New-York-Times-Games/28525912587924-Connections "Connections — The New York Times Games Help"
[11]: https://www.nytimes.com/puzzles/spelling-bee "Spelling Bee — The New York Times Games"
[12]: https://play.google.com/store/apps/details?id=com.peoplefun.wordcross&hl=en_US "Wordscapes — Google Play"
[13]: https://play.google.com/store/apps/details?id=com.bitmango.go.wordcookies&hl=en_US "Word Cookies! — Google Play"
[14]: https://apps.apple.com/us/app/word-cookies/id1153883316 "Word Cookies! — Apple App Store"
[15]: https://www.maginteractive.com/games/ruzzle/ "Ruzzle — MAG Interactive"
[16]: https://developer.apple.com/app-store/review/guidelines/ "App Review Guidelines — Apple Developer"
[17]: https://www.businessofapps.com/data/puzzle-games-market/ "Puzzle Games Revenue and Usage Statistics — Business of Apps"
[18]: https://support.google.com/admob/answer/10564477?hl=en-GB "About App Readiness — Google AdMob Help"
[19]: https://developers.google.com/admob/android/test-ads "Enable Test Ads — Google for Developers"
[20]: https://www.adjust.com/blog/att-opt-in-rates-2025/ "ATT Opt-in Rates: Latest Benchmarks — Adjust"
