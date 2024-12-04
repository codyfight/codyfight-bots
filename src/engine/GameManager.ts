import GameEngine from './GameEngine.js'
import { GameStatus } from '../types/game/state.type.js'
import { gameAPI } from '../services/index.js'
import Map from '../entities/Map.js'
import Agent from '../entities/Agents/Agent.js'
import sleep from '../utils/sleep.js'
import PlayerAgent from '../entities/Agents/PlayerAgent.js'

class GameManager {
  private engine!: GameEngine
  private status: GameStatus
  private gameState: any

  constructor(
    private ckey: string,
    private mode: number
  ) {
    this.status = GameStatus.Empty
    this.gameState = null
  }

  async start(): Promise<void> {
    do {
      await this.processState()
      await sleep(1000)
      await this.updateGameState()
    } while (this.status !== GameStatus.Ended)
  }

  private async processState(): Promise<void> {
    switch (this.status) {
      case GameStatus.Empty:
        await this.startMatchmaking()
        break

      case GameStatus.Registering:
        console.debug('Matchmaking in progress...')
        break

      case GameStatus.Playing:
        await this.playGame()
        break

      case GameStatus.Ended:
        this.endGame()
        break

      default:
        console.error(`Unknown game status: ${this.status}`)
        this.endGame()
        break
    }
  }

  private async startMatchmaking(): Promise<void> {
    console.debug('Starting matchmaking...')
    this.gameState = await gameAPI().init(this.ckey, this.mode)
    this.status = this.gameState.state.status as GameStatus
  }

  private async playGame(): Promise<void> {
    if (!this.engine) {
      await this.initializeGameEngine()
    }
    await this.engine.run()
  }

  private async initializeGameEngine(): Promise<void> {
    console.debug('Initializing game engine...')

    const map = new Map(this.gameState.map)
    const bearer = new PlayerAgent(this.gameState.players.bearer)
    const opponent = new Agent(this.gameState.players.opponent)

    this.engine = new GameEngine(this.ckey, map, bearer, opponent)
    console.debug('Game engine initialized.')
  }

  private async updateGameState(): Promise<void> {
    this.gameState = await gameAPI().check(this.ckey)
    this.status = this.gameState.state.status as GameStatus
  }

  private endGame(): void {
    console.debug('Ending game...')
    this.status = GameStatus.Ended
  }
}

export default GameManager
