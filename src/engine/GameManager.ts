import GameEngine from './GameEngine.ts';
import { GameStatus } from '../types/game/state.type.ts';
import { gameAPI } from '../services/index.ts';
import Map from '../entities/Map.ts';
import Agent from '../entities/Agent.ts';
import  sleep  from '../utils/sleep.ts';

class GameManager {
  private engine!: GameEngine;
  private status: GameStatus;

  constructor(private ckey: string, private mode: number) {
    this.status = GameStatus.Empty;
  }


  async initialize(): Promise<void> {
    console.debug('Initializing game...');

    const gameState = await gameAPI().init(this.ckey, this.mode);
    this.status = gameState.state.status as GameStatus;

    const map = new Map(gameState.map);
    const bearer = new Agent(gameState.players.bearer);
    const opponent = new Agent(gameState.players.opponent);

    this.engine = new GameEngine(map, bearer, opponent);

    console.debug('Game initialized with status:', this.status);
  }

  async start(): Promise<void> {
    while (this.status !== GameStatus.Ended) {
      await this.processState();
    }
  }

  private async processState(): Promise<void> {
    switch (this.status) {
      case GameStatus.Registering:
        await this.matchMake();
        break;

      case GameStatus.Playing:
        await this.update();
        break;

      case GameStatus.Ended:
        this.end();
        break;

      default:
        console.error(`Unknown game status: ${this.status}`);
        this.end();
        break;
    }
  }

  private end(): void {
    console.debug('Ending game...');
    this.status = GameStatus.Ended;
  }

  private async update(): Promise<void> {
    await this.engine.run();
    await this.setStatus();
  }

  private async matchMake(): Promise<void> {
    console.debug('Waiting for matchmaking...');
    do {
      await this.setStatus();
      await sleep(1000);
    } while (this.status === GameStatus.Registering);

    if (this.status === GameStatus.Playing) {
      console.debug('Matchmaking complete, game is now playing.');
    } else {
      console.error('Matchmaking failed or unexpected state.');
      this.end();
    }
  }

  private async setStatus(): Promise<void> {
    const gameState = await gameAPI().check(this.ckey);
    this.status = gameState.state.status as GameStatus;
  }
}

export default GameManager;
