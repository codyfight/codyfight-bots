export enum SkillStatus {
  Empty = -4,
  Disabled = -3,
  NoTargets = -2,
  InsufficientEnergy = -1,
  OnCooldown = 0,
  Ready = 1
}

export enum SkillCategory {
  Unknown = 'Unknown',
  Healing = 'Healing',
  MovementEnemy = 'MovementEnemy',
  MovementPlayer = 'MovementPlayer',
  Utility = 'Utility'
}

export interface SkillMetadata {
  id: number;
  name: string;
  category: SkillCategory;
  healing?: number;
  armor?: number;
}

export const SkillRegistry: Record<number, SkillMetadata> = {
  // Self-healing Skills
  58: {
    id: 58,
    name: 'Patch Up',
    category: SkillCategory.Healing,
    healing: 90,
    armor: 90
  },
  20: {
    id: 20,
    name: 'Combat Repairs',
    category: SkillCategory.Healing,
    healing: 80
  },
  43: {
    id: 43,
    name: 'Defensive Measures',
    category: SkillCategory.Healing,
    healing: 125,
    armor: 50
  },
  18: {
    id: 18,
    name: 'Protective Measures',
    category: SkillCategory.Healing,
    armor: 200
  },
  51: {
    id: 51,
    name: 'Makeshift Defenses',
    category: SkillCategory.Healing,
    armor: 150
  },

  // Enemy-moving Skills
  61: {
    id: 61,
    name: 'Flick',
    category: SkillCategory.MovementEnemy
  },
  4: {
    id: 4,
    name: 'Knock Back',
    category: SkillCategory.MovementEnemy
  },
  6: {
    id: 6,
    name: 'Toss',
    category: SkillCategory.MovementEnemy
  },
  2: {
    id: 2,
    name: 'Push',
    category: SkillCategory.MovementEnemy
  },
  53: {
    id: 53,
    name: 'Shove',
    category: SkillCategory.MovementEnemy
  },

  // Player-moving Skills
  5: {
    id: 5,
    name: 'Swap',
    category: SkillCategory.MovementPlayer
  },
  7: {
    id: 7,
    name: 'Blink',
    category: SkillCategory.MovementPlayer
  },
  8: {
    id: 8,
    name: 'Run Run Run',
    category: SkillCategory.MovementPlayer
  },
  17: {
    id: 17,
    name: 'Rush',
    category: SkillCategory.MovementPlayer
  },
  19: {
    id: 19,
    name: 'Dash',
    category: SkillCategory.MovementPlayer
  },
  28: {
    id: 28,
    name: 'Double Time',
    category: SkillCategory.MovementPlayer
  },
  48: {
    id: 48,
    name: 'Pathmaking',
    category: SkillCategory.MovementPlayer
  },
  64: {
    id: 64,
    name: 'Zap-Stride',
    category: SkillCategory.MovementPlayer
  },
  78: {
    id: 78,
    name: 'Jump',
    category: SkillCategory.MovementPlayer
  },

  // Utility Skills
  74: {
    id: 74,
    name: 'LayBomb',
    category: SkillCategory.Utility
  },
  80: {
    id: 80,
    name: 'TileToggler',
    category: SkillCategory.Utility
  },
  0: {
    id: 0,
    name: 'Demolish',
    category: SkillCategory.Utility
  },
  35: {
    id: 35,
    name: 'Demolish',
    category: SkillCategory.Utility
  },
  40: {
    id: 40,
    name: 'Workn\'t',
    category: SkillCategory.Utility
  },
  46: {
    id: 46,
    name: 'Anti-Armor Charge',
    category: SkillCategory.Utility
  },
  68: {
    id: 68,
    name: 'B.F.B',
    category: SkillCategory.Utility
  },
  10: {
    id: 10,
    name: 'Bombs Away',
    category: SkillCategory.Utility
  },
  11: {
    id: 11,
    name: 'Plant Mine',
    category: SkillCategory.Utility
  },
  55: {
    id: 55,
    name: 'Unmake',
    category: SkillCategory.Utility
  },
  1: {
    id: 1,
    name: 'Build',
    category: SkillCategory.Utility
  },
  36: {
    id: 36,
    name: 'Build',
    category: SkillCategory.Utility
  },
  41: {
    id: 41,
    name: 'Booby Trap',
    category: SkillCategory.Utility
  },
  69: {
    id: 69,
    name: 'W.A.L.L',
    category: SkillCategory.Utility
  },
  14: {
    id: 14,
    name: 'Build Craze',
    category: SkillCategory.Utility
  },
  56: {
    id: 56,
    name: 'Construction',
    category: SkillCategory.Utility
  }
}
