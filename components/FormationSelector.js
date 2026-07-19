/**
 * FormationSelector.js
 * Renders the formation selection screen.
 */

import { FORMATIONS, gameState } from './GameState.js';
import { slideIn, createRipple } from './Animations.js';

export function renderFormationSelector(container) {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'formation-selector';

  const title = document.createElement('h1');
  title.className = 'game-title';
  title.innerHTML = `
    <span class="title-icon">🏆</span>
    <span>World Cup Draft</span>
  `;
  wrapper.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'game-subtitle';
  subtitle.textContent = 'Choose your formation to begin the draft';
  wrapper.appendChild(subtitle);

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'formation-cards';

  Object.keys(FORMATIONS).forEach((key, index) => {
    const formation = FORMATIONS[key];
    const card = document.createElement('button');
    card.className = 'formation-card';
    card.dataset.formation = key;

    const formationName = document.createElement('div');
    formationName.className = 'formation-name';
    formationName.textContent = formation.name;

    const formationVisual = document.createElement('div');
    formationVisual.className = 'formation-visual';
    formationVisual.innerHTML = generateFormationDots(formation.positions);

    const formationDesc = document.createElement('div');
    formationDesc.className = 'formation-desc';
    formationDesc.textContent = getFormationDescription(key);

    card.appendChild(formationName);
    card.appendChild(formationVisual);
    card.appendChild(formationDesc);

    card.addEventListener('click', (e) => {
      createRipple(e, card);
      gameState.selectFormation(key);
    });

    cardsContainer.appendChild(card);

    // Staggered animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + index * 120);
  });

  wrapper.appendChild(cardsContainer);
  container.appendChild(wrapper);
}

function generateFormationDots(positions) {
  // Create a mini visual representation
  const dots = positions.map(pos => {
    const left = pos.x;
    const top = pos.y;
    return `<div class="formation-dot" style="left:${left}%;top:${top}%" title="${pos.label}"></div>`;
  }).join('');
  return `<div class="formation-pitch-mini">${dots}</div>`;
}

function getFormationDescription(key) {
  const descriptions = {
    '4-3-3': 'Balanced attack with wingers',
    '4-2-3-1': 'Solid defense, creative midfield',
    '4-4-2': 'Classic partnership up front',
    '3-5-2': 'Wing-backs, midfield dominance'
  };
  return descriptions[key] || '';
}
