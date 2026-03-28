import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TURN_ORDER } from '../data/nations';
import type { NationId, Nation, Building } from '../store/types';
import NationIcon from '../components/NationIcon';

// Unit purchase costs (IPCs) - standard A&A units
const UNIT_COSTS: { name: string; cost: number; icon: string }[] = [
  { name: 'Infanteri',         cost: 3,  icon: '🪖' },
  { name: 'Mek. Infanteri',    cost: 4,  icon: '🚗' },
  { name: 'Artilleri',         cost: 4,  icon: '🔫' },
  { name: 'Stridsvogn',        cost: 6,  icon: '⚙️' },
  { name: 'Jagerflyger',       cost: 10, icon: '✈️' },
  { name: 'Taktisk Bomber',    cost: 11, icon: '💣' },
  { name: 'Strategisk Bomber', cost: 12, icon: '🛩️' },
  { name: 'Ubåt',              cost: 6,  icon: '🌊' },
  { name: 'Destroyer',         cost: 8,  icon: '⚓' },
  { name: 'Krysser',           cost: 12, icon: '🚢' },
  { name: 'Hangarskip',        cost: 16, icon: '🛸' },
  { name: 'Slagskip',          cost: 20, icon: '🔱' },
  { name: 'Transport',         cost: 7,  icon: '📦' },
  { name: 'Luftbase',          cost: 15, icon: '🛬' },
  { name: 'Marinbase',         cost: 15, icon: '⚓' },
  { name: 'Liten fabrikk',     cost: 12, icon: '🏭' },
]; 

const BUILDING_ICONS: Record<string, string> = {
  major_factory: '🏭★',
  minor_factory: '🏭',
  air_base:      '✈️',
  naval_base:    '⚓',
};

function BuildingBadge({ b }: { b: Building }) {
  const icon = BUILDING_ICONS[b.type] ?? '❓';
  return (
    <span className={`tag mr-1 ${b.damage >= 3 ? 'bg-red-950 text-red-400' : 'bg-[#0b0f07] text-mil-muted'}`}>
      {icon} {b.damage > 0 && <span className="text-red-400">{Array(b.damage).fill('💥').join('')}</span>}
    </span>
  );
}

