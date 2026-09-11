/**
 * Procedural relaxing ambient background music engine using Web Audio API.
 * Features 5 distinct procedural meditative soundscapes:
 * 1. Zen Garden (🪷): Atmospheric meditative drone with singing-bowl harmonics & soft bamboo chimes.
 * 2. Ocean Waves (🌊): Harmonic ocean swells with warm major-7th pads and calming wave noise.
 * 3. Lo-Fi Focus (🎧): Warm Rhodes-style mellow jazz chords with subtle vinyl warmth.
 * 4. Celestial Calm (✨): Crystalline bell arpeggios and ethereal space pads.
 * 5. Raindrops & Wood (🌧️): Soft soothing rain filter with wooden marimba droplet melodies.
 */

import { MusicTrack, MusicTrackId } from '../types.ts';
import { Storage } from './storage.ts';

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'zen',
    name: 'Zen Garden',
    emoji: '🪷',
    description: 'Meditative drone with singing bowls & bamboo chimes',
    vibe: 'Peaceful & Grounded',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    emoji: '🌊',
    description: 'Gentle oceanic swells & floating warm chords',
    vibe: 'Deep Relaxation',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Focus',
    emoji: '🎧',
    description: 'Mellow electric piano chords with cozy warmth',
    vibe: 'Study & Mental Zone',
  },
  {
    id: 'celestial',
    name: 'Celestial Calm',
    emoji: '✨',
    description: 'Shimmering crystalline bell arpeggios & cosmic pads',
    vibe: 'Clarity & Inspiration',
  },
  {
    id: 'rain',
    name: 'Raindrops & Wood',
    emoji: '🌧️',
    description: 'Soothing rain wash with tranquil marimba droplets',
    vibe: 'Cozy & Serene',
  },
];

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let currentTrackId: MusicTrackId = 'zen';
let isPlaying = false;
let sequenceTimer: number | null = null;
let ambientNodes: (AudioNode | { stop: () => void })[] = [];

function getOrCreateContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (audioCtx && !masterGain) {
    masterGain = audioCtx.createGain();
    const savedVol = Storage.getMusicVolume();
    masterGain.gain.setValueAtTime(savedVol, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  return audioCtx;
}

/** Clear all running ambient oscillators & noise sources */
function stopCurrentSoundscape() {
  if (sequenceTimer !== null) {
    window.clearInterval(sequenceTimer);
    sequenceTimer = null;
  }

  ambientNodes.forEach((node) => {
    try {
      if ('stop' in node && typeof node.stop === 'function') {
        node.stop();
      }
      if ('disconnect' in node && typeof node.disconnect === 'function') {
        node.disconnect();
      }
    } catch {
      // ignore
    }
  });
  ambientNodes = [];
}

/** 1. Zen Garden (Singing Bowls, 432Hz Ambient Drone & Chimes) */
function startZenGarden(ctx: AudioContext, destination: AudioNode) {
  // Deep warm drone (F2 & C3 at 86.8Hz & 130.8Hz)
  const droneOsc1 = ctx.createOscillator();
  const droneOsc2 = ctx.createOscillator();
  const droneFilter = ctx.createBiquadFilter();
  const droneGain = ctx.createGain();

  droneOsc1.type = 'sine';
  droneOsc1.frequency.setValueAtTime(86.8, ctx.currentTime);

  droneOsc2.type = 'triangle';
  droneOsc2.frequency.setValueAtTime(130.8, ctx.currentTime);

  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(220, ctx.currentTime);

  droneGain.gain.setValueAtTime(0.08, ctx.currentTime);

  droneOsc1.connect(droneFilter);
  droneOsc2.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(destination);

  droneOsc1.start();
  droneOsc2.start();
  ambientNodes.push(droneOsc1, droneOsc2, droneGain, droneFilter);

  // Generative singing bowl pentatonic chime
  const zenNotes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33]; // C Pentatonic
  let step = 0;

  const playZenBell = () => {
    if (!isPlaying) return;
    const now = ctx.currentTime;
    const freq = zenNotes[step % zenNotes.length];
    step = (step + Math.floor(Math.random() * 3) + 1) % zenNotes.length;

    // Harmonic bowl tone
    const bellOsc = ctx.createOscillator();
    const bellHarmonic = ctx.createOscillator();
    const bellGain = ctx.createGain();

    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(freq, now);

    bellHarmonic.type = 'sine';
    bellHarmonic.frequency.setValueAtTime(freq * 2.76, now); // Metallic non-integer harmonic

    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
    bellGain.gain.exponentialRampToValueAtTime(0.0005, now + 3.2);

    bellOsc.connect(bellGain);
    bellHarmonic.connect(bellGain);
    bellGain.connect(destination);

    bellOsc.start(now);
    bellHarmonic.start(now);
    bellOsc.stop(now + 3.3);
    bellHarmonic.stop(now + 3.3);
  };

  playZenBell();
  sequenceTimer = window.setInterval(playZenBell, 3400);
}

