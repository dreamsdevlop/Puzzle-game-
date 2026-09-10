import { useEffect, useState } from 'react';
import { Category, GameMode, Screen } from './types.ts';
import { CATEGORIES } from './data/categories.ts';
import { setAudioEnabled } from './utils/audio.ts';
import { Storage } from './utils/storage.ts';
import { AdModal } from './components/AdModal.tsx';
import { BannerAd } from './components/BannerAd.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { CategorySelectScreen } from './components/CategorySelectScreen.tsx';
import { ModeSelectScreen } from './components/ModeSelectScreen.tsx';
import { GameScreen } from './components/GameScreen.tsx';
import { ResultsScreen } from './components/ResultsScreen.tsx';

export default function App() {
  // Navigation & Screen state
  const [screen, setScreen] = useState<Screen>('home');

  // Persistence State
  const [coins, setCoins] = useState(() => Storage.getCoins());
  const [completedLevels, setCompletedLevels] = useState<string[]>(() =>
    Storage.getCompletedLevels(),
  );
  const [soundEnabled, setSoundEnabledState] = useState(() =>
    Storage.getSoundEnabled(),
  );

  // Gameplay configuration
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

  // Sync initial sound state
  useEffect(() => {
    setAudioEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleToggleSound = () => {
    const updated = !soundEnabled;
    setSoundEnabledState(updated);
    setAudioEnabled(updated);
    Storage.setSoundEnabled(updated);
  };

  // Navigations
  const handleGoToCategorySelect = () => {
    setScreen('category_select');
  };

  const handleSelectCategory = (category: Category) => {
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
  }) => {
    // Earn +50 coins per completed level
    const updatedCoins = Storage.addCoins(50);
    setCoins(updatedCoins);

    // Unlock next level by saving completed level ID
    const updatedLevels = Storage.markLevelCompleted(selectedCategory.id);
    setCompletedLevels(updatedLevels);

    setResultsData({
      ...data,
      coinsEarned: 50,
    });
    setScreen('results');

    // Check interstitial frequency cap
    // "show every 2nd eligible trigger, minimum 60-second interval"
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

  const handleNextLevel = (nextCat: Category) => {
    setSelectedCategory(nextCat);
    setScreen('mode_select');
  };

  const handleGoHome = () => {
    setScreen('home');
  };

  return (
    <main
      id="app-root"
      className="min-h-screen bg-[#f0f0f3] text-[#1a1a1a] flex flex-col font-sans transition-colors"
    >
      {/* Active Screen Component */}
      {screen === 'home' && (
        <HomeScreen
          coins={coins}
          completedCount={completedLevels.length}
          totalCategories={CATEGORIES.length}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onPlayClick={handleGoToCategorySelect}
        />
      )}

      {screen === 'category_select' && (
        <CategorySelectScreen
          coins={coins}
          completedLevels={completedLevels}
          onSelectCategory={handleSelectCategory}
          onBack={handleGoHome}
        />
      )}

      {screen === 'mode_select' && (
        <ModeSelectScreen
          category={selectedCategory}
          onSelectMode={handleSelectMode}
          onBack={handleGoToCategorySelect}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          category={selectedCategory}
          mode={selectedMode}
          coins={coins}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onLevelComplete={handleLevelComplete}
          onBack={handleGoToCategorySelect}
          onRequestRewardedAd={handleRequestRewardedAd}
        />
      )}

      {screen === 'results' && resultsData && (
        <ResultsScreen
          category={selectedCategory}
          mode={selectedMode}
          score={resultsData.score}
          timeTakenSeconds={resultsData.timeTakenSeconds}
          bonusWords={resultsData.bonusWords}
          timeLeftSeconds={resultsData.timeLeftSeconds}
          coinsEarned={resultsData.coinsEarned}
          totalCoins={coins}
          onPlayAgain={handlePlayAgain}
          onNextLevel={handleNextLevel}
          onHome={handleGoHome}
        />
      )}

      {/* AdMob Persistent Banner Ad */}
      <BannerAd />

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
    </main>
  );
}
