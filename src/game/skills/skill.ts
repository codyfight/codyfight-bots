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

  public get category(): SkillCategory {
    return SkillRegistry[this.id]?.category || SkillCategory.Unknown;
  }

  public getHealing(): number {
    return SkillRegistry[this.id]?.healing ?? 0;
  }

  public getArmor(): number {
    return SkillRegistry[this.id]?.armor ?? 0;
  }

  public get ready(): boolean {
    return this.status === SkillStatus.Ready
  }

  public canTarget(target: Position): boolean {
    return this.possibleTargets.some((possibleTarget) => possibleTarget.equals(target))
  }
}

export default Skill

// Skill Casting Improvement Ideas

// Enhancing movement through skill casting
// Addition of a Skill Cast Resolver class to determine the result of casting a skill
// Each skill can have a category (e.g., healing, damaging, movement)
// For the movement skills, we can check what target the skill applies to
// if it's the current player, we can find the result (position) of the skill cast and include it in the pathfinding algorithm
// The tricky part with this will be selecting the best moment to cast the skill, as it could be used to overcome obstacles
// We should save it so it is available when needed

// The resolver class can then be enhanced for different skill categories
// For example, for healing skills, the resolver can calculate the amount (%) of healing applied to the player
// For damaging skills, the resolver can calculate the amount (%) of damage dealt to the target
// Other skills can be a bit more tricky, and depend on the goal of the agent
// For example, A utility skill that builds something and reduces an enemies available moves
