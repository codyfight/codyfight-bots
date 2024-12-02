import GameMap from '../entities/Map.ts';
import Agent from '../entities/Agent.ts';

class GameEngine {
  constructor(
    private map: GameMap,
    private bearer: Agent,
    private opponent: Agent
  ) {}

  async run(): Promise<void> {
    console.log('Brrrrr')
  }
}

export default GameEngine;
