// ─── Nation IDs ──────────────────────────────────────────────────────────────
export type NationId =
  | 'germany' | 'italy' | 'japan'
  | 'ussr' | 'uk_europe' | 'uk_pacific'
  | 'usa' | 'china' | 'anzac' | 'france';

export type Side = 'Axis' | 'Allied';

// ─── Phases ───────────────────────────────────────────────────────────────────
export type Phase =
  | 'purchase'
  | 'combat_move'
  | 'rockets'
  | 'conduct_combat'
  | 'noncombat_move'
  | 'mobilize'
  | 'collect_income'
  | 'convoy';

export interface PhaseInfo {
  id: Phase;
  label: string;
  emoji: string;
  warOnly: boolean;
  optional: boolean;
}

// ─── Buildings ────────────────────────────────────────────────────────────────
export type BuildingType = 'major_factory' | 'minor_factory' | 'air_base' | 'naval_base';

export interface Building {
  type: BuildingType;
  damage: number;
}

// ─── National Objectives ──────────────────────────────────────────────────────
export interface NationalObjective {
  id: string;
  description: string;
  ipcBonus: number;
  achieved: boolean;
}

// ─── Nation ───────────────────────────────────────────────────────────────────
export interface Nation {
  id: NationId;
  name: string;
  shortName: string;
  side: Side;
  color: string;        // CSS hex
  colorDim: string;     // dimmer version
  textColor: string;    // legible text on bg
  emoji: string;
  ipc: number;
  startingIPC: number;
  isActive: boolean;
  isEliminated: boolean;
  objectives: NationalObjective[];
  purchasedThisTurn: PurchasedUnit[];
  convoyLoss: number;
}

export interface PurchasedUnit {
  unitType: string;
  quantity: number;
  costEach: number;
}

// ─── Territory ────────────────────────────────────────────────────────────────
export interface Territory {
  id: string;
  name: string;
  type: 'land' | 'sea';
  controller: NationId | 'neutral';
  originalOwner: NationId | 'neutral';
  ipc: number;
  isCapital: boolean;
  capitalOf?: NationId;
  isVictoryCity: boolean;
  map: 'Europe' | 'Pacific' | 'Both';
  buildings: Building[];
}

// ─── Combat ───────────────────────────────────────────────────────────────────
export interface CombatUnit {
  unitType: string;
  quantity: number;
  attackValue: number;
  defenseValue: number;
}

export interface CombatLog {
  id: string;
  territory: string;
  attacker: NationId;
  defender: NationId;
  attackerUnits: CombatUnit[];
  defenderUnits: CombatUnit[];
  rounds: CombatRound[];
  outcome: 'ongoing' | 'attacker_wins' | 'defender_wins' | 'retreated';
}

export interface CombatRound {
  roundNumber: number;
  attackerHits: number;
  defenderHits: number;
  attackerLosses: string;
  defenderLosses: string;
}

// ─── History ──────────────────────────────────────────────────────────────────
export interface HistoryEvent {
  id: string;
  round: number;
  nationId: NationId;
  phase: Phase;
  description: string;
  ipcChange?: number;
  timestamp: number;
}

// ─── Game Settings ────────────────────────────────────────────────────────────
export interface GameSettings {
  useRnD: boolean;
  useNationalObjectives: boolean;
  maxRounds: number | null;
  playerNames: Partial<Record<NationId, string>>;
}

// ─── Game State ───────────────────────────────────────────────────────────────
export interface GameState {
  gameId: string;
  startedAt: number;
  round: number;
  activeNationIndex: number;
  activePhase: Phase;
  phasesDone: Phase[];
  nations: Nation[];
  territories: Territory[];
  history: HistoryEvent[];
  settings: GameSettings;
  gameStarted: boolean;
}
