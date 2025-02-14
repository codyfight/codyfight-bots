import { safeApiCall } from '../../utils/utils.js'
import Logger from '../../utils/logger.js'
import { IGameAPI } from '../api/game-api.interface.js'
import GameState from '../../game/state/game-state.js'
import { createGameAPI } from './game-api-factory.js'
import config from '../../config/env.js'
import Position from '../../game/map/position.js'
import { GameMode, GameStatus } from '../../game/state/game-state.type.js'

class GameClient {
  public readonly ckey: string;
  public readonly mode: GameMode
  public readonly environment: string

  private readonly gameAPI: IGameAPI;
  private gameState: GameState | null = null;

  constructor(ckey : string, mode: GameMode, environment: string) {

    this.ckey = ckey;
    this.mode = mode;
    this.environment = environment;

    this.gameAPI = createGameAPI(environment == "production" ? config.PROD_API_URL : config.DEV_API_URL)
  }

  public get state(): GameState | null {
    return this.gameState;
  }

  public status(): GameStatus {
    return this.state
      ? this.state.getStatus()
      : GameStatus.Empty
  }

  public async init(): Promise<void> {
    Logger.debug(`${this.ckey} => init()`);
    const initGameState = async () => this.gameAPI.init(this.ckey, this.mode);
    const data = await safeApiCall(initGameState);
    if (data) {
      this.gameState = new GameState(data);
    }
  }

  public async check(): Promise<void> {
    if (!this.gameState) return;
    Logger.debug(`${this.ckey} => check()`);
    const checkGameState = async () => this.gameAPI.check(this.ckey);
    const data = await safeApiCall(checkGameState);
    if (data) {
      this.gameState.update(data);
    }
  }

  public async move(position: Position): Promise<void> {
    if (!this.gameState) return;
    Logger.debug(`${this.ckey} => move(${position.x},${position.y})`);
    const moveAgent = async () => this.gameAPI.move(this.ckey, position.x, position.y);
    const data = await safeApiCall(moveAgent);
    if (data) {
      this.gameState.update(data);
    }
  }

  public async cast(skillId: number, position: Position): Promise<void> {
    if (!this.gameState) return;
    Logger.debug(`${this.ckey} => cast(skillId=${skillId}, x=${position.x}, y=${position.y})`);
    const castSkill = async () => this.gameAPI.cast(this.ckey, skillId, position.x, position.y);
    const data = await safeApiCall(castSkill);
    if (data) {
      this.gameState.update(data);
    }
  }

  public async surrender(): Promise<void> {
    if (!this.gameState) return;
    Logger.debug(`${this.ckey} => surrender()`);
    const surrenderCall = async () => this.gameAPI.surrender(this.ckey);
    const data = await safeApiCall(surrenderCall);
    if (data) {
      this.gameState.update(data);
    }
  }
}

export default GameClient
