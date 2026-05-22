/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// A lightweight, zero-dependency  browser-native synthesizer and announcer
class AudioPlayer {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechRate: number = 0.75; // Slower rate for children reading phonics

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  // Play a beautiful, sparkling success chime using pure oscillator math
  public playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // We will play 4 shimmering notes ascending in a major arpeggio
      // C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const time = now + index * 0.12;
        
        // Main tone
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = 'triangle'; // friendly flute-like timbre
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        
        osc.start(time);
        osc.stop(time + 0.5);

        // Sparkle harmonic (higher sine wave)
        const harmOsc = this.ctx!.createOscillator();
        const harmGain = this.ctx!.createGain();
        harmOsc.connect(harmGain);
        harmGain.connect(this.ctx!.destination);
        
        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(freq * 2, time); // 1 octave up
        
        harmGain.gain.setValueAtTime(0, time);
        harmGain.gain.linearRampToValueAtTime(0.05, time + 0.02);
        harmGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        
        harmOsc.start(time);
        harmOsc.stop(time + 0.4);
      });
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }

  // Soft, satisfying bubble pop sound for hovering/dwelling
  public playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }

  // Gentle wood-block tactile sound for loading ticks
  public playTick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }

  // Soft, low-pitched gentle chime for neutral errors
  public playIncorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }

  // Speak a word or phrase using Browser Synthesis (voiceover disabled)
  public speak(text: string) {
    // Zero text-to-speech voiceover as requested
  }

  // Phonic sounding: e.g. "c - a - t" -> "cat" (voiceover disabled)
  public speakPhonicsAndBlend(word: string, parts: string[]) {
    // Zero text-to-speech voiceover as requested
  }

  // Speak a single letter phonics sound for First Sounds mode
  public speakPhonicLetter(letter: string) {
    if (!this.soundEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const char = letter.toLowerCase();
        const phonicSounds: Record<string, string> = {
          a: 'ah ... ah ... as in apple',
          b: 'buh ... buh ... as in bat',
          c: 'cuh ... cuh ... as in cat',
          d: 'duh ... duh ... as in dog',
          e: 'eh ... eh ... as in egg',
          f: 'fff ... fff ... as in fish',
          g: 'guh ... guh ... as in goat',
          h: 'huh ... huh ... as in hen',
          i: 'ih ... ih ... as in ink',
          j: 'juh ... juh ... as in jet',
          k: 'cuh ... cuh ... as in king',
          l: 'ull ... ull ... as in log',
          m: 'mmm ... mmm ... as in map',
          n: 'nnn ... nnn ... as in net',
          o: 'ah ... ah ... as in octopus',
          p: 'puh ... puh ... as in pig',
          q: 'quuh ... quuh ... as in queen',
          r: 'err ... err ... as in ring',
          s: 'sss ... sss ... as in sun',
          t: 'tuh ... ... as in tent',
          u: 'uh ... uh ... as in up',
          v: 'vvv ... vvv ... as in van',
          w: 'wuh ... wuh ... as in wig',
          x: 'ks ... ks ... as in box',
          y: 'yuh ... yuh ... as in yellow',
          z: 'zzz ... zzz ... as in zebra'
        };
        
        const phonicDescription = phonicSounds[char] || `${char} sound`;
        const textToSpeak = `The letter ${char} makes the sound: ${phonicDescription}`;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.55; // slow, clear pronunciation for young learners
        utterance.pitch = 1.15; // friendly pitch for children
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha'))
        ) || voices.find(v => v.lang.startsWith('en'));
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Letter phonic speech failed:', e);
    }
  }
}

export const audio = new AudioPlayer();
