import GameMap from '../entities/GameMap.js'
import Agent from '../entities/Agents/Agent.js'
import PlayerAgent from '../entities/Agents/PlayerAgent.js'
import { GameStatus } from '../types/game/state.type.js'
import { GameService } from '../services/GameService.js'
import log from '../utils/log.js'

enum Phase {
  Cast,
  Move
}

class GameEngine {
  private phase: Phase = Phase.Cast

  constructor(
    private gameService: GameService,
    private gameMap: GameMap,
    private bearer: PlayerAgent,
    private opponent: Agent,
    private round: number
  ) {}

  async run(): Promise<void> {
    while (this.gameInProgress()) {
      if (this.roundChanged()) {
        this.reset()
      }

      this.update()
      await this.processCurrentPhase()
      await this.gameService.updateGameState()
    }
  }

  private async processCurrentPhase(): Promise<void> {
    switch (this.phase) {
      case Phase.Cast:
        await this.bearer.castSkill()
        this.phase = Phase.Move
        break

      case Phase.Move:
        log.gameInfo(this.gameService.getGameState())
        await this.bearer.makeMove()
        this.phase = Phase.Cast
        break

      default:
        throw new Error(`Unhandled game phase: ${this.phase}`)
    }
  }

  private update(): void {
    const gameState = this.gameService.getGameState()
    if (!gameState) return

    this.gameMap.update(gameState.map)
    this.opponent.update(gameState.players.opponent)
    this.bearer.update(gameState.players.bearer)
  }

  private reset(): void {
    console.debug('New round resetting map')
    const gameState = this.gameService.getGameState()
    this.round = this.gameService.getRound()
    this.gameMap.reset(gameState.map)
  }

  private gameInProgress(): boolean {
    return this.gameService.getStatus() === GameStatus.Playing
  }

  private roundChanged(): boolean {
    return this.round !== this.gameService.getRound()
  }
}

export default GameEngine
