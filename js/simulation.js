/**
 * Velas na Escuridão — Simulação Cinemática e Comportamental
 * Modela a física dos 1.000 estudantes (180 solitários e 180 fogueiras/820 conectados),
 * órbitas harmônicas de grupo, forças de repulsão social e interação com o observador.
 */

class CandleSimulation {
  constructor(config) {
    this.config = config || window.PENSE_DATA.config;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.solitaries = [];
    this.groups = [];
    this.sparks = [];
    this.ripples = [];

    this.mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      speed: 0,
      active: false,
      isDown: false,
      draggedItem: null,
      dragMoved: false
    };

    this.time = 0;
    this.isPaused = false;
    this.activeFilter = 'all'; // 'all' | 'solitary' | 'groups' | 'girls' | 'boys'

    this.init();
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  init() {
    this.time = 0;
    this.solitaries = [];
    this.groups = [];
    this.sparks = [];
    this.ripples = [];

    this.createSolitaries();
    this.createGroups();
  }

  /**
   * Cria os 180 estudantes solitários:
   * 110 meninas (luz branca) e 70 meninos (luz amarela).
   */
  createSolitaries() {
    const genders = [
      ...new Array(this.config.solitary.girls).fill('girl'),
      ...new Array(this.config.solitary.boys).fill('boy')
    ];

    // Embaralha para distribuição espacial homogênea
    this.shuffle(genders);

    const pad = 40;
    for (let i = 0; i < genders.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.randomRange(
        this.config.physics.solitarySpeedMin,
        this.config.physics.solitarySpeedMax
      );

      this.solitaries.push({
        id: `solitary-${i}`,
        isSolitary: true,
        gender: genders[i],
        x: this.randomRange(pad, this.width - pad),
        y: this.randomRange(pad, this.height - pad),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseSpeed: speed,
        radius: this.randomRange(18, 24),
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: this.randomRange(0.06, 0.12),
        flicker: 1.0,
        opacityMod: 1.0,
        hoverIntensity: 0.0,
        tailDir: { x: -Math.cos(angle), y: -Math.sin(angle) },
        age: Math.floor(this.randomRange(13, 17))
      });
    }
  }

  /**
   * Cria as fogueiras coletivas na proporção de 1 grupo para cada 10 solitários
   * (18 fogueiras somando exatamente 820 membros: 410 meninas e 410 meninos, ~45 por grupo).
   */
  createGroups() {
    const groupCount = Math.max(1, this.config.groupCount);
    const totalMembers = this.config.connectedCount;

    // Distribuição balanceada de membros entre os grupos
    const avgPerGroup = Math.floor(totalMembers / groupCount);
    const remainder = totalMembers % groupCount;
    const sizes = new Array(groupCount).fill(avgPerGroup);
    for (let i = 0; i < remainder; i++) {
      sizes[i]++;
    }

    // Variação orgânica suave mantendo a soma exata
    const maxDelta = Math.max(1, Math.floor(avgPerGroup * 0.12));
    for (let i = 0; i < groupCount - 1; i += 2) {
      const delta = Math.floor((Math.random() * 2 - 1) * maxDelta);
      if (sizes[i] + delta >= 10 && sizes[i + 1] - delta >= 10) {
        sizes[i] += delta;
        sizes[i + 1] -= delta;
      }
    }

    // Pool de meninas e meninos conectados da localidade
    const genderPool = [
      ...new Array(this.config.connected.girls).fill('girl'),
      ...new Array(this.config.connected.boys).fill('boy')
    ];
    this.shuffle(genderPool);

    let genderIdx = 0;
    const pad = 65;

    for (let g = 0; g < groupCount; g++) {
      const size = sizes[g];
      const angle = Math.random() * Math.PI * 2;
      const speed = this.randomRange(
        this.config.physics.groupSpeedMin,
        this.config.physics.groupSpeedMax
      );

      const groupCenter = {
        x: this.randomRange(pad, this.width - pad),
        y: this.randomRange(pad, this.height - pad),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseSpeed: speed
      };

      const members = [];
      const maxOrbit = this.config.physics.groupOrbitRadiusMax; // ~48px

      for (let m = 0; m < size; m++) {
        const gender = genderPool[genderIdx++];
        // Distribuição orgânica em disco: núcleo denso e dispersão gradual nas bordas
        const baseDist = (4 + maxOrbit * Math.sqrt(Math.random()));
        const baseAngle = Math.random() * Math.PI * 2;
        const orbitSpeed = this.randomRange(0.0015, 0.0055) * (Math.random() < 0.5 ? 1 : -1);

        members.push({
          id: `group-${g}-member-${m}`,
          gender: gender,
          baseDist: baseDist,
          orbitAngle: baseAngle,
          orbitSpeed: orbitSpeed,
          breathPhase: Math.random() * Math.PI * 2,
          radius: this.randomRange(18, 24),
          flickerPhase: Math.random() * Math.PI * 2,
          flickerSpeed: this.randomRange(0.06, 0.13),
          flicker: 1.0,
          currentX: groupCenter.x,
          currentY: groupCenter.y
        });
      }

      this.groups.push({
        id: `group-${g}`,
        isSolitary: false,
        size: size,
        center: groupCenter,
        orbitRadius: maxOrbit,
        members: members,
        overlap: 0,
        opacityMod: 1.0
      });
    }
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * Atualização cinemática de cada quadro.
   */
  update() {
    if (this.isPaused) return;

    this.time += 1;

    // 1. Atualiza grupos (Fogueiras)
    this.updateGroups();

    // 2. Atualiza solitários com repulsão social
    this.updateSolitaries();

    // 3. Atualiza partículas de faíscas do mouse
    this.updateSparks();

    // 4. Atualiza ondas de pulso de clique
    this.updateRipples();
  }

  updateGroups() {
    const pad = 25;
    const margin = 70;
    const defaultMaxOrbit = this.config.physics.groupOrbitRadiusMax || 50;

    // 1. Zera e calcula sobreposição mútua e repulsão suave entre agrupamentos
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].overlap = 0;
    }

