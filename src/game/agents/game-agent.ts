import IUpdatable from '../interfaces/updatable.interface.js'
import Position from '../map/position.js'
import { IAgent } from './game-agent.type.js'
import { isRestoreEffective } from '../utils/game-utils.js'

class GameAgent implements IUpdatable {
  readonly id: number
  readonly name: string
  private _position: Position = new Position(0, 0)

  private _hitpoints!: number;
  private hitpointsCap!: number;
  private armor!: number;
  private armorCap!: number;
  private energy!: number;
  private energyCap!: number;

  constructor(agentData: IAgent) {
    this.id = agentData.id
    this.name = agentData.name
    this.update(agentData)
  }

  public update(agentData: IAgent): void {
    this.hitpointsCap = agentData.stats.hitpoints_cap;
    this.armorCap = agentData.stats.armor_cap;
    this.energyCap = agentData.stats.energy_cap;
    this._hitpoints = agentData.stats.hitpoints;
    this.armor = agentData.stats.armor;
    this.energy = agentData.stats.energy;
    this.setPosition(agentData)
  }

  public get position(): Position {
    return this._position
  }

  public get hitpoints(): number {
    return this._hitpoints + this.armor
  }

  public isHitpointsRestoreEffective(restoreValue: number, threshold = 0.8): boolean {
    return isRestoreEffective(this.hitpoints, this.hitpointsCap, restoreValue, threshold);
  }

  public isArmorRestoreEffective(restoreValue: number, threshold = 0.8): boolean {
    return isRestoreEffective(this.armor, this.armorCap, restoreValue, threshold);
  }

  public isEnergyRestoreEffective(restoreValue: number, threshold = 0.8): boolean {
    return isRestoreEffective(this.energy, this.energyCap, restoreValue, threshold);
  }

  private setPosition(agentData: IAgent): void {
    if (agentData.position) {
      this._position = new Position(agentData.position.x, agentData.position.y)
    }
  }
}

export default GameAgent