function PurchaseCalculator({ nation }: { nation: Nation }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const spentIPC = UNIT_COSTS.reduce((s, u) => s + (quantities[u.name] ?? 0) * u.cost, 0);
  const remaining = nation.ipc - spentIPC;

  const change = (name: string, delta: number) => {
    setQuantities(prev => {
      const cur = prev[name] ?? 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [name]: next };
    });
  };

  const selectedUnits = UNIT_COSTS.filter(u => (quantities[u.name] ?? 0) > 0);

  return (
    <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 md:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div className="card-header mb-0">🛒 Kjøpskalkulator</div>
        <div className={`text-sm font-bold ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
          Gjenstår: {remaining} IPC
        </div>
      </div>

      {/* Unit grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
        {UNIT_COSTS.map(u => {
          const qty = quantities[u.name] ?? 0;
          const canAfford = remaining >= u.cost;
          return (
            <div
              key={u.name}
              className={`flex items-center justify-between bg-[#141a0c] border rounded-sm px-2 py-1.5 text-xs ${qty > 0 ? 'border-mil-gold' : 'border-[#1a2210]'}`}
            >
              <span className="text-mil-muted truncate">
                {u.icon} {u.name}
                <span className="text-mil-muted ml-1">({u.cost})</span>
              </span>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <button
                  onClick={() => change(u.name, -1)}
                  disabled={qty === 0}
                  className="w-5 h-5 rounded-sm bg-[#0b0f07] text-mil-muted hover:text-mil-text disabled:opacity-30 text-center leading-5"
                >−</button>
                <span className={`w-5 text-center ${qty > 0 ? 'text-mil-gold font-bold' : 'text-mil-muted'}`}>{qty}</span>
                <button
                  onClick={() => change(u.name, 1)}
                  disabled={!canAfford}
                  className="w-5 h-5 rounded-sm bg-[#0b0f07] text-mil-muted hover:text-mil-text disabled:opacity-30 text-center leading-5"
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {selectedUnits.length > 0 && (
        <div className="border-t border-[#2a3818] pt-2 text-xs space-y-0.5">
          {selectedUnits.map(u => (
            <div key={u.name} className="flex justify-between text-mil-muted">
              <span>{u.icon} {quantities[u.name]}× {u.name}</span>
              <span className="text-mil-text">= {(quantities[u.name] ?? 0) * u.cost} IPC</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-1 border-t border-[#2a3818]">
            <span className="text-mil-text">Totalt kjøpt</span>
            <span className={remaining < 0 ? 'text-red-400' : 'text-mil-gold'}>{spentIPC} IPC</span>
          </div>
        </div>
      )}

      <button
        className="btn-secondary text-xs py-1 mt-2"
        onClick={() => setQuantities({})}
      >
        Nullstill
      </button>
    </div>
  );
}

function NationCard({ nation }: { nation: Nation }) {
  const { territories, toggleObjective, adjustIPC, adjustIPCManual, activePhase } = useGameStore();
  const [manualInput, setManualInput] = useState('');
  const [showTerrBreakdown, setShowTerrBreakdown] = useState(false);

  const controlled = territories.filter(t => t.controller === nation.id && t.type === 'land');
  const territoryIPC = controlled.reduce((s, t) => s + t.ipc, 0);
  const objectivesIPC = nation.objectives.reduce((s, o) => {
    if (!o.achieved) return s;
    if (o.perTerritoryIds && o.perTerritoryIds.length > 0) {
      const count = territories.filter(t => t.controller === nation.id && o.perTerritoryIds!.includes(t.id)).length;
      return s + o.ipcBonus * count;
    }
    return s + o.ipcBonus;
  }, 0);
  const adjustment = nation.ipcAdjustment ?? 0;
  const totalIncome = territoryIPC + objectivesIPC - nation.convoyLoss + adjustment;

  const buildingsByTerritory = controlled
    .filter(t => t.buildings.length > 0)
    .map(t => ({ name: t.name, buildings: t.buildings }));

  const applyManual = (sign: 1 | -1) => {
    const v = parseInt(manualInput, 10);
    if (!isNaN(v) && v > 0) {
      adjustIPCManual(nation.id, sign * v);
      setManualInput('');
    }
  };

  return (
    <div className="card">
      {/* Nation header */}
      <div
        className="flex items-center justify-between -m-4 mb-4 px-4 py-3 rounded-t-sm"
        style={{ backgroundColor: nation.colorDim }}
      >
        <div className="flex items-center gap-3">
          <NationIcon nation={nation} size="lg" />
          <div>
            <div className="font-display text-xl font-bold" style={{ color: nation.textColor }}>
              {nation.name}
            </div>
            <div className="text-xs" style={{ color: nation.textColor + 'aa' }}>
              {nation.side} · {controlled.length} territorier
              {nation.atWarWith.length > 0
                ? ` · ⚔ I krig`
                : ` · 🕊 Nøytral`}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="ipc-value text-3xl">{nation.ipc}</div>
          <div className="text-xs text-mil-muted">IPC i kassen</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income breakdown */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="card-header mb-0">💰 Inntekt denne runden</div>
            <button
              onClick={() => setShowTerrBreakdown(v => !v)}
              className="text-xs text-mil-muted hover:text-mil-text"
            >
              {showTerrBreakdown ? '▲ Skjul' : '▼ Detaljer'}
            </button>
          </div>

          <div className="space-y-1 text-sm">
            {/* Territory line – expandable */}
            <div className="flex justify-between">
              <span className="text-mil-muted">Territorier ({controlled.length})</span>
              <span className="text-green-400">+{territoryIPC}</span>
            </div>

            {showTerrBreakdown && (
              <div className="pl-3 space-y-0.5 border-l border-[#2a3818] text-xs mb-1">
                {controlled.filter(t => t.ipc > 0).sort((a, b) => b.ipc - a.ipc).map(t => (
                  <div key={t.id} className="flex justify-between text-mil-muted">
                    <span>{t.name}</span>
                    <span>+{t.ipc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Objectives breakdown */}
            {nation.objectives.filter(o => o.achieved && o.ipcBonus > 0).map(o => {
              let bonus = o.ipcBonus;
              let bonusLabel = `+${o.ipcBonus}`;
              if (o.perTerritoryIds && o.perTerritoryIds.length > 0) {
                const count = territories.filter(t => t.controller === nation.id && o.perTerritoryIds!.includes(t.id)).length;
                bonus = o.ipcBonus * count;
                bonusLabel = count > 0 ? `+${o.ipcBonus}×${count} = +${bonus}` : '0';
              }
              return (
                <div key={o.id} className="flex justify-between text-xs">
                  <span className="text-mil-muted truncate pr-2">{o.description}</span>
                  <span className="text-green-400 shrink-0">{bonusLabel}</span>
                </div>
              );
            })}

            <div className="flex justify-between">
              <span className="text-mil-muted">Konvoi tap</span>
              <span className="text-red-400">−{nation.convoyLoss}</span>
            </div>

            {adjustment !== 0 && (
              <div className="flex justify-between">
                <span className="text-yellow-400 text-xs">🔧 Manuell justering</span>
                <span className={adjustment >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {adjustment >= 0 ? '+' : ''}{adjustment}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-1 border-t border-[#2a3818] font-bold">
              <span className="text-mil-text">Totalt</span>
              <span className="ipc-value">+{totalIncome}</span>
            </div>
          </div>

          <button
            className="w-full btn-secondary text-xs py-1 mt-3"
            onClick={() => adjustIPC(nation.id, totalIncome)}
          >
            ✅ Legg til inntekt (+{totalIncome})
          </button>
        </div>

        {/* Manual IPC correction */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3">
          <div className="card-header">🔧 Manuell IPC-justering</div>
          <div className="text-xs text-mil-muted mb-2">
            Bruk dette hvis regnestykket er feil. Blir vist i inntektsutregningen.
          </div>
          {adjustment !== 0 && (
            <div className="text-sm text-yellow-400 mb-2">
              Aktiv justering: {adjustment >= 0 ? '+' : ''}{adjustment} IPC
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              placeholder="Antall IPC"
              className="flex-1 bg-[#0b0f07] border border-[#2a3818] rounded-sm px-2 py-1 text-sm text-mil-text focus:outline-none focus:border-mil-gold"
            />
            <button className="btn-secondary text-xs px-3 py-1" onClick={() => applyManual(1)}>+ Legg til</button>
            <button className="btn-secondary text-xs px-3 py-1 text-red-400" onClick={() => applyManual(-1)}>− Trekk fra</button>
          </div>
          {adjustment !== 0 && (
            <button
              className="text-xs text-mil-muted hover:text-red-400 mt-2"
              onClick={() => adjustIPCManual(nation.id, -adjustment)}
            >
              🗑 Nullstill justering
            </button>
          )}
        </div>

        {/* Buildings */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3">
          <div className="card-header">🏗 Bygninger</div>
          {buildingsByTerritory.length === 0 ? (
            <div className="text-mil-muted text-xs">Ingen bygninger</div>
          ) : (
            <div className="space-y-1.5 text-xs">
              {buildingsByTerritory.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-mil-text truncate">{t.name}</span>
                  <div className="flex gap-1">
                    {t.buildings.map((b, j) => <BuildingBadge key={j} b={b} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* National Objectives */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 md:col-span-2">
          <div className="card-header">🎯 Nasjonale mål</div>
          <div className="space-y-2">
            {nation.objectives.map(obj => {
              let bonusDisplay = `+${obj.ipcBonus} IPC`;
              if (obj.perTerritoryIds && obj.perTerritoryIds.length > 0) {
                const count = territories.filter(t => t.controller === nation.id && obj.perTerritoryIds!.includes(t.id)).length;
                const total = obj.ipcBonus * count;
                bonusDisplay = `+${obj.ipcBonus}/terr × ${count} = +${total} IPC`;
              }
              return (
                <label key={obj.id} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={obj.achieved}
                    onChange={e => toggleObjective(nation.id, obj.id, e.target.checked)}
                    className="mt-0.5 accent-[#c8a030]"
                  />
                  <span className={`text-xs flex-1 ${obj.achieved ? 'text-mil-text' : 'text-mil-muted'}`}>
                    {obj.description}
                  </span>
                  {obj.ipcBonus > 0 && (
                    <span className={`tag shrink-0 text-xs ${obj.achieved ? 'bg-[#3a5018] text-green-400' : 'bg-[#0b0f07] text-mil-muted'}`}>
                      {bonusDisplay}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Purchase calculator — shown during purchase phase */}
        {activePhase === 'purchase' && <PurchaseCalculator nation={nation} />}
      </div>
    </div>
  );
}

export default function NationsPage() {
  const { nations } = useGameStore();
  const [activeTab, setActiveTab] = useState<NationId>(TURN_ORDER[0]);

  const nation = nations.find(n => n.id === activeTab);

  return (
    <div className="space-y-4">
      {/* Nation tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TURN_ORDER.map(id => {
          const n = nations.find(n => n.id === id)!;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-display uppercase tracking-wider whitespace-nowrap border transition-colors ${
                activeTab === id
                  ? 'border-transparent'
                  : 'border-[#2a3818] text-mil-muted hover:text-mil-text'
              }`}
              style={activeTab === id ? { backgroundColor: n.colorDim, color: n.textColor, borderColor: n.color } : {}}
            >
              {n.emoji} {n.shortName}
              {n.isEliminated && ' ✗'}
            </button>
          );
        })}
      </div>

      {nation && <NationCard nation={nation} />}
    </div>
  );
}