    for (let i = 0; i < this.groups.length; i++) {
      const g1 = this.groups[i];
      const c1 = g1.center;
      const g1Dragged = Boolean(this.mouse.draggedItem && this.mouse.draggedItem.target === g1);

      for (let j = i + 1; j < this.groups.length; j++) {
        const g2 = this.groups[j];
        const c2 = g2.center;
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        let dist = Math.hypot(dx, dy);

        const r1 = g1.orbitRadius || defaultMaxOrbit;
        const r2 = g2.orbitRadius || defaultMaxOrbit;
        // Distância onde os agrupamentos começam a sentir a presença mútua
        const minSeparation = r1 + r2 + 25;

        if (dist < 0.001) {
          // Afastamento suave caso estejam na mesma coordenada
          c1.vx += (Math.random() - 0.5) * 0.04;
          c1.vy += (Math.random() - 0.5) * 0.04;
          g1.overlap = 1.0;
          g2.overlap = 1.0;
          continue;
        }

        if (dist < minSeparation) {
          const overlap = 1.0 - (dist / minSeparation);
          if (overlap > g1.overlap) g1.overlap = overlap;
          if (overlap > g2.overlap) g2.overlap = overlap;
          // Força suave com curva quadrática contínua: inicia imperceptível e cresce sem tranco
          const force = Math.pow(overlap, 1.8) * 0.016;
          const nx = dx / dist;
          const ny = dy / dist;

          // Componente tangencial para desvio suave em curva (gliding) sem choque frontal
          const dot = -ny * (c1.vx - c2.vx) + nx * (c1.vy - c2.vy);
          const sign = dot >= 0 ? 1 : -1;
          const tx = -ny * sign * 0.008 * overlap;
          const ty = nx * sign * 0.008 * overlap;

          if (!g1Dragged) {
            c1.vx += (nx * force + tx);
            c1.vy += (ny * force + ty);
          }

          const g2Dragged = Boolean(this.mouse.draggedItem && this.mouse.draggedItem.target === g2);
          if (!g2Dragged) {
            c2.vx -= (nx * force - tx);
            c2.vy -= (ny * force - ty);
          }
        }
      }
    }

