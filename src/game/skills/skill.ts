import Position from '../map/position.js'
import { SkillCategory, SkillRegistry, SkillStatus } from './skill-type.js'


class Skill {
  public readonly id: number
  public readonly name: string
  public readonly type: number
  public readonly status: number
  public readonly damage: number
  public readonly possibleTargets: Position[]

  constructor(skillData: any) {
    this.id = skillData.id
    this.name = skillData.name
    this.type = skillData.type
    this.status = skillData.status
    this.damage = skillData.damage

    this.possibleTargets = skillData.possible_targets.map(
      (target: any) => new Position(target.x, target.y)
    )
  }

  public getCategory(): SkillCategory | undefined {
    return SkillRegistry[this.id]?.category;
  }

  public getHealing(): number {
    return SkillRegistry[this.id]?.healing ?? 0;
  }

  public getArmor(): number {
    return SkillRegistry[this.id]?.armor ?? 0;
  }

  public isReady(): boolean {
    return this.status === SkillStatus.Ready
  }

  public canTarget(target: Position): boolean {
    return this.possibleTargets.some((possibleTarget) => possibleTarget.equals(target))
  }
}

export default Skill