/** 2. Ocean Waves (Oceanic chord swell and soothing noise filter) */
function startOceanWaves(ctx: AudioContext, destination: AudioNode) {
  // Pink-noise ocean surf wave
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.153852;
    output[i] = (b0 + b1 + b2) * 0.35;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const surfFilter = ctx.createBiquadFilter();
  surfFilter.type = 'bandpass';
  surfFilter.frequency.setValueAtTime(320, ctx.currentTime);
  surfFilter.Q.setValueAtTime(1.2, ctx.currentTime);

  // LFO to simulate gentle ocean waves in and out
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8 second cycle
  lfoGain.gain.setValueAtTime(160, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(surfFilter.frequency);

  const surfGain = ctx.createGain();
  surfGain.gain.setValueAtTime(0.045, ctx.currentTime);

  noiseSource.connect(surfFilter);
  surfFilter.connect(surfGain);
  surfGain.connect(destination);

  noiseSource.start();
  lfo.start();
  ambientNodes.push(noiseSource, lfo, surfFilter, surfGain);

  // Gentle floating warm chord swells (Fmaj7, Cmaj7)
  const chords = [
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [130.81, 164.81, 196.0, 246.94], // Cmaj7
    [196.0, 246.94, 293.66, 370.0],  // Gmaj7
  ];
  let chordIndex = 0;

  const playOceanChord = () => {
    if (!isPlaying) return;
    const now = ctx.currentTime;
    const currentChord = chords[chordIndex % chords.length];
    chordIndex++;

    currentChord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 2.0);
      gain.gain.linearRampToValueAtTime(0.0005, now + 6.0);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(now);
      osc.stop(now + 6.1);
    });
  };

  playOceanChord();
  sequenceTimer = window.setInterval(playOceanChord, 5200);
}

/** 3. Lo-Fi Focus (Warm Rhodes E-Piano Chords with Velvet Filter) */
function startLoFiFocus(ctx: AudioContext, destination: AudioNode) {
  // Jazz-hop chord progressions (Dm9, G13, Cmaj9, Am7)
  const lofiChords = [
    [146.83, 220.0, 261.63, 329.63, 392.0],  // Dm9
    [196.0, 246.94, 293.66, 370.0, 440.0],  // G13
    [130.81, 196.0, 246.94, 329.63, 392.0], // Cmaj9
    [220.0, 261.63, 329.63, 392.0, 493.88], // Am9
  ];
  let idx = 0;

  const playLoFiBar = () => {
    if (!isPlaying) return;
    const now = ctx.currentTime;
    const chord = lofiChords[idx % lofiChords.length];
    idx++;

    chord.forEach((freq, noteIdx) => {
      const noteDelay = noteIdx * 0.04; // slight strum / humanize
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + noteDelay);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now + noteDelay);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, now + noteDelay);

      gain.gain.setValueAtTime(0, now + noteDelay);
      gain.gain.linearRampToValueAtTime(0.035, now + noteDelay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + noteDelay + 3.0);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start(now + noteDelay);
      oscHarmonic.start(now + noteDelay);
      osc.stop(now + noteDelay + 3.1);
      oscHarmonic.stop(now + noteDelay + 3.1);
    });

    // Soft warm mellow bass note
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(chord[0] / 2, now);
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.05, now + 0.08);
    bassGain.gain.exponentialRampToValueAtTime(0.0005, now + 3.2);

    bassOsc.connect(bassGain);
    bassGain.connect(destination);
    bassOsc.start(now);
    bassOsc.stop(now + 3.3);
  };

  playLoFiBar();
  sequenceTimer = window.setInterval(playLoFiBar, 3200);
}

/** 4. Celestial Calm (Crystalline Bell Arpeggios & Space Pads) */
function startCelestial(ctx: AudioContext, destination: AudioNode) {
  // Ambient cosmic drone
  const spaceOsc = ctx.createOscillator();
  const spaceFilter = ctx.createBiquadFilter();
  const spaceGain = ctx.createGain();

  spaceOsc.type = 'triangle';
  spaceOsc.frequency.setValueAtTime(146.83, ctx.currentTime); // D3

  spaceFilter.type = 'lowpass';
  spaceFilter.frequency.setValueAtTime(380, ctx.currentTime);

  spaceGain.gain.setValueAtTime(0.04, ctx.currentTime);

  spaceOsc.connect(spaceFilter);
  spaceFilter.connect(spaceGain);
  spaceGain.connect(destination);

  spaceOsc.start();
  ambientNodes.push(spaceOsc, spaceFilter, spaceGain);

  // Shimmering crystalline bell notes in Lydia / Major 9th
  const celestialScale = [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77];
  let noteIndex = 0;

  const playCelestialArp = () => {
    if (!isPlaying) return;
    const now = ctx.currentTime;
    const freq = celestialScale[noteIndex % celestialScale.length];
    noteIndex = (noteIndex + 3) % celestialScale.length;

    const bell = ctx.createOscillator();
    const bellFilter = ctx.createBiquadFilter();
    const bellGain = ctx.createGain();

    bell.type = 'sine';
    bell.frequency.setValueAtTime(freq, now);

    bellFilter.type = 'bandpass';
    bellFilter.frequency.setValueAtTime(freq * 1.5, now);
    bellFilter.Q.setValueAtTime(2.0, now);

    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(0.04, now + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.0005, now + 2.5);

    bell.connect(bellFilter);
    bellFilter.connect(bellGain);
    bellGain.connect(destination);

    bell.start(now);
    bell.stop(now + 2.6);
  };

  playCelestialArp();
  sequenceTimer = window.setInterval(playCelestialArp, 1400);
}

