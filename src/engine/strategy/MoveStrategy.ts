import Position from '../../entities/Position.js'
import GameState from '../../entities/GameState.js'
import { randomElement } from '../../utils/utils.js'
import GameMap from '../../entities/GameMap.js'
import PlayerAgent from '../../entities/Agents/PlayerAgent.js'

abstract class MoveStrategy {
  abstract determineMove(game: GameState): Position;

  protected getRandomMove(map: GameMap, bearer: PlayerAgent ): Position {

    const possibleMoves = bearer.getPossibleMoves();

    const safeMoves = possibleMoves.filter((position: Position) => {
      const tile = map.getTile(position);
      return !tile!.isDangerous();
    });

    return randomElement(safeMoves);
  }
}

export default MoveStrategy
