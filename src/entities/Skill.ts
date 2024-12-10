import Position from './Position.js'
import { SkillStatus } from '../types/game/skill.type.js'

class Skill {
  public readonly id: number
  public readonly name: string
  public readonly type: number
  public readonly status: number
  public readonly possibleTargets: Position[]

  constructor(skillData: any) {
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
