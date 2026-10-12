# Word Quest: Brain Search — A-to-Z Retention और Growth Guide

**तैयार किया गया:** 12 October 2026
**गेम:** Word Quest: Brain Search
**Package:** `com.wordquest.puzzle`

यह guide आपके मौजूदा game के आधार पर बनाई गई है। अभी game में curated levels, difficulty tiers, daily challenge और streak, coins, hints, wallpapers/tile themes, rewarded ads, native AdMob banner और local progress storage मौजूद हैं। इसलिए अगला लक्ष्य केवल “और features जोड़ना” नहीं है। लक्ष्य है: खिलाड़ी को पहले session में value देना, अगले दिन वापस लाना, और ads को इस तरह रखना कि retention खराब न हो।

> **सबसे महत्वपूर्ण principle:** पहले retention, फिर ad revenue। अगर ad placement के कारण खिलाड़ी uninstall करता है, तो अधिक impressions भी business को नुकसान पहुँचाएँगे।

## 1. अभी आपके game की स्थिति

### जो चीजें पहले से अच्छी हैं

- Game में लगभग 40 curated levels और स्पष्ट difficulty progression है। Warm-Up से Pattern Hunter, Focus & Flow और कठिन tiers तक progression मौजूद है।
- Daily Challenge और streak system मौजूद है। यह habit बनाने का अच्छा आधार है।
- Coins, milestone rewards और shop में wallpapers तथा tile themes हैं। इससे gameplay के बाहर भी लक्ष्य मिलता है।
- Hints और rewarded ad flow मौजूद हैं। खिलाड़ी ad देखकर extra hints या coins प्राप्त कर सकता है।
- Android में native AdMob integration है और browser ad network को Android WebView से अलग रखा गया है।
- Progress local storage में save होता है, इसलिए basic offline play उपलब्ध है।

### सबसे बड़े retention risks

1. केवल fixed levels होने पर content जल्दी समाप्त लग सकता है।
2. “Brain perk” text यदि gameplay को वास्तव में प्रभावित नहीं करता, तो वह cosmetic promise जैसा महसूस हो सकता है।
3. Daily streak टूटने पर खिलाड़ी पूरी तरह छोड़ सकता है। Streak repair या grace day उपयोगी होगा।
4. Coins और shop मौजूद हैं, लेकिन खिलाड़ी को साफ दिखना चाहिए कि अगला meaningful unlock कौन-सा है।
5. Banner gameplay में अब नीचे दिखेगा। यह ठीक है, लेकिन grid या selection area को cover नहीं करना चाहिए।
6. Analytics के बिना यह पता नहीं चलेगा कि खिलाड़ी किस level पर quit कर रहे हैं और किस ad placement से retention घट रही है।

## 2. Retention का सही लक्ष्य

Retention का अर्थ केवल install नहीं है। आपको यह मापना है कि install करने के बाद कितने लोग वापस आते हैं।

### मुख्य metrics

- **D1 retention:** install के अगले दिन लौटने वाले खिलाड़ी।
- **D7 retention:** सातवें दिन लौटने वाले खिलाड़ी।
- **D30 retention:** तीसवें दिन लौटने वाले खिलाड़ी।
- **First-session completion:** कितने नए खिलाड़ी पहला puzzle पूरा करते हैं।
- **Levels per session:** एक session में औसत completed levels।
- **Daily challenge participation:** कितने active users daily challenge शुरू करते हैं।
- **Streak continuation:** कितने users अगली तारीख को streak जारी रखते हैं।
- **Hint conversion:** कितने users hint इस्तेमाल करते हैं और उसके बाद puzzle पूरा करते हैं।
- **Rewarded opt-in rate:** कितने users अपनी इच्छा से rewarded ad देखते हैं।
- **Ad-related exit rate:** ad दिखने के तुरंत बाद कितने users app छोड़ते हैं।
- **Crash-free users और ANR rate:** technical quality के लिए।

