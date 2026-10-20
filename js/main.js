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
  const btnHamburger = document.getElementById('btn-hamburger');
  const hamburgerDropdown = document.getElementById('hamburger-dropdown');
  const btnHideUi = document.getElementById('btn-hide-ui');
  const btnShowUi = document.getElementById('btn-show-ui');
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
  let currentScope = 'brasil';
  let currentLocalityId = 'brasil';

  // 3. Loop de Animação Principal (60 FPS)
  function animationLoop() {
    try {
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
            mem.hoverIntensity || 0,
            mem.isMinor || false
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
          s.hoverIntensity || 0,
          s.isMinor || false
        );
      }

      // Passo 6: Desenhar faíscas e ondas lumínicas do mouse
      renderer.drawSparks(simulation.sparks);
      renderer.drawRipples(simulation.ripples);

      // Passo 7: Vinheta atmosférica para intensificar o vazio
      renderer.drawVignette();
    } catch (err) {
      console.error('Erro no loop de animação:', err);
    } finally {
      requestAnimationFrame(animationLoop);
    }
  }

  requestAnimationFrame(animationLoop);

  // 4. Tratamento de Redimensionamento
  window.addEventListener('resize', () => {
    renderer.resize();
    simulation.resize(window.innerWidth, window.innerHeight);
  });

  // 5. Interações com o Mouse / Toque (Arrasto e Toque sem afastar ao passar)
  window.addEventListener('mousedown', (e) => {
    if (e.target.closest('.hud-top-left, .hud-top-right, .hud-bottom-left, .hud-bottom-right, .modal-card, .customizer-panel')) {
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
      ? `solitary-${entity.gender}-${entity.age}-${entity.isMinor ? 'minor' : 'major'}`
      : `group-${entity.size}-${entity.girls}-${entity.boys}`;

    if (tooltipEntityId !== currentId) {
      tooltipEntityId = currentId;

      if (entity.type === 'solitary') {
        const isGirl = entity.gender === 'girl';
        const colors = (simulation.params && simulation.params.colors) || {};
        const col = isGirl ? (colors.solitaryGirl || '#c084fc') : (colors.solitaryBoy || '#86efac');
        tooltipDot.style.background = col;
        tooltipDot.style.boxShadow = `0 0 10px ${col}`;

        // Título limpo e direto, sem "(Luz Roxa)", "(Luz Esverdeada)" ou "(Fração 0,1%)"
        tooltipType.textContent = isGirl ? 'Menina Solitária' : 'Menino Solitário';
        if (tooltipBody) tooltipBody.textContent = '';
        if (tooltipFooter) tooltipFooter.textContent = '';
      } else {
        const colors = (simulation.params && simulation.params.colors) || {};
        const col = colors.connectedBoy || '#facc15';
        tooltipDot.style.background = col;
        tooltipDot.style.boxShadow = `0 0 12px ${col}`;

        // Identificação limpa da Constelação
        tooltipType.textContent = 'Constelação';
        if (tooltipBody) tooltipBody.textContent = '';
        if (tooltipFooter) tooltipFooter.textContent = '';
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

  // 10. Menu Hamburger e Visibilidade da Interface
  if (btnHamburger && hamburgerDropdown) {
    btnHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = btnHamburger.getAttribute('aria-expanded') === 'true';
      btnHamburger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      hamburgerDropdown.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
      hamburgerDropdown.classList.toggle('open', !isExpanded);
    });

    document.addEventListener('click', (e) => {
      if (!hamburgerDropdown.contains(e.target) && !btnHamburger.contains(e.target)) {
        btnHamburger.setAttribute('aria-expanded', 'false');
        hamburgerDropdown.setAttribute('aria-hidden', 'true');
        hamburgerDropdown.classList.remove('open');
      }
    });
  }

  function toggleHideUI(forceHide) {
    const shouldHide = (forceHide !== undefined) ? forceHide : !document.body.classList.contains('hud-hidden');
    if (shouldHide) {
      document.body.classList.add('hud-hidden');
      if (btnHamburger && hamburgerDropdown) {
        btnHamburger.setAttribute('aria-expanded', 'false');
        hamburgerDropdown.setAttribute('aria-hidden', 'true');
        hamburgerDropdown.classList.remove('open');
      }
    } else {
      document.body.classList.remove('hud-hidden');
    }
  }

  if (btnHideUi) {
    btnHideUi.addEventListener('click', () => toggleHideUI(true));
  }
  if (btnShowUi) {
    btnShowUi.addEventListener('click', () => toggleHideUI(false));
  }

  // Teclas de Atalho
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (['INPUT', 'TEXTAREA'].includes(tag)) return;

    if (e.key === 'h' || e.key === 'H') {
      toggleHideUI();
    } else if (e.key === ' ') {
      e.preventDefault();
      btnPause.click();
    } else if (e.key === 'Escape') {
      if (hamburgerDropdown && hamburgerDropdown.classList.contains('open')) {
        btnHamburger.setAttribute('aria-expanded', 'false');
        hamburgerDropdown.setAttribute('aria-hidden', 'true');
        hamburgerDropdown.classList.remove('open');
      }
    }
  });

  // ==========================================================================
  // 11. Gestão Territorial da PeNSE 2024 (Brasil, UF e Município)
  // ==========================================================================

  function updateHUD(localityKey, config) {
    if (!config || !config.locality) return;
    const loc = config.locality;
    const cat = loc.category;
    const stats = simulation.getSimulationStats();

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
    if (countSolitaryTab) countSolitaryTab.textContent = stats.solitaryCount;
    if (countGroupsTab) countGroupsTab.textContent = stats.groupCount;

    // 4. Legenda Lumínica (estrita e sem parênteses)
    if (legendBonfiresTitle) {
      legendBonfiresTitle.textContent = 'Constelações';
    }
    if (legendSolitaryGirlsTitle) {
      legendSolitaryGirlsTitle.textContent = 'Meninas Solitárias';
    }
    if (legendSolitaryBoysTitle) {
      legendSolitaryBoysTitle.textContent = 'Meninos Solitários';
    }

    // 5. Badges de Dinâmica (inferior esquerdo)
    if (badgeSolitaryText) {
      badgeSolitaryText.textContent = `${stats.solitaryCount} Solitários (${loc.total.toFixed(1).replace('.', ',')}%)`;
    }
    if (badgeSolitarySub) {
      if (stats.scaleMode === 'percent') {
        badgeSolitarySub.textContent = `${stats.solitaryMajor} focos de 1% e ${stats.solitaryMinor} focos menores de 0,1%`;
      } else {
        badgeSolitarySub.textContent = `Luzes roxa e esverdeada com rastro de cometa no escuro`;
      }
    }
    if (badgeCollectiveText) {
      badgeCollectiveText.textContent = `${stats.groupCount} Constelações (${stats.connectedCount} focos)`;
    }
    if (badgeCollectiveSub) {
      if (stats.scaleMode === 'percent') {
        badgeCollectiveSub.textContent = `${stats.connectedMajor} focos de 1% e ${stats.connectedMinor} centelhas de 0,1%`;
      } else {
        badgeCollectiveSub.textContent = `Fusão lumínica: meninos (amarelo) e meninas (vermelho)`;
      }
    }

    // 6. Razão Estrutural (inferior direito)
    if (ratioDisplay) {
      ratioDisplay.textContent = `1 Constelação : ${stats.ratio} Solitários`;
    }
    if (ratioDetailText) {
      ratioDetailText.textContent = `${stats.groupCount} constelações acolhem a comunidade escolar para ${stats.solitaryCount} solitários`;
    }

    // 7. Faixa descritiva da métrica de amostragem (topo esquerdo)
    const sampleMetricText = document.getElementById('sample-metric-text');
    if (sampleMetricText) {
      if (stats.scaleMode === 'percent') {
        const totalMajor = stats.solitaryMajor + stats.connectedMajor;
        const totalMinor = stats.solitaryMinor + stats.connectedMinor;
        sampleMetricText.innerHTML = `Legenda: <strong>1 ponto = 1%</strong> (${totalMajor} focos) • <strong>Pontos menores = frações de 0,1%</strong> (${totalMinor} centelhas)`;
      } else {
        sampleMetricText.innerHTML = `Legenda: 1 foco = 0,1 p.p. da população escolar`;
      }
    }

    // 8. Modal
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
    currentLocalityId = activeId;
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
      currentLocalityId = locId;
      const newConfig = simulation.setLocality(locId);
      updateHUD(locId, newConfig);

      if (window.soundscape && window.soundscape.isPlaying) {
        window.soundscape.triggerChime(1.1);
      }
    });
  }

  // ==========================================================================
  // 6. Configuração do Painel de Customização em Tempo Real
  // ==========================================================================
  function setupCustomizer() {
    const btnCustomizer = document.getElementById('btn-customizer');
    const customizerPanel = document.getElementById('customizer-panel');
    const customizerClose = document.getElementById('customizer-close');
    const btnResetParams = document.getElementById('btn-reset-params');

    // Escala
    const toggleScaleTenth = document.getElementById('toggle-scale-tenth');
    const toggleScalePercent = document.getElementById('toggle-scale-percent');
    const badgeActiveScale = document.getElementById('badge-active-scale');
    const scaleModeHelpText = document.getElementById('scale-mode-help-text');

    // Proporção
    const sliderRatio = document.getElementById('slider-ratio');
    const valRatio = document.getElementById('val-ratio');
    const valRatioHelp = document.getElementById('val-ratio-help');

    // Tamanhos
    const sliderSizeSolGirl = document.getElementById('slider-size-sol-girl');
    const valSizeSolGirl = document.getElementById('val-size-sol-girl');
    const sliderSizeSolBoy = document.getElementById('slider-size-sol-boy');
    const valSizeSolBoy = document.getElementById('val-size-sol-boy');
    const sliderSizeConnGirl = document.getElementById('slider-size-conn-girl');
    const valSizeConnGirl = document.getElementById('val-size-conn-girl');
    const sliderSizeConnBoy = document.getElementById('slider-size-conn-boy');
    const valSizeConnBoy = document.getElementById('val-size-conn-boy');
    const sliderSizeMinor = document.getElementById('slider-size-minor');
    const valSizeMinor = document.getElementById('val-size-minor');

    // Velocidades
    const sliderSpeedSolitary = document.getElementById('slider-speed-solitary');
    const valSpeedSolitary = document.getElementById('val-speed-solitary');
    const sliderSpeedGroup = document.getElementById('slider-speed-group');
    const valSpeedGroup = document.getElementById('val-speed-group');
    const sliderSpeedOrbit = document.getElementById('slider-speed-orbit');
    const valSpeedOrbit = document.getElementById('val-speed-orbit');

    // Cores
    const colorBg = document.getElementById('color-bg');
    const tagColorBg = document.getElementById('tag-color-bg');
    const colorSolGirl = document.getElementById('color-sol-girl');
    const tagColorSolGirl = document.getElementById('tag-color-sol-girl');
    const colorSolBoy = document.getElementById('color-sol-boy');
    const tagColorSolBoy = document.getElementById('tag-color-sol-boy');
    const colorConnGirl = document.getElementById('color-conn-girl');
    const tagColorConnGirl = document.getElementById('tag-color-conn-girl');
    const colorConnBoy = document.getElementById('color-conn-boy');
    const tagColorConnBoy = document.getElementById('tag-color-conn-boy');

    // Alternar visibilidade do painel
    if (btnCustomizer && customizerPanel) {
      btnCustomizer.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = customizerPanel.classList.toggle('open');
        customizerPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        btnCustomizer.classList.toggle('active', isOpen);
      });
    }

    if (customizerClose && customizerPanel) {
      customizerClose.addEventListener('click', () => {
        customizerPanel.classList.remove('open');
        customizerPanel.setAttribute('aria-hidden', 'true');
        if (btnCustomizer) btnCustomizer.classList.remove('active');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && customizerPanel && customizerPanel.classList.contains('open')) {
        customizerPanel.classList.remove('open');
        customizerPanel.setAttribute('aria-hidden', 'true');
        if (btnCustomizer) btnCustomizer.classList.remove('active');
      }
    });

    // 1. Toggle de Modo de Escala
    function setScaleModeUI(mode) {
      simulation.setScaleMode(mode);
      if (mode === 'percent') {
        if (toggleScalePercent) {
          toggleScalePercent.classList.add('active');
          toggleScalePercent.setAttribute('aria-checked', 'true');
        }
        if (toggleScaleTenth) {
          toggleScaleTenth.classList.remove('active');
          toggleScaleTenth.setAttribute('aria-checked', 'false');
        }
        if (badgeActiveScale) badgeActiveScale.textContent = '1% + menores 0,1%';
        if (scaleModeHelpText) {
          scaleModeHelpText.innerHTML = 'Cada <strong>1% inteiro</strong> da pesquisa é representado por um ponto principal. As <strong>frações de 0,1%</strong> são representadas por pontos menores e delicados.';
        }
      } else {
        if (toggleScaleTenth) {
          toggleScaleTenth.classList.add('active');
          toggleScaleTenth.setAttribute('aria-checked', 'true');
        }
        if (toggleScalePercent) {
          toggleScalePercent.classList.remove('active');
          toggleScalePercent.setAttribute('aria-checked', 'false');
        }
        if (badgeActiveScale) badgeActiveScale.textContent = '1 foco = 0,1%';
        if (scaleModeHelpText) {
          scaleModeHelpText.innerHTML = 'Cada ponto representa 0,1 ponto percentual da população estudantil (totalizando exatamente 1.000 focos de luz na tela).';
        }
      }
      updateHUD(currentLocalityId, simulation.config);
    }

    if (toggleScaleTenth) {
      toggleScaleTenth.addEventListener('click', () => setScaleModeUI('tenth'));
    }
    if (toggleScalePercent) {
      toggleScalePercent.addEventListener('click', () => setScaleModeUI('percent'));
    }

    // 2. Proporção Fogueiras : Solitários
    if (sliderRatio) {
      sliderRatio.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valRatio) valRatio.textContent = `1 : ${val}`;
        if (valRatioHelp) valRatioHelp.textContent = val;
        simulation.setSolitaryPerGroup(val);
        updateHUD(currentLocalityId, simulation.config);
      });
    }

    // 3. Tamanho dos Pontos
    if (sliderSizeSolGirl) {
      sliderSizeSolGirl.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valSizeSolGirl) valSizeSolGirl.textContent = `${val}px`;
        simulation.updateSizes({ solitaryGirl: val });
      });
    }
    if (sliderSizeSolBoy) {
      sliderSizeSolBoy.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valSizeSolBoy) valSizeSolBoy.textContent = `${val}px`;
        simulation.updateSizes({ solitaryBoy: val });
      });
    }
    if (sliderSizeConnGirl) {
      sliderSizeConnGirl.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valSizeConnGirl) valSizeConnGirl.textContent = `${val}px`;
        simulation.updateSizes({ connectedGirl: val });
      });
    }
    if (sliderSizeConnBoy) {
      sliderSizeConnBoy.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valSizeConnBoy) valSizeConnBoy.textContent = `${val}px`;
        simulation.updateSizes({ connectedBoy: val });
      });
    }
    if (sliderSizeMinor) {
      sliderSizeMinor.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valSizeMinor) valSizeMinor.textContent = `${val}px`;
        simulation.updateSizes({ minorFraction: val });
      });
    }

    // 4. Velocidade dos Pontos
    if (sliderSpeedSolitary) {
      sliderSpeedSolitary.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (valSpeedSolitary) valSpeedSolitary.textContent = `${val.toFixed(1)}x`;
        simulation.updateSpeeds({ solitary: val });
      });
    }
    if (sliderSpeedGroup) {
      sliderSpeedGroup.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (valSpeedGroup) valSpeedGroup.textContent = `${val.toFixed(1)}x`;
        simulation.updateSpeeds({ group: val });
      });
    }
    if (sliderSpeedOrbit) {
      sliderSpeedOrbit.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (valSpeedOrbit) valSpeedOrbit.textContent = `${val.toFixed(1)}x`;
        simulation.updateSpeeds({ orbit: val });
      });
    }

    // 5. Cores
    function updatePalette(key, hex, tagEl) {
      if (tagEl) tagEl.textContent = hex;
      renderer.updateColors({ [key]: hex });
      simulation.params.colors[key] = hex;

      // Sincroniza CSS variables para que a legenda e badges reflitam as cores
      const root = document.documentElement;
      if (key === 'background') {
        root.style.setProperty('--bg-void', hex);
      } else if (key === 'connectedBoy') {
        root.style.setProperty('--candle-boy-core', hex);
      } else if (key === 'connectedGirl') {
        root.style.setProperty('--candle-girl-core', hex);
      } else if (key === 'solitaryBoy') {
        root.style.setProperty('--candle-solitary-boy-core', hex);
      } else if (key === 'solitaryGirl') {
        root.style.setProperty('--candle-solitary-girl-core', hex);
      }
    }

    if (colorBg) {
      colorBg.addEventListener('input', (e) => updatePalette('background', e.target.value, tagColorBg));
    }
    if (colorSolGirl) {
      colorSolGirl.addEventListener('input', (e) => updatePalette('solitaryGirl', e.target.value, tagColorSolGirl));
    }
    if (colorSolBoy) {
      colorSolBoy.addEventListener('input', (e) => updatePalette('solitaryBoy', e.target.value, tagColorSolBoy));
    }
    if (colorConnGirl) {
      colorConnGirl.addEventListener('input', (e) => updatePalette('connectedGirl', e.target.value, tagColorConnGirl));
    }
    if (colorConnBoy) {
      colorConnBoy.addEventListener('input', (e) => updatePalette('connectedBoy', e.target.value, tagColorConnBoy));
    }

    // 6. Exportar e Usar Configuração (Código)
    const btnExportConfig = document.getElementById('btn-export-config');
    const exportFeedback = document.getElementById('export-feedback');
    const configCodeInput = document.getElementById('config-code-input');
    const btnImportConfig = document.getElementById('btn-import-config');
    const btnClearConfig = document.getElementById('btn-clear-config');
    const importFeedback = document.getElementById('import-feedback');

    function syncAllInputsFromParams(p) {
      setScaleModeUI(p.scaleMode);

      if (sliderRatio) sliderRatio.value = p.solitaryPerGroup;
      if (valRatio) valRatio.textContent = `1 : ${p.solitaryPerGroup}`;
      if (valRatioHelp) valRatioHelp.textContent = p.solitaryPerGroup;

      if (sliderSizeSolGirl) { sliderSizeSolGirl.value = p.sizes.solitaryGirl; if (valSizeSolGirl) valSizeSolGirl.textContent = `${p.sizes.solitaryGirl}px`; }
      if (sliderSizeSolBoy) { sliderSizeSolBoy.value = p.sizes.solitaryBoy; if (valSizeSolBoy) valSizeSolBoy.textContent = `${p.sizes.solitaryBoy}px`; }
      if (sliderSizeConnGirl) { sliderSizeConnGirl.value = p.sizes.connectedGirl; if (valSizeConnGirl) valSizeConnGirl.textContent = `${p.sizes.connectedGirl}px`; }
      if (sliderSizeConnBoy) { sliderSizeConnBoy.value = p.sizes.connectedBoy; if (valSizeConnBoy) valSizeConnBoy.textContent = `${p.sizes.connectedBoy}px`; }
      if (sliderSizeMinor) { sliderSizeMinor.value = p.sizes.minorFraction; if (valSizeMinor) valSizeMinor.textContent = `${p.sizes.minorFraction}px`; }

      if (sliderSpeedSolitary) { sliderSpeedSolitary.value = p.speeds.solitary; if (valSpeedSolitary) valSpeedSolitary.textContent = `${p.speeds.solitary.toFixed(1)}x`; }
      if (sliderSpeedGroup) { sliderSpeedGroup.value = p.speeds.group; if (valSpeedGroup) valSpeedGroup.textContent = `${p.speeds.group.toFixed(1)}x`; }
      if (sliderSpeedOrbit) { sliderSpeedOrbit.value = p.speeds.orbit; if (valSpeedOrbit) valSpeedOrbit.textContent = `${p.speeds.orbit.toFixed(1)}x`; }

      if (colorBg) { colorBg.value = p.colors.background; if (tagColorBg) tagColorBg.textContent = p.colors.background; }
      if (colorSolGirl) { colorSolGirl.value = p.colors.solitaryGirl; if (tagColorSolGirl) tagColorSolGirl.textContent = p.colors.solitaryGirl; }
      if (colorSolBoy) { colorSolBoy.value = p.colors.solitaryBoy; if (tagColorSolBoy) tagColorSolBoy.textContent = p.colors.solitaryBoy; }
      if (colorConnGirl) { colorConnGirl.value = p.colors.connectedGirl; if (tagColorConnGirl) tagColorConnGirl.textContent = p.colors.connectedGirl; }
      if (colorConnBoy) { colorConnBoy.value = p.colors.connectedBoy; if (tagColorConnBoy) tagColorConnBoy.textContent = p.colors.connectedBoy; }

      renderer.updateColors(p.colors);
      const root = document.documentElement;
      if (p.colors.background) root.style.setProperty('--bg-void', p.colors.background);
      if (p.colors.connectedBoy) root.style.setProperty('--candle-boy-core', p.colors.connectedBoy);
      if (p.colors.connectedGirl) root.style.setProperty('--candle-girl-core', p.colors.connectedGirl);
      if (p.colors.solitaryBoy) root.style.setProperty('--candle-solitary-boy-core', p.colors.solitaryBoy);
      if (p.colors.solitaryGirl) root.style.setProperty('--candle-solitary-girl-core', p.colors.solitaryGirl);

      updateHUD(currentLocalityId, simulation.config);
    }

    if (btnExportConfig) {
      btnExportConfig.addEventListener('click', () => {
        const configData = JSON.stringify(simulation.params, null, 2);
        if (configCodeInput) {
          configCodeInput.value = configData;
          configCodeInput.focus();
          configCodeInput.select();
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(configData).then(() => {
            if (exportFeedback) {
              exportFeedback.textContent = '✓ Código copiado para a área de transferência!';
              exportFeedback.className = 'config-feedback success';
              setTimeout(() => { exportFeedback.textContent = ''; }, 4000);
            }
          }).catch(() => {
            if (exportFeedback) {
              exportFeedback.textContent = 'Código gerado abaixo. Selecione e copie manualmente.';
              exportFeedback.className = 'config-feedback success';
              setTimeout(() => { exportFeedback.textContent = ''; }, 4000);
            }
          });
        } else {
          if (exportFeedback) {
            exportFeedback.textContent = 'Código gerado abaixo. Selecione e copie manualmente.';
            exportFeedback.className = 'config-feedback success';
            setTimeout(() => { exportFeedback.textContent = ''; }, 4000);
          }
        }
      });
    }

    if (btnClearConfig) {
      btnClearConfig.addEventListener('click', () => {
        if (configCodeInput) configCodeInput.value = '';
        if (importFeedback) {
          importFeedback.textContent = '';
          importFeedback.className = 'config-feedback';
        }
      });
    }

    if (btnImportConfig) {
      btnImportConfig.addEventListener('click', () => {
        if (!configCodeInput) return;
        const raw = configCodeInput.value.trim();
        if (!raw) {
          if (importFeedback) {
            importFeedback.textContent = '⚠ Cole um código de configuração no campo.';
            importFeedback.className = 'config-feedback error';
            setTimeout(() => { importFeedback.textContent = ''; }, 4000);
          }
          return;
        }

        try {
          const parsed = JSON.parse(raw);
          if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Formato inválido');
          }

          // Aplica escala
          if (parsed.scaleMode && (parsed.scaleMode === 'tenth' || parsed.scaleMode === 'percent')) {
            simulation.setScaleMode(parsed.scaleMode);
          }

          // Aplica proporção
          if (typeof parsed.solitaryPerGroup === 'number') {
            simulation.setSolitaryPerGroup(parsed.solitaryPerGroup);
          }

          // Aplica tamanhos
          if (parsed.sizes && typeof parsed.sizes === 'object') {
            simulation.updateSizes(parsed.sizes);
          }

          // Aplica velocidades
          if (parsed.speeds && typeof parsed.speeds === 'object') {
            simulation.updateSpeeds(parsed.speeds);
          }

          // Aplica cores
          if (parsed.colors && typeof parsed.colors === 'object') {
            renderer.updateColors(parsed.colors);
            Object.assign(simulation.params.colors, parsed.colors);
          }

          syncAllInputsFromParams(simulation.params);

          if (importFeedback) {
            importFeedback.textContent = '✓ Configuração aplicada com sucesso!';
            importFeedback.className = 'config-feedback success';
            setTimeout(() => { importFeedback.textContent = ''; }, 4000);
          }

          if (window.soundscape && window.soundscape.isPlaying) {
            window.soundscape.triggerChime(1.25);
          }
        } catch (err) {
          if (importFeedback) {
            importFeedback.textContent = '✖ Código inválido. Certifique-se de colar o JSON exportado.';
            importFeedback.className = 'config-feedback error';
            setTimeout(() => { importFeedback.textContent = ''; }, 5000);
          }
        }
      });
    }

    // 7. Restaurar Padrões
    if (btnResetParams) {
      btnResetParams.addEventListener('click', () => {
        simulation.resetParams();
        syncAllInputsFromParams(simulation.params);
      });
    }

    // Sincroniza a interface inicial com os parâmetros padrão da simulação
    syncAllInputsFromParams(simulation.params);
  }

  setupCustomizer();

  // Inicialização padrão: Brasil (6,1% sem amigos próximos)
  switchScope('brasil', 'brasil');
});
