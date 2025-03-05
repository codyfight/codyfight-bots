import TileEffect from './tile-effect.js'
import { TileType } from '../tile.type.js'
import { IAgentState } from '../../../agents/game-agent.type.js'

const DAMAGE_VALUES: Partial<Record<TileType, number>> = {
  [TileType.DeathPit]: 1024,
  [TileType.ProximityMine]: 150,
  [TileType.BoobyTrap]: 75,
  [TileType.ZapTrap]: 30
}


class DamageEffect extends TileEffect {
  private readonly damage: number

  constructor(isCharged: boolean, tileType: TileType) {
    super(isCharged)
    this.damage = DAMAGE_VALUES[tileType] || 0
  }


  public apply(agentState: IAgentState) : IAgentState {
    const remainingHitpoints = agentState.hitpoints - this.damage
    return {
      ...agentState,
      hitpoints: Math.max(remainingHitpoints, 0)
    }
  }

}

export default DamageEffect
