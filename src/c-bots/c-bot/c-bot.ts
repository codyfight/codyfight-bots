import { GameMode, GameStatus } from '../../game/state/game-state.type.js'
import GameState from '../../game/state/game-state.js'
import { IGameAPI } from '../api/game-api.interface.js'
import { createCastStrategy, createMoveStrategy } from '../strategies/strategy-factory.js'
import { safeApiCall } from '../../utils/utils.js'
import Skill from '../../game/skills/skill.js'
import Position from '../../game/map/position.js'
import { ICBotConfig, ICBotStatus } from './c-bot-config.interface.js'
import MoveStrategy from '../strategies/move/move-strategy.js'
import CastStrategy from '../strategies/cast/cast-strategy.js'
import { createGameAPI } from '../api/game-api-factory.js'
import Logger from '../../utils/logger.js'
import { MoveStrategyType } from '../strategies/move/move-strategy.type.js'
import { CastStrategyType } from '../strategies/cast/cast-strategy.type.js'

/**
 * The CBot class is responsible for managing the lifecycle of a bot in the game.
 *
 * Key Responsibilities:
 * - Communicates with the game API to initialize, register, and play games.
 * - Implements move and cast strategies to determine the bot's actions during gameplay.
 * - Maintains the game state and updates it based on API responses.
 *
 * Overview:
 * - The bot operates in a loop (`run` method), continuously checking the game status
 *   and taking appropriate actions (e.g., initializing, registering, or playing).
 * - Strategies (`moveStrategy` and `castStrategy`) are used to make decisions for moves
 *   and skill casts during gameplay.
 * - The class uses a logger that can be enabled or disabled when creating the class.
 */

class CBot {
  public readonly ckey: string
  private readonly mode: GameMode
  private readonly url: string

  private active = false

  private game!: GameState

  private gameAPI: IGameAPI

  private moveStrategy: MoveStrategy
  private castStrategy: CastStrategy

  constructor({
    ckey,
    mode,
    url,
    move_strategy,
    cast_strategy
  }: ICBotConfig) {
    this.ckey = ckey
    this.mode = mode
    this.url = url
    this.gameAPI = createGameAPI(url)

    this.moveStrategy = createMoveStrategy(move_strategy)
    this.castStrategy = createCastStrategy(cast_strategy)
  }

  public async run() {
    this.active = true

    while (this.active) {

      const status = this.getGameStatus()

      switch (status) {
        case GameStatus.Empty:
          await this.init()
          break
        case GameStatus.Registering:
          await this.check()
          break
        case GameStatus.Playing:
          await this.play()
          break
        case GameStatus.Ended:
          await this.init()
          break
        default:
          await this.check()
          break
      }
    }

    await this.surrender()
  }

  public stop(){
    this.active = false
  }

  public isActive() : boolean{
    return this.active
  }

  public getStatus(): ICBotStatus {
    return {
      bot: this.toJSON(),
      game: this.game?.toJSON() || {}
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  public toJSON(): ICBotConfig {
    return {
      ckey: this.ckey,
      active: this.active,
      mode: this.mode,
      url: this.url,
      move_strategy: this.moveStrategy.constructor.name as MoveStrategyType,
      cast_strategy: this.castStrategy.constructor.name as CastStrategyType
    };
  }


  private async play() {
    await this.check()

    if (this.game.isPlayerTurn()) {
      await this.castSkills()
    }

    if (this.game.isPlayerTurn()) {
      await this.performMove()
    }
  }

  private async castSkills() {
    const nextCast = this.castStrategy.determineCast(this.game)

    if (!nextCast) return

    const [skill, target] = nextCast

    await this.cast(skill, target)
  }

  private async performMove() {
    const nextMove = this.moveStrategy.determineMove()

    if (!nextMove) return

    await this.move(nextMove)
  }

  private async init() {
    Logger.debug(`${this.ckey}, ${this.getGameStatus()}, init()`)
    const initGameState = async () => this.gameAPI.init(this.ckey, this.mode);
    const gameStateData = await safeApiCall(initGameState);

    if (gameStateData) {
      this.game = new GameState(gameStateData)
      this.moveStrategy.init(this.game)
    }
  }

  private async check(): Promise<void> {
    Logger.debug(`${this.ckey}, ${this.getGameStatus()}, check()`)
    const checkGameState = async () => this.gameAPI.check(this.ckey)
    const gameStateData = await safeApiCall(checkGameState)

    if (gameStateData) {
      this.game.update(gameStateData)
    }
  }

  private async cast(skill: Skill, target: Position) {
    Logger.debug(`${this.ckey}, ${this.getGameStatus()}, cast()`)
    const castSkill = async () => this.gameAPI.cast(this.ckey, skill.id, target.x, target.y)
    const gameStateData = await safeApiCall(castSkill)

    if (gameStateData) {
      this.game.update(gameStateData)
    }
  }

  private async move(position: Position) {
    Logger.debug(`${this.ckey}, ${this.getGameStatus()}, move()`)
    const moveAgent = async () =>  this.gameAPI.move(this.ckey, position.x, position.y)
    const gameStateData = await safeApiCall(moveAgent)

    if (gameStateData) {
      this.game.update(gameStateData)
    }
  }

  private async surrender() {
    Logger.debug(`${this.ckey}, ${this.getGameStatus()}, surrender()`)
    const surrender = async () => this.gameAPI.surrender(this.ckey)
    const gameStateData = await safeApiCall(surrender)

    if (gameStateData) {
      this.game.update(gameStateData)
    }
  }

  private getGameStatus(): GameStatus {
    return this.game ? this.game.getStatus() : GameStatus.Empty
  }
}

export default CBot
