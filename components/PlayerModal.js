/**
 * PlayerModal.js
 * Modal for selecting which position to place a drafted player.
 */

import { gameState } from './GameState.js';
import { flyPlayer, fadeIn, fadeOut } from './Animations.js';
import { updateSlot, getSlotElement } from './Pitch.js';

let modalOverlay = null;
let modalContent = null;
let currentPlayer = null;
let currentSquad = null;
let currentCardElement = null;

export function openPlayerModal(player, squad, cardElement) {
  currentPlayer = player;
  currentSquad = squad;
  currentCardElement = cardElement;

  const emptyPositions = gameState.getEmptyPositions();

  // Create overlay
  modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <div class="modal-player-flag">${squad.flag}</div>
    <div class="modal-player-info">
      <h2 class="modal-player-name">${player.name}</h2>
      <div class="modal-player-rating">${player.overall} <span>OVR</span></div>
    </div>
  `;

  const body = document.createElement('div');
  body.className = 'modal-body';

  const positionsTitle = document.createElement('h3');
  positionsTitle.className = 'modal-section-title';
  positionsTitle.textContent = 'Choose Position';
  body.appendChild(positionsTitle);

  const positionsList = document.createElement('div');
  positionsList.className = 'modal-positions';

  // Filter to only positions that are empty AND match player's positions
  const validPositions = emptyPositions.filter(pos =>
    player.positions.includes(pos.label)
  );

  if (validPositions.length === 0) {
    const noPos = document.createElement('p');
    noPos.className = 'modal-no-positions';
    noPos.textContent = 'No valid positions available for this player.';
    body.appendChild(noPos);
  } else {
    validPositions.forEach(pos => {
      const option = document.createElement('label');
      option.className = 'modal-position-option';
      option.innerHTML = `
        <input type="radio" name="position" value="${pos.id}" />
        <span class="position-radio"></span>
        <span class="position-label">${pos.label}</span>
      `;

      const radio = option.querySelector('input');
      radio.addEventListener('change', () => {
        // Highlight selected
        positionsList.querySelectorAll('.modal-position-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
      });

      positionsList.appendChild(option);
    });
  }

  body.appendChild(positionsList);

  // Also show positions the player CAN play but are occupied (disabled)
  const occupiedPositions = gameState.getFilledPositions().filter(pos =>
    player.positions.includes(pos.label)
  );

  if (occupiedPositions.length > 0) {
    const occupiedTitle = document.createElement('h3');
    occupiedTitle.className = 'modal-section-title occupied';
    occupiedTitle.textContent = 'Occupied';
    body.appendChild(occupiedTitle);

    const occupiedList = document.createElement('div');
    occupiedList.className = 'modal-positions occupied';

    occupiedPositions.forEach(pos => {
      const existing = gameState.selectedPlayers[pos.id];
      const option = document.createElement('div');
      option.className = 'modal-position-option disabled';
      option.innerHTML = `
        <span class="position-radio disabled"></span>
        <span class="position-label">${pos.label}</span>
        <span class="position-occupied-by">${existing.player.name}</span>
      `;
      occupiedList.appendChild(option);
    });

    body.appendChild(occupiedList);
  }

  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', closeModal);

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.textContent = 'Draft Player';
  confirmBtn.disabled = validPositions.length === 0;
  confirmBtn.addEventListener('click', () => {
    const selected = modalContent.querySelector('input[name="position"]:checked');
    if (selected) {
      const positionId = selected.value;
      const targetSlot = getSlotElement(positionId);

      closeModal(() => {
        if (targetSlot && currentCardElement) {
          flyPlayer(currentCardElement, targetSlot, () => {
            gameState.draftPlayer(currentPlayer, positionId, currentSquad);
          });
        } else {
          gameState.draftPlayer(currentPlayer, positionId, currentSquad);
        }
      });
    }
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(confirmBtn);
  body.appendChild(actions);

  modalContent.appendChild(header);
  modalContent.appendChild(body);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  fadeIn(modalOverlay, 250);
  fadeIn(modalContent, 350);
}

function closeModal(onComplete) {
  if (!modalOverlay) return;
  fadeOut(modalContent, 200);
  fadeOut(modalOverlay, 300, () => {
    if (modalOverlay) {
      modalOverlay.remove();
      modalOverlay = null;
      modalContent = null;
    }
    if (onComplete) onComplete();
  });
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay) {
    closeModal();
  }
});
