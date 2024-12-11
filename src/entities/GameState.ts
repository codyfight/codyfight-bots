import GameMap from './GameMap.js'
import Updatable from '../interfaces/Updatable.js'
import { IGameState } from '../types/game/index.js'
import { GameStatus } from '../types/game/state.type.js'
import GameAgent from './Agents/GameAgent.js'
import PlayerAgent from './Agents/PlayerAgent.js'

class GameState implements Updatable {
  private map: GameMap
  private status: GameStatus

  private bearer: PlayerAgent
  private opponent: GameAgent

  private strategy: any

  constructor(gameState: IGameState) {
    this.map = new GameMap(gameState.map)
    this.status = gameState.state.status

    this.bearer = new PlayerAgent(gameState.players.bearer)
    this.opponent = new GameAgent(gameState.players.opponent)

  }

  public update(gameState: IGameState): void {

    try{
      this.map.update(gameState.map)
      this.status = gameState.state.status

      this.bearer.update(gameState.players.bearer)
      this.opponent.update(gameState.players.opponent)
    }catch(error){
      console.log("An error occurred while updating game state", error)
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

  public logGameState(): void {

    const tableData = [
      { Key: "Game Status", Value: this.status },
      { Key: "Current Round", Value: 'N/A' },
      { Key: "Player Turn", Value: this.isPlayerTurn() ? "Yes" : "No" },
      { Key: "Player Position", Value: `x: ${this.bearer.getPosition().x}, y: ${this.getBearer().getPosition().y}` },
      { Key: "Map Size", Value: this.getMap().getSize()},
      { Key: "Possible Moves", Value: this.bearer.getPossibleMoves().map((move) => `[x: ${move.x}, y: ${move.y}]`).join(", ") },
    ];

    console.info(`--- GameState Info: ---`);
    console.table(tableData);
    console.info('------------------');
  }
}

export default GameState
