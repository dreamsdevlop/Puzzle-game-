/**
 * Sound effects engine using Web Audio API.
 * Supports:
 * - Button tap: Soft tap
 * - Correct word found: Bright chime
 * - Wrong selection: Gentle buzz
 * - Level complete: Victory fanfare
 * - Countdown tick (<30s): Subtle tick
 * - Drag / swipe: Light swoosh
 * - Bonus word found: Coin collect sparkle
 * - Game over (time ran out): Descending tone
 */

import { Storage } from './storage.ts';

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let sfxVolume = 0.75;

export function initAudioSettings() {
  soundEnabled = Storage.getSoundEnabled();
  sfxVolume = Storage.getSfxVolume();
}

export function setAudioEnabled(enabled: boolean) {
  soundEnabled = enabled;
  Storage.setSoundEnabled(enabled);
}

export function isAudioEnabled(): boolean {
  return soundEnabled;
}

export function setSfxVolume(volume: number) {
  sfxVolume = Math.max(0, Math.min(1, volume));
  Storage.setSfxVolume(sfxVolume);
}

export function getSfxVolume(): number {
  return sfxVolume;
}

function triggerHaptic(durationMs: number = 12) {
  if (typeof window !== 'undefined' && 'navigator' in window && Storage.getHapticsEnabled()) {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(durationMs);
      }
    } catch {
      // ignore
    }
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Button tap / Satisfying tactile click:
// Uses high crisp transient snap + mellow wooden body resonance
export function playButtonTap() {
  playSatisfyingClick();
}

export function playSatisfyingClick() {
  triggerHaptic(10);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const volMultiplier = sfxVolume;

  // Transient crisp snap
  const snapOsc = ctx.createOscillator();
  const snapGain = ctx.createGain();
  snapOsc.type = 'triangle';
  snapOsc.frequency.setValueAtTime(1400, now);
  snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.025);

  snapGain.gain.setValueAtTime(0.22 * volMultiplier, now);
  snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  snapOsc.connect(snapGain);
  snapGain.connect(ctx.destination);
  snapOsc.start(now);
  snapOsc.stop(now + 0.026);

  // Warm tactile wooden body resonance
  const bodyOsc = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  bodyOsc.type = 'sine';
  bodyOsc.frequency.setValueAtTime(420, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

  bodyGain.gain.setValueAtTime(0.16 * volMultiplier, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  bodyOsc.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  bodyOsc.start(now);
  bodyOsc.stop(now + 0.055);
}

// 2. Correct word found: Sparkling crystal chime with lush harmonic overtone
export function playCorrectWord() {
  triggerHaptic(20);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const volMultiplier = sfxVolume;
  // Pentatonic chime ascension: C5, E5, G5, C6
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, index) => {
    const startTime = ctx.currentTime + index * 0.065;

    // Primary fundamental bell
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.25 * volMultiplier, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.48);

    // High sparkling harmonic overtone
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(freq * 2, startTime);

    shimmerGain.gain.setValueAtTime(0, startTime);
    shimmerGain.gain.linearRampToValueAtTime(0.09 * volMultiplier, startTime + 0.01);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);

    shimmer.start(startTime);
    shimmer.stop(startTime + 0.38);
  });
}

// 2b. Standalone Success Chime for modal triumphs or celebrations
export function playSuccessChime() {
  triggerHaptic(25);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const volMultiplier = sfxVolume;
  // Major 9th triumphal chime: F5, A5, C6, E6, G6
  const notes = [698.46, 880.0, 1046.5, 1318.51, 1567.98];
  notes.forEach((freq, idx) => {
    const startTime = ctx.currentTime + idx * 0.07;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.24 * volMultiplier, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.6);
  });
}

// 2c. Star Earned Ding (index: 1, 2, or 3)
export function playStarDing(starIndex: number = 1) {
  triggerHaptic(18);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const freqs = [783.99, 1046.5, 1318.51]; // G5, C6, E6
  const freq = freqs[Math.max(0, Math.min(2, starIndex - 1))];
  const now = ctx.currentTime;
  const volMultiplier = sfxVolume;

  const osc = ctx.createOscillator();
  const harmonic = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(freq * 2, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.28 * volMultiplier, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(gain);
  harmonic.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  harmonic.start(now);
  osc.stop(now + 0.52);
  harmonic.stop(now + 0.52);
}

// 2d. Chest Reward / Milestone unlock
export function playChestReward() {
  triggerHaptic(35);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const volMultiplier = sfxVolume;
  const arpeggio = [440.0, 554.37, 659.25, 880.0, 1108.73, 1318.51]; // A major sparkle
  arpeggio.forEach((note, i) => {
    const startTime = ctx.currentTime + i * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.22 * volMultiplier, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.65);
  });
}

// 3. Wrong selection: Gentle buzz
export function playWrongSelection() {
  triggerHaptic(30);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.linearRampToValueAtTime(100, now + 0.16);

  gain.gain.setValueAtTime(0.18 * sfxVolume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.17);
}

// 4. Level complete: Victory fanfare
export function playVictoryFanfare() {
  triggerHaptic(40);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Fanfare arpeggio & chords
  const melody = [
    { note: 523.25, time: 0.0, dur: 0.12 }, // C5
    { note: 659.25, time: 0.12, dur: 0.12 }, // E5
    { note: 783.99, time: 0.24, dur: 0.14 }, // G5
    { note: 1046.5, time: 0.38, dur: 0.35 }, // C6
    { note: 880.0, time: 0.75, dur: 0.12 }, // A5
    { note: 1046.5, time: 0.88, dur: 0.6 }, // C6 long
  ];

  melody.forEach((item) => {
    const startTime = ctx.currentTime + item.time;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(item.note, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3 * sfxVolume, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + item.dur + 0.05);
  });
}

// 5. Countdown tick (<30s): Subtle tick
export function playCountdownTick() {
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

  gain.gain.setValueAtTime(0.15 * sfxVolume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}

// 6. Drag / swipe: Light swoosh
let lastSwooshTime = 0;
export function playDragSwoosh() {
  if (!soundEnabled || sfxVolume <= 0) return;
  const nowMs = Date.now();
  if (nowMs - lastSwooshTime < 90) return; // throttle
  lastSwooshTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.linearRampToValueAtTime(650, now + 0.04);

  gain.gain.setValueAtTime(0.06 * sfxVolume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

// 7. Bonus word found: Coin collect sparkle
export function playBonusWordSparkle() {
  triggerHaptic(25);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [987.77, 1318.51, 1567.98, 2093.0]; // B5, E6, G6, C7
  notes.forEach((freq, i) => {
    const startTime = ctx.currentTime + i * 0.06;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.25 * sfxVolume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  });
}

// 8. Game over (time ran out): Descending tone
export function playGameOverDescending() {
  triggerHaptic(30);
  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.6);

  gain.gain.setValueAtTime(0.2 * sfxVolume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.65);
}

// 9. Finger slide letter step tick: crisp tactile pop with subtle pitch scale
export function playSlideLetterTick(letterCount: number = 1) {
  triggerHaptic(8);

  if (!soundEnabled || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Subtle pitch ascension as word gets longer (C5 to C6 pentatonic feel)
  const baseFreq = 440;
  const freq = Math.min(1100, baseFreq + (letterCount - 1) * 55);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + 0.04);

  gain.gain.setValueAtTime(0.12 * sfxVolume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

// 10. Level Win sound for progression journey
export function playLevelWin() {
  playVictoryFanfare();
}
