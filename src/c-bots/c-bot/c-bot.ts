import { BotStatus, GameStatus } from '../../game/state/game-state.type.js'
import { createCastStrategy, createMoveStrategy } from '../strategies/strategy-factory.js'
import { ICBotConfig, ICBotInfo } from './c-bot-config.interface.js'
import MoveStrategy from '../strategies/move/move-strategy.js'
import CastStrategy from '../strategies/cast/cast-strategy.js'
import { MoveStrategyType } from '../strategies/move/move-strategy.type.js'
import { CastStrategyType } from '../strategies/cast/cast-strategy.type.js'
import GameClient from '../api/game-client.js'


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

  private status: BotStatus
  private gameClient: GameClient
  private moveStrategy: MoveStrategy
  private castStrategy: CastStrategy

  constructor({ ckey, mode, environment, move_strategy, cast_strategy }: ICBotConfig) {
    this.status = BotStatus.Initialising
    this.gameClient = new GameClient(ckey, mode, environment)
    this.moveStrategy = createMoveStrategy(move_strategy)
    this.castStrategy = createCastStrategy(cast_strategy)
  }

  public ckey(): string {
    return this.gameClient.ckey
  }

  public getStatus(): BotStatus {
    return this.status
  }

  public setStatus(status : BotStatus) {
    this.status = status
  }

  public isPlaying(): boolean {
    return this.status != BotStatus.Stopped
  }

  public getInfo(): ICBotInfo {
    return {
      bot: this.toJSON(),
      game: this.gameClient?.state?.toJSON() || {}
    }
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  public toJSON(): ICBotConfig {
    return {
      ckey: this.gameClient.ckey,
      status: this.status,
      mode: this.gameClient.mode,
      environment: this.gameClient.environment,
      move_strategy: this.moveStrategy.constructor.name as MoveStrategyType,
      cast_strategy: this.castStrategy.constructor.name as CastStrategyType
    }
  }

  public async run() {

    while (this.isPlaying()) {

      switch (this.gameClient.status()) {
        case GameStatus.Empty:
          await this.init()
          break
        case GameStatus.Registering:
          await this.gameClient.check()
          break
        case GameStatus.Playing:
          await this.play()
          break
        case GameStatus.Ended:
          await this.handleRestart()
          break
        default:
          await this.gameClient.check()
          break
      }

      await this.handleBotStatus()
    }
  }

  private async handleBotStatus() : Promise<void> {

    switch(this.status){
      case BotStatus.Surrendering:
        await this.gameClient.surrender()
        this.status = BotStatus.Finishing
        break
      case BotStatus.Initialising:
      case BotStatus.Playing:
      case BotStatus.Finishing:
      case BotStatus.Stopped:
      default:
        // do nothing
        break
    }

  }

  private async handleRestart(): Promise<void>{
    if(this.status === BotStatus.Playing){
      await this.init()
      return
    }

    this.status = BotStatus.Stopped
  }

  private async init() {
    await this.gameClient.init()
    const state = this.gameClient.state

    if (state) {
      this.moveStrategy.init(state)
      this.status = BotStatus.Playing
    }
  }

  private async play() {
    await this.gameClient.check()
    await this.castSkills()
    await this.performMove()
  }

  private async castSkills() {
    const state = this.gameClient.state
    if (!state || !state.isPlayerTurn()) return

    const nextCast = this.castStrategy.determineCast(state)
    if (!nextCast) return

    const [skill, target] = nextCast
    await this.gameClient.cast(skill.id, target)
  }

  private async performMove() {
    const state = this.gameClient.state
    if (!state || !state.isPlayerTurn()) return

    const nextMove = this.moveStrategy.determineMove()
    if (!nextMove) return

    await this.gameClient.move(nextMove)
  }
}

export default CBot
