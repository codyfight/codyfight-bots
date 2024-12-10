import { randomElement } from '../../utils/utils.js'
import Position from '../../entities/Position.js'
import GameState from '../../entities/GameState.js'
import MoveStrategy from './MoveStrategy.js'

class RandomMoveStrategy extends MoveStrategy {
  determineMove(game: GameState): Position | null {
    const map = game.getMap();
    const bearer = game.getBearer();
    const possibleMoves = bearer.getPossibleMoves();

    const safeMoves = possibleMoves.filter((position: Position) => {
      const tile = map.getTile(position);
      return !tile.isDangerous();
    });

    return randomElement(safeMoves);
  }
}

export default RandomMoveStrategy
