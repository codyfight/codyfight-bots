import GameMap from './GameMap.js'
import Updatable from '../interfaces/Updatable.js'
import { IGameState } from '../types/game/index.js'
import { GameStatus } from '../types/game/state.type.js'
import GameAgent from './Agents/GameAgent.js'
import PlayerAgent from './Agents/PlayerAgent.js'
import StrategyManagerFactory from '../factories/StrategyManagerFactory.js'
import StrategyManager from '../engine/StrategyManager.js'

class GameState implements Updatable {
  private map: GameMap
  private status: GameStatus

  private bearer: PlayerAgent
  private opponent: GameAgent

  private strategy: any
  public strategyManager: StrategyManager

  constructor(gameState: IGameState, strategy: any) {
    this.map = new GameMap(gameState.map)
    this.status = gameState.state.status

    this.bearer = new PlayerAgent(gameState.players.bearer)
    this.opponent = new GameAgent(gameState.players.opponent)

    this.strategy = strategy
    this.strategyManager = StrategyManagerFactory.get()
  }

  public update(gameState: IGameState): void {
    this.map.update(gameState.map)
    this.status = gameState.state.status

    this.bearer.update(gameState.players.bearer)
    this.opponent.update(gameState.players.opponent)
  }

  public getStatus(): GameStatus {
    return this.status
  }

  public getBearer(): PlayerAgent {
    return this.bearer
  }

  public getMap(): GameMap {
    return this.map
  }

  public getStrategy(): any {
    return this.strategy
  }

  public isPlayerTurn(): boolean {
    return this.bearer.isTurn()
  }
}

export default GameState
