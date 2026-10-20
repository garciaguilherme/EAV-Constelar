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

    // Cache de sprites pré-renderizados
    this.sprites = {
      boy: null,
      girl: null,
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
   * Pré-renderiza sprites de alta fidelidade em offscreen canvases.
   * Isso evita chamar createRadialGradient 60.000 vezes por segundo,
   * permitindo que o navegador utilize texturas GPU aceleradas.
   */
  createOffscreenSprites() {
    const size = 128;
    const center = size / 2;

    // 1. Sprite Fogueira / Menino Conectado (Vela Amarela / Dourada)
    const boyConnCanvas = document.createElement('canvas');
    boyConnCanvas.width = size;
    boyConnCanvas.height = size;
    const bcCtx = boyConnCanvas.getContext('2d');
    const bcGrad = bcCtx.createRadialGradient(center, center, 0, center, center, center);
    bcGrad.addColorStop(0, 'rgba(255, 250, 205, 0.88)');      // Núcleo solar acolhedor
    bcGrad.addColorStop(0.15, 'rgba(250, 204, 21, 0.76)');    // Chama viva amarela
    bcGrad.addColorStop(0.38, 'rgba(234, 179, 8, 0.30)');     // Halo amarelo dourado suave
    bcGrad.addColorStop(0.68, 'rgba(202, 138, 4, 0.08)');     // Borda suave âmbar
    bcGrad.addColorStop(1.0, 'rgba(161, 98, 7, 0.0)');        // Desvanecimento no escuro
    bcCtx.fillStyle = bcGrad;
    bcCtx.beginPath();
    bcCtx.arc(center, center, center, 0, Math.PI * 2);
    bcCtx.fill();
    this.sprites.boyConnected = boyConnCanvas;

    // 2. Sprite Fogueira / Menina Conectada (Vela Vermelha Rubra)
    const girlConnCanvas = document.createElement('canvas');
    girlConnCanvas.width = size;
    girlConnCanvas.height = size;
    const gcCtx = girlConnCanvas.getContext('2d');
    const gcGrad = gcCtx.createRadialGradient(center, center, 0, center, center, center);
    gcGrad.addColorStop(0, 'rgba(255, 225, 225, 0.88)');      // Núcleo incandescente suave
    gcGrad.addColorStop(0.15, 'rgba(248, 113, 113, 0.76)');   // Chama rubra coral viva
    gcGrad.addColorStop(0.38, 'rgba(239, 68, 68, 0.30)');     // Halo vermelho escarlate suave
    gcGrad.addColorStop(0.68, 'rgba(185, 28, 28, 0.08)');     // Borda rubi profunda
    gcGrad.addColorStop(1.0, 'rgba(153, 27, 27, 0.0)');       // Desvanecimento no escuro
    gcCtx.fillStyle = gcGrad;
    gcCtx.beginPath();
    gcCtx.arc(center, center, center, 0, Math.PI * 2);
    gcCtx.fill();
    this.sprites.girlConnected = girlConnCanvas;

    // 3. Sprite Menino Solitário (Esverdeado / Vela Verde Menta Atenuada)
    const boySolCanvas = document.createElement('canvas');
    boySolCanvas.width = size;
    boySolCanvas.height = size;
    const bsCtx = boySolCanvas.getContext('2d');
    const bsGrad = bsCtx.createRadialGradient(center, center, 0, center, center, center);
    bsGrad.addColorStop(0, 'rgba(220, 252, 231, 0.92)');     // Núcleo menta suave
    bsGrad.addColorStop(0.15, 'rgba(134, 239, 172, 0.75)');   // Verde claro suave
    bsGrad.addColorStop(0.40, 'rgba(34, 197, 94, 0.30)');    // Halo verde esmeralda atenuado
    bsGrad.addColorStop(0.70, 'rgba(21, 128, 61, 0.08)');     // Borda atenuada
    bsGrad.addColorStop(1.0, 'rgba(20, 83, 45, 0.0)');       // Desvanecimento no breu
    bsCtx.fillStyle = bsGrad;
    bsCtx.beginPath();
    bsCtx.arc(center, center, center, 0, Math.PI * 2);
    bsCtx.fill();
    this.sprites.boySolitary = boySolCanvas;

    // 4. Sprite Menina Solitária (Roxo / Violeta Efémero Atenuado)
    const girlSolCanvas = document.createElement('canvas');
    girlSolCanvas.width = size;
    girlSolCanvas.height = size;
    const gsCtx = girlSolCanvas.getContext('2d');
    const gsGrad = gsCtx.createRadialGradient(center, center, 0, center, center, center);
    gsGrad.addColorStop(0, 'rgba(250, 232, 255, 0.92)');     // Núcleo lavanda suave
    gsGrad.addColorStop(0.15, 'rgba(216, 180, 254, 0.75)');   // Violeta claro
    gsGrad.addColorStop(0.40, 'rgba(168, 85, 247, 0.30)');    // Halo roxo crepuscular
    gsGrad.addColorStop(0.70, 'rgba(126, 34, 206, 0.08)');    // Borda atenuada
    gsGrad.addColorStop(1.0, 'rgba(88, 28, 135, 0.0)');       // Desvanecimento no breu
    gsCtx.fillStyle = gsGrad;
    gsCtx.beginPath();
    gsCtx.arc(center, center, center, 0, Math.PI * 2);
    gsCtx.fill();
    this.sprites.girlSolitary = girlSolCanvas;

    // 5. Sprite Faísca (Micro-ember de interação com mouse)
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
   * Limpa a tela com o tom escuro absoluto (#050507).
   */
  clear() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = '#050507';
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
   */
  drawCandle(x, y, radius, gender, isSolitary = false, flicker = 1.0, opacityMod = 1.0, hoverIntensity = 0.0) {
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
    // Fogueiras: moderado de 0.90 para 0.50 para que a sobreposição aditiva entre os pontos
    // do cluster não aumente excessivamente a luminância nem sature em branco.
    const baseAlpha = isSolitary ? 0.65 : 0.50;
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
