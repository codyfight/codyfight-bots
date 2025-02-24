import { createCastStrategy, createMoveStrategy } from '../strategies/strategy-factory.js'
import { ICBotConfig } from './c-bot-config.interface.js'
import MoveStrategy from '../strategies/move/move-strategy.js'
import CastStrategy from '../strategies/cast/cast-strategy.js'
import GameClient from '../api/game-client.js'
import BotStoppedState from '../state/bot-stopped-state.js'
import BotState from '../state/bot-state.js'
import Logger from '../../utils/logger.js'
import { GameStatus } from '../../game/state/game-state.type.js'


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

  private state: BotState
  private playerId: number | undefined

  public readonly gameClient: GameClient
  private moveStrategy: MoveStrategy
  private castStrategy: CastStrategy

  public onStateChange!: () => void
  private runningLoopActive = false

  constructor({ player_id, ckey, mode, environment, status, move_strategy, cast_strategy }: ICBotConfig) {
    this.playerId = player_id
    this.state = new BotStoppedState(this) // TODO - Pass in state to continue from previous state
    this.gameClient = new GameClient(ckey, mode, environment)
    this.moveStrategy = createMoveStrategy(move_strategy)
    this.castStrategy = createCastStrategy(cast_strategy)
  }

  public ckey(): string {
    return this.gameClient.ckey
  }

  public setState(newState: BotState): void {
    this.state = newState
    if (newState === this.state) return;

    this.state = newState
    this.onStateChange();
  }

  public async getStatus(): Promise<{ bot_state: string; game_state: GameStatus }> {
    return {
      bot_state: this.state.status(),
      game_state: this.gameClient.status()
    }
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  public toJSON(): ICBotConfig {
    return {
      player_id: this.playerId,
      ckey: this.gameClient.ckey,
      status: this.state.status(),
      mode: this.gameClient.mode,
      environment: this.gameClient.environment,
      move_strategy: this.moveStrategy.type,
      cast_strategy: this.castStrategy.type
    }
  }

  public async start() {
    this.state.start()
    if (!this.runningLoopActive) {
      this.runningLoopActive = true
      this.run().catch((error) => {
        Logger.error(`Bot "${this.ckey()}" crashed unexpectedly:`, error)
      })
    }
  }

  public async stop() {
    this.state.stop()
  }

  public async run() {
    while (this.runningLoopActive) {
      await this.state.tick()
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  public async init() {
    await this.gameClient.init()
    const state = this.gameClient.state

    if (state) {
      this.moveStrategy.init(state)
    }
  }

  async play() {
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
