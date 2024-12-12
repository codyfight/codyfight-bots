import { IPlayerAgent, ISpecialAgent } from '../../../types/game/agent.type.js'
import SpecialAgent from './SpecialAgent.js';
import Updatable from '../../interfaces/Updatable.js';
import PlayerAgent from './PlayerAgent.js';
import GameAgent from './GameAgent.js';

class GameAgentManager implements Updatable {
  private readonly bearer: PlayerAgent;
  private readonly opponent: GameAgent;
  private specialAgents: Map<number, SpecialAgent> = new Map();

  public constructor(bearer: IPlayerAgent, opponent: IPlayerAgent, specialAgents: ISpecialAgent[]) {

    this.bearer = new PlayerAgent(bearer);
    this.opponent = new GameAgent(opponent);

    for (const agent of specialAgents) {
      this.specialAgents.set(agent.id, new SpecialAgent(agent));
    }
  }

  public update(bearer: IPlayerAgent, opponent: IPlayerAgent, specialAgents: ISpecialAgent[]): void {

    this.bearer.update(bearer);
    this.opponent.update(opponent);

    this.specialAgents.clear();
    for (const agent of specialAgents) {
      this.specialAgents.set(agent.id, new SpecialAgent(agent));
    }
  }

  public getBearer(): PlayerAgent {
    return this.bearer;
  }

  public getAgents(): GameAgent[] {
    return [this.opponent, ...this.specialAgents.values()];
  }

}

export default GameAgentManager;
