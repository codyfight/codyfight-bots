import { ITile } from '../map/tile/tile.type.js'
import { IPlayerAgent, ISpecialAgent } from '../agents/game-agent.type.js'


export interface IGameState {
  map: ITile [][]
  state: IState
  verdict: IVerdict
  players: {
    bearer: IPlayerAgent
    opponent: IPlayerAgent
  }
  special_agents: ISpecialAgent[] | []
}

export enum GameStatus {
  Terminated = -2,
  Empty = -1,
  Registering = 0,
  Playing = 1,
  Ended = 2
}

export enum GameMode {
  Sandbox = 0,
  FriendlyDuel = 1,
  Casual = 2,
  LlamasMaze = 3,
  FactionWars = 4,
  Blitz = 5,
  Tournament = 6,
  Bbl = 7,
  Onboarding = 8,
  Testing = 127
}

export interface IState {
  id: number | null
  status: GameStatus
  mode: GameMode
  stake: any[]
  rewards: any
  round: number | null
}

export interface IVerdict {
  context: GameContext
  statement: VerdictStatement | null
  winner: string | null
}

enum GameContext {
  GameNotInitialized = 'game-not-initialized',
  PlayersRegistering = 'players-registering',
  GameInProgress = 'game-in-progress',
  GameEnded = 'game-ended'
}

enum VerdictStatement {
  Undefined = 'undefined',
  Draw = 'draw',
  BasedOnPoints = 'based-on-points',
  BasedOnRyoCount = 'based-on-ryo-count',
  TurnTimeout = 'turn-timeout',
  MatchmakingTimeout = 'matchmaking-timeout',
  PlayerSurrendered = 'player-surrendered',
  PlayerDemolished = 'player-demolished',
  GameTimeout = 'game-timeout',
  GameCancelled = 'game-cancelled'
}

// Options for dropdown
export const gameModeOptions = Object.entries(GameMode)
  .filter(([key, value]) => typeof value === 'number')
  .map(([key, value]) => ({ label: key, value: value }));
