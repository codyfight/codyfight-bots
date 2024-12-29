import Position from '../map/Position.js'
import { ISkill, SkillStatus } from './skill.type.js'

class Skill {
  public readonly data: ISkill
  public readonly id: number
  public readonly name: string
  public readonly type: number
  public readonly status: number
  public readonly possibleTargets: Position[]

  constructor(skillData: ISkill) {
    this.data = skillData

    this.id = skillData.id
    this.name = skillData.name
    this.type = skillData.type
    this.status = skillData.status

    this.possibleTargets = skillData.possible_targets.map(
      (target: any) => new Position(target.x, target.y)
    )
  }

  public isReady(): boolean {
    return this.status === SkillStatus.Ready
  }
}

export default Skill
