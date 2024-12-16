import Position from '../../../game/map/Position.js'
import GameState from '../../../game/state/GameState.js'
import { randomElement } from '../../../utils/utils.js'
import GameMap from '../../../game/map/GameMap.js'
import PlayerAgent from '../../../game/agents/PlayerAgent.js'

class MoveStrategy {
  public determineMove(game: GameState): Position {
    const bearer = game.getBearer()
    return bearer.getPosition() // don't move
  }

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
