// Web Audio API Marimba Chime Synthesizer
// 100% compatible with iOS Safari & Android with zero external file dependencies!

let audioCtx: AudioContext | null = null;
let soundIntervalId: number | null = null;

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

// Must be called inside a user gesture (e.g. click START) to unlock iOS Safari Web Audio
export const unlockAudioContext = () => {
  const ctx = getAudioContext();
  if (ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Play a tiny inaudible buffer to permanently unlock on iOS WebKit
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (_) {}
  }
};

// Play a single warm Marimba tone
const playMarimbaTone = (ctx: AudioContext, freq: number, time: number, duration = 0.5) => {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sine wave with soft attack & exponential decay creates a gentle wooden chime
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.28, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  } catch (_) {}
};

// Play a pleasant 3-tone Marimba sequence (C5 -> E5 -> G5)
export const playChimeSequence = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  const now = ctx.currentTime;
  playMarimbaTone(ctx, 523.25, now, 0.45);        // C5
  playMarimbaTone(ctx, 659.25, now + 0.16, 0.5);  // E5
  playMarimbaTone(ctx, 783.99, now + 0.34, 0.65); // G5
};

// Start 8-second looping marimba chime
export const startLoopingChime = () => {
  stopLoopingChime();
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  // Play immediately
  playChimeSequence();

  // Repeat sequence every 1.4s
  soundIntervalId = window.setInterval(() => {
    playChimeSequence();
  }, 1400);
};

// Stop any active looping chime immediately
export const stopLoopingChime = () => {
  if (soundIntervalId !== null) {
    window.clearInterval(soundIntervalId);
    soundIntervalId = null;
  }
};
