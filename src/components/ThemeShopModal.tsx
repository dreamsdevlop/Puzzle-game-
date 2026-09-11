import { useState } from 'react';
import {
  Check,
  Coins,
  Crown,
  Film,
  Flame,
  Layers,
  Palette,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import {
  CustomizationState,
  GameWallpaper,
  ShopTab,
  Theme,
  TileTheme,
} from '../types.ts';
import {
  getTileThemeById,
  getWallpaperById,
  TILE_THEMES,
  WALLPAPERS,
} from '../data/shopThemes.ts';
import { playBonusWordSparkle, playButtonTap, playSatisfyingClick } from '../utils/audio.ts';
import { Storage } from '../utils/storage.ts';

interface ThemeShopModalProps {
  isOpen: boolean;
  theme: Theme;
  coins: number;
  customization: CustomizationState;
  onClose: () => void;
  onCustomizationChange: (updated: CustomizationState) => void;
  onCoinsChange: (newCoins: number) => void;
  onRequestRewardedAd?: () => void;
}

export function ThemeShopModal({
  isOpen,
  theme,
  coins,
  customization,
  onClose,
  onCustomizationChange,
  onCoinsChange,
  onRequestRewardedAd,
}: ThemeShopModalProps) {
  const [activeTab, setActiveTab] = useState<ShopTab>('wallpapers');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'mythic' | 'standard'>('all');
  const [purchaseSuccessToast, setPurchaseSuccessToast] = useState<string | null>(null);
  const [insufficientFundsError, setInsufficientFundsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentWallpaper = getWallpaperById(customization.equippedWallpaperId);
  const currentTileTheme = getTileThemeById(customization.equippedTileThemeId);

  const handleWatchAdForTheme = (itemName: string) => {
    if (onRequestRewardedAd) {
      playSatisfyingClick();
      onRequestRewardedAd();
      showToast(`🎬 Sponsored ad triggered! Complete it for +25 coins towards "${itemName}"!`);
    }
  };

  const handleBuyOrEquipWallpaper = (wallpaper: GameWallpaper) => {
    playSatisfyingClick();
    const isOwned = customization.purchasedWallpaperIds.includes(wallpaper.id) || wallpaper.price === 0;

    if (isOwned) {
      Storage.equipWallpaper(wallpaper.id);
      const updated = Storage.getCustomizationState();
      onCustomizationChange(updated);
      showToast(`Equipped "${wallpaper.name}" Wallpaper!`);
      return;
    }

    // Purchase check
    if (coins < wallpaper.price) {
      playButtonTap();
      setInsufficientFundsError(
        `Need ${wallpaper.price - coins} more coins for ${wallpaper.name}! Watch an ad or solve levels to earn coins.`,
      );
      setTimeout(() => setInsufficientFundsError(null), 4000);
      return;
    }

    const result = Storage.buyWallpaper(wallpaper.id, wallpaper.price);
    if (result.success) {
      playBonusWordSparkle();
      onCoinsChange(result.newCoins);
      const updated = Storage.getCustomizationState();
      onCustomizationChange(updated);
      showToast(`🎉 Unlocked & Equipped "${wallpaper.name}"!`);
    } else if (result.error) {
      setInsufficientFundsError(result.error);
      setTimeout(() => setInsufficientFundsError(null), 3500);
    }
  };

  const handleBuyOrEquipTileTheme = (tileTheme: TileTheme) => {
    playSatisfyingClick();
    const isOwned = customization.purchasedTileThemeIds.includes(tileTheme.id) || tileTheme.price === 0;

    if (isOwned) {
      Storage.equipTileTheme(tileTheme.id);
      const updated = Storage.getCustomizationState();
      onCustomizationChange(updated);
      showToast(`Equipped "${tileTheme.name}" Board Tiles!`);
      return;
    }

    // Purchase check
    if (coins < tileTheme.price) {
      playButtonTap();
      setInsufficientFundsError(
        `Need ${tileTheme.price - coins} more coins for ${tileTheme.name}! Watch an ad or solve levels to earn coins.`,
      );
      setTimeout(() => setInsufficientFundsError(null), 4000);
      return;
    }

    const result = Storage.buyTileTheme(tileTheme.id, tileTheme.price);
    if (result.success) {
      playBonusWordSparkle();
      onCoinsChange(result.newCoins);
      const updated = Storage.getCustomizationState();
      onCustomizationChange(updated);
      showToast(`🎉 Unlocked & Equipped "${tileTheme.name}" Tiles!`);
    } else if (result.error) {
      setInsufficientFundsError(result.error);
      setTimeout(() => setInsufficientFundsError(null), 3500);
    }
  };

  const showToast = (message: string) => {
    setPurchaseSuccessToast(message);
    setTimeout(() => setPurchaseSuccessToast(null), 3000);
  };

  // Sample mini grid for real-time live preview
  const previewLetters = [
    ['W', 'O', 'R', 'D'],
    ['G', 'A', 'M', 'E'],
    ['F', 'L', 'O', 'W'],
    ['M', 'I', 'N', 'D'],
  ];

  return (
    <div
      id="theme-shop-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playButtonTap();
          onClose();
        }
      }}
    >
      <div
        id="theme-shop-container"
        className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-zinc-200/90 dark:border-slate-800 flex flex-col overflow-hidden text-zinc-900 dark:text-slate-100"
      >
        {/* Header with Coin Counter and Close Button */}
        <div className="relative px-5 pt-4 pb-3 border-b border-zinc-200/80 dark:border-slate-800 flex items-center justify-between shrink-0 bg-zinc-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight flex items-center gap-1.5">
                <span>Theme & Wallpaper Store</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-slate-400 font-medium">
                Spend earned coins to customize your look
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Coin Balance Pill */}
            <div
              id="shop-coin-balance"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-700/60 text-amber-800 dark:text-amber-200 font-black text-xs sm:text-sm shadow-xs"
            >
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="font-mono">{coins}</span>
            </div>

            <button
              id="shop-close-btn"
              onClick={() => {
                playButtonTap();
                onClose();
              }}
              className="p-1.5 rounded-full bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
              title="Close Store"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Coins Quick Rewarded Ad Action */}
        {onRequestRewardedAd && (
          <div className="px-5 py-2 bg-linear-to-r from-blue-500/10 via-amber-500/10 to-purple-500/10 border-b border-zinc-200/60 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-base">🎬</span>
              <span className="text-[11px] font-medium text-zinc-700 dark:text-slate-300">
                Short on coins? Watch a quick sponsored ad:
              </span>
            </div>
            <button
              id="shop-earn-reward-ad-btn"
              onClick={() => {
                playSatisfyingClick();
                onRequestRewardedAd();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs transition-all active:scale-95"
            >
              <Film className="w-3 h-3" />
              <span>+25 Coins</span>
            </button>
          </div>
        )}

        {/* Success Toast */}
        {purchaseSuccessToast && (
          <div className="mx-4 mt-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{purchaseSuccessToast}</span>
          </div>
        )}

        {/* Error Toast */}
        {insufficientFundsError && (
          <div className="mx-4 mt-2 px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
            <span>⚠️</span>
            <span>{insufficientFundsError}</span>
          </div>
        )}

        {/* Interactive Live Style Preview Banner */}
        <div className="px-5 pt-3 pb-2 shrink-0">
          <div
            className="w-full p-3 rounded-2xl shadow-inner border border-zinc-200/80 dark:border-slate-800 flex items-center justify-between gap-3 overflow-hidden transition-all duration-300"
            style={{
              background:
                theme === 'dark'
                  ? currentWallpaper.backgroundCssDark
                  : currentWallpaper.backgroundCssLight,
            }}
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                Active Setup Preview
              </span>
              <div className="text-sm font-black flex items-center gap-1.5">
                <span>{currentWallpaper.emoji}</span>
                <span>{currentWallpaper.name}</span>
                <span className="text-xs opacity-75 font-normal">
                  + {currentTileTheme.name}
                </span>
              </div>
              <span className="text-[10px] opacity-70 font-medium">
                {currentWallpaper.description}
              </span>
            </div>

            {/* Miniature Live 4x4 Grid representation */}
            <div
              className={`p-1.5 rounded-xl border shadow-sm shrink-0 ${currentTileTheme.gridContainerClass}`}
            >
              <div className="grid grid-cols-4 gap-0.5">
                {previewLetters.map((row, rIdx) =>
                  row.map((letter, cIdx) => {
                    const isHighlight =
                      (rIdx === 0 && cIdx <= 3) || (rIdx === 2 && cIdx >= 1);
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-4 h-4 text-[9px] rounded-xs flex items-center justify-center font-bold border transition-colors ${
                          isHighlight
                            ? currentTileTheme.selectedBgClass
                            : `${currentTileTheme.tileBgClass} ${currentTileTheme.tileTextClass} ${currentTileTheme.tileBorderClass}`
                        }`}
                      >
                        {letter}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-1 pb-1.5 flex gap-2 shrink-0">
          <button
            id="shop-tab-wallpapers"
            onClick={() => {
              playSatisfyingClick();
              setActiveTab('wallpapers');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
              activeTab === 'wallpapers'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-zinc-100 dark:bg-slate-800/80 text-zinc-600 dark:text-slate-300 border-zinc-200 dark:border-slate-700 hover:bg-zinc-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Wallpapers ({WALLPAPERS.length})</span>
          </button>

          <button
            id="shop-tab-tiles"
            onClick={() => {
              playSatisfyingClick();
              setActiveTab('tile_themes');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
              activeTab === 'tile_themes'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-zinc-100 dark:bg-slate-800/80 text-zinc-600 dark:text-slate-300 border-zinc-200 dark:border-slate-700 hover:bg-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tile Themes ({TILE_THEMES.length})</span>
          </button>
        </div>

        {/* Sub-filter chips: All, Mythic & High-Roller, Standard */}
        <div className="px-5 pb-2 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => {
              playButtonTap();
              setRarityFilter('all');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              rarityFilter === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-slate-800/80 text-zinc-600 dark:text-slate-400 hover:bg-zinc-200 dark:hover:bg-slate-700'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => {
              playSatisfyingClick();
              setRarityFilter('mythic');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              rarityFilter === 'mythic'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black shadow-xs ring-2 ring-amber-400/40'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 hover:bg-amber-100'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>👑 Mythic Vault (500+ 🪙)</span>
          </button>
          <button
            onClick={() => {
              playButtonTap();
              setRarityFilter('standard');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              rarityFilter === 'standard'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-slate-800/80 text-zinc-600 dark:text-slate-400 hover:bg-zinc-200 dark:hover:bg-slate-700'
            }`}
          >
            Standard Tier
          </button>
        </div>

        {/* High-Roller Mythic Spotlight Hype Banner */}
        <div className="mx-5 mb-2 p-2.5 rounded-2xl bg-linear-to-r from-amber-500/15 via-purple-500/15 to-orange-500/15 border border-amber-400/60 dark:border-amber-600/60 flex items-center justify-between gap-2.5 shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center font-black text-base shadow-sm shrink-0">
              👑
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-zinc-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Mythic Prestige Vault</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black uppercase">
                  500+ Coins
                </span>
              </div>
              <p className="text-[10px] text-zinc-600 dark:text-slate-300 font-medium leading-tight">
                Unlock 24K Bullion & Cyber Matrix 2099 by completing levels or watching bonus ads!
              </p>
            </div>
          </div>

          {onRequestRewardedAd && (
            <button
              id="spotlight-watch-ad-btn"
              onClick={() => {
                playSatisfyingClick();
                onRequestRewardedAd();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
              title="Watch Sponsored Ad for +25 Coins"
            >
              <Film className="w-3.5 h-3.5" />
              <span>+25 🪙</span>
            </button>
          )}
        </div>

        {/* Scrollable Item Catalog */}
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
          {activeTab === 'wallpapers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
              {WALLPAPERS.filter((wp) => {
                if (rarityFilter === 'mythic') return wp.price >= 500 || wp.rarity === 'mythic' || wp.rarity === 'legendary';
                if (rarityFilter === 'standard') return wp.price < 500 && wp.rarity !== 'mythic' && wp.rarity !== 'legendary';
                return true;
              }).map((wp) => {
                const isEquipped = customization.equippedWallpaperId === wp.id;
                const isOwned =
                  customization.purchasedWallpaperIds.includes(wp.id) ||
                  wp.price === 0;
                const isMythic = wp.price >= 500 || wp.rarity === 'mythic' || wp.rarity === 'legendary';

                return (
                  <div
                    key={wp.id}
                    className={`relative rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs ${
                      isEquipped
                        ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20'
                        : isMythic
                        ? 'border-amber-400/80 dark:border-amber-500/80 ring-1 ring-amber-400/30 bg-linear-to-b from-amber-500/10 via-amber-500/5 to-white/70 dark:to-slate-900/80 shadow-md shadow-amber-500/10'
                        : isOwned
                        ? 'border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-zinc-300'
                        : 'border-zinc-200/80 dark:border-slate-800/80 bg-zinc-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    {/* Top row: Badge and Price */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{wp.emoji}</span>
                        <div>
                          <div className="font-black text-sm text-zinc-900 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
                            <span>{wp.name}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isMythic && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide bg-linear-to-r from-amber-500 to-yellow-500 text-zinc-950 uppercase shadow-2xs">
                                👑 HIGH ROLLER
                              </span>
                            )}
                            {wp.badge && (
                              <span className="inline-block text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 uppercase">
                                {wp.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status / Price Tag */}
                      {isEquipped ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Active
                        </span>
                      ) : isOwned ? (
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 bg-zinc-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          Owned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                          <Coins className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>{wp.price}</span>
                        </span>
                      )}
                    </div>

                    {/* Gradient preview bar */}
                    <div
                      className={`w-full h-8 rounded-xl mb-2.5 shadow-2xs border border-black/10 bg-linear-to-r ${wp.previewGradient} flex items-center justify-end px-3`}
                    >
                      <span className="text-[10px] text-white/90 font-mono font-bold drop-shadow-xs">
                        Aa Bb Cc
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-slate-400 leading-relaxed mb-2.5">
                      {wp.description}
                    </p>

                    {/* Coin Progress Bar towards this item if locked */}
                    {!isOwned && wp.price > 0 && (
                      <div className="mb-2.5 p-2 rounded-xl bg-zinc-100/80 dark:bg-slate-800/70 border border-zinc-200/60 dark:border-slate-700/50 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className={coins >= wp.price ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-slate-400'}>
                            {coins >= wp.price ? 'Ready to Unlock!' : `Need ${wp.price - coins} more`}
                          </span>
                          <span className="font-mono text-amber-600 dark:text-amber-400">
                            {coins} / {wp.price} 🪙 ({Math.min(100, Math.round((coins / wp.price) * 100))}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isMythic
                                ? 'bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400'
                                : 'bg-linear-to-r from-blue-500 to-indigo-500'
                            }`}
                            style={{ width: `${Math.min(100, (coins / wp.price) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Row */}
                    {isEquipped ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-xl font-black text-xs bg-zinc-100 dark:bg-slate-800 text-zinc-400 dark:text-slate-500 cursor-default"
                      >
                        Equipped
                      </button>
                    ) : isOwned ? (
                      <button
                        id={`equip-wallpaper-${wp.id}`}
                        onClick={() => handleBuyOrEquipWallpaper(wp)}
                        className="w-full py-2 px-3 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-95 transition-all"
                      >
                        Equip Wallpaper
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`buy-wallpaper-${wp.id}`}
                          onClick={() => handleBuyOrEquipWallpaper(wp)}
                          className={`flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
                            coins >= wp.price
                              ? isMythic
                                ? 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30 hover:brightness-105'
                                : 'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/25'
                              : 'bg-zinc-200 dark:bg-slate-800 text-zinc-600 dark:text-slate-400 hover:bg-zinc-300'
                          }`}
                        >
                          <Coins className="w-3.5 h-3.5 fill-current" />
                          <span>Buy for {wp.price} 🪙</span>
                        </button>

                        {coins < wp.price && onRequestRewardedAd && (
                          <button
                            onClick={() => handleWatchAdForTheme(wp.name)}
                            className="py-2 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 text-xs font-black flex items-center gap-1 shrink-0 active:scale-95 transition-all cursor-pointer shadow-xs"
                            title={`Watch an ad to get +25 coins towards ${wp.name}!`}
                          >
                            <Film className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>+25 🪙</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'tile_themes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
              {TILE_THEMES.filter((tile) => {
                if (rarityFilter === 'mythic') return tile.price >= 500 || tile.rarity === 'mythic' || tile.rarity === 'legendary';
                if (rarityFilter === 'standard') return tile.price < 500 && tile.rarity !== 'mythic' && tile.rarity !== 'legendary';
                return true;
              }).map((tile) => {
                const isEquipped = customization.equippedTileThemeId === tile.id;
                const isOwned =
                  customization.purchasedTileThemeIds.includes(tile.id) ||
                  tile.price === 0;
                const isMythic = tile.price >= 500 || tile.rarity === 'mythic' || tile.rarity === 'legendary';

                return (
                  <div
                    key={tile.id}
                    className={`relative rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs ${
                      isEquipped
                        ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20'
                        : isMythic
                        ? 'border-amber-400/80 dark:border-amber-500/80 ring-1 ring-amber-400/30 bg-linear-to-b from-amber-500/10 via-amber-500/5 to-white/70 dark:to-slate-900/80 shadow-md shadow-amber-500/10'
                        : isOwned
                        ? 'border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-zinc-300'
                        : 'border-zinc-200/80 dark:border-slate-800/80 bg-zinc-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{tile.emoji}</span>
                        <div>
                          <div className="font-black text-sm text-zinc-900 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
                            <span>{tile.name}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isMythic && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide bg-linear-to-r from-amber-500 to-yellow-500 text-zinc-950 uppercase shadow-2xs">
                                👑 HIGH ROLLER
                              </span>
                            )}
                            {tile.badge && (
                              <span className="inline-block text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 uppercase">
                                {tile.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status / Price */}
                      {isEquipped ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Active
                        </span>
                      ) : isOwned ? (
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 bg-zinc-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          Owned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                          <Coins className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>{tile.price}</span>
                        </span>
                      )}
                    </div>

                    {/* Tile visual representation */}
                    <div
                      className={`w-full py-2 px-3 rounded-xl mb-2.5 flex items-center justify-center gap-2 border shadow-inner ${tile.gridContainerClass}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs border ${tile.tileBgClass} ${tile.tileTextClass} ${tile.tileBorderClass}`}
                      >
                        P
                      </div>
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs border ${tile.tileBgClass} ${tile.tileTextClass} ${tile.tileBorderClass}`}
                      >
                        L
                      </div>
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs border ${tile.selectedBgClass}`}
                      >
                        A
                      </div>
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs border ${tile.selectedBgClass}`}
                      >
                        Y
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-slate-400 leading-relaxed mb-2.5">
                      {tile.description}
                    </p>

                    {/* Coin Progress Bar towards this item if locked */}
                    {!isOwned && tile.price > 0 && (
                      <div className="mb-2.5 p-2 rounded-xl bg-zinc-100/80 dark:bg-slate-800/70 border border-zinc-200/60 dark:border-slate-700/50 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className={coins >= tile.price ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-slate-400'}>
                            {coins >= tile.price ? 'Ready to Unlock!' : `Need ${tile.price - coins} more`}
                          </span>
                          <span className="font-mono text-amber-600 dark:text-amber-400">
                            {coins} / {tile.price} 🪙 ({Math.min(100, Math.round((coins / tile.price) * 100))}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isMythic
                                ? 'bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400'
                                : 'bg-linear-to-r from-blue-500 to-indigo-500'
                            }`}
                            style={{ width: `${Math.min(100, (coins / tile.price) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Row */}
                    {isEquipped ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-xl font-black text-xs bg-zinc-100 dark:bg-slate-800 text-zinc-400 dark:text-slate-500 cursor-default"
                      >
                        Equipped
                      </button>
                    ) : isOwned ? (
                      <button
                        id={`equip-tile-${tile.id}`}
                        onClick={() => handleBuyOrEquipTileTheme(tile)}
                        className="w-full py-2 px-3 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-95 transition-all"
                      >
                        Equip Tiles
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`buy-tile-${tile.id}`}
                          onClick={() => handleBuyOrEquipTileTheme(tile)}
                          className={`flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
                            coins >= tile.price
                              ? isMythic
                                ? 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30 hover:brightness-105'
                                : 'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/25'
                              : 'bg-zinc-200 dark:bg-slate-800 text-zinc-600 dark:text-slate-400 hover:bg-zinc-300'
                          }`}
                        >
                          <Coins className="w-3.5 h-3.5 fill-current" />
                          <span>Buy for {tile.price} 🪙</span>
                        </button>

                        {coins < tile.price && onRequestRewardedAd && (
                          <button
                            onClick={() => handleWatchAdForTheme(tile.name)}
                            className="py-2 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 text-xs font-black flex items-center gap-1 shrink-0 active:scale-95 transition-all cursor-pointer shadow-xs"
                            title={`Watch an ad to get +25 coins towards ${tile.name}!`}
                          >
                            <Film className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>+25 🪙</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-zinc-50 dark:bg-slate-950/60 border-t border-zinc-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-slate-400">
          <span>Earn coins by beating levels and Daily Challenges!</span>
          <button
            onClick={() => {
              playSatisfyingClick();
              onClose();
            }}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
