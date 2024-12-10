import { GameMode, GameStatus } from '../types/game/state.type.js'
import Position from '../entities/Position.js'
import GameAPIFactory from '../factories/GameAPIFactory.js'
import { IGameAPI } from '../types/api/game-api.type.js'
import GameState from '../entities/GameState.js'
import StrategyManager from './StrategyManager.js'
import StrategyManagerFactory from '../factories/StrategyManagerFactory.js'
import Skill from '../entities/Skill.js'
import { safeApiCall } from '../utils/utils.js'

class CBot {
  private game!: GameState

  private gameAPI: IGameAPI
  private strategyManager: StrategyManager

  constructor(
    public readonly ckey: string,
    private mode: GameMode,
    private opponent?: string
  ) {
    this.gameAPI = GameAPIFactory.get()
    this.strategyManager = StrategyManagerFactory.get()
  }

  public async run(strategy: any) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      switch (this.getStatus()) {
        case GameStatus.Empty:
          console.debug(`ckey: ${this.ckey}, GameStatus: Empty -> init`);
          await this.init(strategy);
          break;
        case GameStatus.Registering:
          console.debug(`ckey: ${this.ckey}, GameStatus: Registering -> check`);
          await this.check();
          break;
        case GameStatus.Playing:
          console.debug(`ckey: ${this.ckey}, GameStatus: Playing -> play`);
          await this.play();
          break;
        case GameStatus.Ended:
          console.debug(`ckey: ${this.ckey}, GameStatus: Ended -> init`);
          await this.init(strategy);
          break;
        default:
          console.debug(`ckey: ${this.ckey}, GameStatus: Unknown -> check`);
          await this.check();
          break;
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
    const result = this.strategyManager.determineCast(this.game)

    if (!result) return

    const [skill, target] = result

    await this.cast(skill, target)
  }

  private async performMove() {
    const move = this.strategyManager.determineMove(this.game)

    if (!move) return

    await this.move(move)
  }

  private async init(strategy: any) {
    const gameStateData = await safeApiCall(() =>
      this.gameAPI.init(this.ckey, this.mode)
    )

    if (gameStateData) {
      this.game = new GameState(gameStateData, strategy)
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
