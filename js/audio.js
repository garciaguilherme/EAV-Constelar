/**
 * Velas na Escuridão — Módulo de Áudio Procedural
 * Cria uma paisagem sonora contemplativa, etérea e acolhedora utilizando a Web Audio API.
 * Sem dependências de arquivos de áudio externos.
 */

class AmbientSoundscape {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
    this.filter = null;
    this.lfo = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Filtro Passa-Baixas quente e aveludado
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    // Acorde etéreo contemplativo (Lá menor com nona / Am9 atmosférico: A2, E3, B3, C4, E4)
    // Frequências: 110Hz, 164.81Hz, 246.94Hz, 261.63Hz, 329.63Hz
    const freqs = [110.0, 164.81, 246.94, 261.63, 329.63];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Formas de onda suaves (seno e triângulo para calor harmônico)
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Micro desafinação estéreo/binaural para respiro orgânico
      const detuneAmount = (idx - 2) * 3.5;
      osc.detune.setValueAtTime(detuneAmount, this.ctx.currentTime);

      // Ganho individual atenuado
      const baseGain = 0.08 / (idx + 1);
      oscGain.gain.setValueAtTime(baseGain, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filter);
      osc.start();
      this.oscillators.push({ osc, gain: oscGain, baseFreq: freq });
    });

    // LFO para respiração sutil do filtro (arfar da noite)
    this.lfo = this.ctx.createOscillator();
    this.lfoGain = this.ctx.createGain();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // Ciclo lento de ~12 segundos
    this.lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);
    this.lfo.start();
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      this.start();
      return true;
    } else {
      this.stop();
      return false;
    }
  }

  start() {
    if (!this.ctx) this.init();
    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    // Fade in suave de 2.5 segundos
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.22, now + 2.5);
  }

  stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    // Fade out suave de 1.8 segundos
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
  }

  // Micro-interação sonora ao passar o cursor ou clicar
  triggerChime(pitchMultiplier = 1.0) {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25 * pitchMultiplier, now); // C5 harmônico
    osc.frequency.exponentialRampToValueAtTime(659.25 * pitchMultiplier, now + 0.35);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }
}

window.soundscape = new AmbientSoundscape();
