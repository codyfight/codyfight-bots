import { safeApiCall } from '../../utils/utils.js'
import Logger from '../../utils/logger.js'
import { IGameAPI } from '../api/game-api.interface.js'
import GameState from '../../game/state/game-state.js'
import { createGameAPI } from './game-api-factory.js'
import Position from '../../game/map/position.js'
import { GameMode, GameStatus } from '../../game/state/game-state.type.js'
import Skill from '../../game/skills/skill.js'

class GameClient {
  public readonly ckey: string
  public readonly mode: GameMode

  private readonly gameAPI: IGameAPI
  private readonly gameState: GameState

  constructor(ckey: string, mode: GameMode) {
    this.ckey = ckey
    this.mode = mode
    this.gameAPI = createGameAPI()
    this.gameState = new GameState()
  }

  public get state(): GameState {
    return this.gameState
  }

  public get status(): GameStatus {
    return this.state.getStatus()
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

  public async cast(skill: Skill, position: Position): Promise<void> {
    Logger.debug(`${this.ckey} => cast(skillId=${skill.id}, x=${position.x}, y=${position.y})`)
    const castSkill = async () => this.gameAPI.cast(this.ckey, skill.id, position.x, position.y)
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
    this.gameState.initialised || this.gameState.initialise(data);
    this.gameState.update(data);
  }

}

export default GameClient
