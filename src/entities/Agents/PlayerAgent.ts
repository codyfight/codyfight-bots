import Agent from './Agent.js'
import { gameAPI } from '../../services/index.js'
import Skill from '../Skill.js'
import Position from '../Position.js'

class PlayerAgent extends Agent {
  public async takeTurn(ckey: string): Promise<void> {
    if (!this.isPlayerTurn) return

    //await this.castSkill(ckey)
    await this.makeMove(ckey)
  }

  private async castSkill(ckey: string): Promise<void> {
    if (!this.canCastSkill()) return

    const skill = this.getRandomCastableSkill()
    const target = skill.getTarget()
    await gameAPI().cast(ckey, skill.id, target.x, target.y)
  }

  private async makeMove(ckey: string): Promise<void> {
    const position = this.getRandomPosition()
    await gameAPI().move(ckey, position.x, position.y)
  }

  private getRandomCastableSkill(): Skill {
    const castableSkills = this.skills.filter((skill) => skill.hasTargets())
    const index = Math.floor(Math.random() * castableSkills.length)
    return castableSkills[index]
  }

  private getRandomPosition(): Position {
    const index = Math.floor(Math.random() * this.possibleMoves.length)
    return this.possibleMoves[index]
  }

  private canCastSkill(): boolean {
    return this.skills.some((skill) => skill.hasTargets())
  }
}

export default PlayerAgent
