import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, TURN_ORDER } from '../store/gameStore';
import { AXIS_NATIONS, ALLIED_NATIONS } from '../data/nations';
import { getVictoryCities } from '../data/territories';
import type { Nation, Territory } from '../store/types';
import NationIcon from '../components/NationIcon';

function IPCBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="mt-1 h-1.5 bg-[#1a2210] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function NationRow({ nation }: { nation: Nation }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#1e2a10] last:border-0">
      <div className="flex items-center gap-2">
        <NationIcon nation={nation} size="sm" />
        <span className="text-xs font-display uppercase tracking-wide" style={{ color: nation.textColor }}>
          {nation.name}
        </span>
        {nation.isEliminated && (
          <span className="tag bg-red-950 text-red-500">Eliminert</span>
        )}
        {!nation.isActive && !nation.isEliminated && (
          <span className="tag bg-[#1a2210] text-mil-muted">Nøytral</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="ipc-value text-sm">{nation.ipc}</span>
        <span className="text-mil-muted text-xs">IPC</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { nations, territories, round, activeNationIndex, activePhase, gameStarted, nextPhase, nextNation } = useGameStore();
  const navigate = useNavigate();

  const axisNations   = nations.filter(n => AXIS_NATIONS.includes(n.id));
  const alliedNations = nations.filter(n => ALLIED_NATIONS.includes(n.id));

  const axisIPC   = axisNations.reduce((s, n) => s + n.ipc, 0);
  const alliedIPC = alliedNations.reduce((s, n) => s + n.ipc, 0);
  const totalIPC  = axisIPC + alliedIPC;

  const victoryCities = getVictoryCities(territories);
  const axisVC    = victoryCities.filter(t => AXIS_NATIONS.includes(t.controller as never)).length;
  const alliedVC  = victoryCities.filter(t => ALLIED_NATIONS.includes(t.controller as never)).length;
  const totalVC   = victoryCities.length;

  const activeNation = nations.find(n => n.id === TURN_ORDER[activeNationIndex]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-6xl">🎖</div>
        <h1 className="font-display text-3xl text-mil-gold tracking-widest uppercase">
          Axis &amp; Allies Global 1940
        </h1>
        <p className="text-mil-muted text-sm">Ingen aktiv spilløkt. Start et nytt spill for å begynne.</p>
        <button className="btn-primary text-base px-8 py-3" onClick={() => navigate('/oppsett')}>
          ▶ Start nytt spill
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active turn banner */}
      <div
        className="card flex items-center justify-between"
        style={{ borderColor: activeNation?.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{activeNation?.emoji}</span>
          <div>
            <div className="text-xs text-mil-muted font-mono uppercase tracking-widest">Aktiv nasjon</div>
            <div className="font-display text-xl font-bold" style={{ color: activeNation?.textColor }}>
              {activeNation?.name}
            </div>
          </div>
          <div className="pl-4 border-l border-[#2a3818]">
            <div className="text-xs text-mil-muted uppercase tracking-wider">Fase</div>
            <div className="font-display text-base text-mil-gold capitalize">
              {activePhase.replace(/_/g, ' ')}
            </div>
          </div>
          <div className="pl-4 border-l border-[#2a3818]">
            <div className="text-xs text-mil-muted uppercase tracking-wider">Runde</div>
            <div className="font-display text-2xl font-bold text-mil-gold">{round}</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            className="btn-primary text-xs px-4 py-2"
            onClick={() => navigate('/tur')}
          >
            🎯 Gå til fase
          </button>
          <button className="btn-secondary text-xs" onClick={nextPhase}>
            Neste fase →
          </button>
          <button className="btn-secondary text-xs" onClick={nextNation}>
            Neste nasjon ⏭
          </button>
        </div>
      </div>

      {/* IPC panels + Victory cities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Axis IPC */}
        <div className="card">
          <div className="card-header" style={{ color: '#c8a030' }}>⚔ Aksemakter</div>
          <div className="space-y-0.5">
            {axisNations.map(n => <NationRow key={n.id} nation={n} />)}
          </div>
          <div className="mt-3 pt-3 border-t border-[#2a3818] flex justify-between items-center">
            <span className="text-mil-muted text-xs uppercase tracking-wider">Totalt</span>
            <div>
              <span className="ipc-value text-xl">{axisIPC}</span>
              <span className="text-mil-muted text-xs ml-1">IPC</span>
            </div>
          </div>
          <IPCBar value={axisIPC} max={totalIPC} color="#c8a030" />
        </div>

        {/* Allied IPC */}
        <div className="card">
          <div className="card-header" style={{ color: '#4a8fe8' }}>🛡 Allierte</div>
          <div className="space-y-0.5">
            {alliedNations.map(n => <NationRow key={n.id} nation={n} />)}
          </div>
          <div className="mt-3 pt-3 border-t border-[#2a3818] flex justify-between items-center">
            <span className="text-mil-muted text-xs uppercase tracking-wider">Totalt</span>
            <div>
              <span className="ipc-value text-xl">{alliedIPC}</span>
              <span className="text-mil-muted text-xs ml-1">IPC</span>
            </div>
          </div>
          <IPCBar value={alliedIPC} max={totalIPC} color="#4a8fe8" />
        </div>

        {/* Victory cities */}
        <div className="card">
          <div className="card-header">🏆 Seiersbyer</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#c8a030]">⚔ Akse</span>
                <span className="ipc-value">{axisVC} / {totalVC}</span>
              </div>
              <div className="h-3 bg-[#0b0f07] rounded-sm overflow-hidden flex">
                <div className="h-full bg-[#8a7020] transition-all" style={{ width: `${(axisVC / totalVC) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#4a8fe8]">🛡 Allierte</span>
                <span className="ipc-value">{alliedVC} / {totalVC}</span>
              </div>
              <div className="h-3 bg-[#0b0f07] rounded-sm overflow-hidden flex">
                <div className="h-full bg-[#285898] transition-all" style={{ width: `${(alliedVC / totalVC) * 100}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-[#2a3818] text-xs text-mil-muted space-y-1">
              <div>Seiersbetingelse: <span className="text-mil-text">kontroller 8 for Akse / 8 for Allierte</span></div>
              <div>Akse mangler: <span className="text-mil-gold font-bold">{Math.max(0, 8 - axisVC)} byer</span></div>
              <div>Allierte mangler: <span className="text-[#4a8fe8] font-bold">{Math.max(0, 8 - alliedVC)} byer</span></div>
            </div>
          </div>

          {/* Victory cities list */}
          <div className="mt-3 pt-3 border-t border-[#2a3818]">
            <div className="text-xs text-mil-muted uppercase tracking-wider mb-2">Byer</div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {victoryCities.map(t => {
                const ctrl = nations.find(n => n.id === t.controller);
                return (
                  <div key={t.id} className="flex items-center justify-between text-xs">
                    <span className="text-mil-text">{t.name}</span>
                    <span
                      className="tag"
                      style={{ backgroundColor: ctrl?.colorDim ?? '#1a2210', color: ctrl?.textColor ?? '#5a6a40' }}
                    >
                      {ctrl?.shortName ?? t.controller}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Round summary table */}
      <div className="card p-0 overflow-hidden">
        <div className="card-header px-4 pt-4 pb-3">📊 Runderesultat — Runde {round}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#0f1509] border-b border-[#2a3818]">
                <th className="px-3 py-2 text-left text-mil-muted uppercase tracking-wider font-normal">Nasjon</th>
                <th className="px-3 py-2 text-center text-mil-muted uppercase tracking-wider font-normal">💰 Inntekt</th>
                <th className="px-3 py-2 text-center text-mil-muted uppercase tracking-wider font-normal">🗺 Territorier</th>
                <th className="px-3 py-2 text-center text-mil-muted uppercase tracking-wider font-normal">🛒 Kjøpt</th>
                <th className="px-3 py-2 text-center text-mil-muted uppercase tracking-wider font-normal">📦 Enheter kjøpt</th>
                <th className="px-3 py-2 text-center text-mil-muted uppercase tracking-wider font-normal">⚰ Tap</th>
                <th className="px-3 py-2 text-center text-mil-muted uppercase tracking-wider font-normal">📊 Resultat</th>
              </tr>
            </thead>
            <tbody>
              {nations.filter(n => !n.isEliminated).map(n => (
                <RoundSummaryRow key={n.id} nation={n} territories={territories} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RoundSummaryRow({ nation, territories }: { nation: Nation; territories: Territory[] }) {
  const { recordCasualty, clearCasualties } = useGameStore();
  const [showForm, setShowForm] = useState(false);
  const [casUnit, setCasUnit] = useState('Infantry');
  const [casQty, setCasQty]   = useState(1);
  const [casCost, setCasCost] = useState(3);

  const ownedTerritories = territories.filter(t => t.controller === nation.id && t.type === 'land');
  const territoryIPC     = ownedTerritories.reduce((s, t) => s + t.ipc, 0);
  const objectivesIPC    = nation.objectives.reduce((s, o) => {
    if (!o.achieved) return s;
    if (o.perTerritoryIds && o.perTerritoryIds.length > 0) {
      const count = territories.filter(t => t.controller === nation.id && o.perTerritoryIds!.includes(t.id)).length;
      return s + o.ipcBonus * count;
    }
    return s + o.ipcBonus;
  }, 0);
  const income           = territoryIPC + objectivesIPC - (nation.convoyLoss ?? 0) + (nation.ipcAdjustment ?? 0);

  const purchasedIPC   = nation.purchasedThisTurn.reduce((s, p) => s + p.quantity * p.costEach, 0);
  const purchasedUnits = nation.purchasedThisTurn.reduce((s, p) => s + p.quantity, 0);

  const casualtiesIPC   = nation.casualtiesThisTurn.reduce((s, c) => s + c.quantity * c.costEach, 0);
  const casualtiesUnits = nation.casualtiesThisTurn.reduce((s, c) => s + c.quantity, 0);

  const result = income - purchasedIPC - casualtiesIPC;

  const addCasualty = () => {
    if (casQty > 0 && casCost >= 0) {
      recordCasualty(nation.id, { unitType: casUnit.trim() || 'Enhet', quantity: casQty, costEach: casCost });
      setShowForm(false);
      setCasQty(1);
    }
  };

  return (
    <>
      <tr className="border-b border-[#1e2a10] hover:bg-[#0f1509]/50">
        <td className="px-3 py-2">
          <div className="flex items-center gap-1.5">
            <NationIcon nation={nation} size="sm" />
            <span className="font-display text-xs uppercase tracking-wide" style={{ color: nation.textColor }}>
              {nation.shortName}
            </span>
            {!nation.isActive && (
              <span className="tag bg-[#1a2210] text-mil-muted text-xs">Nøytral</span>
            )}
          </div>
        </td>
        <td className="px-3 py-2 text-center">
          <span className="ipc-value text-sm">{income}</span>
          <span className="text-mil-muted text-xs ml-0.5">IPC</span>
        </td>
        <td className="px-3 py-2 text-center text-mil-text">
          {ownedTerritories.length}
          <span className="text-mil-muted ml-1">({territoryIPC})</span>
        </td>
        <td className="px-3 py-2 text-center">
          <span className="ipc-value">{purchasedIPC}</span>
          <span className="text-mil-muted ml-0.5">IPC</span>
        </td>
        <td className="px-3 py-2 text-center text-mil-text">{purchasedUnits}</td>
        <td className="px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-mil-text">{casualtiesUnits}</span>
            {casualtiesIPC > 0 && (
              <span className="text-red-400">({casualtiesIPC} IPC)</span>
            )}
            <button
              className="text-mil-muted hover:text-green-400 leading-none"
              title="Legg til tap"
              onClick={() => setShowForm(f => !f)}
            >＋</button>
            {casualtiesUnits > 0 && (
              <button
                className="text-mil-muted hover:text-red-400 leading-none"
                title="Nullstill tap"
                onClick={() => clearCasualties(nation.id)}
              >×</button>
            )}
          </div>
        </td>
        <td className="px-3 py-2 text-center">
          <span className={`text-sm font-bold ${result >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {result >= 0 ? '+' : ''}{result}
          </span>
        </td>
      </tr>
      {showForm && (
        <tr className="bg-[#080c05] border-b border-[#1e2a10]">
          <td colSpan={7} className="px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-mil-muted text-xs">⚰ Legg til tap:</span>
              <input
                className="w-24 bg-[#0b0f07] border border-[#2a3818] text-mil-text text-xs px-2 py-1 rounded-sm"
                placeholder="Enhetstype"
                value={casUnit}
                onChange={e => setCasUnit(e.target.value)}
              />
              <input
                type="number"
                min={1}
                className="w-14 bg-[#0b0f07] border border-[#2a3818] text-mil-text text-xs text-center px-1 py-1 rounded-sm"
                value={casQty}
                onChange={e => setCasQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <span className="text-mil-muted text-xs">á</span>
              <input
                type="number"
                min={0}
                className="w-14 bg-[#0b0f07] border border-[#2a3818] text-mil-text text-xs text-center px-1 py-1 rounded-sm"
                value={casCost}
                onChange={e => setCasCost(Math.max(0, parseInt(e.target.value) || 0))}
              />
              <span className="text-mil-muted text-xs">IPC</span>
              <button className="btn-secondary text-xs px-2 py-1" onClick={addCasualty}>Legg til</button>
              <button className="text-mil-muted hover:text-red-400 text-xs" onClick={() => setShowForm(false)}>Avbryt</button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
