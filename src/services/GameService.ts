import { GAME_API_URL } from '../constants/constants.js'
import { IGameAPI } from '../types/api/game-api.type.js'
import { IGameState } from '../types/game/index.js'
import { GameMode, GameStatus } from '../types/game/state.type.js'
import GameAPI from 'codyfight-game-client'
import Position from '../entities/Position.js'
import { log } from '../utils/index.js'

export class GameService {
  private gameAPI: IGameAPI
  private gameState!: IGameState
  private status: GameStatus
  private round: number

  constructor(
    private readonly ckey: string,
    private readonly mode: GameMode
  ) {
    this.round = 0
    this.status = GameStatus.Empty
    this.gameAPI = new GameAPI(GAME_API_URL) as IGameAPI
  }

  public async initGame(): Promise<void> {
    console.debug('Initializing game...')

    try {
      this.gameState = await this.gameAPI.init(this.ckey, this.mode)
      this.updateState()
    } catch (error) {
      log.apiError('Initializing Game', error)
    }
  }

  public async updateGameState(): Promise<void> {
    console.debug('Checking game state...')
    try {
      this.gameState = await this.gameAPI.check(this.ckey)
      this.updateState()
    } catch (error) {
      log.apiError('Updating Game State', error)
    }
  }

  public async move(position: Position): Promise<void> {
    console.debug('Moving Agent...')
    try {
      this.gameState = await this.gameAPI.move(
        this.ckey,
        position.x,
        position.y
      )
    } catch (error: any) {
      log.apiError('Moving Agent', error)
    }
  }

  public async castSkill(skillId: number, target: Position): Promise<void> {
    console.debug('Casting Skill...')
    try {
      this.gameState = await this.gameAPI.cast(
        this.ckey,
        skillId,
        target.x,
        target.y
      )
    } catch (error: any) {
      log.apiError('Casting Skill', error)
    }
  }

  public getGameState(): IGameState {
    return this.gameState
  }

  public getStatus(): GameStatus {
    return this.status
  }

  public getRound(): number {
    return this.round
  }

  private updateState(): void {
    if (this.gameState) {
      this.status = this.gameState.state.status as GameStatus
      this.round = this.gameState.state.round as number

      console.debug('Game Status:', this.status)
      console.debug('Round :', this.round)
    }
  }
}
