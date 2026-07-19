/**
 * DraftBoard.js
 * Renders the current squad draft board with player cards.
 */

import { gameState } from './GameState.js';
import { staggerFadeIn, fadeIn, fadeOut } from './Animations.js';
import { openPlayerModal } from './PlayerModal.js';

export function renderDraftBoard(container) {
  container.innerHTML = '';

  const squad = gameState.currentSquad;
  if (!squad) return;

  const board = document.createElement('div');
  board.className = 'draft-board';

  // Squad header
  const header = document.createElement('div');
  header.className = 'draft-header';
  header.innerHTML = `
    <div class="draft-squad-info">
      <span class="draft-flag">${squad.flag}</span>
      <h2 class="draft-squad-name">${squad.country} ${squad.year}</h2>
    </div>
    <div class="draft-round-info">
      <span class="draft-round-label">Draft Round</span>
      <span class="draft-round-number">${Object.keys(gameState.selectedPlayers).length + 1}</span>
    </div>
  `;
  board.appendChild(header);

  // Player cards grid
  const cardsGrid = document.createElement('div');
  cardsGrid.className = 'player-cards-grid';

  squad.players.forEach((player, index) => {
    const card = createPlayerCard(player, squad, index);
    cardsGrid.appendChild(card);
  });

  board.appendChild(cardsGrid);
  container.appendChild(board);

  // Animate cards
  const cards = cardsGrid.querySelectorAll('.player-card');
  staggerFadeIn(Array.from(cards), 200, 70);
}

function createPlayerCard(player, squad, index) {
  const card = document.createElement('div');
  card.className = 'player-card';
  card.dataset.playerName = player.name;

  const positionsStr = player.positions.join(' ');

  card.innerHTML = `
    <div class="card-header">
      <div class="card-rating">${player.overall}</div>
      <div class="card-flag">${squad.flag}</div>
    </div>
    <div class="card-body">
      <div class="card-name">${player.name}</div>
      <div class="card-positions">${positionsStr}</div>
    </div>
    <div class="card-glow"></div>
  `;

  card.addEventListener('click', () => {
    openPlayerModal(player, squad, card);
  });

  return card;
}

export function clearDraftBoard(container) {
  fadeOut(container, 300, () => {
    container.innerHTML = '';
  });
}
