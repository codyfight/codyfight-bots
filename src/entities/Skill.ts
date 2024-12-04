import Position from './Position.js'

class Skill {
  id: number
  name: string
  type: number
  possibleTargets: Position[]

  constructor(skillData: any) {
    this.id = skillData.id
    this.name = skillData.name
    this.type = skillData.type

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
}

export default Skill
