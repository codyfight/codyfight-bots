import { GameMode, GameStatus } from '../../game/state/game-state.type.js'
import GameState from '../../game/state/GameState.js'
import { IGameAPI } from '../../game/api/IGameAPi.js'
import Logger from '../../utils/Logger.js'
import GameAPIFactory from '../../game/api/GameAPIFactory.js'
import { StrategyFactory } from '../strategies/StrategyFactory.js'
import { safeApiCall } from '../../utils/utils.js'
import Skill from '../../game/skills/Skill.js'
import Position from '../../game/map/Position.js'
import ICBotConfig from './ICBotConfig.js'
import MoveStrategy from '../strategies/move/MoveStrategy.js'
import CastStrategy from '../strategies/cast/CastStrategy.js'

class CBot {
  private readonly ckey: string
  private readonly mode: GameMode
  private readonly url: string

  private game!: GameState

  private gameAPI: IGameAPI

  private moveStrategy: MoveStrategy
  private castStrategy: CastStrategy

  private logger: Logger

  constructor({
    ckey,
    mode,
    url,
    logging,
    move_strategy,
    cast_strategy
  }: ICBotConfig) {
    this.ckey = ckey
    this.mode = mode
    this.url = url
    this.gameAPI = GameAPIFactory.create(url)
    this.logger = new Logger(logging)

    this.moveStrategy = StrategyFactory.createMoveStrategy(move_strategy)
    this.castStrategy = StrategyFactory.createCastStrategy(cast_strategy)
  }

  public async run() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.logger.startRun(this.ckey)
      const status = this.getStatus()

      switch (status) {
        case GameStatus.Empty:
          this.logger.logGameStatus(this.ckey, status, 'init')
          await this.init()
          break
        case GameStatus.Registering:
          this.logger.logGameStatus(this.ckey, status, 'check')
          await this.check()
          break
        case GameStatus.Playing:
          this.logger.logGameStatus(this.ckey, status, 'play')
          await this.play()
          break
        case GameStatus.Ended:
          this.logger.logGameStatus(this.ckey, status, 'init')
          await this.init()
          break
        default:
          this.logger.logGameStatus(this.ckey, status, 'check')
          await this.check()
          break
      }
    }
  }

  public getStatus(): GameStatus {
    return this.game ? this.game.getStatus() : GameStatus.Empty
  }

  public toString(): string {
    return `
    CBot {
      ckey: "${this.ckey}",
      mode: "${GameMode[this.mode]}",
      url: "${this.url}",
      moveStrategy: "${this.moveStrategy.constructor.name}",
      castStrategy: "${this.castStrategy.constructor.name}",
    }`
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
    const gameStateData = await safeApiCall(() =>
      this.gameAPI.init(this.ckey, this.mode)
    )

    if (gameStateData) {
      this.game = new GameState(gameStateData)
      this.moveStrategy.init(this.game)
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
