/**
 * Constelações — Módulo de Áudio Procedural
 * Paisagem sonora contemplativa e eventos interativos utilizando a Web Audio API.
 * Toda a harmonia (ambiência, toques de constelações e colisões de solitários)
 * está unificada na tonalidade de Ré Menor (Dm).
 */

class AmbientSoundscape {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.oscillators = [];
    this.ambientFilter = null;
    this.lfo = null;
    this.touchChordIndex = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // 1. Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // 2. Barramento de Efeitos Sonoros (SFX)
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    // 3. Barramento da Música Ambiente (Drone)
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    // 4. Filtro Passa-Baixas aveludado e quente para a ambiência
    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(285, this.ctx.currentTime);
    this.ambientFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    this.ambientFilter.connect(this.ambientGain);

    // 5. Acorde contínuo em Ré Menor (Dm9 atmosférico / Dm add9)
    // Notas: D2 (73.42Hz), A2 (110.00Hz), D3 (146.83Hz), F3 (174.61Hz - terça menor melancólica),
    // A3 (220.00Hz - quinta justa), C4 (261.63Hz - sétima menor), E4 (329.63Hz - nona etérea)
    const dmAmbientFreqs = [73.42, 110.00, 146.83, 174.61, 220.00, 261.63, 329.63];

    dmAmbientFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Alternância de ondas senoidais e triangulares para riqueza harmônica
      osc.type = (idx === 0 || idx % 2 === 0) ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Micro desafinação binaural lenta para respiro orgânico
      const detuneAmount = (idx - 3) * 2.6;
      osc.detune.setValueAtTime(detuneAmount, this.ctx.currentTime);

