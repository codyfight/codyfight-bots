import GameMap from '../entities/Map.js'
import Agent from '../entities/Agents/Agent.js'
import PlayerAgent from '../entities/Agents/PlayerAgent.js'
import { GameStatus } from '../types/game/state.type.js'
import sleep from '../utils/sleep.js'
import { gameAPI } from '../services/index.js'

class GameEngine {
  private status: GameStatus
  private gameState: any

  constructor(
    private ckey: string,
    private map: GameMap,
    private bearer: PlayerAgent,
    private opponent: Agent
  ) {
    this.status = GameStatus.Playing
  }

  async run(): Promise<void> {
    do {
      await this.updateGameState()

      this.map.update(this.gameState.map)
      this.bearer.update(this.gameState.players.bearer)
      this.opponent.update(this.gameState.players.opponent)

      await this.bearer.takeTurn(this.ckey)
      await sleep(1000)
    } while (this.status === GameStatus.Playing)
  }

  private async updateGameState(): Promise<void> {
    this.gameState = await gameAPI().check(this.ckey)
    this.status = this.gameState.state.status as GameStatus
  }
}

export default GameEngine
