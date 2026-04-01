import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState, GameSettings, NationId, Phase, Territory, Nation,
  HistoryEvent, PurchasedUnit, NationalObjective, CasualtyUnit, TechId,
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
  clearCapitalSeizures: (nationId: NationId) => void;
  toggleObjective: (nationId: NationId, objectiveId: string, achieved: boolean) => void;
  addTechnology: (nationId: NationId, techId: TechId) => void;
  removeTechnology: (nationId: NationId, techId: TechId) => void;
  setRdTokens: (nationId: NationId, count: number) => void;
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

      updateTerritory: (id, updates) => set(s => {
        const territory = s.territories.find(t => t.id === id);
        let nations = s.nations;

        // ── Capital capture / liberation logic ───────────────────────────────
        if (territory && updates.controller !== undefined && territory.isCapital && territory.capitalOf) {
          const capitalOwnerId = territory.capitalOf;
          const oldController  = territory.controller;
          const newController  = updates.controller;

          // Capture: enemy takes the capital from the original owner for the first time
          if (
            newController !== capitalOwnerId &&
            newController !== 'neutral' &&
            oldController === capitalOwnerId
          ) {
            const capturedNation = nations.find(n => n.id === capitalOwnerId);
            const stolenIPC      = capturedNation?.ipc ?? 0;
            nations = nations.map(n => {
              if (n.id === capitalOwnerId) return { ...n, ipc: 0, capitalCaptured: true };
              if (n.id === newController)  return {
                ...n,
                pendingCapitalSeizures: [...(n.pendingCapitalSeizures ?? []), { capturedFrom: capitalOwnerId, amount: stolenIPC }],
              };
              return n;
            });
          }

          // Liberation: capital returns to original owner
          if (newController === capitalOwnerId && oldController !== capitalOwnerId) {
            nations = nations.map(n =>
              n.id === capitalOwnerId ? { ...n, capitalCaptured: false } : n
            );
          }
        }

        return {
          nations,
          territories: s.territories.map(t => t.id === id ? { ...t, ...updates } : t),
        };
      }),

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

      clearCapitalSeizures: (nationId) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId ? { ...n, pendingCapitalSeizures: [] } : n
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

      addTechnology: (nationId, techId) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId && !n.technologies.includes(techId)
            ? { ...n, technologies: [...n.technologies, techId] }
            : n
        ),
      })),

      removeTechnology: (nationId, techId) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId
            ? { ...n, technologies: n.technologies.filter(t => t !== techId) }
            : n
        ),
      })),

      setRdTokens: (nationId, count) => set(s => ({
        nations: s.nations.map(n =>
          n.id === nationId ? { ...n, rdTokens: Math.max(0, count) } : n
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
    {
      name: 'aa-tracker-ide1',
      version: 7,
      migrate: (stored: unknown, fromVersion: number) => {
        const s = stored as GameState;
        let state = s;
        if (fromVersion < 3) {
          state = { ...state, nations: state.nations.map(n => ({ ...n, technologies: n.technologies ?? [] })) };
        }
        if (fromVersion < 4) {
          state = { ...state, nations: state.nations.map(n => ({ ...n, rdTokens: (n as Nation & { rdTokens?: number }).rdTokens ?? 0 })) };
        }
        if (fromVersion < 5) {
          state = { ...state, nations: state.nations.map(n => ({ ...n, capitalCaptured: (n as Nation & { capitalCaptured?: boolean }).capitalCaptured ?? false })) };
        }
        if (fromVersion < 6) {
          // Detect capitals already held by an enemy and fix capitalCaptured + transfer IPC
          let nations = state.nations.map(n => ({ ...n, capitalCaptured: false }));
          for (const t of state.territories) {
            if (!t.isCapital || !t.capitalOf) continue;
            if (t.controller !== t.capitalOf && t.controller !== 'neutral') {
              // Capital is already enemy-held — mark owner as captured and transfer IPC
              const ownerIPC = nations.find(n => n.id === t.capitalOf)?.ipc ?? 0;
              nations = nations.map(n => {
                if (n.id === t.capitalOf)   return { ...n, ipc: 0, capitalCaptured: true };
                if (n.id === t.controller)  return { ...n, ipc: n.ipc + ownerIPC };
                return n;
              });
            }
          }
          state = { ...state, nations };
        }
        if (fromVersion < 7) {
          // Add pendingCapitalSeizures field; reverse the immediate IPC transfer from v6
          // so the amount is shown and applied at Collect Income instead
          type N7 = typeof state.nations[number] & { pendingCapitalSeizures?: Array<{ capturedFrom: NationId; amount: number }> };
          let nations: N7[] = state.nations.map(n => ({ ...n, pendingCapitalSeizures: [] as Array<{ capturedFrom: NationId; amount: number }> }));
          for (const t of state.territories) {
            if (!t.isCapital || !t.capitalOf) continue;
            if (t.controller !== t.capitalOf && t.controller !== 'neutral') {
              // Use startingIPC as proxy for the seized amount (was taken by v6 migration)
              const seizedAmount = nations.find(n => n.id === t.capitalOf)?.startingIPC ?? 0;
              nations = nations.map(n => {
                if (n.id === t.controller) return {
                  ...n,
                  ipc: Math.max(0, n.ipc - seizedAmount),
                  pendingCapitalSeizures: [...(n.pendingCapitalSeizures ?? []), { capturedFrom: t.capitalOf as NationId, amount: seizedAmount }],
                };
                return n;
              });
            }
          }
          state = { ...state, nations: nations as typeof state.nations };
        }
        return state;
      },
    }
  )
);

export { TURN_ORDER, PHASES };
