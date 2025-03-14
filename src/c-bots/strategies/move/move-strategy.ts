import { IMoveStrategy, MoveStrategyType } from './move-strategy.type.js'
import GameMap from '../../../game/map/game-map.js'
import PlayerAgent from '../../../game/agents/player-agent.js'
import GameAgent from '../../../game/agents/game-agent.js'
import Position from '../../../game/map/position.js'
import GameState from '../../../game/state/game-state.js'
import { filterSafeMoves, randomElement } from '../../../game/utils/game-utils.js'
import BFSPathFinder from '../../../game/pathfinding/bfs-path-finder.js'
import SpecialAgent from '../../../game/agents/special-agent.js'
import { IAgentState, SpecialAgentType } from '../../../game/agents/game-agent.type.js'
import GameNode from '../../../game/pathfinding/game-node.js'

abstract class MoveStrategy implements IMoveStrategy {
  public abstract get type(): MoveStrategyType;

  protected map!: GameMap
  protected bearer!: PlayerAgent
  protected opponent!: GameAgent
  protected specialAgents!: Map<SpecialAgentType, SpecialAgent[]>

  protected _targets: Position[] = []

  protected path: GameNode[] = []

  protected abstract setTargets(): void

  public init(game: GameState): void {
    this.map = game.getMap()
    this.bearer = game.getBearer()
    this.opponent = game.getOpponent()
    this.specialAgents = game.getSpecialAgents()
  }

  public get targets(): Position[] {
    this._targets = []
    this.setTargets()
    return this._targets
  }

  /**
   * return the first valid position found from pathfinding on the targets array.
   * If the path is valid, and the next step is found, returns that step.
   * Otherwise, returns the default move.
   */
  public determineMove(path: GameNode[]): Position {
    // const path = this.getPath(this.targets)

    if(path.length > 0) {
      return this.getNextValidMove(path)
    }

    return this.getDefaultMove()
  }


  public getPath(targets: Position[]): GameNode[] {
    const state = this.bearer.createAgentState()

    for (const target of targets) {
      const pathFinder = new BFSPathFinder(state, target, this.map)
      const result = pathFinder.findPath(this.isGoal.bind(this))

      if (result) return result.path
    }

    return []
  }

  /**
   * Returns the default move to make if not path can be found
   */
  protected getDefaultMove(): Position {
    return this.getRandomMove()
  }

  /**
   * Returns a random safe move from the bearer’s possible moves.
   * If no safe moves exist, returns any random move.
   */
  protected getRandomMove(): Position {
    const possibleMoves = this.bearer.getPossibleMoves()
    const safeMoves = filterSafeMoves(this.map, possibleMoves)

    return safeMoves.length > 0
      ? randomElement(safeMoves)
      : randomElement(possibleMoves)
  }

  protected isGoal(state: IAgentState, target: Position) : boolean {
    return state.position.equals(target)
  }

  /**
   * Using the path from the player position to the target,
   * returns the next valid move or null
   */
  private getNextValidMove(path: GameNode[]): Position {

    const possible = this.isMovePossible(path[0].position)
    const position = possible ? path[0].position : this.bearer.position

    return position
  }

  /**
   * Checks if move is present in available moves
   */
  private isMovePossible(position: Position): boolean {
    return this.bearer.getPossibleMoves().some((move) => move.equals(position))
  }
}

export default MoveStrategy
