import Position from '../../../game/map/Position.js'
import GameState from '../../../game/state/GameState.js'
import { randomElement } from '../../../utils/utils.js'
import GameMap from '../../../game/map/GameMap.js'
import PlayerAgent from '../../../game/agents/PlayerAgent.js'
import { IMoveStrategy } from './move-strategy.type.js'
import PathFinder from '../../../utils/PathFinder.js'
import GameAgent from '../../../game/agents/GameAgent.js'
import SpatialUtils from '../../../utils/SpatialUtils.js'

abstract class MoveStrategy implements IMoveStrategy {
  protected map!: GameMap
  protected bearer!: PlayerAgent
  protected opponent!: GameAgent

  protected targets: Position[] = []

  protected abstract setTargets(): void

  public init(game: GameState): void {
    this.map = game.getMap()
    this.bearer = game.getBearer()
    this.opponent = game.getOpponent()
  }

  /**
   * return the first valid position found from pathfinding on the targets array.
   * If the path is valid, and the next step is found, returns that step.
   * Otherwise, returns the default move.
   */
  public determineMove(): Position {
    this.targets = []
    this.setTargets()
    const start = this.bearer.getPosition()

    for (const target of this.targets) {
      const path = this.findPath(start, target)

      if (path.length > 1) {
        return this.getNextValidMove(path)
      }
    }

    return this.getDefaultMove()
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
    const safeMoves = SpatialUtils.filterSafeMoves(this.map, possibleMoves)

    return safeMoves.length > 0
      ? randomElement(safeMoves)
      : randomElement(possibleMoves)
  }

  private findPath(start: Position, target: Position): Position[] {
    const pathFinder = new PathFinder(this.map)
    return pathFinder.findPathToTarget(start, target)
  }

  /**
   * Using the path from the player position to the target,
   * returns the next valid move or null
   */
  private getNextValidMove(path: Position[]): Position {
    return this.isMovePossible(path[1]) ? path[1] : this.bearer.getPosition()
  }

  /**
   * Checks if move is present in available moves
   */
  private isMovePossible(position: Position): boolean {
    return this.bearer.getPossibleMoves().some((move) => move.equals(position))
  }
}

export default MoveStrategy
