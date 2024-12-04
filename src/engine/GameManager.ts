import GameEngine from './GameEngine.js'
import { GameMode, GameStatus } from '../types/game/state.type.js'
import Map from '../entities/Map.js'
import Agent from '../entities/Agents/Agent.js'
import PlayerAgent from '../entities/Agents/PlayerAgent.js'
import { GameService } from '../services/GameService.js'
import { CKEY } from '../constants/constants.js'

class GameManager {
  private engine!: GameEngine
  private gameService: GameService

  constructor() {
    this.gameService = new GameService(CKEY, GameMode.Sandbox)
  }

  async start(): Promise<void> {
    do {
      await this.processState()
      await this.gameService.updateGameState()
    } while (this.gameService.getStatus() !== GameStatus.Ended)
  }

  private async processState(): Promise<void> {
    const status = this.gameService.getStatus()

    switch (status) {
      case GameStatus.Empty:
        await this.gameService.initGame()
        break

      case GameStatus.Registering:
        console.debug('Matchmaking in progress...')
        break

      case GameStatus.Playing:
        await this.playGame()
        break

      case GameStatus.Ended:
        console.debug('Ending game...')
        break

      default:
        console.error(`Unknown game status: ${status}`)
        break
    }
  }

  private async playGame(): Promise<void> {
    if (!this.engine) {
      await this.initializeGameEngine()
    }

    await this.engine.run()
  }

  private async initializeGameEngine(): Promise<void> {
    console.debug('Initializing game engine...')

    const gameState = this.gameService.getGameState()

    const map = new Map(gameState.map)
    const bearer = new PlayerAgent(this.gameService, gameState.players.bearer)
    const opponent = new Agent(gameState.players.opponent)

    this.engine = new GameEngine(this.gameService, map, bearer, opponent)

    await this.gameService.updateGameState()

    console.debug('Game engine initialized.')
  }
}

export default GameManager
