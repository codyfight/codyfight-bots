export enum CastStrategyType {
  None = 'none',
  Random = 'random',
  Aggressive = 'aggressive',
  Defensive = 'defensive',
  Ryo = 'ryo'
}

// 1) Create a dictionary that maps each CastStrategyType to its description
const castStrategyDescriptions: Record<CastStrategyType, string> = {
  [CastStrategyType.None]: 'No casting, no fuss—just skip spells entirely.',
  [CastStrategyType.Random]: 'A random approach that casts whatever skill is at hand.',
  [CastStrategyType.Aggressive]: 'Charge ahead! Prioritise damage to crush the opponent fast.',
  [CastStrategyType.Defensive]: 'Keep calm and carry on—focus on shielding and keeping safe.',
  [CastStrategyType.Ryo]: 'Fixated on Ryo—follow and cast skills to corner or hinder him.'
};

// 2) Use that dictionary to populate your dropdown options
export const castStrategyOptions = Object.values(CastStrategyType).map((value) => ({
  label: value,
  value: value,
  description: castStrategyDescriptions[value]
}));