      // Ganho balanceado para cada harmônico
      const baseGain = 0.075 / (idx * 0.45 + 1);
      oscGain.gain.setValueAtTime(baseGain, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.ambientFilter);
      osc.start();
      this.oscillators.push({ osc, gain: oscGain, baseFreq: freq });
    });

    // 6. LFO para respiração sutil do filtro (arfar lento da noite de ~13 segundos)
    this.lfo = this.ctx.createOscillator();
    this.lfoGain = this.ctx.createGain();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.075, this.ctx.currentTime);
    this.lfoGain.gain.setValueAtTime(75, this.ctx.currentTime);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.ambientFilter.frequency);
    this.lfo.start();
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.ensureContext();

    if (!this.isPlaying) {
      this.start();
      return true;
    } else {
      this.stop();
      return false;
    }
  }

  start() {
    this.ensureContext();
    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    // Fade in suave de 2.5 segundos (garantir valor > 0 antes de ramp exponencial)
    const curVal = Math.max(0.0001, this.ambientGain.gain.value);
    this.ambientGain.gain.setValueAtTime(curVal, now);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.24, now + 2.5);
  }

  stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;
    const now = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    // Fade out suave de 1.8 segundos (garantir valor > 0 antes de ramp exponencial)
    const curVal = Math.max(0.0001, this.ambientGain.gain.value);
    this.ambientGain.gain.setValueAtTime(curVal, now);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
  }

  /**
   * Som suave, luminoso e etéreo para o toque entre as Constelações.
   * Acorde celestial em Ré Menor (Dm) com sobretons cristalinos e decaimento aveludado.
   * @param {number} intensity - Força do toque (0.5 a 1.5)
   * @param {number} panX - Posição horizontal normalizada (0.0 a 1.0) para espacialização
   */
  triggerConstellationTouch(intensity = 1.0, panX = 0.5) {
    if (!this.isPlaying || !this.ctx) return;
    try {
      this.ensureContext();

      const now = this.ctx.currentTime;
      const clampedIntensity = Math.min(1.5, Math.max(0.5, intensity));

      // Voicings celestiais do acorde de Dm (D, F, A, C, E) em oitavas superiores
      const voicings = [
        [293.66, 440.00, 587.33], // D4, A4, D5 (pureza harmônica)
        [349.23, 523.25, 698.46], // F4, C5, F5 (terça menor luminosa)
        [440.00, 659.25, 880.00], // A4, E5, A5 (quinta com nona celestial)
        [587.33, 698.46, 880.00]  // D5, F5, A5 (tríade celestial completa de Dm)
      ];

      this.touchChordIndex = (this.touchChordIndex + 1) % voicings.length;
      const notes = voicings[this.touchChordIndex];

      // Panning estéreo suave baseado na posição X da tela
      let panner = null;
      if (typeof this.ctx.createStereoPanner === 'function') {
        panner = this.ctx.createStereoPanner();
        const panValue = Math.max(-0.7, Math.min(0.7, (panX - 0.5) * 1.4));
        panner.pan.setValueAtTime(panValue, now);
        panner.connect(this.sfxGain);
      }

      // Filtro quente para eliminar qualquer aresta aguda do sino cósmico
      const touchFilter = this.ctx.createBiquadFilter();
      touchFilter.type = 'lowpass';
      touchFilter.frequency.setValueAtTime(1600, now);
      touchFilter.Q.setValueAtTime(0.8, now);

      if (panner) {
        touchFilter.connect(panner);
      } else {
        touchFilter.connect(this.sfxGain);
      }

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Micro delay de ataque entre as notas (arpejo sutil de 25ms)
        const noteDelay = idx * 0.025;
        const startTime = now + noteDelay;

        // Ataque suave sem cliques (40ms) e decaimento expansivo de ~1.8s
        const noteGain = (0.038 / (idx * 0.3 + 1)) * clampedIntensity;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(noteGain, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(touchFilter);

        osc.start(startTime);
        osc.stop(startTime + 1.9);
      });
    } catch (err) {
      console.warn('Erro ao reproduzir toque de constelações:', err);
    }
  }

  /**
   * Som mais baixo e mais triste para o choque dos estudantes solitários.
   * Registro grave em Ré Menor (Dm), com ênfase na terça menor melancólica (Fá)
   * e timbre aveludado/opaco de violoncelo abafado na escuridão.
   * @param {number} intensity - Intensidade do choque (0.5 a 1.5)
   * @param {number} panX - Posição horizontal normalizada (0.0 a 1.0)
   */
  triggerSolitaryCollision(intensity = 1.0, panX = 0.5) {
    if (!this.isPlaying || !this.ctx) return;
    try {
      this.ensureContext();

      const now = this.ctx.currentTime;
      const clampedIntensity = Math.min(1.4, Math.max(0.4, intensity));

      // Espacialização estéreo sutil
      let panner = null;
      if (typeof this.ctx.createStereoPanner === 'function') {
        panner = this.ctx.createStereoPanner();
        const panValue = Math.max(-0.7, Math.min(0.7, (panX - 0.5) * 1.4));
        panner.pan.setValueAtTime(panValue, now);
        panner.connect(this.sfxGain);
      }

      // Filtro passa-baixas fechado e ressonante para dar o caráter oco, distante e abafado
      const solitaryFilter = this.ctx.createBiquadFilter();
      solitaryFilter.type = 'lowpass';
      solitaryFilter.frequency.setValueAtTime(220, now);
      solitaryFilter.Q.setValueAtTime(2.2, now);

      if (panner) {
        solitaryFilter.connect(panner);
      } else {
        solitaryFilter.connect(this.sfxGain);
      }

      // Notas fundamentais graves de Ré Menor:
      // D3 (146.83Hz) com a terça menor melancólica F3 (174.61Hz) e sub-grave de D2 (73.42Hz)
      const tones = [
        { freq: 146.83, type: 'triangle', gain: 0.022, decay: 1.1 }, // Ré grave (corpo oco)
        { freq: 174.61, type: 'sine',     gain: 0.018, decay: 0.95 }, // Fá menor (a dor melancólica da solidão)
        { freq: 73.42,  type: 'sine',     gain: 0.015, decay: 0.85 }  // Sub-Ré (peso e vazio)
      ];

      tones.forEach((tone) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.freq, now);

        // Micro inflexão descendente (inflexão de lamento / tristeza sutil de ~15 cents)
        osc.frequency.exponentialRampToValueAtTime(tone.freq * 0.985, now + 0.35);

        const targetGain = tone.gain * clampedIntensity;

        // Ataque suave (16ms) e decaimento lento opaco
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(targetGain, now + 0.016);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + tone.decay);

        osc.connect(gain);
        gain.connect(solitaryFilter);

        osc.start(now);
        osc.stop(now + tone.decay + 0.1);
      });
    } catch (err) {
      console.warn('Erro ao reproduzir choque de solitários:', err);
    }
  }

  // Micro-interação sonora ao passar o cursor ou clicar (ajustada para harmonia em Dm)
  triggerChime(pitchMultiplier = 1.0) {
    if (!this.isPlaying || !this.ctx) return;
    try {
      this.ensureContext();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Notas em Dm: A4 (440Hz) ascendendo para D5 (587.33Hz)
      const baseFreq = 440.0 * pitchMultiplier;
      const targetFreq = 587.33 * pitchMultiplier;

      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.32);

      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 1.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (err) {
      console.warn('Erro ao reproduzir chime:', err);
    }
  }
}

window.soundscape = new AmbientSoundscape();
