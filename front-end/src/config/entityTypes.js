// front-end/src/config/entityTypes.js

export const ENTITY_TYPE_CONFIG = {
  npcs: {
    label: 'NPC',
    defaults: {
      role: 'unknown',
      status: 'unknown',
      faction: '',
      adversary_type: 'standard',
      tier: 1,
      difficulty: 12,
      hp: 3,
      stress: 3,
      attack_modifier: 0,
      thresholds_major: 8,
      thresholds_severe: 14,
      damage_dice: '1d8+1',
      damage_type: 'phy',
      motives_and_tactics: '',
      experiences: [],
    },
  },
  sessions: {
    label: 'Session',
    defaults: {
      session_number: 1,
      date: new Date().toISOString().slice(0, 10),
      players_present: [],
    },
  },
  locations: {
    label: 'Location',
    defaults: {
      region: '',
      status: 'active',
    },
  },
  factions: {
    label: 'Faction',
    defaults: {
      alignment: '',
      status: 'active',
    },
  },
  'plot-threads': {
    label: 'Plot Thread',
    defaults: {
      status: 'open',
      priority: 'medium',
    },
  },
  prep: {
    label: 'Prep',
    defaults: {
      session_target: '',
      prep_type: 'general',
    },
  },
};

export const ENTITY_TYPES = Object.keys(ENTITY_TYPE_CONFIG);