Google Play Android Vitals में crash rate, ANR rate, memory और performance metrics दिखाता है। Core vitals Play visibility को प्रभावित कर सकते हैं, इसलिए release के बाद इसे साप्ताहिक देखें। [1]

## 3. पहले 60 seconds का अनुभव

नए player को game खोलने के बाद बहुत कम friction मिलना चाहिए। Recommended flow:

1. Branded splash screen।
2. Home screen पर तुरंत स्पष्ट button: **Play First Puzzle**।
3. पहला puzzle 6×6 grid, तीन या चार छोटे words और केवल horizontal/vertical directions।
4. पहली बार एक छोटा visual hint: “Tap and drag across a word.”
5. Puzzle पूरा होने पर coins, stars और छोटा celebration।
6. Result screen पर तीन choices:
   - Next puzzle
   - Daily challenge
   - Customize theme

पहले puzzle से पहले interstitial या forced video न दिखाएँ। Player को पहले game का core fun अनुभव करने दें।

## 4. Difficulty design

### Recommended progression

- **Levels 1–5:** 6×6 या 7×7, 3–5 words, केवल right/down। 90% से अधिक नए users को पहला level पूरा होना चाहिए।
- **Levels 6–12:** 7×7 या 8×8, diagonals introduce करें। एक समय में केवल एक नया mechanic जोड़ें।
- **Levels 13–20:** reverse directions, अधिक words और थोड़ा कम target time।
- **Levels 21–30:** 8×8 या 9×9, longer words और mixed directions।
- **Levels 31–40:** advanced challenge, लेकिन frustration से बचने के लिए optional hints उपलब्ध रहें।

हर 3–4 कठिन levels के बाद एक **confidence level** रखें। यह level थोड़ा आसान हो और player को mastery का अनुभव दे। लगातार कठिनाई बढ़ाना burnout पैदा करता है।

### Difficulty को score से balance करें

हर level के लिए इन metrics को record करें:

- Completion rate
- Average completion time
- Hint usage
- Fail/retry count
- Quit-before-completion rate
- Rewarded-ad request rate

यदि किसी level का completion rate पिछले level से अचानक बहुत नीचे गिरता है, तो उसे कठिनाई spike मानें। उस level में grid छोटा करें, words कम करें या target time बढ़ाएँ।

### केवल grid size न बढ़ाएँ

Difficulty के चार अलग levers रखें:

- Grid size
- Word length
- Direction count
- Distractor density

एक ही level में चारों को एक साथ न बढ़ाएँ। Player को समझ में आना चाहिए कि चुनौती किस कारण बढ़ी है।

## 5. Daily habit system

Daily Challenge को game का सबसे मजबूत retention loop बनाइए।

### Daily challenge structure

हर दिन:

- नया theme
- नया seed, ताकि सभी players को एक ही puzzle मिले
- 1–3 minute target
- तीन stars
- streak bonus
- daily leaderboard या personal best

### Streak को forgiving बनाइए

- सात दिन लगातार: special tile theme
- चौदह दिन: wallpaper
- तीस दिन: premium-looking badge
- महीने में एक **streak freeze** free दें
- Streak टूटने पर पूरी progress delete न करें; best streak दिखाते रहें

### Reminder strategy

यदि आप Firebase Cloud Messaging या Play notifications बाद में जोड़ते हैं, तो केवल helpful reminder भेजें:

> “आज का Word Quest challenge आपका इंतज़ार कर रहा है।”

हर दिन aggressive notifications न भेजें। Notification बंद करने वाला user आसानी से churn कर सकता है।

## 6. Progression और rewards

Coins केवल number न रहें। उनका स्पष्ट उपयोग होना चाहिए।

### Coin economy

- Level completion: छोटा fixed reward
- Three-star completion: bonus
- Daily challenge: larger reward
- Streak milestone: special reward
- First-time achievement: one-time reward
- Replay improvement: small bonus, unlimited farming नहीं

