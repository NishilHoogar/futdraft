/**
 * GameState.js
 * Central state management for the World Cup Draft game.
 * Handles formations, drafted players, squad tracking, and team statistics.
 */

export const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { id: 'gk',  label: 'GK',  x: 50, y: 88 },
      { id: 'lb',  label: 'LB',  x: 15, y: 68 },
      { id: 'cb1', label: 'CB',  x: 38, y: 68 },
      { id: 'cb2', label: 'CB',  x: 62, y: 68 },
      { id: 'rb',  label: 'RB',  x: 85, y: 68 },
      { id: 'cm1', label: 'CM',  x: 30, y: 48 },
      { id: 'cm2', label: 'CM',  x: 50, y: 48 },
      { id: 'cm3', label: 'CM',  x: 70, y: 48 },
      { id: 'lw',  label: 'LW',  x: 20, y: 28 },
      { id: 'st',  label: 'ST',  x: 50, y: 18 },
      { id: 'rw',  label: 'RW',  x: 80, y: 28 }
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { id: 'gk',  label: 'GK',  x: 50, y: 88 },
      { id: 'lb',  label: 'LB',  x: 15, y: 68 },
      { id: 'cb1', label: 'CB',  x: 38, y: 68 },
      { id: 'cb2', label: 'CB',  x: 62, y: 68 },
      { id: 'rb',  label: 'RB',  x: 85, y: 68 },
      { id: 'cdm1', label: 'CDM', x: 38, y: 52 },
      { id: 'cdm2', label: 'CDM', x: 62, y: 52 },
      { id: 'cam', label: 'CAM', x: 50, y: 35 },
      { id: 'lw',  label: 'LW',  x: 20, y: 30 },
      { id: 'st',  label: 'ST',  x: 50, y: 15 },
      { id: 'rw',  label: 'RW',  x: 80, y: 30 }
    ]
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { id: 'gk',  label: 'GK',  x: 50, y: 88 },
      { id: 'lb',  label: 'LB',  x: 15, y: 68 },
      { id: 'cb1', label: 'CB',  x: 38, y: 68 },
      { id: 'cb2', label: 'CB',  x: 62, y: 68 },
      { id: 'rb',  label: 'RB',  x: 85, y: 68 },
      { id: 'lm',  label: 'LM',  x: 15, y: 45 },
      { id: 'cm1', label: 'CM',  x: 38, y: 45 },
      { id: 'cm2', label: 'CM',  x: 62, y: 45 },
      { id: 'rm',  label: 'RM',  x: 85, y: 45 },
      { id: 'st1', label: 'ST',  x: 38, y: 18 },
      { id: 'st2', label: 'ST',  x: 62, y: 18 }
    ]
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { id: 'gk',  label: 'GK',  x: 50, y: 88 },
      { id: 'cb1', label: 'CB',  x: 30, y: 68 },
      { id: 'cb2', label: 'CB',  x: 50, y: 68 },
      { id: 'cb3', label: 'CB',  x: 70, y: 68 },
      { id: 'lwb', label: 'LWB', x: 15, y: 45 },
      { id: 'cm1', label: 'CM',  x: 35, y: 45 },
      { id: 'cm2', label: 'CM',  x: 50, y: 45 },
      { id: 'cm3', label: 'CM',  x: 65, y: 45 },
      { id: 'rwb', label: 'RWB', x: 85, y: 45 },
      { id: 'st1', label: 'ST',  x: 38, y: 18 },
      { id: 'st2', label: 'ST',  x: 62, y: 18 }
    ]
  }
};

// Position categories for stat calculations
const ATTACK_POSITIONS = ['ST', 'LW', 'RW', 'CAM'];
const MIDFIELD_POSITIONS = ['CM', 'CDM', 'CAM', 'LM', 'RM'];
const DEFENSE_POSITIONS = ['GK', 'LB', 'RB', 'CB', 'LWB', 'RWB'];

