import { useEffect, useState } from 'react';
import {
  Check,
  Disc3,
  Download,
  FileCode2,
  FileText,
  Layers,
  Moon,
  Music,
  Palette,
  RotateCcw,
  Smartphone,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA.ts';
import { MusicTrackId, Theme } from '../types.ts';
import { getTileThemeById, getWallpaperById } from '../data/shopThemes.ts';
import {
  getSfxVolume,
  isAudioEnabled,
  playButtonTap,
  playSatisfyingClick,
  playSuccessChime,
  setAudioEnabled,
  setSfxVolume,
} from '../utils/audio.ts';
import { MusicEngine, MUSIC_TRACKS } from '../utils/musicEngine.ts';
import { Storage } from '../utils/storage.ts';

interface SettingsModalProps {
  isOpen: boolean;
  theme: Theme;
  onToggleTheme: () => void;
  onClose: () => void;
  onOpenShop?: () => void;
}

export function SettingsModal({
  isOpen,
  theme,
  onToggleTheme,
  onClose,
  onOpenShop,
}: SettingsModalProps) {
  // Audio & Music local states for smooth immediate UI response
  const [sfxEnabled, setSfxEnabledState] = useState(() => Storage.getSoundEnabled());
  const [sfxVol, setSfxVolState] = useState(() => Storage.getSfxVolume());
  const [musicEnabled, setMusicEnabledState] = useState(() => Storage.getMusicEnabled());
  const [musicVol, setMusicVolState] = useState(() => Storage.getMusicVolume());
  const [activeTrack, setActiveTrack] = useState<MusicTrackId>(() => Storage.getMusicTrack());
  const [hapticsEnabled, setHapticsState] = useState(() => Storage.getHapticsEnabled());
  const [activeTestSound, setActiveTestSound] = useState<'click' | 'success' | null>(null);
  const customization = Storage.getCustomizationState();
  const equippedWallpaper = getWallpaperById(customization.equippedWallpaperId);
  const equippedTileTheme = getTileThemeById(customization.equippedTileThemeId);

  // PWA States
  const { canInstall, isInstalled, isStandalone, installApp } = usePWA();

  if (!isOpen) return null;

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabledState(next);
    setAudioEnabled(next);
    if (next) {
      playSatisfyingClick();
    }
  };

  const handleChangeSfxVolume = (val: number) => {
    setSfxVolState(val);
    setSfxVolume(val);
  };

  const handleToggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabledState(next);
    MusicEngine.setEnabled(next);
    playButtonTap();
  };

  const handleChangeMusicVolume = (val: number) => {
    setMusicVolState(val);
    MusicEngine.setVolume(val);
  };

  const handleSelectTrack = (trackId: MusicTrackId) => {
    setActiveTrack(trackId);
    MusicEngine.switchTrack(trackId);
    if (!musicEnabled) {
      setMusicEnabledState(true);
      MusicEngine.setEnabled(true);
    }
    playSatisfyingClick();
  };

  const handleToggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsState(next);
    Storage.setHapticsEnabled(next);
    playSatisfyingClick();
  };

  const testClickSound = () => {
    setActiveTestSound('click');
    playSatisfyingClick();
    setTimeout(() => setActiveTestSound(null), 300);
  };

  const testSuccessSound = () => {
    setActiveTestSound('success');
    playSuccessChime();
    setTimeout(() => setActiveTestSound(null), 600);
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-zinc-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-zinc-900 dark:text-slate-100 tracking-tight">
                Audio & Settings
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-slate-400">
                Relaxing music, sound effects & theme
              </p>
            </div>
          </div>

          <button
            id="settings-close-btn"
            onClick={() => {
              playButtonTap();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-800 text-zinc-400 dark:text-slate-400 hover:text-zinc-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm">
          {/* SECTION 1: RELAXING BACKGROUND MUSIC */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc3 className={`w-4 h-4 ${musicEnabled ? 'text-blue-600 dark:text-blue-400 animate-spin' : 'text-zinc-400'}`} style={{ animationDuration: '6s' }} />
                <span className="font-bold text-zinc-900 dark:text-slate-100">
                  Background Music
                </span>
              </div>

              {/* Music Toggle Switch */}
              <button
                id="toggle-music-switch"
                onClick={handleToggleMusic}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                  musicEnabled ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    musicEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Music Volume Slider */}
            {musicEnabled && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-100 dark:border-slate-800">
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <input
                  id="music-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVol}
                  onChange={(e) => handleChangeMusicVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-600 h-1.5 bg-zinc-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-mono font-bold w-7 text-right text-zinc-500 dark:text-slate-400">
                  {Math.round(musicVol * 100)}%
                </span>
              </div>
            )}

            {/* Music Tracks Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-500 dark:text-slate-400">
                  Select Music Ambience
                </span>
                <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                  Procedural Web Audio
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {MUSIC_TRACKS.map((track) => {
                  const isSelected = activeTrack === track.id && musicEnabled;
                  return (
                    <button
                      key={track.id}
                      id={`music-track-${track.id}`}
                      onClick={() => handleSelectTrack(track.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-700 shadow-xs'
                          : 'bg-zinc-50/60 dark:bg-slate-800/40 border-zinc-200/70 dark:border-slate-800 hover:border-zinc-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl flex-shrink-0">{track.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-zinc-900 dark:text-slate-100">
                              {track.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-200/70 dark:bg-slate-700 text-zinc-600 dark:text-slate-300 font-semibold">
                              {track.vibe}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-slate-400 line-clamp-1">
                            {track.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-2">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-zinc-300 dark:border-slate-700 flex items-center justify-center text-zinc-300 dark:text-slate-600 text-xs">
                            •
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-slate-800" />

          {/* SECTION 2: SATISFYING SOUND EFFECTS (SFX) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-zinc-900 dark:text-slate-100">
                  Sound Effects (SFX)
                </span>
              </div>

              {/* SFX Toggle Switch */}
              <button
                id="toggle-sfx-switch"
                onClick={handleToggleSfx}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                  sfxEnabled ? 'bg-emerald-600' : 'bg-zinc-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sfxEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* SFX Volume Slider */}
            {sfxEnabled && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-100 dark:border-slate-800">
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <input
                  id="sfx-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVol}
                  onChange={(e) => handleChangeSfxVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 h-1.5 bg-zinc-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-mono font-bold w-7 text-right text-zinc-500 dark:text-slate-400">
                  {Math.round(sfxVol * 100)}%
                </span>
              </div>
            )}

            {/* Interactive Preview Test Sound Buttons */}
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-slate-400 block mb-2">
                Preview Audio Feedback
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="test-click-btn"
                  onClick={testClickSound}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                    activeTestSound === 'click'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                      : 'bg-zinc-50 dark:bg-slate-800/60 border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Satisfying Click</span>
                </button>

                <button
                  id="test-success-btn"
                  onClick={testSuccessSound}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                    activeTestSound === 'success'
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-200'
                      : 'bg-zinc-50 dark:bg-slate-800/60 border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Success Chime</span>
                </button>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-slate-800" />

          {/* SECTION 3: HAPTICS & APPEARANCE */}
          <div className="space-y-3">
            {/* Haptic Vibration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-slate-100 block text-xs">
                    Tactile Vibration
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-slate-400">
                    Haptic tick on letter connections (mobile)
                  </span>
                </div>
              </div>

              <button
                id="toggle-haptics-switch"
                onClick={handleToggleHaptics}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                  hapticsEnabled ? 'bg-purple-600' : 'bg-zinc-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hapticsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <div>
                  <span className="font-bold text-zinc-900 dark:text-slate-100 block text-xs">
                    Theme
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-slate-400">
                    {theme === 'dark' ? 'Dark Night Mode' : 'Clean Light Mode'}
                  </span>
                </div>
              </div>

              <button
                id="settings-theme-toggle-btn"
                onClick={() => {
                  playSatisfyingClick();
                  onToggleTheme();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-slate-800 text-zinc-800 dark:text-slate-200 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Custom Wallpapers & Tile Themes Preview */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-slate-100 block text-xs">
                      Custom Theme & Wallpaper
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-slate-400">
                      Spent coins on custom cosmetics
                    </span>
                  </div>
                </div>

                {onOpenShop && (
                  <button
                    id="settings-open-shop-btn"
                    onClick={() => {
                      playSatisfyingClick();
                      onOpenShop();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-[11px] shadow-xs transition-all active:scale-95"
                  >
                    Open Shop
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-zinc-600 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-zinc-200/80 dark:border-slate-800">
                  <span className="text-zinc-400 dark:text-slate-500 block">Wallpaper:</span>
                  <span className="font-semibold text-zinc-800 dark:text-slate-200 flex items-center gap-1 truncate">
                    <span>{equippedWallpaper.emoji}</span>
                    <span className="truncate">{equippedWallpaper.name}</span>
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-zinc-200/80 dark:border-slate-800">
                  <span className="text-zinc-400 dark:text-slate-500 block">Tiles:</span>
                  <span className="font-semibold text-zinc-800 dark:text-slate-200 flex items-center gap-1 truncate">
                    <span>{equippedTileTheme.emoji}</span>
                    <span className="truncate">{equippedTileTheme.name}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-slate-800" />

          {/* SECTION 4: WEB APP MANIFEST & PWA INSTALL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-slate-100 block text-xs">
                    Web App Manifest & PWA
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-slate-400">
                    manifest.json & standalone installability
                  </span>
                </div>
              </div>

              {canInstall && (
                <button
                  id="pwa-install-button"
                  onClick={async () => {
                    playSatisfyingClick();
                    await installApp();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
              )}
            </div>

            {/* Manifest Details Card */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-200 dark:border-slate-700/80 text-[11px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700 dark:text-slate-200 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Manifest Status:</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                  manifest.json active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-zinc-600 dark:text-slate-300">
                <div>
                  <span className="text-zinc-400 dark:text-slate-500 block">Short Name:</span>
                  <span className="font-semibold text-zinc-800 dark:text-slate-200">WordSearch</span>
                </div>
                <div>
                  <span className="text-zinc-400 dark:text-slate-500 block">Display Mode:</span>
                  <span className="font-semibold text-zinc-800 dark:text-slate-200">standalone</span>
                </div>
                <div>
                  <span className="text-zinc-400 dark:text-slate-500 block">Icons Included:</span>
                  <span className="font-semibold text-zinc-800 dark:text-slate-200">192, 512, Maskable</span>
                </div>
                <div>
                  <span className="text-zinc-400 dark:text-slate-500 block">Install State:</span>
                  <span className="font-semibold text-zinc-800 dark:text-slate-200">
                    {isStandalone ? 'Standalone App' : isInstalled ? 'Installed' : 'Ready to Install'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-slate-800" />

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-zinc-50 dark:bg-slate-950/40 border-t border-zinc-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 dark:text-slate-500 font-medium">
            Saved to local profile
          </span>
          <button
            id="settings-done-btn"
            onClick={() => {
              playSatisfyingClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
