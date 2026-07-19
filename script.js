/**
 * script.js
 * Main entry point for World Cup Draft.
 * Orchestrates game flow: formation selection -> drafting -> team completion.
 */

import { loadSquads } from './components/DataLoader.js';
import { gameState } from './components/GameState.js';
import { renderFormationSelector } from './components/FormationSelector.js';
import { renderPitch } from './components/Pitch.js';
import { renderDraftBoard, clearDraftBoard } from './components/DraftBoard.js';
import { renderTeamPanel, updateTeamPanel } from './components/TeamPanel.js';
import { fadeIn, fadeOut, slideIn } from './components/Animations.js';

// DOM Elements
const appContainer = document.getElementById('app');
const formationScreen = document.getElementById('formation-screen');
const gameScreen = document.getElementById('game-screen');
const pitchContainer = document.getElementById('pitch-container');
const draftContainer = document.getElementById('draft-container');
const teamPanelContainer = document.getElementById('team-panel-container');
const nextRoundBtn = document.getElementById('next-round-btn');
const roundInfo = document.getElementById('round-info');

// State
let squadsLoaded = false;

/**
 * Initialize the game.
 */
async function init() {
  // Load squad data
  const squads = await loadSquads();
  if (squads.length === 0) {
    appContainer.innerHTML = '<div class="error-message">Failed to load squad data. Please refresh.</div>';
    return;
  }

  gameState.setSquads(squads);
  squadsLoaded = true;

  // Subscribe to state changes
  gameState.subscribe(handleStateChange);

  // Render formation selector
  renderFormationSelector(formationScreen);

  // Show formation screen
  fadeIn(formationScreen, 400);
}

/**
 * Handle game state changes.
 */
function handleStateChange(state) {
  // If formation was just selected, transition to game screen
  if (state.formation && formationScreen.style.display !== 'none') {
    transitionToGameScreen();
  }

  // Update team panel stats
  updateTeamPanel();

  // If a player was drafted, handle next round
  if (state.currentSquad === null && state.formation && !state.isComplete) {
    showNextRoundButton();
  }

  // If draft is complete
  if (state.isComplete) {
    handleDraftComplete();
  }
}

/**
 * Transition from formation selection to game screen.
 */
function transitionToGameScreen() {
  fadeOut(formationScreen, 300, () => {
    formationScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    fadeIn(gameScreen, 400);

    // Render initial UI
    renderPitch(pitchContainer);
    renderTeamPanel(teamPanelContainer);

    // Draw first squad
    setTimeout(() => {
      drawNewSquad();
    }, 500);
  });
}

/**
 * Draw a new squad for the current round.
 */
function drawNewSquad() {
  const squad = gameState.drawNextSquad();
  if (!squad) {
    // No more squads available
    draftContainer.innerHTML = '<div class="draft-empty">No more squads available!</div>';
    return;
  }

  renderDraftBoard(draftContainer);
  updateRoundInfo();
  nextRoundBtn.style.display = 'none';
}

/**
 * Show the next round button after a player is selected.
 */
function showNextRoundButton() {
  draftContainer.innerHTML = '';
  nextRoundBtn.style.display = 'inline-flex';
  nextRoundBtn.textContent = 'Next Round';
  nextRoundBtn.disabled = false;
}

/**
 * Update round information display.
 */
function updateRoundInfo() {
  const filled = Object.keys(gameState.selectedPlayers).length;
  const total = gameState.currentFormation
    ? gameState.getEmptyPositions().length + filled
    : 0;
  roundInfo.textContent = `Round ${filled + 1} of ${total}`;
}

/**
 * Handle draft completion.
 */
function handleDraftComplete() {
  draftContainer.innerHTML = '';
  nextRoundBtn.style.display = 'none';
  roundInfo.textContent = 'Draft Complete!';

  // Show completion message
  const completionMsg = document.createElement('div');
  completionMsg.className = 'draft-complete-message';
  completionMsg.innerHTML = `
    <div class="complete-icon">🏆</div>
    <h2>Team Complete!</h2>
    <p>Your World Cup Draft team is ready for battle.</p>
  `;
  draftContainer.appendChild(completionMsg);
  fadeIn(completionMsg, 500);
}

// Next round button handler
nextRoundBtn.addEventListener('click', () => {
  nextRoundBtn.disabled = true;
  drawNewSquad();
});

// Start the game
init();
