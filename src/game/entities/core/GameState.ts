import GameMap from './GameMap.js'
import Updatable from '../../interfaces/Updatable.js'
import { IGameState } from '../../../types/game/index.js'
import { GameStatus } from '../../../types/game/state.type.js'
import GameAgent from '../agents/GameAgent.js'
import PlayerAgent from '../agents/PlayerAgent.js'
import SpecialAgent from '../agents/SpecialAgent.js'

class GameState implements Updatable {
  private readonly map: GameMap
  private status: GameStatus

  private readonly bearer: PlayerAgent
  private opponent: GameAgent

  private specialAgents: SpecialAgent [] = []

  constructor(gameState: IGameState) {
    this.map = new GameMap(gameState.map)
    this.status = gameState.state.status

    this.bearer = new PlayerAgent(gameState.players.bearer)
    this.opponent = new GameAgent(gameState.players.opponent)

    for (const agent of gameState.special_agents) {
      this.specialAgents.push(new SpecialAgent(agent));
    }
  }

  public update(gameState: IGameState): void {
    try {
      this.map.update(gameState.map);
      this.status = gameState.state.status;

      this.bearer.update(gameState.players.bearer);
      this.opponent.update(gameState.players.opponent);


      for (const agent of this.specialAgents) {
        const updatedAgentData = gameState.special_agents.find(a => a.id === agent.id);

        if (updatedAgentData) {
          agent.update(updatedAgentData);
        }

      }

    } catch (error) {
      console.log("An error occurred while updating game state", error);
    }
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

  public isPlayerTurn(): boolean {
    return this.bearer.isTurn()
  }

}

export default GameState