    // 2. Atualização cinemática de cada agrupamento
    for (let g = 0; g < this.groups.length; g++) {
      const grp = this.groups[g];
      const c = grp.center;

      // Se o grupo estiver sendo arrastado pelo usuário, sua posição é gerida pelo cursor
      const isBeingDragged = this.mouse.draggedItem && this.mouse.draggedItem.target === grp;
      if (!isBeingDragged) {
        // Deslocamento retilíneo
        c.x += c.vx;
        c.y += c.vy;

        // Suave curva de afastamento das bordas para manter grupos circulando pela tela
        if (c.x < margin) {
          c.vx += 0.008 * (1 - c.x / margin);
        } else if (c.x > this.width - margin) {
          c.vx -= 0.008 * (1 - (this.width - c.x) / margin);
        }

        if (c.y < margin) {
          c.vy += 0.008 * (1 - c.y / margin);
        } else if (c.y > this.height - margin) {
          c.vy -= 0.008 * (1 - (this.height - c.y) / margin);
        }

        // Rebote de segurança nas bordas estritas
        if (c.x < pad) {
          c.x = pad;
          c.vx = Math.abs(c.vx);
        } else if (c.x > this.width - pad) {
          c.x = this.width - pad;
          c.vx = -Math.abs(c.vx);
        }

        if (c.y < pad) {
          c.y = pad;
          c.vy = Math.abs(c.vy);
        } else if (c.y > this.height - pad) {
          c.y = this.height - pad;
          c.vy = -Math.abs(c.vy);
        }

        // Manutenção da velocidade lenta e contemplativa
        const currentSpeed = Math.hypot(c.vx, c.vy);
        if (currentSpeed > grp.center.baseSpeed * 1.3) {
          c.vx *= 0.96;
          c.vy *= 0.96;
        } else if (currentSpeed < grp.center.baseSpeed * 0.7) {
          c.vx *= 1.04;
          c.vy *= 1.04;
        }
      }

      // Hover de proximidade do cursor na fogueira
      let groupTargetHover = 0;
      if (this.mouse.active) {
        const groupMouseDist = Math.hypot(c.x - this.mouse.x, c.y - this.mouse.y);
        const groupHoverRadius = Math.max(65, (this.config.physics.groupOrbitRadiusMax || 50) + 30);
        if (groupMouseDist < groupHoverRadius) {
          groupTargetHover = Math.pow(1 - groupMouseDist / groupHoverRadius, 1.2);
        }
      }

      // Atualiza órbitas harmônicas e posições de cada membro
      for (let m = 0; m < grp.members.length; m++) {
        const mem = grp.members[m];
        mem.orbitAngle += mem.orbitSpeed;

        // Respiro sutil radial da fogueira
        const breathing = 1 + 0.08 * Math.sin(this.time * 0.02 + mem.breathPhase);
        const dist = mem.baseDist * breathing;

        mem.currentX = c.x + Math.cos(mem.orbitAngle) * dist;
        mem.currentY = c.y + Math.sin(mem.orbitAngle) * dist;

        // Tremor senoidal dessincronizado da chama (R ± 4%)
        mem.flicker = 1.0 + 
          0.04 * Math.sin(this.time * mem.flickerSpeed + mem.flickerPhase) +
          0.02 * Math.cos(this.time * mem.flickerSpeed * 1.7);

        // Hover do membro individual ou herdado da proximidade da fogueira
        let memTargetHover = groupTargetHover * 0.75;
        if (this.mouse.active) {
          const mDist = Math.hypot(mem.currentX - this.mouse.x, mem.currentY - this.mouse.y);
          if (mDist < 48) {
            memTargetHover = Math.max(memTargetHover, Math.pow(1 - mDist / 48, 1.2));
          }
        }
        mem.hoverIntensity = (mem.hoverIntensity || 0) + (memTargetHover - (mem.hoverIntensity || 0)) * 0.16;
      }

      // Modulador de opacidade pelo filtro ativo
      grp.opacityMod = this.getGroupOpacity(grp);
    }
  }

  updateSolitaries() {
    const margin = 85;
    const pad = 15;
    const avoidanceRadius = this.config.physics.solitaryAvoidanceRadius; // Desvio ao redor de fogueiras
    const mutualRadius = this.config.physics.solitaryMutualRadius || 38; // Pequeno raio de repulsão entre solitários

    // 1. Repulsão mútua entre estudantes solitários a partir de um pequeno raio (~38px)
    for (let i = 0; i < this.solitaries.length; i++) {
      const s1 = this.solitaries[i];
      const s1Dragged = Boolean(this.mouse.draggedItem && this.mouse.draggedItem.target === s1);

      for (let j = i + 1; j < this.solitaries.length; j++) {
        const s2 = this.solitaries[j];
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        let dist = Math.hypot(dx, dy);

        if (dist < 0.001) {
          // Em caso extremo de sobreposição idêntica, gera afastamento sutil imediato
          s1.vx += (Math.random() - 0.5) * 0.05;
          s1.vy += (Math.random() - 0.5) * 0.05;
          continue;
        }

        if (dist < mutualRadius) {
          const overlap = 1.0 - (dist / mutualRadius);
          // Força suave com curva suave exponencial para transição elegante
          const force = Math.pow(overlap, 1.3) * 0.065;
          const nx = dx / dist;
          const ny = dy / dist;

          // Leve deflexão lateral para desvio orgânico e fluido sem choque frontal
          const tx = -ny * 0.02 * overlap;
          const ty = nx * 0.02 * overlap;

          if (!s1Dragged) {
            s1.vx += (nx * force + tx);
            s1.vy += (ny * force + ty);
          }

          const s2Dragged = Boolean(this.mouse.draggedItem && this.mouse.draggedItem.target === s2);
          if (!s2Dragged) {
            s2.vx -= (nx * force - tx);
            s2.vy -= (ny * force - ty);
          }
        }
      }
    }

    // 2. Movimentação individual, desvio de fogueiras e contenção
    for (let i = 0; i < this.solitaries.length; i++) {
      const s = this.solitaries[i];
      const isBeingDragged = this.mouse.draggedItem && this.mouse.draggedItem.target === s;

      if (!isBeingDragged) {
        // Evitamento Social Inteligente de Fogueiras (Contornar pelo escuro):
        // Identifica apenas a fogueira mais próxima para desvio tangencial
        let nearestGrp = null;
        let minGroupDist = avoidanceRadius;

        for (let g = 0; g < this.groups.length; g++) {
          const grp = this.groups[g];
          const dx = s.x - grp.center.x;
          const dy = s.y - grp.center.y;
          const dist = Math.hypot(dx, dy);

          if (dist < minGroupDist) {
            minGroupDist = dist;
            nearestGrp = { dx, dy, dist };
          }
        }

        if (nearestGrp && nearestGrp.dist > 1) {
          // Vetor normal apontando para fora da fogueira
          const nx = nearestGrp.dx / nearestGrp.dist;
          const ny = nearestGrp.dy / nearestGrp.dist;

          // Vetor tangente para contornar lateralmente
          const dot = -ny * s.vx + nx * s.vy;
          const tx = dot >= 0 ? -ny : ny;
          const ty = dot >= 0 ? nx : -nx;

          const factor = (1 - nearestGrp.dist / avoidanceRadius);
          // Desvio suave composto: ligeiro afastamento + impulso tangencial
          s.vx += (nx * 0.05 + tx * 0.12) * factor;
          s.vy += (ny * 0.05 + ty * 0.12) * factor;
        }

        // 2. Guia para cruzar toda a tela (evita ficar preso nas bordas)
        if (s.x < margin) {
          s.vx += 0.010 * (1 - s.x / margin);
        } else if (s.x > this.width - margin) {
          s.vx -= 0.010 * (1 - (this.width - s.x) / margin);
        }

        if (s.y < margin) {
          s.vy += 0.010 * (1 - s.y / margin);
        } else if (s.y > this.height - margin) {
          s.vy -= 0.010 * (1 - (this.height - s.y) / margin);
        }

        // Oscilação browniana contemplativa suave (deriva orgânica lenta)
        s.vx += (Math.random() - 0.5) * 0.006;
        s.vy += (Math.random() - 0.5) * 0.006;

        // Normalização de velocidade para manter o ritmo calmo especificado
        const currentSpeed = Math.hypot(s.vx, s.vy);
        if (currentSpeed > s.baseSpeed * 1.3) {
          s.vx *= 0.96;
          s.vy *= 0.96;
        } else if (currentSpeed < s.baseSpeed * 0.7) {
          s.vx *= 1.04;
          s.vy *= 1.04;
        }

        // Movimentação
        s.x += s.vx;
        s.y += s.vy;

        // Rebote elástico estrito nas extremidades físicas
        if (s.x < pad) {
          s.x = pad;
          s.vx = Math.abs(s.vx);
        } else if (s.x > this.width - pad) {
          s.x = this.width - pad;
          s.vx = -Math.abs(s.vx);
        }

        if (s.y < pad) {
          s.y = pad;
          s.vy = Math.abs(s.vy);
        } else if (s.y > this.height - pad) {
          s.y = this.height - pad;
          s.vy = -Math.abs(s.vy);
        }
      }

      // Flicker senoidal da vela isolada
      s.flicker = 1.0 + 
        0.04 * Math.sin(this.time * s.flickerSpeed + s.flickerPhase) +
        0.02 * Math.cos(this.time * s.flickerSpeed * 1.8);

      s.opacityMod = this.getSolitaryOpacity(s);

      // Aumento suave de luminosidade quando o mouse está próximo do estudante solitário (hover)
      let solitaryTargetHover = 0;
      if (this.mouse.active) {
        const sDist = Math.hypot(s.x - this.mouse.x, s.y - this.mouse.y);
        const sHoverRadius = 55; // Raio confortável de proximidade do cursor
        if (sDist < sHoverRadius) {
          solitaryTargetHover = Math.pow(1 - sDist / sHoverRadius, 1.2);
        }
      }
      s.hoverIntensity = (s.hoverIntensity || 0) + (solitaryTargetHover - (s.hoverIntensity || 0)) * 0.16;

      // 3. Orientação suave e contínua da cauda de cometa (pluma firme e alinhada ao movimento)
      const currentSpeed = Math.hypot(s.vx, s.vy);
      if (currentSpeed > 0.02) {
        const targetDirX = -s.vx / currentSpeed;
        const targetDirY = -s.vy / currentSpeed;
        if (!s.tailDir) {
          s.tailDir = { x: targetDirX, y: targetDirY };
        } else {
          // Interpolação suave para girar a cauda com elegância sem ondulações
          s.tailDir.x += (targetDirX - s.tailDir.x) * 0.12;
          s.tailDir.y += (targetDirY - s.tailDir.y) * 0.12;
          const len = Math.hypot(s.tailDir.x, s.tailDir.y) || 1;
          s.tailDir.x /= len;
          s.tailDir.y /= len;
        }
      }
    }
  }

  updateSparks() {
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= 0.025;
      if (sp.life <= 0) {
        this.sparks.splice(i, 1);
      }
    }
  }

  updateRipples() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += 1.6;
      rip.life -= 0.015;

      // Empurra suavemente as velas que a onda toca
      if (rip.life > 0.3) {
        for (let s of this.solitaries) {
          const dx = s.x - rip.x;
          const dy = s.y - rip.y;
          const dist = Math.hypot(dx, dy);
          if (Math.abs(dist - rip.radius) < 25 && dist > 1) {
            s.vx += (dx / dist) * 0.15;
            s.vy += (dy / dist) * 0.15;
          }
        }
      }

      if (rip.life <= 0) {
        this.ripples.splice(i, 1);
      }
    }
  }

  /**
   * Inicia o arrasto ao pressionar o botão do mouse ou toque.
   */
  startDrag(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.prevX = x;
    this.mouse.prevY = y;
    this.mouse.isDown = true;
    this.mouse.dragMoved = false;
    this.mouse.draggedItem = null;

    let bestDist = 9999;
    let selectedItem = null;

    // 1. Checa se clicou em um estudante solitário (raio ~34px)
    for (let s of this.solitaries) {
      if (s.opacityMod < 0.2) continue;
      const d = Math.hypot(s.x - x, s.y - y);
      if (d < 34 && d < bestDist) {
        bestDist = d;
        selectedItem = {
          type: 'solitary',
          target: s,
          offsetX: s.x - x,
          offsetY: s.y - y
        };
      }
    }

    // 2. Checa se clicou em uma fogueira coletiva (raio ~58px)
    for (let g of this.groups) {
      if (g.opacityMod < 0.2) continue;
      const d = Math.hypot(g.center.x - x, g.center.y - y);
      if (d < 58 && d < bestDist) {
        bestDist = d;
        selectedItem = {
          type: 'group',
          target: g,
          offsetX: g.center.x - x,
          offsetY: g.center.y - y
        };
      }
    }

    if (selectedItem) {
      this.mouse.draggedItem = selectedItem;
      if (window.soundscape && window.soundscape.isPlaying) {
        window.soundscape.triggerChime(selectedItem.type === 'solitary' ? 1.35 : 0.9);
      }
      return true;
    }

    return false;
  }

  /**
   * Finaliza o arrasto, soltando o elemento com a inércia correspondente.
   */
  endDrag() {
    this.mouse.isDown = false;
    const wasDragging = Boolean(this.mouse.draggedItem && this.mouse.dragMoved);

    if (this.mouse.draggedItem) {
      const item = this.mouse.draggedItem;
      if (item.type === 'solitary') {
        const s = item.target;
        const spd = Math.hypot(s.vx, s.vy);
        if (spd > 0.04) {
          const clamped = Math.min(s.baseSpeed * 1.5, Math.max(s.baseSpeed * 0.8, spd));
          s.vx = (s.vx / spd) * clamped;
          s.vy = (s.vy / spd) * clamped;
        } else {
          const ang = Math.random() * Math.PI * 2;
          s.vx = Math.cos(ang) * s.baseSpeed;
          s.vy = Math.sin(ang) * s.baseSpeed;
        }
      } else if (item.type === 'group') {
        const grp = item.target;
        const spd = Math.hypot(grp.center.vx, grp.center.vy);
        if (spd > 0.04) {
          const clamped = Math.min(grp.center.baseSpeed * 1.5, Math.max(grp.center.baseSpeed * 0.8, spd));
          grp.center.vx = (grp.center.vx / spd) * clamped;
          grp.center.vy = (grp.center.vy / spd) * clamped;
        } else {
          const ang = Math.random() * Math.PI * 2;
          grp.center.vx = Math.cos(ang) * grp.center.baseSpeed;
          grp.center.vy = Math.sin(ang) * grp.center.baseSpeed;
        }
      }
      this.mouse.draggedItem = null;
    }

    return wasDragging;
  }

  isDragging() {
    return Boolean(this.mouse.isDown && this.mouse.draggedItem);
  }

  isHoveringDraggable(x, y) {
    for (let s of this.solitaries) {
      if (s.opacityMod < 0.2) continue;
      if (Math.hypot(s.x - x, s.y - y) < 32) return true;
    }
    for (let g of this.groups) {
      if (g.opacityMod < 0.2) continue;
      if (Math.hypot(g.center.x - x, g.center.y - y) < 55) return true;
    }
    return false;
  }

  /**
   * Registra a passagem do mouse e adiciona faíscas sutis.
   */
  handleMouseMove(x, y) {
    const prevX = this.mouse.x > 0 ? this.mouse.x : x;
    const prevY = this.mouse.y > 0 ? this.mouse.y : y;
    const dx = x - prevX;
    const dy = y - prevY;
    const dist = Math.hypot(dx, dy);

    this.mouse.prevX = prevX;
    this.mouse.prevY = prevY;
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.speed = dist;
    this.mouse.active = true;

    // Se estiver arrastando um elemento selecionado
    if (this.mouse.isDown && this.mouse.draggedItem) {
      if (dist > 2) {
        this.mouse.dragMoved = true;
      }

      const item = this.mouse.draggedItem;
      const vx = dx * 0.4;
      const vy = dy * 0.4;

      if (item.type === 'solitary') {
        const s = item.target;
        s.x = x + item.offsetX;
        s.y = y + item.offsetY;
        s.x = Math.max(15, Math.min(this.width - 15, s.x));
        s.y = Math.max(15, Math.min(this.height - 15, s.y));
        s.vx = vx;
        s.vy = vy;

        // Rastro delicado de faíscas ao arrastar a vela
        if (Math.random() < 0.35) {
          this.sparks.push({
            x: s.x,
            y: s.y,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.3,
            radius: this.randomRange(2.0, 3.8),
            life: 0.8
          });
        }
      } else if (item.type === 'group') {
        const grp = item.target;
        grp.center.x = x + item.offsetX;
        grp.center.y = y + item.offsetY;
        grp.center.x = Math.max(30, Math.min(this.width - 30, grp.center.x));
        grp.center.y = Math.max(30, Math.min(this.height - 30, grp.center.y));
        grp.center.vx = vx;
        grp.center.vy = vy;

        // Rastro de faíscas ao arrastar a fogueira
        if (Math.random() < 0.45) {
          this.sparks.push({
            x: grp.center.x + (Math.random() - 0.5) * 25,
            y: grp.center.y + (Math.random() - 0.5) * 25,
            vx: (Math.random() - 0.5) * 1.0,
            vy: (Math.random() - 0.5) * 1.0 - 0.4,
            radius: this.randomRange(2.5, 4.5),
            life: 0.9
          });
        }
      }
    } else {
      // Movimento livre do cursor: faíscas leves, SEM afastar quando passa
      if (dist > 4 && this.sparks.length < 35) {
        this.sparks.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0 - 0.3,
          radius: this.randomRange(2.0, 3.2),
          life: 0.75
        });
      }
    }
  }

  handleMouseLeave() {
    this.endDrag();
    this.mouse.active = false;
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  /**
   * Adiciona uma onda de expansão de luz no clique.
   */
  handleClick(x, y) {
    this.ripples.push({
      x: x,
      y: y,
      radius: 5,
      life: 1.0
    });

    // Cria pequena rajada de faíscas
    for (let i = 0; i < 8; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = this.randomRange(0.8, 2.2);
      this.sparks.push({
        x: x,
        y: y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        radius: this.randomRange(3, 5),
        life: 1.0
      });
    }

    if (window.soundscape) {
      window.soundscape.triggerChime(1.0);
    }
  }

  /**
   * Emite uma onda atmosférica suave em coordenadas específicas ou no centro da tela.
   */
  addRipple(x, y) {
    this.ripples.push({
      x: (typeof x === 'number') ? x : this.width / 2,
      y: (typeof y === 'number') ? y : this.height / 2,
      radius: 8,
      life: 1.0
    });
  }

  /**
   * Altera a localidade geográfica ativa (Brasil, UF ou Município/Capital),
   * recalculando as populações lumínicas de acordo com os percentuais reais da PeNSE 2024.
   */
  setLocality(localityKey) {
    if (!window.PENSE_DATA) return;
    this.config = window.PENSE_DATA.createLocalityConfig(localityKey);
    this.init();
    this.addRipple(this.width / 2, this.height / 2);
    return this.config;
  }

  setFilter(mode) {
    this.activeFilter = mode;
  }

  getSolitaryOpacity(solitary) {
    switch (this.activeFilter) {
      case 'solitary': return 1.0;
      case 'groups': return 0.08;
      case 'girls': return solitary.gender === 'girl' ? 1.0 : 0.08;
      case 'boys': return solitary.gender === 'boy' ? 1.0 : 0.08;
      case 'all':
      default: return 1.0;
    }
  }

  getGroupOpacity(group) {
    switch (this.activeFilter) {
      case 'solitary': return 0.06;
      case 'groups': return 1.0;
      case 'girls': return 0.85; // Membros serão filtrados no desenho
      case 'boys': return 0.85;
      case 'all':
      default: return 1.0;
    }
  }

  getMemberOpacity(member) {
    switch (this.activeFilter) {
      case 'solitary': return 0.06;
      case 'groups': return 1.0;
      case 'girls': return member.gender === 'girl' ? 1.0 : 0.08;
      case 'boys': return member.gender === 'boy' ? 1.0 : 0.08;
      case 'all':
      default: return 1.0;
    }
  }

  /**
   * Busca a vela ou fogueira mais próxima do cursor para o Tooltip.
   */
  findNearestEntity(x, y, maxDistance = 35) {
    let nearest = null;
    let minD = maxDistance;

    // Checa solitários
    for (let s of this.solitaries) {
      if (s.opacityMod < 0.2) continue;
      const d = Math.hypot(s.x - x, s.y - y);
      if (d < minD) {
        minD = d;
        // Calcula distância do grupo mais próximo
        let minGroupDist = 9999;
        for (let g of this.groups) {
          const dg = Math.hypot(s.x - g.center.x, s.y - g.center.y);
          if (dg < minGroupDist) minGroupDist = dg;
        }

        nearest = {
          type: 'solitary',
          gender: s.gender,
          age: s.age,
          x: s.x,
          y: s.y,
          closestGroupDist: Math.round(minGroupDist)
        };
      }
    }

    // Checa centros de grupos (fogueiras)
    for (let g of this.groups) {
      if (g.opacityMod < 0.2) continue;
      const d = Math.hypot(g.center.x - x, g.center.y - y);
      if (d < minD + 35) {
        minD = d;
        const girls = g.members.filter(m => m.gender === 'girl').length;
        const boys = g.members.filter(m => m.gender === 'boy').length;

        nearest = {
          type: 'group',
          size: g.size,
          girls: girls,
          boys: boys,
          x: g.center.x,
          y: g.center.y
        };
      }
    }

    return nearest;
  }
}

window.CandleSimulation = CandleSimulation;
