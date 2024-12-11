import type { IAgentStats } from './special-agent.type.js'

interface IPlayerStats extends IAgentStats {
  durability: number
  durability_cap: number
  is_demolished: boolean
}

interface ICodyfighter {
  name: string
  type: CodyfighterType
  class: CodyfighterClass
  rarity: CodyfighterRarity
}

interface IScore {
  points: number
  ryo_count: number
  exit_count: number
  kill_count: number
  death_count: number
}


enum CodyfighterType {
  Sapper = 0,
  Engineer = 1,
  Guardian = 2,
  Scout = 3,
  Trickster = 4,
  Hunter = 5,
  Brute = 6
}

enum CodyfighterClass {
  Sapper = 'SAPPER',
  Engineer = 'ENGINEER',
  Guardian = 'GUARDIAN',
  Scout = 'SCOUT',
  Trickster = 'TRICKSTER',
  Hunter = 'HUNTER',
  Brute = 'BRUTE'
}

enum CodyfighterRarity {
  Common = 'COMMON',
  Rare = 'RARE',
  Epic = 'EPIC',
  Legendary = 'LEGENDARY',
  Mythic = 'MYTHIC'
}

enum MoveDirection {
  Stay = 'stay',
  Right = 'right',
  Left = 'left',
  Up = 'up',
  Down = 'down'
}
