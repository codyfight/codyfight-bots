export interface IState {
  id: number
  status: GameState
  mode: number
  stake: any[]
  rewards: any
  round: number
  total_turns: number
  total_rounds: number
  max_turn_time: number
  turn_time_left: number
}

enum GameState {
  Empty = -1,
  Registering = 0,
  Playing = 1,
  Ended = 2
}
