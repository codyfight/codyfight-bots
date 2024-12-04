import Position from './Position.js'
import { SkillStatus } from '../types/game/skill.type.js'

class Skill {
  id: number
  name: string
  type: number
  status: number
  possibleTargets: Position[]

  constructor(skillData: any) {
    this.id = skillData.id
    this.name = skillData.name
    this.type = skillData.type
    this.status = skillData.status

    this.possibleTargets = skillData.possible_targets.map(
      (target: any) => new Position(target.x, target.y)
    )
  }

  public getTarget(): Position {
    const index = Math.floor(Math.random() * this.possibleTargets.length)
    return this.possibleTargets[index]
  }

  public hasTargets(): boolean {
    return this.possibleTargets.length > 0
  }

  public isReady(): boolean {
    return this.status === SkillStatus.Ready
  }
}

export default Skill
