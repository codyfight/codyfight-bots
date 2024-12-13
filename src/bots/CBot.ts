import { GameMode, GameStatus } from '../types/game/state.type.js'
import Position from '../game/entities/core/Position.js'
import GameAPIFactory from '../game/factories/GameAPIFactory.js'
import { IGameAPI } from '../types/api/game-api.type.js'
import GameState from '../game/entities/core/GameState.js'
import Skill from '../game/entities/core/Skill.js'
import { safeApiCall } from '../utils/utils.js'
import MoveStrategy from './strategies/MoveStrategy.js'
import CastStrategy, { CastStrategyType } from './strategies/CastStrategy.js'
import Logger from '../utils/Logger.js'
import { CBotConfig } from '../types/game/index.js'
import { StrategyFactory } from './factories/StrategyFactory.js'

class CBot {

  public readonly ckey : string
  private readonly mode: GameMode

  private game!: GameState

  private gameAPI: IGameAPI

  private moveStrategy: MoveStrategy
  private castStrategy: CastStrategy

  private logger: Logger

  constructor({ ckey, mode, url, logging, move_strategy }: CBotConfig) {
    this.ckey = ckey
    this.mode = mode
    this.gameAPI = GameAPIFactory.create(url)
    this.logger = new Logger(logging)

    this.moveStrategy = StrategyFactory.createMoveStrategy(move_strategy)
    this.castStrategy = StrategyFactory.createCastStrategy(CastStrategyType.Random)
  }

  public async run() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.logger.startRun(this.ckey);
      const status = this.getStatus()

      switch (status) {
        case GameStatus.Empty:
          this.logger.logGameStatus(this.ckey, status, 'init');
          await this.init()
          break
        case GameStatus.Registering:
          this.logger.logGameStatus(this.ckey, status, 'check');
          await this.check()
          break
        case GameStatus.Playing:
          this.logger.logGameStatus(this.ckey, status, 'play');
          await this.play()
          break
        case GameStatus.Ended:
          this.logger.logGameStatus(this.ckey, status, 'init');
          await this.init()
          break
        default:
          this.logger.logGameStatus(this.ckey, status, 'check');
          await this.check()
          break
      }
    }
  }

  public getStatus(): GameStatus {
    return this.game ? this.game.getStatus() : GameStatus.Empty
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
    const nextMove = this.moveStrategy.determineMove(this.game)

    if (!nextMove) return

    await this.move(nextMove)
  }

  private async init() {
    const gameStateData = await safeApiCall(() =>
      this.gameAPI.init(this.ckey, this.mode)
    )

    if (gameStateData) {
      this.game = new GameState(gameStateData)
    }
  }

  private async check(): Promise<void> {
    const gameStateData = await safeApiCall(() => this.gameAPI.check(this.ckey))

    if (gameStateData) {
      this.game.update(gameStateData)
    }
  }

  private async cast(skill: Skill, target: Position) {
    const gameStateData = await safeApiCall(() =>
      this.gameAPI.cast(this.ckey, skill.id, target.x, target.y)
    )

    if (gameStateData) {
      this.game.update(gameStateData)
    }
  }

  private async move(position: Position) {
    const gameStateData = await safeApiCall(() =>
      this.gameAPI.move(this.ckey, position.x, position.y)
    )

    if (gameStateData) {
      this.game.update(gameStateData)
    }
  }
}

export default CBot
