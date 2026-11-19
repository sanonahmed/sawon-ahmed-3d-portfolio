import { SoundscapeType, KeyboardSwitchType } from '../types/portfolio';

/**
 * Procedural Web Audio API sound synthesizer & Ambient Soundscape Engine
 * 100% code-driven with zero external audio files / zero 404 dependencies!
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentSoundscape: SoundscapeType = 'off';
  private ambientMasterGain: GainNode | null = null;
  private ambientVolume: number = 0.65; // 0 to 1

  // Active soundscape nodes and timers for cleanup
  private activeNodes: (AudioNode | { stop?: () => void })[] = [];
  private activeTimers: number[] = [];

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.ambientMasterGain = this.ctx.createGain();
        this.ambientMasterGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume, this.ctx.currentTime);
        this.ambientMasterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientMasterGain && this.ctx) {
      const targetGain = muted ? 0.0001 : this.ambientVolume;
      this.ambientMasterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientMasterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.2);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getSoundscape(): SoundscapeType {
    return this.currentSoundscape;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientMasterGain && this.ctx && !this.isMuted) {
      this.ambientMasterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientMasterGain.gain.linearRampToValueAtTime(this.ambientVolume, this.ctx.currentTime + 0.1);
    }
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  /**
   * Crisp futuristic soft UI click
   */
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  /**
   * Smooth camera warp transition whoosh
   */
  public playWarp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, this.ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.38);
    } catch {}
  }

  /**
   * Authentic procedural mechanical keyboard switch acoustics
   * Supports Blue (Clicky Snap), Brown (Tactile Thock), and Red (Linear Thud)
   */
  public playKey(switchType: KeyboardSwitchType = 'blue') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const variation = (Math.random() - 0.5) * 40;

      if (switchType === 'blue') {
        // --- CHERRY MX BLUE (Sharp clicky snap + metallic clack) ---
        // 1. High-frequency clicker leaf snap
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(2600 + variation * 3, t);
        clickOsc.frequency.exponentialRampToValueAtTime(1400, t + 0.012);
        clickGain.gain.setValueAtTime(0.045, t);
        clickGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.015);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(t);
        clickOsc.stop(t + 0.015);

        // 2. Bottom-out mechanical keycap clack
        const clackOsc = this.ctx.createOscillator();
        const clackGain = this.ctx.createGain();
        clackOsc.type = 'square';
        clackOsc.frequency.setValueAtTime(680 + variation, t + 0.005);
        clackOsc.frequency.exponentialRampToValueAtTime(160, t + 0.04);
        clackGain.gain.setValueAtTime(0.03, t + 0.005);
        clackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
        clackOsc.connect(clackGain);
        clackGain.connect(this.ctx.destination);
        clackOsc.start(t + 0.005);
        clackOsc.stop(t + 0.045);
      } else if (switchType === 'brown') {
        // --- GATERON BROWN (Tactile bump + warm deep thock) ---
        const thockOsc = this.ctx.createOscillator();
        const thockGain = this.ctx.createGain();
        thockOsc.type = 'sine';
        thockOsc.frequency.setValueAtTime(840 + variation, t);
        thockOsc.frequency.exponentialRampToValueAtTime(280, t + 0.045);
        thockGain.gain.setValueAtTime(0.065, t);
        thockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        // Subtle tactile friction overtone
        const bumpOsc = this.ctx.createOscillator();
        const bumpGain = this.ctx.createGain();
        bumpOsc.type = 'triangle';
        bumpOsc.frequency.setValueAtTime(450, t);
        bumpOsc.frequency.exponentialRampToValueAtTime(120, t + 0.035);
        bumpGain.gain.setValueAtTime(0.025, t);
        bumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        thockOsc.connect(thockGain);
        bumpOsc.connect(bumpGain);
        thockGain.connect(this.ctx.destination);
        bumpGain.connect(this.ctx.destination);

        thockOsc.start(t);
        bumpOsc.start(t);
        thockOsc.stop(t + 0.05);
        bumpOsc.stop(t + 0.035);
      } else {
        // --- LINEAR RED (Smooth linear, damped bottom-out thud) ---
        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(360 + variation * 0.5, t);
        thudOsc.frequency.exponentialRampToValueAtTime(130, t + 0.04);
        thudGain.gain.setValueAtTime(0.05, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.042);

        thudOsc.connect(thudGain);
        thudGain.connect(this.ctx.destination);
        thudOsc.start(t);
        thudOsc.stop(t + 0.042);
      }
    } catch {}
  }

  /**
   * Chime for mood lighting toggle or success
   */
  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.03, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {}
  }

  /**
   * Crisp tactile paper peel / sticky note rustle sound
   */
  public playPaperRustle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, t);
      filter.frequency.exponentialRampToValueAtTime(1200, t + 0.07);
      filter.Q.setValueAtTime(2.2, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(t);
      noiseSource.stop(t + 0.08);
    } catch {}
  }

  /**
   * Procedural white/pink noise buffer generator
   */
  private createNoiseBuffer(durationSec: number = 3): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise smoothing filter
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
    }
    return buffer;
  }

  /**
   * Stop and cleanup currently running soundscape
   */
  public stopSoundscape() {
    this.activeTimers.forEach((timer) => window.clearInterval(timer));
    this.activeTimers = [];

    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        if ('disconnect' in node && typeof node.disconnect === 'function') {
          node.disconnect();
        }
      } catch {}
    });
    this.activeNodes = [];
  }

  /**
   * Switch between procedural ambient soundscapes
   */
  public setSoundscape(type: SoundscapeType) {
    this.currentSoundscape = type;
    this.stopSoundscape();

    if (type === 'off') {
      return;
    }

    try {
      this.initCtx();
      if (!this.ctx || !this.ambientMasterGain) return;

      switch (type) {
        case 'cyber-space':
          this.startCyberSpaceSoundscape();
          break;
        case 'server-hum':
          this.startServerHumSoundscape();
          break;
        case 'tokyo-rain':
          this.startTokyoRainSoundscape();
          break;
        case 'synthwave-breeze':
          this.startSynthwaveBreezeSoundscape();
          break;
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * 1. CYBER SPACE SOUNDSCAPE:
   * Deep 55Hz sub-bass with gentle LFO modulation and celestial arpeggios
   */
  private startCyberSpaceSoundscape() {
    if (!this.ctx || !this.ambientMasterGain) return;

    // Sub-bass sine
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    // Bandpass resonant filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // LFO to sweep bandpass center
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(60, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    subOsc.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.ambientMasterGain);

    subOsc.start();
    lfo.start();

    this.activeNodes.push(subOsc, subGain, filter, lfo, lfoGain);

    // Gentle celestial periodic ping notes
    const notes = [440, 554.37, 659.25, 880, 1108.7];
    const timer = window.setInterval(() => {
      if (!this.ctx || !this.ambientMasterGain || this.isMuted) return;
      const note = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ambientMasterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.25);
    }, 1800);

    this.activeTimers.push(timer);
  }

  /**
   * 2. SERVER ROOM HUM SOUNDSCAPE:
   * Continuous filtered airflow noise with 60Hz transformer tone
   */
  private startServerHumSoundscape() {
    if (!this.ctx || !this.ambientMasterGain) return;

    const noiseBuffer = this.createNoiseBuffer(4);
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Airflow lowpass filter
    const airFilter = this.ctx.createBiquadFilter();
    airFilter.type = 'lowpass';
    airFilter.frequency.setValueAtTime(340, this.ctx.currentTime);
    airFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    noiseSource.connect(airFilter);
    airFilter.connect(noiseGain);
    noiseGain.connect(this.ambientMasterGain);
    noiseSource.start();

    // 60Hz server power hum
    const humOsc = this.ctx.createOscillator();
    humOsc.type = 'triangle';
    humOsc.frequency.setValueAtTime(60, this.ctx.currentTime);

    const humGain = this.ctx.createGain();
    humGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

    humOsc.connect(humGain);
    humGain.connect(this.ambientMasterGain);
    humOsc.start();

    this.activeNodes.push(noiseSource, airFilter, noiseGain, humOsc, humGain);

    // Micro telemetry packet chirps
    const timer = window.setInterval(() => {
      if (!this.ctx || !this.ambientMasterGain || this.isMuted) return;
      const blipOsc = this.ctx.createOscillator();
      const blipGain = this.ctx.createGain();

      blipOsc.type = 'sine';
      blipOsc.frequency.setValueAtTime(2400 + Math.random() * 800, this.ctx.currentTime);

      blipGain.gain.setValueAtTime(0.008, this.ctx.currentTime);
      blipGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      blipOsc.connect(blipGain);
      blipGain.connect(this.ambientMasterGain);

      blipOsc.start();
      blipOsc.stop(this.ctx.currentTime + 0.04);
    }, 900);

    this.activeTimers.push(timer);
  }

  /**
   * 3. TOKYO RAIN SOUNDSCAPE:
   * Continuous gentle rainfall noise generator with warm harmonic drops
   */
  private startTokyoRainSoundscape() {
    if (!this.ctx || !this.ambientMasterGain) return;

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(850, this.ctx.currentTime);
    rainFilter.Q.setValueAtTime(0.65, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.ambientMasterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, rainFilter, rainGain);

    // Ambient warm pentatonic waterdrops
    const pentatonic = [587.33, 659.25, 783.99, 880, 1046.5];
    const timer = window.setInterval(() => {
      if (!this.ctx || !this.ambientMasterGain || this.isMuted) return;
      const pitch = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(pitch * 0.7, this.ctx.currentTime + 0.15);

      dropGain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

      dropOsc.connect(dropGain);
      dropGain.connect(this.ambientMasterGain);

      dropOsc.start();
      dropOsc.stop(this.ctx.currentTime + 0.6);
    }, 1400);

    this.activeTimers.push(timer);
  }

  /**
   * 4. SYNTHWAVE BREEZE SOUNDSCAPE:
   * Polyphonic warm analog detuned chords with resonant sweep
   */
  private startSynthwaveBreezeSoundscape() {
    if (!this.ctx || !this.ambientMasterGain) return;

    // A minor 9 chord [220 (A3), 261.6 (C4), 329.6 (E4), 392 (G4)]
    const chord = [220, 261.63, 329.63, 392.0];

    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // Slow filter cutoff sweep
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      // Subtle detune for analog warmth
      osc.frequency.setValueAtTime(freq + (idx - 1.5) * 0.4, this.ctx.currentTime);
      osc.connect(filter);
      osc.start();
      this.activeNodes.push(osc);
    });

    filter.connect(chordGain);
    chordGain.connect(this.ambientMasterGain);
    lfo.start();

    this.activeNodes.push(chordGain, filter, lfo, lfoGain);
  }
}

export const soundManager = new SoundEffectsManager();
