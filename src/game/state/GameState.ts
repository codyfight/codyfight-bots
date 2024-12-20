import { GameStatus, IGameState } from './game-state.type.js'
import IUpdatable from '../interfaces/IUpdatable.js'
import GameAgentManager from '../agents/GameAgentManger.js'
import GameMap from '../map/GameMap.js'
import PlayerAgent from '../agents/PlayerAgent.js'
import GameAgent from '../agents/GameAgent.js'


class GameState implements IUpdatable {
  private status: GameStatus
  private gameAgentManager: GameAgentManager
  private readonly map: GameMap

  constructor(gameState: IGameState) {

    const { bearer, opponent } = gameState.players;
    const { special_agents } = gameState;

    this.status = gameState.state.status
    this.gameAgentManager = new GameAgentManager(bearer, opponent, special_agents);
    this.map = new GameMap(gameState.map)
  }

  public update(gameState: IGameState): void {
    try {
      const { bearer, opponent } = gameState.players;
      const { special_agents } = gameState;

      this.status = gameState.state.status;
      this.gameAgentManager.update(bearer, opponent, special_agents);
      this.map.update(gameState.map, this.gameAgentManager.getAgents());

    } catch (error) {
      console.error('An error occurred while updating game state', {
        error,
        context: this,
        gameState
      })
    }
  }

  public getStatus(): GameStatus {
    return this.status
  }

  public getBearer(): PlayerAgent {
    return this.gameAgentManager.getBearer()
  }

  public getOpponent(): GameAgent{
    return this.gameAgentManager.getOpponent()
  }

  public getMap(): GameMap {
    return this.map
  }

  public isPlayerTurn(): boolean {
    return this.gameAgentManager.getBearer().isTurn()
  }
}

export default GameState
