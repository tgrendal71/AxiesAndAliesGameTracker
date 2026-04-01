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
  /** If set, ipcBonus is multiplied by the count of these territory IDs that the
   *  owning nation currently controls. The `achieved` toggle still acts as an
   *  on/off switch for the whole objective. */
  perTerritoryIds?: string[];
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
  chipImage?: string;   // path to chip PNG in /nations/ (e.g. '/nations/chip_Germany.png')
  ipc: number;
  startingIPC: number;
  isActive: boolean;
  isEliminated: boolean;
  atWarWith: NationId[];  // nations this power is currently at war with
  ipcAdjustment: number;  // manual temporary IPC correction
  objectives: NationalObjective[];
  technologies: TechId[];          // permanently unlocked R&D techs
  rdTokens: number;                // accumulated R&D dice carrying over until breakthrough
  capitalCaptured: boolean;        // true if this nation's capital is held by an enemy
  pendingCapitalSeizures: Array<{ capturedFrom: NationId; amount: number }>; // IPC seized from enemy capitals this turn, applied at Collect Income
  purchasedThisTurn: PurchasedUnit[];
  casualtiesThisTurn: CasualtyUnit[];  // units lost this round
  convoyLoss: number;
}

export interface PurchasedUnit {
  unitType: string;
  quantity: number;
  costEach: number;
}

export interface CasualtyUnit {
  unitType: string;
  quantity: number;
  costEach: number;
}

// ─── Research & Development ───────────────────────────────────────────────────
// Breakthrough Chart 1 (official A&A Global 1940 2nd Ed)
export type TechChart1Id =
  | 'advanced_artillery' | 'rockets' | 'paratroopers'
  | 'increased_factory_production' | 'war_bonds' | 'improved_mechanized_infantry';
// Breakthrough Chart 2
export type TechChart2Id =
  | 'super_submarines' | 'jet_fighters' | 'improved_shipyards'
  | 'radar' | 'long_range_aircraft' | 'heavy_bombers';

export type TechId = TechChart1Id | TechChart2Id;

// ─── Territory ────────────────────────────────────────────────────────────────
export type NeutralType = 'strict' | 'pro_allies' | 'pro_axis' | 'mongolia' | 'general';

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
  neutralType?: NeutralType;
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
  previousSnapshot: { nationIndex: number; phase: Phase; round: number } | null;
  nations: Nation[];
  territories: Territory[];
  history: HistoryEvent[];
  settings: GameSettings;
  gameStarted: boolean;
}
