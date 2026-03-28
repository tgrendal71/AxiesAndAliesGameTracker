import { useState } from 'react';
import { useGameStore, TURN_ORDER, PHASES } from '../store/gameStore';
import { PHASES_INFO } from '../data/nations';
import type { Phase, Nation } from '../store/types';

// ─── Unit catalogue ───────────────────────────────────────────────────────────
type UnitDef = { name: string; cost: number; icon: string };

const CATEGORIES: { id: string; label: string; emoji: string; units: UnitDef[] }[] = [
  {
    id: 'land', label: 'Land enheter', emoji: '🪖',
    units: [
      { name: 'Infanteri',        cost: 3,  icon: '🪖' },
      { name: 'Mek. Infanteri',   cost: 4,  icon: '🚗' },
      { name: 'Artilleri',        cost: 4,  icon: '🔫' },
      { name: 'Stridsvogn',       cost: 6,  icon: '⚙️' },
      { name: 'AA-kanon',         cost: 5,  icon: '🎯' },
    ],
  },
  {
    id: 'air', label: 'Luft enheter', emoji: '✈️',
    units: [
      { name: 'Jagerflyger',       cost: 10, icon: '✈️' },
      { name: 'Taktisk Bomber',    cost: 11, icon: '💣' },
      { name: 'Strategisk Bomber', cost: 12, icon: '🛩️' },
    ],
  },
  {
    id: 'sea', label: 'Sjø enheter', emoji: '⚓',
    units: [
      { name: 'Ubåt',       cost: 6,  icon: '🌊' },
      { name: 'Transport',  cost: 7,  icon: '📦' },
      { name: 'Destroyer',  cost: 8,  icon: '⚓' },
      { name: 'Krysser',    cost: 12, icon: '🚢' },
      { name: 'Hangarskip', cost: 16, icon: '🛸' },
      { name: 'Slagskip',   cost: 20, icon: '🔱' },
    ],
  },
  {
    id: 'bygg', label: 'Bygg enheter', emoji: '🏭',
    units: [
      { name: 'Liten Fabrikk',     cost: 12, icon: '🏭'  },
      { name: 'Fabrikk oppgrader', cost: 20, icon: '🏭★' },
      { name: 'Luftbase',          cost: 15, icon: '🛬'  },
      { name: 'Marinbase',         cost: 15, icon: '⚓'  },
    ],
  },
];

const RD_COST = 5; // IPC per R&D die

