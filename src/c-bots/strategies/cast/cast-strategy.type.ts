export enum CastStrategyType {
  None = 'none',
  Random = 'random',
  Aggressive = 'aggressive',
  Defensive = 'defensive',
  Ryo = 'ryo',
  Utility = 'utility'
}

const castStrategyDescriptions: Record<CastStrategyType, string> = {
  [CastStrategyType.None]: 'No casting, no fuss—just skip casts entirely.',
  [CastStrategyType.Random]: 'An approach that casts skills at random.',
  [CastStrategyType.Aggressive]: 'Charge ahead! Prioritise damage to crush the opponent fast.',
  [CastStrategyType.Defensive]: 'Focus on protective and healing skills to keep safe.',
  [CastStrategyType.Ryo]: 'Fixated on Ryo, cast skills to corner or damage him.',
  [CastStrategyType.Utility]: 'Use skills that provide utility, destroy traps, break obstacles, etc.'
};

export const castStrategyOptions = Object.values(CastStrategyType).map((value) => ({
  label: value,
  value: value,
  description: castStrategyDescriptions[value]
}));
