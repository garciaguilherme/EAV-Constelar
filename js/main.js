/**
 * Velas na Escuridão — Módulo Principal (Orquestração e Interatividade)
 * Conecta simulação, renderizador, interface de usuário e eventos de interação.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // 1. Instanciação dos sistemas
  const renderer = new CandleRenderer(canvas);
  const simulation = new CandleSimulation();

  // 2. Elementos de Interface
  const filterButtons = document.querySelectorAll('.filter-btn');
  const btnAudio = document.getElementById('btn-audio');
  const audioMuteLine = document.getElementById('audio-mute-line');
  const btnPause = document.getElementById('btn-pause');
  const pauseRect1 = document.getElementById('pause-rect-1');
  const pauseRect2 = document.getElementById('pause-rect-2');
  const playPolygon = document.getElementById('play-polygon');
  const btnInfo = document.getElementById('btn-info');
  const infoModal = document.getElementById('info-modal');
  const modalClose = document.getElementById('modal-close');
  const btnModalCloseAction = document.getElementById('btn-modal-close-action');

  // Elementos do Menu Territorial PeNSE
  const geoScopeTabs = document.querySelectorAll('.geo-tab');
  const localitySelect = document.getElementById('locality-select');
  const geoActiveBadge = document.getElementById('geo-active-badge');
  const statTotalVal = document.getElementById('stat-total-val');
  const statTotalCi = document.getElementById('stat-total-ci');
  const statBoysVal = document.getElementById('stat-boys-val');
  const statGirlsVal = document.getElementById('stat-girls-val');
  const statPublicVal = document.getElementById('stat-public-val');
  const statPrivateVal = document.getElementById('stat-private-val');

  // Contadores dinâmicos nos filtros e na legenda
  const countSolitaryTab = document.getElementById('count-solitary-tab');
  const countGroupsTab = document.getElementById('count-groups-tab');
  const legendBonfiresTitle = document.getElementById('legend-bonfires-title');
  const legendSolitaryGirlsTitle = document.getElementById('legend-solitary-girls-title');
  const legendSolitaryBoysTitle = document.getElementById('legend-solitary-boys-title');
  const badgeSolitaryText = document.getElementById('badge-solitary-text');
  const badgeSolitarySub = document.getElementById('badge-solitary-sub');
  const badgeCollectiveText = document.getElementById('badge-collective-text');
  const badgeCollectiveSub = document.getElementById('badge-collective-sub');
  const ratioDisplay = document.getElementById('ratio-display');
  const ratioDetailText = document.getElementById('ratio-detail-text');
  const modalStatTotal = document.getElementById('modal-stat-total');

  // Tooltip
  const tooltip = document.getElementById('tooltip');
  const tooltipDot = document.getElementById('tooltip-dot');
  const tooltipType = document.getElementById('tooltip-type');
  const tooltipBody = document.getElementById('tooltip-body');
  const tooltipFooter = document.getElementById('tooltip-footer');

  let tooltipEntityId = null;

  // 3. Loop de Animação Principal (60 FPS)
  function animationLoop() {
    // Passo 1: Atualização cinemática
    simulation.update();

    // Passo 2: Limpar tela com tom escuro absoluto (#050507)
    renderer.clear();

    // Passo 3: Ativar mistura aditiva ("lighter")
    renderer.beginAdditiveBlending();

    // Passo 4: Desenhar as Fogueiras Coletivas (amarelos e vermelhas)
    const groups = simulation.groups;
    for (let g = 0; g < groups.length; g++) {
      const grp = groups[g];
      const members = grp.members;
      // Amortecimento suave de luminância quando clusters se sobrepõem
      const overlapDamp = (grp.overlap && grp.overlap > 0) ? Math.max(0.68, 1.0 - grp.overlap * 0.28) : 1.0;
      for (let m = 0; m < members.length; m++) {
        const mem = members[m];
        const opacity = simulation.getMemberOpacity(mem) * overlapDamp;
        renderer.drawCandle(
          mem.currentX,
          mem.currentY,
          mem.radius,
          mem.gender,
          false, // Fogueira / conectado (amarelo / vermelho)
          mem.flicker,
          opacity,
          mem.hoverIntensity || 0
        );
      }
    }

    // Passo 5: Desenhar os Estudantes Solitários e seus Rastros de Cometa
    const solitaries = simulation.solitaries;
    for (let i = 0; i < solitaries.length; i++) {
      const s = solitaries[i];
      const opacity = simulation.getSolitaryOpacity(s);

      // 5.1 Cauda afilada e reta de cometa (pluma lumínica curta e delgada)
      renderer.drawCometTail(s, opacity);

      // 5.2 Vela solitária principal
      renderer.drawCandle(
        s.x,
        s.y,
        s.radius,
        s.gender,
        true, // Solitário (roxo / esverdeado atenuado)
        s.flicker,
        opacity,
        s.hoverIntensity || 0
      );
    }

    // Passo 6: Desenhar faíscas e ondas lumínicas do mouse
    renderer.drawSparks(simulation.sparks);
    renderer.drawRipples(simulation.ripples);

    // Passo 7: Vinheta atmosférica para intensificar o vazio
    renderer.drawVignette();

    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);

  // 4. Tratamento de Redimensionamento
  window.addEventListener('resize', () => {
    renderer.resize();
    simulation.resize(window.innerWidth, window.innerHeight);
  });

  // 5. Interações com o Mouse / Toque (Arrasto e Toque sem afastar ao passar)
  window.addEventListener('mousedown', (e) => {
    if (e.target.closest('.hud-top-left, .hud-top-right, .hud-bottom-left, .hud-bottom-right, .modal-card')) {
      return;
    }
    const grabbed = simulation.startDrag(e.clientX, e.clientY);
    if (grabbed) {
      canvas.style.cursor = 'grabbing';
      hideTooltip();
    }
  });

  window.addEventListener('mousemove', (e) => {
    simulation.handleMouseMove(e.clientX, e.clientY);

    if (simulation.isDragging()) {
      canvas.style.cursor = 'grabbing';
      hideTooltip();
    } else {
      if (simulation.isHoveringDraggable(e.clientX, e.clientY)) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
      updateTooltip(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.target.closest('.hud-top-left, .hud-top-right, .hud-bottom-left, .hud-bottom-right, .modal-card')) {
      simulation.endDrag();
      return;
    }
    const wasDragging = simulation.endDrag();
    if (!wasDragging) {
      // Clique rápido sem arrasto: emite pulso de onda luminosa
      simulation.handleClick(e.clientX, e.clientY);
    }
    canvas.style.cursor = simulation.isHoveringDraggable(e.clientX, e.clientY) ? 'grab' : 'default';
  });

  window.addEventListener('mouseleave', () => {
    simulation.handleMouseLeave();
    hideTooltip();
    canvas.style.cursor = 'default';
  });

  // Suporte a toque móvel (Touch Events com Arrasto)
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (touch.target.closest('.hud-top-left, .hud-top-right, .hud-bottom-left, .hud-bottom-right, .modal-card')) {
        return;
      }
      simulation.startDrag(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      simulation.handleMouseMove(touch.clientX, touch.clientY);
      if (simulation.isDragging()) {
        hideTooltip();
      } else {
        updateTooltip(touch.clientX, touch.clientY);
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const wasDragging = simulation.endDrag();
    if (!wasDragging && e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      if (!touch.target.closest('.hud-top-left, .hud-top-right, .hud-bottom-left, .hud-bottom-right, .modal-card')) {
        simulation.handleClick(touch.clientX, touch.clientY);
      }
    }
    hideTooltip();
  });

  // 6. Lógica do Tooltip de Inspeção
  function updateTooltip(x, y) {
    const entity = simulation.findNearestEntity(x, y, 36);

    if (!entity) {
      hideTooltip();
      tooltipEntityId = null;
      return;
    }

    // Só atualiza o texto se mudar a entidade inspecionada
    const currentId = entity.type === 'solitary' 
      ? `solitary-${entity.gender}-${entity.age}`
      : `group-${entity.size}-${entity.girls}-${entity.boys}`;

    if (tooltipEntityId !== currentId) {
      tooltipEntityId = currentId;

      if (entity.type === 'solitary') {
        const isGirl = entity.gender === 'girl';
        tooltipDot.style.background = isGirl ? '#c084fc' : '#86efac';
        tooltipDot.style.boxShadow = isGirl ? '0 0 10px #c084fc' : '0 0 10px #86efac';
        tooltipType.textContent = isGirl ? 'Estudante Solitária (Luz Roxa)' : 'Estudante Solitário (Luz Esverdeada)';
        tooltipBody.textContent = window.PENSE_DATA.getRandomNarrative(entity.gender, true);
        tooltipFooter.textContent = `Distância da fogueira mais próxima: ~${entity.closestGroupDist}px (Evitamento social ativo)`;
      } else {
        tooltipDot.style.background = '#facc15';
        tooltipDot.style.boxShadow = '0 0 12px #facc15';
        tooltipType.textContent = `Fogueira Coletiva (${entity.size} amigos)`;
        tooltipBody.textContent = window.PENSE_DATA.getRandomNarrative(null, false, entity.size);
        tooltipFooter.textContent = `Composição: ${entity.girls} meninas (luz vermelha) e ${entity.boys} meninos (luz amarela)`;
      }
    }

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }

  // 7. Filtros de Visualização
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const mode = btn.dataset.mode;
      simulation.setFilter(mode);

      if (window.soundscape && window.soundscape.isPlaying) {
        window.soundscape.triggerChime(mode === 'solitary' ? 0.75 : 1.25);
      }
    });
  });

  // 8. Controle de Áudio
  btnAudio.addEventListener('click', () => {
    if (!window.soundscape) return;
    const isPlaying = window.soundscape.toggle();
    if (isPlaying) {
      btnAudio.classList.add('active');
      audioMuteLine.style.display = 'none';
      btnAudio.title = "Desativar Som Ambiente";
    } else {
      btnAudio.classList.remove('active');
      audioMuteLine.style.display = 'inline';
      btnAudio.title = "Ativar Som Ambiente Contemplativo";
    }
  });

  // 9. Controle de Pausa
  btnPause.addEventListener('click', () => {
    simulation.isPaused = !simulation.isPaused;
    if (simulation.isPaused) {
      btnPause.classList.add('active');
      pauseRect1.style.display = 'none';
      pauseRect2.style.display = 'none';
      playPolygon.style.display = 'inline';
      btnPause.querySelector('.btn-text').textContent = 'Continuar';
      btnPause.title = "Continuar Simulação";
    } else {
      btnPause.classList.remove('active');
      pauseRect1.style.display = 'inline';
      pauseRect2.style.display = 'inline';
      playPolygon.style.display = 'none';
      btnPause.querySelector('.btn-text').textContent = 'Pausar';
      btnPause.title = "Pausar Simulação";
    }
  });

  // 10. Modal "Sobre o Projeto"
  function openModal() {
    infoModal.classList.add('open');
    infoModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    infoModal.classList.remove('open');
    infoModal.setAttribute('aria-hidden', 'true');
  }

  btnInfo.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  btnModalCloseAction.addEventListener('click', closeModal);

  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoModal.classList.contains('open')) {
      closeModal();
    }
    if (e.key === ' ' && !infoModal.classList.contains('open')) {
      e.preventDefault();
      btnPause.click();
    }
  });

  // ==========================================================================
  // 11. Gestão Territorial da PeNSE 2024 (Brasil, UF e Município)
  // ==========================================================================

  let currentScope = 'brasil'; // 'brasil' | 'uf' | 'municipio'

  function updateHUD(localityKey, config) {
    if (!config || !config.locality) return;
    const loc = config.locality;
    const cat = loc.category;

    // 1. Badge de categoria territorial
    if (geoActiveBadge) {
      if (cat === 'Nacional') {
        geoActiveBadge.textContent = loc.id === 'brasil' ? 'Nacional' : 'Grande Região';
      } else if (cat === 'UF') {
        geoActiveBadge.textContent = `UF: ${loc.name}`;
      } else {
        geoActiveBadge.textContent = `Capital: ${loc.name}`;
      }
    }

    // 2. Faixa estatística principal (Tabelas 12.1.1 e 12.1.3 da PeNSE 2024)
    if (statTotalVal) statTotalVal.textContent = `${loc.total.toFixed(1).replace('.', ',')}%`;
    if (statTotalCi) {
      statTotalCi.textContent = `(IC 95%: ${loc.total_ci[0].toFixed(1).replace('.', ',')}% – ${loc.total_ci[1].toFixed(1).replace('.', ',')}%)`;
    }
    if (statBoysVal) statBoysVal.textContent = `${loc.homem.toFixed(1).replace('.', ',')}%`;
    if (statGirlsVal) statGirlsVal.textContent = `${loc.mulher.toFixed(1).replace('.', ',')}%`;
    if (statPublicVal) statPublicVal.textContent = `${loc.publica.toFixed(1).replace('.', ',')}%`;
    if (statPrivateVal) statPrivateVal.textContent = `${loc.privada.toFixed(1).replace('.', ',')}%`;

    // 3. Contadores nos filtros superiores
    if (countSolitaryTab) countSolitaryTab.textContent = config.solitaryCount;
    if (countGroupsTab) countGroupsTab.textContent = config.groupCount;

    // 4. Legenda Lumínica
    if (legendBonfiresTitle) {
      legendBonfiresTitle.textContent = `Fogueiras Coletivas (${config.groupCount} grupos • ${config.connectedCount} focos)`;
    }
    if (legendSolitaryGirlsTitle) {
      legendSolitaryGirlsTitle.textContent = `Meninas Solitárias (${config.solitary.girls} focos — Luz Roxa)`;
    }
    if (legendSolitaryBoysTitle) {
      legendSolitaryBoysTitle.textContent = `Meninos Solitários (${config.solitary.boys} focos — Luz Esverdeada)`;
    }

    // 5. Badges de Dinâmica (inferior esquerdo)
    if (badgeSolitaryText) {
      badgeSolitaryText.textContent = `${config.solitaryCount} Solitários (${loc.total.toFixed(1).replace('.', ',')}%)`;
    }
    if (badgeSolitarySub) {
      badgeSolitarySub.textContent = `Luzes roxa (${config.solitary.girls}) e esverdeada (${config.solitary.boys}) com rastro de cometa no escuro`;
    }
    if (badgeCollectiveText) {
      badgeCollectiveText.textContent = `${config.groupCount} Fogueiras (${config.connectedCount} focos)`;
    }
    if (badgeCollectiveSub) {
      const avg = Math.round(config.connectedCount / config.groupCount);
      badgeCollectiveSub.textContent = `Fusão lumínica: meninos (amarelo) e meninas (vermelho)`;
    }

    // 6. Razão Estrutural (inferior direito)
    if (ratioDisplay) {
      ratioDisplay.textContent = '1 Fogueira : 10 Solitários';
    }
    if (ratioDetailText) {
      ratioDetailText.textContent = `${config.groupCount} fogueiras acolhem a comunidade escolar para ${config.solitaryCount} solitários`;
    }

    // 7. Modal
    if (modalStatTotal) {
      modalStatTotal.textContent = `${loc.total.toFixed(1).replace('.', ',')}%`;
    }
  }

  function populateLocalitySelect(scope, selectedId) {
    if (!localitySelect || !window.PENSE_DATA) return '';
    localitySelect.innerHTML = '';
    const db = window.PENSE_DATA.database;

    let items = [];
    if (scope === 'brasil') {
      items = Object.values(db).filter(item => item.category === 'Nacional');
    } else if (scope === 'uf') {
      items = Object.values(db).filter(item => item.category === 'UF');
      items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    } else if (scope === 'municipio') {
      items = Object.values(db).filter(item => item.category === 'Capital');
      items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }

    for (const item of items) {
      const opt = document.createElement('option');
      opt.value = item.id;
      const pct = item.total.toFixed(1).replace('.', ',');
      opt.textContent = `${item.name} — ${pct}%`;
      localitySelect.appendChild(opt);
    }

    const isValid = items.some(it => it.id === selectedId);
    if (isValid) {
      localitySelect.value = selectedId;
    } else if (items.length > 0) {
      localitySelect.value = items[0].id;
    }

    return localitySelect.value;
  }

  function switchScope(scope, targetLocalityId) {
    currentScope = scope;

    geoScopeTabs.forEach(tab => {
      const isMatch = tab.dataset.scope === scope;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    const activeId = populateLocalitySelect(scope, targetLocalityId);
    const newConfig = simulation.setLocality(activeId);
    updateHUD(activeId, newConfig);

    if (window.soundscape && window.soundscape.isPlaying) {
      window.soundscape.triggerChime(1.15);
    }
  }

  // Event Listeners das Abas de Escopo (Brasil, UF, Município)
  geoScopeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const scope = tab.dataset.scope;
      let defaultId = 'brasil';
      if (scope === 'brasil') defaultId = 'brasil';
      else if (scope === 'uf') defaultId = 'sao_paulo';
      else if (scope === 'municipio') defaultId = 'cap_sao_paulo';

      switchScope(scope, defaultId);
    });
  });

  // Event Listener da Mudança no Select
  if (localitySelect) {
    localitySelect.addEventListener('change', (e) => {
      const locId = e.target.value;
      const newConfig = simulation.setLocality(locId);
      updateHUD(locId, newConfig);

      if (window.soundscape && window.soundscape.isPlaying) {
        window.soundscape.triggerChime(1.1);
      }
    });
  }

  // Inicialização padrão: Brasil (6,1% sem amigos próximos)
  switchScope('brasil', 'brasil');
});
