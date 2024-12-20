import Position from '../../../game/map/Position.js'
import GameState from '../../../game/state/GameState.js'
import { randomElement } from '../../../utils/utils.js'
import GameMap from '../../../game/map/GameMap.js'
import PlayerAgent from '../../../game/agents/PlayerAgent.js'
import { IMoveStrategy } from './move-strategy.type.js'
import PathFinder from '../../../utils/PathFinder.js'
import GameAgent from '../../../game/agents/GameAgent.js'

abstract class MoveStrategy implements IMoveStrategy {
  protected map!: GameMap
  protected bearer!: PlayerAgent
  protected opponent!: GameAgent

  public init(game: GameState): void {
    this.map = game.getMap()
    this.bearer = game.getBearer()
    this.opponent = game.getOpponent()
  }

  /**
   * Get the next from the result of the pathfinding.
   * If the path is valid, and the next step is found, returns that step.
   * Otherwise, returns the current position.
   */
  public determineMove(): Position {
    const pathFinder = new PathFinder(this.map)

    const startPosition = this.bearer.getPosition()
    let target = this.getTarget()

    let path = pathFinder.findPathToTarget(startPosition, target)

    // TODO - Handle this better
    if (!path || path.length === 0) {
      target = this.getSecondaryTarget();
      path = pathFinder.findPathToTarget(startPosition, target);
    }

    return this.getNextValidMove(path) || startPosition
  }

  /**
   * Concrete move strategies must determine the target
   */
  protected abstract getTarget(): Position

  // TODO - Handle this better
  protected getSecondaryTarget() : Position {
    return this.bearer.getPosition()
  }

  /**
   * Returns a random safe move from the bearer’s possible moves.
   * If no safe moves exist, returns any random move.
   */
  protected getRandomMove(): Position {
    const possibleMoves = this.bearer.getPossibleMoves()
    const safeMoves = this.filterSafeMoves(possibleMoves)

    return safeMoves.length > 0
      ? randomElement(safeMoves)
      : randomElement(possibleMoves)
  }

  /**
   * Using the path from the player position to the target,
   * returns the next valid move or null
   */
  private getNextValidMove(path: Position[]): Position | null {
    if (path.length > 1) {
      const nextPosition = path[1]
      if (this.isMovePossible(nextPosition)) {
        return nextPosition
      }
    }
    return null
  }

  private isMovePossible(position: Position): boolean {
    return this.bearer.getPossibleMoves().some((move) => move.equals(position))
  }

  /**
   * Returning only moves that are considered safe.
   */
  private filterSafeMoves(positions: Position[]): Position[] {
    return positions.filter((pos) => {
      const tile = this.map.getTile(pos)
      return tile && !tile.isDangerous()
    })
  }
}

export default MoveStrategy
