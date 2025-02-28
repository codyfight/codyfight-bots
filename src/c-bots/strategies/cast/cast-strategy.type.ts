export enum CastStrategyType {
  None = 'none',
  Random = 'random',
  Aggressive = 'aggressive',
  Defensive = 'defensive',
  Ryo = 'ryo'
}

// Options for dropdown
export const castStrategyOptions = Object.values(CastStrategyType).map(
  (value) => ({
    label: value,
    value: value
  })
)
