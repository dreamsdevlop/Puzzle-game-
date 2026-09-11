import { useEffect, useMemo, useState } from 'react';
import { Category, CustomizationState, DailyChallengeDef, DailyStreakInfo, GameMode, LevelDef, LevelStarRecord, Screen, Theme } from './types.ts';
import { CATEGORIES } from './data/categories.ts';
import { calculateBrainRank, getLevelDef } from './data/levels.ts';
import { getTileThemeById, getWallpaperById } from './data/shopThemes.ts';
import { initAudioSettings, setAudioEnabled } from './utils/audio.ts';
import { getDailyChallengeForDate, getTodayDateKey } from './utils/dailyChallenge.ts';
import { MusicEngine } from './utils/musicEngine.ts';
import { Storage } from './utils/storage.ts';
import { AdMobManager } from './utils/admob.ts';
import { AdModal } from './components/AdModal.tsx';
import { BannerAd } from './components/BannerAd.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { LevelJourneyScreen } from './components/LevelJourneyScreen.tsx';
import { CategorySelectScreen } from './components/CategorySelectScreen.tsx';
import { ModeSelectScreen } from './components/ModeSelectScreen.tsx';
import { GameScreen } from './components/GameScreen.tsx';
import { ResultsScreen } from './components/ResultsScreen.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { ThemeShopModal } from './components/ThemeShopModal.tsx';

