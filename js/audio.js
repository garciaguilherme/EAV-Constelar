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
    this.solitaryChordIndex = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // 1. Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    // Compressor suave para garantir calor aveludado e evitar distorção/clipping
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(25, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.006, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);

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
   * Som de Órgão Celestial (Flauta / Registros superiores) para o toque entre Constelações.
   * Acorde aveludado em Ré Menor (Dm) com sobretons de flauta de órgão e decaimento quente (~2.5s).
   * @param {number} intensity - Força do toque (0.5 a 1.5)
   * @param {number} panX - Posição horizontal normalizada (0.0 a 1.0) para espacialização
   */
  triggerConstellationTouch(intensity = 1.0, panX = 0.5) {
    if (!this.isPlaying || !this.ctx) return;
    try {
      this.ensureContext();

      const now = this.ctx.currentTime;
      const clampedIntensity = Math.min(1.4, Math.max(0.45, intensity));

      // Voicings celestiais de flauta de órgão em Ré Menor (D, F, A, C)
      const voicings = [
        [
          { freq: 220.00, type: 'sine', gain: 0.026, detune: -1.5 }, // A3
          { freq: 293.66, type: 'triangle', gain: 0.022, detune: 1.8 }, // D4
          { freq: 349.23, type: 'sine', gain: 0.019, detune: -2.1 }, // F4
          { freq: 440.00, type: 'sine', gain: 0.015, detune: 1.6 }   // A4
        ],
        [
          { freq: 174.61, type: 'sine', gain: 0.028, detune: 1.5 },  // F3
          { freq: 261.63, type: 'triangle', gain: 0.022, detune: -1.7 }, // C4
          { freq: 349.23, type: 'sine', gain: 0.018, detune: 2.0 }, // F4
          { freq: 523.25, type: 'sine', gain: 0.014, detune: -1.8 }  // C5
        ],
        [
          { freq: 146.83, type: 'sine', gain: 0.028, detune: -1.8 }, // D3
          { freq: 220.00, type: 'triangle', gain: 0.024, detune: 1.6 }, // A3
          { freq: 293.66, type: 'sine', gain: 0.020, detune: -2.0 }, // D4
          { freq: 440.00, type: 'sine', gain: 0.016, detune: 2.2 }   // A4
        ]
      ];

      this.touchChordIndex = (this.touchChordIndex + 1) % voicings.length;
      const chord = voicings[this.touchChordIndex];

      // Panning estéreo suave baseado na posição X da tela
      let panner = null;
      if (typeof this.ctx.createStereoPanner === 'function') {
        panner = this.ctx.createStereoPanner();
        const panValue = Math.max(-0.7, Math.min(0.7, (panX - 0.5) * 1.35));
        panner.pan.setValueAtTime(panValue, now);
        panner.connect(this.sfxGain);
      }

      // Filtro quente e musical eliminando arestas agudas para timbre de flauta de órgão
      const touchFilter = this.ctx.createBiquadFilter();
      touchFilter.type = 'lowpass';
      touchFilter.frequency.setValueAtTime(750, now);
      touchFilter.Q.setValueAtTime(1.1, now);

      if (panner) {
        touchFilter.connect(panner);
      } else {
        touchFilter.connect(this.sfxGain);
      }

      const totalDuration = 2.6;

      chord.forEach((pipe, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = pipe.type;
        osc.frequency.setValueAtTime(pipe.freq, now);
        osc.detune.setValueAtTime(pipe.detune, now);

        const noteDelay = idx * 0.035; // Leve arpejo de sopro
        const startTime = now + noteDelay;
        const targetGain = pipe.gain * clampedIntensity;

        gain.gain.setValueAtTime(0.00001, startTime);
        gain.gain.exponentialRampToValueAtTime(targetGain, startTime + 0.07);
        gain.gain.setValueAtTime(targetGain, startTime + 0.9);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDuration);

        osc.connect(gain);
        gain.connect(touchFilter);

        osc.start(startTime);
        osc.stop(startTime + totalDuration + 0.1);
      });
    } catch (err) {
      console.warn('Erro ao reproduzir toque de constelações:', err);
    }
  }

  /**
   * Som de Órgão Sacro/Ambiental para o choque entre elementos.
   * Acorde grave e ressonante de órgão de tubos (pedaleira sub-grave 16' e 8', quinta e terça menor em Ré Menor - Dm),
   * perfeitamente afinado com a ambiência contínua, com ataque de sopro de ar suave (~90ms),
   * corpo majestoso e longa cauda de reverberação de catedral (~3.5 a 4.0 segundos).
   * @param {number} intensity - Intensidade do choque (0.5 a 1.5)
   * @param {number} panX - Posição horizontal normalizada (0.0 a 1.0)
   */
  triggerSolitaryCollision(intensity = 1.0, panX = 0.5) {
    if (!this.isPlaying || !this.ctx) return;
    try {
      this.ensureContext();

      const now = this.ctx.currentTime;
      const clampedIntensity = Math.min(1.4, Math.max(0.45, intensity));

      // Espacialização estéreo suave baseada no ponto de choque
      let panner = null;
      if (typeof this.ctx.createStereoPanner === 'function') {
        panner = this.ctx.createStereoPanner();
        const panValue = Math.max(-0.7, Math.min(0.7, (panX - 0.5) * 1.35));
        panner.pan.setValueAtTime(panValue, now);
        panner.connect(this.sfxGain);
      }

      // Filtro passa-baixas quente para dar a textura de madeira/ar de tubos de órgão
      // Em harmonia tonal com o filtro da ambiência (285Hz)
      const organFilter = this.ctx.createBiquadFilter();
      organFilter.type = 'lowpass';
      organFilter.frequency.setValueAtTime(360, now);
      organFilter.Q.setValueAtTime(1.4, now);

      if (panner) {
        organFilter.connect(panner);
      } else {
        organFilter.connect(this.sfxGain);
      }

      // Voicings de Órgão Sacro em Ré Menor (Dm) com pedaleiras bem graves:
      // Frequências fundamentais: D1 (36.71Hz), A1 (55.00Hz), D2 (73.42Hz), F2 (87.31Hz), A2 (110.00Hz), D3 (146.83Hz), F3 (174.61Hz)
      const voicings = [
        // 1. Órgão Dm Fundamental Profundo (Pedaleira Sub-D1 16' + D2 8' + Quinta A2 + Oitava D3 + Terça F3)
        [
          { freq: 36.71, type: 'sine',     gain: 0.040, detune: 0 },
          { freq: 73.42, type: 'triangle', gain: 0.034, detune: -1.8 },
          { freq: 110.00, type: 'sine',    gain: 0.026, detune: 1.6 },
          { freq: 146.83, type: 'triangle',gain: 0.022, detune: -2.2 },
          { freq: 174.61, type: 'sine',    gain: 0.024, detune: 2.1 }
        ],
        // 2. Órgão Dm7 Contemplativo (Pedal Quinta A1 + Pedaleira D2 + Sétima C3 + Terça F3)
        [
          { freq: 55.00, type: 'sine',     gain: 0.038, detune: 0 },
          { freq: 73.42, type: 'triangle', gain: 0.032, detune: 2.0 },
          { freq: 110.00, type: 'sine',    gain: 0.025, detune: -1.7 },
          { freq: 130.81, type: 'triangle',gain: 0.020, detune: 1.8 },
          { freq: 174.61, type: 'sine',    gain: 0.024, detune: -1.9 }
        ],
        // 3. Órgão Dm9 Noturno (Sub-pedal D1 + Terça grave F2 + Quinta A2 + Nona suave E3)
        [
          { freq: 36.71, type: 'sine',     gain: 0.040, detune: 0 },
          { freq: 87.31, type: 'triangle', gain: 0.028, detune: -1.6 },
          { freq: 110.00, type: 'sine',    gain: 0.024, detune: 2.3 },
          { freq: 146.83, type: 'triangle',gain: 0.020, detune: -1.8 },
          { freq: 164.81, type: 'sine',    gain: 0.018, detune: 1.5 }
        ],
        // 4. Órgão Dm Pleno de Catedral (D1 + D2 + A2 + D3 + F3 + A3)
        [
          { freq: 36.71, type: 'sine',     gain: 0.036, detune: 0 },
          { freq: 73.42, type: 'triangle', gain: 0.030, detune: 2.1 },
          { freq: 110.00, type: 'sine',    gain: 0.024, detune: -2.0 },
          { freq: 146.83, type: 'triangle',gain: 0.020, detune: 1.7 },
          { freq: 174.61, type: 'sine',    gain: 0.022, detune: -1.5 },
          { freq: 220.00, type: 'sine',    gain: 0.014, detune: 2.3 }
        ]
      ];

      this.solitaryChordIndex = (this.solitaryChordIndex + 1) % voicings.length;
      const chord = voicings[this.solitaryChordIndex];

      // Duração ampla: ataque de ar de ~90ms, corpo ressonante de ~1.2s e cauda de 3.6s
      const totalDuration = 3.6;

      chord.forEach((pipe) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = pipe.type;
        osc.frequency.setValueAtTime(pipe.freq, now);
        osc.detune.setValueAtTime(pipe.detune, now);

        const targetGain = pipe.gain * clampedIntensity;

        // Ataque de sopro de tubo de órgão (sem clique percussivo, entrada gradual suave)
        gain.gain.setValueAtTime(0.00001, now);
        gain.gain.exponentialRampToValueAtTime(targetGain, now + 0.09);

        // Sustentação do corpo do acorde de órgão antes da cauda de reverberação
        gain.gain.setValueAtTime(targetGain, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + totalDuration);

        osc.connect(gain);
        gain.connect(organFilter);

        osc.start(now);
        osc.stop(now + totalDuration + 0.1);
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
