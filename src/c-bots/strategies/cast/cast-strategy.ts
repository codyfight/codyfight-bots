import GameState from '../../../game/state/game-state.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'
import PlayerAgent from '../../../game/agents/player-agent.js'
import { ICastStrategy } from './cast-strategy.type.js'
import { randomElement } from '../../../game/utils/game-utils.js'

class CastStrategy implements ICastStrategy {
  public determineCast(game: GameState): [Skill, Position] | null {
    return null // No cast by default
  }

  protected getRandomCast(bearer: PlayerAgent): [Skill, Position] | null {
    const skills = bearer.getSkills()

    const castableSkills = skills.filter((skill) => skill.isReady())
    if (castableSkills.length === 0) return null

    const randomSkill = randomElement(castableSkills)
    if (!randomSkill) return null

    const randomTarget = randomElement(randomSkill.possibleTargets)
    if (!randomTarget) return null

    return [randomSkill, randomTarget]
  }
}

export default CastStrategy
