import Position from '../Position.js'

export interface ITile {
  id: number
  name: string
  type: TileType
  position: Position
  config: {
    is_charged: boolean
  }
}

export enum TileType {
  Blank = 0,
  Obstacle = 1,
  ExitGate = 2,
  Wall = 3,
  EnergyRegenerator = 4,
  ArmorRegenerator = 5,
  HitpointsRegenerator = 6,
  DirectionalSliderUp = 7,
  DirectionalSliderDown = 8,
  DirectionalSliderLeft = 9,
  DirectionalSliderRight = 10,
  BidirectionalTeleport = 11,
  DeathPit = 12,
  ZapTrap = 13,
  ProximityMine = 14,
  BoobyTrap = 15,
  Craze = 16,
  LesserObstacle = 17,
  IceTrap = 18,
  SentryTurret = 19,
  WallMarkOne = 20,
  BombTile = 21
}

export const DANGEROUS_TILES = new Set<TileType>([
  TileType.DeathPit,
  TileType.ZapTrap,
  TileType.ProximityMine,
  TileType.BoobyTrap,
  TileType.Craze,
  TileType.BombTile
])

const POWER_TILES = new Set<TileType>([
  TileType.EnergyRegenerator,
  TileType.ArmorRegenerator,
  TileType.HitpointsRegenerator,
  TileType.DirectionalSliderUp,
  TileType.DirectionalSliderDown,
  TileType.DirectionalSliderLeft,
  TileType.DirectionalSliderRight,
  TileType.BidirectionalTeleport
])

const OBSTACLE_TILES = new Set<TileType>([
  TileType.Obstacle,
  TileType.Wall,
  TileType.LesserObstacle,
  TileType.IceTrap,
  TileType.SentryTurret,
  TileType.WallMarkOne
])

export const SAFE_TILES = new Set<TileType>([
  TileType.Blank,
  TileType.ExitGate,
  ...POWER_TILES
])

export const WALKABLE_TILES = new Set<TileType>([
  ...SAFE_TILES,
  ...POWER_TILES,
  ...DANGEROUS_TILES
])
