import Agent from './Agent.js'
import Skill from '../Skill.js'
import Position from '../Position.js'
import { GameService } from '../../services/GameService.js'
import { IAgentData } from '../../types/game/player.type.js'

class PlayerAgent extends Agent {
  constructor(
    protected gameService: GameService,
    agentData: IAgentData
  ) {
    super(agentData)
  }

  public async castSkill(): Promise<void> {
    if (!this.canCastSkill()) return

    const skill = this.getRandomCastableSkill()
    const target = skill.getTarget()
    await this.gameService.castSkill(skill.id, target)
  }

  public async makeMove(): Promise<void> {
    const position = this.getRandomPosition()
    await this.gameService.move(position)
  }

  private getRandomCastableSkill(): Skill {
    const castableSkills = this.skills.filter((skill) => skill.isReady())
    const index = Math.floor(Math.random() * castableSkills.length)
    return castableSkills[index]
  }

  private getRandomPosition(): Position {
    const index = Math.floor(Math.random() * this.possibleMoves.length)
    return this.possibleMoves[index]
  }

  private canCastSkill(): boolean {
    return this.skills.some((skill) => skill.isReady())
  }
}

export default PlayerAgent
