import { GameMode, GameStatus } from '../types/game/state.type.js'
import { log } from '../utils/index.js'
import Position from '../entities/Position.js'
import GameAPIFactory from '../factories/GameAPIFactory.js'
import { IGameAPI } from '../types/api/game-api.type.js'
import GameState from '../entities/GameState.js'
import StrategyManager from './StrategyManager.js'
import StrategyManagerFactory from '../factories/StrategyManagerFactory.js'
import Skill from '../entities/Skill.js'

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

    await this.init(strategy)
    if (this.game === undefined) {
      return;
    }

    while (this.game.getStatus() !== GameStatus.Terminated) {
      switch (this.game.getStatus()) {
        case GameStatus.Empty:
          await this.init(strategy)
          break
        case GameStatus.Registering:
          await this.check()
          break
        case GameStatus.Playing:
          await this.play()
          break
        case GameStatus.Ended:
          await this.init(strategy)
          break
      }
    }
  }

  private async play() {

    if (this.game.isPlayerTurn()) {
      await this.castSkills()
    }

    if (this.game.isPlayerTurn()) {
      await this.performMove()
    }

    if (!this.game.isPlayerTurn()) {
      await this.check()
    }

  }

  private async castSkills() {
    // TODO: foreach the skills
    const skill = this.strategyManager.determineCast(this.game);

    if (!skill) return

    await this.cast(skill);
  }

  private async performMove() {
    await this.move(this.strategyManager.determineMove(this.game));
  }

  private async init(strategy: any) {
    try {
      const gameStateData = await this.gameAPI.init(
        this.ckey,
        this.mode
      )

      this.game = new GameState(gameStateData, strategy)

    } catch (error) {
      log.apiError(`${this.ckey} - init()`, error)
    }
  }

  private async check(): Promise<void> {
    try {
      const gameStateData = await this.gameAPI.check(this.ckey)
      this.game.update(gameStateData)
    } catch (error) {
      log.apiError(`${this.ckey} - check()`, error)
    }
  }

  private async cast(skill: Skill) {
    try {
      const gameStateData = await this.gameAPI.cast(
        this.ckey,
        skill.getID(),
        skill.getTarget().x,
        skill.getTarget().y
      )
      this.game.update(gameStateData)
    } catch (error) {
      log.apiError(`${this.ckey} - cast()`, error)
    }
  }

  private async move(position: Position) {
    try {
      const gameStateData = await this.gameAPI.move(this.ckey, position.x, position.y)
      this.game.update(gameStateData)
    } catch (error) {
      log.apiError(`${this.ckey} - move()`, error)
    }
  }
}

export default CBot
