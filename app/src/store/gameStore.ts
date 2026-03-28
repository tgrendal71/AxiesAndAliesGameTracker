import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState, GameSettings, NationId, Phase, Territory, Nation,
  HistoryEvent, PurchasedUnit, NationalObjective,
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
  nations: initialNations,
  territories: initialTerritories,
  history: [],
  settings: defaultSettings,
  gameStarted: false,
};

interface GameActions {
  startGame: (settings: GameSettings) => void;
  nextPhase: () => void;
  nextNation: () => void;
  completePhase: (phase: Phase) => void;
  adjustIPC: (nationId: NationId, delta: number) => void;
  setIPC: (nationId: NationId, amount: number) => void;
  updateTerritory: (id: string, updates: Partial<Territory>) => void;
  updateNation: (id: NationId, updates: Partial<Nation>) => void;
  addPurchase: (nationId: NationId, purchase: PurchasedUnit) => void;
  clearPurchases: (nationId: NationId) => void;
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
        const idx = PHASES.indexOf(activePhase);
        if (idx < PHASES.length - 1) {
          const next = PHASES[idx + 1];
          set({ activePhase: next, phasesDone: [...phasesDone, activePhase] });
        } else {
          const nextIdx = (activeNationIndex + 1) % TURN_ORDER.length;
          set({
            activeNationIndex: nextIdx,
            activePhase: 'purchase',
            phasesDone: [],
            round: nextIdx === 0 ? round + 1 : round,
          });
        }
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
    { name: 'aa-tracker-ide1' }
  )
);

export { TURN_ORDER, PHASES };
