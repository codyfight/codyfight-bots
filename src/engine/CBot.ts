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
    // eslint-disable-next-line no-constant-condition
    while (true) {
      switch (this.getStatus()) {
        case GameStatus.Empty:
          await this.init(strategy)
          break
        case GameStatus.Playing:
          await this.play()
          break
        case GameStatus.Ended:
          await this.init(strategy)
          break
        default:
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

    // this.game.logGameState()

    if (this.game.isPlayerTurn()) {
      await this.castSkills()
    }

    if (this.game.isPlayerTurn()) {
      await this.performMove()
    }

    // if (!this.game.isPlayerTurn()) {
    //   await this.check()
    // }
  }

  private async castSkills() {
    // TODO: foreach the skills
    await this.check()

    console.log(
      'GAME STATE BEARER OBJECT',
      this.game
        .getBearer()
        .getSkills()
        .map((skill) => skill.possibleTargets)
    )

    const skill = this.strategyManager.determineCast(this.game)

    if (!skill) return

    await this.cast(skill)
  }

  private async performMove() {
    const move = this.strategyManager.determineMove(this.game)

    await this.move(move)
  }

  private async init(strategy: any) {
    try {
      console.debug(`Calling init()`)

      const startTime = performance.now()
      const gameStateData = await this.gameAPI.init(this.ckey, this.mode)
      const endTime = performance.now()

      const responseTime = endTime - startTime
      console.debug(`API response time: ${responseTime.toFixed(2)} ms`)

      // log.gameInfo(gameStateData, this.ckey)

      this.game = new GameState(gameStateData, strategy)
    } catch (error) {
      log.apiError(`${this.ckey} - init()`, error)
    }
  }

  private async check(): Promise<void> {
    try {
      console.debug(`Calling check()`)
      const startTime = performance.now()
      const gameStateData = await this.gameAPI.check(this.ckey)
      const endTime = performance.now()

      console.log(
        'GAME STATE BEARER DATA: ',
        this.game
          .getBearer()
          .getSkills()
          .map((skill) => skill.possibleTargets)
      )

      const responseTime = endTime - startTime
      console.debug(`API response time: ${responseTime.toFixed(2)} ms`)
      // log.gameInfo(gameStateData, this.ckey)
      this.game.update(gameStateData)
    } catch (error) {
      log.apiError(`${this.ckey} - check()`, error)
    }
  }

  private async cast(skill: Skill) {
    try {
      const target = skill.getTarget()
      console.debug(
        `Calling cast() - ${skill.name} on Target X:${target.x}, Y:${target.y}, SKILL: ${JSON.stringify(skill, null, 2)}`
      )

      const startTime = performance.now()

      console.log('CAST PAYLOAD: ', [
        this.ckey,
        skill.getID(),
        target.x,
        target.y
      ])

      const gameStateData = await this.gameAPI.cast(
        this.ckey,
        skill.getID(),
        target.x,
        target.y
      )

      console.log(
        'GAME STATE BEARER DATA FROM CAST: ',
        this.game
          .getBearer()
          .getSkills()
          .map((skill) => skill.possibleTargets)
      )
      const endTime = performance.now()

      const responseTime = endTime - startTime
      console.debug(`API response time: ${responseTime.toFixed(2)} ms`)

      // log.gameInfo(gameStateData, this.ckey)
      this.game.update(gameStateData)
    } catch (error) {
      log.apiError(`${this.ckey} - cast()`, error)

      await this.gameAPI.check(this.ckey).then((data) => {
        console.log(
          JSON.stringify(
            data?.players?.bearer?.skills?.map(
              (skill: any) => skill?.possible_targets
            ),
            null,
            2
          )
        )
      })
    }
  }

  private async move(position: Position) {
    try {
      console.debug(`Calling move() - X: ${position.x}, Y: ${position.y}`)

      const startTime = performance.now()
      const gameStateData = await this.gameAPI.move(
        this.ckey,
        position.x,
        position.y
      )

      const endTime = performance.now()

      const responseTime = endTime - startTime
      console.debug(`API response time: ${responseTime.toFixed(2)} ms`)

      // log.gameInfo(gameStateData, this.ckey)
      this.game.update(gameStateData)
    } catch (error) {
      log.apiError(`${this.ckey} - move()`, error)
    }
  }
}

export default CBot
