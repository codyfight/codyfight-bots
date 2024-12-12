import Position from '../core/Position.js'
import Updatable from '../../interfaces/Updatable.js'
import { IAgent } from '../../../types/game/agent.type.js'


class GameAgent implements Updatable {
  readonly id: number
  readonly name: string
  private position: Position = new Position(0, 0)

  constructor(agentData: IAgent) {
    this.id = agentData.id
    this.name = agentData.name
    this.update(agentData)
  }

  public update(agentData: IAgent): void {
    this.setPosition(agentData)
  }

  public getPosition(): Position{
    return this.position
  }

  private setPosition(agentData: IAgent): void{
    if(agentData.position){
      this.position = new Position(agentData.position.x, agentData.position.y)
    }
  }
}

export default GameAgent
