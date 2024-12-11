import Position from '../../entities/Position.js'
import Skill from '../../entities/Skill.js'
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
