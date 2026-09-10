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

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setAudioEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isAudioEnabled(): boolean {
  return soundEnabled;
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

// 1. Button tap: Soft tap
export function playButtonTap() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

// 2. Correct word found: Bright chime
export function playCorrectWord() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    const startTime = ctx.currentTime + index * 0.07;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

// 3. Wrong selection: Gentle buzz
export function playWrongSelection() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.linearRampToValueAtTime(100, now + 0.16);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.17);
}

// 4. Level complete: Victory fanfare
export function playVictoryFanfare() {
  if (!soundEnabled) return;
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
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + item.dur + 0.05);
  });
}

// 5. Countdown tick (<30s): Subtle tick
export function playCountdownTick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}

// 6. Drag / swipe: Light swoosh
let lastSwooshTime = 0;
export function playDragSwoosh() {
  if (!soundEnabled) return;
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

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

// 7. Bonus word found: Coin collect sparkle
export function playBonusWordSparkle() {
  if (!soundEnabled) return;
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
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  });
}

// 8. Game over (time ran out): Descending tone
export function playGameOverDescending() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.6);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.65);
}

// 9. Finger slide letter step tick: crisp tactile pop with subtle pitch scale
export function playSlideLetterTick(letterCount: number = 1) {
  // Mobile haptic vibration if supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch {
      // ignore
    }
  }

  if (!soundEnabled) return;
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

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}
