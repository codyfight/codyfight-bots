import { createCastStrategy, createMoveStrategy } from '../strategies/strategy-factory.js'
import { ICBotConfig, ICBotState } from './c-bot-config.interface.js'
import MoveStrategy from '../strategies/move/move-strategy.js'
import CastStrategy from '../strategies/cast/cast-strategy.js'
import GameClient from '../api/game-client.js'
import BotState from '../state/bot-state.js'
import Logger from '../../utils/logger.js'
import createBotState from '../state/create-bot-state.js'
import { wait } from '../../utils/utils.js'
import { TICK_INTERVAL } from '../../config/constants.js'
import EventEmitter from 'node:events'
import handleBotError from '../c-bot-error-handler.js'
import GameNode from '../../game/pathfinding/game-node.js'

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

class CBot extends EventEmitter {

  private readonly playerId: number | undefined // TODO - review if player id should be required
  private _state: BotState
  public readonly gameClient: GameClient
  private moveStrategy: MoveStrategy
  private castStrategy: CastStrategy

  private _active = false
  
  constructor({ player_id, ckey, mode, status, move_strategy, cast_strategy }: ICBotConfig) {
    super()
    this.playerId = player_id
    this.gameClient = new GameClient(ckey, mode)
    this.moveStrategy = createMoveStrategy(move_strategy)
    this.castStrategy = createCastStrategy(cast_strategy)
    this._state = createBotState(this, status)
  }


  public async initialise(action: 'check' | 'init'): Promise<void> {
    await this.gameClient[action]();

    const state = this.gameClient.state;
    if (!state) return

    this.moveStrategy.init(state);
    this.castStrategy.init(state);
  }

  public async start(): Promise<void> {
    this.active = true;
    this.state.start();
    this.run().catch(error => Logger.error(`Error in run loop for bot "${this.ckey}":`, error));
  }

  public async resume(): Promise<void> {
    this.active = true;
    this.state.resume();
    this.run().catch(error => Logger.error(`Error in run loop for bot "${this.ckey}":`, error));
  }

  public async stop() {
    this.state.stop()
  }

  public async run(): Promise<void> {
    while (this.active) {
      try {
        await this.state.tick();
        await wait(TICK_INTERVAL);
      } catch (error) {
        await handleBotError(this, error as Error)
      }
    }

    Logger.info(`Game completed for bot "${this.ckey}". Run loop exited.`);
  }

  public finishGame(): void {
    this.active = false;
    this.emit('restart', this.ckey);
  }

  public stopPlaying(): void {
    this.active = false;
    this.emit('stopped', this.ckey)
  }

  public get ckey(): string {
    return this.gameClient.ckey
  }

  public get status(): ICBotState {
    return {
      bot_state: this._state.status,
      game_state: this.gameClient.status
    }
  }

  public get state(): BotState {
    return this._state
  }

  public set state(value: BotState) {
    this._state = value;
  }

  public set active(value: boolean) {
    this._active = value
  }

  public get active(): boolean {
    return this._active
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  public toJSON(): ICBotConfig {
    return {
      player_id: this.playerId,
      ckey: this.gameClient.ckey,
      status: this.state.status,
      mode: this.gameClient.mode,
      move_strategy: this.moveStrategy.type,
      cast_strategy: this.castStrategy.type
    }
  }

  public async play() {
    await this.gameClient.check()
    const targets = this.moveStrategy.targets
    const path = this.moveStrategy.getPath(targets)
    await this.castSkills(path)
    await this.performMove(path)
  }

  private async castSkills(path: GameNode[]): Promise<void> {
    const cast = this.castStrategy.determineCast(path);
    if (!cast) return;

    const [skill, target] = cast;
    await this.gameClient.cast(skill, target);
    await this.castSkills(path);
  }
  
  private async performMove(path: GameNode[]) {
    const state = this.gameClient.state
    if (!state || !state.isPlayerTurn()) return

    const nextMove = this.moveStrategy.determineMove(path)
    if (!nextMove) return

    await this.gameClient.move(nextMove)
  }
}

export default CBot
