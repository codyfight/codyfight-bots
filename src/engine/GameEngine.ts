import GameMap from '../entities/Map.js'
import Agent from '../entities/Agents/Agent.js'
import PlayerAgent from '../entities/Agents/PlayerAgent.js'
import { GameStatus } from '../types/game/state.type.js'
import { GameService } from '../services/GameService.js'

enum Phase {
  Cast,
  Move
}

class GameEngine {
  private phase: Phase = Phase.Cast

  constructor(
    private gameService: GameService,
    private map: GameMap,
    private bearer: PlayerAgent,
    private opponent: Agent
  ) {}

  async run(): Promise<void> {
    while (this.gameInProgress()) {
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

    this.map.update(gameState.map)
    this.opponent.update(gameState.players.opponent)
    this.bearer.update(gameState.players.bearer)
  }

  private gameInProgress(): boolean {
    return this.gameService.getStatus() === GameStatus.Playing
  }
}

export default GameEngine
