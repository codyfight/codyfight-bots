import Position from '../../../game/map/Position.js'
import GameState from '../../../game/state/GameState.js'
import { randomElement } from '../../../utils/utils.js'
import GameMap from '../../../game/map/GameMap.js'
import PlayerAgent from '../../../game/agents/PlayerAgent.js'

export enum MoveStrategyType {
  Exit = 'Exit',
  Random = 'Random',
}

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