### Shop में तीन प्रकार के items

1. **Cosmetic:** wallpapers, tile themes, grid accents।
2. **Convenience:** hint packs, लेकिन puzzle को paywall न बनाएं।
3. **Prestige:** badges, streak frames, completion titles।

Player को home screen पर एक visible next goal दें:

> “65 coins और earn करें ताकि Ocean Tiles unlock हो जाए।”

यह goal player को अगले session का कारण देता है।

## 7. Hints का बेहतर design

अभी hints को तीन layers में रखें:

- **Soft hint:** एक word के first letter को highlight करे।
- **Directional hint:** word की direction दिखाए।
- **Reveal hint:** word का पूरा path दिखाए।

हर hint का cost अलग रखें। Player को छोटे और बड़े trade-off दिखें। Rewarded ad केवल optional “+2 hints” या “double reward” के लिए रखें। Ad देखने से puzzle अपने-आप पूरा न हो; player को अभी भी solve करने दें।

Google AdMob rewarded ads को user-choice और natural break पर दिखाने की सलाह देता है। Active puzzle के critical moment में forced video न दिखाएँ। [4]

## 8. Ads की recommended strategy

### Banner

आपके version 4 में Android पर एक adaptive bottom banner gameplay के दौरान भी सक्षम है। Recommended rules:

- एक समय में केवल एक banner।
- Bottom position।
- Grid और word list से अलग reserved bottom space।
- Settings और Shop में hide।
- Banner को clickable game control जैसा न बनाएं।
- App launch पर तुरंत fullscreen ad न दिखाएं।

Gameplay banner को रखें, लेकिन यदि analytics दिखाए कि active puzzle में quit rate बढ़ रहा है, तो A/B test करें: gameplay में banner बनाम केवल result/menu में banner। निर्णय impressions से नहीं, D1/D7 retention और session length से लें।

### Rewarded ads

Best placements:

- Player ने hint button दबाया और hints समाप्त हैं।
- Results screen पर “Double coins”।
- Shop में “Earn coins”।
- Daily challenge fail होने पर optional second attempt, सीमित frequency के साथ।

Reward पहले स्पष्ट दिखाएँ:

> “Watch a short ad to receive +2 hints.”

Rewarded ad को automatically launch न करें।

### Interstitials

Word puzzle में interstitial केवल natural transition पर रखें:

- हर completed level पर नहीं।
- कम से कम दो या तीन levels के बाद।
- एक session में hard cap रखें।
- First session में delay रखें।
- Active word selection के दौरान कभी नहीं।

आपके source में interstitial state के लिए 60-second minimum interval मौजूद है। इसे वास्तविक analytics से validate करें और frustration बढ़े तो interval और बढ़ाएँ।

## 9. High-paying ads का वास्तविक तरीका

कोई code setting यह guarantee नहीं कर सकती कि हर impression high-paying होगा। eCPM country, demand, user context, format और auction पर निर्भर करता है।

AdMob Mediation कई ad sources को एक ही request में compete करने देता है, जिससे fill rate और monetization बेहतर हो सकती है। Google के अनुसार mediation के लिए ad format पहले app में integrated होना चाहिए और consent/privacy configuration mediation partners के साथ align करनी होती है। [2]

Recommended order:

1. पहले native AdMob banner और rewarded ads को stable करें।
2. AdMob में app readiness और policy status clear करें।
3. Banner mediation group बनाएं।
4. केवल reputable, policy-compliant bidding partners जोड़ें।
5. Partner SDKs और adapters की compatibility check करें।
6. Third-party ad source dashboards में banner refresh बंद रखें ताकि double refresh न हो। [2]
7. eCPM, fill rate, ARPDAU और retention साथ-साथ देखें।

High eCPM के लिए aggressive ads जोड़ना जरूरी नहीं है। High-value users और long sessions अधिक important हैं।

## 10. Analytics: सबसे जरूरी अगला technical improvement