// ─── Purchase panel ───────────────────────────────────────────────────────────
function PurchasePanel({ nation }: { nation: Nation }) {
  const { addPurchase, clearPurchases, adjustIPC, territories, settings } = useGameStore();

  // R&D state
  const [rdDice,      setRdDice]      = useState(0);
  const [rdConfirmed, setRdConfirmed] = useState(false);
  const [rdRolled,    setRdRolled]    = useState(false);

  // Unit quantities per category
  const [qty, setQty] = useState<Record<string, number>>({});

  // Active tab
  const [tab, setTab] = useState<string>('land');

  // Repair points per territory-building key
  const [repairs, setRepairs] = useState<Record<string, number>>({});

  // Budget after R&D confirmation
  const rdCost        = rdConfirmed ? rdDice * RD_COST : 0;
  const availableIPC  = nation.ipc - rdCost;

  const unitSpend   = Object.entries(qty).reduce((s, [name, q]) => {
    const u = CATEGORIES.flatMap(c => c.units).find(u => u.name === name);
    return s + q * (u?.cost ?? 0);
  }, 0);

  const repairSpend = Object.values(repairs).reduce((s, v) => s + v, 0);
  const totalSpend  = unitSpend + repairSpend;
  const remaining   = availableIPC - totalSpend;

  const change = (name: string, delta: number, cost: number) => {
    setQty(prev => {
      const cur = prev[name] ?? 0;
      const next = Math.max(0, cur + delta);
      if (delta > 0 && remaining < cost) return prev;
      return { ...prev, [name]: next };
    });
  };

  const changeRepair = (key: string, delta: number, max: number) => {
    setRepairs(prev => {
      const cur = prev[key] ?? 0;
      const next = Math.max(0, Math.min(max, cur + delta));
      if (delta > 0 && remaining < 1) return prev;
      return { ...prev, [key]: next };
    });
  };

  const confirmRd = () => {
    if (rdDice === 0 || rdConfirmed) return;
    setRdConfirmed(true);
  };

  const confirmPurchase = () => {
    clearPurchases(nation.id);
    CATEGORIES.flatMap(c => c.units).forEach(u => {
      const q = qty[u.name] ?? 0;
      if (q > 0) addPurchase(nation.id, { unitType: u.name, quantity: q, costEach: u.cost });
    });
    // Add R&D dice as a purchase entry if confirmed
    if (rdConfirmed && rdDice > 0) {
      addPurchase(nation.id, { unitType: 'R&D terning', quantity: rdDice, costEach: RD_COST });
    }
    // Deduct total including R&D
    adjustIPC(nation.id, -(totalSpend + rdCost));
    // Reset local state
    setQty({});
    setRepairs({});
    setRdDice(0);
    setRdConfirmed(false);
    setRdRolled(false);
  };

  // Damaged buildings in territories this nation controls
  const damagedBuildings = territories
    .filter(t => t.controller === nation.id && t.type === 'land')
    .flatMap(t => t.buildings.map(b => ({ ...b, territory: t.name, tId: t.id })))
    .filter(b => b.damage > 0);

  const selectedUnits = CATEGORIES.flatMap(c => c.units).filter(u => (qty[u.name] ?? 0) > 0);

  return (
    <div className="card space-y-4">

      {/* Budget bar */}
      <div className="flex items-center justify-between">
        <div className="font-display text-sm uppercase tracking-widest text-mil-muted">💼 Tilgjengelig IPC</div>
        <div className="flex items-center gap-3">
          <span className="ipc-value text-2xl">{nation.ipc}</span>
          {rdConfirmed && rdDice > 0 && (
            <span className="text-xs text-red-400">− {rdDice * RD_COST} R&D = {availableIPC} gjenstår</span>
          )}
        </div>
      </div>

      {/* ── R&D section ─────────────────────────────────────────── */}
      {settings.useRnD && (
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 space-y-3">
          <div className="card-header mb-0">🎲 Forskning & Utvikling (R&D)</div>

          {!rdConfirmed ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-mil-muted">Antall terninger (5 IPC/stk):</span>
              <div className="flex items-center gap-2">
                <button
                  className="w-7 h-7 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-mil-text"
                  onClick={() => setRdDice(d => Math.max(0, d - 1))}
                  disabled={rdDice === 0}
                >−</button>
                <span className="ipc-value text-lg w-6 text-center">{rdDice}</span>
                <button
                  className="w-7 h-7 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-mil-text"
                  onClick={() => setRdDice(d => d + 1)}
                  disabled={nation.ipc - (rdDice + 1) * RD_COST < 0}
                >+</button>
              </div>
              {rdDice > 0 && (
                <span className="text-xs text-mil-gold">= {rdDice * RD_COST} IPC</span>
              )}
              <button
                className="btn-primary text-xs py-1 px-3"
                disabled={rdDice === 0}
                onClick={confirmRd}
              >
                Bekreft R&D
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-green-400 text-xs">✅ {rdDice} terning{rdDice > 1 ? 'er' : ''} kjøpt ({rdDice * RD_COST} IPC trukket)</span>
                <button
                  className="text-xs text-mil-muted hover:text-yellow-300 border border-[#2a3818] rounded-sm px-2 py-0.5"
                  onClick={() => { setRdConfirmed(false); setRdDice(0); setRdRolled(false); }}
                >
                  ✏️ Endre
                </button>
              </div>
              {!rdRolled ? (
                <div className="text-xs text-mil-muted">
                  Kast terningene fysisk. Fikk du en <strong className="text-mil-gold">6</strong>? Trykk knappen under for å trekke teknologikategori.
                  <button
                    className="ml-2 btn-secondary text-xs py-0.5 px-2"
                    onClick={() => setRdRolled(true)}
                  >
                    🎲 Fikk 6 — trekk tech-kategori
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-mil-gold">🎉 Kast en ny terning for å bestemme teknologikategori (1–6)</span>
                  <button
                    className="btn-secondary text-xs py-0.5 px-2"
                    onClick={() => setRdRolled(false)}
                  >
                    🔄 Nullstill terninger
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Unit purchase tabs ──────────────────────────────────── */}
      <div>
        {/* Tab buttons */}
        <div className="flex gap-1 flex-wrap mb-3">
          {CATEGORIES.map(cat => {
            const catSpend = cat.units.reduce((s, u) => s + (qty[u.name] ?? 0) * u.cost, 0);
            return (
              <button
                key={cat.id}
                onClick={() => setTab(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-sm border font-display uppercase tracking-wide transition-colors ${
                  tab === cat.id
                    ? 'bg-[#2a3818] border-mil-gold text-mil-gold'
                    : 'bg-[#141a0c] border-[#2a3818] text-mil-muted hover:text-mil-text'
                }`}
              >
                {cat.emoji} {cat.label}
                {catSpend > 0 && <span className="ml-1 text-green-400">({catSpend})</span>}
              </button>
            );
          })}
          <button
            onClick={() => setTab('reparasjoner')}
            className={`px-3 py-1.5 text-xs rounded-sm border font-display uppercase tracking-wide transition-colors ${
              tab === 'reparasjoner'
                ? 'bg-[#2a3818] border-mil-gold text-mil-gold'
                : 'bg-[#141a0c] border-[#2a3818] text-mil-muted hover:text-mil-text'
            }`}
          >
            🔧 Reparasjoner
            {repairSpend > 0 && <span className="ml-1 text-green-400">({repairSpend})</span>}
          </button>
        </div>

        {/* Unit grids */}
        {tab !== 'reparasjoner' && (() => {
          const cat = CATEGORIES.find(c => c.id === tab)!;
          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {cat.units.map(u => {
                const q         = qty[u.name] ?? 0;
                const canBuy    = remaining >= u.cost;
                return (
                  <div
                    key={u.name}
                    className={`flex items-center justify-between bg-[#0f1509] border rounded-sm px-2 py-2 text-xs transition-colors ${
                      q > 0 ? 'border-mil-gold' : 'border-[#1a2210]'
                    }`}
                  >
                    <div>
                      <div className="text-mil-text leading-tight">{u.icon} {u.name}</div>
                      <div className="text-mil-muted mt-0.5">{u.cost} IPC</div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button
                        onClick={() => change(u.name, -1, u.cost)}
                        disabled={q === 0}
                        className="w-6 h-6 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-red-400 disabled:opacity-30 text-center leading-6"
                      >−</button>
                      <span className={`w-6 text-center font-bold ${q > 0 ? 'text-mil-gold' : 'text-mil-muted'}`}>{q}</span>
                      <button
                        onClick={() => change(u.name, 1, u.cost)}
                        disabled={!canBuy}
                        className="w-6 h-6 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-green-400 disabled:opacity-30 text-center leading-6"
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Repairs tab */}
        {tab === 'reparasjoner' && (
          <div>
            {damagedBuildings.length === 0 ? (
              <p className="text-mil-muted text-xs py-4 text-center">Ingen skadede installasjoner.</p>
            ) : (
              <div className="space-y-2">
                {damagedBuildings.map(b => {
                  const key = `${b.tId}-${b.type}`;
                  const r   = repairs[key] ?? 0;
                  const typeLabel: Record<string, string> = {
                    major_factory: '🏭★ Stor fabrikk',
                    minor_factory: '🏭 Liten fabrikk',
                    air_base:      '🛬 Luftbase',
                    naval_base:    '⚓ Marinbase',
                  };
                  return (
                    <div key={key} className="flex items-center justify-between bg-[#0f1509] border border-[#1a2210] rounded-sm px-3 py-2 text-xs">
                      <div>
                        <div className="text-mil-text">{typeLabel[b.type] ?? b.type}</div>
                        <div className="text-mil-muted">{b.territory} — skade: {b.damage} 💥</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">{r} IPC</span>
                        <button
                          onClick={() => changeRepair(key, -1, b.damage)}
                          disabled={r === 0}
                          className="w-6 h-6 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-red-400 disabled:opacity-30 text-center"
                        >−</button>
                        <span className={`w-5 text-center font-bold ${r > 0 ? 'text-mil-gold' : 'text-mil-muted'}`}>{r}</span>
                        <button
                          onClick={() => changeRepair(key, 1, b.damage)}
                          disabled={remaining < 1 || r >= b.damage}
                          className="w-6 h-6 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-green-400 disabled:opacity-30 text-center"
                        >+</button>
                        <span className="text-mil-muted">/ {b.damage}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Summary & confirm ───────────────────────────────────── */}
      <div className="border-t border-[#2a3818] pt-3 space-y-2">
        {/* Selected units summary */}
        {(selectedUnits.length > 0 || repairSpend > 0) && (
          <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-2 space-y-1 text-xs">
            {settings.useRnD && rdConfirmed && rdDice > 0 && (
              <div className="flex justify-between text-mil-muted">
                <span>🎲 R&D: {rdDice} terning{rdDice > 1 ? 'er' : ''}</span>
                <span>{rdDice * RD_COST} IPC</span>
              </div>
            )}
            {selectedUnits.map(u => (
              <div key={u.name} className="flex justify-between text-mil-muted">
                <span>{u.icon} {qty[u.name]}× {u.name}</span>
                <span>{(qty[u.name] ?? 0) * u.cost} IPC</span>
              </div>
            ))}
            {repairSpend > 0 && (
              <div className="flex justify-between text-mil-muted">
                <span>🔧 Reparasjoner</span>
                <span>{repairSpend} IPC</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-[#2a3818] pt-1">
              <span className="text-mil-text">Totalt</span>
              <span className={remaining < 0 ? 'text-red-400' : 'text-mil-gold'}>{totalSpend + rdCost} IPC</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-mil-muted">Gjenstår etter kjøp: </span>
            <span className={`font-bold text-sm ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {remaining} IPC
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="btn-secondary text-xs"
              onClick={() => { setQty({}); setRepairs({}); }}
            >
              Nullstill kjøp
            </button>
            <button
              className="btn-primary text-xs px-4"
              disabled={remaining < 0}
              onClick={confirmPurchase}
            >
              ✅ Bekreft kjøp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TurnTrackerPage() {
  const {
    nations, round, activeNationIndex, activePhase,
    phasesDone, nextPhase, nextNation, goBackPhase, previousSnapshot,
  } = useGameStore();
  const [undoRequested, setUndoRequested] = useState(false);

  const activeNation = nations.find(n => n.id === TURN_ORDER[activeNationIndex]);

  const getPhaseStatus = (phase: Phase) => {
    if (phasesDone.includes(phase)) return 'done';
    if (phase === activePhase)      return 'active';
    return 'pending';
  };

  const handleUndo = () => {
    if (!undoRequested) { setUndoRequested(true); return; }
    goBackPhase();
    setUndoRequested(false);
  };

  return (
    <div className="space-y-4">
      {/* Turn header */}
      <div className="card flex items-center gap-4" style={{ borderLeftWidth: 4, borderLeftColor: activeNation?.color }}>
        <span className="text-4xl">{activeNation?.emoji}</span>
        <div>
          <div className="text-xs text-mil-muted uppercase tracking-widest">Runde {round} — Aktiv tur</div>
          <div className="font-display text-2xl font-bold" style={{ color: activeNation?.textColor }}>
            {activeNation?.name}
          </div>
          <div className="text-xs text-mil-muted mt-1">
            IPC-balanse: <span className="ipc-value">{activeNation?.ipc}</span>
          </div>
        </div>
        <div className="ml-auto flex flex-col sm:flex-row gap-2 items-end sm:items-center">
          {previousSnapshot && (
            <button
              className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                undoRequested
                  ? 'bg-red-900 border-red-500 text-red-200 animate-pulse'
                  : 'border-[#2a3818] text-mil-muted hover:text-yellow-400 hover:border-yellow-600'
              }`}
              onClick={handleUndo}
              onBlur={() => setUndoRequested(false)}
            >
              {undoRequested ? '⚠️ Bekreft angre?' : '↩ Angre fase'}
            </button>
          )}
          <button className="btn-secondary text-xs" onClick={() => { nextPhase(); setUndoRequested(false); }}>Neste fase →</button>
          <button className="btn-primary text-xs"   onClick={() => { nextNation(); setUndoRequested(false); }}>Neste nasjon ⏭</button>
        </div>
      </div>

      {/* Purchase panel — shown only in purchase phase */}
      {activePhase === 'purchase' && activeNation && (
        <PurchasePanel nation={activeNation} />
      )}

      {/* Phase steps */}
      <div className="card">
        <div className="card-header">📋 Faser</div>
        <div className="space-y-2">
          {PHASES_INFO.map((info, idx) => {
            const status = getPhaseStatus(info.id);
            return (
              <div
                key={info.id}
                className={`flex items-center gap-3 p-3 rounded-sm border transition-colors ${
                  status === 'active'  ? 'border-mil-gold bg-[#2a3a10]' :
                  status === 'done'    ? 'border-[#2a3818] bg-[#0f1509] opacity-60' :
                  'border-[#1e2a10] bg-[#141a0c]'
                }`}
              >
                <div className="w-6 text-center shrink-0">
                  {status === 'done'    && <span className="text-green-400">✅</span>}
                  {status === 'active'  && <span className="text-mil-gold animate-pulse">▶</span>}
                  {status === 'pending' && <span className="text-mil-muted">○</span>}
                </div>
                <span className="text-lg shrink-0">{info.emoji}</span>
                <div className="flex-1">
                  <div className={`font-display font-semibold text-sm uppercase tracking-wide ${
                    status === 'active' ? 'text-mil-gold' :
                    status === 'done'   ? 'text-mil-muted' : 'text-mil-text'
                  }`}>{info.label}</div>
                  <div className="flex gap-2 mt-0.5">
                    {info.warOnly  && <span className="tag bg-red-950 text-red-400">Kun krig</span>}
                    {info.optional && <span className="tag bg-[#2a3818] text-mil-muted">Valgfri</span>}
                  </div>
                </div>
                <span className="text-mil-muted text-xs font-mono shrink-0">Steg {idx + 1}</span>
                {status === 'active' && (
                  <button className="btn-secondary text-xs py-1 px-2 shrink-0" onClick={() => nextPhase()}>
                    Merk ferdig
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Turn order */}
      <div className="card">
        <div className="card-header">🔄 Turrekkefølge — Runde {round}</div>
        <div className="flex gap-2 flex-wrap">
          {TURN_ORDER.map((id, idx) => {
            const n       = nations.find(n => n.id === id)!;
            const isActive = idx === activeNationIndex;
            const isPast   = idx < activeNationIndex;
            return (
              <div
                key={id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-display uppercase transition-opacity ${
                  isActive ? 'border-current' : 'border-transparent opacity-50'
                }`}
                style={isActive
                  ? { backgroundColor: n.colorDim, color: n.textColor, borderColor: n.color }
                  : { backgroundColor: '#141a0c', color: n.textColor + '66' }
                }
              >
                {isPast   && <span>✓</span>}
                {isActive && <span>▶</span>}
                {n.emoji} {n.shortName}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

