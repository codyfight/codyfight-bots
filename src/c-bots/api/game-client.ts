import { safeApiCall } from '../../utils/utils.js'
import Logger from '../../utils/logger.js'
import { IGameAPI } from '../api/game-api.interface.js'
import GameState from '../../game/state/game-state.js'
import { createGameAPI } from './game-api-factory.js'
import config from '../../config/env.js'
import Position from '../../game/map/position.js'
import { GameMode, GameStatus } from '../../game/state/game-state.type.js'

class GameClient {
  public readonly ckey: string
  public readonly mode: GameMode
  public readonly environment: string

  private readonly gameAPI: IGameAPI
  private gameState: GameState | null = null

  constructor(ckey: string, mode: GameMode, environment: string) {
    this.ckey = ckey
    this.mode = mode
    this.environment = environment
    this.gameAPI = createGameAPI(environment == 'production' ? config.PROD_API_URL : config.DEV_API_URL)
  }

  public get state(): GameState | null {
    return this.gameState
  }

  public get status(): GameStatus {
    return this.state
      ? this.state.getStatus()
      : GameStatus.Uninitialised
  }

  public async init(): Promise<void> {
    Logger.debug(`${this.ckey} => init()`)
    const initGameState = async () => this.gameAPI.init(this.ckey, this.mode)
    const data = await safeApiCall(initGameState)
    this.updateGameState(data)
  }

  public async check(): Promise<void> {
    Logger.debug(`${this.ckey} => check()`)
    const checkGameState = async () => this.gameAPI.check(this.ckey)
    const data = await safeApiCall(checkGameState)
    this.updateGameState(data)
  }

  public async move(position: Position): Promise<void> {
    Logger.debug(`${this.ckey} => move(${position.x},${position.y})`)
    const moveAgent = async () => this.gameAPI.move(this.ckey, position.x, position.y)
    const data = await safeApiCall(moveAgent)
    this.updateGameState(data)
  }

  public async cast(skillId: number, position: Position): Promise<void> {
    Logger.debug(`${this.ckey} => cast(skillId=${skillId}, x=${position.x}, y=${position.y})`)
    const castSkill = async () => this.gameAPI.cast(this.ckey, skillId, position.x, position.y)
    const data = await safeApiCall(castSkill)
    this.updateGameState(data)
  }

  public async surrender(): Promise<void> {
    Logger.debug(`${this.ckey} => surrender()`)
    const surrenderCall = async () => this.gameAPI.surrender(this.ckey)
    const data = await safeApiCall(surrenderCall)
    this.updateGameState(data)
  }

  private updateGameState(data: any): void {
    if (!this.gameState) {
      this.gameState = new GameState(data)
    } else {
      this.gameState.update(data)
    }
  }
}

export default GameClient