/** 5. Raindrops & Wood (Pink Rain Wash & Wooden Marimba Droplets) */
function startRaindrops(ctx: AudioContext, destination: AudioNode) {
  // Rain noise bed
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.2;
  }

  const rainSource = ctx.createBufferSource();
  rainSource.buffer = buffer;
  rainSource.loop = true;

  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = 'lowpass';
  rainFilter.frequency.setValueAtTime(950, ctx.currentTime);

  const rainGain = ctx.createGain();
  rainGain.gain.setValueAtTime(0.035, ctx.currentTime);

  rainSource.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(destination);

  rainSource.start();
  ambientNodes.push(rainSource, rainFilter, rainGain);

  // Gentle wooden marimba drops
  const marimbaNotes = [329.63, 392.0, 440.0, 493.88, 659.25, 783.99]; // E minor pentatonic
  let count = 0;

  const playRaindrop = () => {
    if (!isPlaying) return;
    const now = ctx.currentTime;
    const freq = marimbaNotes[count % marimbaNotes.length];
    count = (count + Math.floor(Math.random() * 2) + 1) % marimbaNotes.length;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Woody click attack & quick resonance decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.65);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.7);
  };

  playRaindrop();
  sequenceTimer = window.setInterval(playRaindrop, 1800);
}

/** Core Music Controller */
export const MusicEngine = {
  getCurrentTrackId(): MusicTrackId {
    return currentTrackId;
  },

  isMusicPlaying(): boolean {
    return isPlaying;
  },

  getTracks(): MusicTrack[] {
    return MUSIC_TRACKS;
  },

  start(trackId?: MusicTrackId) {
    const ctx = getOrCreateContext();
    if (!ctx || !masterGain) return;

    if (trackId) {
      currentTrackId = trackId;
      Storage.setMusicTrack(trackId);
    } else {
      currentTrackId = Storage.getMusicTrack();
    }

    const isEnabled = Storage.getMusicEnabled();
    if (!isEnabled) {
      isPlaying = false;
      return;
    }

    isPlaying = true;
    stopCurrentSoundscape();

    // Fade master gain smoothly into set volume
    const vol = Storage.getMusicVolume();
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1.0);

    switch (currentTrackId) {
      case 'zen':
        startZenGarden(ctx, masterGain);
        break;
      case 'ocean':
        startOceanWaves(ctx, masterGain);
        break;
      case 'lofi':
        startLoFiFocus(ctx, masterGain);
        break;
      case 'celestial':
        startCelestial(ctx, masterGain);
        break;
      case 'rain':
        startRaindrops(ctx, masterGain);
        break;
      default:
        startZenGarden(ctx, masterGain);
    }
  },

  stop(smooth: boolean = true) {
    isPlaying = false;
    if (!audioCtx || !masterGain) {
      stopCurrentSoundscape();
      return;
    }

    if (smooth) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      setTimeout(() => {
        stopCurrentSoundscape();
      }, 650);
    } else {
      stopCurrentSoundscape();
    }
  },

  switchTrack(trackId: MusicTrackId) {
    currentTrackId = trackId;
    Storage.setMusicTrack(trackId);
    if (isPlaying) {
      this.start(trackId);
    }
  },

  setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    Storage.setMusicVolume(clamped);
    if (audioCtx && masterGain && isPlaying) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(clamped, audioCtx.currentTime + 0.1);
    }
  },

  setEnabled(enabled: boolean) {
    Storage.setMusicEnabled(enabled);
    if (enabled) {
      this.start();
    } else {
      this.stop();
    }
  },

  /** Call on user interaction to unlock Web Audio context on mobile browsers */
  unlockContext() {
    getOrCreateContext();
  },
};

// Handle visibility change: automatically mute when player changes tab
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying && masterGain && audioCtx) {
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      }
    } else {
      if (isPlaying && masterGain && audioCtx) {
        const vol = Storage.getMusicVolume();
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.8);
      }
    }
  });
}
