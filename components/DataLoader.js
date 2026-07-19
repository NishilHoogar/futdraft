/**
 * DataLoader.js
 * Handles fetching and parsing squad data from JSON.
 */

export async function loadSquads() {
  try {
    const response = await fetch('./data/squads.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const squads = await response.json();
    return squads;
  } catch (error) {
    console.error('Failed to load squads:', error);
    return [];
  }
}
