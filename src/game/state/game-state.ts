import { GameMode, GameStatus, IGameState, IGameStatus } from './game-state.type.js'
import IUpdatable from '../interfaces/updatable.interface.js'
import GameAgentManager from '../agents/game-agent-manager.js'
import GameMap from '../map/game-map.js'
import PlayerAgent from '../agents/player-agent.js'
import GameAgent from '../agents/game-agent.js'
import GameError from '../../errors/game-error.js'
import SpecialAgent from '../agents/special-agent.js'
import { SpecialAgentType } from '../agents/game-agent.type.js'

/**
 * The GameState class represents the current state of the game and provides methods to update it.
 *
 * Key Responsibilities:
 * - Holds and manages all game entities, including players, agents, and the game map.
 * - Implements the `IUpdatable` interface to define how the game state and its components
 *   are updated when new game data is received.
 * - Provides utility methods for querying game information (e.g., turn status, players).
 *
 * Overview:
 * - The `update` method is called whenever new game state data is received from the API.
 *   It updates the status, agents, and map accordingly.
 * - Includes helper methods to access specific parts of the game state, such as the player's
 *   turn, the map, or the opponent.
 * - Designed to work closely with other updatable components (e.g., agents, maps).
 */

class GameState implements IUpdatable {
  private status: GameStatus
  private mode: GameMode
  private gameAgentManager: GameAgentManager
  private readonly map: GameMap

  constructor(gameState: IGameState) {
    const { bearer, opponent } = gameState.players
    const { special_agents } = gameState

    this.status = gameState.state.status
    this.mode = gameState.state.mode

    this.map = new GameMap(gameState.map)

    this.gameAgentManager = new GameAgentManager(
      bearer,
      opponent,
      special_agents
    )
    this.map = new GameMap(gameState.map)
  }

  public update(gameState: IGameState): void {
    try {
      const { bearer, opponent } = gameState.players
      const { special_agents } = gameState

      this.status = gameState.state.status
      this.mode = gameState.state.mode

      this.gameAgentManager.update(bearer, opponent, special_agents)
      this.map.update(gameState.map, this.gameAgentManager.getAgents())
    } catch (error) {
      throw new GameError(error, {
          Message: "An error occurred while updating game state",
          GameState: this.toString()
        }
      );
    }
  }

  public getStatus(): GameStatus {
    return this.status
  }

  public getBearer(): PlayerAgent {
    return this.gameAgentManager.getBearer()
  }

  public getOpponent(): GameAgent {
    return this.gameAgentManager.getOpponent()
  }

  public getSpecialAgents() : Map<SpecialAgentType, SpecialAgent[]> {
    return this.gameAgentManager.getSpecialAgents()
  }

  public getMap(): GameMap {
    return this.map
  }

  public isPlayerTurn(): boolean {
    return this.gameAgentManager.getBearer().isTurn()
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  public toJSON(): IGameStatus {
    return {
      status: this.status,
      mode: this.mode,
    };
  }
}

export default GameState
