import IUpdatable from '../interfaces/updatable.interface.js'
import PlayerAgent from './player-agent.js'
import GameAgent from './game-agent.js'
import SpecialAgent from './special-agent.js'
import { IPlayerAgent, ISpecialAgent, SpecialAgentType } from './game-agent.type.js'

class GameAgentManager implements IUpdatable {
  private readonly bearer: PlayerAgent
  private readonly opponent: GameAgent
  private specialAgents: Map<SpecialAgentType, SpecialAgent[]> = new Map()

  public constructor(
    bearer: IPlayerAgent,
    opponent: IPlayerAgent,
    specialAgents: ISpecialAgent[]
  ) {
    this.bearer = new PlayerAgent(bearer)
    this.opponent = new GameAgent(opponent)

    this.initializeSpecialAgentsMap()
    this.setSpecialAgents(specialAgents)
  }

  private initializeSpecialAgentsMap(): void {
    const numericKeys = Object.values(SpecialAgentType).filter(
      (value) => typeof value === 'number'
    ) as SpecialAgentType[]

    for (const type of numericKeys) {
      this.specialAgents.set(type, [])
    }
  }

  private clearSpecialAgentsMap(): void {
    for (const agents of this.specialAgents.values()) {
      agents.length = 0
    }
  }

  private setSpecialAgents(specialAgents: ISpecialAgent[]) {
    for (const agent of specialAgents) {
      this.specialAgents.get(agent.type)!.push(new SpecialAgent(agent))
    }
  }

  public update(bearer: IPlayerAgent, opponent: IPlayerAgent, specialAgents: ISpecialAgent[]): void
  {
    this.bearer.update(bearer)
    this.opponent.update(opponent)

    this.clearSpecialAgentsMap()
    this.setSpecialAgents(specialAgents)
  }

  public getBearer(): PlayerAgent {
    return this.bearer
  }

  public getOpponent(): GameAgent {
    return this.opponent
  }

  public getSpecialAgents(): Map<number, SpecialAgent[]> {
    return this.specialAgents
  }

  public getAgents(): GameAgent[] {
    const allSpecialAgents = [...this.specialAgents.values()].flat()
    return [this.opponent, ...allSpecialAgents]
  }

}

export default GameAgentManager
