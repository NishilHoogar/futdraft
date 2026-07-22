/**
 * Pitch.js
 * Renders the football pitch with player slots.
 */

import { FORMATIONS, gameState } from './GameState.js';
import { slideIn, pulse } from './Animations.js';

export function renderPitch(container) {
  container.innerHTML = '';

  const formation = gameState.currentFormation;
  if (!formation) return;

  const pitchWrapper = document.createElement('div');
  pitchWrapper.className = 'pitch-wrapper';

  const pitch = document.createElement('div');
  pitch.className = 'pitch';

  // Pitch markings
  const markings = document.createElement('div');
  markings.className = 'pitch-markings';
  markings.innerHTML = `
    <div class="center-circle"></div>
    <div class="center-line"></div>
    <div class="penalty-area top"></div>
    <div class="penalty-area bottom"></div>
    <div class="goal-area top"></div>
    <div class="goal-area bottom"></div>
    <div class="corner-arc tl"></div>
    <div class="corner-arc tr"></div>
    <div class="corner-arc bl"></div>
    <div class="corner-arc br"></div>
  `;
  pitch.appendChild(markings);

  // Player slots
  const positions = FORMATIONS[formation].positions;
  positions.forEach((pos, index) => {
    const slot = document.createElement('div');
    slot.className = 'player-slot';
    slot.dataset.positionId = pos.id;
    slot.dataset.positionLabel = pos.label;

    const correctedX = Math.max(8, Math.min(92, pos.x - 4));
    slot.style.setProperty('--slot-x', `${correctedX}%`);
    slot.style.setProperty('--slot-y', `${pos.y}%`);
    slot.style.setProperty('--slot-size', 'clamp(54px, 8vw, 78px)');

    const existing = gameState.selectedPlayers[pos.id];
    if (existing) {
      slot.classList.add('filled');
      slot.innerHTML = `
        <div class="slot-player">
          <div class="slot-rating">${existing.player.overall}</div>
          <div class="slot-name">${existing.player.name}</div>
          <div class="slot-flag">${existing.squad.flag}</div>
        </div>
      `;
    } else {
      slot.classList.add('empty');
      slot.innerHTML = `
        <div class="slot-placeholder">
          <span class="slot-label">${pos.label}</span>
        </div>
      `;
    }

    pitch.appendChild(slot);

    // Animate slots appearing
    slot.style.opacity = '0';
    slot.style.transform = 'scale(0.5)';
    setTimeout(() => {
      slot.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      slot.style.opacity = '1';
      slot.style.transform = 'scale(1)';
    }, 100 + index * 60);
  });

  pitchWrapper.appendChild(pitch);
  container.appendChild(pitchWrapper);
}

export function updateSlot(positionId) {
  const slot = document.querySelector(`.player-slot[data-position-id="${positionId}"]`);
  if (!slot) return;

  const pos = FORMATIONS[gameState.currentFormation].positions.find(p => p.id === positionId);
  const existing = gameState.selectedPlayers[positionId];

  slot.classList.remove('empty', 'filled');

  if (existing) {
    slot.classList.add('filled');
    slot.innerHTML = `
      <div class="slot-player">
        <div class="slot-rating">${existing.player.overall}</div>
        <div class="slot-name">${existing.player.name}</div>
        <div class="slot-flag">${existing.squad.flag}</div>
      </div>
    `;
    pulse(slot);
  } else {
    slot.classList.add('empty');
    slot.innerHTML = `
      <div class="slot-placeholder">
        <span class="slot-label">${pos.label}</span>
      </div>
    `;
  }
}

export function getSlotElement(positionId) {
  return document.querySelector(`.player-slot[data-position-id="${positionId}"]`);
}
