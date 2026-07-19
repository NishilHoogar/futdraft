/**
 * TeamPanel.js
 * Renders the team statistics panel on the right side.
 */

import { gameState } from './GameState.js';
import { animateProgressBar, slideIn } from './Animations.js';

const statConfig = [
  { key: 'overall', label: 'Team Rating', color: '#F5C542' },
  { key: 'attack', label: 'Attack', color: '#E74C3C' },
  { key: 'midfield', label: 'Midfield', color: '#F5C542' },
  { key: 'defense', label: 'Defense', color: '#3498DB' },
  { key: 'chemistry', label: 'Chemistry', color: '#2ECC71' }
];

export function renderTeamPanel(container) {
  container.innerHTML = '';

  const panel = document.createElement('div');
  panel.className = 'team-panel';

  const title = document.createElement('h2');
  title.className = 'panel-title';
  title.textContent = 'Your Team';
  panel.appendChild(title);

  const statsContainer = document.createElement('div');
  statsContainer.className = 'stats-container';

  statConfig.forEach((stat, index) => {
    const statRow = document.createElement('div');
    statRow.className = 'stat-row';
    statRow.dataset.stat = stat.key;

    const statHeader = document.createElement('div');
    statHeader.className = 'stat-header';
    statHeader.innerHTML = `
      <span class="stat-label">${stat.label}</span>
      <span class="stat-value" data-value="0">0</span>
    `;

    const statBar = document.createElement('div');
    statBar.className = 'stat-bar';
    statBar.innerHTML = `<div class="stat-bar-fill" style="width: 0%; background-color: ${stat.color};"></div>`;

    statRow.appendChild(statHeader);
    statRow.appendChild(statBar);
    statsContainer.appendChild(statRow);

    // Animate in
    statRow.style.opacity = '0';
    statRow.style.transform = 'translateX(20px)';
    setTimeout(() => {
      statRow.style.transition = 'all 0.4s ease';
      statRow.style.opacity = '1';
      statRow.style.transform = 'translateX(0)';
    }, 300 + index * 100);
  });

  panel.appendChild(statsContainer);

  // Simulate match button
  const matchBtn = document.createElement('button');
  matchBtn.className = 'btn btn-match';
  matchBtn.id = 'simulate-match-btn';
  matchBtn.textContent = 'Simulate Match';
  matchBtn.disabled = true;
  matchBtn.addEventListener('click', () => {
    alert('Match simulation coming soon! Your team is ready.');
  });

  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'match-btn-wrapper';
  btnWrapper.appendChild(matchBtn);
  panel.appendChild(btnWrapper);

  container.appendChild(panel);
}

export function updateTeamPanel() {
  const stats = gameState.calculateStats();

  statConfig.forEach(stat => {
    const row = document.querySelector(`.stat-row[data-stat="${stat.key}"]`);
    if (!row) return;

    const valueEl = row.querySelector('.stat-value');
    const fillEl = row.querySelector('.stat-bar-fill');
    const targetValue = stats[stat.key];

    // Animate number
    animateNumber(valueEl, targetValue, 600);

    // Animate bar
    animateProgressBar(fillEl, targetValue, 800);
  });

  // Update match button state
  const matchBtn = document.getElementById('simulate-match-btn');
  if (matchBtn) {
    const isComplete = gameState.isDraftComplete();
    matchBtn.disabled = !isComplete;
    if (isComplete) {
      matchBtn.classList.add('ready');
    } else {
      matchBtn.classList.remove('ready');
    }
  }
}

function animateNumber(element, target, duration) {
  const start = parseInt(element.textContent) || 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
