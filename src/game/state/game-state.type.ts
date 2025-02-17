import { ITile } from '../map/tile/tile.type.js'
import { IPlayerAgent, ISpecialAgent } from '../agents/game-agent.type.js'

export interface IGameState {
  map: ITile[][]
  state: IState
  verdict: IVerdict
  players: {
    bearer: IPlayerAgent
    opponent: IPlayerAgent
  }
  special_agents: ISpecialAgent[] | []
}

export interface IGameStatus {
  status: GameStatus;
  mode: GameMode;
}

export enum GameStatus {
  Terminated = -2,
  Empty = -1,
  Registering = 0,
  Playing = 1,
  Ended = 2
}

export enum BotStatus{
  Initialising = "Initialising",
  Playing = "Playing",
  Finishing = "Finishing",
  Surrendering = "Surrendering",
  Finished = "Finished"
}

export enum GameMode {
  Sandbox = 0,
  FriendlyDuel = 1, // dev only
  Casual = 2,
  Ranked = 3,
  FactionWars = 4, // dev only
  Blitz = 5, // dev only
  Tournament = 6, // dev only
  Bbl = 7, // dev only
  Onboarding = 8, // dev only
  Testing = 127 // dev only
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
export function getFilteredGameModes(isDev: boolean) {
  return Object.entries(GameMode)
    .filter(([key, value]) => typeof value === 'number')
    .filter(([key, value]) => {
      // If user is not dev, exclude dev-only game modes
      if (!isDev) {
        // Dev-only modes
        const devOnlyModes = [
          GameMode.FriendlyDuel,
          GameMode.FactionWars,
          GameMode.Blitz,
          GameMode.Tournament,
          GameMode.Bbl,
          GameMode.Onboarding,
          GameMode.Testing
        ];
        return !devOnlyModes.includes(value as GameMode);
      }
      return true;
    })
    .map(([key, value]) => ({ label: key, value: value }));
}