अभी local storage progress के लिए ठीक है, लेकिन business decisions के लिए analytics जोड़ना चाहिए। Firebase Analytics Android पर free measurement देता है और custom events तथा audiences support करता है। [3]

### Minimum event list

```text
app_first_open
session_start
onboarding_complete
level_start
level_complete
level_failed
level_quit
hint_used
hint_out_of_stock
rewarded_offer_shown
rewarded_started
rewarded_completed
banner_loaded
banner_failed
interstitial_shown
ad_reward_granted
daily_challenge_start
daily_challenge_complete
streak_extended
streak_lost
shop_opened
item_purchased
item_equipped
```

### Event parameters

हर level event के साथ:

```text
level_number
stage
theme
grid_size
word_count
time_seconds
stars
hints_used
is_daily_challenge
```

हर ad event के साथ:

```text
ad_format
placement
screen
reward_type
```

इन events से आपको पता चलेगा कि level 18 कठिन है, daily challenge valuable है, या gameplay banner users को छोड़ने पर मजबूर कर रहा है।

## 11. Remote tuning

अगले चरण में Firebase Remote Config या equivalent configuration layer जोड़ें ताकि हर छोटे balance change के लिए नया AAB न बनाना पड़े। Remotely configurable values:

- Daily reward amounts
- Hint price
- Coin rewards
- Interstitial cooldown
- Rewarded ad reward
- Target seconds
- Banner enabled on gameplay
- Event difficulty

पहले default safe values रखें। Remote config failure पर local defaults से game चलना चाहिए।

## 12. A/B testing plan

एक समय में केवल एक चीज test करें।

### Test A: gameplay banner

- A: banner केवल menu/results पर
- B: banner gameplay में भी

Measure:

- D1 retention
- Average session length
- Puzzle completion rate
- Banner impressions per DAU
- Revenue per DAU

### Test B: daily reward

- A: fixed 50 coins
- B: escalating 20/30/40/60/100 coins

Measure streak continuation और week-1 return rate।

### Test C: rewarded reward

- A: +2 hints
- B: double level coins

Measure opt-in rate और next-session return rate।

जो variant अधिक revenue दे लेकिन D7 retention बहुत गिरा दे, उसे winner न मानें।

## 13. Performance और quality checklist

हर release से पहले:

- Low-end Android phone पर startup test।
- Offline mode test।
- App background में भेजकर वापस खोलें।
- Screen rotation और different aspect ratios test करें।
- Banner के नीचे navigation buttons छिप तो नहीं रहे, देखें।
- Consent form unavailable होने पर game playable रहे।
- Ad unavailable होने पर reward गलत तरीके से grant न हो।
- Reward केवल completed rewarded callback के बाद दें।
- Shop purchase duplicate न हो।
- Daily streak date/time boundary test करें।
- Crash और ANR Play Console में देखें।

Android Vitals की official overall bad-behavior thresholds में user-perceived crash rate 1.09% और ANR rate 0.47% दिए गए हैं। इनसे नीचे रहना visibility के लिए बेहतर है; लक्ष्य केवल threshold के नीचे रहना नहीं, बल्कि जितना संभव हो उतना stable रहना है। [1]

## 14. Play Store conversion improvement

Store listing में promise वही रखें जो game में है।

### Short description

```text
Find hidden words, sharpen your mind, and complete relaxing daily puzzles.
```

### Screenshots order

1. Main puzzle board
2. Daily challenge and streak
3. Level map and progression
4. Themes/shop
5. Results and rewards

### Store listing experiments

एक समय में icon, first screenshot या short description में से एक चीज test करें। Install conversion बढ़े लेकिन D1 retention न गिरे, तभी change रखें।

## 15. Community और organic growth

हर सप्ताह short videos बनाएं:

- “Can you find all 5 words in 30 seconds?”
- “Daily Word Quest challenge”
- “Easy vs Master puzzle”
- “Find the hidden diagonal word”
- “Unlocking a new tile theme”