export default function App() {
  // Navigation & Screen state
  const [screen, setScreen] = useState<Screen>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // Customization & Shop state
  const [customization, setCustomization] = useState<CustomizationState>(() =>
    Storage.getCustomizationState(),
  );

  // Today's Daily Challenge Definition & Streak State
  const todayKey = useMemo(() => getTodayDateKey(), []);
  const todayChallenge = useMemo(() => getDailyChallengeForDate(new Date()), []);
  const [dailyStreak, setDailyStreak] = useState<DailyStreakInfo>(() =>
    Storage.getDailyStreak(getTodayDateKey()),
  );
  const [activeDailyChallenge, setActiveDailyChallenge] = useState<DailyChallengeDef | null>(null);

  // Persistence State
  const [coins, setCoins] = useState(() => Storage.getCoins());
  const [completedLevels, setCompletedLevels] = useState<string[]>(() =>
    Storage.getCompletedLevels(),
  );
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelStarRecord>>(() =>
    Storage.getLevelProgress(),
  );
  const [claimedMilestones, setClaimedMilestones] = useState<number[]>(() =>
    Storage.getClaimedMilestones(),
  );
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(() =>
    Storage.getHighestUnlockedLevel(),
  );
  const [soundEnabled, setSoundEnabledState] = useState(() =>
    Storage.getSoundEnabled(),
  );
  const [theme, setThemeState] = useState<Theme>(() => Storage.getTheme());

  // Gameplay configuration
  const [currentLevel, setCurrentLevel] = useState<LevelDef | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    CATEGORIES[0],
  );
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');

  // Results State
  const [resultsData, setResultsData] = useState<{
    score: number;
    timeTakenSeconds: number;
    bonusWords: string[];
    timeLeftSeconds: number;
    coinsEarned: number;
    stars: number;
  } | null>(null);

  // AdMob Modal State
  const [adModal, setAdModal] = useState<{
    isOpen: boolean;
    type: 'interstitial' | 'rewarded';
    onReward?: () => void;
    onCloseCallback?: () => void;
  }>({
    isOpen: false,
    type: 'interstitial',
  });

  // Calculate brain stats dynamically
  const completedLevelCount = Object.keys(levelProgress).length;
  const totalStars: number = (Object.values(levelProgress) as LevelStarRecord[]).reduce(
    (acc: number, curr: LevelStarRecord) => acc + (curr?.stars || 0),
    0,
  );
  const brainRank = calculateBrainRank(completedLevelCount, totalStars);

  // Active Wallpaper & Tile Theme definitions based on equipped shop items
  const activeWallpaper = useMemo(
    () => getWallpaperById(customization.equippedWallpaperId),
    [customization.equippedWallpaperId],
  );
  const activeTileTheme = useMemo(
    () => getTileThemeById(customization.equippedTileThemeId),
    [customization.equippedTileThemeId],
  );

  // Initialize audio settings & handle music autoplay unlocking on first user gesture
  useEffect(() => {
    initAudioSettings();

    const handleFirstGesture = () => {
      MusicEngine.unlockContext();
      if (Storage.getMusicEnabled()) {
        MusicEngine.start();
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    void AdMobManager.initialize();
  }, []);

  // Sync initial sound state
  useEffect(() => {
    setAudioEnabled(soundEnabled);
  }, [soundEnabled]);

  // Sync theme with HTML document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Storage.setTheme(theme);
  }, [theme]);

  const handleToggleSound = () => {
    const updated = !soundEnabled;
    setSoundEnabledState(updated);
    setAudioEnabled(updated);
    Storage.setSoundEnabled(updated);
  };

  const handleToggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigations
  const handleGoToLevelJourney = () => {
    setActiveDailyChallenge(null);
    setScreen('level_map');
  };

  const handleGoToCategorySelect = () => {
    setCurrentLevel(null);
    setActiveDailyChallenge(null);
    setScreen('category_select');
  };

  const handlePlayDailyChallenge = () => {
    setCurrentLevel(null);
    setActiveDailyChallenge(todayChallenge);
    setSelectedMode('daily');
    setScreen('game');
  };

  const handleSelectLevel = (level: LevelDef) => {
    setActiveDailyChallenge(null);
    setCurrentLevel(level);
    setSelectedMode('classic');
    setScreen('game');
  };

  const handleClaimMilestone = (levelNumber: number, rewardCoins: number) => {
    const updatedClaimed = Storage.claimMilestone(levelNumber);
    setClaimedMilestones(updatedClaimed);
    const updatedCoins = Storage.addCoins(rewardCoins);
    setCoins(updatedCoins);
  };

  const handleSelectCategory = (category: Category) => {
    setActiveDailyChallenge(null);
    setCurrentLevel(null);
    setSelectedCategory(category);
    setScreen('mode_select');
  };

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    setScreen('game');
  };

  const handleLevelComplete = (data: {
    score: number;
    timeTakenSeconds: number;
    bonusWords: string[];
    timeLeftSeconds: number;
    stars: number;
  }) => {
    if (activeDailyChallenge) {
      // Daily Challenge completion
      // Determine stars based on time: <= 90s = 3 stars, <= 150s = 2 stars, else 1 star
      const earnedStars = data.timeTakenSeconds <= 90 ? 3 : data.timeTakenSeconds <= 150 ? 2 : 1;
      const { streak, isFirstToday, bonusCoins } = Storage.saveDailyCompletion({
        dateKey: activeDailyChallenge.dateKey,
        completed: true,
        score: data.score,
        timeTakenSeconds: data.timeTakenSeconds,
        stars: earnedStars,
        completedAt: Date.now(),
      });

      setCoins(Storage.getCoins());
      const updatedStreak = Storage.getDailyStreak(todayKey);
      setDailyStreak(updatedStreak);

      setResultsData({
        ...data,
        coinsEarned: bonusCoins > 0 ? bonusCoins : 50,
        stars: earnedStars,
      });
    } else if (currentLevel) {
      // Level mode completion
      const earnedStars = data.stars || 1;
      const { newStarsEarned } = Storage.saveLevelProgress(
        currentLevel.levelNumber,
        earnedStars,
        data.score,
        data.timeTakenSeconds,
      );

      const coinReward = currentLevel.coinReward + newStarsEarned * 10;
      const updatedCoins = Storage.addCoins(coinReward);
      setCoins(updatedCoins);

      setLevelProgress(Storage.getLevelProgress());
      setHighestUnlockedLevel(Storage.getHighestUnlockedLevel());

      setResultsData({
        ...data,
        coinsEarned: coinReward,
        stars: earnedStars,
      });
    } else {
      // Category mode completion
      const updatedCoins = Storage.addCoins(50);
      setCoins(updatedCoins);

      const updatedLevels = Storage.markLevelCompleted(selectedCategory.id);
      setCompletedLevels(updatedLevels);

      setResultsData({
        ...data,
        coinsEarned: 50,
        stars: 3,
      });
    }

    setScreen('results');

    // Check interstitial frequency cap
    if (Storage.shouldShowInterstitial()) {
      setTimeout(() => {
        setAdModal({
          isOpen: true,
          type: 'interstitial',
        });
      }, 700);
    }
  };

  const handleRequestRewardedAd = (onSuccess: () => void) => {
    setAdModal({
      isOpen: true,
      type: 'rewarded',
      onReward: onSuccess,
    });
  };

  const handlePlayAgain = () => {
    setScreen('game');
  };

  const handleNextLevel = (nextLevelOrCategory: LevelDef | Category) => {
    if ('levelNumber' in nextLevelOrCategory) {
      setCurrentLevel(nextLevelOrCategory);
      setScreen('game');
    } else {
      setCurrentLevel(null);
      setSelectedCategory(nextLevelOrCategory);
      setScreen('mode_select');
    }
  };

  const handleGoHome = () => {
    setActiveDailyChallenge(null);
    setScreen('home');
  };

  return (
    <main
      id="app-root"
      style={{
        background: theme === 'dark' ? activeWallpaper.backgroundCssDark : activeWallpaper.backgroundCssLight,
      }}
      className="min-h-screen text-[#1a1a1a] dark:text-slate-100 flex flex-col font-sans transition-colors relative"
    >
      {/* Active Screen Component */}
      {screen === 'home' && (
        <HomeScreen
          coins={coins}
          highestUnlockedLevel={highestUnlockedLevel}
          totalStars={totalStars}
          brainRankTitle={brainRank.rankTitle}
          completedCategoriesCount={completedLevels.length}
          totalCategories={CATEGORIES.length}
          dailyStreak={dailyStreak}
          todayChallenge={todayChallenge}
          soundEnabled={soundEnabled}
          theme={theme}
          onToggleSound={handleToggleSound}
          onToggleTheme={handleToggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
          onPlayLevelJourney={handleGoToLevelJourney}
          onPlayCategories={handleGoToCategorySelect}
          onPlayDailyChallenge={handlePlayDailyChallenge}
        />
      )}

      {screen === 'level_map' && (
        <LevelJourneyScreen
          coins={coins}
          levelProgress={levelProgress}
          claimedMilestones={claimedMilestones}
          highestUnlockedLevel={highestUnlockedLevel}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSelectLevel={handleSelectLevel}
          onClaimMilestone={handleClaimMilestone}
          onBack={handleGoHome}
          onSwitchToCategories={handleGoToCategorySelect}
          onOpenShop={() => setIsShopOpen(true)}
        />
      )}

      {screen === 'category_select' && (
        <CategorySelectScreen
          coins={coins}
          completedLevels={completedLevels}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSelectCategory={handleSelectCategory}
          onBack={handleGoHome}
        />
      )}

      {screen === 'mode_select' && (
        <ModeSelectScreen
          category={selectedCategory}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSelectMode={handleSelectMode}
          onBack={handleGoToCategorySelect}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          category={currentLevel || activeDailyChallenge ? undefined : selectedCategory}
          level={currentLevel || undefined}
          dailyChallenge={activeDailyChallenge || undefined}
          mode={selectedMode}
          coins={coins}
          soundEnabled={soundEnabled}
          theme={theme}
          tileTheme={activeTileTheme}
          onOpenShop={() => setIsShopOpen(true)}
          onToggleSound={handleToggleSound}
          onToggleTheme={handleToggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLevelComplete={handleLevelComplete}
          onBack={() => {
            if (activeDailyChallenge) {
              setScreen('home');
            } else if (currentLevel) {
              setScreen('level_map');
            } else {
              setScreen('category_select');
            }
          }}
          onRequestRewardedAd={handleRequestRewardedAd}
        />
      )}

      {screen === 'results' && resultsData && (
        <ResultsScreen
          category={currentLevel || activeDailyChallenge ? undefined : selectedCategory}
          level={currentLevel || undefined}
          dailyChallenge={activeDailyChallenge || undefined}
          dailyStreak={dailyStreak.currentStreak}
          stars={resultsData.stars}
          mode={selectedMode}
          score={resultsData.score}
          timeTakenSeconds={resultsData.timeTakenSeconds}
          bonusWords={resultsData.bonusWords}
          timeLeftSeconds={resultsData.timeLeftSeconds}
          coinsEarned={resultsData.coinsEarned}
          totalCoins={coins}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onPlayAgain={handlePlayAgain}
          onNextLevel={activeDailyChallenge ? undefined : handleNextLevel}
          onGoToLevelMap={activeDailyChallenge ? undefined : () => setScreen('level_map')}
          onHome={handleGoHome}
          onOpenShop={() => setIsShopOpen(true)}
          onRequestRewardedAd={(onSuccess) => {
            handleRequestRewardedAd(() => {
              const updatedCoins = Storage.addCoins(resultsData.coinsEarned);
              setCoins(updatedCoins);
              onSuccess();
            });
          }}
        />
      )}

      {/* Native AdMob banner; never cover the active puzzle board. */}
      <BannerAd visible={screen !== 'game'} />

      {/* AdMob Simulation Modal */}
      <AdModal
        type={adModal.type}
        isOpen={adModal.isOpen}
        onClose={() => {
          setAdModal((prev) => ({ ...prev, isOpen: false }));
          adModal.onCloseCallback?.();
        }}
        onRewardEarned={() => {
          adModal.onReward?.();
        }}
      />

      {/* Audio, Music, PWA & AdMob Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onClose={() => setIsSettingsOpen(false)}
        onOpenShop={() => {
          setIsSettingsOpen(false);
          setIsShopOpen(true);
        }}
      />

      {/* Theme & Wallpaper Customization Store Modal */}
      <ThemeShopModal
        isOpen={isShopOpen}
        theme={theme}
        coins={coins}
        onCoinsChange={(newCoins) => setCoins(newCoins)}
        onClose={() => setIsShopOpen(false)}
        customization={customization}
        onCustomizationChange={(updated) => setCustomization(updated)}
        onRequestRewardedAd={() => {
          handleRequestRewardedAd(() => {
            const newCoins = Storage.addCoins(25);
            setCoins(newCoins);
          });
        }}
      />
    </main>
  );
}
