import { MoveStrategyType } from './move-strategy.type.js'
import MoveStrategy from './move-strategy.js'
import { SpecialAgentType } from '../../../game/agents/game-agent.type.js'
import { TileType } from '../../../game/map/tile/tile.type.js'


class DynamicMoveStrategy extends MoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Dynamic
  }

  protected setTargets(): void {
    const ryoPositions = this.specialAgents.get(SpecialAgentType.MrRyo)?.map(agent => agent.position) || [];
    const exit = this.map.findClosestTilePosition(TileType.ExitGate, this.bearer.position);
    const opponent = this.opponent.position;

    this._targets =  [...(exit ? [exit] : []), ...ryoPositions, opponent];
  }

}

export default DynamicMoveStrategy