Video में पहले 1–2 seconds में puzzle दिखाएँ। लंबा intro न रखें। Play Store link और clear call-to-action जोड़ें। Paid ads तब शुरू करें जब organic users का retention और store conversion समझ में आ जाए।

## 16. 90-day execution roadmap

### Days 1–7: measurement और bug safety

- Firebase Analytics या equivalent event tracking जोड़ें।
- Play Console Android Vitals daily देखें।
- Version 4 का gameplay banner real Play install पर test करें।
- सभी ad placements और consent paths test करें।
- Critical crash और ANR fix करें।

### Days 8–21: first-session improvement

- First puzzle tutorial polish करें।
- First completion celebration बढ़ाएँ।
- Next puzzle CTA स्पष्ट करें।
- First session में forced interstitial रोकें।
- तीन onboarding events मापें।

### Days 22–45: retention loops

- Daily challenge reward ladder।
- Streak freeze।
- Weekly challenge।
- Personal best और improvement message।
- Level milestone badges।

### Days 46–65: economy और content

- New levels batch।
- Shop unlock roadmap।
- Three hint tiers।
- Cosmetic collections।
- Coin economy review।

### Days 66–80: monetization optimization

- Banner placement A/B test।
- Rewarded reward A/B test।
- AdMob mediation test।
- Sensitive categories और privacy settings review।
- eCPM के साथ D7 retention compare करें।

### Days 81–90: marketing launch

- Store listing experiment।
- 10–20 short gameplay videos।
- Small paid acquisition test।
- Best-performing country/channel पहचानें।
- केवल अच्छे retention वाले traffic पर budget बढ़ाएँ।

## 17. Weekly dashboard

हर सप्ताह केवल ये numbers लिखें:

```text
New installs
D1 retention
D7 retention
D30 retention
Average session length
Levels per session
Daily challenge completion
Rewarded opt-in rate
Banner impressions per DAU
eCPM
Revenue per DAU
Crash-free users
ANR rate
Average rating
```

फिर तीन questions पूछें:

1. इस सप्ताह players कहाँ छोड़ रहे हैं?
2. कौन-सा reward उन्हें वापस ला रहा है?
3. कौन-सा ad placement revenue बढ़ा रहा है बिना retention घटाए?

## 18. Priority order

यदि budget और development time सीमित है, तो इसी क्रम में काम करें:

1. Crash, ANR और ad bugs।
2. First-session tutorial और first win।
3. Analytics events।
4. Daily challenge और streak repair।
5. More quality levels।
6. Economy और cosmetics।
7. Rewarded ad tuning।
8. Mediation।
9. Store listing experiments।
10. Paid marketing।

## 19. Final success definition

Word Quest को successful तब मानें जब:

- New users first puzzle पूरा करें।
- Players बिना forced ads के दूसरा puzzle शुरू करें।
- Daily challenge पर वापसी हो।
- Streak और cosmetics उन्हें meaningful goal दें।
- Banner से revenue मिले, लेकिन active puzzle completion न गिरे।
- Rewarded ads voluntary हों और reward स्पष्ट हो।
- Play Console में stable vitals रहें।
- Store rating genuine और लगातार अच्छी हो।

Ads setup हो जाना monetization की शुरुआत है, सफलता का प्रमाण नहीं। सफलता तब होगी जब **retention, completion, reviews, technical quality और revenue** साथ में improve हों।

## References

[1]: https://developer.android.com/google/play/vitals "Android Developers: Android Vitals"

[2]: https://developers.google.com/admob/android/mediation "Google AdMob: Set up mediation on Android"

[3]: https://firebase.google.com/docs/analytics "Firebase: Google Analytics documentation"

[4]: https://admob.google.com/home/resources/best-practices-for-in-app-rewarded-video-ads/ "Google AdMob: Best practices for rewarded video ads"