class GameState {
  constructor() {
    this.currentFormation = null;
    this.selectedPlayers = {}; // positionId -> { player, squad }
    this.availableSquads = [];
    this.usedSquadIndices = new Set();
    this.currentSquad = null;
    this.allSquads = [];
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  getState() {
    return {
      formation: this.currentFormation,
      selectedPlayers: this.selectedPlayers,
      currentSquad: this.currentSquad,
      isComplete: this.isDraftComplete(),
      stats: this.calculateStats()
    };
  }

  setSquads(squads) {
    this.allSquads = squads;
    this.availableSquads = [...squads];
    this.usedSquadIndices.clear();
  }

  selectFormation(formationKey) {
    this.currentFormation = formationKey;
    this.selectedPlayers = {};
    this.usedSquadIndices.clear();
    this.currentSquad = null;
    this.notify();
  }

  drawNextSquad() {
    if (this.availableSquads.length === 0) return null;
    const idx = Math.floor(Math.random() * this.availableSquads.length);
    const squad = this.availableSquads.splice(idx, 1)[0];
    this.currentSquad = squad;
    this.notify();
    return squad;
  }

  draftPlayer(player, positionId, squad) {
    this.selectedPlayers[positionId] = { player, squad };
    this.currentSquad = null;
    this.notify();
  }

  isDraftComplete() {
    if (!this.currentFormation) return false;
    const positions = FORMATIONS[this.currentFormation].positions;
    return positions.every(pos => this.selectedPlayers[pos.id]);
  }

  getEmptyPositions() {
    if (!this.currentFormation) return [];
    const positions = FORMATIONS[this.currentFormation].positions;
    return positions.filter(pos => !this.selectedPlayers[pos.id]);
  }

  getFilledPositions() {
    if (!this.currentFormation) return [];
    const positions = FORMATIONS[this.currentFormation].positions;
    return positions.filter(pos => this.selectedPlayers[pos.id]);
  }

  calculateStats() {
    const players = Object.values(this.selectedPlayers);
    if (players.length === 0) {
      return {
        overall: 0,
        attack: 0,
        midfield: 0,
        defense: 0,
        chemistry: 0
      };
    }

    const overall = Math.round(
      players.reduce((sum, p) => sum + p.player.overall, 0) / players.length
    );

    const attackPlayers = players.filter(p =>
      ATTACK_POSITIONS.some(pos => p.player.positions.includes(pos))
    );
    const attack = attackPlayers.length
      ? Math.round(attackPlayers.reduce((sum, p) => sum + p.player.overall, 0) / attackPlayers.length)
      : 0;

    const midfieldPlayers = players.filter(p =>
      MIDFIELD_POSITIONS.some(pos => p.player.positions.includes(pos))
    );
    const midfield = midfieldPlayers.length
      ? Math.round(midfieldPlayers.reduce((sum, p) => sum + p.player.overall, 0) / midfieldPlayers.length)
      : 0;

    const defensePlayers = players.filter(p =>
      DEFENSE_POSITIONS.some(pos => p.player.positions.includes(pos))
    );
    const defense = defensePlayers.length
      ? Math.round(defensePlayers.reduce((sum, p) => sum + p.player.overall, 0) / defensePlayers.length)
      : 0;

    const chemistry = this.calculateChemistry(players);

    return { overall, attack, midfield, defense, chemistry };
  }

  calculateChemistry(players) {
    if (players.length < 2) return 0;

    let chemistry = 0;
    const pairs = [];

    // Generate all pairs
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        pairs.push([players[i], players[j]]);
      }
    }

    for (const [a, b] of pairs) {
      // Same squad (country + year)
      if (a.squad.country === b.squad.country && a.squad.year === b.squad.year) {
        chemistry += 15;
      }
      // Same country, different year
      else if (a.squad.country === b.squad.country) {
        chemistry += 8;
      }
      // Same continent (simplified: check country groups)
      else if (this.sameRegion(a.squad.country, b.squad.country)) {
        chemistry += 3;
      }
    }

    // Normalize to 0-100
    const maxPossible = pairs.length * 15;
    return Math.min(100, Math.round((chemistry / maxPossible) * 100));
  }

  sameRegion(c1, c2) {
    const europe = ['France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'England', 'Portugal', 'Uruguay'];
    const southAmerica = ['Brazil', 'Argentina', 'Uruguay'];
    if (europe.includes(c1) && europe.includes(c2)) return true;
    if (southAmerica.includes(c1) && southAmerica.includes(c2)) return true;
    return false;
  }

  reset() {
    this.currentFormation = null;
    this.selectedPlayers = {};
    this.availableSquads = [...this.allSquads];
    this.usedSquadIndices.clear();
    this.currentSquad = null;
    this.notify();
  }
}

export const gameState = new GameState();
