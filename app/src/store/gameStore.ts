import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState, GameSettings, NationId, Phase, Territory, Nation,
  HistoryEvent, PurchasedUnit, NationalObjective, CasualtyUnit,
} from './types';
import { initialNations, TURN_ORDER } from '../data/nations';
import { initialTerritories } from '../data/territories';

const PHASES: Phase[] = [
  'purchase',
  'combat_move',
  'rockets',
  'conduct_combat',
  'noncombat_move',
  'mobilize',
  'collect_income',
  'convoy',
];

const defaultSettings: GameSettings = {
  useRnD: true,
  useNationalObjectives: true,
  maxRounds: null,
  playerNames: {},
};

const blankState: GameState = {
  gameId: '',
  startedAt: 0,
  round: 1,
  activeNationIndex: 0,
  activePhase: 'purchase',
  phasesDone: [],
  previousSnapshot: null,
  nations: initialNations,
  territories: initialTerritories,
  history: [],
  settings: defaultSettings,
  gameStarted: false,
};

interface GameActions {
  startGame: (settings: GameSettings) => void;
  nextPhase: () => void;
  goBackPhase: () => void;
  nextNation: () => void;
  completePhase: (phase: Phase) => void;
  adjustIPC: (nationId: NationId, delta: number) => void;
  setIPC: (nationId: NationId, amount: number) => void;
  adjustIPCManual: (nationId: NationId, delta: number) => void;
  updateTerritory: (id: string, updates: Partial<Territory>) => void;
  updateNation: (id: NationId, updates: Partial<Nation>) => void;
  declareWar: (attackerId: NationId, targetId: NationId) => void;
  addPurchase: (nationId: NationId, purchase: PurchasedUnit) => void;
  clearPurchases: (nationId: NationId) => void;
  recordCasualty: (nationId: NationId, unit: CasualtyUnit) => void;
  clearCasualties: (nationId: NationId) => void;
  toggleObjective: (nationId: NationId, objectiveId: string, achieved: boolean) => void;
  addHistory: (event: Omit<HistoryEvent, 'id' | 'timestamp'>) => void;
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...blankState,

      startGame: (settings) => set({
        ...blankState,
        gameId: Date.now().toString(),
        startedAt: Date.now(),
        settings,
        nations: initialNations.map(n => ({ ...n })),
        territories: initialTerritories.map(t => ({ ...t })),
        gameStarted: true,
      }),

      nextPhase: () => {
        const { activePhase, activeNationIndex, round, phasesDone } = get();
        const snapshot = { nationIndex: activeNationIndex, phase: activePhase, round };
        const idx = PHASES.indexOf(activePhase);
        if (idx < PHASES.length - 1) {
          const next = PHASES[idx + 1];
          set({ previousSnapshot: snapshot, activePhase: next, phasesDone: [...phasesDone, activePhase] });
        } else {
          const nextIdx = (activeNationIndex + 1) % TURN_ORDER.length;
          set({
            previousSnapshot: snapshot,
            activeNationIndex: nextIdx,
            activePhase: 'purchase',
            phasesDone: [],
            round: nextIdx === 0 ? round + 1 : round,
          });
        }
      },

      goBackPhase: () => {
        const { previousSnapshot } = get();
        if (!previousSnapshot) return;
        set({
          activeNationIndex: previousSnapshot.nationIndex,
          activePhase: previousSnapshot.phase,
          round: previousSnapshot.round,
          phasesDone: [],
          previousSnapshot: null,
        });
      },

      nextNation: () => {
        const { activeNationIndex, round } = get();
        const nextIdx = (activeNationIndex + 1) % TURN_ORDER.length;
        set({
          activeNationIndex: nextIdx,
          activePhase: 'purchase',
          phasesDone: [],
          round: nextIdx === 0 ? round + 1 : round,
        });
      },

      completePhase: (phase) => set(s => ({
        phasesDone: s.phasesDone.includes(phase) ? s.phasesDone : [...s.phasesDone, phase],
      })),

      adjustIPC: (nationId, delta) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId ? { ...n, ipc: Math.max(0, n.ipc + delta) } : n
        ),
      })),

      setIPC: (nationId, amount) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId ? { ...n, ipc: Math.max(0, amount) } : n
        ),
      })),

      // Temporary manual IPC correction (stored separately for visibility)
      adjustIPCManual: (nationId, delta) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId ? { ...n, ipcAdjustment: (n.ipcAdjustment ?? 0) + delta } : n
        ),
      })),

      declareWar: (attackerId, targetId) => set(s => ({
        nations: s.nations.map(n => {
          if (n.id === attackerId && !n.atWarWith.includes(targetId)) {
            return { ...n, atWarWith: [...n.atWarWith, targetId], isActive: true };
          }
          if (n.id === targetId && !n.atWarWith.includes(attackerId)) {
            return { ...n, atWarWith: [...n.atWarWith, attackerId] };
          }
          return n;
        }),
      })),

      updateTerritory: (id, updates) => set(s => ({
        territories: s.territories.map(t =>
          t.id === id ? { ...t, ...updates } : t
        ),
      })),

      updateNation: (id, updates) => set(s => ({
        nations: s.nations.map(n => n.id === id ? { ...n, ...updates } : n),
      })),

      addPurchase: (nationId, purchase) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId
            ? { ...n, purchasedThisTurn: [...n.purchasedThisTurn, purchase] }
            : n
        ),
      })),

      clearPurchases: (nationId) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId ? { ...n, purchasedThisTurn: [] } : n
        ),
      })),

      recordCasualty: (nationId, unit) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId
            ? { ...n, casualtiesThisTurn: [...n.casualtiesThisTurn, unit] }
            : n
        ),
      })),

      clearCasualties: (nationId) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId ? { ...n, casualtiesThisTurn: [] } : n
        ),
      })),

      toggleObjective: (nationId, objectiveId, achieved) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId
            ? {
                ...n,
                objectives: n.objectives.map((o: NationalObjective) =>
                  o.id === objectiveId ? { ...o, achieved } : o
                ),
              }
            : n
        ),
      })),

      addHistory: (event) => set(s => ({
        history: [
          ...s.history,
          { ...event, id: Date.now().toString(), timestamp: Date.now() },
        ],
      })),

      resetGame: () => set(blankState),
    }),
    { name: 'aa-tracker-ide1', version: 2 }
  )
);

export { TURN_ORDER, PHASES };
