import Position from '../../game/entities/core/Position.js'
import Skill from '../../game/entities/core/Skill.js'
import { SpecialAgentType } from './special-agent.type.js'

export interface IAgent {
  id: number
  name: string
  position: Position
}

export interface IPlayerAgent extends IAgent {
  is_player_turn: boolean
  skills: Skill[]
  possible_moves: Position[]
}

export interface ISpecialAgent extends IAgent {
  type: SpecialAgentType
}
