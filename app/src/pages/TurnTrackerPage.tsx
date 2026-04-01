import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore, TURN_ORDER, PHASES } from '../store/gameStore';
import { PHASES_INFO } from '../data/nations';
import { BREAKTHROUGH_CHARTS, CHART_1, CHART_2 } from '../data/technologies';
import type { Phase, Nation, TechId } from '../store/types';

// ─── Unit catalogue ───────────────────────────────────────────────────────────
type UnitDef = { name: string; cost: number; icon: string; shipyardCost?: number };

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
      { name: 'Ubåt',       cost: 6,  icon: '🌊', shipyardCost: 5  },
      { name: 'Transport',  cost: 7,  icon: '📦', shipyardCost: 6  },
      { name: 'Destroyer',  cost: 8,  icon: '⚓', shipyardCost: 7  },
      { name: 'Krysser',    cost: 12, icon: '🚢', shipyardCost: 9  },
      { name: 'Hangarskip', cost: 16, icon: '🛸', shipyardCost: 13 },
      { name: 'Slagskip',   cost: 20, icon: '🔱', shipyardCost: 17 },
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
  const { addPurchase, clearPurchases, adjustIPC, territories, settings, addTechnology, setRdTokens } = useGameStore();

  // R&D state — only NEW dice bought this turn
  const [rdNewDice,       setRdNewDice]       = useState(0);
  const [rdChart,         setRdChart]         = useState<1 | 2>(1);
  const [rdConfirmed,     setRdConfirmed]     = useState(false);
  const [rdGotSix,        setRdGotSix]        = useState(false);
  const [rdTechPicked,    setRdTechPicked]    = useState<TechId | null>(null);
  const [rdTechSaved,     setRdTechSaved]     = useState(false);
  const [rdTokenSnapshot, setRdTokenSnapshot] = useState(0); // tokens before this confirm
  const [rdAttempted,     setRdAttempted]     = useState(false); // true after Ingen 6 — locks R&D for rest of turn

  // Total dice rolling this round = carried tokens + new dice
  const rdTotalDice = nation.rdTokens + (rdConfirmed ? rdNewDice : 0);

  // Unit quantities per category
  const [qty, setQty] = useState<Record<string, number>>({});

  // Purchase confirmed log
  const [purchaseDone,    setPurchaseDone]    = useState(false);
  const [purchaseLog,     setPurchaseLog]     = useState<{ icon: string; name: string; qty: number; cost: number }[]>([]);
  const [purchaseRdLog,   setPurchaseRdLog]   = useState<{ dice: number; cost: number } | null>(null);
  const [purchaseRepairLog, setPurchaseRepairLog] = useState(0);

  // Active tab
  const [tab, setTab] = useState<string>('land');

  // Repair points per territory-building key
  const [repairs, setRepairs] = useState<Record<string, number>>({});

  // Improved Shipyards: use official specific discounted costs per sea unit
  const hasImprovedShipyards = nation.technologies.includes('improved_shipyards');
  const getUnitCost = (u: UnitDef, catId: string) =>
    catId === 'sea' && hasImprovedShipyards && u.shipyardCost !== undefined
      ? u.shipyardCost
      : u.cost;

  // Budget — R&D is charged immediately on confirmRd, not here
  const availableIPC = nation.ipc;

  const unitSpend = Object.entries(qty).reduce((s, [name, q]) => {
    for (const cat of CATEGORIES) {
      const u = cat.units.find(u => u.name === name);
      if (u) return s + q * getUnitCost(u, cat.id);
    }
    return s;
  }, 0);

  const repairSpend = Object.values(repairs).reduce((s, v) => s + v, 0);
  const totalSpend  = unitSpend + repairSpend;
  const remaining   = availableIPC - totalSpend;

  const change = (name: string, delta: number, cost: number) => {
    setQty(prev => {
      const cur  = prev[name] ?? 0;
      const next = Math.max(0, cur + delta);
      if (delta > 0 && remaining < cost) return prev;
      return { ...prev, [name]: next };
    });
  };

  const changeRepair = (key: string, delta: number, max: number) => {
    setRepairs(prev => {
      const cur  = prev[key] ?? 0;
      const next = Math.max(0, Math.min(max, cur + delta));
      if (delta > 0 && remaining < 1) return prev;
      return { ...prev, [key]: next };
    });
  };

  const confirmRd = () => {
    if (rdConfirmed) return;
    // Immediately charge for new dice and save total tokens to store
    const newDiceCost = rdNewDice * RD_COST;
    setRdTokenSnapshot(nation.rdTokens); // save so Endre can undo
    if (rdNewDice > 0) {
      adjustIPC(nation.id, -newDiceCost);
      addPurchase(nation.id, { unitType: 'R&D terning', quantity: rdNewDice, costEach: RD_COST });
    }
    setRdTokens(nation.id, nation.rdTokens + rdNewDice);
    setRdConfirmed(true);
  };

  // Cancel confirm: refund new dice cost and restore token count
  const cancelRdConfirm = () => {
    if (rdNewDice > 0) {
      adjustIPC(nation.id, rdNewDice * RD_COST);
    }
    setRdTokens(nation.id, rdTokenSnapshot);
    setRdNewDice(0); setRdConfirmed(false);
    setRdGotSix(false); setRdTechPicked(null); setRdTechSaved(false);
  };

  const saveTech = () => {
    if (!rdTechPicked) return;
    addTechnology(nation.id, rdTechPicked);
    setRdTokens(nation.id, 0);  // tokens returned after breakthrough
    setRdTechSaved(true);
  };

  const resetRd = () => {
    setRdNewDice(0); setRdChart(1); setRdConfirmed(false);
    setRdGotSix(false); setRdTechPicked(null); setRdTechSaved(false); setRdAttempted(false);
  };

  const confirmPurchase = () => {
    // Save log before clearing
    const log = CATEGORIES.flatMap(c =>
      c.units
        .filter(u => (qty[u.name] ?? 0) > 0)
        .map(u => ({ icon: u.icon, name: u.name, qty: qty[u.name] ?? 0, cost: getUnitCost(u, c.id) }))
    );
    setPurchaseLog(log);
    setPurchaseRdLog(rdConfirmed && rdNewDice > 0 ? { dice: rdNewDice, cost: rdNewDice * RD_COST } : null);
    setPurchaseRepairLog(repairSpend);
    setPurchaseDone(true);

    clearPurchases(nation.id);
    CATEGORIES.forEach(cat => {
      cat.units.forEach(u => {
        const q = qty[u.name] ?? 0;
        if (q > 0) addPurchase(nation.id, { unitType: u.name, quantity: q, costEach: getUnitCost(u, cat.id) });
      });
    });
    // R&D cost already charged in confirmRd — only deduct unit/repair spend here
    adjustIPC(nation.id, -(unitSpend + repairSpend));
    setQty({});
    setRepairs({});
    // Do NOT reset rdAttempted — R&D lock must persist until next nation's turn
    setRdNewDice(0); setRdChart(1); setRdConfirmed(false);
    setRdGotSix(false); setRdTechPicked(null); setRdTechSaved(false);
  };

  // Damaged buildings in territories this nation controls
  const damagedBuildings = territories
    .filter(t => t.controller === nation.id && t.type === 'land')
    .flatMap(t => t.buildings.map(b => ({ ...b, territory: t.name, tId: t.id })))
    .filter(b => b.damage > 0);

  const selectedUnits = CATEGORIES.flatMap(c => c.units).filter(u => (qty[u.name] ?? 0) > 0);
  const chartTechs    = rdChart === 1 ? CHART_1 : CHART_2;

  // ── Purchase confirmed: show log ─────────────────────────────
  if (purchaseDone) {
    const totalSpent = purchaseLog.reduce((s, p) => s + p.qty * p.cost, 0)
      + (purchaseRdLog?.cost ?? 0)
      + purchaseRepairLog;
    return (
      <div className="card space-y-3">
        <div className="card-header">🧾 Kjøpsoversikt</div>
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 space-y-1 text-xs">
          {purchaseRdLog && (
            <div className="flex justify-between text-mil-muted">
              <span>🎲 R&D: {purchaseRdLog.dice} terning{purchaseRdLog.dice > 1 ? 'er' : ''}</span>
              <span>{purchaseRdLog.cost} IPC</span>
            </div>
          )}
          {purchaseLog.map(p => (
            <div key={p.name} className="flex justify-between text-mil-muted">
              <span>{p.icon} {p.qty}× {p.name}</span>
              <span>{p.qty * p.cost} IPC</span>
            </div>
          ))}
          {purchaseRepairLog > 0 && (
            <div className="flex justify-between text-mil-muted">
              <span>🔧 Reparasjoner</span>
              <span>{purchaseRepairLog} IPC</span>
            </div>
          )}
          {purchaseLog.length === 0 && !purchaseRdLog && purchaseRepairLog === 0 && (
            <div className="text-mil-muted text-center py-2">Ingen enheter kjøpt denne runden</div>
          )}
          <div className="flex justify-between font-bold border-t border-[#2a3818] pt-1 mt-1">
            <span className="text-mil-text">Totalt brukt</span>
            <span className="text-mil-gold">{totalSpent} IPC</span>
          </div>
          <div className="flex justify-between text-mil-muted pt-1 border-t border-[#2a3818]">
            <span>Gjenværende IPC</span>
            <span className="text-green-400 font-semibold">{nation.ipc} IPC</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card space-y-4">

      {/* Budget bar */}
      <div className="flex items-center justify-between">
        <div className="font-display text-sm uppercase tracking-widest text-mil-muted">💼 Tilgjengelig IPC</div>
        <div className="flex items-center gap-3">
          <span className="ipc-value text-2xl">{nation.ipc}</span>
          {nation.rdTokens > 0 && !rdConfirmed && (
            <span className="text-xs text-mil-gold">🎲 {nation.rdTokens} tilgjengelig{nation.rdTokens > 1 ? 'e' : ''} token</span>
          )}
        </div>
      </div>

      {/* ── R&D section ─────────────────────────────────────────── */}
      {settings.useRnD && (
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 space-y-3">
          <div className="card-header mb-0">🎲 Forskning &amp; Utvikling (R&D)</div>

          {/* Locked: attempted but no breakthrough this turn */}
          {rdAttempted && (
            <div className="flex items-center gap-2 text-xs text-mil-muted">
              <span>🔒 R&amp;D allerede forsøkt denne runden</span>
              {nation.rdTokens > 0 && (
                <span className="tag bg-[#1a2a10] text-mil-gold border border-[#2a3818]">🎲 {nation.rdTokens} tilgjengelig{nation.rdTokens > 1 ? 'e' : ''} token</span>
              )}
            </div>
          )}

          {/* Step 1: Pick chart + dice, then confirm */}
          {!rdConfirmed && !rdAttempted && (
            <div className="space-y-3">

              {/* Carry-over tokens from previous rounds */}
              {nation.rdTokens > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="tag bg-[#1a2a10] text-mil-gold border border-[#2a3818]">🎲 {nation.rdTokens} tilgjengelig{nation.rdTokens > 1 ? 'e' : ''} token</span>
                  <span className="text-mil-muted">— koster ingenting, ruller videre</span>
                </div>
              )}

              {/* New dice picker (only pay for new) */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-mil-muted">
                  {nation.rdTokens > 0 ? 'Ekstra nye terninger (5 IPC/stk):' : 'Antall terninger (5 IPC/stk):'}
                </span>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-mil-text"
                    onClick={() => setRdNewDice(d => Math.max(0, d - 1))} disabled={rdNewDice === 0}>−</button>
                  <span className="ipc-value text-lg w-6 text-center">{rdNewDice}</span>
                  <button className="w-7 h-7 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-mil-text"
                    onClick={() => setRdNewDice(d => d + 1)} disabled={nation.ipc - (rdNewDice + 1) * RD_COST < 0}>+</button>
                </div>
                {rdNewDice > 0 && <span className="text-xs text-red-400">− {rdNewDice * RD_COST} IPC</span>}
              </div>

              {/* Summary */}
              {(nation.rdTokens + rdNewDice) > 0 && (
                <div className="text-xs text-mil-muted">
                  Totalt: <span className="text-mil-gold font-bold">{nation.rdTokens + rdNewDice}</span> terning{(nation.rdTokens + rdNewDice) > 1 ? 'er' : ''} som kastes
                </div>
              )}

              {/* Both charts side by side (or stacked on mobile) — click a row to select that chart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([1, 2] as const).map(c => {
                  const techs     = c === 1 ? CHART_1 : CHART_2;
                  const isActive  = rdChart === c;
                  return (
                    <div
                      key={c}
                      onClick={() => setRdChart(c)}
                      className={`cursor-pointer rounded-sm border overflow-hidden transition-colors ${
                        isActive ? 'border-mil-gold' : 'border-[#2a3818] hover:border-[#3a4828]'
                      }`}
                    >
                      <div className={`px-3 py-2 text-xs font-display uppercase tracking-wide flex items-center justify-between ${
                        isActive ? 'bg-[#2a3818] text-mil-gold' : 'bg-[#141a0c] text-mil-muted'
                      }`}>
                        <span>📋 Bruddiagramm {c}</span>
                        {isActive && <span className="text-mil-gold text-sm">●</span>}
                      </div>
                      <table className="w-full text-xs">
                        <tbody>
                          {techs.map(t => (
                            <tr key={t.id} className="border-t border-[#1a2210]">
                              <td className="w-7 px-2 py-1.5 text-center text-mil-gold font-bold">{t.roll}</td>
                              <td className="px-2 py-1.5 text-mil-text font-medium">{t.norwegianName}</td>
                              <td className="px-2 py-1.5 text-mil-muted hidden sm:table-cell">{t.effect}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-mil-muted">Valgt: <span className="text-mil-gold">Diagram {rdChart}</span></span>
                <button className="btn-primary text-xs py-1 px-4"
                  disabled={(nation.rdTokens + rdNewDice) === 0}
                  onClick={confirmRd}>
                  Bekreft R&D
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmed — show chart + roll result buttons */}
          {rdConfirmed && !rdGotSix && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-green-400 text-xs">
                  ✅ {rdTotalDice} terning{rdTotalDice > 1 ? 'er' : ''} på Diagram {rdChart}
                  {rdNewDice > 0 && <span className="text-red-400 ml-1">({rdNewDice * RD_COST} IPC trukket)</span>}
                </span>
                <span className="text-xs text-mil-muted italic">🔒 R&amp;D låst for denne runden</span>
              </div>
              <p className="text-xs text-mil-muted">Kast terningene fysisk. Fikk du en <strong className="text-mil-gold">6</strong>?</p>
              <div className="flex gap-2">
                <button className="btn-primary text-xs px-3 py-1" onClick={() => setRdGotSix(true)}>🎉 Ja, fikk gjennombrudd!</button>
                <button className="btn-secondary text-xs px-3 py-1"
                  onClick={() => { setRdNewDice(0); setRdConfirmed(false); setRdGotSix(false); setRdTechPicked(null); setRdTechSaved(false); setRdAttempted(true); }}>
                  ❌ Ingen 6 — token beholdes til neste runde
                </button>
              </div>
              {/* Full chart for reading off the result */}
              <div className="border border-[#2a3818] rounded-sm overflow-hidden">
                <div className="bg-[#141a0c] px-3 py-1.5 text-xs font-display uppercase tracking-wide text-mil-gold">
                  📋 Bruddiagramm {rdChart} — kast ny terning for teknologi
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    {chartTechs.map(t => (
                      <tr key={t.id} className="border-t border-[#1a2210]">
                        <td className="w-8 px-2 py-2 text-center text-mil-gold font-bold text-base">{t.roll}</td>
                        <td className="px-2 py-2">
                          <div className="text-mil-text font-medium">{t.norwegianName}</div>
                          <div className="text-mil-muted mt-0.5">{t.description}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 3: Got 6 — select the tech from the chart */}
          {rdConfirmed && rdGotSix && !rdTechSaved && (
            <div className="space-y-3">
              <p className="text-xs text-mil-muted">Velg teknologien du kastet (Diagram {rdChart}):</p>
              <div className="border border-[#2a3818] rounded-sm overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    {chartTechs.map(t => {
                      const alreadyHas = nation.technologies.includes(t.id);
                      const isSelected = rdTechPicked === t.id;
                      return (
                        <tr
                          key={t.id}
                          onClick={() => !alreadyHas && setRdTechPicked(t.id)}
                          className={`border-t border-[#1a2210] transition-colors ${
                            alreadyHas  ? 'opacity-40 cursor-not-allowed' :
                            isSelected  ? 'bg-[#2a3818] cursor-pointer' :
                                          'hover:bg-[#141a0c] cursor-pointer'
                          }`}
                        >
                          <td className="w-8 px-2 py-2 text-center text-mil-gold font-bold text-base">{t.roll}</td>
                          <td className="px-2 py-2">
                            <div className="text-mil-text font-medium">{t.norwegianName} {alreadyHas && <span className="text-mil-muted text-[10px]">(allerede)</span>}</div>
                            <div className="text-mil-muted mt-0.5">{t.effect}</div>
                          </td>
                          <td className="px-3 py-2 text-right shrink-0">
                            {isSelected && <span className="text-mil-gold text-lg">✓</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-primary text-xs px-4"
                  disabled={!rdTechPicked}
                  onClick={saveTech}
                >
                  🔬 Registrer teknologi
                </button>
                <button className="btn-secondary text-xs" onClick={() => setRdGotSix(false)}>← Tilbake</button>
              </div>
            </div>
          )}

          {/* Step 4: Tech saved confirmation */}
          {rdConfirmed && rdTechSaved && rdTechPicked && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400">✅ Teknologi registrert:</span>
                <span className="tag bg-[#2a3818] text-mil-gold">
                  {BREAKTHROUGH_CHARTS.find(t => t.id === rdTechPicked)?.norwegianName}
                </span>
              </div>
              <p className="text-xs text-mil-muted">
                {BREAKTHROUGH_CHARTS.find(t => t.id === rdTechPicked)?.description}
              </p>
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
                const cost    = getUnitCost(u, cat.id);
                const q       = qty[u.name] ?? 0;
                const canBuy  = remaining >= cost;
                const isDisc  = cost < u.cost;
                return (
                  <div
                    key={u.name}
                    className={`flex items-center justify-between bg-[#0f1509] border rounded-sm px-2 py-2 text-xs transition-colors ${
                      q > 0 ? 'border-mil-gold' : 'border-[#1a2210]'
                    }`}
                  >
                    <div>
                      <div className="text-mil-text leading-tight">{u.icon} {u.name}</div>
                      <div className="text-mil-muted mt-0.5">
                        {isDisc
                          ? <><span className="line-through text-[10px]">{u.cost}</span> <span className="text-green-400">{cost}</span> IPC</>
                          : <>{cost} IPC</>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button onClick={() => change(u.name, -1, cost)} disabled={q === 0}
                        className="w-6 h-6 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-red-400 disabled:opacity-30 text-center leading-6">−</button>
                      <span className={`w-6 text-center font-bold ${q > 0 ? 'text-mil-gold' : 'text-mil-muted'}`}>{q}</span>
                      <button onClick={() => change(u.name, 1, cost)} disabled={!canBuy}
                        className="w-6 h-6 rounded-sm bg-[#141a0c] border border-[#2a3818] text-mil-muted hover:text-green-400 disabled:opacity-30 text-center leading-6">+</button>
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
            {settings.useRnD && rdConfirmed && rdNewDice > 0 && (
              <div className="flex justify-between text-mil-muted">
                <span>🎲 R&D: {rdNewDice} ny{rdNewDice > 1 ? 'e' : ''} terning{rdNewDice > 1 ? 'er' : ''} (allerede trukket)</span>
                <span>{rdNewDice * RD_COST} IPC</span>
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
              <span className="text-mil-text">Totalt enheter</span>
              <span className={remaining < 0 ? 'text-red-400' : 'text-mil-gold'}>{unitSpend + repairSpend} IPC</span>
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

// ─── Collect Income panel ─────────────────────────────────────────────────────
function CollectIncomePanel({ nation, confirmRef }: { nation: Nation; confirmRef?: React.MutableRefObject<(() => void) | null> }) {
  const { territories, nations, adjustIPC, nextPhase, clearCapitalSeizures, settings } = useGameStore();

  const ownedTerritories     = territories.filter(t => t.controller === nation.id && t.type === 'land');
  const homeTerritories      = ownedTerritories.filter(t => t.originalOwner === nation.id);
  const capturedTerritories  = ownedTerritories.filter(t => t.originalOwner !== nation.id);
  const homeTerritoryIPC     = homeTerritories.reduce((s, t) => s + t.ipc, 0);
  const capturedTerritoryIPC = capturedTerritories.reduce((s, t) => s + t.ipc, 0);
  const territoryIPC         = homeTerritoryIPC + capturedTerritoryIPC;

  const seizures   = nation.pendingCapitalSeizures ?? [];
  const seizureIPC = seizures.reduce((s, cs) => s + cs.amount, 0);

  const objectivesIPC = settings.useNationalObjectives
    ? nation.objectives.reduce((s, o) => {
        if (!o.achieved) return s;
        if (o.perTerritoryIds && o.perTerritoryIds.length > 0) {
          const count = territories.filter(t => t.controller === nation.id && o.perTerritoryIds!.includes(t.id)).length;
          return s + o.ipcBonus * count;
        }
        return s + o.ipcBonus;
      }, 0)
    : 0;

  const convoyLoss   = nation.convoyLoss ?? 0;
  const adjustment   = nation.ipcAdjustment ?? 0;
  const totalIncome  = territoryIPC + objectivesIPC - convoyLoss + adjustment + seizureIPC;

  // Expenses this turn
  const purchasedIPC   = nation.purchasedThisTurn.reduce((s, p) => s + p.quantity * p.costEach, 0);
  const casualtiesIPC  = nation.casualtiesThisTurn?.reduce((s, c) => s + c.quantity * c.costEach, 0) ?? 0;

  // Net = existing balance + income − casualties
  const net = nation.ipc + totalIncome - casualtiesIPC;

  const [confirmed, setConfirmed] = useState(false);

  const confirm = () => {
    if (confirmed) return;
    adjustIPC(nation.id, totalIncome);
    clearCapitalSeizures(nation.id);
    setConfirmed(true);
    nextPhase();
  };

  // Expose auto-confirm so parent (Merk ferdig) can trigger it
  if (confirmRef) {
    confirmRef.current = () => {
      if (!confirmed) {
        adjustIPC(nation.id, totalIncome);
        clearCapitalSeizures(nation.id);
        setConfirmed(true);
      }
      nextPhase();
    };
  }

  return (
    <div className="card space-y-3">
      <div className="card-header">6️⃣ Collect Income</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* ── Income breakdown ── */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 space-y-1 text-xs">
          <div className="text-mil-muted uppercase tracking-wider font-display text-[10px] mb-2">💰 Inntekter</div>
          <div className="flex justify-between text-mil-muted">
            <span>🏠 Hjemme ({homeTerritories.length})</span>
            <span className="text-mil-text">+{homeTerritoryIPC} IPC</span>
          </div>
          {capturedTerritories.length > 0 && (
            <div className="flex justify-between text-mil-muted">
              <span>🏳 Kaprede ({capturedTerritories.length})</span>
              <span className="text-mil-text">+{capturedTerritoryIPC} IPC</span>
            </div>
          )}
          {seizures.map((cs, i) => {
            const fromNation = nations.find(n => n.id === cs.capturedFrom);
            return (
              <div key={i} className="flex justify-between text-mil-muted">
                <span>⚑ Kapitalbeslag ({fromNation?.shortName ?? cs.capturedFrom})</span>
                <span className="text-yellow-400">+{cs.amount} IPC</span>
              </div>
            );
          })}
          {objectivesIPC > 0 && (
            <div className="flex justify-between text-mil-muted">
              <span>🎯 Nasjonale mål</span>
              <span className="text-green-400">+{objectivesIPC} IPC</span>
            </div>
          )}
          {convoyLoss > 0 && (
            <div className="flex justify-between text-mil-muted">
              <span>⚓ Konvoi-tap</span>
              <span className="text-red-400">−{convoyLoss} IPC</span>
            </div>
          )}
          {adjustment !== 0 && (
            <div className="flex justify-between text-mil-muted">
              <span>✏️ Justering</span>
              <span className={adjustment > 0 ? 'text-green-400' : 'text-red-400'}>
                {adjustment > 0 ? '+' : ''}{adjustment} IPC
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-[#2a3818] pt-1 mt-1">
            <span className="text-mil-text">Total inntekt</span>
            <span className="text-green-400">+{totalIncome} IPC</span>
          </div>
        </div>

        {/* ── Expenses breakdown ── */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 space-y-1 text-xs">
          <div className="text-mil-muted uppercase tracking-wider font-display text-[10px] mb-2">🛒 Kjøp denne runden <span className="normal-case opacity-60">(allerede betalt i fase 1)</span></div>
          {nation.purchasedThisTurn.length > 0 ? (
            nation.purchasedThisTurn.map((p, i) => (
              <div key={i} className="flex justify-between text-mil-muted opacity-60">
                <span>{p.quantity}× {p.unitType}</span>
                <span>−{p.quantity * p.costEach} IPC</span>
              </div>
            ))
          ) : (
            <div className="text-mil-muted italic">Ingen enheter kjøpt</div>
          )}
          {purchasedIPC > 0 && (
            <div className="flex justify-between text-mil-muted opacity-60 border-t border-[#2a3818] pt-1 mt-1">
              <span>Sum kjøp</span>
              <span>−{purchasedIPC} IPC</span>
            </div>
          )}
          {casualtiesIPC > 0 && (
            <div className="flex justify-between text-mil-muted border-t border-[#2a3818] pt-1 mt-1">
              <span>⚰️ Tap (enheter)</span>
              <span className="text-red-400">−{casualtiesIPC} IPC</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Net result ── */}
      <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 text-xs space-y-1">
        <div className="flex justify-between text-mil-muted">
          <span>Gjenstående etter kjøp</span>
          <span className="text-mil-text">{nation.ipc} IPC</span>
        </div>
        <div className="flex justify-between text-mil-muted">
          <span>+ Inntekt denne runden <span className="opacity-60">(territorier + kapitalbeslag + mål)</span></span>
          <span className="text-green-400">+{totalIncome} IPC</span>
        </div>
        <div className="flex justify-between font-bold border-t border-[#2a3818] pt-1 mt-1">
          <span className="text-mil-text">Saldo etter innsamling</span>
          <span className={`text-sm font-bold ${(nation.ipc + totalIncome) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {nation.ipc + totalIncome} IPC
          </span>
        </div>
        <div className="flex justify-between text-mil-muted pt-1">
          <span>📊 Netto saldo etter runden <span className="opacity-60">(gjenstående + inntekt − tap)</span></span>
          <span className={net >= 0 ? 'text-green-400' : 'text-red-400'}>
            {net >= 0 ? '+' : ''}{net} IPC
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        {nation.capitalCaptured ? (
          <div className="flex items-center gap-3">
            <span className="text-red-400 text-xs">
              🏴 Kapital er okkupert — kan ikke samle inntekt
            </span>
            <button
              className="btn-secondary text-xs px-4"
              onClick={() => { nextPhase(); }}
            >
              Hopp over →
            </button>
          </div>
        ) : (
          <button
            className="btn-primary text-xs px-4"
            disabled={confirmed}
            onClick={confirm}
          >
            ✅ Bekreft Collect Income
          </button>
        )}
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
  const collectConfirmRef = useRef<(() => void) | null>(null);

  const activeNation = nations.find(n => n.id === TURN_ORDER[activeNationIndex]);

  // Phases blocked when this nation's capital is occupied
  const capitalLockedPhases: Phase[] = activeNation?.capitalCaptured
    ? ['purchase', 'conduct_combat', 'collect_income']
    : [];
  const isCapitalLocked = (phase: Phase) => capitalLockedPhases.includes(phase);

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

      {/* Purchase panel — shown only in purchase phase, and only when capital not captured */}
      {activePhase === 'purchase' && activeNation && (
        activeNation.capitalCaptured ? (
          <div className="card">
            <div className="card-header">1️⃣ Purchase &amp; Repair Units</div>
            <div className="flex items-center gap-3 p-4 text-sm">
              <span className="text-2xl">🔒</span>
              <div>
                <div className="text-red-400 font-semibold">Kapital er okkupert</div>
                <div className="text-mil-muted text-xs mt-1">Kan ikke kjøpe eller reparere enheter uten kontroll over kapitalen.</div>
              </div>
              <button className="btn-secondary text-xs px-4 ml-auto" onClick={() => nextPhase()}>Hopp over →</button>
            </div>
          </div>
        ) : (
          <PurchasePanel nation={activeNation} />
        )
      )}

      {/* Conduct Combat lock banner */}
      {activePhase === 'conduct_combat' && activeNation?.capitalCaptured && (
        <div className="card">
          <div className="card-header">3️⃣ Conduct Combat</div>
          <div className="flex items-center gap-3 p-4 text-sm">
            <span className="text-2xl">🔒</span>
            <div>
              <div className="text-red-400 font-semibold">Kapital er okkupert</div>
              <div className="text-mil-muted text-xs mt-1">Kan ikke gjennomføre kamp uten kontroll over kapitalen.</div>
            </div>
            <button className="btn-secondary text-xs px-4 ml-auto" onClick={() => nextPhase()}>Hopp over →</button>
          </div>
        </div>
      )}

      {/* Collect Income panel — shown only in collect_income phase */}
      {activePhase === 'collect_income' && activeNation && (
        <CollectIncomePanel nation={activeNation} confirmRef={collectConfirmRef} />
      )}

      {/* Phase steps */}
      <div className="card">
        <div className="card-header">📋 Faser</div>
        <div className="space-y-2">
          {PHASES_INFO.filter(info =>
            info.id !== 'rockets' || (activeNation?.technologies ?? []).includes('rockets')
          ).map((info, idx) => {
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
                    {isCapitalLocked(info.id) && <span className="tag bg-red-950 text-red-400">🔒 Kapital okkupert</span>}
                  </div>
                </div>
                <span className="text-mil-muted text-xs font-mono shrink-0">Steg {idx + 1}</span>
                {info.id === 'conduct_combat' && (
                  <>
                    <Link to="/territorier" className="text-xs text-mil-muted hover:text-mil-gold border border-[#2a3818] hover:border-mil-gold rounded-sm px-2 py-1 transition-colors shrink-0">🗺 Territorier</Link>
                    <Link to="/slag"        className="text-xs text-mil-muted hover:text-mil-gold border border-[#2a3818] hover:border-mil-gold rounded-sm px-2 py-1 transition-colors shrink-0">⚔️ Slag</Link>
                  </>
                )}
                {status === 'active' && (
                  <button
                    className="btn-secondary text-xs py-1 px-2 shrink-0"
                    onClick={() => {
                      if (info.id === 'collect_income' && collectConfirmRef.current) {
                        collectConfirmRef.current();
                      } else {
                        nextPhase();
                      }
                    }}
                  >
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

