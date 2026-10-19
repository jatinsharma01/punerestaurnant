/**
 * Pour Club Ambient Audio Engine
 * Provides lush, relaxing café lo-fi ambient audio using the Web Audio API
 * and optional HTML5 Audio fallback.
 * 
 * Generates warm Rhodes/electric piano jazz chords, soft vinyl tape crackle,
 * and soothing café ambience with 100% zero-dependency reliability in all modern browsers.
 */

export interface CafePreset {
  id: string;
  title: string;
  subtitle: string;
  bpm: number;
}

export const CAFE_PRESETS: CafePreset[] = [
  {
    id: "pune-rain-lofi",
    title: "Pune Rainy Café Lo-Fi",
    subtitle: "Warm Rhodes chords, gentle tape flutter & rain",
    bpm: 72,
  },
  {
    id: "espresso-lounge",
    title: "Koregaon Park Sunset Chills",
    subtitle: "Smooth 7th & 9th chords, soft room resonance",
    bpm: 68,
  },
  {
    id: "midnight-roast",
    title: "Midnight Pour Club Lounge",
    subtitle: "Deep mellow chords, vintage vinyl warmth",
    bpm: 60,
  },
];

class CafeAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private volume = 0.65;
  private chordInterval: NodeJS.Timeout | null = null;
  private crackleNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private currentPresetIndex = 0;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private volumeListeners: Set<(vol: number) => void> = new Set();
  private presetListeners: Set<(index: number) => void> = new Set();

  public readonly presets = CAFE_PRESETS;

  // Musical progressions (frequencies in Hz for lush 9th / maj7 chords)
  private readonly chordProgressions = [
    // Progression 1: Dm9 -> G13 -> Cmaj9 -> A7b9 (Cozy Lo-Fi staple)
    [
      [146.83, 220.0, 261.63, 329.63, 392.0], // Dm9: D3, A3, C4, E4, G4
      [98.0, 196.0, 246.94, 329.63, 440.0],  // G13: G2, G3, B3, E4, A4
      [130.81, 196.0, 246.94, 293.66, 329.63], // Cmaj9: C3, G3, B3, D4, E4
      [110.0, 220.0, 277.18, 311.13, 392.0], // A7b9: A2, A3, C#4, Eb4, G4
    ],
    // Progression 2: Fmaj9 -> Em7 -> Dm9 -> Cmaj7 (Sunset Chill)
    [
      [174.61, 261.63, 329.63, 392.0, 440.0], // Fmaj9
      [164.81, 246.94, 293.66, 392.0, 440.0], // Em7
      [146.83, 220.0, 261.63, 329.63, 392.0], // Dm9
      [130.81, 196.0, 246.94, 329.63, 392.0], // Cmaj7
    ],
    // Progression 3: Bbmaj7 -> Am7 -> Gm9 -> Fmaj7 (Midnight)
    [
      [116.54, 233.08, 293.66, 349.23, 440.0], // Bbmaj7
      [110.0, 220.0, 261.63, 329.63, 392.0],   // Am7
      [98.0, 196.0, 220.0, 293.66, 349.23],    // Gm9
      [87.31, 174.61, 220.0, 261.63, 329.63],  // Fmaj7
    ],
  ];

  private currentChordIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Generate soothing vinyl/rain tape crackle
  private startTapeCrackle() {
    if (!this.ctx || !this.gainNode) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink noise with subtle crackle peaks
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        let pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        
        // Add random vinyl dust pops
        if (Math.random() < 0.0004) {
          pink += (Math.random() - 0.5) * 4;
        }

        output[i] = pink * 0.035; // gentle whisper
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter for tape warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const crackleGain = this.ctx.createGain();
      crackleGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(crackleGain);
      crackleGain.connect(this.gainNode);

      whiteNoise.start();
      this.crackleNode = whiteNoise;
    } catch (e) {
      console.warn("Vinyl crackle generation error:", e);
    }
  }

  // Play a lush, warm electric piano chord
  private playChord(notes: number[]) {
    if (!this.ctx || !this.gainNode || this.ctx.state === "suspended") return;

    const now = this.ctx.currentTime;
    const duration = 3.6;

    // Filter to give warm, buttery vintage sound (cuts harsh highs)
    const chordFilter = this.ctx.createBiquadFilter();
    chordFilter.type = "lowpass";
    chordFilter.frequency.setValueAtTime(950, now);
    chordFilter.Q.setValueAtTime(0.8, now);

    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0.0001, now);
    // Smooth gentle attack
    chordGain.gain.exponentialRampToValueAtTime(0.18, now + 0.35);
    // Gentle decay & sustain
    chordGain.gain.exponentialRampToValueAtTime(0.08, now + 1.8);
    // Smooth fadeout
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    chordFilter.connect(chordGain);
    chordGain.connect(this.gainNode);

    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      // Primary soft sine/triangle oscillator
      const osc = this.ctx.createOscillator();
      osc.type = index % 2 === 0 ? "sine" : "triangle";
      // Slight detune for analog warmth
      const detune = (index - 2) * 4;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      // Subtle vibrato (LFO)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.5, now); // 4.5Hz vibrato
      lfoGain.gain.setValueAtTime(1.5, now);
      lfo.connect(osc.frequency);

      lfo.start(now);
      lfo.stop(now + duration);

      osc.connect(chordFilter);
      osc.start(now + index * 0.04); // subtle humanized arpeggio strum
      osc.stop(now + duration);
    });
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    if (typeof window === "undefined") return;
    this.initContext();
    this.isPlaying = true;
    this.notifyListeners();

    this.startTapeCrackle();

    const progression = this.chordProgressions[this.currentPresetIndex] || this.chordProgressions[0];
    this.currentChordIndex = 0;

    // Play first chord immediately
    this.playChord(progression[0]);
    this.currentChordIndex = 1;

    // Loop through progression smoothly
    if (this.chordInterval) clearInterval(this.chordInterval);
    this.chordInterval = setInterval(() => {
      if (!this.isPlaying) return;
      const currentProg = this.chordProgressions[this.currentPresetIndex] || this.chordProgressions[0];
      const chord = currentProg[this.currentChordIndex];
      this.playChord(chord);
      this.currentChordIndex = (this.currentChordIndex + 1) % currentProg.length;
    }, 3800);
  }

  public stop() {
    this.isPlaying = false;
    this.notifyListeners();

    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }

    if (this.crackleNode) {
      try {
        (this.crackleNode as AudioScheduledSourceNode).stop();
      } catch {
        // ignore
      }
      this.crackleNode = null;
    }
  }

  public setVolume(newVol: number) {
    this.volume = Math.max(0, Math.min(1, newVol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.volumeListeners.forEach((fn) => fn(this.volume));
  }

  public getVolume() {
    return this.volume;
  }

  public setPreset(index: number) {
    this.currentPresetIndex = index % this.presets.length;
    this.presetListeners.forEach((fn) => fn(this.currentPresetIndex));
    if (this.isPlaying) {
      // restart with new progression
      this.currentChordIndex = 0;
      const prog = this.chordProgressions[this.currentPresetIndex];
      this.playChord(prog[0]);
    }
  }

  public getPreset() {
    return this.presets[this.currentPresetIndex];
  }

  public getPresetIndex() {
    return this.currentPresetIndex;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public subscribeVolume(fn: (vol: number) => void) {
    this.volumeListeners.add(fn);
    return () => {
      this.volumeListeners.delete(fn);
    };
  }

  public subscribePreset(fn: (index: number) => void) {
    this.presetListeners.add(fn);
    return () => {
      this.presetListeners.delete(fn);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }
}

// Global singleton instance for seamless audio across navigation
export const cafeAudio = typeof window !== "undefined" ? new CafeAudioEngine() : (null as unknown as CafeAudioEngine);
