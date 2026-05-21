let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playDropletSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = "sine";
    // Slide the pitch upward quickly to mimic the bubble/drop resonance
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.12);

    // Fast volume envelope: instant snap to active, soft smooth decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (err) {
    console.warn("Failed to play droplet sound:", err);
  }
}

/**
 * Plays a rich, ascending success chime.
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playTone = (freq: number, startDelay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + startDelay);

      const toneStart = now + startDelay;
      gainNode.gain.setValueAtTime(0, toneStart);
      gainNode.gain.linearRampToValueAtTime(0.15, toneStart + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, toneStart + duration);

      osc.start(toneStart);
      osc.stop(toneStart + duration);
    };

    // Uplifting arpeggio (C5 -> E5 -> G5 -> C6)
    playTone(523.25, 0, 0.4);
    playTone(659.25, 0.08, 0.45);
    playTone(783.99, 0.16, 0.5);
    playTone(1046.50, 0.24, 0.7);
  } catch (err) {
    console.warn("Failed to play success chime:", err);
  }
}
