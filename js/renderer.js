/**
 * Velas na Escuridão — Motor de Renderização Gráfica
 * Renderização em Canvas 2D de alta performance com mistura aditiva ("lighter")
 * e sprites pré-renderizados para garantir 60 FPS estáveis com 1.000 focos de luz.
 */

class CandleRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Cores ativas
    this.bgColor = '#140916';
    this.colors = {
      connectedBoy: '#13f8fb',
      connectedGirl: '#f87272',
      solitaryBoy: '#8aeef0',
      solitaryGirl: '#feb4b4'
    };

    // Cache de sprites pré-renderizados
    this.sprites = {
      boyConnected: null,
      girlConnected: null,
      boySolitary: null,
      girlSolitary: null,
      spark: null
    };

    this.initCanvasSize();
    this.createOffscreenSprites();
  }

  initCanvasSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  resize() {
    this.initCanvasSize();
  }

  /**
   * Converte código hexadecimal (#RRGGBB ou #RGB) para objeto {r, g, b}.
   */
  hexToRgb(hex) {
    let c = (hex || '#ffffff').replace('#', '').trim();
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  /**
   * Gera um sprite offscreen para qualquer cor hexadecimal selecionada em tempo real.
   */
  createCandleSprite(hex, isSolitary = false) {
    const size = 128;
    const center = size / 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const rgb = this.hexToRgb(hex);

    // Núcleo incandescente e acolhedor (iluminado suavemente com branco)
    const coreR = Math.min(255, Math.round(rgb.r * 0.42 + 255 * 0.58));
    const coreG = Math.min(255, Math.round(rgb.g * 0.42 + 255 * 0.58));
    const coreB = Math.min(255, Math.round(rgb.b * 0.42 + 255 * 0.58));

    // Bordas mais densas e profundas
    const edgeR = Math.max(0, Math.round(rgb.r * 0.70));
    const edgeG = Math.max(0, Math.round(rgb.g * 0.70));
    const edgeB = Math.max(0, Math.round(rgb.b * 0.70));

    const darkR = Math.max(0, Math.round(rgb.r * 0.45));
    const darkG = Math.max(0, Math.round(rgb.g * 0.45));
    const darkB = Math.max(0, Math.round(rgb.b * 0.45));

    const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
    grad.addColorStop(0, `rgba(${coreR}, ${coreG}, ${coreB}, 0.94)`);
    grad.addColorStop(0.15, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.78)`);
    grad.addColorStop(0.38, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.30)`);
    grad.addColorStop(0.68, `rgba(${edgeR}, ${edgeG}, ${edgeB}, 0.08)`);
    grad.addColorStop(1.0, `rgba(${darkR}, ${darkG}, ${darkB}, 0.0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  /**
   * Pré-renderiza sprites de alta fidelidade em offscreen canvases.
   */
  createOffscreenSprites() {
    this.sprites.boyConnected = this.createCandleSprite(this.colors.connectedBoy, false);
    this.sprites.girlConnected = this.createCandleSprite(this.colors.connectedGirl, false);
    this.sprites.boySolitary = this.createCandleSprite(this.colors.solitaryBoy, true);
    this.sprites.girlSolitary = this.createCandleSprite(this.colors.solitaryGirl, true);

    // Sprite Faísca (Micro-ember de interação com mouse)
    const sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = 32;
    sparkCanvas.height = 32;
    const sCtx = sparkCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    sGrad.addColorStop(0, 'rgba(255, 250, 220, 1.0)');
    sGrad.addColorStop(0.4, 'rgba(255, 214, 112, 0.6)');
    sGrad.addColorStop(1.0, 'rgba(217, 119, 6, 0.0)');
    sCtx.fillStyle = sGrad;
    sCtx.beginPath();
    sCtx.arc(16, 16, 16, 0, Math.PI * 2);
    sCtx.fill();
    this.sprites.spark = sparkCanvas;
  }

  /**
   * Atualiza as cores customizadas em tempo real.
   */
  updateColors(newColors = {}) {
    if (newColors.background) {
      this.bgColor = newColors.background;
      this.canvas.style.backgroundColor = newColors.background;
    }
    if (newColors.connectedBoy) {
      this.colors.connectedBoy = newColors.connectedBoy;
      this.sprites.boyConnected = this.createCandleSprite(newColors.connectedBoy, false);
    }
    if (newColors.connectedGirl) {
      this.colors.connectedGirl = newColors.connectedGirl;
      this.sprites.girlConnected = this.createCandleSprite(newColors.connectedGirl, false);
    }
    if (newColors.solitaryBoy) {
      this.colors.solitaryBoy = newColors.solitaryBoy;
      this.sprites.boySolitary = this.createCandleSprite(newColors.solitaryBoy, true);
    }
    if (newColors.solitaryGirl) {
      this.colors.solitaryGirl = newColors.solitaryGirl;
      this.sprites.girlSolitary = this.createCandleSprite(newColors.solitaryGirl, true);
    }
  }

  /**
   * Limpa a tela com o tom escuro configurado.
   */
  clear() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = this.bgColor || '#050507';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Prepara o modo de mistura aditiva de luz.
   */
  beginAdditiveBlending() {
    this.ctx.globalCompositeOperation = 'lighter';
  }

  /**
   * Desenha uma única vela com cálculo senoidal de tremor (flicker).
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {number} radius - Raio base
   * @param {string} gender - 'boy' ou 'girl'
   * @param {boolean} isSolitary - Se é solitário (esverdeado/roxo atenuado) ou fogueira (amarelo/vermelho)
   * @param {number} flicker - Multiplicador de tremor (R ± 4%)
   * @param {number} opacityMod - Modificador de opacidade para filtros
   * @param {number} hoverIntensity - Intensidade suave de hover do mouse (0.0 a 1.0)
   * @param {boolean} isMinor - Se é ponto menor representando fração de 0,1%
   */
  drawCandle(x, y, radius, gender, isSolitary = false, flicker = 1.0, opacityMod = 1.0, hoverIntensity = 0.0, isMinor = false) {
    if (opacityMod <= 0.01) return;

    let sprite;
    if (isSolitary) {
      sprite = gender === 'boy' ? this.sprites.boySolitary : this.sprites.girlSolitary;
    } else {
      sprite = gender === 'boy' ? this.sprites.boyConnected : this.sprites.girlConnected;
    }

    const hover = Math.max(0, Math.min(1.0, hoverIntensity || 0.0));

    // Aumento de diâmetro (halo expandido) e luminosidade ao passar o mouse
    const radiusMultiplier = 1.0 + hover * 0.28;
    const currentRadius = radius * flicker * radiusMultiplier;
    const diameter = currentRadius * 2;

    // Solitários têm baseAlpha 0.65 (brilham suavemente).
    // Pontos menores (0,1%) recebem nitidez sutil para destaque estelar.
    const baseAlpha = isMinor 
      ? (isSolitary ? 0.80 : 0.68)
      : (isSolitary ? 0.65 : 0.50);
    const boostedAlpha = Math.min(1.0, baseAlpha + hover * 0.32);

    this.ctx.globalAlpha = Math.min(1.0, Math.max(0.04, boostedAlpha * flicker * opacityMod));
    
    this.ctx.drawImage(
      sprite,
      x - currentRadius,
      y - currentRadius,
      diameter,
      diameter
    );

    // Quando em hover, desenha um núcleo aditivo concentrado para intensificar poeticamente o brilho da chama
    if (hover > 0.06) {
      const coreRadius = currentRadius * 0.58;
      this.ctx.globalAlpha = hover * 0.45 * opacityMod;
      this.ctx.drawImage(
        sprite,
        x - coreRadius,
        y - coreRadius,
        coreRadius * 2,
        coreRadius * 2
      );
    }
  }

  /**
   * Desenha a cauda autêntica de cometa: uma esteira curta, delgada e reta,
   * orientada estritamente no sentido oposto ao movimento.
   * Utiliza blits de sprites GPU cacheados sem nenhuma alocação dinâmica de gradientes,
   * garantindo 60 FPS ultrarrápidos e zero travamento no navegador.
   * @param {Object} s - O estudante solitário
   * @param {number} opacityMod - Modificador de opacidade para filtros
   */
  drawCometTail(s, opacityMod = 1.0) {
    if (opacityMod <= 0.02 || !s.tailDir) return;

    const isGirl = s.gender === 'girl';
    const sprite = isGirl ? this.sprites.girlSolitary : this.sprites.boySolitary;
    const hover = Math.max(0, Math.min(1.0, s.hoverIntensity || 0.0));
    const hoverBoost = 1.0 + hover * 0.35;

    const dirX = s.tailDir.x;
    const dirY = s.tailDir.y;
    const rad = s.radius;

    // 1. Foco proximal (junto à chama, largura ~7px)
    const r1 = rad * 0.36 * hoverBoost;
    this.ctx.globalAlpha = Math.min(1.0, 0.20 * opacityMod * hoverBoost);
    this.ctx.drawImage(sprite, (s.x + dirX * 6) - r1, (s.y + dirY * 6) - r1, r1 * 2, r1 * 2);

    // 2. Foco intermediário (afunilando, largura ~4.5px)
    const r2 = rad * 0.22 * hoverBoost;
    this.ctx.globalAlpha = Math.min(1.0, 0.09 * opacityMod * hoverBoost);
    this.ctx.drawImage(sprite, (s.x + dirX * 12) - r2, (s.y + dirY * 12) - r2, r2 * 2, r2 * 2);

    // 3. Foco distal (ponta delgada que se extingue no breu, alcance ~18px)
    const r3 = rad * 0.12 * hoverBoost;
    this.ctx.globalAlpha = Math.min(1.0, 0.035 * opacityMod * hoverBoost);
    this.ctx.drawImage(sprite, (s.x + dirX * 17) - r3, (s.y + dirY * 17) - r3, r3 * 2, r3 * 2);
  }

  /**
   * Desenha faíscas emitidas pelo movimento do mouse.
   */
  drawSparks(sparks) {
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i];
      if (s.life <= 0) continue;
      const r = s.radius * s.life;
      this.ctx.globalAlpha = s.life * 0.75;
      this.ctx.drawImage(
        this.sprites.spark,
        s.x - r,
        s.y - r,
        r * 2,
        r * 2
      );
    }
  }

  /**
   * Desenha anéis de onda luminosa ao clicar.
   */
  drawRipples(ripples) {
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      if (r.life <= 0) continue;
      
      const grad = this.ctx.createRadialGradient(r.x, r.y, Math.max(0, r.radius - 12), r.x, r.y, r.radius + 12);
      grad.addColorStop(0, 'rgba(255, 214, 112, 0)');
      grad.addColorStop(0.5, `rgba(255, 230, 160, ${r.life * 0.18})`);
      grad.addColorStop(1, 'rgba(255, 214, 112, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius + 12, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Desenha uma vinheta sutil nos cantos para intensificar o vazio circundante.
   */
  drawVignette() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 0.22;
    const grad = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, Math.min(this.width, this.height) * 0.45,
      this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.75
    );
    grad.addColorStop(0, 'rgba(5, 5, 7, 0)');
    grad.addColorStop(1, 'rgba(2, 2, 3, 0.85)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalAlpha = 1.0;
  }
}

window.CandleRenderer = CandleRenderer;
