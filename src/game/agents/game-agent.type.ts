import Position from '../map/position.js'
import Skill from '../skills/skill.js'

export interface ISkillState {
  id: number;
  ready: boolean;
}

export interface IAgentState {
  position: Position;
  hitpoints: number;
  skillsState: ISkillState[];
}

export interface IAgent {
  id: number
  name: string
  position: Position
  stats: IAgentStats
}

interface IAgentStats{
  armor: number
  armor_cap: number
  hitpoints: number
  hitpoints_cap: number
  energy: number
  energy_cap: number
}

export interface IPlayerAgent extends IAgent {
  is_player_turn: boolean
  skills: Skill[]
  possible_moves: Position[]
}

export interface ISpecialAgent extends IAgent {
  type: SpecialAgentType
}

export enum SpecialAgentType {
  MrRyo = 1,
  Kix = 2,
  Llama = 3,
  Ripper = 4,
  Buzz = 5,
  Mole = 6,
  Bomber = 7,
  Ghost = 8
}
